/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Cell,
  CellDep,
  OutPoint,
  RawTransaction,
  Script,
  Transaction,
  Amount,
  AmountUnit,
  RPC as ToolKitRpc,
} from '@lay2/pw-core'
import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { CKB_NODE_URL } from '../../constants'

export const toolkitRPC = new ToolKitRpc(CKB_NODE_URL)

interface UnipassWitnessArgs {
  lock: string
  input_type: string
  output_type: string
}

// function getUnipassWitnessArgs(inputType: string): UnipassWitnessArgs {
//   return {
//     lock: '0x' + '0'.repeat(2082),
//     input_type: inputType,
//     output_type: '',
//   }
// }

export default async function rawTransactionToPWTransaction(
  rawTx: RPC.RawTransaction
): Promise<Transaction> {
  const [input]: any[] = rawTx.inputs
  const inputs = input.lock == null && input.type == null ? await Promise.all(
    rawTx.inputs.map(
      async (i) =>
        await Cell.loadFromBlockchain(
          toolkitRPC,
          new OutPoint(i.previous_output?.tx_hash!, i.previous_output?.index!)
        )
    )
  ) : rawTx.inputs.map(
    (o: any) =>
      new Cell(
        new Amount(o.capacity, AmountUnit.shannon),
        new Script(o.lock.code_hash, o.lock.args, o.lock.hash_type),
        o.type != null
          ? new Script(o.type.code_hash, o.type.args, o.type.hash_type)
          : undefined,
        new OutPoint(o.previous_output.tx_hash, o.previous_output.index)
      )
  )

  const outputs = rawTx.outputs.map(
    (o, index) =>
      new Cell(
        new Amount(o.capacity, AmountUnit.shannon),
        new Script(o.lock.code_hash, o.lock.args, o.lock.hash_type as any),
        o.type != null
          ? new Script(o.type.code_hash, o.type.args, o.type.hash_type as any)
          : undefined,
        undefined,
        rawTx.outputs_data[index]
      )
  )

  const cellDeps = rawTx.cell_deps.map(
    (c) =>
      new CellDep(
        c.dep_type as any,
        new OutPoint(c.out_point?.tx_hash!, c.out_point?.index!)
      )
  )

  // const arg = getUnipassWitnessArgs([0])
  const tx = new Transaction(
    new RawTransaction(
      inputs,
      outputs,
      cellDeps
      // rawTx.header_deps,
      // rawTx.version
    ),
    rawTx.witnesses
  )

  return tx
}
