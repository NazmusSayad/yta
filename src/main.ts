import ytdl from './ytdl'
import * as color from 'ansi-colors'
import { youtubeVideoRegex } from './utils'
import singleMode from './singleMode'
import argv from './argv'
import multiMode from './multiMode'
;(async () => {
  // const links = ['OCPDUgk9IP0']
  // const links = ['OCPDUgk9IP0', '6iF7tPC6XtE']
  const links = argv._ as string[]

  if (links.length === 0) {
    return console.log('Please enter a youtube video link or id.')
  }

  for (let link of links) {
    if (!youtubeVideoRegex.test(link)) {
      return console.log(color.red(link + " - Isn't a valid link"))
    }
  }

  const videos = await ytdl(...links)
  videos.length === 1 ? singleMode(videos[0]) : multiMode(videos)
})()
