import { Component, OnInit } from '@angular/core';
import { Vertex } from 'dist/interactive-graph/lib/logic/lib/base/vertex';
import { IGraph, GraphType, NameVertex, CircleNameVertex, ImageSimpleUndirectedEdge, GraphGrid, CustomImageVertex, SimpleUndirectedEdge } from 'interactive-graph'

@Component({
  selector: 'app-custom-interactive-graph',
  templateUrl: './custom-interactive-graph.component.html',
  styleUrls: ['./custom-interactive-graph.component.css']
})
export class CustomInteractiveGraphComponent implements OnInit {

  graph: MyGraph = new MyGraph();

  constructor() { }

  ngOnInit(): void {
  }

}


export class MyGraph extends IGraph {

    static counter: number = 0;

    constructor() {
        super(GraphType.UNDIRECTED_GRAPH, new GraphGrid(null as any, 4,7))
    }

    keyBoardEvent() {
        return;
    }

    newNode(args: any[]): CustomImageVertex {
        let cs = new CustomImageVertex();
     
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
  