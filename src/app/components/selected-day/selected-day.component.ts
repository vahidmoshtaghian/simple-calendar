import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-selected-day',
  templateUrl: './selected-day.component.html',
  styleUrls: ['./selected-day.component.scss'],
  imports: [CommonModule]
})
export class SelectedDayComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

  clockHours = Array.from({ length: 24 }, (_, i) => {
    const hour = i === 0 || i === 12 ? 12 : i % 12;
    const period = i < 12 ? 'AM' : 'PM';

    return `${hour} ${period}`;
  });
}
