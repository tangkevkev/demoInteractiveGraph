import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InteractiveGraphService } from './interactive-graph.service';
import {
  IGraph, GraphDW, GraphUU, GraphUW, InteractionType,
  NameVertex, Interactable, Weightable, GraphDU, GraphAlgorithm, AbstractNode, GraphRandom
} from './logic/index'
import { InteractiveGraph } from './logic/lib/interactive/interactiveGraph';

@Component({
  selector: 'interactive-graph',
  templateUrl: './interactive-graph.component.html',
  styleUrls: ['./interactive-graph.component.css']
})
export class InteractiveGraphComponent implements OnInit {

  private readonly canvasID: string = 'graph-canvas';
  private graph: IGraph = null as any;


  @Input() graphType: InteractiveGraphType = InteractiveGraphType.UNDIRECTED_UNWEIGHTED_GRAPH;
  @Input("isEditable") isEditable: boolean = true;
  // ST = Source Target Exercise
  @Input("isSTExercise") isSTExercise: boolean = false;
  @Input("hasUnit") hasUnit: boolean = false;
  @Input("language") language: string = "en";

  @Input("isMandatoryNodeExercise") isMandatoryNodeExercise: boolean = false;
  @Input("isPrefixNodeExercise") isPrefixNodeExercise: boolean = false;
  @Input("showLanguageOption") showLanguageOption: boolean = false;
  @Input("showGraphtypeOption") showGraphTypeOption: boolean = false;
  @Input("showAlgorithmOption") showAlgorithmOption: boolean = false;

  @Output() emitGraph = new EventEmitter<InteractiveGraph>()
  @Output("graphListener") graphListener = new EventEmitter<{interactionType:InteractionType, object: any}>();


  interactionType: InteractionType = InteractionType.NULL;
  iMoveNode: InteractionType = InteractionType.MOVE_NODE;
  iCreateNode: InteractionType = InteractionType.CREATE_NODE;
  iCreateEdge: InteractionType = InteractionType.CREATE_EDGE;
  iDelete: InteractionType = InteractionType.DELETE;

  selectID: string = "selectID";
  addNodeID: string = "addNodeButton";
  addEdgeID: string = "addEdgeButton";
  deleteID: string = "deleteButton";
  moveID: string = "moveButton";
  sourceID: string = "sourceButton";
  targetID: string = "targetButton";
  renameID: string = "renameButton";
  weightID: string = "weightButton";
  prefixID: string = "prefixButton";
  mandatoryID: string = "mandatoryButton";

  buttonColor: string = "rgb(169, 169, 169)";
  buttonColorSelected: string = "rgb(200, 200, 200)";

  selectInteraction: HTMLSelectElement = null as any;
  buttonMapping: Map<String, HTMLButtonElement>;

  resetButton: HTMLButtonElement = null as any;
  resetID: string = "resetButton";

  undoButton: HTMLButtonElement = null as any;
  undoID: string = "undoButton";

  protected service: InteractiveGraphService;
  algorithm: string = "";

  constructor(service: InteractiveGraphService) {
    this.buttonMapping = new Map();
    this.service = service;
  }

  translate(word: string): string {
    return this.service.translate(word, this.language)
  }

  isWeighted(): boolean {
    switch (this.graphType) {
      case InteractiveGraphType.DIRECTED_WEIGHTED_GRAPH:
      case InteractiveGraphType.UNDIRECTED_WEIGHTED_GRAPH:
        return true;
      default:
        return false;
    }
  }

  isDirected(): boolean {
    switch (this.graphType) {
      case InteractiveGraphType.DIRECTED_WEIGHTED_GRAPH:
      case InteractiveGraphType.DIRECTED_UNWEIGHTED_GRAPH:
        return true;
      default:
        return false;
    }
  }

  runAlgorithm() {
    switch (this.algorithm) {
      case "shortestPath":
        let shortestpath = GraphAlgorithm.dijkstraShortestPath(this.graph.getGraph(), this.graph.getSourceNode(), this.graph.getTargetNode());
        this.graph.highLightPath(shortestpath[0])
        break;
      case "mst":
        let mst = GraphAlgorithm.primMST(this.graph.getGraph())
        this.graph.highLight(null as any, mst);
        break;
      case "vertexCover":
        let vertexCover = GraphAlgorithm.vertexCover(this.graph.getGraph());
        this.graph.highLight(vertexCover, null as any);
        break;
      case "hamiltonPath":
        let hamilton = GraphAlgorithm.hamiltonPath(this.graph.getGraph());
        this.graph.highLight(hamilton[0], hamilton[1])
        break;
    }
  }

  randomGraph(){
      GraphRandom.generateGraph(this.graph);
  }

  onChangeLanguage() {
  }

  onChangeGraph() {
    const canvas = <HTMLCanvasElement>document.getElementById(this.canvasID);

    let newGraph: IGraph = null as any;
    switch (this.graphType) {
      case InteractiveGraphType.DIRECTED_WEIGHTED_GRAPH:
        newGraph = new GraphDW(canvas);
        break;
      case InteractiveGraphType.UNDIRECTED_UNWEIGHTED_GRAPH:
        newGraph = new GraphUU(canvas);
        break;
      case InteractiveGraphType.DIRECTED_UNWEIGHTED_GRAPH:
        newGraph = new GraphDU(canvas);
        break
      case InteractiveGraphType.UNDIRECTED_WEIGHTED_GRAPH:
        newGraph = new GraphUW(canvas);
        break;
      default:
        break;
    }

    if (newGraph != null) {
      let grid = this.graph.getGrid();

      let nodeMap: Map<AbstractNode, AbstractNode> = new Map()
      this.graph.getNodes().forEach(node => {
        let newNode = newGraph.newNode();
        nodeMap.set(node, newNode)
        if (newNode instanceof NameVertex && node instanceof NameVertex) {
          newNode.setName(node.getName());
        }

        newGraph.add(newNode, grid.getCoordinate(node))
      })

      this.graph.getEdges().forEach(edge => {
        let fromNode = nodeMap.get(edge.getStartNode());
        let toNode = nodeMap.get(edge.getEndNode());

        if (fromNode && toNode) {

          let newEdge = newGraph.newEdge(fromNode, toNode);
          if (Weightable.isWeightable(edge) && Weightable.isWeightable(newEdge)) {
            newEdge.setWeight(edge.getWeight())
          }else{
            if (Weightable.isWeightable(newEdge)){
              newEdge.setWeight(0)
              }
          }
          newGraph.add(newEdge)
        }
      })

      if (this.graph.getSourceNode() != null) {
        let newSource = nodeMap.get(this.graph.getSourceNode());
        if (newSource)
          newGraph.setSourceNode(newSource);
      }

      if (this.graph.getTargetNode() != null) {
        let newTarget = nodeMap.get(this.graph.getTargetNode());
        if (newTarget)
          newGraph.setTargetNode(newTarget);
      }
      this.graph.reset()
      this.graph.setCallBackFunction(() => {})
      this.graph = newGraph;
      this.graph.forceUpdate()
    }
    this.emitGraph.emit(this.graph)
    this.graph.setCallBackFunction((interactionType: InteractionType, object: any)=>{
      this.graphListener.emit({interactionType, object});
    })
  }

  ngOnInit(): void {
    const canvas = <HTMLCanvasElement>document.getElementById(this.canvasID);
    this.graph = null as any;

    switch (this.graphType) {
      case InteractiveGraphType.DIRECTED_WEIGHTED_GRAPH:
        this.graph = new GraphDW(canvas);
        break;
      case InteractiveGraphType.UNDIRECTED_UNWEIGHTED_GRAPH:
        this.graph = new GraphUU(canvas);
        break;
      case InteractiveGraphType.DIRECTED_UNWEIGHTED_GRAPH:
        this.graph = new GraphDU(canvas);
        break
      case InteractiveGraphType.UNDIRECTED_WEIGHTED_GRAPH:
        this.graph = new GraphUW(canvas);
        break;
      default:
        console.log("No graphtype: " + this.graphType)
        break;
    }
    this.emitGraph.emit(this.graph)
    if(this.graph){
      this.graph.setCallBackFunction((interactionType: InteractionType, object: any)=>{
        this.graphListener.emit({interactionType, object});
      })
    }
  }

  ngAfterViewInit(): void {


    if (this.isEditable) {
      this.resetButton = <HTMLButtonElement>document.getElementById(this.resetID);
      this.resetButton.addEventListener('click', this.onReset, false);

      this.undoButton = <HTMLButtonElement>document.getElementById(this.undoID);
      this.undoButton.addEventListener('click', this.onUndo, false);

      this.buttonMapping.set(this.moveID,
        <HTMLButtonElement>document.getElementById(this.moveID));
      this.buttonMapping.set(this.addNodeID,
        <HTMLButtonElement>document.getElementById(this.addNodeID));
      this.buttonMapping.set(this.addEdgeID,
        <HTMLButtonElement>document.getElementById(this.addEdgeID));
      this.buttonMapping.set(this.deleteID,
        <HTMLButtonElement>document.getElementById(this.deleteID));
      if (this.isSTExercise) {
        this.buttonMapping.set(this.sourceID,
          <HTMLButtonElement>document.getElementById(this.sourceID));
        this.buttonMapping.set(this.targetID,
          <HTMLButtonElement>document.getElementById(this.targetID));
        let sourceElem = this.buttonMapping.get(this.sourceID);
        let targetElem = this.buttonMapping.get(this.targetID);
        if (sourceElem && targetElem) {
          sourceElem.addEventListener('click',
            this.onSourceNode, false);
          targetElem.addEventListener('click',
            this.onTargetNode, false);
        }
      }

      if (this.isMandatoryNodeExercise) {
        this.buttonMapping.set(this.mandatoryID,
          <HTMLButtonElement>document.getElementById(this.mandatoryID));

        let mandElem = this.buttonMapping.get(this.mandatoryID);
        if (mandElem)
          mandElem.addEventListener('click',
            this.onMandatoryNode, false);
      }
      if (this.isPrefixNodeExercise) {
        this.buttonMapping.set(this.prefixID,
          <HTMLButtonElement>document.getElementById(this.prefixID));
        if (this.buttonMapping.get(this.prefixID) == null) {
        } else {
          let prefixElem = this.buttonMapping.get(this.prefixID);
          if (prefixElem)
            prefixElem.addEventListener('click',
              this.onPrefixNode, false);
        }
      }
      //check with an @input if buttons are needed   

      let moveElem = this.buttonMapping.get(this.moveID);
      let addNodeElem = this.buttonMapping.get(this.addNodeID);
      let addEdgeElem = this.buttonMapping.get(this.addEdgeID);
      let deleteElem = this.buttonMapping.get(this.deleteID);

      if (moveElem && addNodeElem && addEdgeElem && deleteElem) {
        moveElem.addEventListener('click',
          this.onMove, false);
        addNodeElem.addEventListener('click',
          this.onAddNode, false);
        addEdgeElem.addEventListener('click',
          this.onAddEdge, false);
        deleteElem.addEventListener('click',
          this.onDelete, false);
      }
    }

  }

  latestClickID: string = null as any;

  onClickButton(buttonID: string) {
    if (this.latestClickID == buttonID) {
      this.latestClickID = null as any;
      this.resetButtonColor();
      this.changeInteraction(0);
      return;
    }

    switch (buttonID) {
      case this.moveID:
        this.changeInteraction(InteractionType.MOVE_NODE);
        break;
      case this.deleteID:
        this.changeInteraction(InteractionType.DELETE);
        break;
      case this.addEdgeID:
        this.changeInteraction(InteractionType.CREATE_EDGE);
        break;
      case this.addNodeID:
        this.changeInteraction(InteractionType.CREATE_NODE);
        break;
      case this.sourceID:
        this.changeInteraction(InteractionType.SELECT_SOURCE_NODE);
        break;
      case this.targetID:
        this.changeInteraction(InteractionType.SELECT_TARGET_NODE);
        break;
      case this.prefixID:
        this.changeInteraction(InteractionType.SELECT_PREFIX_NODES);
        break;
      case this.mandatoryID:
        this.changeInteraction(InteractionType.SELECT_MANDATORY_NODE);
        break;
    }
    this.resetButtonColor(buttonID);
    this.latestClickID = buttonID;
  }

  hideAllButtons(exceptID?: string): void {
    for (let button of this.buttonMapping.values()) {
      button.style.visibility = "hidden";
    }
    this.resetButton.style.visibility = "hidden";
    this.undoButton.style.visibility = "hidden";
  }

  resetButtonColor(exceptID?: string) {


    for (let button of this.buttonMapping.values()) {
      button.style.backgroundColor = this.buttonColor;
      button.style.color = "white";
      button.style.fontWeight = 'normal';
    }


    if (exceptID != undefined && this.buttonMapping.has(exceptID)) {
      let exceptElem = this.buttonMapping.get(exceptID);
      if (exceptElem) {
        exceptElem.style.backgroundColor = this.buttonColorSelected;
        exceptElem.style.color = "black";
        exceptElem.style.fontWeight = "bold";
      }
    }
  }

  reset() {
    this.graph.reset();
    this.resetButtonColor();
    NameVertex.ic = 0;
    this.interactionType = InteractionType.NULL;
  }

  undo() {
    this.graph.undoAction();
    this.resetButtonColor();
    this.interactionType = InteractionType.NULL;
  }

  onUndo = () => { this.undo(); }
  onReset = () => { this.reset(); }
  onMove = () => { this.onClickButton(this.moveID); }
  onAddNode = () => { this.onClickButton(this.addNodeID); }
  onAddEdge = () => { this.onClickButton(this.addEdgeID); }
  onDelete = () => { this.onClickButton(this.deleteID); }
  onSourceNode = () => { this.onClickButton(this.sourceID) }
  onTargetNode = () => { this.onClickButton(this.targetID) }
  onMandatoryNode = () => { this.onClickButton(this.mandatoryID) }
  onPrefixNode = () => { this.onClickButton(this.prefixID) }

  lastActive: Interactable = null as any;

  getActive(): Interactable {
    if (!this.isEditable) {
      return null as any;
    }
    if (this.graph == null || this.graph == undefined)
      return null as any;
    let active = this.graph.getActive();
    if (active == null) {
      return null as any;
    }
    let inputValue: HTMLInputElement = <HTMLInputElement>document.getElementById("inputValue");
    if (inputValue != undefined && inputValue != null) {
      if (active != null) {
        if (this.lastActive != active) {
          inputValue.value = this.graph.getValue(active);
        }
      }
      this.lastActive = active;
    }
    this.changeUnit();

    return active;
  }

  onChange = () => {
    this.onChangeValueHandler();
  }

  onChangeUnit = () => {
    this.changeUnit();
  }


  initUnit: boolean = true;

  changeUnit() {
    if (this.hasUnit) {
      let unitValue: HTMLInputElement = <HTMLInputElement>document.getElementById("unitValue");

      if (this.initUnit) {
        if (this.graph.getGraph().getEdges().length > 0) {
          let edge = this.graph.getGraph().getEdges()[0];
          if (Weightable.isWeightable(edge)) {
            unitValue.value = edge.getUnit();
            this.initUnit = false;
          }
        }
        return;
      }
      this.graph.getGraph().getEdges().forEach(edge => {
        if (Weightable.isWeightable(edge)) {
          edge.setUnit(unitValue.value);
        }
      });
    }
    this.graph.forceUpdate();
  }

  onChangeValueHandler() {
    let active = this.getActive();
    let inputValue: HTMLInputElement = <HTMLInputElement>document.getElementById("inputValue");
    this.graph.changeValue(active, inputValue.value);
    inputValue.value = "";
    this.graph.resetActive();
  }

  changeInteractionHandler = (val: any) => {
    this.changeInteraction(Number.parseInt(val));
  }

  changeInteraction(i: number) {
    this.graph.setInteractionType(i);
  }




}

export enum InteractiveGraphType {
  DIRECTED_WEIGHTED_GRAPH,
  UNDIRECTED_WEIGHTED_GRAPH,
  DIRECTED_UNWEIGHTED_GRAPH,
  UNDIRECTED_UNWEIGHTED_GRAPH
}