import { DirectedEdge } from "./directedEdge";
import { AbstractGrid } from "../../abstract/aGrid";
import { Weightable } from "../../abstract/weightable";
import { Colorable } from "../../abstract/colorable";
import { UndirectedEdge } from "./undirectedEdge";

export class WeightedUndirectedEdge extends UndirectedEdge implements Weightable {

    private weight: number = 0;
    private unit: string = "";


    draw(ctx: CanvasRenderingContext2D, grid: AbstractGrid) {
        super.draw(ctx, grid);
        this.drawWeight(ctx, grid);
    }

    protected drawWeight(ctx: CanvasRenderingContext2D, grid: AbstractGrid) {
        let fromCoord: [number, number] = grid.getCoordinate(this.startNode);
        let toCoord: [number, number] = grid.getCoordinate(this.endNode);
        ctx.restore();
        ctx.save();
        let dx = Math.abs(toCoord[1] - fromCoord[1]);
        let dy = Math.abs(toCoord[0] - fromCoord[0]);
        let trd = Math.sqrt(dx * dx + dy * dy) / 10;


        let mid: [number, number] = [((toCoord[1] + fromCoord[1]) / 2),
        ((toCoord[0] + fromCoord[0]) / 2)];


        ctx.translate(mid[0], mid[1]);
        let textSize = 5 * grid.getNodeHeight() / 9;
        ctx.font = 'normal ' + textSize + 'px Arial';
        ctx.textAlign = "center";
        if (Colorable.isColorable(this)) {
            ctx.fillStyle = this.getColor();
        }

        ctx.fillText(this.getWeight()+ "" + this.unit, (dy >= dx) ? textSize : 0
            , (dy >= dx) ? 0 : textSize);
        ctx.restore();
    }

    setWeight(weight: number) {
        this.weight = weight;
    }

    getWeight(): number {
        return this.weight;
    }

    setUnit(unit: string) {
        this.unit = unit;
    }

    getUnit(): string {
        return this.unit;
    }

}