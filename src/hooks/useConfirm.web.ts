const confirm = async (title: string, message?: string) => new Promise<boolean>((resolve) => {
  resolve(window.confirm([title, message].filter(Boolean).join('\n')))
})

export default function useConfirm() {
  return confirm
}
