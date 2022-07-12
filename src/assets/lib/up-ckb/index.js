"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const pw_core_1 = require("@lay2/pw-core");
const config_1 = require("./config");
const providers_1 = require("./providers");
const up_lock_proof_1 = require("./up-lock-proof");
const up_lock_simple_builder_1 = require("./up-lock-simple-builder");
/**
 * get UniPass user's CKB asset address
 *
 * @param username UniPass username
 * @returns user's CKB asset address
 */
function getCKBAddress(username) {
    const provider = new providers_1.UPCKBBaseProvider(username, (0, config_1.getConfig)().upLockCodeHash);
    return provider.address;
}
/**
 * send CKB to a specified address using UPCKBBaseProvider
 *
 * @param to the destination CKB address
 * @param amount the amount of CKB to be sent
 * @param provider the PWCore Provider used to sign transaction
 * @returns the transaction hash
 */
async function sendCKB(to, amount, provider) {
    const builder = new up_lock_simple_builder_1.UPLockSimpleBuilder(to, amount, provider, {
        collector: new pw_core_1.IndexerCollector((0, config_1.getConfig)().ckbIndexerUrl),
        witnessArgs: pw_core_1.Builder.WITNESS_ARGS.RawSecp256k1,
    });
    const tx = await builder.build();
    return sendTransaction(tx, provider);
}
/**
 * sign and send a CKB transaction with UPCKBBaseProvider
 * @param tx
 * @param provider
 * @returns
 */
async function sendTransaction(tx, provider) {
    // TODO: save old cell deps and restore old cell deps after complete tx
    // const oldCellDeps = tx.raw.cellDeps;
    tx.raw.cellDeps = [];
    const signer = new pw_core_1.DefaultSigner(provider);
    const signedTx = await signer.sign(tx);
    const rpc = new pw_core_1.RPC((0, config_1.getConfig)().ckbNodeUrl);
    return (0, up_lock_proof_1.sendUPLockTransaction)(provider.usernameHash, signedTx, rpc);
}
__exportStar(require("./up-lock-proof"), exports);
__exportStar(require("./providers"), exports);
const functions = {
    config: config_1.config,
    getCKBAddress,
    sendCKB,
    sendTransaction,
};
exports.default = functions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMkNBUXVCO0FBRXZCLHFDQUE2QztBQUM3QywyQ0FBZ0Q7QUFDaEQsbURBQXdEO0FBQ3hELHFFQUErRDtBQUUvRDs7Ozs7R0FLRztBQUNILFNBQVMsYUFBYSxDQUFDLFFBQWdCO0lBQ3JDLE1BQU0sUUFBUSxHQUFHLElBQUksNkJBQWlCLENBQUMsUUFBUSxFQUFFLElBQUEsa0JBQVMsR0FBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzdFLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQztBQUMxQixDQUFDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILEtBQUssVUFBVSxPQUFPLENBQ3BCLEVBQVcsRUFDWCxNQUFjLEVBQ2QsUUFBMkI7SUFFM0IsTUFBTSxPQUFPLEdBQUcsSUFBSSw0Q0FBbUIsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLFFBQVMsRUFBRTtRQUM3RCxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyxJQUFBLGtCQUFTLEdBQUUsQ0FBQyxhQUFhLENBQUM7UUFDMUQsV0FBVyxFQUFFLGlCQUFPLENBQUMsWUFBWSxDQUFDLFlBQVk7S0FDL0MsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxFQUFFLEdBQUcsTUFBTSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFakMsT0FBTyxlQUFlLENBQUMsRUFBRSxFQUFFLFFBQVMsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILEtBQUssVUFBVSxlQUFlLENBQzVCLEVBQWUsRUFDZixRQUEyQjtJQUUzQix1RUFBdUU7SUFDdkUsdUNBQXVDO0lBQ3ZDLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFJLHVCQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0MsTUFBTSxRQUFRLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXZDLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLElBQUEsa0JBQVMsR0FBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sSUFBQSxxQ0FBcUIsRUFBQyxRQUFRLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBRUQsa0RBQWdDO0FBQ2hDLDhDQUE0QjtBQUM1QixNQUFNLFNBQVMsR0FBRztJQUNoQixNQUFNLEVBQU4sZUFBTTtJQUNOLGFBQWE7SUFDYixPQUFPO0lBQ1AsZUFBZTtDQUNoQixDQUFDO0FBQ0Ysa0JBQWUsU0FBUyxDQUFDIn0=