import { AbstractGrid } from "./aGrid";

export abstract class Interactable {
     abstract keyBoardEvent(e: KeyboardEvent): void;
     abstract inPerimeter(coordinate: [number, number], grid: AbstractGrid): boolean;

     static isInteractable(object:any): object is Interactable {
          if (object == null)
               return false;
          const myInterface = object as Interactable;
          return myInterface.inPerimeter !== undefined;
     }
}