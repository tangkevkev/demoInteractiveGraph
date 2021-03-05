import { Colorable } from "../../../lib/abstract/colorable";
import { AbstractGrid } from "../../../lib/abstract/aGrid";
import { WeightedDirectedEdge } from "../../../lib/base/edges/weightedDirectedEdge";
import { Imageable } from "../../../lib/abstract/imageable";
import { Grid } from "../../../lib/base/grid";

export class ImageSimpleDirectedWeightedEdge extends WeightedDirectedEdge  implements Colorable, Imageable {
    standardColor: string = "black";
    color: string = this.standardColor;

    protected image: CanvasImageSource = null as any;
    protected imageLoaded:boolean = false;
    protected link: string = ""

    protected ctx: CanvasRenderingContext2D = null as any;
    protected grid: AbstractGrid = null as any;

    setImageLink(link: string){
        this.image = new Image();
        this.image.src = link;

        this.image.onload= () => {
            this.imageLoaded = true;

            if(this.ctx && this.grid){
                this.draw(this.ctx, this.grid)
            }
        };
    }

    getImageLink(): string{
        return this.link
    }


    draw(ctx: CanvasRenderingContext2D, grid: Grid) {
        if(!this.ctx || !this.grid){
            this.ctx = ctx;
            this.grid = grid;
        }
        ctx.strokeStyle = this.color;
        let fromCoord: [number, number] = grid.getCoordinate(this.startNode);
        let toCoord: [number, number] = grid.getCoordinate(this.endNode);
        
        if(this.imageLoaded){
            ctx.drawImage(this.image, fromCoord[1], fromCoord[0]);
        }

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