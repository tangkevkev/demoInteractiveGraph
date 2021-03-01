import { InteractiveGraph } from "./interactive/interactiveGraph";
import { AbstractNode } from "./abstract/aNode";
import { GraphGrid } from "./graph/graphGrid";
import { NameVertex } from "./graph/vertices/NameVertex";

export class GraphRandom {
    private static ind: number = 0;
    private static readonly count: number = 5;

    public static generateGraph(igraph: InteractiveGraph, isPathExercise?:boolean) {
        igraph.resetGraph();
        NameVertex.resetNames();

        switch (this.ind) {
            case 0: this.graph1(igraph); break;
            case 1: this.graph2(igraph); break;
            case 2: this.graph3(igraph); break;
            case 3: this.graph4(igraph); break;
            case 4: this.graph5(igraph); break;
            case 5: this.graph6(igraph); break;
        }
        this.ind = (this.ind+1)%this.count;

        if(isPathExercise){
            let nodes: AbstractNode[] = igraph.getGraph().getNodes();
            igraph.setSourceNode(nodes[0]);
            igraph.setTargetNode(nodes[nodes.length-1]);
        }
        igraph.forceUpdate();
    }

    private static graph1(igraph: InteractiveGraph) {
        let nodes: AbstractNode[] = [igraph.newNode(), igraph.newNode(),
        igraph.newNode(), igraph.newNode(), igraph.newNode()];
        let coords: number[][] = [[4, 4], [2.5, 6], [5.5, 6], [4, 8], [4, 10]];
        let grid = igraph.getGrid();

        if (grid instanceof GraphGrid) {
            for (let i = 0; i < nodes.length; i++) {
                igraph.add(nodes[i], grid.convertCoordinateToRaw([coords[i][0], coords[i][1]]));
            }
        }

        igraph.add(igraph.newEdge(nodes[0], nodes[1]));
        igraph.add(igraph.newEdge(nodes[0], nodes[2]));
        igraph.add(igraph.newEdge(nodes[1], nodes[3]));
        igraph.add(igraph.newEdge(nodes[2], nodes[3]));
        igraph.add(igraph.newEdge(nodes[3], nodes[4]));
    
    }

    private static graph2(igraph: InteractiveGraph) {
        let nodes: AbstractNode[] = [igraph.newNode(), igraph.newNode(),
            igraph.newNode(), igraph.newNode(), igraph.newNode(), igraph.newNode()];
            let coords: number[][] = [[2, 5], [4, 5], [6, 5], [2, 9], [4,9], [6 , 9]];
            let grid = igraph.getGrid();
    
            if (grid instanceof GraphGrid) {
                for (let i = 0; i < nodes.length; i++) {
                    igraph.add(nodes[i], grid.convertCoordinateToRaw([coords[i][0], coords[i][1]]));
                }
            }
    
            igraph.add(igraph.newEdge(nodes[0], nodes[3]));
            igraph.add(igraph.newEdge(nodes[0], nodes[4]));
            igraph.add(igraph.newEdge(nodes[1], nodes[4]));
            igraph.add(igraph.newEdge(nodes[1], nodes[5]));
            igraph.add(igraph.newEdge(nodes[2], nodes[5]));    
    }
    private static graph3(igraph: InteractiveGraph) {
            let nodes: AbstractNode[] = [igraph.newNode(), igraph.newNode(),
            igraph.newNode(), igraph.newNode(), igraph.newNode(), igraph.newNode()];
            let coords: number[][] = [[2, 5], [2, 7], [2, 9], [4, 7], [4 , 9], [6 , 9]];
            let grid = igraph.getGrid();
    
            if (grid instanceof GraphGrid) {
                for (let i = 0; i < nodes.length; i++) {
                    igraph.add(nodes[i], grid.convertCoordinateToRaw([coords[i][0], coords[i][1]]));
                }
            }
    
            igraph.add(igraph.newEdge(nodes[0], nodes[1]));
            igraph.add(igraph.newEdge(nodes[0], nodes[3]));
            igraph.add(igraph.newEdge(nodes[1], nodes[2]));
            igraph.add(igraph.newEdge(nodes[2], nodes[4]));
            igraph.add(igraph.newEdge(nodes[3], nodes[5]));
            igraph.add(igraph.newEdge(nodes[1], nodes[3]));
            igraph.add(igraph.newEdge(nodes[3], nodes[4]));
            igraph.add(igraph.newEdge(nodes[4], nodes[5]));
            igraph.add(igraph.newEdge(nodes[4], nodes[5]));    
    
    }

    private static graph4(igraph: InteractiveGraph) {
        let nodes: AbstractNode[] = [igraph.newNode(), igraph.newNode(),
            igraph.newNode(), igraph.newNode(), igraph.newNode(),
             igraph.newNode(), igraph.newNode(), igraph.newNode()];
            let coords: number[][] = [[3, 4], [3, 6], [3, 8], [3, 10],
                     [5,4], [5 , 6], [5, 8], [5, 10]];
            let grid = igraph.getGrid();
            
            if (grid instanceof GraphGrid) {
                for (let i = 0; i < nodes.length; i++) {
                    igraph.add(nodes[i], grid.convertCoordinateToRaw([coords[i][0], coords[i][1]]));
                }
            }
    
            igraph.add(igraph.newEdge(nodes[0], nodes[1]));
            igraph.add(igraph.newEdge(nodes[0], nodes[4]));
            igraph.add(igraph.newEdge(nodes[1], nodes[2]));
            igraph.add(igraph.newEdge(nodes[1], nodes[5]));
            igraph.add(igraph.newEdge(nodes[2], nodes[3]));
            igraph.add(igraph.newEdge(nodes[2], nodes[6]));
            igraph.add(igraph.newEdge(nodes[3], nodes[7]));
            igraph.add(igraph.newEdge(nodes[4], nodes[5]));
            igraph.add(igraph.newEdge(nodes[5], nodes[6]));
            igraph.add(igraph.newEdge(nodes[6], nodes[7]));

    }
    private static graph5(igraph: InteractiveGraph) {
        let nodes: AbstractNode[] = [igraph.newNode(), igraph.newNode(), igraph.newNode(),
            igraph.newNode(), igraph.newNode(), igraph.newNode(),
             igraph.newNode(), igraph.newNode(), igraph.newNode()];
            let coords: number[][] = [[2, 5], [2, 7], [2, 9], 
                     [4, 5], [4, 7], [4, 9],
                     [6 , 5], [6, 7], [6, 9]];
            let grid = igraph.getGrid();
            
            if (grid instanceof GraphGrid) {
                for (let i = 0; i < nodes.length; i++) {
                    igraph.add(nodes[i], grid.convertCoordinateToRaw([coords[i][0], coords[i][1]]));
                }
            }
    
            igraph.add(igraph.newEdge(nodes[0], nodes[1]));
            igraph.add(igraph.newEdge(nodes[1], nodes[2]));
            igraph.add(igraph.newEdge(nodes[0], nodes[3]));
            igraph.add(igraph.newEdge(nodes[3], nodes[4]));
            igraph.add(igraph.newEdge(nodes[4], nodes[5]));
            igraph.add(igraph.newEdge(nodes[3], nodes[6]));
            igraph.add(igraph.newEdge(nodes[6], nodes[7]));
            igraph.add(igraph.newEdge(nodes[2], nodes[5]));   
            igraph.add(igraph.newEdge(nodes[5], nodes[8]));
            igraph.add(igraph.newEdge(nodes[7], nodes[8]));

    }
    private static graph6(igraph: InteractiveGraph) {

    }
}