interface FacebookPost {
  message: string
  link?: string
  access_token: string
}

export async function postToFacebook(pageId: string, post: FacebookPost) {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || post.access_token
  
  if (!accessToken) {
    throw new Error('Facebook access token not configured')
  }

  const url = `https://graph.facebook.com/v18.0/${pageId}/feed`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: post.message,
      link: post.link,
      access_token: accessToken,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Facebook API error: ${error}`)
  }

  return response.json()
}

export async function postImageToFacebook(pageId: string, imageUrl: string, caption: string, accessToken: string) {
  const url = `https://graph.facebook.com/v18.0/${pageId}/photos`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: imageUrl,
      caption,
      access_token: accessToken,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Facebook API error: ${error}`)
  }

  return response.json()
}
