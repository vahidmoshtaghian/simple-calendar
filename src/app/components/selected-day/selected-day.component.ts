import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SelectedDateService } from '../../services/selectedDate.service';
import { IEventDto } from '../../services/models/eventDto';
import { EventService } from '../../services/event.service';

@Component({
  standalone: true,
  selector: 'app-selected-day',
  templateUrl: './selected-day.component.html',
  styleUrls: ['./selected-day.component.scss'],
  imports: [CommonModule]
})
export class SelectedDayComponent implements OnInit {
  readonly offset = 5;
  readonly blockHeight = 50;
  currentTime = 0;
  isToday = false;
  activeDate: Date | undefined;
  clockHours: { hour: number, title: string }[] = [];
  events: IEventDto[] = [];

  constructor(private selectedDateService: SelectedDateService, private eventService: EventService) { }

  ngOnInit() {
    this.fillClocks();
    this.calculateCurrentTimePointerPosition();
  }

  fillClocks() {
    this.clockHours = Array.from({ length: 24 }, (_, i) => {
      const hour = i === 0 || i === 12 ? 12 : i % 12;
      const period = i < 12 ? 'AM' : 'PM';

      return { hour: i, title: `${hour} ${period}` };
    });
  }

  calculateCurrentTimePointerPosition() {
    return this.selectedDateService.currentDate.subscribe((date) => {
      this.activeDate = date;

      if (date.getDate() === new Date().getDate()) {
        this.isToday = true;
        if (this.activeDate) {
          const nowDate = new Date();
          if (nowDate.getDate() !== this.activeDate.getDate())
            return;

          const now = nowDate.getHours() * 60 + nowDate.getMinutes();
          this.currentTime = ((now * 24) / 1440) * 51 - 5;

          this.initialEvents();
        }
      }
      else {
        this.isToday = false;
      }
    });
  }

  initialEvents() {
    if (this.activeDate) {
      this.events = this.eventService.getAll(this.activeDate);
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

    return 55;
  }

  calculateHeightEvent(event: IEventDto) {
    const hoursOffset = event.endTime.hour - event.startTime.hour;
    const minutesOffset = event.endTime.minute - event.startTime.minute
    const minutesHeight = (minutesOffset * this.blockHeight) / 60;

    return this.blockHeight * hoursOffset + minutesHeight;
  }
}
