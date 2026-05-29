interface TwitterPost {
  text: string
  media?: {
    media_ids: string[]
  }
}

export async function postToTwitter(post: TwitterPost) {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN
  
  if (!bearerToken) {
    throw new Error('Twitter bearer token not configured')
  }

  const url = 'https://api.twitter.com/2/tweets'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twitter API error: ${error}`)
  }

  return response.json()
}

export async function uploadTwitterMedia(imageUrl: string) {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN
  
  if (!bearerToken) {
    throw new Error('Twitter bearer token not configured')
  }

  // First, download the image
  const imageResponse = await fetch(imageUrl)
  const imageBuffer = await imageResponse.arrayBuffer()

  const url = 'https://upload.twitter.com/1.1/media/upload.json'

  const formData = new FormData()
  formData.append('media', new Blob([imageBuffer]), 'image.jpg')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twitter media upload error: ${error}`)
  }

  const data = await response.json()
  return data.media_id_string
}
