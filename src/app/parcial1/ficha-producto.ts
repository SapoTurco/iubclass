
import { Component, input, output, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

@Component({
  selector: 'app-ficha',
  imports: [CurrencyPipe],
  template: `
    <div class="rounded border bg-white p-4">

      <h2 class="mb-2 text-xl font-bold">
        {{ producto().nombre }}
      </h2>

      <p class="mb-2">
        Precio:
        {{ producto().precio | currency:'COP':'symbol-narrow':'1.0-0' }}
      </p>

      <p class="mb-2">
        Existencias: {{ producto().existencias }}
      </p>

      <p class="mb-3">
        Estado:

        @switch (estado()) {
          @case ('Agotado') {
            <span class="font-bold text-red-600">Agotado</span>
          }
          @case ('Inventario bajo') {
            <span class="font-bold text-amber-600">Inventario bajo</span>
          }
          @case ('Disponible') {
            <span class="font-bold text-green-600">Disponible</span>
          }
        }
      </p>

      <button
        class="rounded bg-slate-900 p-2 text-white disabled:bg-slate-400"
        (click)="retirar.emit(producto().nombre)"
        [disabled]="producto().existencias === 0">
        Retirar 1
      </button>

    </div>
  `
})
export class FichaProducto {
  producto = input.required<Producto>();

  retirar = output<string>();

  estado = computed(() => {
    if (this.producto().existencias === 0) {
      return 'Agotado';
    }

    if (this.producto().existencias < 3) {
      return 'Inventario bajo';
    }

    return 'Disponible';
  });
}
