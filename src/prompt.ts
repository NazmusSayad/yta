import { Choice } from 'prompts'
import prompts = require('prompts')

export async function getUserInput() {
  const response = await prompts({
    type: 'autocomplete',
    name: 'name',
    choices: [
      { title: 'aksjfkasdf' },
      { title: 'aksjfkasdf', description: 'hello' },
    ],
    message: 'What is your name?',
  })

  console.log(`Hello, ${response.name}!`)
}

export async function askRadioInput<T>(title: string, options: Choice[]) {
  const result = await prompts({
    name: 'name',
    type: 'autocomplete',
    message: title,
    choices: options,
  })

  return result.name as T
}
