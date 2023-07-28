import {notification} from "./notification";

export function copyText(text: string, name = 'Text') {
  setTimeout(() => {
    navigator.clipboard.writeText(text).then(() => {
      notification.success({message: `${name} copied`})
    })
  })
}

export const copyAddress = (address: string) => copyText(address, 'Address')
