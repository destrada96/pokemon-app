import { Component, Input, OnInit } from '@angular/core';
import { EvolutionChain } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon';
import { Observable, of } from 'rxjs';
import { CommonModule} from '@angular/common';
import { MatIcon } from '@angular/material/icon';


interface EvolutionStage {
  name: string;
  imageUrl: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIcon
  ],
  selector: 'app-evolution-chain',
  templateUrl: './evolution-chain.html',
  styleUrls: ['./evolution-chain.scss']
})
export class EvolutionChainComponent implements OnInit {
  @Input() evolutionChain!: EvolutionChain;
  evolutionStages$!: Observable<EvolutionStage[]>;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.evolutionStages$ = this.getEvolutionStages(this.evolutionChain);
  }

  private getEvolutionStages(chain: EvolutionChain): Observable<EvolutionStage[]> {
    const stages: EvolutionStage[] = [];
    this.extractStages(chain, stages);
    return of(stages);
  }

  private extractStages(chain: EvolutionChain, stages: EvolutionStage[]): void {
    if (!chain.species) return;
    
    const pokemonId = this.getPokemonIdFromUrl(chain.species.url);
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    
    stages.push({
      name: this.capitalizeFirstLetter(chain.species.name),
      imageUrl: imageUrl
    });
    
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      this.extractStages(chain.evolves_to[0], stages);
    }
  }

  private getPokemonIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10);
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}