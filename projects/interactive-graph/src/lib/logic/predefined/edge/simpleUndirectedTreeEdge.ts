import { SimpleUndirectedEdge } from "./simpleUndirectedEdge";
import { Grid } from "../../lib/base/grid";
import { TreeGrid } from "../../lib/tree/treeGrid";

export class SimpleUndirectedTreeEdge extends SimpleUndirectedEdge {
    draw(ctx: CanvasRenderingContext2D, grid: Grid) {

        if (grid instanceof TreeGrid) {
            let nodeWidth = grid.getNodeWidth();
            let nodeHeight = grid.getNodeHeight();

            let fromCoord: [number, number] = grid.getCoordinate(this.startNode);
            let toCoord: [number, number] = grid.getCoordinate(this.endNode);
            ctx.beginPath();

            if (this.color != this.standardColor) {
                ctx.lineWidth = 3;
            }
            ctx.moveTo(fromCoord[1] + nodeWidth / 2, fromCoord[0] + nodeHeight);
            ctx.lineTo(toCoord[1] + nodeWidth / 2, toCoord[0]);
            ctx.strokeStyle = this.color;
            ctx.stroke();
            ctx.closePath();
        }
    }
}