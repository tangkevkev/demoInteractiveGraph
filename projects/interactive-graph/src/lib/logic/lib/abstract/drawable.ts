import { AbstractGrid } from "./aGrid";

/**
 * Drawable objects on the canvas should extend this class
 */
export abstract class Drawable {
    protected readonly priority: number;
    protected visibility: OPACITY = OPACITY.VISIBLE;

    constructor(priority: number) {
        this.priority = priority;
    }

    /**
     * @returns returns drawing priority 
     */
    getPriority(): number {
        return this.priority;
    }

    setVisibility(v: OPACITY) {
        this.visibility = v;
    }

    getVisibility(): OPACITY {
        return this.visibility;
    }

    update(ctx: CanvasRenderingContext2D, grid: AbstractGrid) {
        if (this.visibility == OPACITY.INVISIBLE)
            return;
        ctx.save();
        ctx.globalAlpha = (this.visibility == OPACITY.VISIBLE) ? 1.0 : 0.65;
        this.draw(ctx, grid);
        ctx.restore();
    }

    protected abstract draw(ctx: CanvasRenderingContext2D, grid: AbstractGrid):void;

    static isDrawable(object:any): object is Drawable {
        if (object == null)
            return false;
        const d = object as Drawable;
        return d.draw !== undefined;
    }
}

export enum OPACITY {
    VISIBLE,
    INVISIBLE,
    TRANSPARENT
}