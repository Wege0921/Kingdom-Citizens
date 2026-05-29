interface InstagramPost {
  image_url: string
  caption: string
}

export async function postToInstagram(userId: string, post: InstagramPost) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  
  if (!accessToken) {
    throw new Error('Instagram access token not configured')
  }

  // First, create a media container
  const containerUrl = `https://graph.facebook.com/v18.0/${userId}/media`
  
  const containerResponse = await fetch(containerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: post.image_url,
      caption: post.caption,
      access_token: accessToken,
    }),
  })

  if (!containerResponse.ok) {
    const error = await containerResponse.text()
    throw new Error(`Instagram container creation error: ${error}`)
  }

  const containerData = await containerResponse.json()
  const containerId = containerData.id

  // Then, publish the container
  const publishUrl = `https://graph.facebook.com/v18.0/${userId}/media_publish`
  
  const publishResponse = await fetch(publishUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      creation_id: containerId,
      access_token: accessToken,
    }),
  })

  if (!publishResponse.ok) {
    const error = await publishResponse.text()
    throw new Error(`Instagram publish error: ${error}`)
  }

  return publishResponse.json()
}

export async function postCarouselToInstagram(userId: string, imageUrls: string[], caption: string) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  
  if (!accessToken) {
    throw new Error('Instagram access token not configured')
  }

  // Create media containers for each image
  const containerIds = []
  for (const imageUrl of imageUrls) {
    const containerUrl = `https://graph.facebook.com/v18.0/${userId}/media`
    
    const containerResponse = await fetch(containerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        is_carousel_item: true,
        access_token: accessToken,
      }),
    })

    if (!containerResponse.ok) {
      const error = await containerResponse.text()
      throw new Error(`Instagram carousel item error: ${error}`)
    }

    const containerData = await containerResponse.json()
    containerIds.push(containerData.id)
  }

  // Create the carousel container
  const carouselUrl = `https://graph.facebook.com/v18.0/${userId}/media`
  
  const carouselResponse = await fetch(carouselUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      media_type: 'CAROUSEL',
      children: containerIds,
      caption,
      access_token: accessToken,
    }),
  })

  if (!carouselResponse.ok) {
    const error = await carouselResponse.text()
    throw new Error(`Instagram carousel creation error: ${error}`)
  }

  const carouselData = await carouselResponse.json()
  const carouselId = carouselData.id

  // Publish the carousel
  const publishUrl = `https://graph.facebook.com/v18.0/${userId}/media_publish`
  
  const publishResponse = await fetch(publishUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      creation_id: carouselId,
      access_token: accessToken,
    }),
  })

  if (!publishResponse.ok) {
    const error = await publishResponse.text()
    throw new Error(`Instagram carousel publish error: ${error}`)
  }

  return publishResponse.json()
}
