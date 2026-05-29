'use client'

interface QueuedAction {
  id: string
  type: 'bookmark' | 'community_post' | 'community_delete'
  payload: Record<string, unknown>
  timestamp: number
  retries: number
}

const DB_NAME = 'kingdom-sync-queue'
const STORE_NAME = 'actions'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

export async function enqueueAction(action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  const queued: QueuedAction = {
    ...action,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
    retries: 0,
  }
  await new Promise<void>((resolve, reject) => {
    const req = store.add(queued)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
  db.close()
  return queued.id
}

export async function getQueuedActions(): Promise<QueuedAction[]> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const store = tx.objectStore(STORE_NAME)
  const actions = await new Promise<QueuedAction[]>((resolve, reject) => {
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result as QueuedAction[])
    req.onerror = () => reject(req.error)
  })
  db.close()
  return actions.sort((a, b) => a.timestamp - b.timestamp)
}

export async function removeQueuedAction(id: string) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  await new Promise<void>((resolve, reject) => {
    const req = store.delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
  db.close()
}

export async function clearQueue() {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  await new Promise<void>((resolve, reject) => {
    const req = store.clear()
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
  db.close()
}
