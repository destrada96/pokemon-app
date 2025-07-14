import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly RECENT_POKEMON_KEY = 'recent_pokemon';
  private maxRecentPokemon = 10;

  constructor() {}

  addToRecentPokemon(pokemon: Pokemon): void {
    let recentPokemon = this.getRecentPokemon();
    
    // Remove if already exists
    recentPokemon = recentPokemon.filter(p => p.id !== pokemon.id);
    
    // Add to beginning
    recentPokemon.unshift(pokemon);
    
    // Limit to max items
    if (recentPokemon.length > this.maxRecentPokemon) {
      recentPokemon = recentPokemon.slice(0, this.maxRecentPokemon);
    }
    
    localStorage.setItem(this.RECENT_POKEMON_KEY, JSON.stringify(recentPokemon));
  }

  getRecentPokemon(): Pokemon[] {
    const recentPokemonJson = localStorage.getItem(this.RECENT_POKEMON_KEY);
    return recentPokemonJson ? JSON.parse(recentPokemonJson) : [];
  }

  clearRecentPokemon(): void {
    localStorage.removeItem(this.RECENT_POKEMON_KEY);
  }
}