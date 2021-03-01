import { Edge } from "../edge";
import { AbstractGrid } from "../../abstract/aGrid";
import { AbstractEdge } from "../../abstract/aEdge";
import { Colorable } from "../../abstract/colorable";

export class UndirectedEdge extends Edge {

    draw(ctx: CanvasRenderingContext2D, grid: AbstractGrid){
        super.draw(ctx, grid);
        let fromCoord: [number, number] = grid.getCoordinate(this.startNode);
        let toCoord: [number, number] = grid.getCoordinate(this.endNode);
        ctx.beginPath();
        ctx.moveTo(fromCoord[1], fromCoord[0]);
        ctx.lineTo(toCoord[1], toCoord[0]);
        ctx.stroke();
        ctx.closePath();            
    }

    equals(other: AbstractEdge): boolean {
        if (other == null)
            return false;
        let result = (other.getStartNode() == this.startNode && other.getEndNode() == this.endNode)
            || (other.getStartNode() == this.endNode && other.getEndNode() == this.startNode);

        return result;
    }

}