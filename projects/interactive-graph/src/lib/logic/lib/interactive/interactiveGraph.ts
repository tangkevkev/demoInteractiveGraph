import { Interactable } from "../abstract/interactable";
import { Graph } from "../base/graph";
import { Grid } from "../base/grid";
import { Vertex } from "../base/vertex";
import { Edge } from "../base/edge";
import { Drawable, OPACITY } from "../abstract/drawable";
import { AbstractEdge } from "../abstract/aEdge";
import { AbstractNode } from "../abstract/aNode";
import { ActionHistory } from "./history";
import { InteractionType } from "./InteractionType";
import { Colorable } from "../abstract/colorable";
import { AbstractGrid } from "../abstract/aGrid";
import { AbstractGraph } from "../abstract/aGraph";
import { Weightable } from "../abstract/weightable";
import { NameVertex } from "../graph/vertices/NameVertex";

export abstract class InteractiveGraph extends Interactable {
    protected readonly graph: AbstractGraph;
    protected readonly grid: Grid;
    protected ctx: CanvasRenderingContext2D = null as any;
    protected canvas: HTMLCanvasElement = null as any;
    private interactionType: InteractionType = null as any;

    private edgeVertex: AbstractNode = null as any;

    //highlight
    protected selectColor: string = "#CCEEFF";
    protected highLightColor: string = "green";


    //used for solving exercises
    protected selectedNodes: AbstractNode[] = [];
    protected selectedEdges: AbstractEdge[] = [];

    //used for creating exercises
    protected sourceNode: AbstractNode = null as any;
    protected sourceNodeColor: string = "yellow";

    protected targetNode: AbstractNode = null as any;
    protected targetNodeColor: string = "red";

    protected mandatoryNodes: AbstractNode[] = [];
    protected mandatoryNodeColor: string = "orange";

    protected prefixNodes: AbstractNode[] = [];
    protected prefixNodeColor: string = "LightBlue";

    protected weightingEdge: boolean = false;
    protected renamingNode: boolean = false;

    protected highLightNodes: AbstractNode[] = [];
    protected highLightEdges: AbstractEdge[] = [];

    //Action history
    protected history: ActionHistory = null as any;
    protected activDrawable: Interactable = null as any;

    constructor(graph: AbstractGraph, grid: Grid, canvas?: HTMLCanvasElement) {
        super();
        NameVertex.ic = 0;
        this.graph = graph;
        this.grid = grid;
        if (canvas) {
            this.setCanvas(canvas)
        }
    }

    setCanvas(canvas: HTMLCanvasElement) {
        let context = canvas.getContext('2d');
        if (context)
            this.ctx = context
        else
            this.ctx = null as any
        this.canvas = canvas;

        this.history = new ActionHistory(this.canvas, this);

        this.graph.addDrawable(this.grid);

        this.weightingEdge = Weightable.isWeightable(this.newEdge(null as any, null as any));
        this.renamingNode = (this.newNode(["dummy"]) instanceof NameVertex);

        this.selectedNodes = [];
        this.selectedEdges = [];

        canvas.addEventListener('mouseout', this.mouseOutHandler, false);
        canvas.addEventListener('mousedown', this.mouseEventHandler, false);
        canvas.addEventListener('mousemove', this.mouseMoveHandler, false);
        canvas.addEventListener('dblclick', this.doubleClickHandler, false);
        window.addEventListener('keydown', this.keyBoardEventHandler, false);
        window.addEventListener('resize', this.updateHandler, false);
        this.setInteractionType(InteractionType.NULL);
        this.forceUpdate();
    }

    getNodes(): AbstractNode[] {
        if (this.graph) {
            return this.graph.getNodes();
        }
        return null as any;
    }

    getEdges(): AbstractEdge[] {
        if (this.graph) {
            return this.graph.getEdges();
        }
        return null as any;
    }

    getActive(): Interactable {
        return this.activDrawable;
    }

    getGrid(): AbstractGrid {
        return this.grid;
    }

    getGraph(): AbstractGraph {
        return this.graph;
    }

    forceUpdate() {
        this.graph.update(this.ctx, this.grid);
    }

    reset() {
        console.log("total reset");
        this.resetGraph();
        this.resetHighLightNodes();
        this.setInteractionType(InteractionType.NULL);

    }

    resetGraph() {
        console.log("Reset graph");
        this.graph.reset();
        this.grid.reset();
        this.history.resetHistory();
        this.graph.update(this.ctx, this.grid);
        this.selectedEdges = [];
        this.selectedNodes = [];
        this.prefixNodes = [];
        this.mandatoryNodes = [];
    }

    resetHighLightNodes() {
        if (this.highLightNodes != null && this.highLightNodes.length > 0) {
            this.highLightNodes.forEach(node => {
                if (Colorable.isColorable(node)) {
                    node.resetColor();
                }
            })
        }
        if (this.highLightEdges != null && this.highLightEdges.length > 0) {
            this.highLightEdges.forEach(edge => {
                if (Colorable.isColorable(edge)) {
                    edge.resetColor();
                }
            })
        }
        this.highLightEdges = [];
        this.highLightNodes = [];


        this.selectedNodes.forEach(node => {
            if (Colorable.isColorable(node)) {
                node.setColor(this.highLightColor);
            }
        })

        this.selectedEdges.forEach(edge => {
            if (Colorable.isColorable(edge)) {
                edge.setColor(this.highLightColor);
            }
        })

        if (this.sourceNode != null && Colorable.isColorable(this.sourceNode))
            this.sourceNode.setColor(this.sourceNodeColor);

        if (this.targetNode != null && Colorable.isColorable(this.targetNode))
            this.targetNode.setColor(this.targetNodeColor);

        this.mandatoryNodes.forEach(node => {
            if (Colorable.isColorable(node)) {
                node.setColor(this.mandatoryNodeColor);
            }
        })

        this.graph.update(this.ctx, this.grid);

    }

    /**
     * 
     * @param nodes nodes to highlight, pass null to not highlight any nodes
     * @param edges edges to highlight, pass null to not highlight any edges
     */
    highLight(nodes: AbstractNode[], edges: AbstractEdge[], color?: string) {
        this.resetHighLightNodes();
        this.highLightNodes = nodes;
        this.highLightEdges = edges;

        if (nodes != null)
            this.highLightNodes.forEach(node => {
                if (Colorable.isColorable(node)) {
                    node.setColor((color) ? color : this.highLightColor);
                }
            })

        if (edges != null)
            this.highLightEdges.forEach(edge => {
                if (Colorable.isColorable(edge)) {
                    edge.setColor((color) ? color : this.highLightColor);
                }
            })

        this.graph.update(this.ctx, this.grid);
    }

    highLightPath(nodes: AbstractNode[], edges?: AbstractEdge[], color?:string) {
        this.resetHighLightNodes();
        this.highLightNodes = nodes;

        if (nodes != null)
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                if (Colorable.isColorable(node)) {
                    node.setColor((color) ? color :"rgb(123," + (255 - ((i * 255) / nodes.length)) + ", 240)");
                }
            }

        if (edges != null) {
            this.highLightEdges = edges;
            for (let i = 0; i < edges.length; i++) {
                let edge = edges[i];
                if (Colorable.isColorable(edge)) {
                    edge.setColor((color) ? color :"rgb(123," + (255 - ((i * 255) / edges.length)) + ", 240)");
                }
            }
        }else{
            for(let i = 1; i < nodes.length; i++){
                let from = nodes[i-1];
                let to = nodes[i];
                let edge = this.graph.getEdge(from,to);
                if(edge && Colorable.isColorable(edge)){
                    edge.setColor((color) ? color :"rgb(123," + (255 - ((i * 255) / nodes.length)) + ", 240)");
                }
            }
        }

        this.graph.update(this.ctx, this.grid);

    }

    undoAction(steps?: number) {
        this.history.revertAction(steps);
        this.setInteractionType(InteractionType.NULL);
    }

    redoAction() {

    }

    private mouseMoveHandler = (e: MouseEvent) => {
        this.mouseMove(e);
    }

    private mouseOutHandler = (e: MouseEvent) => {
        this.mouseOut(e);
    }

    private movable: Drawable = null as any;

    private mouseOut(e: MouseEvent) {
        if (this.interactionType != InteractionType.MOVE_NODE)
            return;
        if (this.movable == null)
            return;

        this.canvas.style.cursor = 'default';
        this.add(this.movable, [e.offsetY, e.offsetX], false, false);
        this.graph.update(this.ctx, this.grid);
        this.resetLocalStored();
    }

    private mouseMove(e: MouseEvent) {
        if (this.interactionType == InteractionType.MOVE_NODE && this.movable != null) {
            this.add(this.movable, [e.offsetY, e.offsetX], false, true);
            this.graph.update(this.ctx, this.grid);
            this.canvas.style.cursor = 'move';
            return;
        }
        let interacted: Interactable = this.grid.getInteractable([e.offsetY, e.offsetX]);
        let needUpdate = false;
        needUpdate = needUpdate || this.mouseMoveHover(interacted);

        if (needUpdate)
            this.graph.update(this.ctx, this.grid);

    }

    private lastDrawable: Drawable = null as any;

    private mouseMoveHover(interacted: Interactable): boolean {
        let needUpdate: boolean = false;
        if (this.lastDrawable != null) {
            if (this.lastDrawable != this.edgeVertex)
                this.lastDrawable.setVisibility(OPACITY.VISIBLE);
            this.lastDrawable = null as any;
            needUpdate = true;
        }

        if (interacted == null) {
            this.canvas.style.cursor = 'default';
        } else {
            if (Drawable.isDrawable(interacted)) {
                this.lastDrawable = interacted;
                interacted.setVisibility(OPACITY.TRANSPARENT);
                needUpdate = true;
            }
            if (this.disableHover(interacted)) {
                this.canvas.style.cursor = 'default';
            } else {
                this.canvas.style.cursor = 'pointer';
            }
        }

        return needUpdate;
    }

    leftClick(e: MouseEvent) {
        let coordinate: [number, number] = [e.offsetY, e.offsetX]
        let interacted: Interactable = this.grid.getInteractable(coordinate);

        if (interacted == null) {
            this.leftClickOnEmptySpace(coordinate);
        } else {
            this.leftClickOnObject(interacted);
        }
        this.resetHighLightNodes();
        this.graph.update(this.ctx, this.grid);
    }

    /**
     * 
     * @param coordinate coordinate on the canvas, where leftclick was performed
     */
    protected leftClickOnEmptySpace(coordinate: [number, number]) {
        switch (this.interactionType) {
            case InteractionType.CREATE_NODE:
                let newNode = this.newNode();
                this.add(newNode, coordinate);
                this.history.addCreateNode(newNode);
                this.resetLocalStored();

                if (newNode instanceof NameVertex
                    && Interactable.isInteractable(newNode)) {
                    this.activDrawable = newNode;
                }

                break;
            case InteractionType.MOVE_NODE:
                this.resetLocalStored();
                break;
            default:
                this.resetLocalStored();
                break;
        }
        this.graph.update(this.ctx, this.grid);
    }

    /**
     * 
     * @param interacted Object on which a leftclick has been performed
     */
    protected leftClickOnObject(interacted: Interactable) {
        switch (this.interactionType) {
            case InteractionType.CREATE_EDGE:
                if (interacted instanceof AbstractNode) {
                    if (this.edgeVertex == null) {
                        this.edgeVertex = interacted;
                    } else {
                        if (this.edgeVertex != interacted) {
                            let edge = this.newEdge(this.edgeVertex, interacted);
                            this.add(edge);
                            this.history.addCreateEdge(edge);
                            this.resetLocalStored();
                            if (Weightable.isWeightable(edge))
                                this.activDrawable = edge;
                        }
                    }
                } else {
                    if (this.activDrawable == interacted)
                        this.activDrawable = null as any;
                    if (Weightable.isWeightable(interacted))
                        this.activDrawable = interacted;
                }
                break;
            case InteractionType.DELETE:
                if (interacted instanceof Drawable) {
                    if (interacted instanceof AbstractEdge) {
                        this.history.deleteEdge(interacted);
                    }
                    if (interacted instanceof AbstractNode) {
                        this.history.deleteNode(interacted);
                    }
                    this.delete(interacted);
                }
                break;
            case InteractionType.MOVE_NODE:
                if (interacted instanceof Drawable)
                    if (this.movable == interacted) {
                        this.grid.addCoordinate(null as any, null as any);
                        this.movable = null as any;
                        this.canvas.style.cursor = 'default';
                        this.graph.update(this.ctx, this.grid);
                    }
                    else {
                        this.movable = interacted;
                        if (this.movable instanceof AbstractNode)
                            this.history.addMove(this.movable);
                    }
                break;
            case InteractionType.SELECT_SOURCE_NODE:
                if (interacted instanceof AbstractNode) {
                    this.history.addSourceNode(this.sourceNode);
                    this.setSourceNode(interacted);
                }
                break;
            case InteractionType.SELECT_TARGET_NODE:
                if (interacted instanceof AbstractNode) {
                    this.history.addTargetNode(this.targetNode);
                    this.setTargetNode(interacted);
                }
                break;
            case InteractionType.CREATE_NODE:
                if (this.activDrawable == interacted)
                    this.activDrawable = null as any;
                if (interacted instanceof NameVertex)
                    this.activDrawable = interacted;
                break;
            case InteractionType.HIGHLIGHT_PATH:
                if (this.selectedNodes.length == 0) {
                    if (interacted instanceof AbstractNode) {
                        this.selectedNodes.push(interacted);
                        if (Colorable.isColorable(interacted)) {
                            interacted.setColor(this.highLightColor);
                        }
                    }
                } else {
                    if (interacted instanceof AbstractNode) {
                        let node = this.selectedNodes[this.selectedNodes.length - 1];
                        if (node == interacted) {
                            if (node != this.sourceNode) {
                                if (Colorable.isColorable(node)) {
                                    node.resetColor();
                                }
                                this.selectedNodes.pop();
                                if (this.selectedEdges.length > 0) {
                                    let edge = this.selectedEdges.pop();
                                    if (Colorable.isColorable(edge)) {
                                        edge.resetColor();
                                    }
                                }
                            }
                        } else {
                            let edge = this.graph.getEdge(node, interacted);
                            if (edge == null || this.selectedEdges.includes(edge))
                                return;
                            if (Colorable.isColorable(edge)) {
                                edge.setColor(this.highLightColor);
                            }
                            if (Colorable.isColorable(interacted)) {
                                interacted.setColor(this.highLightColor);
                            }
                            this.selectedNodes.push(interacted);
                            this.selectedEdges.push(edge);
                        }
                    }
                }
                break;
            case InteractionType.HIGHLIGHT_SIMPLE_PATH:
                if (this.selectedNodes.length == 0) {
                    if (interacted instanceof AbstractNode) {
                        this.selectedNodes.push(interacted);
                        if (Colorable.isColorable(interacted)) {
                            interacted.setColor(this.highLightColor);
                        }
                    }
                } else {
                    if (interacted instanceof AbstractNode) {
                        let node = this.selectedNodes[this.selectedNodes.length - 1];
                        if (node == interacted) {
                            if (node != this.sourceNode) {
                                if (Colorable.isColorable(node)) {
                                    node.resetColor();
                                }
                                this.selectedNodes.pop();
                                if (this.selectedEdges.length > 0) {
                                    let edge = this.selectedEdges.pop();
                                    if (Colorable.isColorable(edge)) {
                                        edge.resetColor();
                                    }
                                }
                            }
                        } else {
                            if (this.selectedNodes.includes(interacted))
                                return;
                            let edge = this.graph.getEdge(node, interacted);
                            if (edge == null || this.selectedEdges.includes(edge))
                                return;
                            if (Colorable.isColorable(edge)) {
                                edge.setColor(this.highLightColor);
                            }
                            if (Colorable.isColorable(interacted)) {
                                interacted.setColor(this.highLightColor);
                            }
                            this.selectedNodes.push(interacted);
                            this.selectedEdges.push(edge);
                        }
                    }
                }
                break;
            case InteractionType.HIGHLIGHT_EDGE:
                if (interacted instanceof AbstractEdge) {
                    if (this.selectedEdges.includes(interacted)) {
                        let index = this.selectedEdges.indexOf(interacted);
                        this.selectedEdges.splice(index, 1);
                        if (Colorable.isColorable(interacted)) {
                            interacted.resetColor();
                        }
                    } else {
                        this.selectedEdges.push(interacted);
                        if (Colorable.isColorable(interacted)) {
                            interacted.setColor(this.highLightColor);
                        }
                    }
                }
                break;
            case InteractionType.HIGHLIGHT_VERTEX_COVER:
                if (interacted instanceof AbstractNode) {
                    if (this.selectedNodes.includes(interacted)) {
                        let index = this.selectedNodes.indexOf(interacted);
                        this.selectedNodes.splice(index, 1);

                        if (Colorable.isColorable(interacted)) {
                            interacted.resetColor();
                        }
                    }
                    else {
                        this.selectedNodes.push(interacted);
                        if (Colorable.isColorable(interacted)) {
                            interacted.setColor(this.highLightColor);
                        }
                    }
                    this.selectedEdges.forEach(edge => {
                        if (Colorable.isColorable(edge)) {
                            edge.resetColor();
                        }
                    })
                    this.selectedEdges = [];

                    this.graph.getEdges().forEach(edge => {
                        this.selectedNodes.forEach(node => {
                            if (edge.getStartNode() == node || edge.getEndNode() == node) {
                                if (!this.selectedEdges.includes(edge)) {
                                    this.selectedEdges.push(edge);
                                    if (Colorable.isColorable(edge)) {
                                        edge.setColor(this.highLightColor);
                                    }
                                }
                            }
                        })
                    })
                }
                break;
            case InteractionType.SELECT_MANDATORY_NODE:
                if (interacted instanceof AbstractNode) {
                    this.setMandatoryNode(interacted);
                }
                break;
            case InteractionType.SELECT_PREFIX_NODES:
                if (interacted instanceof AbstractNode) {
                    this.setPrefixNode(interacted);
                }
                break;
            default:
                if (this.activDrawable == interacted) {
                    this.activDrawable = null as any;
                } else {
                    if (interacted instanceof NameVertex
                        || Weightable.isWeightable(interacted))
                        this.activDrawable = interacted;
                }
                break;
        }
        this.forceUpdate();
    }

    private resetLocalStored() {
        if (this.edgeVertex)
            this.edgeVertex.setVisibility(OPACITY.VISIBLE);
        if (this.lastDrawable)
            this.lastDrawable.setVisibility(OPACITY.VISIBLE);
        if (this.movable) {
            this.movable.setVisibility(OPACITY.VISIBLE);
            this.add(this.movable, this.grid.getCoordinate(this.movable), false, false);
        }

        this.movable = null as any;
        this.edgeVertex = null as any;
        this.lastDrawable = null as any;
        this.activDrawable = null as any;

        this.graph.update(this.ctx, this.grid);

    }

    resetActive() {
        this.activDrawable = null as any;
    }

    changeValue(active: Interactable, value: any) {
        if (active instanceof NameVertex) {
            active.setName(value);
        }
        if (Weightable.isWeightable(active)) {
            let num = Number(value);
            if (!Number.isNaN(num)) {
                active.setWeight(num);
            }
        }
        this.graph.update(this.ctx, this.grid);
    }


    /**
     * Can be overwritten to disable hovering effects on certain objects
     * @param interactable, current object on which the mouse is pointed to
     */
    disableHover(interactable: Interactable): boolean {

        return false;
    }

    getValue(active: Interactable): any {
        if (active instanceof NameVertex) {
            return active.getName();
        }
        if (Weightable.isWeightable(active)) {
            return active.getWeight();
        }
        return null;
    }

    abstract newNode(args?: any[]): AbstractNode;
    abstract newEdge(from: Vertex, to: Vertex, args?: [any]): Edge;


    private mouseEventHandler = (e: MouseEvent) => {
        switch (e.button) {
            case 0:
                this.leftClick(e); break;
            case 2:
            //rightclick not needed    
            //this.rightClick(e); break;
            default:
                ;
        }
        this.graph.update(this.ctx, this.grid);
    }

    private keyBoardEventHandler = (k: KeyboardEvent) => {
        this.keyBoardEvent(k);

        switch (k.key) {
            case 'z':
                if (k.ctrlKey) {
                    this.history.revertAction();
                } break;
        }


    }

    add(drawable: Drawable, coordinate?: [number, number], round?: boolean, move?: boolean) {
        let c: [number, number] = (coordinate == undefined) ? [0, 0] : coordinate;
        let success: boolean;
        if (drawable instanceof AbstractNode) {
            success = this.graph.addNode(drawable);
        }
        else if (drawable instanceof AbstractEdge) {
            success = this.graph.addEdge(drawable);
        } else {
            success = this.graph.addDrawable(drawable);
        }
        if (move)
            this.grid.addCoordinate(drawable, c, (round == undefined) ? false : round, move);
        if (success)
            this.grid.addCoordinate(drawable, c, (round == undefined) ? false : round, move);

    }

    private delete(drawable: Drawable) {
        if (drawable instanceof AbstractNode) {
            let delEdges: AbstractEdge[] = [];
            this.graph.getEdges().forEach(e => {
                if (e.getStartNode() == drawable
                    || e.getEndNode() == drawable)
                    delEdges.push(e);
            });
            for (let i = 0; i < delEdges.length; i++) {
                this.delete(delEdges[i]);
            }
            this.graph.deleteNode(drawable);

            if (drawable == this.sourceNode) {
                this.sourceNode = null as any;
            }

            if (drawable == this.targetNode) {
                this.targetNode = null as any;
            }
        }
        else if (drawable instanceof Edge) {
            this.graph.deleteEdge(drawable);
        } else {
            this.graph.deleteDrawable(drawable);
        }
        this.grid.deleteCoordinate(drawable);
        this.resetLocalStored();

    }


    private updateHandler = () => {
        this.graph.update(this.ctx, this.grid);
    }

    private doubleClickHandler = (e: MouseEvent) => {
        let coordinate: [number, number] = [e.offsetY, e.offsetX];
        let interacted: Interactable = this.grid.getInteractable(coordinate);

        if (interacted != null) {
            this.activDrawable = interacted;
        }

        this.graph.update(this.ctx, this.grid);

    }

    inPerimeter(coordinate: [number, number]): boolean {
        return false;
    }

    setInteractionType(type: InteractionType) {
        this.interactionType = type;
        this.resetLocalStored();
    }

    getInteractionType(): InteractionType {
        return this.interactionType;
    }

    setMandatoryNode(node: AbstractNode) {
        let interacted = node;
        if (interacted instanceof AbstractNode) {
            if (this.prefixNodes.includes(interacted) || this.sourceNode == interacted
                || this.targetNode == interacted)
                return;
            if (this.mandatoryNodes.includes(interacted)) {
                let index = this.mandatoryNodes.indexOf(interacted);
                this.mandatoryNodes.splice(index, 1);
                if (Colorable.isColorable(interacted))
                    interacted.resetColor();
            } else {
                this.mandatoryNodes.push(interacted);
                if (Colorable.isColorable(interacted))
                    interacted.setColor(this.mandatoryNodeColor);
            }
        }

    }

    setPrefixNode(node: AbstractNode) {
        let interacted = node;
        if (interacted instanceof AbstractNode) {
            if (this.mandatoryNodes.includes(interacted)
                || this.targetNode == interacted)
                return;
            if (this.prefixNodes.includes(interacted)) {
                let lastNode = this.prefixNodes.pop();
                if (lastNode == interacted) {
                    if (Colorable.isColorable(lastNode))
                        lastNode.resetColor();
                    if (this.prefixNodes.length > 0) {
                        let prelastNode = this.prefixNodes.pop();
                        if (prelastNode != null) {
                            let edge = this.graph.getEdge(prelastNode, lastNode);
                            if (Colorable.isColorable(edge)) {
                                edge.resetColor();
                            }

                            this.prefixNodes.push(prelastNode);
                        }
                    }
                } else {
                    if (lastNode != null)
                        this.prefixNodes.push(lastNode);
                }
            } else {
                if (this.prefixNodes.length == 0) {
                    this.prefixNodes.push(interacted);
                    if (Colorable.isColorable(interacted))
                        interacted.setColor(this.prefixNodeColor);
                } else {
                    let lastNode = this.prefixNodes.pop();
                    if (lastNode != null) {
                        this.prefixNodes.push(lastNode);
                        let edge = this.graph.getEdge(lastNode, interacted);
                        if (edge != null) {
                            this.prefixNodes.push(interacted);
                            if (Colorable.isColorable(interacted))
                                interacted.setColor(this.prefixNodeColor);
                            if (Colorable.isColorable(edge))
                                edge.setColor(this.prefixNodeColor);
                        }
                    }
                }
            }
        }

    }

    setSourceNode(node: AbstractNode) {
        if (this.sourceNode != null && Colorable.isColorable(this.sourceNode)) {
            this.sourceNode.resetColor();
        }

        if (this.sourceNode == node) {
            this.sourceNode = null as any;
        } else {
            this.sourceNode = node;

            if (this.sourceNode == null)
                return;

            if (Colorable.isColorable(this.sourceNode)) {
                this.sourceNode.setColor(this.sourceNodeColor);
            }
        }

    }

    setSourceNodeColor(color: string) {
        this.sourceNodeColor = color;
    }

    setTargetNode(node: AbstractNode) {
        if (this.targetNode != null && Colorable.isColorable(this.targetNode)) {
            this.targetNode.resetColor();
        }

        if (this.targetNode == node) {
            this.targetNode = null as any;
        } else {
            this.targetNode = node;
            if (this.targetNode == null)
                return;
            if (Colorable.isColorable(this.targetNode)) {
                this.targetNode.setColor(this.targetNodeColor);
            }
        }
    }

    setTargetNodeColor(color: string) {
        this.targetNodeColor = color;
    }

    getSourceNode(): AbstractNode {
        if (this.graph.getNodes().includes(this.sourceNode)) {
            return this.sourceNode;
        }
        this.sourceNode = null as any;
        return this.sourceNode;
    }

    getTargetNode(): AbstractNode {
        if (this.graph.getNodes().includes(this.targetNode)) {
            return this.targetNode;
        }
        this.targetNode = null as any;
        return this.targetNode;
    }

    initSelected(startNode?: boolean) {
        if (startNode == undefined || startNode == false) {
            return;
        }
        if (this.sourceNode) {
            this.selectedNodes.push(this.sourceNode)
        }
        this.forceUpdate();
    }

    resetSelected() {
        if (this.selectedNodes != null) {
            this.selectedNodes.forEach(node => {
                if (Colorable.isColorable(node)) {
                    node.resetColor();
                }
            })
        }
        if (this.selectedEdges != null) {
            this.selectedEdges.forEach(edge => {
                if (Colorable.isColorable(edge)) {
                    edge.resetColor();
                }
            })
        }
        if (this.sourceNode && this.targetNode) {
            if (Colorable.isColorable(this.sourceNode)
                && Colorable.isColorable(this.targetNode)) {
                this.sourceNode.setColor(this.sourceNodeColor);
                this.targetNode.setColor(this.targetNodeColor);
            }
        }
        this.mandatoryNodes.forEach(node => {
            if (Colorable.isColorable(node)) {
                node.setColor(this.mandatoryNodeColor);
            }
        })

        this.selectedNodes = [];
        this.selectedEdges = [];
    }

    getMandatoryNodes(): AbstractNode[] {
        return this.mandatoryNodes;
    }

    getPrefixNodes(): AbstractNode[] {
        return this.prefixNodes;
    }

    getSelectedNodes(): AbstractNode[] {
        return this.selectedNodes;
    }

    getSelectedEdges(): AbstractEdge[] {
        return this.selectedEdges;
    }



}

