IN PROGRESS

# interactive-graph

Simple and customizable Angular components to display & manage graphs.
<img src="https://github.com/tangkevkev/demoInteractiveGraph/blob/main/projects/interactive-graph/images/standard.png">
<img src="https://github.com/tangkevkev/demoInteractiveGraph/blob/main/projects/interactive-graph/images/custom.png">


<b>interactive-graph</b> Let's you manage graphs (create and connect nodes to edges), interact with the graph (moving nodes around, deleting nodes/edges, highlighting nodes/edges etc), running graph algorithms on your own graph! The display of nodes and edges is customizable (see the second picture).

For a demo see [DEMO](https://tangkevkev.github.io/demoInteractiveGraph/). And the [CODE for the demo](https://github.com/tangkevkev/demoInteractiveGraph). 



## Install
```
$ npm install --save interactive-graph
```

## USAGE
```js
// in app.module.ts
import { InteractiveGraphModule} from 'interactive-graph';

@NgModule({
  ...
  imports: [
        InteractiveGraphModule
        ...
  ],
  ...
})
export class AppModule { }
```

```html
<!-- in app.component.html -->
<interactive-graph [showAlgorithmOption]=true 
  [showGraphtypeOption]=true (emitGraph)="setGraph($event)">
</interactive-graph>
```

```js
// in app.component.ts
import { InteractiveGraph } from 'interactive-graph'

graph: InteractiveGraph = null as any;

//From this graph instance you can access its topology (get access to nodes and edges)
setGraph(graph: InteractiveGraph){
    this.graph = graph;
    //this.graph.getNodes();
    //this.graph.getEdges();
 }
 
 /**
 * This method will be triggered every time an user interacts with the graph.
 * @param interactionType describes how the user interacted with the graph (check the InteractionType enum file)
 * @param object returns the object (could be a node or an edge) which has been interacted with or null
 */
onChange(action: {interactionType: InteractionType, object: any}){
    //console.log(action);
  }
```

## Component documentation
There are exactly two angular components: interactive-graph and custom-interactive-graph. 
Both are basically identical in terms of Input and Output parameters. Except that in custom-interactive-graph you will need to pass your customized graph instance as an input to the component. In interactive-graph you won't need to create your own customized graph class, as you have access to 4 predefined graph implementations (undirected weighted graph, undirected graph, directed graph, directed weighted graph), from which you can choose from.

#### interactive-graph
The component (interactive-graph) has the following Input properties (most of them are disabled by default, you can "activate" them by need):

*`[graphType]`:number defines the type of graph you want to use 
    0: DIRECTED_WEIGHTED_GRAPH,
    1: UNDIRECTED_WEIGHTED_GRAPH,
    2: DIRECTED_UNWEIGHTED_GRAPH,
    3: UNDIRECTED_UNWEIGHTED_GRAPH)
    for example: <interactive-graph [graphType] = 2> if you want to use an directed unweighted graph
    
*`[isEditable]`:boolean hides or shows the tools to manipulate the graph(create node, edges, delete etc)

*`[isSTExercise]`:boolean shows the option to choose a source and a target node (suitable for exercises with source and target: shorest path etc.)

*`[hasUnit]`:boolean shows a input field to define the unit of your edges. The unit field will be displayed along the weight of an edge.
*`[language]`:string defines the language of the tools. You can choose between
  de: German
  fr: French
  en: English
*`[isMandatoryNodeExercise]`:boolean is a special feature which allows the user to highlight certain nodes. How you use this selection is up to you

*`[isPrefixNodeExercise]`:boolean is a special feature which allows the user to highlight a certain "prefix"-path. How you use this selection is up to you 

*`[showLanguageOption]`:boolean hides or shows the option to choose your preferred language

*`[showGraphtypeOption]`:boolean hides or shows the option to choose your preferred graph type

*`[showAlgorithmOption]`:boolean hides or shows the option to choose which algorithm you want to apply on your current graph

It has the following Outputs:

*`[emitGraph]` this output will emit the current graph instance to your component, you will need to define a method to receive this emit (see the USAGE section)

*`[graphListener]` this output will emit every interaction that is performed on your graph. It can be used to react accordingly depending on how the user interacts with the graph.

#### custom-interactive-graph
Has almost the same Inputs as interactive-graph. As additional input it has:

*`[graph]`:InteractiveGraph you can pass your customized graph instance as input to the custom-interactive-graph component

It has the same graphListener output as in interactive-graph.


## USAGE (custom-interactive-graph)

To customize your graph, you need to create a class which inherits from IGraph. You will need to implement 3 abstract methods.
- keyBoardEvent(), this method is triggered whenever a keyboardevent is applied. 
- newNode(args?: any[]): AbstractNode, this method is triggered whenever the user intends to create a new node. You can customize the look of your node (See second picture)
- abstract newEdge(from: AbstractNode, to: AbstractNode, args?: [any]): Edge, this method is triggered whenever the user intends to create a new edge. You can customize the look of your edge(See second picture).

You will need to use the custom-interactive-graph component, in order to use your customized graph. You will need to pass your graph as an Input value to this component.
This component is similar to the standard interactive graph component.

The following code shows you how the custom interactive-graph on the second picture has been produced.
```js
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

    

    constructor() {}

    /**
     * Add a listener/callback function to the interactive graph. Each time you interact with the grap the callback function will be called
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
```
```html
<div style="display: flex;">
    <div>
        <custom-interactive-graph [graph]="graph" [isSTExercise]=true>
        </custom-interactive-graph>
    </div>
    <div class="item-container">
        <label>Nodes</label>

        <div class="flex-container" *ngFor="let node of nodeImages" (click)="setNodeImage(node.url)">
            <div [ngClass]="{'chosen': node.url === (activeNodeUrl)}">
                <img [src]=node.url width=50px height=50px>
            </div>
        </div>
    </div>

    <div class="item-container">
        <label>Edges</label>

        <div class="flex-container" *ngFor="let edge of edgeImages" (click)="setEdgeImage(edge.url)">
            <div [ngClass]="{'chosen': edge.url === (activeEdgeUrl)}">
                <img [src]=edge.url width=50px height=50px>
            </div>
        </div>
    </div>
</div>
<div>
    <div style="margin-bottom: 10px;">
        <button (click)="computeHamilton()">Compute a hamilton path</button>
    </div>
</div>
```

## Licence

MIT © Kevin Tang
