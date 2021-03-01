import { AbstractGraph } from "../abstract/aGraph";
import { AbstractGrid } from "../abstract/aGrid";
import { AbstractNode } from "../abstract/aNode";
import { AbstractEdge } from "../abstract/aEdge";
import { InteractionType } from "./InteractionType";
import { InteractiveGraph } from "./interactiveGraph";
import { Colorable } from "../abstract/colorable";

export class ActionHistory {
    private history: [InteractionType, any][];
    private canvas: HTMLCanvasElement;
    private graph: AbstractGraph;
    private grid: AbstractGrid;
    private interactiveGraph: InteractiveGraph;
    private index: number = -1;

    constructor(canvas: HTMLCanvasElement, interactiveGraph: InteractiveGraph) {
        this.history = [];
        this.canvas = canvas;
        this.interactiveGraph = interactiveGraph;

        this.graph = interactiveGraph.getGraph();
        this.grid = interactiveGraph.getGrid();

    }

    resetHistory() {
        this.history = [];
        this.index = -1;
    }

    revertAction(steps?: number) {
        if (this.index < 0)
            return;

        if (steps == undefined) {
            steps = 1;
        }
        else {
            steps = Math.min(steps, this.index);
        }

        for (let i = 0; i < steps; i++) {
            this.revert();
        }

        let context = this.canvas.getContext('2d')

        if (context)
            this.graph.update(context, this.grid);
    }

    /**
     * Not working. Don't use. Maybe later?
     */
    redoAction(steps?: number) {
        if (this.index + 1 >= this.history.length) {
            return;
        }

        if (steps == undefined) {
            steps = 1;
        }
        else {
            steps = Math.min(steps, this.history.length - (this.index + 1));
        }

        for (let i = 0; i < steps; i++) {
            this.redo();
        }

        
        let context = this.canvas.getContext('2d')

        if (context)
            this.graph.update(context, this.grid);
    }

    //Not working currently
    private redo() {
        let data = this.history[this.index];
        let action: InteractionType = data[0];

        switch (action) {
            case InteractionType.CREATE_NODE:
                this.graph.addNode(data[1][0]);
                this.grid.addCoordinate(data[1][0], this.reconvert(data[1][1]));
                break;
            case InteractionType.CREATE_EDGE:
                this.graph.addEdge(data[1]);
                this.grid.addCoordinate(data[1], [0, 0]);
                break;
            case InteractionType.DELETE:
                if (data[1][0] instanceof AbstractNode) {
                    this.graph.deleteNode(data[1][0]);
                    this.grid.deleteCoordinate(data[1][0]);
                }
                else if (data[1][0] instanceof AbstractEdge) {
                    this.graph.deleteEdge(data[1][0]);
                    this.grid.deleteCoordinate(data[1][0]);
                }
                break;
            case InteractionType.MOVE_NODE:
                this.grid.addCoordinate(data[1][0], this.reconvert(data[1][1]));
                break;
        }
        this.index++;
    }

    private revert() {
        let data = this.history[this.index];
        let action: InteractionType = data[0];

        switch (action) {
            case InteractionType.CREATE_NODE:
                this.graph.deleteNode(data[1][0]);
                this.grid.deleteCoordinate(data[1][0]);
                break;
            case InteractionType.CREATE_EDGE:
                this.graph.deleteEdge(data[1]);
                this.grid.deleteCoordinate(data[1]);
                break;
            case InteractionType.DELETE:
                if (data[1][0] instanceof AbstractNode) {
                    let node: AbstractNode = data[1][0];
                    let coordinate: [number, number] = this.reconvert(data[1][1]);
                    this.graph.addNode(node);
                    this.grid.addCoordinate(node, coordinate);

                    let edges: AbstractEdge[] = data[1][2];
                    edges.forEach(edge => {
                        this.graph.addEdge(edge);
                        this.grid.addCoordinate(edge, [0, 0]);
                    })
                }
                else if (data[1][0] instanceof AbstractEdge) {
                    this.graph.addEdge(data[1][0]);
                    this.grid.addCoordinate(data[1][0], [0, 0]);
                }
                break;
            case InteractionType.MOVE_NODE:
                this.grid.addCoordinate(data[1][0], this.reconvert(data[1][1]));
                break;
            case InteractionType.SELECT_SOURCE_NODE:
                this.interactiveGraph.setSourceNode(data[1]);
                break;
            case InteractionType.SELECT_TARGET_NODE:
                this.interactiveGraph.setTargetNode(data[1]);
                break;
        }
        this.index--;
    }

    private addAction() {
        if (this.history.length != this.index + 1) {
            while (this.history.length > this.index + 1) {
                this.history.pop();
            }
        }
        this.index++;
    }


    addMove(node: AbstractNode) {
        this.addAction();
        this.history.push([InteractionType.MOVE_NODE, [node,
            this.convert(this.grid.getCoordinate(node))]]);
    }

    addCreateNode(node: AbstractNode) {
        this.addAction();
        this.history.push([InteractionType.CREATE_NODE, [node,
            this.convert(this.grid.getCoordinate(node))]]);
    }

    addCreateEdge(edge: AbstractEdge) {
        this.addAction();
        this.history.push([InteractionType.CREATE_EDGE, edge]);
    }

    addSourceNode(node: AbstractNode) {
        this.addAction();
        this.history.push([InteractionType.SELECT_SOURCE_NODE, node]);
    }

    addTargetNode(node: AbstractNode) {
        this.addAction();
        this.history.push([InteractionType.SELECT_TARGET_NODE, node]);
    }

    deleteNode(node: AbstractNode) {
        this.addAction();
        let edges: AbstractEdge[] = [];
        this.graph.getEdges().forEach(edge => {
            if (edge.getEndNode() == node || edge.getStartNode() == node) {
                edges.push(edge);
            }
        })

        if (Colorable.isColorable(node)) {
            node.resetColor();
        }

        this.history.push([InteractionType.DELETE,
        [node, this.convert(this.grid.getCoordinate(node)), edges]]);
    }

    deleteEdge(edge: AbstractEdge) {
        this.addAction();
        this.history.push([InteractionType.DELETE, [edge]]);
    }

    printHistory() {
        console.log("History length. " + this.history.length);
        console.log("Index : " + this.index);

        this.history.forEach(h => {
            console.log(h[0])
            console.log(h[1])
            console.log("-----");
        })
    }



    //convert positions relative to current canvas size (can vary due to dynamic sizing)
    private convert(p: [number, number]): [number, number] {
        return [p[0] / this.canvas.width, p[1] / this.canvas.height];
    }

    private reconvert(p: [number, number]): [number, number] {
        return [p[0] * this.canvas.width, p[1] * this.canvas.height];
    }




}
