import { Address, Amount, Builder, BuilderOption, Provider, Transaction } from '@lay2/pw-core';
export declare class UPLockSimpleBuilder extends Builder {
    private readonly address;
    private readonly amount;
    protected readonly provider: Provider;
    protected readonly options: BuilderOption;
    constructor(address: Address, amount: Amount, provider: Provider, options?: BuilderOption);
    build(fee?: Amount): Promise<Transaction>;
    getCollector(): import("@lay2/pw-core").Collector | import("@lay2/pw-core").SUDTCollector;
}
