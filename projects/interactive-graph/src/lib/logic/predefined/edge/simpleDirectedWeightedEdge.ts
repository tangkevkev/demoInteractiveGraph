import { Colorable } from "../../lib/abstract/colorable";
import { AbstractGrid } from "../../lib/abstract/aGrid";
import { WeightedDirectedEdge } from "../../lib/base/edges/weightedDirectedEdge";

export class SimpleDirectedWeightedEdge extends WeightedDirectedEdge implements Colorable{
    standardColor: string = "black";
    color: string = this.standardColor;

    draw(ctx: CanvasRenderingContext2D, grid : AbstractGrid){
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        super.draw(ctx, grid);
    }

    setColor(color: string){
        this.color = color;
    }

    getColor(): string{
        return this.color;
    }

    resetColor(){
        this.color = this.standardColor;
    }

}