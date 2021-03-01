import { Drawable } from "./drawable";
import { AbstractNode } from "./aNode";

export abstract class AbstractEdge extends Drawable{
    private static readonly EDGE_PRIORITY = 3;

    protected readonly startNode: AbstractNode;
    protected readonly endNode: AbstractNode;

    constructor(startNode: AbstractNode, endNode: AbstractNode){
        super(AbstractEdge.EDGE_PRIORITY);

        this.startNode = startNode;
        this.endNode = endNode;
    }

 

    getStartNode(): AbstractNode{
        return this.startNode;
    }

    getEndNode(): AbstractNode{
        return this.endNode;
    }

    abstract equals(other: AbstractEdge): boolean;

}