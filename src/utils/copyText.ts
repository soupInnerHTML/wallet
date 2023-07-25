export async function copyText(text: string, name = 'text') {
  await navigator.clipboard.writeText(text);
  alert(`${name} copied successfully!`)
}
