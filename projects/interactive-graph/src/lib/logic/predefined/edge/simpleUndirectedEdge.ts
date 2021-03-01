import { UndirectedEdge } from "../../lib/base/edges/undirectedEdge";
import { Grid } from "../../lib/base/grid";
import { Colorable } from "../../lib/abstract/colorable";
import { Interactable } from "../../lib/abstract/interactable";
import { AbstractGrid } from "../../lib/abstract/aGrid";

export class SimpleUndirectedEdge extends UndirectedEdge implements Colorable {
    color: string = "black";
    standardColor: string = "black";

    draw(ctx: CanvasRenderingContext2D, grid: Grid) {
        let fromCoord: [number, number] = grid.getCoordinate(this.startNode);
        let toCoord: [number, number] = grid.getCoordinate(this.endNode);
        ctx.beginPath();

        if(this.color != this.standardColor){
            ctx.lineWidth = 3;
        }
        ctx.moveTo(fromCoord[1], fromCoord[0]);
        ctx.lineTo(toCoord[1], toCoord[0]);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    }

    setColor(color: any) {
        this.color = color;
    }

    getColor(): any {
        return this.color;
    }

    resetColor() {
        this.color = this.standardColor;
    }
   

}