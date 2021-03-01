import { CircleNameVertex } from "../../node/circleNameVertex";
import { IGraph, GraphType } from "../../../lib/interactive/iGraph";
import { GraphGrid } from "../../../lib/graph/graphGrid";
import { Vertex } from "../../../lib/base/vertex";
import { SimpleUndirectedEdge } from "../../edge/simpleUndirectedEdge";
import { Edge } from "../../../lib/base/edge";
import { InteractionType } from "../../../lib/interactive/InteractionType";

export class SimpleInteractiveUndirectedGraph extends IGraph {
    constructor(canvas: HTMLCanvasElement) {
        super(GraphType.UNDIRECTED_GRAPH, new GraphGrid(canvas), canvas);
    }

    newNode(args?: any[]): Vertex {
        if (args == undefined || args.length == 0)
            return new CircleNameVertex();
        return new CircleNameVertex(args[0]);
    }

    newEdge(from: Vertex, to: Vertex, args?: any[]): Edge {
        return new SimpleUndirectedEdge(from, to);
    }

    doubleClick(e: MouseEvent) { }
    keyBoardEvent(k: KeyboardEvent) {
        switch (k.key) {
            case 'p':
                if (this.grid instanceof GraphGrid) {
                    this.grid.printInformation();
                    break;
                }

        }
    }

}