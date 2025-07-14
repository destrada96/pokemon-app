// src/app/services/pokemon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

// Importa las interfaces desde pokemon.model.ts (el código de interfaces permanece igual)
import { Pokemon, PokemonListResponse, PokemonApiResponse, 
         PokemonSpeciesApiResponse, EvolutionChainApiResponse, EvolutionChain, PokemonType, PokemonStat} from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';
  private pokemonTypeColors: { [key: string]: string } = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0',
    electric: '#F8D030', grass: '#78C850', ice: '#98D8D8',
    fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
    flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8',
    dark: '#705848', steel: '#B8B8D0', fairy: '#EE99AC'
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getPokemonList(offset: number, limit: number): Observable<Pokemon[]> {
    const url = `${this.apiUrl}/pokemon?offset=${offset}&limit=${limit}`;
    
    return this.http.get<PokemonListResponse>(url).pipe(
      switchMap(response => {
        const pokemonRequests = response.results.map(item => this.getPokemonDetails(item.url));
        return forkJoin(pokemonRequests);
      }),
      catchError(error => {
        this.showError('Failed to load Pokémon list. Please try again later.');
        return of([]);
      })
    );
  }

  getPokemonDetails(url: string): Observable<Pokemon> {
    return this.http.get<PokemonApiResponse>(url).pipe(
      mergeMap(pokemonResponse => {
        const speciesUrl = pokemonResponse.species.url;
        return this.http.get<PokemonSpeciesApiResponse>(speciesUrl).pipe(
          mergeMap(speciesResponse => {
            const evolutionChainUrl = speciesResponse.evolution_chain.url;
            return this.getEvolutionChain(evolutionChainUrl).pipe(
              map(evolutionChain => this.transformPokemonData(pokemonResponse, speciesResponse, evolutionChain))
            );
          })
        );
      }),
      catchError(error => {
        this.showError('Failed to load Pokémon details. Please try again later.');
        return of(this.createEmptyPokemon());
      })
    );
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    const url = `${this.apiUrl}/pokemon/${name.toLowerCase()}`;
    
    return this.http.get<PokemonApiResponse>(url).pipe(
      mergeMap(pokemonResponse => {
        const speciesUrl = pokemonResponse.species.url;
        return this.http.get<PokemonSpeciesApiResponse>(speciesUrl).pipe(
          mergeMap(speciesResponse => {
            const evolutionChainUrl = speciesResponse.evolution_chain.url;
            return this.getEvolutionChain(evolutionChainUrl).pipe(
              map(evolutionChain => this.transformPokemonData(pokemonResponse, speciesResponse, evolutionChain))
            );
          })
        );
      }),
      catchError(error => {
        this.showError(`Pokémon "${name}" not found. Please try another name.`);
        return of(this.createEmptyPokemon());
      })
    );
  }

  private getEvolutionChain(url: string): Observable<EvolutionChain> {
    return this.http.get<EvolutionChainApiResponse>(url).pipe(
      map(response => response.chain),
      catchError(error => {
        console.error('Error loading evolution chain:', error);
        return of({} as EvolutionChain);
      })
    );
  }

  private transformPokemonData(
    pokemonData: PokemonApiResponse,
    speciesData: PokemonSpeciesApiResponse,
    evolutionChain: EvolutionChain
  ): Pokemon {
    const types: PokemonType[] = pokemonData.types.map(type => ({
      name: type.type.name,
      color: this.pokemonTypeColors[type.type.name] || '#777777'
    }));

    const stats: PokemonStat[] = pokemonData.stats.map(stat => ({
      name: this.formatStatName(stat.stat.name),
      base_stat: stat.base_stat
    }));

    const imageUrl = pokemonData.sprites.other['official-artwork']?.front_default || 
                     pokemonData.sprites.front_default || 
                     'assets/images/pokemon-placeholder.png';

    return {
      id: pokemonData.id,
      name: this.capitalizeFirstLetter(pokemonData.name),
      image: imageUrl,
      types: types,
      stats: stats,
      height: pokemonData.height / 10, // Convert to meters
      weight: pokemonData.weight / 10, // Convert to kilograms
      color: speciesData.color.name,
      evolutionChain: evolutionChain
    };
  }

  private createEmptyPokemon(): Pokemon {
    return {
      id: 0,
      name: 'Unknown',
      image: 'assets/images/pokemon-placeholder.png',
      types: [],
      stats: [],
      height: 0,
      weight: 0,
      color: 'gray'
    };
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private formatStatName(statName: string): string {
    const statMap: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Attack',
      'special-defense': 'Sp. Defense',
      'speed': 'Speed'
    };
    return statMap[statName] || statName;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }
}