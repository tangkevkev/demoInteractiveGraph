import { InteractiveGraph } from "./interactiveGraph";
import { Grid } from "../base/grid";
import { DirectedGraph } from "../graph/directedGraph";
import { UndirectedGraph } from "../graph/undirectedGraph";
import { MixedGraph } from "../graph/mixedGraph";

export abstract class IGraph extends InteractiveGraph{
    constructor(graphType: GraphType, grid: Grid, canvas?: HTMLCanvasElement){
        switch(graphType){
            case GraphType.DIRECTED_GRAPH:
                super(new DirectedGraph(), grid, canvas); break;
            case GraphType.UNDIRECTED_GRAPH:
                super(new UndirectedGraph(), grid, canvas); break;
            case GraphType.MIXED_GRAPH:
                super(new MixedGraph(), grid, canvas); break;
            default:
                super(new UndirectedGraph(), grid, canvas); break;
        }
    }
   
    rightClick(e: MouseEvent){}

}

export enum GraphType{
    DIRECTED_GRAPH,
    UNDIRECTED_GRAPH,
    MIXED_GRAPH
}