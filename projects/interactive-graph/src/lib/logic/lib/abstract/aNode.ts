import { Drawable } from "./drawable";

export abstract class AbstractNode extends Drawable{
    private static readonly NODE_PRIORITY = 2;

    constructor(){
        super(AbstractNode.NODE_PRIORITY);
    }

  

}