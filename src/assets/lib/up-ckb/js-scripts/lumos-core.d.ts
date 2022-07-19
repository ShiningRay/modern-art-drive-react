export class WitnessArgs {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    getLock(): BytesOpt;
    getInputType(): BytesOpt;
    getOutputType(): BytesOpt;
}
declare class BytesOpt {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    value(): Bytes;
    hasValue(): boolean;
}
declare class Bytes {
    constructor(reader: any, { validate }?: {
        validate?: boolean;
    });
    view: DataView;
    validate(compatible?: boolean): void;
    raw(): ArrayBuffer;
    indexAt(i: any): number;
    length(): number;
}
export {};
