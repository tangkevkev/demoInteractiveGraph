import { Vertex } from 'dist/interactive-graph/lib/logic/lib/base/vertex';
import { IGraph, GraphType, NameVertex, CircleNameVertex, ImageSimpleUndirectedEdge, GraphGrid, CustomImageVertex, SimpleUndirectedEdge } from 'interactive-graph'


export class MyGraph extends IGraph {

    static counter: number = 0;

    constructor() {
        super(GraphType.UNDIRECTED_GRAPH, new GraphGrid(null as any, 4, 6))
    }

    keyBoardEvent() {
        return;
    }

    newNode(args: any[]): CustomImageVertex {
        let cs = new CustomImageVertex();
        if (MyGraph.counter%3 == 0)
            cs.setImageLink("./assets/pants.png")
        else if(MyGraph.counter%3 == 1){
            cs.setImageLink("./assets/shirt.png")
        }else{
            cs.setImageLink("./assets/shoes.png")
        }
        MyGraph.counter = MyGraph.counter+1
        console.log(MyGraph.counter)
        return cs;
    }

    newEdge(from: Vertex, to: Vertex): ImageSimpleUndirectedEdge {
        let edge = new ImageSimpleUndirectedEdge(from, to);
        edge.setImageLink("./assets/street.png")
        return edge;
    }
}