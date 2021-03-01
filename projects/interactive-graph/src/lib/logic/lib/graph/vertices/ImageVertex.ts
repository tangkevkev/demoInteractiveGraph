import { Vertex } from "../../base/vertex";

export abstract class ImageVertex extends Vertex {
    protected link: string ="";

    setImageLink(link: string){
        this.link = link;
    }

    getImageLink(): string{
        return this.link;
    }

    
}