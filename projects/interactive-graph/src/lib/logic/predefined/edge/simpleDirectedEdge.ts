import { Grid } from "../../lib/base/grid";
import { Colorable } from "../../lib/abstract/colorable";
import { DirectedEdge } from "../../lib/base/edges/directedEdge";

export class SimpleDirectedEdge extends DirectedEdge implements Colorable {
    standardColor: string = "black";
    color: string = this.standardColor;

    draw(ctx: CanvasRenderingContext2D, grid: Grid) {
        ctx.strokeStyle = this.color;
        super.draw(ctx, grid);
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