import { GraphType, IGraph } from '../lib/interactive/iGraph';
import { Vertex } from '../lib/base/vertex';
import { Edge } from '../lib/base/edge';
import { GraphGrid } from '../lib/graph/graphGrid';
import { CircleNameVertex } from '../predefined/node/circleNameVertex';
import { SimpleUndirectedWeightedEdge } from '../predefined/edge/simpleUndirectedWeightedEdge';

// GraphUW = Undirected weighted Graph

export class GraphUW extends IGraph {
    constructor(canvas: HTMLCanvasElement) {
        super(GraphType.UNDIRECTED_GRAPH, new GraphGrid(canvas), canvas);
    }

    newNode(args?: any[]): Vertex {
        if (args === undefined || args.length === 0) {
            return new CircleNameVertex();
        }
        return new CircleNameVertex(args[0]);
    }

    newEdge(from: Vertex, to: Vertex, args?: any[]): Edge {
        return new SimpleUndirectedWeightedEdge(from, to);
    }

    keyBoardEvent(k: KeyboardEvent) {}


}
