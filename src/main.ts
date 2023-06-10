import * as path from 'path'
import ytdl from './ytdl'
import { askRadioInput } from './prompt'
import { YtFormat, YtInfo } from './types/ytdl'
import { bytesToMb, checkYTLink, sanitizeFileName } from './utils'
import download from './download'
import argv from './argv'

async function handleSingleVideo(video: YtInfo) {
  const sortedFormats = [...video.formats].sort((a, b) =>
    a.ext.localeCompare(b.ext)
  )

  const filteredFormats = sortedFormats.filter((format) => {
    const type = argv.type ? format.ext === argv.type : true
    const quality = argv.quality ? format.format_note === argv.quality : true
    return type && quality
  })

  const radioOptions = filteredFormats.map((format) => {
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

  const format = await askRadioInput<YtFormat>(
    'Which format to download?',
    radioOptions
  )

  if (!format) return
  const filename = `${sanitizeFileName(video.title)}.${format.ext}`
  const outDir = path.resolve(argv.output)

  console.log(`\nDownloading: ${filename}`)
  await download(format.url, outDir, filename)
}

;(async () => {
  const link = argv._[0] as string
  // const link = 'https://www.youtube.com/watch?v=lpeuIu-ZYJY'

  if (!checkYTLink(link)) {
    return console.log('Please enter a valid youtube video.')
  }

  const [video] = await ytdl(link)
  handleSingleVideo(video)
})()
