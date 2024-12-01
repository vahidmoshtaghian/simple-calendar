import { Injectable } from '@angular/core';
import { IEventDto } from './models/eventDto';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly storageName = 'events';

  getAll(date: Date): IEventDto[] {
    var storage = this.getStorage();
    var filter = new Date(date.toISOString().split('T')[0]);

    return storage;
  }

  add(input: IEventDto) {
    var storage = this.getStorage();

    if (storage.length > 0) {
      const maxId = Math.max(...storage.map(p => p.id));
      console.log(maxId);

      input.id = maxId + 1;
    }
    else
      input.id = 1;

    const entity = this.map(input);

    storage.push(entity);
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

  private map(input: any): IEventDto {
    return {
      id: input.id,
      date: new Date(input.date.toISOString().split('T')[0]),
      title: input.title,
      startTime: {
        hour: input.startTime.getHours(),
        minute: input.startTime.getMinutes()
      },
      endTime: {
        hour: input.endTime.getHours(),
        minute: input.endTime.getMinutes()
      }
    }
  }
}
