"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUPLockTransaction = exports.completeTxWithProof = exports.fetchAssetLockProof = void 0;
const pw_core_1 = require("@lay2/pw-core");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const LumosCore = __importStar(require("./js-scripts/lumos-core"));
const UPLockWitness = __importStar(require("./js-scripts/up-lock-witness"));
/**
 * fetch UniPass smt proof/cell deps/user info from UniPass snapshot server
 *
 * @param usernameHash UniPass username sha256 hash
 * @returns formated AssetLockProof
 */
async function fetchAssetLockProof(usernameHash) {
    const data = await axios_1.default.post((0, config_1.getConfig)().upSnapshotUrl, {
        jsonrpc: '2.0',
        method: 'get_asset_lock_tx_info',
        params: [usernameHash],
        id: '1',
    });
    // convert data to AssetLockProf
    const { cell_deps, lock_info, user_info_smt_proof } = data.data.result;
    const cellDeps = [];
    for (const { dep_type, out_point: { tx_hash, index }, } of cell_deps) {
        const depType = dep_type === pw_core_1.DepType.code ? pw_core_1.DepType.code : pw_core_1.DepType.depGroup;
        cellDeps.push(new pw_core_1.CellDep(depType, new pw_core_1.OutPoint(tx_hash, index)));
    }
    const lockInfo = [];
    for (const { user_info, username } of lock_info) {
        lockInfo.push({ userInfo: user_info, username });
    }
    const proof = {
        cellDeps,
        lockInfo,
        userInfoSmtProof: user_info_smt_proof,
    };
    return proof;
}
exports.fetchAssetLockProof = fetchAssetLockProof;
/**
 * complete transaction with UniPass smt proof
 *
 * @param signedTx signed transaction
 * @param assetLockProof UniPass smt proof from UniPass snapshot server url
 * @param usernameHash UniPass username sha256 hash
 * @returns
 */
function completeTxWithProof(signedTx, assetLockProof, usernameHash) {
    const { pubkey, sig } = extractSigFromWitness(signedTx.witnesses[0]);
    signedTx.raw.cellDeps.push(...assetLockProof.cellDeps);
    // push asset-lock bin as cell deps
    // rebuild witness, username/userinfo/proof
    const witnessLock = UPLockWitness.SerializeAssetLockWitness({
        pubkey,
        sig,
        username: new pw_core_1.Reader(usernameHash),
        user_info: new pw_core_1.Reader(assetLockProof.lockInfo[0].userInfo),
        user_info_smt_proof: new pw_core_1.Reader(assetLockProof.userInfoSmtProof),
    });
    // Fill witnesses
    signedTx.witnesses[0] = new pw_core_1.Reader((0, pw_core_1.SerializeWitnessArgs)(pw_core_1.normalizers.NormalizeWitnessArgs(Object.assign(Object.assign({}, signedTx.witnessArgs[0]), { lock: witnessLock })))).serializeJson();
    return signedTx;
}
exports.completeTxWithProof = completeTxWithProof;
/**
 * decode UniPass pubkey and signature from witness.lock in hex format
 *
 * @param witness CKB transaction witness from PWCore signer
 * @returns pubkey in molecule format
 */
function extractSigFromWitness(witness) {
    const witnessArgs = new LumosCore.WitnessArgs(new pw_core_1.Reader(witness));
    const lockHex = new pw_core_1.Reader(witnessArgs.getLock().value().raw()).serializeJson();
    const { keyType, pubkey, sig } = JSON.parse(Buffer.from(lockHex.replace('0x', ''), 'hex').toString());
    // convert type to UPAuthResponse
    let pubKeyValue;
    switch (keyType) {
        case 'RsaPubkey':
            pubKeyValue = {
                e: new pw_core_1.Reader(pubkey.slice(0, 10)),
                n: new pw_core_1.Reader(`0x${pubkey.slice(10)}`),
            };
            break;
        case 'Secp256k1Pubkey':
            pubKeyValue = new pw_core_1.Reader(pubkey);
            break;
        case 'Secp256r1Pubkey':
            break;
    }
    const pubKey = {
        type: keyType,
        value: pubKeyValue,
    };
    return { pubkey: pubKey, sig: new pw_core_1.Reader(sig) };
}
/**
 * complete transaction with cell deps and witness including smt proof
 * and send transaction to ckb chain
 *
 * @param usernameHash UniPass username sha256 hash
 * @param signedTx signed CKB transaction
 * @param rpc
 * @returns CKB transaction hash
 */
async function sendUPLockTransaction(usernameHash, signedTx, rpc) {
    // fetch cellDeps/userinfo/proof from aggregator
    const assetLockProof = await fetchAssetLockProof(usernameHash);
    if (new pw_core_1.Reader(assetLockProof.lockInfo[0].userInfo).length() === 0) {
        throw new Error('user not registered');
    }
    // fill tx cell deps and witness
    const completedSignedTx = completeTxWithProof(signedTx, assetLockProof, usernameHash);
    const transformedTx = pw_core_1.transformers.TransformTransaction(completedSignedTx);
    const txHash = await rpc.send_transaction(transformedTx, 'passthrough');
    return txHash;
}
exports.sendUPLockTransaction = sendUPLockTransaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXAtbG9jay1wcm9vZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91cC1sb2NrLXByb29mLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FXdUI7QUFDdkIsa0RBQTBCO0FBRzFCLHFDQUFxQztBQUNyQyxtRUFBcUQ7QUFDckQsNEVBQThEO0FBYTlEOzs7OztHQUtHO0FBQ0ksS0FBSyxVQUFVLG1CQUFtQixDQUN2QyxZQUFvQjtJQUVwQixNQUFNLElBQUksR0FBRyxNQUFNLGVBQUssQ0FBQyxJQUFJLENBQUMsSUFBQSxrQkFBUyxHQUFFLENBQUMsYUFBYSxFQUFFO1FBQ3ZELE9BQU8sRUFBRSxLQUFLO1FBQ2QsTUFBTSxFQUFFLHdCQUF3QjtRQUNoQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7UUFDdEIsRUFBRSxFQUFFLEdBQUc7S0FDUixDQUFDLENBQUM7SUFFSCxnQ0FBZ0M7SUFDaEMsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUV2RSxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDcEIsS0FBSyxNQUFNLEVBQ1QsUUFBUSxFQUNSLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FDOUIsSUFBSSxTQUFTLEVBQUU7UUFDZCxNQUFNLE9BQU8sR0FBRyxRQUFRLEtBQUssaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBTyxDQUFDLFFBQVEsQ0FBQztRQUM1RSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxrQkFBUSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkU7SUFFRCxNQUFNLFFBQVEsR0FBRyxF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