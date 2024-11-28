import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SelectedDateService } from '../../services/selectedDate.service';

@Component({
  standalone: true,
  selector: 'app-selected-day',
  templateUrl: './selected-day.component.html',
  styleUrls: ['./selected-day.component.scss'],
  imports: [CommonModule]
})
export class SelectedDayComponent implements OnInit {
  currentTime = 0;
  isToday = false;
  activeDate: Date | undefined;

  constructor(private selectedDateService: SelectedDateService) { }

  ngOnInit() {

    this.selectedDateService.currentDate.subscribe((date) => {
      this.activeDate = date;

      if (date.getDate() === new Date().getDate()) {
        this.isToday = true;
        this.calculateCurrentTimePointerPosition();
      }
      else {
        this.isToday = false;
      }
    });
  }

  clockHours = Array.from({ length: 24 }, (_, i) => {
    const hour = i === 0 || i === 12 ? 12 : i % 12;
    const period = i < 12 ? 'AM' : 'PM';

    return `${hour} ${period}`;
  });

  calculateCurrentTimePointerPosition() {
    if (this.activeDate) {
      const nowDate = new Date();
      if (nowDate.getDate() !== this.activeDate.getDate())
        return;

      const now = nowDate.getHours() * 60 + nowDate.getMinutes();
      this.currentTime = ((now * 24) / 1440) * 51 - 5;
    }
  }
}

