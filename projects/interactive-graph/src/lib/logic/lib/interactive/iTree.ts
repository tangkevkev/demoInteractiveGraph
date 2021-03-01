import { InteractiveGraph } from "./interactiveGraph";
import { Tree } from "../base/tree";
import { AbstractGrid } from "../abstract/aGrid";
import { DirectedGraph } from "../graph/directedGraph";
import { UndirectedGraph } from "../graph/undirectedGraph";
import { TreeNode } from "../base/treeNode";
import { TreeGrid } from "../tree/treeGrid";

export abstract class ITree extends InteractiveGraph {

    protected root: TreeNode;

    /**
     * Requires a TreeGrid
     */
    constructor(directed: boolean, grid: AbstractGrid, canvas: HTMLCanvasElement) {
        if (directed) {
            super(new DirectedGraph(), grid, canvas);
        } else {
            super(new UndirectedGraph(), grid, canvas);
        }
        this.root = null as any
    }

    buildCombinatorialTree(alphabet: any[], depth: number, withRepetition?: boolean) {
        let rep: boolean = (withRepetition == undefined) ? false : withRepetition;
        //Only works if TreeGrid is our grid
        if (this.grid instanceof TreeGrid) {
            this.grid.initDimensionCombinatorialTree(depth, rep, alphabet.length);
            console.log("I'm here");
            let newRoot = this.newNode();
            if (newRoot instanceof TreeNode) {
                this.root = newRoot;
                this.add(this.root, this.grid.getRootCoordinate());
                let todoNodes: TreeNode[] = [this.root];

                for (let i = 1; i <= depth; i++) {
                    let newToDoNodes: TreeNode[] = [];
                    let childNumber = 0;
                    console.log("i: " + i);

                    if (rep) {
                        let totalChilds = todoNodes.length * alphabet.length;
                        todoNodes.forEach(tdNodes => {
                            alphabet.forEach(el => {
                                let newNode = this.newNode();
                                if (newNode instanceof TreeNode && this.grid instanceof TreeGrid) {
                                    let newContent = [];
                                    tdNodes.getContent().forEach(i => {
                                        newContent.push(i);
                                    });
                                    let newCoord = this.grid.getCoordinateCombinatorialTree(i,
                                        childNumber++, totalChilds - 1);
                                    this.add(newNode, newCoord);
                                    newContent.push(el);
                                    newNode.setContent(newContent);
                                    newToDoNodes.push(newNode);

                                    this.add(this.newEdge(tdNodes, newNode));

                                }
                            })
                        });
                    } else {
                        let totalChilds = todoNodes.length * (alphabet.length - i + 1);
                        todoNodes.forEach(tdNodes => {
                            alphabet.forEach(el => {
                                let newNode = this.newNode();
                                if (newNode instanceof TreeNode && this.grid instanceof TreeGrid) {
                                    let newContent: any[] = [];
                                    tdNodes.getContent().forEach(i => {
                                        newContent.push(i);
                                    });
                                    if (!newContent.includes(el)) {
                                        let newCoord = this.grid.getCoordinateCombinatorialTree(i,
                                            childNumber++, totalChilds - 1);
                                        this.add(newNode, newCoord);
                                        newContent.push(el);
                                        newNode.setContent(newContent);
                                        newToDoNodes.push(newNode);
                                        this.add(this.newEdge(tdNodes, newNode));

                                    }
                                }
                            })
                        });
                    }
                    todoNodes = [];
                    newToDoNodes.forEach(n => {
                        todoNodes.push(n);
                    });
                }
                let context = this.canvas.getContext('2d')
                if (context)
                    this.grid.draw(context, this.grid);
            }
        } else {
            console.log("TreeGrid expected!")
        }
        console.log("Finish build");
        this.forceUpdate();
        console.log("Column number: " + this.grid.getColsNumber());
        console.log("Row number: " + this.grid.getRowsNumber());
    }



}