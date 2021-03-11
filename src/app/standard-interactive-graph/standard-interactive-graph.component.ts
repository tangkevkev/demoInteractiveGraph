import { Component, OnInit } from '@angular/core';
import { InteractiveGraph, GraphType, InteractiveGraphService, InteractionType } from 'interactive-graph'

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

  /**
   * 
   * @param graph the current graph instance.
   */
  setGraph(graph: InteractiveGraph) {
    this.graph = graph;
  }





  /**
 * 
 * @param interactionType describes how the user interacted with the graph (check the InteractionType enum file)
 * @param object returns the object (could be a node or an edge) which has been interacted with or null
 */
  actionListener(action:{interactionType: InteractionType, object:any}) {
    /**  
     * console.log("Type: " + type);
     * console.log("Object: " + object)
     */
  
    //console.log(action.interactionType + " object : " + action.object)
  }
}
