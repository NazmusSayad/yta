import _ytdl = require('youtube-dl-exec')
const ytdl = _ytdl as any
import { YtInfo } from './types/ytdl'

export default async function (...links: string[]) {
  const promises = links.map((link) => {
    console.log('\n', 'Gettings video info:', link)

    return ytdl(link, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      allFormats: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    })
  })

  const responses = await Promise.all<YtInfo[]>(promises)
  return responses.map(({ formats, ...props }) => ({
    ...props,
    formats: formats.filter(({ ext }) => ext !== 'mhtml'),
  }))
}
