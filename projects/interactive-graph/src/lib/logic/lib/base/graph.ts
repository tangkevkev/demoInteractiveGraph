import { AbstractGraph } from "../abstract/aGraph";
import { Vertex } from "./vertex";
import { Errors } from "../errors";

export abstract class Graph extends AbstractGraph{
    addNode(node: Vertex): boolean{
       /* if(!(node instanceof Vertex)){
            Errors.throwTypeError(Vertex.name,typeof(node));
            return false;
        }*/
        return super.addNode(node);
    }
}