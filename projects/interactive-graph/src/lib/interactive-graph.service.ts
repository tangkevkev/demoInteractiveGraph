import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InteractiveGraphService {

  constructor() { }

  foo(){
    console.log("Hello from the service")
  }
}
