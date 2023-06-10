export function bytesToMb(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(2)
}

export function sanitizeFileName(fileName: string, maxLength = 255) {
  // Remove invalid characters
  const sanitizedFileName = fileName.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '')

  // Trim whitespace
  const trimmedFileName = sanitizedFileName.trim()

  // Limit length
  const truncatedFileName = trimmedFileName.slice(0, maxLength)

  // Normalize Unicode characters
  const normalizedFileName = truncatedFileName.normalize('NFKD')

  return normalizedFileName
}

export function checkYTLink(link: string) {
  const youtubeWatchRegex =
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})$/

  return youtubeWatchRegex.test(link)
}
