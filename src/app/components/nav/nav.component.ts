import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SelectedDateService} from '../../services/selectedDate.service';

@Component({
  standalone: true,
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  imports: [MatButtonModule, MatIconModule]
})
export class NavComponent implements OnInit {

  constructor(private selectedDateService: SelectedDateService) {
  }

  ngOnInit() {
  }

  onTodayClicked() {
    this.selectedDateService.changeDate(new Date());
  }
}
