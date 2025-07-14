import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar style="background-color: #2a75bb;">
      <span style="color: #ffcb05;">Pokémon App</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/" (click)="navigateHome()" style="color: #ffcb05;">Home</button>
    </mat-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .container { padding: 20px; }
  `]
})
export class App {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }
}