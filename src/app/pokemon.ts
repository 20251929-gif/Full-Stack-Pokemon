import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class Pokemon {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/pokemon';

    // Reactive state management using signals
    pokemonList = signal<any[]>([]);

    fetchPokemon() {
        this.http.get<any[]>(this.apiUrl).subscribe(data => this.pokemonList.set(data));
    }
    // This saves data to the database
    savePokemon(data: any) {
        return this.http.post(this.apiUrl, data);
    }
    //delete pokemon from the database and update the signal state
    deletePokemon(id: string){
        return this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.pokemonList.update(list => list.filter(p => p._id !== id)));
    }
    //update pokemon in the database and update the signal state
    updatePokemon(id: string, data: any){
        return this.http.put(`${this.apiUrl}/${id}`, data);
    }
}