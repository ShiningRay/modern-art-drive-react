import { useEffect, useState } from 'react'

export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number
): (...args: Params) => NodeJS.Timeout {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
    return timer
  }
}

export function label2key(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-bA-b0-9 ]/gi, '')
    .replace(/ +/gi, '_')
}

export function useDetectMobile(): [boolean] {
  const [isMobile, setMobile] = useState(window.innerWidth <= 600)
  useEffect(() => {
    window.addEventListener(
      'resize',
      () => {
        setMobile(window.innerWidth <= 600)
      },
      false
    )
  }, [])
  return [isMobile]
}
