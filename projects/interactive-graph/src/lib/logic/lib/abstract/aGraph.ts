import { AbstractNode } from "./aNode";
import { AbstractEdge } from "./aEdge";
import { Drawable } from "./drawable";
import { AbstractGrid } from "./aGrid";
import { Errors } from "../errors";
import { DirectedGraph } from "../graph/directedGraph";

/**
 * The class AbstractGraph is Abstract and extends the Drawable interface.
 * Logical graph representation: 
 * - Keeps a reference to the nodes and edges on the graph.
 * - Draws the graph
 */

export abstract class AbstractGraph extends Drawable {
    protected nodes: AbstractNode[] = [];
    protected edges: AbstractEdge[] = [];
    protected otherDrawable: Drawable[] = [];
    private static readonly GRAPH_PRIORITY = 42;

    constructor() {
        super(AbstractGraph.GRAPH_PRIORITY);
    }
    /**
     * Drawing the graph on a canvas referenced by @param ctx
     */
    draw(ctx: CanvasRenderingContext2D, grid: AbstractGrid) {

        let toDraw: Drawable[] = [];
        toDraw.push(...this.nodes, ...this.edges, ...this.otherDrawable);

        toDraw = toDraw.sort(function (a, b) {
            return a.getPriority() < b.getPriority() ? 1 : -1;
        });

        toDraw.forEach(tD => {
            tD.update(ctx, grid);
        });/*
        this.edges.forEach(edge => {
            edge.update(ctx, grid);
        })

        this.nodes.forEach(node => {
            node.update(ctx, grid);
        })

        this.otherDrawable.forEach(drawable => {   
            drawable.update(ctx, grid);
        })

       //t this.setupCanvas(ctx.canvas);
    */
    }

    setupCanvas(canvas: HTMLCanvasElement) {
        // Get the device pixel ratio, falling back to 1.
        var dpr = window.devicePixelRatio || 1;
        // Get the size of the canvas in CSS pixels.
        var rect = canvas.getBoundingClientRect();
        // Give the canvas pixel dimensions of their CSS
        // size * the device pixel ratio.
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        var ctx = canvas.getContext('2d');
        // Scale all drawing operations by the dpr, so you
        // don't have to worry about the difference.
        if (ctx != null)
            ctx.scale(dpr, dpr);
    }

    reset() {
        this.edges = [];
        this.nodes = [];
        this.otherDrawable = [];
    }

    getEdges(): AbstractEdge[] {
        return this.edges;
    }

    getNodes(): AbstractNode[] {
        return this.nodes;
    }

    update(ctx: CanvasRenderingContext2D, grid: AbstractGrid) {
        ctx.save();
        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // Restore the transform
        ctx.clearRect(0, 0, grid.getCanvasWidth(), grid.getCanvasHeight());
        this.draw(ctx, grid);
        ctx.restore();


    }

    /**
     * add @param node to the graph
     */
    addNode(node: AbstractNode): boolean {
        if (Errors.throwNullError(node))
            return false;
        if (!this.nodes.includes(node)) {
            this.nodes.push(node);
            return true;
        }
        return false;
    }

    /**
     * delete @param node from the graph
     */
    deleteNode(node: AbstractNode): boolean {
        if (Errors.throwNullError(node))
            return false;

        let index = this.nodes.indexOf(node);
        if (index >= 0) {
            this.nodes.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * add @param edge to the graph
     */
    addEdge(edge: AbstractEdge): boolean {
        if (Errors.throwNullError(edge))
            return false;
        for (let e of this.edges) {
            if (e.equals(edge) || e == edge) {
                return false;
            }
        }
        this.edges.push(edge);
        return true;
    }

    /**
     * delete @param edge from the graph 
     */
    deleteEdge(edge: AbstractEdge): boolean {
        if (Errors.throwNullError(edge))
            return false;
        let i: number = this.edges.indexOf(edge);
        if (i >= 0) {
            this.edges.splice(i, 1);
            return true;
        }

        for (let e of this.edges) {
            if (e.equals(edge)) {
                i = this.edges.indexOf(edge);
                this.edges.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    abstract getEdge(startNode: AbstractNode, endNode: AbstractNode): AbstractEdge



    /**
     * add @param drawable to be drawn on the graph
     */
    addDrawable(drawable: Drawable): boolean {
        if (Errors.throwNullError(drawable))
            return false;
        if (!this.otherDrawable.includes(drawable))
            return false;
        this.otherDrawable.push(drawable);
        return true;
    }

    /**
     * delete @param drawable to be drawn
     */
    deleteDrawable(drawable: Drawable): boolean {
        if (Errors.throwNullError(drawable))
            return false;
        let index: number = this.otherDrawable.indexOf(drawable);
        if (index >= 0) {
            this.otherDrawable.splice(index, 1);
            return true;
        }
        return false;
    }


}