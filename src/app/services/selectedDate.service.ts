import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedDateService {
  private dateSource = new BehaviorSubject<Date>(new Date());
  currentDate = this.dateSource.asObservable();

  changeDate(date: Date) {
    this.dateSource.next(date);
  }
}
