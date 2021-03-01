import { GraphGrid } from "../graph/graphGrid";

export class TreeGrid extends GraphGrid {
    MIN_ROW = 8;
    MIN_COL = 12;

    constructor(canvas: HTMLCanvasElement, numRows?: number, numCols?: number){
        super(canvas, numRows, numCols);
        this.windowRatio = 0.5;
    }

    initDimensionCombinatorialTree(depth: number, repetition: boolean, alphabetSize: number) {
        //Each level needs at least a row distance from each other
        if (repetition) {
            this.numCols = Math.pow(alphabetSize, depth) + 1;
        } else {
            let fac = 1;
            for (let i = 0; i < Math.min(depth, alphabetSize); i++) {
                fac *= (alphabetSize - i);
            }

            this.numCols = Math.max(this.MIN_ROW, fac + 1);
        }

        this.numRows = Math.max((depth -1)* 2, this.MIN_COL);


        if (window != null) {
            this.canvas.width = this.getCanvasWidth();
            this.canvas.height = this.getCanvasHeight();
            // this.setupCanvas(this.canvas);
        }

        console.log("New dimension: " + this.numCols + " " + this.numRows);
    }

    getRootCoordinate(): [number, number] {
        return this.getCoordinateCombinatorialTree(0, 0, 0);
    }

    getCoordinateCombinatorialTree(level: number, childNumber: number, totalChildNumber: number): [number, number] {
        let distancePerChild = this.getCanvasWidth() / (totalChildNumber + 2);

        let rowCoord: number = (((level * 2) + 1) * (1.5)*this.getNodeHeight());
        let colCoord = (distancePerChild * (childNumber + 1)) - this.getNodeWidth() / 2;

        return [rowCoord, colCoord];
    }
    getCanvasHeight(): number {
        return Math.max(
            (this.getCanvasWidth() / this.getColsNumber()) * this.getRowsNumber(),
        this.getCanvasWidth()*5/7);
    }


    initDimension(numRows: number, numCols: number) {
        this.numRows = numRows;
        this.numCols = numCols;
    }



    getNodeHeight(): number {
        return super.getNodeHeight() * 3 / 2;
    }


}