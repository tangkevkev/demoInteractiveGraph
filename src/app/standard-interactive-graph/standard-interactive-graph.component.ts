import { Component, OnInit } from '@angular/core';
import { InteractiveGraph,GraphType, InteractiveGraphService } from 'interactive-graph'

@Component({
  selector: 'app-standard-interactive-graph',
  templateUrl: './standard-interactive-graph.component.html',
  styleUrls: ['./standard-interactive-graph.component.css']
})
export class StandardInteractiveGraphComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  protected graph: InteractiveGraph = null as any;

  setGraph(graph: InteractiveGraph) {
    this.graph = graph;
  }
}
