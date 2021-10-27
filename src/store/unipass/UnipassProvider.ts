import {
  Address,
  AddressType,
  Blake2bHasher,
  HashType,
  Platform,
  Provider,
  Script,
} from '@lay2/pw-core'

type UP_ACT =
  | 'UP-READY'
  | 'UP-LOGIN'
  | 'UP-SIGN'
  | 'UP-CLOSE'
  | 'UP-BIND'
  | 'UP-RECOVERY'

export interface UnipassAccount {
  pubkey: string
  email: string
  recovery?: boolean
}
export interface UnipassSign {
  pubkey: string
  sign: string
}
export interface UnipassMessage {
  upact: UP_ACT
  payload?: string | UnipassAccount | UnipassSign
}

export default class UnipassProvider extends Provider {
  private readonly _email: string | undefined
  private readonly _recovery: boolean | undefined
  // eslint-disable-next-line prettier/prettier
  private readonly msgHandler: ((this: Window, event: MessageEvent) => unknown) | undefined

  get email(): string | undefined {
    return this._email
  }

  get recovery(): boolean | undefined {
    return this._recovery
  }

  constructor(email: string, masterPubkey: string) {
    super(Platform.ckb)
    this._email = email

    const addressStr = pubkeyToAddress(masterPubkey)
    this.address = new Address(addressStr, AddressType.ckb)
    // console.log('this.address----', this.address)
  }

  async init(): Promise<UnipassProvider> {
    return await new Promise((resolve) => {
      resolve(this)
    })
  }

  async recover(): Promise<UnipassProvider> {
    console.log('[UnipassProvider] to recover')
    return await new Promise((resolve) => resolve(this))
  }

  async sign(message: string): Promise<string> {
    console.log('[UnipassProvider] message to sign', message)
    return await new Promise((resolve) => resolve(''))
  }

  close(): void {
    this.msgHandler && window.removeEventListener('message', this.msgHandler)
  }
}

export function pubkeyToAddress(pubkey: string): string {
  const pubKeyBuffer = Buffer.from(pubkey.replace('0x', ''), 'hex')

  // console.log('pubKeyBuffer', new Uint8Array(pubKeyBuffer))
  const hashHex = new Blake2bHasher()
    .update(pubKeyBuffer.buffer)
    .digest()
    .serializeJson()
    .slice(0, 42)
  // console.log('------hashHex', hashHex)
  const isLina = localStorage.getItem('lina')
  let script: Script
  if (isLina) {
    script = new Script(
      '0x614d40a86e1b29a8f4d8d93b9f3b390bf740803fa19a69f1c95716e029ea09b3',
      hashHex,
      HashType.type
    )
  } else {
    script = new Script(
      '0x124a60cd799e1fbca664196de46b3f7f0ecb7138133dcaea4893c51df5b02be6',
      hashHex,
      HashType.type
    )
  }

  // console.log('script', script)
  return script.toAddress().toCKBAddress()
}
