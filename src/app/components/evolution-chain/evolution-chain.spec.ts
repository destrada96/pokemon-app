import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionChain } from './evolution-chain';

describe('EvolutionChain', () => {
  let component: EvolutionChain;
  let fixture: ComponentFixture<EvolutionChain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvolutionChain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvolutionChain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
