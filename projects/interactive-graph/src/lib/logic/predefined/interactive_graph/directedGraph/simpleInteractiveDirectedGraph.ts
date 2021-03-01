import { CircleNameVertex } from "../../node/circleNameVertex";
import { IGraph, GraphType } from "../../../lib/interactive/iGraph";
import { GraphGrid } from "../../../lib/graph/graphGrid";
import { Vertex } from "../../../lib/base/vertex";
import { Edge } from "../../../lib/base/edge";
import { SimpleDirectedWeightedEdge } from "../../edge/simpleDirectedWeightedEdge";

export class SimpleInteractiveDirectedGraph extends IGraph {
    constructor(canvas: HTMLCanvasElement) {
        super(GraphType.DIRECTED_GRAPH, new GraphGrid(canvas), canvas);
    }

    newNode(args?: any[]): Vertex {
        if (args == undefined || args.length == 0)
            return new CircleNameVertex();
        return new CircleNameVertex(args[0]);
    }

    newEdge(from: Vertex, to: Vertex, args?: any[]): Edge {
        return new SimpleDirectedWeightedEdge(from, to);
    }

    doubleClick(e: MouseEvent) { }


    keyBoardEvent(k: KeyboardEvent) {

    }
}