import {Component, inject, model, OnInit, ViewChild} from '@angular/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';
import {SelectedDateService} from '../../services/selectedDate.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {AddEventDialogComponent} from '../add-event-dialog/add-event-dialog.component';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule, MatButtonModule, MatIconModule]
})
export class SidebarComponent implements OnInit {
  selected = model<Date>(new Date());
  @ViewChild('calendar') calendar!: MatCalendar<Date>;
  readonly dialog = inject(MatDialog);

  constructor(private selectedDateService: SelectedDateService) {
  }

  ngOnInit() {
    this.selectedDateService.currentDate.subscribe((date) => {
      this.selected.set(date);
      this.calendar.activeDate = date;
    });

    this.selected.subscribe((date) => {
      this.selectedDateService.changeDate(date);
    })
  }

  onAddEventClick() {
    this.dialog.open(AddEventDialogComponent);
  }
}
