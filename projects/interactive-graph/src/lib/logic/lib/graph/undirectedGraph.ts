import { Graph } from "../base/graph";
import { UndirectedEdge } from "../base/edges/undirectedEdge";
import { Edge } from "../base/edge";
import { Errors } from "../errors";
import { AbstractNode } from "../abstract/aNode";
import { AbstractEdge } from "../abstract/aEdge";

export class UndirectedGraph extends Graph {

    addEdge(edge: UndirectedEdge): boolean {
        if (!(edge instanceof UndirectedEdge)) {
            Errors.throwTypeError(UndirectedEdge.name, typeof (edge));
            return false;
        }
        return super.addEdge(edge);
    }

    getEdge(startNode: AbstractNode, endNode: AbstractNode): AbstractEdge {
        for (let edge of this.edges) {
            let start = edge.getStartNode();
            let end = edge.getEndNode();

            if ((start == startNode && end == endNode)
                || (start == endNode) && (end == startNode)) {
                return edge;
            }
        }
        return null as any;
    }

   

}