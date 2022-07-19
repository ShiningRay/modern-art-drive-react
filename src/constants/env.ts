import { ChainID } from '@lay2/pw-core'
import dotenv from 'dotenv'

dotenv.config()

function envArg(tag: string, defaultValue: string): string {
  return process.env[tag] ?? defaultValue
}

export const SERVER_URL = envArg('REACT_APP_SERVER_URL', '/')

// ckb
export const CKB_NODE_URL = envArg(
  'REACT_APP_CKB_NODE_URL',
  'https://testnet.ckb.dev'
)
export const CKB_INDEXER_URL = envArg(
  'REACT_APP_CKB_INDEXER_URL',
  'https://testnet.ckb.dev/indexer'
)
export const CKB_CHAIN_ID = envArg(
  'REACT_APP_CKB_CHAIN_ID',
  ChainID.ckb_testnet.toString()
)
export const IS_MAINNET: boolean =
  CKB_CHAIN_ID !== ChainID.ckb_testnet.toString()
// unipass
export const UNIPASS_URL = envArg('REACT_APP_UNIPASS_URL', 'app.unipass.id')

export const ASSET_LOCK_CODE_HASH = envArg(
  'REACT_APP_ASSET_LOCK_CODE_HASH',
  '0xd01f5152c267b7f33b9795140c2467742e8424e49ebe2331caec197f7281b60a'
)

export const AGGREGATOR_URL = envArg(
  'REACT_APP_AGGREGATOR_URL',
  'https://aggregator.unipass.id/'
)
