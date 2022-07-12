"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.config = exports.UPCKBConfig = void 0;
const pw_core_1 = require("@lay2/pw-core");
class UPCKBConfig {
    constructor(upSnapshotUrl, // UniPass Snapshot server url
    ckbNodeUrl, // CKB node url
    ckbIndexerUrl, // CKB indexer url
    chainID, // CKB Chain ID
    upLockCodeHash // UniPass Asset Lock TypeID
    ) {
        this.upSnapshotUrl = upSnapshotUrl;
        this.ckbNodeUrl = ckbNodeUrl;
        this.ckbIndexerUrl = ckbIndexerUrl;
        this.chainID = chainID;
        this.upLockCodeHash = upLockCodeHash;
    }
}
exports.UPCKBConfig = UPCKBConfig;
const upConfig = new UPCKBConfig('', 'https://testnet.ckb.dev', 'https://testnet.ckb.dev/indexer', pw_core_1.ChainID.ckb_testnet, '0xd3f6d12ac220b3f7e104f3869e72487f8940adb13a526a2abd775c2cd5040f77');
/**
 * set configuration for UPCKB
 * @param options UniPass CKB Config Options
 */
function config(options) {
    upConfig.upSnapshotUrl = (options === null || options === void 0 ? void 0 : options.upSnapshotUrl) || upConfig.upSnapshotUrl;
    upConfig.chainID = (options === null || options === void 0 ? void 0 : options.chainID) || upConfig.chainID;
    upConfig.ckbNodeUrl = (options === null || options === void 0 ? void 0 : options.ckbNodeUrl) || upConfig.ckbNodeUrl;
    upConfig.ckbIndexerUrl = (options === null || options === void 0 ? void 0 : options.ckbIndexerUrl) || upConfig.ckbIndexerUrl;
    upConfig.upLockCodeHash = (options === null || options === void 0 ? void 0 : options.upLockCodeHash) || upConfig.upLockCodeHash;
}
exports.config = config;
function getConfig() {
    return upConfig;
}
exports.getConfig = getConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBd0M7QUFFeEMsTUFBYSxXQUFXO0lBQ3RCLFlBQ1MsYUFBcUIsRUFBRSw4QkFBOEI7SUFDckQsVUFBa0IsRUFBRSxlQUFlO0lBQ25DLGFBQXFCLEVBQUUsa0JBQWtCO0lBQ3pDLE9BQWdCLEVBQUUsZUFBZTtJQUNqQyxjQUFzQixDQUFDLDRCQUE0Qjs7UUFKbkQsa0JBQWEsR0FBYixhQUFhLENBQVE7UUFDckIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNsQixrQkFBYSxHQUFiLGFBQWEsQ0FBUTtRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLG1CQUFjLEdBQWQsY0FBYyxDQUFRO0lBQzVCLENBQUM7Q0FDTDtBQVJELGtDQVFDO0FBRUQsTUFBTSxRQUFRLEdBQWdCLElBQUksV0FBVyxDQUMzQyxFQUFFLEVBQ0YseUJBQXlCLEVBQ3pCLGlDQUFpQyxFQUNqQyxpQkFBTyxDQUFDLFdBQVcsRUFDbkIsb0VBQW9FLENBQ3JFLENBQUM7QUFTRjs7O0dBR0c7QUFDSCxTQUFnQixNQUFNLENBQUMsT0FBMkI7SUFDaEQsUUFBUSxDQUFDLGFBQWEsR0FBRyxDQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxhQUFhLEtBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQztJQUMxRSxRQUFRLENBQUMsT0FBTyxHQUFHLENBQUEsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLE9BQU8sS0FBSSxRQUFRLENBQUMsT0FBTyxDQUFDO0lBQ3hELFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsVUFBVSxLQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDakUsUUFBUSxDQUFDLGFBQWEsR0FBRyxDQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxhQUFhLEtBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQztJQUMxRSxRQUFRLENBQUMsY0FBYyxHQUFHLENBQUEsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLGNBQWMsS0FBSSxRQUFRLENBQUMsY0FBYyxDQUFDO0FBQy9FLENBQUM7QUFORCx3QkFNQztBQUVELFNBQWdCLFNBQVM7SUFDdkIsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUZELDhCQUVDIn0=