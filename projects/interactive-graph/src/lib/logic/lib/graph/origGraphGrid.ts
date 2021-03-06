import { AbstractGrid } from "../abstract/aGrid";
import { Drawable, OPACITY } from "../abstract/drawable";
import { Grid } from "../base/grid";
import { Interactable } from "../abstract/interactable";
import { AbstractNode } from "../abstract/aNode";

export class GraphGrid extends Grid {
    protected numRows: number;
    protected numCols: number;
    protected canvas: HTMLCanvasElement = null as any;

    drawableMapping: Map<Drawable, [number, number]>;

    static readonly DEFAULT_NUMROW: number = 8;
    static readonly DEFAULT_NUMCOL: number = 13;

    protected windowRatio: number = 0.35;

    constructor(canvas?: HTMLCanvasElement, numRows?: number, numCols?: number) {
        super();
        this.numRows = (numRows == undefined) ? GraphGrid.DEFAULT_NUMROW : numRows;
        this.numCols = (numCols == undefined) ? GraphGrid.DEFAULT_NUMCOL : numCols;
        if (canvas)
            this.canvas = canvas;
        this.drawableMapping = new Map();
        this.setVisibility(OPACITY.INVISIBLE);

        if (window != null) {
            if (canvas) {
                canvas.width = this.getCanvasWidth();
                canvas.height = this.getCanvasHeight();
            }
            // this.setupCanvas(this.canvas);
        }
    }

    reset() {
        this.drawableMapping = new Map();
    }


    setupCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        // Get the device pixel ratio, falling back to 1.
        var dpr = window.devicePixelRatio || 1;
        // Get the size of the canvas in CSS pixels.
        var rect = canvas.getBoundingClientRect();
        // Give the canvas pixel dimensions of their CSS
        // size * the device pixel ratio.
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        var ctx = canvas.getContext('2d');

        canvas.width = this.getCanvasWidth();
        canvas.height = this.getCanvasHeight();
        // Scale all drawing operations by the dpr, so you
        // don't have to worry about the difference.
        if (ctx != null)
            ctx.scale(dpr, dpr);
    }


    draw(ctx: CanvasRenderingContext2D, grid: AbstractGrid) {
        let cellHeight: number = this.getCanvasHeight() / this.getRowsNumber();
        let cellWidth: number = this.getCanvasWidth() / this.getColsNumber();
        for (let i: number = 0; i < this.numRows; i++) {
            ctx.moveTo(0, (i + 1) * cellHeight);
            ctx.lineTo(this.getCanvasWidth(), (i + 1) * cellHeight);
            ctx.stroke();
        }

        for (let i: number = 0; i < this.numCols; i++) {
            ctx.moveTo((i + 1) * cellWidth, 0);
            ctx.lineTo((i + 1) * cellWidth, this.getCanvasHeight());
            ctx.stroke();
        }
    }

    onResize() {
        this.canvas.width = this.getCanvasWidth();
        this.canvas.height = this.getCanvasHeight();
    }

    draggedDrawable: Drawable = null as any;

    addCoordinate(drawable: Drawable, coordinate: [number, number], round?: boolean, dragged?: boolean) {
        if (dragged != undefined && dragged) {
            this.draggedDrawable = drawable;
        } else {
            this.draggedDrawable = null as any;
        }

        if (drawable == null) {
            this.draggedDrawable = null as any;
            return;
        }


        this.drawableMapping.set(drawable, this.convert(coordinate, round == undefined ? false : round));
    }

    getCoordinate(drawable: Drawable): [number, number] {
        if (this.drawableMapping.has(drawable) && this.drawableMapping.get(drawable)) {
            let coordinate = this.drawableMapping.get(drawable)
            if (coordinate != undefined)
                return this.reconvert(coordinate, drawable);
        }
        return null as any;
    }

    getInteractable(coordinate: [number, number]): Interactable {
        let res: Interactable = null as any;
        this.drawableMapping.forEach((value: [number, number], key: Drawable) => {
            if (Interactable.isInteractable(key)) {
                if (key.inPerimeter(coordinate, this)) {
                    res = key;
                }
            }
        })
        return res;

    }




    private convert(coordinate: [number, number], round?: boolean): [number, number] {
        let cellWidth: number = this.getCanvasWidth() / (this.getColsNumber() * 2);
        let cellHeight: number = this.getCanvasHeight() / (this.getRowsNumber() * 2);

        let col: number = (coordinate[0] / cellWidth);
        let row: number = (coordinate[1] / cellHeight)

        return [round ? Math.floor(col) : col, round ? Math.floor(row) : row];
    }

    public convertCoordinateToRaw(coordinate: [number, number], obj?: Drawable): [number, number] {
        let c: [number, number] = [coordinate[0] * 2, coordinate[1] * 2];
        return this.reconvert(c, obj);
    }

    private reconvert(coordinate: [number, number], obj?: Drawable): [number, number] {
        let cellWidth: number = this.getCanvasWidth() / (this.getColsNumber() * 2);
        let cellHeight: number = this.getCanvasHeight() / (this.getRowsNumber() * 2);

        //To avoid blurrage we use 0.5 margins
        let x = coordinate[0] * cellWidth;
        let y = coordinate[1] * cellHeight;

        x = Math.floor(x);
        y = Math.floor(y);

        if (obj == undefined || obj == this.draggedDrawable || !(obj instanceof AbstractNode))
            return [x, y];

        x = (Math.floor(coordinate[0]) + 0.5) * cellWidth;
        y = (Math.floor(coordinate[1]) + 0.5) * cellHeight;
        return [x, y];
    }



    deleteCoordinate(drawable: Drawable): boolean {

        if (!this.drawableMapping.has(drawable))
            return false;
        this.drawableMapping.delete(drawable);
        return true;
    }

    printInformation() {
        this.drawableMapping.forEach((value: [number, number], key: Drawable) => {
            console.log("coordinate : " + value);
            console.log("reconvert: " + this.reconvert(value));

        })
    }

    getCanvasWidth(): number {
        let wRatio = this.windowRatio;
        return window.innerWidth * wRatio;
        //return this.canvas.offsetWidth;
    }

    getCanvasHeight(): number {
        return (this.getCanvasWidth() / this.getColsNumber()) * this.getRowsNumber();
    }

    getNodeWidth(): number {
        return (this.getCanvasWidth() / this.getColsNumber()) / 2;
    }

    getNodeHeight(): number {
        return (this.getCanvasHeight() / this.getRowsNumber()) / 2;
    }

    getColsNumber() {
        return this.numCols;
    }

    getRowsNumber() {
        return this.numRows;
    }
}

