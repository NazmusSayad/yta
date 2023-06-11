import * as yargs from 'yargs'
import { ResolvedType } from './types/utils'

const inputs = yargs
  .version(false)

  .option('output', {
    alias: 'o',
    default: '.',
    type: 'string',
    describe: 'Where to save files?',
  })

  .option('type', {
    alias: 't',
    describe: 'Which format to download',
    choices: ['m4a', 'webm', '3gp', 'mp4'],
  })

  .option('quality', {
    alias: 'q',
    describe: 'Which quality to download',
    choices: [
      '144p',
      '240p',
      '360p',
      '480p',
      '720p',
      '720p60',
      '1080p',
      '1080p60',
      '1440p',
      '1440p60',
    ],
  })

  .option('help', {
    alias: 'h',
    description: 'Display help information',
  })

const argv = inputs.argv as ResolvedType<typeof inputs.argv>
export default argv
export const YTLinks = argv._.map((link) => {})
