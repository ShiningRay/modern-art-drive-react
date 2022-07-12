"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPCKBBaseProvider = void 0;
const pw_core_1 = require("@lay2/pw-core");
const utils_1 = require("../utils");
class UPCKBBaseProvider extends pw_core_1.Provider {
    constructor(username, assetLockCodeHash, hashType = pw_core_1.HashType.type) {
        super(pw_core_1.Platform.ckb);
        this.username = username;
        this.assetLockCodeHash = assetLockCodeHash;
        this.hashType = hashType;
        this.usernameHash = (0, utils_1.sha256)(username);
        const script = new pw_core_1.Script(assetLockCodeHash, this.usernameHash.slice(0, 42), hashType);
        this.address = script.toAddress();
    }
    hasher() {
        return new pw_core_1.Blake2bHasher();
    }
    async init() {
        return this;
    }
    /**
     * call UniPass authorize a CKB transaction
     *
     * @param _message message to be signed
     * @returns UniPass Authorize Response
     */
    async authorize(_message) {
        throw new Error('Not Implemented');
    }
    async sign(message) {
        return ('0x' +
            Buffer.from(JSON.stringify(await this.authorize(message))).toString('hex'));
    }
    async close() {
        console.log('do nothing');
    }
}
exports.UPCKBBaseProvider = UPCKBBaseProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXAtY2tiLWJhc2UtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3VwLWNrYi1iYXNlLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQU91QjtBQUd2QixvQ0FBa0M7QUFFbEMsTUFBYSxpQkFBa0IsU0FBUSxrQkFBUTtJQU83QyxZQUNrQixRQUFnQixFQUNoQixpQkFBeUIsRUFDekIsV0FBcUIsa0JBQVEsQ0FBQyxJQUFJO1FBRWxELEtBQUssQ0FBQyxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBSkosYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQVE7UUFDekIsYUFBUSxHQUFSLFFBQVEsQ0FBMEI7UUFJbEQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFBLGNBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQ3ZCLGlCQUFpQixFQUNqQixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQzlCLFFBQVEsQ0FDVCxDQUFDO1FBQ0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQWxCRCxNQUFNO1FBQ0osT0FBTyxJQUFJLHVCQUFhLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBa0JELEtBQUssQ0FBQyxJQUFJO1FBQ1IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQWdCO1FBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFlO1FBQ3hCLE9BQU8sQ0FDTCxJQUFJO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUMzRSxDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBQ0Y7QUEvQ0QsOENBK0NDIn0=