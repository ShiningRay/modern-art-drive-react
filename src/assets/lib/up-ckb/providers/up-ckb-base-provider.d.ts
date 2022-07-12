import { Hasher, HashType, Provider } from '@lay2/pw-core';
import { UPAuthResponse } from 'up-core-test';
export declare class UPCKBBaseProvider extends Provider {
    readonly username: string;
    readonly assetLockCodeHash: string;
    readonly hashType: HashType;
    readonly usernameHash: string;
    hasher(): Hasher;
    constructor(username: string, assetLockCodeHash: string, hashType?: HashType);
    init(): Promise<Provider>;
    /**
     * call UniPass authorize a CKB transaction
     *
     * @param _message message to be signed
     * @returns UniPass Authorize Response
     */
    authorize(_message: string): Promise<UPAuthResponse>;
    sign(message: string): Promise<string>;
    close(): Promise<void>;
}
