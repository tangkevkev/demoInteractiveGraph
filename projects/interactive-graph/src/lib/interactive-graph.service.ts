import { Injectable } from '@angular/core';
import { GraphServiceJson, InteractiveGraph } from './logic/index'

@Injectable({
  providedIn: 'root'
})
export class InteractiveGraphService {

  constructor() { }

 
  saveGraphEinfachInformatik(graph: InteractiveGraph, json: any){
      GraphServiceJson.exportGraph(graph, json);
  }

  loadGraphEinfachInformatik(graph: InteractiveGraph, json: any){
      GraphServiceJson.importGraph(graph, json);
  }

  


}
