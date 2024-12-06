import {Component, OnInit} from '@angular/core';
import {NavComponent} from "../nav/nav.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {SelectedDayComponent} from "../selected-day/selected-day.component";

@Component({
  standalone: true,
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [NavComponent, SidebarComponent, SelectedDayComponent]
})
export class MainComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
