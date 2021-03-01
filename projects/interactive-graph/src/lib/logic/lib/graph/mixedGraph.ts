import { Graph } from "../base/graph";
import { Edge } from "../base/edge";
import { Errors } from "../errors";
import { Vertex } from "../base/vertex";
import { AbstractNode } from "../abstract/aNode";
import { AbstractEdge } from "../abstract/aEdge";
import { DirectedEdge } from "../base/edges/directedEdge";
import { UndirectedEdge } from "../base/edges/undirectedEdge";

export class MixedGraph extends Graph {
    addEdge(edge: Edge): boolean {
        if (!(edge instanceof Edge)) {
            Errors.throwTypeError(Edge.name, typeof (edge));
            return false;
        }
        return super.addEdge(edge);
    }

    getEdge(startNode: AbstractNode, endNode: AbstractNode): AbstractEdge {
        for (let edge of this.edges) {
            let start = edge.getStartNode();
            let end = edge.getEndNode();

            if (edge instanceof DirectedEdge) {
                if (start == startNode && end == endNode) {
                    return edge;
                }
            } else if (edge instanceof UndirectedEdge) {
                if ((start == startNode && end == endNode)
                    || (start == endNode) && (end == startNode)) {
                    return edge;
                }
            }
        }
        return null as any;
    }


    


}