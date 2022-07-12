import { ChainID } from '@lay2/pw-core';
export declare class UPCKBConfig {
    upSnapshotUrl: string;
    ckbNodeUrl: string;
    ckbIndexerUrl: string;
    chainID: ChainID;
    upLockCodeHash: string;
    constructor(upSnapshotUrl: string, // UniPass Snapshot server url
    ckbNodeUrl: string, // CKB node url
    ckbIndexerUrl: string, // CKB indexer url
    chainID: ChainID, // CKB Chain ID
    upLockCodeHash: string);
}
export declare type UPCKBConfigOption = {
    readonly upSnapshotUrl?: string;
    readonly chainID?: ChainID;
    readonly ckbNodeUrl?: string;
    readonly [key: string]: any;
};
/**
 * set configuration for UPCKB
 * @param options UniPass CKB Config Options
 */
export declare function config(options?: UPCKBConfigOption): void;
export declare function getConfig(): UPCKBConfig;
