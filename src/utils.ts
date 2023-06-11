import { YtFormat } from './types/ytdl'

export const youtubeVideoRegex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|channel\/[\w\d]{1,}|c\/|user\/\S+)|youtu\.be\/|y2u\.be\/|watch\?v=)?([a-zA-Z0-9_-]{11})$/i

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

export function sortFormats(formats: YtFormat[]) {
  return [...formats].sort((a, b) => a.ext.localeCompare(b.ext))
}

export function filterFormats(
  formats: YtFormat[],
  conf: { type?: string; quality?: string }
) {
  return formats.filter((format) => {
    const type = conf.type ? format.ext === conf.type : true
    const quality = conf.quality ? format.format_note === conf.quality : true
    return type && quality
  })
}

export function formatsToRadioOptions(formats: YtFormat[]) {
  return formats.map((format) => {
    const hasAudio = format.acodec !== 'none'
    const hasVideo = format.vcodec !== 'none'

    const status = !hasAudio ? '🎥' : !hasVideo ? '🔊' : '🎥🔊'
    const size = `${bytesToMb(format.filesize)}MB`

    const abr = hasAudio && format.abr && Math.round(format.abr) + 'abr'
    const vbr = hasVideo && format.vbr && Math.round(format.vbr) + 'vbr'
    const fps = hasVideo && format.fps && Math.round(format.fps) + 'fps'

    const info = [fps, abr, vbr, size].filter(Boolean).join(', ')

    return {
      title: `${format.ext} - ${format.format_note} (${status})`,
      description: info,
      value: format,
    }
  })
}

export function removeDuplicateFormats(formats: YtFormat[]) {
  const uniqueFormats = []
  const formatMap = new Map()

  for (const format of formats) {
    const key = format.format_id
    if (!formatMap.has(key)) {
      formatMap.set(key, true)
      uniqueFormats.push(format)
    }
  }

  return uniqueFormats
}
