import { CellDep, RPC, Transaction } from '@lay2/pw-core';
export declare type LockInfo = {
    readonly userInfo: string;
    readonly username: string;
};
export declare type AssetLockProof = {
    readonly cellDeps: readonly CellDep[];
    readonly lockInfo: readonly LockInfo[];
    readonly userInfoSmtProof: string;
};
/**
 * fetch UniPass smt proof/cell deps/user info from UniPass snapshot server
 *
 * @param usernameHash UniPass username sha256 hash
 * @returns formated AssetLockProof
 */
export declare function fetchAssetLockProof(usernameHash: string): Promise<AssetLockProof>;
/**
 * complete transaction with UniPass smt proof
 *
 * @param signedTx signed transaction
 * @param assetLockProof UniPass smt proof from UniPass snapshot server url
 * @param usernameHash UniPass username sha256 hash
 * @returns
 */
export declare function completeTxWithProof(signedTx: Transaction, assetLockProof: AssetLockProof, usernameHash: string): Transaction;
/**
 * complete transaction with cell deps and witness including smt proof
 * and send transaction to ckb chain
 *
 * @param usernameHash UniPass username sha256 hash
 * @param signedTx signed CKB transaction
 * @param rpc
 * @returns CKB transaction hash
 */
export declare function sendUPLockTransaction(usernameHash: string, signedTx: Transaction, rpc: RPC): Promise<any>;
