import { NameTreeNode } from "../../lib/tree/treeNodes/NameTreeNode";
import { AbstractGrid } from "../../lib/abstract/aGrid";
import { Interactable } from "../../lib/abstract/interactable";
import { Colorable } from "../../lib/abstract/colorable";
import { ImageVertex } from "../../lib/graph/vertices/ImageVertex";

export class CustomImageVertex extends ImageVertex
    implements Interactable, Colorable {

    protected standardColor = "black";//"#FFF6F6";
    protected color: any = this.standardColor;
    protected imageLoaded:boolean = false;
    protected image: CanvasImageSource = null as any;

    protected ctx: CanvasRenderingContext2D = null as any;
    protected grid: AbstractGrid = null as any;

    setImageLink(link: string){
        super.setImageLink(link)
        console.log("Custom image link: " + link)

        this.image = new Image();
        this.image.src = link;

        this.image.onload= () => {
            this.imageLoaded = true;

            if(this.ctx && this.grid){
                this.draw(this.ctx, this.grid)
            }
        };

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

    keyBoardEvent() { }

    inPerimeter(coordinate: [number, number], grid: AbstractGrid): boolean {
        let width: number = grid.getNodeWidth();
        let height: number = grid.getNodeHeight();
        let myCoord = grid.getCoordinate(this);
        myCoord = [myCoord[0]-height/2,myCoord[1]-width/2]
        
        if (coordinate[0] >= myCoord[0]&&
            coordinate[0] <= myCoord[0] + width) {
            if (coordinate[1] >= myCoord[1]
                && coordinate[1] <= myCoord[1] + height) {
                    return true;
            }
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D, grid: AbstractGrid) {
        if(!this.ctx || !this.grid){
            this.ctx = ctx;
            this.grid = grid;
        }
        let width: number = grid.getNodeWidth();
        let height: number = grid.getNodeHeight();
        let myCoord = grid.getCoordinate(this);
        myCoord = [myCoord[0]-height/2,myCoord[1]-width/2]


        //Keep Imageproportion

       

        ctx.beginPath();
        ctx.strokeStyle = this.color;

        if(this.imageLoaded){
            let ratio: number = width/Number(this.image.width);

            ctx.drawImage(this.image, myCoord[1], myCoord[0], width, Number(this.image.height)*ratio);
        }
        ctx.fillStyle = "white";
        ctx.strokeRect(myCoord[1], myCoord[0], width, height);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();



        
    }
}
