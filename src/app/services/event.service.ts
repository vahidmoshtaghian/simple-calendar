import { Injectable } from '@angular/core';
import { IEventDto } from './models/eventDto';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly storageName = 'events';

  add(input: IEventDto) {
    var storage = this.getStorage();

    if (storage.length > 0) {
      const maxId = Math.max(...storage.map(p => p.id));
      console.log(maxId);

      input.id = maxId + 1;
    }
    else
      input.id = 1;

    storage.push(input);
    localStorage.setItem(this.storageName, JSON.stringify(storage));
  }

  update(input: IEventDto) {
    alert('updated');

  }

  delete(id: number) {
    alert('deleted');
  }

  private getStorage(): IEventDto[] {
    const storage = localStorage.getItem(this.storageName);
    if (storage)
      return JSON.parse(storage);
    localStorage.setItem(this.storageName, '[]');

    return [];
  }
}
