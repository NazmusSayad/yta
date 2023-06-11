import * as path from 'path'
import * as color from 'ansi-colors'
import { askRadioInput } from './prompt'
import { YtFormat, YtInfo } from './types/ytdl'
import download from './download'
import argv from './argv'
import { filterFormats, formatsToRadioOptions, sortFormats } from './utils'

export default async function (video: YtInfo) {
  const sortedFormats = sortFormats(video.formats)
  const filteredFormats = filterFormats(sortedFormats, {
    type: argv.type,
    quality: argv.quality,
  })

  console.log(color.magentaBright(video.title))
  const format = await askRadioInput<YtFormat>(
    'Which format to download?',
    formatsToRadioOptions(filteredFormats)
  )

  if (!format) return

  await download(format.url, {
    dir: path.resolve(argv.output),
    title: video.title,
    ext: format.ext,
  })
}
