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
    choices: ['m4a', 'webm', '3gp', 'mp4'],
    describe: 'Which format to download',
  })

  .option('quality', {
    alias: 'q',
    choices: ['144p', '240p', '360p', '480p', '720p', '1080p'],
    describe: 'Which quality to download',
  })

  .option('help', {
    alias: 'h',
    description: 'Display help information',
  })

export default inputs.argv as ResolvedType<typeof inputs.argv>
