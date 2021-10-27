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

export interface useUnipassProps {
  address: string | null
  maskedAddress: string | null
  provider: Provider | null
  login: () => void
  parseLoginData: (data: unipassLoginData) => Promise<void>
}

export interface unipassLoginData {
  email: string
  pubkey: string
}

const CKBEnv = {
  NODE_URL: CKB_NODE_URL,
  INDEXER_URL: CKB_INDEXER_URL,
  CHAIN_ID: CKB_CHAIN_ID,
}

function useUnipass(): useUnipassProps {
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<Provider | null>(null)

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

  const parseLoginData = useCallback(async (data: unipassLoginData) => {
    PWCore.chainId = parseInt(CKBEnv.CHAIN_ID)
    await new PWCore(CKBEnv.NODE_URL).init(
      new UnipassProvider(data.email, data.pubkey),
      new IndexerCollector(CKBEnv.INDEXER_URL),
      parseInt(CKBEnv.CHAIN_ID)
    )
    setProvider(PWCore.provider)
    setAddress(PWCore.provider.address.addressString)
  }, [])

  return {
    address,
    maskedAddress,
    provider,
    login,
    parseLoginData,
  }
}

const Unipass = createContainer(useUnipass)

export default Unipass
