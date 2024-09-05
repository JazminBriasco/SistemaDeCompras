import { Component } from '@angular/core';
import { TITLE } from './utils/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public mainTitle: string =  TITLE.MAIN_TITLE;

}
