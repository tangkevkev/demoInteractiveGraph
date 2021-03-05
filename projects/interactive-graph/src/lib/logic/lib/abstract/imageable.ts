export abstract class Imageable {

    abstract setImageLink(link: string): void;

    abstract getImageLink(): string;
    
    static isImageable(object: any): object is Imageable {
        if (object == null)
            return false;
        const d = object as Imageable;
        return d.getImageLink() !== undefined;
    }
}

