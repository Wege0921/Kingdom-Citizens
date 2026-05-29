// WebRTC peer connection manager for live radio
// Host (broadcaster) creates one peer connection per listener
// Listener creates one peer connection to receive host's stream

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

export interface SignalSender {
  sendOffer: (targetUserId: string, signal: RTCSessionDescriptionInit) => void
  sendAnswer: (targetUserId: string, signal: RTCSessionDescriptionInit) => void
  sendIceCandidate: (targetUserId: string, candidate: RTCIceCandidateInit) => void
}

export class HostPeerManager {
  private peers = new Map<string, RTCPeerConnection>()
  private localStream: MediaStream

  constructor(
    localStream: MediaStream,
    private signaler: SignalSender
  ) {
    this.localStream = localStream
  }

  async addListener(listenerUserId: string) {
    if (this.peers.has(listenerUserId)) return

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    // Add local audio tracks to peer connection
    this.localStream.getTracks().forEach((track) => {
      pc.addTrack(track, this.localStream)
    })

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signaler.sendIceCandidate(listenerUserId, event.candidate.toJSON())
      }
    }

    pc.onconnectionstatechange = () => {
      console.log(`[Host] Peer ${listenerUserId} state:`, pc.connectionState)
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        this.removeListener(listenerUserId)
      }
    }

    this.peers.set(listenerUserId, pc)

    // Create offer and send to listener
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    this.signaler.sendOffer(listenerUserId, offer)
  }

  async handleAnswer(listenerUserId: string, signal: RTCSessionDescriptionInit) {
    const pc = this.peers.get(listenerUserId)
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(signal))
    }
  }

  async handleIceCandidate(listenerUserId: string, candidate: RTCIceCandidateInit) {
    const pc = this.peers.get(listenerUserId)
    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate))
      } catch (err) {
        console.error('[Host] Error adding ICE candidate:', err)
      }
    }
  }

  removeListener(listenerUserId: string) {
    const pc = this.peers.get(listenerUserId)
    if (pc) {
      pc.close()
      this.peers.delete(listenerUserId)
    }
  }

  closeAll() {
    this.peers.forEach((pc) => pc.close())
    this.peers.clear()
  }

  setMuted(muted: boolean) {
    this.localStream.getAudioTracks().forEach((track) => {
      track.enabled = !muted
    })
  }
}

export class ListenerPeerManager {
  private peer: RTCPeerConnection | null = null
  private remoteStream = new MediaStream()
  private hostUserId: string
  private signaler: SignalSender
  private onStreamCallback: ((stream: MediaStream) => void) | null = null

  constructor(hostUserId: string, signaler: SignalSender) {
    this.hostUserId = hostUserId
    this.signaler = signaler
  }

  onStream(callback: (stream: MediaStream) => void) {
    this.onStreamCallback = callback
  }

  async handleOffer(signal: RTCSessionDescriptionInit) {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({ iceServers: ICE_SERVERS })

      this.peer.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          this.remoteStream.addTrack(track)
        })
        if (this.onStreamCallback) {
          this.onStreamCallback(this.remoteStream)
        }
      }

      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          this.signaler.sendIceCandidate(this.hostUserId, event.candidate.toJSON())
        }
      }

      this.peer.onconnectionstatechange = () => {
        console.log('[Listener] Peer state:', this.peer?.connectionState)
      }
    }

    await this.peer.setRemoteDescription(new RTCSessionDescription(signal))
    const answer = await this.peer.createAnswer()
    await this.peer.setLocalDescription(answer)
    this.signaler.sendAnswer(this.hostUserId, answer)
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (this.peer) {
      try {
        await this.peer.addIceCandidate(new RTCIceCandidate(candidate))
      } catch (err) {
        console.error('[Listener] Error adding ICE candidate:', err)
      }
    }
  }

  close() {
    if (this.peer) {
      this.peer.close()
      this.peer = null
    }
  }

  getStream(): MediaStream {
    return this.remoteStream
  }
}
