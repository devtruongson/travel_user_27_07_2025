export function getFullImageUrl(path: string) {
  return path.startsWith('https') ? path : `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${path}`;
}
