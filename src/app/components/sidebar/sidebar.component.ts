import { Component, model, OnInit, ViewChild } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { SelectedDateService } from '../../services/selectedDate.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule]
})
export class SidebarComponent implements OnInit {
  selected = model<Date>(new Date());
  @ViewChild('calendar') calendar!: MatCalendar<Date>;

  constructor(private selectedDateService: SelectedDateService) { }

  ngOnInit() {
    this.selectedDateService.currentDate.subscribe((date) => {
      if (date) {
        this.selected.set(date);
        this.calendar.activeDate = date;
      }
    });
  }
}
