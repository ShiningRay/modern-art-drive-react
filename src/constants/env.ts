import { ChainID } from '@lay2/pw-core'

function envArg(tag: string, defaultValue: string): string {
  return process.env[tag] ?? defaultValue
}

export const SERVER_URL = envArg('REACT_APP_SERVER_URL', '/')

// ckb
export const CKB_NODE_URL = envArg('CKB_NODE_URL', 'https://testnet.ckb.dev')
export const CKB_INDEXER_URL = envArg(
  'CKB_INDEXER_URL',
  'https://testnet.ckb.dev/indexer'
)
export const CKB_CHAIN_ID = envArg(
  'CKB_CHAIN_ID',
  ChainID.ckb_testnet.toString()
)
// unipass
export const UNIPASS_URL = envArg('UNIPASS_URL', 'https://t.unipass.xyz')
