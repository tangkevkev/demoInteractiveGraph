import { AbstractEdge } from "./abstract/aEdge";
import { AbstractGraph } from "./abstract/aGraph";
import { AbstractNode } from "./abstract/aNode";
import { UndirectedEdge } from "./base/edges/undirectedEdge";
import { Weightable } from "./abstract/weightable";
import { NameVertex } from "./graph/vertices/NameVertex";

/**
 * The GraphAlgorithm class is a collection of methods
 * that provides solutions to various graph problems. 
 * Some of the problems encountered could be solved by implementing known
 * algorithms, such as Dijkstra's shortest path algorithm, Prim's minimum 
 * spanning tree algorithm, etc. On the other hand, 
 * some of the encountered problems were NP-complete, 
 * such as the vertex cover problem as well as the Hamiltonian path 
 * problem, which we solved by using brute-force algorithms.
 */
export class GraphAlgorithm {

    private static getNeighbors(node: AbstractNode, graph: AbstractGraph): AbstractNode[] {
        let result = new Set<AbstractNode>();
        let edges: AbstractEdge[] = graph.getEdges();

        for (let edge of edges) {
            let startNode = edge.getStartNode();
            let endNode = edge.getEndNode();

            if (startNode == node) {
                result.add(endNode);
                if (node instanceof NameVertex) {
                    if (endNode instanceof NameVertex) {
                        /*   console.log("Neighbor of " + node.getName() + " is : " 
                           + endNode.getName());*/
                    }
                }
            }
            else {
                if (edge instanceof UndirectedEdge) {
                    if (endNode == node) {
                        result.add(startNode);
                    }
                }
            }

        }
        return Array.from(result);

    }

    /**
    * Upper bounds of finding paths. Finding > 5000 different paths lags heavely
    * On Server > 1000 different paths lags hard!
    */
    private static UPPERBOUNDPATHS: number = 100;

    /**
     * Test the connectivity of the graph
     */
    static testConnectivity(graph: AbstractGraph): boolean {
        let nodes = graph.getNodes();
        if (nodes == null || nodes.length == 0) {
            return true;
        }

        let connected: boolean = true;

        nodes.forEach(startNode => {
            nodes.forEach(node => {
                if (node != startNode) {
                    connected = this.depthFirstSearch(startNode, node, graph) && connected;
                }
            })
        });


        return connected;
    }


    //Test the connectivity based solely on the edges
    static testConnectivityViaEdges(edges: AbstractEdge[], graph: AbstractGraph) {
        let isConnected: boolean = true;

        let nodes: AbstractNode[] = [];

        edges.forEach(edge => {
            let from: AbstractNode = edge.getStartNode();
            let to: AbstractNode = edge.getEndNode();

            if (!nodes.includes(from)) {
                nodes.push(from);
            }

            if (!nodes.includes(to)) {
                nodes.push(to);
            }
        })


        return this.dfsForSelectedPathAndEdges(nodes, edges, graph);
    }

    //Depth first search for the given nodes and edges
    private static dfsForSelectedPathAndEdges(nodes: AbstractNode[], edges: AbstractEdge[], graph: AbstractGraph) {
        let hasPath: boolean = true;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                hasPath = this.dfsForSelectedPathAndEdgesRec(nodes[i], nodes[j], [nodes[i]], edges, graph) && hasPath;
            }
        }

        return hasPath;
    }

    private static dfsForSelectedPathAndEdgesRec(from: AbstractNode, to: AbstractNode, visited: AbstractNode[],
        edges: AbstractEdge[], graph: AbstractGraph): boolean {
        if (from == to) {
            return true;
        }
        let hasPath: boolean = false;
        let fromNeighbors = this.getNeighbors(from, graph);
        for (let i = 0; i < fromNeighbors.length; i++) {
            let neighbor: AbstractNode = fromNeighbors[i];
            let edge: AbstractEdge = graph.getEdge(from, neighbor);
            let copyVisited: AbstractNode[] = this.cloneNodeArray(visited);

            if (edges.includes(edge) && !(copyVisited.includes(neighbor))) {
                copyVisited.push(neighbor);
                hasPath = this.dfsForSelectedPathAndEdgesRec(neighbor, to, copyVisited, edges, graph) || hasPath;
            }
            else {
            }
        }

        return hasPath;

    }
    //Returns a MST of the graph.
    static primMST(graph: AbstractGraph): AbstractEdge[] {
        if (!this.testConnectivity(graph)) {
            return null as any;
        }

        let VG: AbstractNode[] = this.cloneNodeArray(graph.getNodes()); //Aliasing problems if we dont clone it. During computation we may add a new Node
        let Q: AbstractNode[] = this.cloneNodeArray(VG);
        if (Q.length == 0)
            return null as any;

        let r: AbstractNode = Q[0];
        let pred = new Map<AbstractNode, AbstractNode>();
        let dist = new Map<AbstractNode, number>();

        for (let i = 0; i < Q.length; i++) {
            let u: AbstractNode = Q[i];
            pred.set(u, null as any);
            dist.set(u, Number.POSITIVE_INFINITY);
        }
        dist.set(r, 0);

        while (Q.length > 0) {
            let u: AbstractNode = this.smallestDistance(Q, dist);
            Q.splice(Q.indexOf(u), 1);
            let adj: AbstractNode[] = this.cloneNodeArray(this.getNeighbors(u, graph));

            adj.forEach(v => {
                let uvEdge = graph.getEdge(u, v);
                if (Weightable.isWeightable(uvEdge)) {
                    let dist_v = dist.get(v)

                    if (Q.includes(v) && dist_v && uvEdge.getWeight() < dist_v) {
                        pred.set(v, u);
                        dist.set(v, uvEdge.getWeight());
                    }
                }
            })

        }
        let res: AbstractEdge[] = [];
        VG.splice(VG.indexOf(r), 1);

        VG.forEach(node => {
            let pred_node = pred.get(node)
            if (pred_node) {
                let edge: AbstractEdge = graph.getEdge(node, pred_node);
                res.push(edge);
            }

        })

        return res;

    }


    /**
    * @returns the minimum vertex cover 
    * We compute every possible permutations of nodes and pick 
    * the smallest possible set of nodes which fullfills the vertex cover
    */
    static vertexCover(graph: AbstractGraph): AbstractNode[] {
        let nodes: AbstractNode[] = graph.getNodes();
        for (let size = 1; size <= nodes.length; size++) {
            //We compute node permutations of size "size"
            let nodePermutations: AbstractNode[][] = this.nodePermutation(nodes, size);
            for (let j = 0; j < nodePermutations.length; j++) {
                //If one of the permutations fullfills vertex cover, we return the solution
                if (this.isVertexCover(nodePermutations[j], graph)) {
                    return nodePermutations[j];
                }
            }
        }
        return null as any
    }

    /**
     * 
     * @returns a list of nodes set of size "size"
     */
    private static nodePermutation(nodes: AbstractNode[], size: number): AbstractNode[][] {
        let permutations: AbstractNode[][] = [];
        let indicesPerm = this.permIndices(nodes, size);

        for (let i = 0; i < indicesPerm.length; i++) {
            let perm: number[] = indicesPerm[i];
            let nodePerm: AbstractNode[] = [];
            for (let j = 0; j < perm.length; j++) {
                nodePerm.push(nodes[perm[j]]);
            }
            permutations.push(nodePerm);
        }
        return permutations;
    }

    private static permIndices(nodes: AbstractNode[], size: number): number[][] {
        let high = nodes.length;

        let res: number[][] = [];
        for (let i = 0; i < high; i++) {
            this.permIndicesRec([i], res, high, size);
        }
        return res;
    }

    private static permIndicesRec(curSet: number[], res: number[][], high: number, size: number) {
        if (curSet.length == size) {
            res.push(curSet);
        }

        if (curSet.length > size) {
            return;
        }

        let h = this.getMaxArray(curSet);
        for (h = h + 1; h < high; h++) {
            let copy = this.cloneNumberArray(curSet);
            copy.push(h);
            this.permIndicesRec(copy, res, high, size);
        }

    }

    private static getMaxArray(array: number[]) {
        if (array.length == 0) {
            return 0;
        }
        let m = array[0];
        array.forEach(n => {
            if (n > m) {
                m = n;
            }
        })
        return m;
    }

    //returns true if the cover covers the graph
    static isVertexCover(cover: AbstractNode[], graph: AbstractGraph): boolean {
        let edges: AbstractEdge[] = graph.getEdges();
        let coveredEdges: AbstractEdge[] = [];

        cover.forEach(node => {
            this.getNeighbors(node, graph).forEach(neighbor => {
                let edge: AbstractEdge = graph.getEdge(node, neighbor);

                if (!(coveredEdges.includes(edge))) {
                    coveredEdges.push(edge);
                }
            })
        });

        return coveredEdges.length == edges.length;
    }

    //We follow wikipedia's algorithm https://de.wikipedia.org/wiki/Dijkstra-Algorithmus
    static dijkstraShortestPath(graph: AbstractGraph,
        source: AbstractNode, target: AbstractNode): [AbstractNode[], AbstractEdge[]] {
        //If there's no path, no need to compute the shortest one
        if (this.depthFirstSearch(source, target, graph) == false) {
            return [null as any, null as any];
        }

        //--Initialisation--
        let distance = new Map();
        let predecessors = new Map();
        let nodes: AbstractNode[] = []; //ALIASING PROBLEM IF WE ASSIGN TO graph.getNodes()
        graph.getNodes().forEach(node => {
            nodes.push(node);
        })
        let Q: AbstractNode[] = [];
        let i = 0;

        for (i = 0; i < nodes.length; i++) {
            distance.set(nodes[i], Number.POSITIVE_INFINITY);
            predecessors.set(nodes[i], null);
            Q.push(nodes[i]);
        }
        distance.set(source, 0);
        //--Initialisation end--

        while (Q.length > 0) {
            let u: AbstractNode = this.smallestDistance(Q, distance);
            Q.splice(Q.indexOf(u), 1);

            let neighbors: AbstractNode[] = this.cloneNodeArray(this.getNeighbors(u, graph));
            neighbors.forEach(v => {
                if (Q.includes(v)) {
                    this.distanceUpdate(u, v, distance, predecessors, graph);
                }
            });
        }

        let path: AbstractNode[] = [target];
        let u: AbstractNode = target;

        while (predecessors.get(u) != null) {
            u = predecessors.get(u);
            path.unshift(u);
        }

        let pathEdge: AbstractEdge[] = [];
        for (i = 0; i < path.length - 1; i++) {
            pathEdge.push(<AbstractEdge>graph.getEdge(path[i], path[i + 1]));
        }

        return [path, pathEdge];

    }

    //Used for the djikstra algorithm
    private static smallestDistance(Q: AbstractNode[], distance: Map<AbstractNode, number>): AbstractNode {

        let smallestNode: AbstractNode = Q[0];
        let i = 0;
        let d: number = Number.POSITIVE_INFINITY;

        for (i = 0; i < Q.length; i++) {
            let distance_i = distance.get(Q[i])
            if (distance_i && d > distance_i) {
                smallestNode = Q[i];
                d = distance_i;
            }
        }

        return smallestNode;

    }

    //used for the djikstra algorithm
    private static distanceUpdate(u: AbstractNode, v: AbstractNode,
        distance: Map<AbstractNode, number>, predecessors: Map<AbstractNode, AbstractNode>,
        graph: AbstractGraph) {
        let edge = graph.getEdge(u, v);
        // console.log("edge is null : " + (edge == null));
        if (edge != null && Weightable.isWeightable(edge)) {
            let dist_u = distance.get(u)
            let dist_v = distance.get(v)

            if (dist_u && dist_v) {
                let alternativ: number = dist_u + edge.getWeight();
                if (alternativ < dist_v) {
                    distance.set(v, alternativ);
                    predecessors.set(v, u);
                }
            }
        }

    }


    /**
   * 
   * @param from, Node from which the path starts
   * @param to ,Node where the path ends
   * @returns true, if there exists a path from "from" to "to". false,else.
   */
    static depthFirstSearch(from: AbstractNode, to: AbstractNode,
        graph: AbstractGraph): boolean {
        if (from == null || to == null) {
            return false;
        }
        let visitedNodes: AbstractNode[] = [];
        return this.recDFS(from, to, visitedNodes, graph);
    }

    /**
     * 
     * @param from, Node from which the path starts 
     * @param to, Node from where the path ends
     * @param graph, the graph containing both nodes
     * @returns all simple paths (no Node is beeing traversed twice) from "from" to "to". Nodes and edges from this path are beeing stored as a tuple
     */
    static allSimplePaths(source: AbstractNode, target: AbstractNode,
        graph: AbstractGraph, mandatoryNodes?: AbstractNode[]):
        [AbstractNode[], AbstractEdge[]][] {
        let allPath: [AbstractNode[], AbstractEdge[]][] = [];

        if (source == null || target == null || !this.depthFirstSearch(source, target, graph)) {
            return allPath;
        }

        let nextToVisit: Queue = new Queue();
        let visitedNodes: AbstractNode[] = [source];
        let visitedEdges: AbstractEdge[] = [];

        nextToVisit.enqueue([source, [visitedNodes, visitedEdges]]);
        while (!nextToVisit.isEmpty()) {
            let current = nextToVisit.dequeue();

            if (current[0] == target) {
                if (mandatoryNodes == undefined) {
                    allPath.push(current[1]);
                }
                else {
                    let visitsAllMandatory: boolean = true;
                    mandatoryNodes.forEach(m => {
                        if (!(current[1][0].includes(m))) {
                            visitsAllMandatory = false;
                        }
                    }
                    )
                    if (visitsAllMandatory) {
                        allPath.push(current[1]);
                    }
                }
            }
            else {
                this.getNeighbors(current[0], graph).forEach(neighbor => {
                    let copyNodes = this.cloneNodeArray((current[1])[0]);
                    let copyEdges = this.cloneEdgeArray((current[1])[1]);

                    if (!(copyNodes.includes(neighbor))) {
                        copyNodes.push(neighbor);
                        copyEdges.push(graph.getEdge(current[0], neighbor));
                        nextToVisit.enqueue([neighbor, [copyNodes, copyEdges]]);
                    }
                });

            }
            if (allPath.length >= this.UPPERBOUNDPATHS) {
                nextToVisit.clear();
            }
        }
        return allPath;
    }

    /**
     * 
     * @param from, Node from which the path starts 
     * @param to, Node from where the path ends
     * @param graph, the graph containing both nodes
     * @returns all simple paths (no Node is beeing traversed twice) from "from" to "to". Nodes and edges from this path are beeing stored as a tuple
     */
    static allSimplePathsFixedLength(source: AbstractNode, target: AbstractNode,
        graph: AbstractGraph, length: number
        , mandatoryNodes?: AbstractNode[], prefixNodes?: AbstractNode[]):
        [AbstractNode[], AbstractEdge[]][] {
        let allPath: [AbstractNode[], AbstractEdge[]][] = [];

        if (source == null || target == null || !this.depthFirstSearch(source, target, graph)) {
            return allPath;
        }

        let nextToVisit: Queue = new Queue();
        let visitedNodes: AbstractNode[] = [source];
        let visitedEdges: AbstractEdge[] = [];

        nextToVisit.enqueue([source, [visitedNodes, visitedEdges]]);
        while (!nextToVisit.isEmpty()) {
            let current = nextToVisit.dequeue();

            if (current[0] == target && (current[1])[1].length == length) {
                if (mandatoryNodes == undefined) {
                    if (prefixNodes != undefined) {
                        let visitedAllPrefix: boolean = true;
                        let currentNodes: AbstractNode[] = current[1][0];
                        if (currentNodes.length < prefixNodes.length) {
                            visitedAllPrefix = false;
                        }
                        else {
                            for (let i = 0; i < prefixNodes.length; i++) {
                                if (prefixNodes[i] != currentNodes[i]) {
                                    visitedAllPrefix = false;
                                    break;
                                }
                            }
                        }
                        if (visitedAllPrefix) {
                            allPath.push(current[1]);
                        }

                    }
                    else {
                        allPath.push(current[1]);
                    }
                }
                else {
                    let visitsAllMandatory: boolean = true;
                    mandatoryNodes.forEach(m => {
                        if (!(current[1][0].includes(m))) {
                            visitsAllMandatory = false;
                        }
                    }
                    )
                    if (prefixNodes != undefined) {
                        let visitedAllPrefix: boolean = true;
                        let currentNodes: AbstractNode[] = current[1][0];
                        if (currentNodes.length < prefixNodes.length) {
                            visitedAllPrefix = false;
                        }
                        else {
                            for (let i = 0; i < prefixNodes.length; i++) {
                                if (prefixNodes[i] != currentNodes[i]) {
                                    visitedAllPrefix = false;
                                    break;
                                }
                            }
                        }
                        if (visitedAllPrefix && visitsAllMandatory) {
                            allPath.push(current[1]);
                        }
                    }
                    else {
                        if (visitsAllMandatory) {
                            allPath.push(current[1]);
                        }
                    }
                }
            }
            else {
                this.getNeighbors(current[0], graph).forEach(neighbor => {
                    let copyNodes = this.cloneNodeArray((current[1])[0]);
                    let copyEdges = this.cloneEdgeArray((current[1])[1]);

                    if (!(copyNodes.includes(neighbor)) && copyEdges.length < length) {
                        copyNodes.push(neighbor);
                        copyEdges.push(graph.getEdge(current[0], neighbor));
                        nextToVisit.enqueue([neighbor, [copyNodes, copyEdges]]);
                    }
                });

            }
            if (allPath.length >= this.UPPERBOUNDPATHS) {
                nextToVisit.clear();
            }
        }
        return allPath;
    }
    /**
     * 
     * @param from, Node from which the path starts 
     * @param to, Node from where the path ends
     * @param graph, the graph containing both nodes
     * @returns all paths from "from" to "to". Nodes and edges from this path are beeing stored as a tuple
     */
    static allPaths(source: AbstractNode, target: AbstractNode,
        graph: AbstractGraph, mandatoryNodes?: AbstractNode[])
        : [AbstractNode[], AbstractEdge[]][] {
        let allPath: [AbstractNode[], AbstractEdge[]][] = [];
        if (source == null || target == null || !this.depthFirstSearch(source, target, graph)) {
            return allPath;
        }

        let nextToVisit: Queue = new Queue();
        let visitedNodes: AbstractNode[] = [source];
        let visitedEdges: AbstractEdge[] = [];

        nextToVisit.enqueue([source, [visitedNodes, visitedEdges]]);
        while (!nextToVisit.isEmpty()) {
            let current = nextToVisit.dequeue();

            if (current[0] == target) {
                if (mandatoryNodes == undefined) {
                    allPath.push(current[1]);
                }
                else {
                    let visitsAllMandatory: boolean = true;
                    mandatoryNodes.forEach(m => {
                        if (!(current[1][0].includes(m))) {
                            visitsAllMandatory = false;
                        }
                    }
                    )
                    if (visitsAllMandatory) {
                        allPath.push(current[1]);
                    }
                }
            }
            else {
                this.getNeighbors(current[0], graph).forEach(neighbor => {
                    let copyNodes = this.cloneNodeArray((current[1])[0]);
                    let copyEdges = this.cloneEdgeArray((current[1])[1]);
                    let edge: AbstractEdge = graph.getEdge(current[0], neighbor);
                    if (!(copyEdges.includes(edge))) {
                        copyNodes.push(neighbor);
                        copyEdges.push(edge);
                        nextToVisit.enqueue([neighbor, [copyNodes, copyEdges]]);
                    }
                });

                if (allPath.length >= this.UPPERBOUNDPATHS) {
                    nextToVisit.clear();
                }
            }

        }
        return allPath;
    }

    //Returns a hamiltonpath if it exists
    static hamiltonPath(graph: AbstractGraph): [AbstractNode[], AbstractEdge[]] {
        let nodes: AbstractNode[] = graph.getNodes();

        let result: AbstractNode[] = [];
        let resultEdge: AbstractEdge[] = [];

        let i = 0;
        for (i = 0; i < nodes.length; i++) {
            let visitedNodes: AbstractNode[] = [];
            this.hamiltonPathRec(nodes[i], visitedNodes, result, graph);
        }

        for (i = 0; i < result.length - 1; i++) {
            let edge: AbstractEdge = graph.getEdge(result[i], result[i + 1]);
            resultEdge.push(edge);
        }

        return [result, resultEdge];
    }

    private static hamiltonPathRec(cur: AbstractNode, visitedNodes: AbstractNode[],
        result: AbstractNode[], graph: AbstractGraph) {
        if (result.length > 0) {
            return;
        }
        visitedNodes.push(cur);


        if (visitedNodes.length == graph.getNodes().length) {
            visitedNodes.forEach(node => {
                result.push(node);
            });
            return;
        }

        let neighbors = this.getNeighbors(cur, graph);
        let i = 0;
        for (i = 0; i < neighbors.length; i++) {
            let neighbor: AbstractNode = neighbors[i];
            let copyNodes: AbstractNode[] = this.cloneNodeArray(visitedNodes);

            if (!(copyNodes.includes(neighbor))) {
                this.hamiltonPathRec(neighbor, copyNodes, result, graph);
            }
        }

    }

    private static recDFS(cur: AbstractNode, to: AbstractNode,
        visitedNodes: AbstractNode[], graph: AbstractGraph): boolean {
        if (cur == to) {
            return true;
        }
        visitedNodes.push(cur);
        let copy = this.cloneNodeArray(visitedNodes);

        let i = 0;
        let neighbors = this.getNeighbors(cur, graph);
        let found: boolean = false;

        for (i = 0; i < neighbors.length; i++) {
            let node: AbstractNode = neighbors[i];

            if (!(visitedNodes.includes(node))) {
                found = this.recDFS(node, to, copy, graph) || found;
                if (found)
                    return true;
            }
        }
        return found;

    }

    private static cloneNodeArray(nodes: AbstractNode[]): AbstractNode[] {
        let copy: AbstractNode[] = [];

        nodes.forEach(node => {
            copy.push(node);
        });

        return copy;
    }

    private static cloneEdgeArray(edges: AbstractEdge[]): AbstractEdge[] {
        let copy: AbstractEdge[] = [];

        edges.forEach(edge => {
            copy.push(edge);
        });
        return copy;
    }

    private static cloneNumberArray(numbers: number[]): number[] {
        let res: number[] = [];
        numbers.forEach(n => {
            res.push(n);
        })
        return res;
    }


}

class Queue {
    private queue: [AbstractNode, [AbstractNode[], AbstractEdge[]]][] = [];

    Queue() {
        this.queue = [];
    }

    enqueue(node: [AbstractNode, [AbstractNode[], AbstractEdge[]]]) {
        this.queue.push(node);
    }

    dequeue(): [AbstractNode, [AbstractNode[], AbstractEdge[]]] {
        if (this.isEmpty()) {
            return null as any;
        }
        let node: [AbstractNode, [AbstractNode[], AbstractEdge[]]] = this.queue[0];
        this.queue.splice(0, 1);
        return node;
    }

    isEmpty(): boolean {
        return this.queue.length == 0;
    }

    clear() {
        this.queue = [];
    }

}