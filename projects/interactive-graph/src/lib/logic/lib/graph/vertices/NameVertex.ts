import { Vertex } from "../../base/vertex";
import { Colorable } from "../../abstract/colorable";

/**
 * Vertex with Name drawn on it.
 */

export abstract class NameVertex extends Vertex implements Colorable {
    protected name: string = "";
    protected color: string = "";
    protected standarColor: string = "yellow";
    protected predefinedName: string[] = ['A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'
        , 'U', 'V', 'W', 'X', 'Y', 'Z'];
    static ic: number = 0;
    constructor(name?: string) {
        super();
        if (name == undefined || name == null){
            this.name = this.predefinedName[NameVertex.ic++%this.predefinedName.length];
        }else{
            this.name = name;
            if(this.predefinedName.includes(name)){
                let newIC =   (this.predefinedName.indexOf(name)+1)%this.predefinedName.length;
                NameVertex.ic = newIC > NameVertex.ic ? newIC : NameVertex.ic;  
            }
        }
    }

    static resetNames(){
        this.ic = 0;
    }

  

    setName(name: string) {
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    setColor(color: any) {
        this.color = color;
    }

    getColor(): any {
        return this.color;
    }

    resetColor() {
        this.color = this.standarColor;
    }
}