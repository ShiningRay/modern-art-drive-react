import {
  Blake2bHasher,
  normalizers,
  Reader,
  transformers,
  SerializeRawTransaction,
  Script,
} from '@lay2/pw-core'
import rawTransactionToPWTransaction from './toPwTransaction'

export interface Message {
  index: number
  message: string
  lock: Script
}

function serializeBigInt(i: number): ArrayBuffer {
  const view = new DataView(new ArrayBuffer(8))
  view.setUint32(0, i, true)
  return view.buffer
}

export default class UnipassSigner {
  constructor(private readonly hasher = new Blake2bHasher()) {}

  public async toMessages(rawTx: any): Promise<Message[]> {
    const tx = await rawTransactionToPWTransaction(rawTx)

    const { raw, witnesses } = tx

    if (raw.inputs.length !== raw.inputCells.length) {
      throw new Error('Input number does not match!')
    }

    const txHash = new Blake2bHasher().hash(
      new Reader(
        SerializeRawTransaction(
          normalizers.NormalizeRawTransaction(
            transformers.TransformRawTransaction(raw)
          )
        )
      )
    )

    const messages = []
    const used = raw.inputs.map(() => false)
    for (let i = 0; i < raw.inputs.length; i++) {
      if (used[i]) {
        continue
      }
      if (i >= witnesses.length) {
        throw new Error(
          `Input ${i} starts a new script group, but witness is missing!`
        )
      }
      used[i] = true
      this.hasher.update(txHash as any)
      const firstWitness = new Reader(witnesses[i])
      this.hasher.update(serializeBigInt(firstWitness.length()))
      this.hasher.update(firstWitness as any)
      for (let j = i + 1; j < raw.inputs.length && j < witnesses.length; j++) {
        if (raw.inputCells[i].lock.sameWith(raw.inputCells[j].lock)) {
          used[j] = true
          const currentWitness = new Reader(witnesses[j])
          this.hasher.update(serializeBigInt(currentWitness.length()))
          this.hasher.update(currentWitness as any)
        }
      }
      messages.push({
        index: i,
        message: this.hasher.digest().serializeJson(), // hex string
        lock: raw.inputCells[i].lock,
      })

      this.hasher.reset()
    }
    return messages
  }
}
