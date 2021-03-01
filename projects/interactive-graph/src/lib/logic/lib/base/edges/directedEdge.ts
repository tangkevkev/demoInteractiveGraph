import { Edge } from "../edge";
import { AbstractGrid } from "../../abstract/aGrid";
import { AbstractEdge } from "../../abstract/aEdge";
import { Colorable } from "../../abstract/colorable";

export abstract class DirectedEdge extends Edge{
    draw(ctx: CanvasRenderingContext2D, grid: AbstractGrid){
        super.draw(ctx, grid);
        let fromCoord: [number, number] = grid.getCoordinate(this.startNode);
        let toCoord: [number, number] = grid.getCoordinate(this.endNode);
        ctx.beginPath();
        ctx.moveTo(fromCoord[1], fromCoord[0]);
        ctx.lineTo(toCoord[1], toCoord[0]);
        ctx.stroke();
        ctx.closePath();

        let dx = toCoord[1] - fromCoord[1];
        let dy = toCoord[0] - fromCoord[0];
        let angle = Math.atan2(dy, dx);
        ctx.beginPath();
        ctx.translate(toCoord[1], toCoord[0]);
        ctx.rotate(angle);
        let width = grid.getNodeHeight();
        let h = grid.getNodeHeight()/2;
        ctx.moveTo(-((width+h+2)),-h/2);
        ctx.lineTo(-width ,0 );
        ctx.lineTo(-((width+h+2)), h/2);
        
    /*     ctx.moveTo(-((width+h)), h/2);
       ctx.lineTo(-width ,0 );
        ctx.moveTo(-((width+h)),-h/2);
        ctx.lineTo(-((width+h)), h/2);*/

        ctx.closePath();
        ctx.stroke();
        ctx.fill();

    }
    equals(other: AbstractEdge): boolean{
        if(other == null)
            return false;
        return other.getStartNode() == this.startNode && other.getEndNode() == this.endNode;
    }

}