import { Grid } from "../../../lib/base/grid";
import { Colorable } from "../../../lib/abstract/colorable";
import { DirectedEdge } from "../../../lib/base/edges/directedEdge";
import { Imageable } from "../../../lib/abstract/imageable";
import { AbstractGrid } from "../../../lib/abstract/aGrid";

export class ImageSimpleDirectedEdge extends DirectedEdge implements Colorable, Imageable {
    standardColor: string = "black";
    color: string = this.standardColor;

    protected image: CanvasImageSource = null as any;
    protected imageLoaded: boolean = false;
    protected link: string = ""

    protected ctx: CanvasRenderingContext2D = null as any;
    protected grid: AbstractGrid = null as any;

    setImageLink(link: string) {
        this.image = new Image();
        this.image.src = link;

        this.image.onload = () => {
            this.imageLoaded = true;

            if (this.ctx && this.grid) {
                this.draw(this.ctx, this.grid)
            }
        };
    }

    getImageLink(): string {
        return this.link
    }


    draw(ctx: CanvasRenderingContext2D, grid: Grid) {
        ctx.save();
        if (!this.ctx || !this.grid) {
            this.ctx = ctx;
            this.grid = grid;
        }
        ctx.strokeStyle = this.color;
        let fromCoord: [number, number] = grid.getCoordinate(this.startNode);
        let toCoord: [number, number] = grid.getCoordinate(this.endNode);

        if (this.imageLoaded) {
            ctx.translate(fromCoord[1], fromCoord[0])
            let distance = Math.sqrt(Math.pow((fromCoord[0] - toCoord[0]), 2) + Math.pow((fromCoord[1] - toCoord[1]), 2))


            let opposite = toCoord[0] - fromCoord[0]
            let adjacent = toCoord[1] - fromCoord[1]
            let angle = Math.atan2(opposite, adjacent)
            ctx.rotate(angle)

            let height = grid.getNodeHeight() / 2

            let ratio = Number(this.image.height) / height;
            let newWidth = Number(this.image.width) / ratio;

            ctx.translate(-height / 2, -height / 2)

            let pattern = ctx.createPattern(this.image, 'repeat-x')
            if (pattern) {
                pattern.setTransform(new DOMMatrix().scale(1 / ratio, 1 / ratio))
                ctx.rect(0, 0, distance, height);
                ctx.fillStyle = pattern;

                ctx.fillRect(0, 0, distance, height)

                ctx.strokeStyle = this.color;
                
                let oldColor = this.getColor();
                this.resetColor();
                if (oldColor != this.getColor()) {
                    this.setColor(oldColor);
                    ctx.lineWidth = 3;
                }
                ctx.strokeRect(0, 0, distance, height)
            }            //ctx.drawImage(this.image, -height/2, -height/2, distance, height );

        }
        ctx.restore()
        //super.draw(ctx, grid);
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