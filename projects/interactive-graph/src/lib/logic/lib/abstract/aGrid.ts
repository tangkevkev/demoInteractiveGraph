import { AbstractGraph } from "./aGraph";
import { Drawable } from "./drawable";
import { Interactable } from "./interactable";

/**
 * The class AbstractGrid is abstract and extends the Drawable interface.
 * - used for storing position of drawable object (nodes, edges etc.)
 * - Defines scaling dimensions to scale the size of drawable object in respect to screen size.
 */
export abstract class AbstractGrid extends Drawable{
    private static readonly GRID_PRIORITY = 42;

    constructor(){
        super(42);
        window.addEventListener('resize', this.resize);
    }

    private resize = () => {
        this.onResize();
    }
    /**
     * Resize parameters when window is resizing
     */
    abstract onResize(): void;

    abstract reset(): void;

    /**
     * 
     * @param drawable, object to be drawn
     * @param coordinate, coordinate of @param drawable 
     */
    abstract addCoordinate(drawable: Drawable, coordinate: [number,number],
         round?:boolean, dragged?: boolean): void;

    /**
     * Should be called when deleting a drawable from the canvas
     * @param drawable, object to be deleted
     * @returns true if deletion was succesful
     */
    abstract deleteCoordinate(drawable: Drawable): boolean;
    /**
     * 
     * @param node on the graph
     * @returns coordinate of this node on the grid (drawing purpose)
     */
    abstract getCoordinate(drawable: Drawable): [number,number];     
    
    /**
     * @returns the count of rows of the virtual grid
     */
    abstract getRowsNumber(): number;

    /**
     * @returns the count of columns of the virtual grid
     */
    abstract getColsNumber(): number;

    /**
     * @returns the width of a node
     */
    abstract getNodeWidth(): number;

    /**
     * @returns the height of a node 
     */
    abstract getNodeHeight(): number;
    
    /**
     * @returns the width of the canvas
     */
    abstract getCanvasWidth(): number;
    
    /**
     * @returns the height of the canvas
     */
    abstract getCanvasHeight(): number;

    abstract getInteractable(coordinate: [number, number]): Interactable;
}

