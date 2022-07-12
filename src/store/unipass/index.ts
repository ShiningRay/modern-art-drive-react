import { useCallback, useEffect, useMemo, useState } from 'react'
import { createContainer } from 'unstated-next'
import {
  UNIPASS_URL,
  CKB_NODE_URL,
  CKB_INDEXER_URL,
  CKB_CHAIN_ID,
  ASSET_LOCK_CODE_HASH,
  AGGREGATOR_URL,
} from '../../constants'
import UnipassProvider from './UnipassProvider'
import UnipassSigner from './UnipassSigner'
import { addWitnessArgType } from './toPwTransaction'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import UP, { UPAuthMessage, UPAuthResponse } from 'up-core-test'
import PWCore, {
  Address,
  IndexerCollector,
  Provider,
  Transaction,
  OutPoint,
  Builder,
  Amount,
  AmountUnit,
  DefaultSigner,
  CellDep,
} from '@lay2/pw-core'
import UPCKB, {
  fetchAssetLockProof,
  completeTxWithProof,
} from '../../assets/lib/up-ckb'
import { UPCoreSimpleProvier } from '../../assets/lib/up-core-simple-provider'

export function toHex(str: string): string {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16)
  }
  return result
}

function parseSuccessUrlArgs(argsStr: string): any {
  return JSON.parse(
    decodeURIComponent(escape(atob(decodeURIComponent(argsStr))))
  )
}

export function parseSuccessUrl(param: string): {
  action: string
  args: any
} {
  const p = param.split('_')
  return {
    action: p[0],
    args: parseSuccessUrlArgs(p[1]),
  }
}

export interface useUnipassProps {
  address: string | null
  maskedAddress: string | null
  provider: Provider | null
  login: () => void
  sign: (message: string) => Promise<UPAuthResponse>
  signUnipass: (tx: Transaction) => Promise<Transaction>
  signout: () => void
  signTx: (raw: any) => Promise<any>
}

export interface unipassLoginData {
  email: string
  pubkey: string
}

export interface unipassSignData {
  keyType: string
  pubkey: string
  sig: string
}

const CKBEnv = {
  NODE_URL: CKB_NODE_URL,
  INDEXER_URL: CKB_INDEXER_URL,
  CHAIN_ID: CKB_CHAIN_ID,
}

function useUnipass(): useUnipassProps {
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [limitTime, setLimitTime] = useLocalStorage<string>('mad_limit', '0')
  const [username, setUsername] = useLocalStorage<string>('mad_username', '')
  const [pubkey, setPubkey] = useLocalStorage<string>('mad_pubkey', '')
  const [email, setEmail] = useLocalStorage<string>('mad_email', '')

  const maskedAddress = useMemo((): string | null => {
    if (address === null) return null
    return `${address.slice(0, 5)}...${address.slice(-3)}`
  }, [address])

  const login = useCallback(async () => {
    console.log('env', process.env)

    UP.config({
      domain: UNIPASS_URL,
      // domain: 'localhost:3000',
      // protocol: 'http',
    })
    PWCore.setChainId(Number(CKB_CHAIN_ID))
    UPCKB.config({
      upSnapshotUrl: `${AGGREGATOR_URL}/snapshot/`,
      chainID: Number(CKB_CHAIN_ID),
      ckbIndexerUrl: CKB_INDEXER_URL,
      ckbNodeUrl: CKB_NODE_URL,
      upLockCodeHash: ASSET_LOCK_CODE_HASH,
    })

    console.log('connect clicked')
    try {
      const account = await UP.connect({ email: false, evmKeys: true })
      setUsername(account.username)
      console.log('account', account)
      const _address: Address = UPCKB.getCKBAddress(account.username)
      const myAddress = _address.toCKBAddress()
      setAddress(myAddress)

      const indexerCollector = new IndexerCollector(CKB_INDEXER_URL)
      const balance = await indexerCollector.getBalance(_address)
      console.log('balance', balance)
      // this.myBalance = balance.toString()
    } catch (err) {
      // this.$message.error(err as string)
      console.log('connect err', err)
    }
  }, [])

  const signout = useCallback(() => {
    setAddress(null)
    setProvider(null)
    setLimitTime('0')
    setPubkey('')
  }, [setAddress, setProvider, setLimitTime, setPubkey])

  const updateUserInfo = useCallback(
    async (email: string, pubkey: string) => {
      if (!email || !pubkey) return
      PWCore.chainId = parseInt(CKBEnv.CHAIN_ID)
      await new PWCore(CKBEnv.NODE_URL).init(
        new UnipassProvider(email, pubkey),
        new IndexerCollector(CKBEnv.INDEXER_URL),
        parseInt(CKBEnv.CHAIN_ID)
      )
      setEmail(email)
      setPubkey(pubkey)
      setProvider(PWCore.provider)
      setAddress(PWCore.provider.address.addressString)
    },
    [setEmail, setPubkey, setProvider, setAddress]
  )

  const signUnipass = useCallback(async (tx: Transaction) => {
    const witnessArg = addWitnessArgType(
      {
        ...Builder.WITNESS_ARGS.RawSecp256k1,
      },
      tx.witnesses[0]
    )

    tx = new Transaction(tx.raw, [witnessArg])
    const account = await UP.connect()
    const oldCellDeps = tx.raw.cellDeps.map(
      (cd) =>
        new CellDep(
          cd.depType,
          new OutPoint(cd.outPoint.txHash, cd.outPoint.index)
        )
    )
    const { outputs } = tx.raw
    const changeOutput = outputs[outputs.length - 1]
    changeOutput.capacity = changeOutput.capacity.sub(
      new Amount('16000', AmountUnit.shannon)
    )
    tx.raw.cellDeps = []
    const provider = new UPCoreSimpleProvier(
      account.username,
      ASSET_LOCK_CODE_HASH
    )
    const { usernameHash } = provider
    const signer = new DefaultSigner(provider)
    const signedTx = await signer.sign(tx)
    signedTx.raw.cellDeps = oldCellDeps
    const assetLockProof = await fetchAssetLockProof(usernameHash)
    const completedSignedTx = completeTxWithProof(
      signedTx,
      assetLockProof,
      usernameHash
    )

    return completedSignedTx
  }, [])

  const sign = useCallback(
    async (message: string) => {
      console.log('sign clicked')
      console.log({
        username,
        message: message,
      })
      return await UP.authorize(new UPAuthMessage('CKB_TX', username, message))
    },
    [username]
  )

  const signTx = useCallback(async (raw: any) => {
    const signer = new UnipassSigner()
    const [signedTx] = await signer.toMessages(raw)
    return signedTx.message as any
  }, [])

  useEffect((): void => {
    // 尝试登录
    if (new Date(parseInt(limitTime)) > new Date()) {
      updateUserInfo(email, pubkey).catch((e) => console.log(e))
    }
  }, [])

  return {
    address,
    maskedAddress,
    provider,
    login,
    signUnipass,
    sign,
    signout,
    signTx,
  }
}

const Unipass = createContainer(useUnipass)

export default Unipass
