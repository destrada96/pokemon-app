export interface PokemonStat {
    name: string;
    base_stat: number;
  }
  
  export interface PokemonType {
    name: string;
    color: string;
  }

  export interface PokemonStat {
    name: string;
    base_stat: number;
  }
  
  export interface PokemonType {
    name: string;
    color: string;
  }
  
  export interface Pokemon {
    id: number;
    name: string;
    image: string;
    types: PokemonType[];
    stats: PokemonStat[];
    height: number;
    weight: number;
    color: string;
    evolutionChain?: EvolutionChain;
  }
  
  export interface EvolutionChain {
    species: {
      name: string;
      url: string;
    };
    evolves_to: EvolutionChain[];
  }
  
  export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
  }
  
  export interface PokemonListItem {
    name: string;
    url: string;
  }
  
  export interface PokemonApiResponse {
    id: number;
    name: string;
    sprites: {
      front_default: string;
      other: {
        'official-artwork': {
          front_default: string;
        };
      };
    };
    types: {
      slot: number;
      type: {
        name: string;
        url: string;
      };
    }[];
    stats: {
      base_stat: number;
      effort: number;
      stat: {
        name: string;
        url: string;
      };
    }[];
    height: number;
    weight: number;
    species: {
      name: string;
      url: string;
    };
  }
  
  export interface PokemonSpeciesApiResponse {
    color: {
      name: string;
    };
    evolution_chain: {
      url: string;
    };
  }
  
  export interface EvolutionChainApiResponse {
    chain: EvolutionChain;
  }