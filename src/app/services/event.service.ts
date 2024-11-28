import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  add() {
    alert('added');
  }

  update() {
    alert('updated');

  }

  delete() {
    alert('deleted');
  }
}
