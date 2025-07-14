import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon';
import { Pokemon } from '../../models/pokemon.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../../services/local-storage';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBar } from '@angular/material/progress-bar';
import {StatsChartComponent} from '../stats-chart/stats-chart'
import {EvolutionChainComponent} from '../evolution-chain/evolution-chain'



@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [MatCardModule,
    CommonModule,
    TitleCasePipe,
    MatProgressSpinnerModule,
    MatProgressBar,
    StatsChartComponent,
    EvolutionChainComponent
  ],
  templateUrl: './pokemon-detail.html',
  styleUrls: ['./pokemon-detail.scss']
})
export class PokemonDetailComponent implements OnInit {
  pokemon!: Pokemon;
  isLoading = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private snackBar: MatSnackBar,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const pokemonName = params.get('name');
      if (pokemonName) {
        this.loadPokemon(pokemonName);
      }
    });
  }

  loadPokemon(name: string): void {
    this.isLoading = true;
    this.error = false;
    
    this.pokemonService.getPokemonByName(name).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.isLoading = false;
        this.localStorageService.addToRecentPokemon(pokemon);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = true;
      }
    });
  }

  getTypeStyle(type: string, color: string): any {
    return {
      'background-color': color,
      'color': 'white',
      'padding': '4px 12px',
      'border-radius': '20px',
      'font-size': '0.9rem',
      'font-weight': '500',
      'text-shadow': '0 1px 1px rgba(0, 0, 0, 0.2)'
    };
  }

  getStatPercentage(statValue: number): number {
    return (statValue / 255) * 100;
  }
}