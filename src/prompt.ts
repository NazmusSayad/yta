import { Choice } from 'prompts'
import prompts = require('prompts')

export async function askRadioInput<T>(title: string, options: Choice[]) {
  const result = await prompts({
    name: 'name',
    type: 'autocomplete',
    message: title,
    choices: options,
  })

  return result.name as T
}
