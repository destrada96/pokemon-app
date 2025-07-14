import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card';
import { RouterModule } from '@angular/router';
import { Pokemon } from '../../models/pokemon.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    PokemonCardComponent,
    RouterModule,
  ],
  templateUrl: './pokemon-list.html',
  styleUrls: ['./pokemon-list.scss']
})
export class PokemonListComponent implements OnInit {
  allPokemons: Pokemon[] = []; // Todos los Pokémon cargados
  filteredPokemons: Pokemon[] = []; // Pokémon después de aplicar filtros
  displayedPokemons: Pokemon[] = []; // Pokémon mostrados (paginados)
  isLoading = false;
  totalPokemons = 0;
  pageSize = 20;
  currentPage = 0;

  searchControl = new FormControl('');
  typeFilterControl = new FormControl('all');
  sortControl = new FormControl('name');
  sortOrderControl = new FormControl('asc');

  pokemonTypes: string[] = [
    'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  constructor(
    private pokemonService: PokemonService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllPokemons();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.currentPage = 0;
      this.applyFilters();
    });

    this.typeFilterControl.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.applyFilters();
    });

    this.sortControl.valueChanges.subscribe(() => this.applyFilters());
    this.sortOrderControl.valueChanges.subscribe(() => this.applyFilters());
  }

  loadAllPokemons(): void {
    this.isLoading = true;
    this.pokemonService.getPokemonList(0, 500).subscribe({
      next: (pokemons) => {
        this.allPokemons = pokemons;
        this.totalPokemons = pokemons.length;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load Pokémon. Please try again later.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedPokemons();
  }

  applyFilters(): void {
    let result = [...this.allPokemons];
    
    // Filtro por tipo
    const selectedType = this.typeFilterControl.value;
    if (selectedType && selectedType !== 'all') {
      result = result.filter(pokemon => 
        pokemon.types.some(type => type.name === selectedType)
      );
    }
    
    // Filtro por búsqueda
    const searchTerm = this.searchControl.value?.toLowerCase();
    if (searchTerm) {
      result = result.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Ordenamiento
    const sortBy = this.sortControl.value;
    const sortOrder = this.sortOrderControl.value;
    
    if (sortBy === 'name') {
      result.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortOrder === 'asc' 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      });
    } else if (sortBy && sortBy !== 'none') {
      result.sort((a, b) => {
        const statA = a.stats.find(stat => stat.name.toLowerCase() === sortBy)?.base_stat || 0;
        const statB = b.stats.find(stat => stat.name.toLowerCase() === sortBy)?.base_stat || 0;
        return sortOrder === 'asc' 
          ? statA - statB 
          : statB - statA;
      });
    }
    
    this.filteredPokemons = result;
    this.totalPokemons = result.length;
    this.updateDisplayedPokemons();
  }

  updateDisplayedPokemons(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedPokemons = this.filteredPokemons.slice(startIndex, endIndex);
  }
}