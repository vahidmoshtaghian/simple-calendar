import {Injectable} from '@angular/core';
import {IEventDto} from './models/eventDto';
import {formatDate} from '@angular/common';
import {SelectedDateService} from './selectedDate.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly storageName = 'events';

  constructor(private selectedDateService: SelectedDateService) {
  }

  getAll(date: Date): IEventDto[] {
    const storage = this.getStorage();

    return storage
      .filter(p => formatDate(p.date, 'yyyy-MM-dd', 'en_US') === formatDate(date, 'yyyy-MM-dd', 'en_US'))
      .sort((a, b) => (a.startTime.hour * 60 + a.startTime.minute) - (b.startTime.hour * 60 + b.startTime.minute));
  }

  add(input: IEventDto) {
    const storage = this.getStorage();

    if (storage.length > 0) {
      const maxId = Math.max(...storage.map(p => p.id));
      console.log(maxId);

      input.id = maxId + 1;
    } else
      input.id = 1;

    const entity = this.map(input);

    storage.push(entity);
    localStorage.setItem(this.storageName, JSON.stringify(storage));
    this.selectedDateService.changeDate(entity.date);
  }

  update(input: IEventDto) {
    const storage = this.getStorage();
    const entity = storage.find(p => p.id === input.id);
    if (entity) {
      entity.startTime = input.startTime;
      entity.endTime = input.endTime;

      localStorage.setItem(this.storageName, JSON.stringify(storage));
    }
  }

  delete(id: number) {
    const storage = this.getStorage();
    const deletedDate = storage.find(p => p.id === id)?.date;
    const result = storage.filter(p => p.id !== id);
    localStorage.setItem(this.storageName, JSON.stringify(result));

    this.selectedDateService.changeDate(deletedDate ?? new Date());
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
      date: input.date,
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
