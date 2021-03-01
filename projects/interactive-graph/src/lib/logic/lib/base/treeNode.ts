import { AbstractNode } from "../abstract/aNode";

export abstract class TreeNode extends AbstractNode{
    abstract getContent(): any[];
    abstract setContent(content: any[]): void;   
}