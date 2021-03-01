import { TreeNode } from "../../base/treeNode";
import { AbstractGrid } from "../../abstract/aGrid";

export abstract class NameTreeNode extends TreeNode {
    protected content: String[];

    constructor(content?: String[]) {
        super();
        if (content == undefined || content == null) {
            this.content = [];
        } else {
            this.content = content;
        }

        console.log("calling nametreenode constructor");
    }

    setContent(content: String[]) {
        this.content = content;
    }

    getContent(): String[] {
        return this.content;
    }
}