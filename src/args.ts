import yargs = require('yargs')

// Define your command-line interface using yargs
const inputs = yargs

  .option('output', {
    alias: 'o',
    type: 'string',
    describe: 'Where to save files?',
  })

  .option('type', {
    alias: 't',
    default: 'mp4',
    choices: ['m4a', 'webm', '3gp', 'mp4'],
    describe: 'Which format to download',
  })

const args = inputs.argv

export default args
