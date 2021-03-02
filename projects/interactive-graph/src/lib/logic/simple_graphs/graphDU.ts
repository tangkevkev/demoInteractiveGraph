import { IGraph, GraphGrid, CircleNameVertex, SimpleDirectedWeightedEdge } from '../index';
import { GraphType } from '../lib/interactive/iGraph';
import { Vertex } from '../lib/base/vertex';
import { Edge } from '../lib/base/edge';
import { SimpleDirectedEdge } from '../predefined/edge/simpleDirectedEdge';

// GraphDW = Directed unweighted Graph

export class GraphDU extends IGraph {
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
        return new SimpleDirectedEdge(from, to);
    }

    keyBoardEvent(k: KeyboardEvent) {}


}
