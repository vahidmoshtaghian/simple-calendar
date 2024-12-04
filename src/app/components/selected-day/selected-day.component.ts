import {CommonModule, formatDate} from '@angular/common';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SelectedDateService} from '../../services/selectedDate.service';
import {IEventDto} from '../../services/models/eventDto';
import {EventService} from '../../services/event.service';
import {OverlayModule} from '@angular/cdk/overlay';
import {CdkDragEnd, DragDropModule} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-selected-day',
  templateUrl: './selected-day.component.html',
  styleUrls: ['./selected-day.component.scss'],
  imports: [CommonModule, OverlayModule, DragDropModule, MatIconModule]
})
export class SelectedDayComponent implements OnInit {
  readonly offset = 5;
  readonly blockHeight = 50;
  currentTime = 0;
  isToday = false;
  activeDate: Date | undefined;
  clockHours: { hour: number, title: string }[] = [];
  events: IEventDto[] = [];

  constructor(
    private selectedDateService: SelectedDateService,
    private eventService: EventService,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.fillClocks();
    this.calculateCurrentTimePointerPosition();
  }

  fillClocks() {
    this.clockHours = Array.from({length: 24}, (_, i) => {
      const hour = i === 0 || i === 12 ? 12 : i % 12;
      const period = i < 12 ? 'AM' : 'PM';

      return {hour: i, title: `${hour} ${period}`};
    });
  }

  calculateCurrentTimePointerPosition() {
    this.selectedDateService.currentDate.subscribe((date) => {
      console.log('currentDate.subscribe');
      this.activeDate = date;

      // For time pointer
      const nowDate = new Date();
      if (formatDate(date, 'yyyy-MM-dd', 'en_US') === formatDate(nowDate, 'yyyy-MM-dd', 'en_US')) { // تو این نمیره
        this.isToday = true;
        if (this.activeDate) {
          const now = nowDate.getHours() * 60 + nowDate.getMinutes();
          this.currentTime = ((now * 24) / 1440) * 51 - 5;

        }
      } else {
        this.isToday = false;
      }

      this.initialEvents();
    });
  }

  initialEvents() {
    if (this.activeDate) {
      this.events = this.eventService.getAll(this.activeDate);
      this.changeDetector.detectChanges();
    }
  }

  getEventsOfHour(hour: number) {
    return this.events.filter(p => p.startTime.hour === hour);
  }

  calculateStartEvent(event: IEventDto) {
    const borderHeights = event.startTime.hour + 1;
    const minutesHeight = (this.blockHeight * event.startTime.minute) / 60;

    return this.blockHeight * event.startTime.hour + minutesHeight + borderHeights + this.offset;
  }

  calculateLeftEvent(event: IEventDto, index: number) {

    return this.offset + this.blockHeight;
  }

  calculateHeightEvent(event: IEventDto) {
    const hoursOffset = event.endTime.hour - event.startTime.hour;
    const minutesOffset = event.endTime.minute - event.startTime.minute
    const minutesHeight = (minutesOffset * this.blockHeight) / 60;

    return this.blockHeight * hoursOffset + minutesHeight;
  }

  dragEnd($event: CdkDragEnd, event: IEventDto) {
    const navHeight = 45;
    const realHourDroppedY = $event.dropPoint.y - navHeight;
    let newHour = realHourDroppedY / this.blockHeight;
    if (realHourDroppedY % this.blockHeight !== 0)
      newHour++;
    const eventOffset = 0; // اول باید فاصله بین استارت و پایان معلوم شه
    event.startTime.hour = newHour;
    event.endTime.hour = newHour + eventOffset;
    this.eventService.update(event);


    console.log($event.dropPoint);
  }

  onDeleteClick(event: IEventDto) {
    this.eventService.delete(event.id);
  }
}
