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
  readonly uiStyle = {
    containerOffset: 5,
    blockHeight: 50,
    eventWidth: 300
  };
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

  calculateStartEvent(event: IEventDto) {
    const borderHeights = event.startTime.hour + 1;
    const minutesHeight = (this.uiStyle.blockHeight * event.startTime.minute) / 60;

    return this.uiStyle.blockHeight * event.startTime.hour + minutesHeight + borderHeights + this.uiStyle.containerOffset;
  }

  calculateLeftEvent(event: IEventDto, index: number) {
    const eventsOffset = 5;
    const currentEvent = {
      start: event.startTime.hour * 60 + event.startTime.minute,
      end: event.endTime.hour * 60 + event.endTime.minute
    }
    let overlapCount = 0;
    for (let i = 0; i <= index; i++) {
      const item = {
        start: this.events[i].startTime.hour * 60 + event.startTime.minute,
        end: this.events[i].endTime.hour * 60 + event.startTime.minute
      };

      if (this.events[i].id !== event.id &&
        (currentEvent.start <= item.start && item.start <= currentEvent.end ||
          currentEvent.start <= item.end && item.end <= currentEvent.end ||
          currentEvent.start <= item.start && item.end <= currentEvent.end ||
          item.start <= currentEvent.start && currentEvent.end <= item.end))
        overlapCount++;
    }

    return this.uiStyle.containerOffset +
      this.uiStyle.blockHeight +
      (this.uiStyle.eventWidth + eventsOffset) * overlapCount;
  }

  calculateHeightEvent(event: IEventDto) {
    const hoursOffset = event.endTime.hour - event.startTime.hour;
    const minutesOffset = event.endTime.minute - event.startTime.minute
    const minutesHeight = (minutesOffset * this.uiStyle.blockHeight) / 60;

    return this.uiStyle.blockHeight * hoursOffset + minutesHeight;
  }

  dragEnd(event: CdkDragEnd, eventDto: IEventDto) {
    const element = event.source.element.nativeElement;
    const container = element.offsetParent!;

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    let newTop = elementRect.top - containerRect.top - this.uiStyle.containerOffset;
    if (newTop < 0)
      newTop = 0;

    const newStartHour = Math.floor(newTop / this.uiStyle.blockHeight);
    const newStartMinute = Math.round(((newTop % this.uiStyle.blockHeight) / this.uiStyle.blockHeight) * 60);

    const eventDurationMinutes = (eventDto.endTime.hour * 60 + eventDto.endTime.minute)
      - (eventDto.startTime.hour * 60 + eventDto.startTime.minute);

    eventDto.startTime.hour = newStartHour;
    eventDto.startTime.minute = newStartMinute;

    const newEndTimeMinutes = newStartHour * 60 + newStartMinute + eventDurationMinutes;
    eventDto.endTime.hour = Math.floor(newEndTimeMinutes / 60);
    eventDto.endTime.minute = newEndTimeMinutes % 60;

    this.eventService.update(eventDto);

    this.initialEvents();
  }

  onDeleteClick(event: IEventDto) {
    this.eventService.delete(event.id);
  }
}
