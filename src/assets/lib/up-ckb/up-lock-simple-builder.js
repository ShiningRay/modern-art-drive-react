"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLockSimpleBuilder = void 0;
const pw_core_1 = require("@lay2/pw-core");
class UPLockSimpleBuilder extends pw_core_1.Builder {
    constructor(address, amount, provider, options = {}) {
        super(options.feeRate, options.collector, options.witnessArgs);
        this.address = address;
        this.amount = amount;
        this.provider = provider;
        this.options = options;
    }
    async build(fee = pw_core_1.Amount.ZERO) {
        const outputCell = new pw_core_1.Cell(this.amount, this.address.toLockScript());
        const data = this.options.data;
        if (data) {
            if (data.startsWith('0x')) {
                outputCell.setHexData(data);
            }
            else {
                outputCell.setData(data);
            }
        }
        const neededAmount = this.amount.add(pw_core_1.Builder.MIN_CHANGE).add(fee);
        let inputSum = new pw_core_1.Amount('0');
        const inputCells = [];
        // fill the inputs
        const cells = await this.collector.collect(this.provider.address, {
            neededAmount,
        });
        for (const cell of cells) {
            inputCells.push(cell);
            inputSum = inputSum.add(cell.capacity);
            if (inputSum.gt(neededAmount))
                break;
        }
        if (inputSum.lt(neededAmount)) {
            throw new Error(`input capacity not enough, need ${neededAmount.toString(pw_core_1.AmountUnit.ckb)}, got ${inputSum.toString(pw_core_1.AmountUnit.ckb)}`);
        }
        const changeCell = new pw_core_1.Cell(inputSum.sub(outputCell.capacity), this.provider.address.toLockScript());
        const tx = new pw_core_1.Transaction(new pw_core_1.RawTransaction(inputCells, [outputCell, changeCell], []), [this.witnessArgs]);
        // Note: due to transaction will be complete after building, we can not get accurate tx size here.
        // so we add additional 100000 shannon fee for the transaction
        this.fee = pw_core_1.Builder.calcFee(tx, this.feeRate).add(new pw_core_1.Amount('100000', pw_core_1.AmountUnit.shannon));
        if (changeCell.capacity.gte(pw_core_1.Builder.MIN_CHANGE.add(this.fee))) {
            changeCell.capacity = changeCell.capacity.sub(this.fee).sub(fee);
            tx.raw.outputs.pop();
            tx.raw.outputs.push(changeCell);
            return tx;
        }
        return this.build(this.fee);
    }
    getCollector() {
        return this.collector;
    }
}
exports.UPLockSimpleBuilder = UPLockSimpleBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXAtbG9jay1zaW1wbGUtYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91cC1sb2NrLXNpbXBsZS1idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQVV1QjtBQUV2QixNQUFhLG1CQUFvQixTQUFRLGlCQUFPO0lBQzlDLFlBQ21CLE9BQWdCLEVBQ2hCLE1BQWMsRUFDWixRQUFrQixFQUNsQixVQUF5QixFQUFFO1FBRTlDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBTDlDLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNaLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7SUFHaEQsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBYyxnQkFBTSxDQUFDLElBQUk7UUFDbkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFdEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDL0IsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3pCLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDN0I7aUJBQU07Z0JBQ0wsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMxQjtTQUNGO1FBRUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7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