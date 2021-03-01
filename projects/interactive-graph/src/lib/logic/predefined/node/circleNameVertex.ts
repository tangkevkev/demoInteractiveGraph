import { NameVertex } from "../../lib/graph/vertices/NameVertex";
import { AbstractGrid } from "../../lib/abstract/aGrid";
import { Interactable } from "../../lib/abstract/interactable";
import { Colorable } from "../../lib/abstract/colorable";

export class CircleNameVertex extends NameVertex implements Interactable, Colorable{
    protected standardColor = "white";//"#FFF6F6";
    protected color: any = this.standardColor;

    draw(ctx: CanvasRenderingContext2D, grid: AbstractGrid){
        let coord: [number, number] = grid.getCoordinate(this);
        let width: number = grid.getNodeWidth();
        let height: number = grid.getNodeHeight();

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = this.color;
        ctx.ellipse(coord[1], coord[0], width  , height, 0, 0, 2*Math.PI);
        ctx.closePath();       
        ctx.fill();
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        let textSize = 4*grid.getNodeHeight()/5;
        ctx.font = 'normal ' + textSize + 'px Arial';
        ctx.fillText(this.name, coord[1], coord[0]+textSize/4);
    }

    inPerimeter(coordinate: [number,number], grid: AbstractGrid){

        let nodeCoordinate: [number, number] = grid.getCoordinate(this);
        let width: number = grid.getNodeWidth();
        let height: number = grid.getNodeHeight();

        let dist: number = Math.pow(coordinate[0]-nodeCoordinate[0],2) 
        + Math.pow(coordinate[1]-nodeCoordinate[1], 2);

        let inP : boolean = dist <= width*width || dist <= height*height;
        return inP;
   
    }

    setColor(color: any){
        this.color = color;
    }

    getColor():any{
        return this.color;
    }

    resetColor(){
        this.color = this.standardColor;
    }

    keyBoardEvent(k : KeyboardEvent){}
  
}