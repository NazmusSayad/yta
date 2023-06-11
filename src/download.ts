import download = require('download')
import ProgressBar = require('progress')
import { sanitizeFileName } from './utils'

export default async function downloadWithProgressBar(
  url: string,
  { title, ext, dir }: { title: string; ext: string; dir: string }
) {
  let startTime = Date.now()
  const progressBar = new ProgressBar(':percent [:bar] :speed, :etas', {
    total: 100,
    width: 30,
    complete: '=',
    incomplete: ' ',
    renderOpts: {
      width: 30,
      callback: (_: any, dir: any) => process.stdout.clearLine(dir),
    },
  } as any)

  const filename = `${sanitizeFileName(title)}.${ext}`
  console.log(`\nDownloading: ${filename}`)

  await download(url, dir, { filename })
    .on('response', (res: any) => {
      const totalSize = parseInt(res.headers['content-length'], 10)
      progressBar.total = totalSize
    })
    .on('data', (data: Buffer) => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime

      progressBar.tick(data.length)

      const downloadedSize = progressBar.curr
      const speed = calculateSpeed(downloadedSize, elapsedTime)

      progressBar.render({ speed })
    })
}

function calculateSpeed(downloadedSize: number, elapsedTime: number) {
  const speedInBytesPerSecond = downloadedSize / (elapsedTime / 1000)
  const speedInMBPerSecond = speedInBytesPerSecond / (1024 * 1024)
  return `${speedInMBPerSecond.toFixed(2)} MB/s`
}
