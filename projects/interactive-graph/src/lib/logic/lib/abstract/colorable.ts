export abstract class Colorable{
    abstract setColor(color: any): void;
    abstract getColor():any;
    abstract resetColor(): void;

    static isColorable (object:any): object is Colorable {
        if(object == null)
            return false;
        const d = object as Colorable;
        return d.getColor !== undefined;
   }
}