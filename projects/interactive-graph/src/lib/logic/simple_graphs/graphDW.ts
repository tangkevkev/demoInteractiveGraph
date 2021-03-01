import { IGraph, GraphGrid, CircleNameVertex, SimpleDirectedWeightedEdge } from '../index';
import { GraphType } from '../lib/interactive/iGraph';
import { Vertex } from '../lib/base/vertex';
import { Edge } from '../lib/base/edge';

// GraphDW = Directed Weighted Graph

export class GraphDW extends IGraph {
    constructor(canvas: HTMLCanvasElement) {
        super(GraphType.DIRECTED_GRAPH, new GraphGrid(canvas), canvas);
    }

    newNode(args?: any[]): Vertex {
        if (args === undefined || args.length === 0) {
            return new CircleNameVertex();
        }
        return new CircleNameVertex(args[0]);
    }

    newEdge(from: Vertex, to: Vertex, args?: any[]): Edge {
        return new SimpleDirectedWeightedEdge(from, to);
    }

    keyBoardEvent(k: KeyboardEvent) {}


}
