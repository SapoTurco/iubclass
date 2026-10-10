import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

@Component({
  selector: 'app-tarjeta-producto',
  imports: [CurrencyPipe],
  template: `
    <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 class="text-lg font-bold text-slate-900">{{ producto().nombre }}</h3>

      <p class="mt-1 text-sm text-slate-600">
        {{ producto().precio | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO' }}
      </p>

      <p class="mt-2 text-sm font-medium text-slate-700">
        Disponibles: {{ disponibles() }}
      </p>

      <button
        type="button"
        class="mt-4 rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-900 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        [disabled]="disponibles() === 0"
        (click)="agregar.emit(producto().nombre)"
      >
        Agregar
      </button>
    </article>
  `,
})
export class TarjetaProducto {
  producto = input.required<Producto>();
  enPedido = input(0);

  disponibles = computed(
    () => this.producto().existencias - this.enPedido(),
  );

  agregar = output<string>();
}