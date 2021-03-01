import { InteractiveGraph } from "../lib/interactive/interactiveGraph";
import { AbstractNode } from "../lib/abstract/aNode";
import { NameVertex } from "../lib/graph/vertices/NameVertex";
import { ImageVertex } from "../lib/graph/vertices/ImageVertex";
import { AbstractEdge } from "../lib/abstract/aEdge";
import { DirectedEdge } from "../lib/base/edges/directedEdge";
import { Weightable } from "../lib/abstract/weightable";
import { AbstractGrid } from "../lib/abstract/aGrid";
import { Drawable } from "../lib/abstract/drawable";

export class GraphServiceJson {

    static exportGraph(ig: InteractiveGraph, json: any) {
        json.typespecifics = {};
        let grid = ig.getGrid();

        json.typespecifics.nodes = new Array();
        let ns: AbstractNode[] = ig.getGraph().getNodes();
        let map: Map<AbstractNode, Number> = new Map();
        for (let i = 0; i < ns.length; i++) {
            let n: AbstractNode = ns[i];
            map.set(n, i);
            const temp = new Object() as any;
            temp['id'] = i;
            if (n instanceof NameVertex) {
                temp['name'] = n.getName();
            }
            if (n instanceof ImageVertex) {
                temp['imageLink'] = n.getImageLink();
            }

            let cd: [number, number] = this.convert(n, grid);
            temp['x'] = Math.round(cd[0] * 1000) / 1000;
            temp['y'] = Math.round(cd[1] * 1000) / 1000;

            json.typespecifics.nodes.push(temp);
        }

        if (ig.getSourceNode() != null && ig.getTargetNode() != null) {
            json.typespecifics.sourceID = map.get(ig.getSourceNode());
            json.typespecifics.targetID = map.get(ig.getTargetNode());
        }

        json.typespecifics.edges = new Array();
        let es: AbstractEdge[] = ig.getGraph().getEdges();

        if (es != null && es.length > 0) {
            let edge = es[0];
            if (Weightable.isWeightable(edge)) {
                json.typespecifics.unit = edge.getUnit();
            }
        }

        es.forEach(edge => {
            const temp = new Object() as any;
            temp['from'] = map.get(edge.getStartNode());
            temp['to'] = map.get(edge.getEndNode());
            temp['directed'] = (edge instanceof DirectedEdge);
            if (Weightable.isWeightable(edge)) {
                temp['weight'] = edge.getWeight();
            }
            json.typespecifics.edges.push(temp);
        });

        if (ig.getMandatoryNodes().length > 0) {
            json.typespecifics.mandatoryNodes = new Array();
            ig.getMandatoryNodes().forEach(node => {
                const temp = new Object() as any;
                temp['id'] = map.get(node);
                json.typespecifics.mandatoryNodes.push(temp);
            })
        }


        if (ig.getPrefixNodes().length > 0) {
            json.typespecifics.prefixNodes = new Array();
            ig.getPrefixNodes().forEach(node => {
                const temp = new Object() as any;
                temp['id'] = map.get(node);
                json.typespecifics.prefixNodes.push(temp);
            })
        }


    }

    static importGraph(ig: InteractiveGraph, json: any) {
        const nodes = json.typespecifics.nodes;
        const edges = json.typespecifics.edges;


        let map: Map<Number, AbstractNode> = new Map();

        for (let n in nodes) {
            let x: number = Number.parseFloat(nodes[n].x);
            let y: number = Number.parseFloat(nodes[n].y);

            let args: any[] = [];

            if (nodes[n].name) {
                args.push(nodes[n].name);
            }

            if (nodes[n].imageLink) {
                args.push(nodes[n].imageLink);
            }

            let node = ig.newNode(args);
            ig.add(node, this.reconvert([x, y], ig.getGrid()));
            map.set(nodes[n].id, node);
        }

        let unit = "";
        if (json.typespecifics.unit) {
            unit = json.typespecifics.unit;
        }

        for (let e in edges) {
            let startID: number = Number.parseInt(edges[e].from);
            let endID: number = Number.parseInt(edges[e].to);

            if (startID && endID) {
                let startNode: AbstractNode = map.get(startID) as any;
                let endNode: AbstractNode = map.get(endID) as any;



                let edge = ig.newEdge(startNode, endNode);
                if (Weightable.isWeightable(edge)) {
                    if (edges[e].weight != undefined) {
                        edge.setWeight(Number.parseInt(edges[e].weight));
                        edge.setUnit(unit);
                    }
                }
                ig.add(edge);
            }
        }


        if (json.typespecifics.sourceID != undefined && json.typespecifics.targetID != undefined) {
            let sID: number = Number.parseInt(json.typespecifics.sourceID);
            let tID: number = Number.parseInt(json.typespecifics.targetID);

            let sNode = map.get(sID) as any;
            let tNode = map.get(tID) as any;

            ig.setSourceNode(sNode);
            ig.setTargetNode(tNode);
        }

        if (json.typespecifics.mandatoryNodes) {
            const mNodes = json.typespecifics.mandatoryNodes;
            for (let m in mNodes) {
                let id = mNodes[m].id;
                let node = map.get(id);
                ig.setMandatoryNode(node as any);
            }
        }

        if (json.typespecifics.prefixNodes) {
            const mNodes = json.typespecifics.prefixNodes;
            for (let m in mNodes) {
                let id = mNodes[m].id;
                let node = map.get(id);
                ig.setPrefixNode(node as any);
            }
        }

        ig.forceUpdate();
    }

    static convert(n: Drawable, grid: AbstractGrid): [number, number] {
        let cd: [number, number] = grid.getCoordinate(n);
        let x: number = cd[0] / grid.getCanvasWidth();
        let y: number = cd[1] / grid.getCanvasHeight();
        return [x, y];
    }

    static reconvert(cd: [number, number], grid: AbstractGrid): [number, number] {
        return [cd[0] * grid.getCanvasWidth(), cd[1] * grid.getCanvasHeight()];
    }
}