import { AbstractEdge } from "../abstract/aEdge";
import { Interactable } from "../abstract/interactable";
import { AbstractGrid } from "../abstract/aGrid";
import { Colorable } from "../abstract/colorable";

export abstract class Edge extends AbstractEdge implements Interactable{

    marginDistance: number = 6;
    eps: number = 0.001;

    draw(ctx: CanvasRenderingContext2D, grid: AbstractGrid){
        if(Colorable.isColorable(this)){
            let oldColor = this.getColor();
            this.resetColor();
            if(oldColor != this.getColor()){
                this.setColor(oldColor);
                ctx.lineWidth = 3;
            }
        }
    }
    
    //Assuming that the edge is beeing drawn as a straight line. Can be overriden if its not the case
    inPerimeter(coordinate: [number, number], grid: AbstractGrid): boolean {
        if (Interactable.isInteractable(this.startNode) && Interactable.isInteractable(this.endNode)) {
            if (this.startNode.inPerimeter(coordinate, grid)
                || this.endNode.inPerimeter(coordinate, grid)) {
                return false;
            }
        }
        let sCoord: [number, number] = grid.getCoordinate(this.startNode);
        let eCoord: [number, number] = grid.getCoordinate(this.endNode);

        //a straight vertical line
        if (Math.abs(sCoord[0] - eCoord[0]) < this.eps) {
            let x = sCoord[0];
            return Math.abs(coordinate[0] - x) <= this.marginDistance
                && coordinate[1] >= Math.min(sCoord[1], eCoord[1])
                && coordinate[1] <= Math.max(sCoord[1], eCoord[1]);
        }
        //a straight horizontal line
        if (Math.abs(sCoord[1] - eCoord[1]) < this.eps) {
            let y = sCoord[1];
            return Math.abs(coordinate[1] - y) <= this.marginDistance
                && coordinate[0] >= Math.min(sCoord[0], eCoord[0])
                && coordinate[0] <= Math.max(sCoord[0], eCoord[0]);
        }

        //not a straight line, compute the parameters of the linear function: f(x) = mx+b
        let m = 0;
        if (sCoord[0] > eCoord[0]) {
            m = (sCoord[1] - eCoord[1]) / (sCoord[0] - eCoord[0]);
        } else {
            m = (eCoord[1] - sCoord[1]) / (eCoord[0] - sCoord[0]);
        }
        let b = sCoord[0] * m - sCoord[1];
        let A = m;
        let B = -1;
        let C = -b;

        //compute minimal distance
        let dist = Math.abs(A * coordinate[0] + B * coordinate[1] + C) / (Math.sqrt(A * A + B * B));
        dist = Math.abs(dist);
        return (this.marginDistance - dist) >= 0 && coordinate[0] >= Math.min(sCoord[0], eCoord[0])
            && coordinate[0] <= Math.max(sCoord[0], eCoord[0]) && coordinate[1] >= Math.min(sCoord[1], eCoord[1])
            && coordinate[1] <= Math.max(sCoord[1], eCoord[1]);;
    }

    keyBoardEvent(k:KeyboardEvent){}
}