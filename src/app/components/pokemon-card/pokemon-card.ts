import { Component, Input } from '@angular/core';
import { Pokemon } from '../../models/pokemon.model';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    MatCardModule,
    TitleCasePipe,
    CommonModule,
  ],
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.html',
  styleUrls: ['./pokemon-card.scss']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;

  constructor(private router: Router) {}

  getCardStyle(): any {
    return {
      'border-color': this.pokemon.types[0]?.color || '#777777',
      'background': `linear-gradient(135deg, ${this.pokemon.types[0]?.color || '#777777'}20, #ffffff)`
    };
  }

  viewDetails(): void {
    this.router.navigate(['/pokemon', this.pokemon.name.toLowerCase()]);
  }
}