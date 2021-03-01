import { Graph } from "../base/graph";
import { DirectedEdge } from "../base/edges/directedEdge";
import { Errors } from "../errors";
import { AbstractNode } from "../abstract/aNode";
import { AbstractEdge } from "../abstract/aEdge";
import { NameVertex } from "./vertices/NameVertex";

export class DirectedGraph extends Graph {

    addEdge(edge: DirectedEdge): boolean {
        if (!(edge instanceof DirectedEdge)) {
            Errors.throwTypeError(DirectedEdge.name, typeof (edge));
            return false;
        }
        return super.addEdge(edge);
    }

    getEdge(startNode: AbstractNode, endNode: AbstractNode): AbstractEdge {
        for (let edge of this.getEdges()) {
            let start = edge.getStartNode();
            let end = edge.getEndNode();
            if (start == startNode && end == endNode) {
                return edge;
            }
        }
        return null as any;

    }

   
}