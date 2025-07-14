import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule} from '@angular/common';



@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [
    MatCardModule,
    MatIcon,
    CommonModule
  ],
  templateUrl: './error-display.html',
  styleUrls: ['./error-display.scss']
})
export class ErrorDisplayComponent {
  @Input() message = 'An error occurred. Please try again later.';
  @Input() showAction = true;
}