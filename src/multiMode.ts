import argv from './argv'
import * as color from 'ansi-colors'
import * as path from 'path'
import { askRadioInput } from './prompt'
import { YtFormat, YtInfo } from './types/ytdl'
import {
  filterFormats,
  formatsToRadioOptions,
  removeDuplicateFormats,
  sortFormats,
} from './utils'
import downloadWithProgressBar from './download'

export default async function (videos: YtInfo[]) {
  const formats: YtFormat[] = []
  videos.forEach(({ formats: fs }) => {
    fs.forEach((format) => {
      formats.push(format)
    })
  })

  const uniqueFormats = removeDuplicateFormats(formats)
  const sortedFormats = sortFormats(uniqueFormats)
  const filteredFormats = filterFormats(sortedFormats, {
    type: argv.type,
    quality: argv.quality,
  })

  const format = await askRadioInput<YtFormat>(
    'Which format to download?',
    formatsToRadioOptions(filteredFormats)
  )

  if (!format) return
  const readyToDownload: { title: string; ext: string; url: string }[] = []

  for (let video of videos) {
    let matched = video.formats.find(
      ({ format_id }) => format_id === format.format_id
    )

    if (!matched) {
      console.log(
        color.red(
          `[${format.ext}, ${format.format_note}] isn't available for:\n${video.title}`
        )
      )

      const sortedFormats = sortFormats(video.formats)
      const newFormat = await askRadioInput<YtFormat>(
        'Please select one to download?',
        formatsToRadioOptions(sortedFormats)
      )

      if (!newFormat) return
      matched = newFormat
    }

    readyToDownload.push({
      title: video.title,
      ext: matched.ext,
      url: matched.url,
    })
  }

  for (let { title, url, ext } of readyToDownload) {
    await downloadWithProgressBar(url, {
      dir: path.resolve(argv.output),
      title: title,
      ext: ext,
    })
  }
  console.log(readyToDownload)
}
