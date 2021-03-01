import { NameTreeNode } from "../../lib/tree/treeNodes/NameTreeNode";
import { AbstractGrid } from "../../lib/abstract/aGrid";
import { Interactable } from "../../lib/abstract/interactable";
import { Colorable } from "../../lib/abstract/colorable";

export class RectangleNameTreeNode extends NameTreeNode
    implements Interactable, Colorable {

    protected standardColor = "black";//"#FFF6F6";
    protected color: any = this.standardColor;

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
        let myCoord = grid.getCoordinate(this);
        if (coordinate[0] >= myCoord[0] &&
            coordinate[0] <= myCoord[0] + 2*grid.getNodeWidth()) {
            if (coordinate[1] >= myCoord[1]
                && coordinate[1] <= myCoord[1] + 2*grid.getNodeHeight()) {
                    return true;
            }
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D, grid: AbstractGrid) {
        let myCoord = grid.getCoordinate(this);
        let width: number = grid.getNodeWidth();
        let height: number = grid.getNodeHeight();

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = "white";

        ctx.strokeRect(myCoord[1], myCoord[0], width, height);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
}
