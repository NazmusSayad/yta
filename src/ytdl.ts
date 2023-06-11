import _ytdl = require('youtube-dl-exec')
const ytdl = _ytdl as any
import { YtInfo } from './types/ytdl'
import * as color from 'ansi-colors'

export default async function (...links: string[]) {
  const promises = links.map((link) => {
    console.log('Gettings video info:', color.cyan(link))

    return ytdl(link, {
      noWarnings: true,
      allFormats: true,
      dumpSingleJson: true,
      preferFreeFormats: true,
      noCheckCertificates: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    })
  })

  const responses = await Promise.all<YtInfo[]>(promises)
  return responses.filter(Boolean).map(({ formats, ...props }) => ({
    ...props,
    formats: formats.filter(({ ext }) => ext !== 'mhtml'),
  }))
}
