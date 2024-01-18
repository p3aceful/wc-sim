export const debounce = <TArgs extends [], TFunc extends (...args: TArgs[]) => void>(
  fn: TFunc,
  delay: number
) => {
  let debounceTimer: number
  return (...args: TArgs) => {
    clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => fn(...args), delay)
  }
}
