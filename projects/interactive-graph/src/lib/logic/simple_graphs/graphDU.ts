import { GraphType, IGraph } from '../lib/interactive/iGraph';
import { Vertex } from '../lib/base/vertex';
import { Edge } from '../lib/base/edge';
import { SimpleDirectedEdge } from '../predefined/edge/simpleDirectedEdge';
import { GraphGrid } from '../lib/graph/graphGrid';
import { CircleNameVertex } from '../predefined/node/circleNameVertex';

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
