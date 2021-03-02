import { Component } from '@angular/core';
import { InteractiveGraph,GraphType, InteractiveGraphService } from 'interactive-graph'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  
  protected graph: InteractiveGraph = null as any;
  graphType: GraphType = GraphType.UNDIRECTED_WEIGHTED_GRAPH;

  setGraph(graph: InteractiveGraph) {
    this.graph = graph;
  }

  show() {
    if (this.graph)
      console.log(this.graph.getGraph().getNodes());


  }

  title = 'LibraryDemo';










}
