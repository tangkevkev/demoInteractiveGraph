import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  IGraph, GraphDW, GraphUU, GraphUW, InteractionType,
  NameVertex, Interactable, Weightable, GraphDU, GraphGrid
} from './logic/index'
import { InteractiveGraph } from './logic/lib/interactive/interactiveGraph';

@Component({
  selector: 'custom-interactive-graph',
  templateUrl: './custom-interactive-graph.component.html',
  styleUrls: ['./custom-interactive-graph.component.css']
})
export class CustomInteractiveGraphComponent implements OnInit {
  
  private readonly canvasID: string = 'graph-canvas';
  @Input("graph")graph: InteractiveGraph = null as any;


  @Input("isEditable") isEditable: boolean = true;
  // ST = Source Target Exercise
  @Input("isSTExercise") isSTExercise: boolean = false;
  @Input("hasUnit") hasUnit: boolean = false;

  @Input() hasMandatoryNode: boolean = false;
  @Input() hasPrefixNode: boolean = false;




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

  constructor() {
    this.buttonMapping = new Map();
  }

  ngOnInit(): void {
    const canvas = <HTMLCanvasElement>document.getElementById(this.canvasID);
    if(this.graph){
      this.graph.setCanvas(canvas);
      let grid = this.graph.getGrid()
      if(grid instanceof GraphGrid){
        grid.setupCanvas(canvas)
      }    

      this.graph.forceUpdate()
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

      if (this.hasMandatoryNode) {
        this.buttonMapping.set(this.mandatoryID,
          <HTMLButtonElement>document.getElementById(this.mandatoryID));

        let mandElem = this.buttonMapping.get(this.mandatoryID);
        if (mandElem)
          mandElem.addEventListener('click',
            this.onMandatoryNode, false);
      }
      if (this.hasPrefixNode) {
        this.buttonMapping.set(this.prefixID,
          <HTMLButtonElement>document.getElementById(this.prefixID));
        if (this.buttonMapping.get(this.prefixID) == null) {
          console.log("prefix is null!!");
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
