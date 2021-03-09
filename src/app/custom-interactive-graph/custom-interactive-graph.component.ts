import { Component, OnInit } from '@angular/core';
import { IGraph, GraphType, ImageSimpleUndirectedEdge, GraphGrid, 
    CustomImageVertex, InteractionType, GraphAlgorithm } from 'interactive-graph'

@Component({
    selector: 'app-custom-interactive-graph',
    templateUrl: './custom-interactive-graph.component.html',
    styleUrls: ['./custom-interactive-graph.component.css']
})
export class CustomInteractiveGraphComponent implements OnInit {

    graph: MyGraph = new MyGraph();
    
    nodeImages = [
        { name: 'house black', url: './assets/black_house.png' },
        { name: 'house yellow', url: './assets/yellow_house.png' },
        { name: 'house red', url: './assets/red_house.png' },
        { name: 'house green', url: './assets/green_house.png' }
    ]

    edgeImages = [
        { name: 'Street', url: './assets/street.png' },
        { name: 'Street with sidewalk', url: './assets/street_sidewalk.png' }
    ]

    activeNodeUrl: string = null as any;
    activeEdgeUrl: string = null as any;

    

    constructor() {
        /**
         * [Optional]
         * Add a listener/callback function to the interactive graph. Each time you interact with the grap the callback function will be called
         * 
         */

        this.graph.setCallBackFunction(this.graphListener)
    }

    /**
     * 
     * @param type describes how the user interacted with the graph (check the InteractionType enum)
     * @param object returns the object (could be a node or an edge) which has been interacted with or null
     */
    graphListener(type: InteractionType, object: any){
       /* console.log("Type: " + type);
        console.log("Object: " + object)

        if(object instanceof CustomImageVertex){
            console.log("Graphlistener: " + object.getImageLink())
        }*/
    }

    ngOnInit(): void {
    }

    setNodeImage(link: string) {
        this.activeNodeUrl = link;
        this.graph.setNodeImage(link);
        this.graph.setInteractionType(InteractionType.CREATE_NODE)
    }

    setEdgeImage(link: string) {
        this.activeEdgeUrl = link;
        this.graph.setEdgeImage(link);
        this.graph.setInteractionType(InteractionType.CREATE_EDGE)

    }

    /**
     * Compute and highlight a possible hamiltonpath
     */
    computeHamilton(){
        let solution = GraphAlgorithm.hamiltonPath(this.graph.getGraph());
        this.graph.highLight(solution[0], solution[1]);
    }



}

/**
 * MyGraph is a customized graph. When extending IGraph, you will need to implement newNode and newEdge. 
 * If you want to customize your graph you should extend from IGraph.
 * 
 * newNode returns a new node, everytime you create a new node on the canvas.
 * newEdge returns a new edge, everytime you create a new edge on the canvas
 * 
 * CustomImageVertex is a predefined class of the interactive-graph library. It displays an image as a node on the canvas.
 * ImageSimpleUndirectEdge is a predefined class of the interactive-graph library. It displays an image as an edge on the canvas
 */
export class MyGraph extends IGraph {

    private nodeLink: string = null as any
    private edgeLink: string = null as any

    constructor() {
        /**
         * 1st Argument: Specify the graph type (undirected, directed...)
         * 2st Argument: Pass a grid object (the grid is responsible for displaying the graph)
         * If you don't want to create a grid class yourself, just pick Graphgrid. Pass as first argument null and then
         * the dimension of the grid (this defines the amount of cells our canvas will contain (making nodes display bigger or smaller))
         */
        super(GraphType.UNDIRECTED_GRAPH, new GraphGrid(null as any, 3, 5))
    }

    /**
     * 
     * @param link, link to the image of the next node
     */
    setNodeImage(link: string) {
        this.nodeLink = link;
    }

    /**
     * 
     * @param link, link to the image of the next edge
     */
    setEdgeImage(link: string) {
        this.edgeLink = link;
    }

    keyBoardEvent() {
        return;
    }

    newNode(args: any[]): CustomImageVertex {
        if (this.nodeLink == null)
            return null as any

        let cs = new CustomImageVertex();
        cs.setImageLink(this.nodeLink)


        return cs;
    }

    newEdge(from: CustomImageVertex, to: CustomImageVertex): ImageSimpleUndirectedEdge {
        if(this.edgeLink == null)
            return null as any;
        let edge = new ImageSimpleUndirectedEdge(from, to);
        edge.setImageLink(this.edgeLink)
        return edge;
    }
}
