import { useCallback, useMemo, useState } from 'react'
import { createContainer } from 'unstated-next'
import {
  UNIPASS_URL,
  CKB_NODE_URL,
  CKB_INDEXER_URL,
  CKB_CHAIN_ID,
} from '../../constants'
import PWCore, { IndexerCollector, Provider } from '@lay2/pw-core'
import UnipassProvider from './UnipassProvider'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { createHash } from 'crypto'

function generateUnipassNewUrl(
  host: string,
  action: string,
  params: { [key: string]: string }
): string {
  const urlObj = new URL(`${host}/${action.toLowerCase()}`)
  for (const key of Object.keys(params)) {
    urlObj.searchParams.set(key, params[key])
  }
  return urlObj.href
}
export interface useUnipassProps {
  address: string | null
  maskedAddress: string | null
  provider: Provider | null
  login: () => void
  parseLoginData: (data: unipassLoginData) => Promise<void>
  sign: (message: string) => Promise<void>
}

export interface unipassLoginData {
  email?: string
  pubkey: string
  sig?: string
}

const CKBEnv = {
  NODE_URL: CKB_NODE_URL,
  INDEXER_URL: CKB_INDEXER_URL,
  CHAIN_ID: CKB_CHAIN_ID,
}

function useUnipass(): useUnipassProps {
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [pubkey, setPubkey] = useState('')
  const [email, setEmail] = useLocalStorage<string>('mad_email', '')

  const maskedAddress = useMemo((): string | null => {
    if (address === null) return null
    return `${address.slice(0, 5)}...${address.slice(-3)}`
  }, [address])

  const login = useCallback(() => {
    const successUrl = encodeURIComponent(
      `${window.location.origin}/login_redirect`
    )
    const url = `${UNIPASS_URL}/login?success_url=${successUrl}`
    window.location.replace(url)
  }, [])

  const parseLoginData = useCallback(
    async (data: unipassLoginData) => {
      if (data.email) {
        PWCore.chainId = parseInt(CKBEnv.CHAIN_ID)
        await new PWCore(CKBEnv.NODE_URL).init(
          new UnipassProvider(data.email, data.pubkey),
          new IndexerCollector(CKBEnv.INDEXER_URL),
          parseInt(CKBEnv.CHAIN_ID)
        )
        setEmail(data.email)
        setPubkey(data.pubkey)
        setProvider(PWCore.provider)
        setAddress(PWCore.provider.address.addressString)
      } else if (data.sig) {
        PWCore.chainId = parseInt(CKBEnv.CHAIN_ID)
        await new PWCore(CKBEnv.NODE_URL).init(
          new UnipassProvider(email, data.pubkey),
          new IndexerCollector(CKBEnv.INDEXER_URL),
          parseInt(CKBEnv.CHAIN_ID)
        )
        setEmail(email)
        setPubkey(data.pubkey)
        setProvider(PWCore.provider)
        setAddress(PWCore.provider.address.addressString)
        alert(`测试签名：TEST
结果：
${data.sig}
`)
      }
    },
    [setPubkey, setEmail, email]
  )

  const sign = useCallback(
    async (message: string) => {
      if (!pubkey) return
      const messageHash = createHash('SHA256')
        .update(message || '0x')
        .digest('hex')
        .toString()
      const successUrl = `${window.location.origin}/login_redirect`
      const url = generateUnipassNewUrl(UNIPASS_URL, 'sign', {
        success_url: successUrl,
        pubkey,
        message: messageHash,
      })
      window.location.replace(url)
    },
    [pubkey]
  )

  return {
    address,
    maskedAddress,
    provider,
    login,
    parseLoginData,
    sign,
  }
}

const Unipass = createContainer(useUnipass)

export default Unipass
