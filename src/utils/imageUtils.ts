// src/utils/imageUtils.ts
const BASE_URL = 'http://localhost:3333'
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x200?text=Sin+imagen'

export function getImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) return PLACEHOLDER_IMAGE
  return `${BASE_URL}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
}

export function onImageError(event: Event) {
  const target = event.target as HTMLImageElement
  if (target) target.src = PLACEHOLDER_IMAGE
}
