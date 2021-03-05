import { Imageable } from "../../abstract/imageable";
import { Vertex } from "../../base/vertex";

export abstract class ImageVertex extends Vertex implements Imageable {
    protected link: string ="";

    setImageLink(link: string){
        this.link = link;
    }

    getImageLink(): string{
        return this.link;
    }

    
}