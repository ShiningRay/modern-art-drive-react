import { Address, Amount, Transaction } from '@lay2/pw-core';
import { config } from './config';
import { UPCKBBaseProvider } from './providers';
/**
 * get UniPass user's CKB asset address
 *
 * @param username UniPass username
 * @returns user's CKB asset address
 */
declare function getCKBAddress(username: string): Address;
/**
 * send CKB to a specified address using UPCKBBaseProvider
 *
 * @param to the destination CKB address
 * @param amount the amount of CKB to be sent
 * @param provider the PWCore Provider used to sign transaction
 * @returns the transaction hash
 */
declare function sendCKB(to: Address, amount: Amount, provider: UPCKBBaseProvider): Promise<string>;
/**
 * sign and send a CKB transaction with UPCKBBaseProvider
 * @param tx
 * @param provider
 * @returns
 */
declare function sendTransaction(tx: Transaction, provider: UPCKBBaseProvider): Promise<string>;
export * from './up-lock-proof';
export * from './providers';
declare const functions: {
    config: typeof config;
    getCKBAddress: typeof getCKBAddress;
    sendCKB: typeof sendCKB;
    sendTransaction: typeof sendTransaction;
};
export default functions;
