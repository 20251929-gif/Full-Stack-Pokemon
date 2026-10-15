import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pokemon } from '../pokemon';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-pokemon-form',
  styleUrl: './pokemon-form.css',
  templateUrl: './pokemon-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  pokemonService = inject(Pokemon);
  editingID = signal<string | null>(null);

  pokemonForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1)]],
    nature: ['', Validators.required],
  });

  ngOnInit() {
    // Initial fetch function to show data when the component is loaded
    this.pokemonService.fetchPokemon();
  }

onSubmit() {
    if (this.pokemonForm.invalid) return;

    const data = this.pokemonForm.getRawValue();
    const id = this.editingID();

    if(id){
      this.pokemonService.updatePokemon(id, data).subscribe({
        next: () => {
          this.pokemonService.fetchPokemon();
          this.cancelEdit();
        }, 
        error: (err) => console.error('Update Failed!', err)
      })
    } else {
      this.pokemonService.savePokemon(data).subscribe({
      next: () => {
        this.pokemonService.fetchPokemon();
        this.pokemonForm.reset();
      },
      error: (err) => console.error('Save failed', err)
      });
    }
  }

  deletePokemon(id: string) {
    if (confirm('Are you sure you want to release this Pokemon into the wild?')) {
      this.pokemonService.deletePokemon(id);
    }
  }

  startEdit(pokemon: any) {
    this.editingID.set(pokemon._id);
    this.pokemonForm.patchValue(pokemon);
  }
  cancelEdit(){
    this.editingID.set(null);
    this.pokemonForm.reset();
  }
}