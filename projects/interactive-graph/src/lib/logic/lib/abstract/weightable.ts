
export abstract class Weightable {

    abstract setWeight(weight: number): void;

    abstract getWeight(): number;

    abstract setUnit(unit: string): void;

    abstract getUnit(): string;

    static isWeightable(object: any): object is Weightable {
        if (object == null)
            return false;
        const d = object as Weightable;
        return d.getWeight !== undefined;
    }
}