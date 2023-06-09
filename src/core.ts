import * as path from 'path'
import ytdl from './ytdl'
import { askRadioInput } from './prompt'
import { YtFormat, YtInfo } from './types/ytdl'
import { bytesToMb, sanitizeFileName } from './utils'
import download from './download'

const link = 'https://www.youtube.com/watch?v=lpeuIu-ZYJY'

async function handleSingleVideo(video: YtInfo) {
  video.formats.sort((a, b) => a.ext.localeCompare(b.ext))

  const format = await askRadioInput<YtFormat>(
    'Which format to download?',
    video.formats.map((format) => {
      const hasAudio = format.acodec !== 'none'
      const hasVideo = format.vcodec !== 'none'

      const quality = format.format_note
      const status = !hasAudio ? '🎥' : !hasVideo ? '🔊' : '🎥🔊'
      const size = `${bytesToMb(format.filesize)}MB`

      const abr = hasAudio && format.abr && Math.round(format.abr) + 'abr'
      const vbr = hasVideo && format.vbr && Math.round(format.vbr) + 'vbr'
      const fps = hasVideo && format.fps && Math.round(format.fps) + 'fps'

      const info = [quality, fps, abr, vbr, size].filter(Boolean).join(', ')

      return {
        title: `${format.ext} (${status})`,
        description: info,
        value: format,
      }
    })
  )

  if (!format) return
  const filename = `${sanitizeFileName(video.title)}.${format.ext}`
  const outDir = path.resolve(`./dist/`)

  console.log(`\nDownloading: ${filename}`)
  await download(format.url, outDir, filename)
}

;(async () => {
  const [video] = await ytdl(link)
  handleSingleVideo(video)
})()
