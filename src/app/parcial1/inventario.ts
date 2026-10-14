import { Component, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FichaProducto, Producto } from './ficha-producto';

@Component({
  selector: 'app-parcial',
  imports: [FichaProducto, CurrencyPipe],
  template: `
    <div class="min-h-screen bg-slate-100 p-4">

      <h1 class="mb-4 text-2xl font-bold">
        Inventario de periféricos
      </h1>

      <div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div class="rounded bg-white p-4">
          <p>Valor total</p>
          <p class="text-xl font-bold">
            {{ valorTotal() | currency:'COP':'symbol-narrow':'1.0-0' }}
          </p>
        </div>

        <div class="rounded bg-white p-4">
          <p>Unidades totales</p>
          <p class="text-xl font-bold">
            {{ unidadesTotales() }}
          </p>
        </div>

        <div class="rounded bg-white p-4">
          <p>Productos agotados</p>
          <p class="text-xl font-bold">
            {{ productosAgotados() }}
          </p>
        </div>

      </div>

      <div class="mb-4">
        <button
          class="rounded bg-red-600 p-2 text-white"
          (click)="vaciar()">
          Vaciar lista
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

        @for (producto of productos(); track producto.nombre) {
          <app-ficha
            [producto]="producto"
            (retirar)="retirar($event)">
          </app-ficha>
        } @empty {
          <p class="rounded bg-white p-4">
            No hay productos para mostrar
          </p>
        }

      </div>

    </div>
  `
})
export class Parcial {
  productos = signal<Producto[]>([
    { nombre: 'Teclado', precio: 38000, existencias: 6 },
    { nombre: 'Ratón', precio: 22000, existencias: 0 },
    { nombre: 'Cable HDMI', precio: 15000, existencias: 2 },
    { nombre: 'Cable de red', precio: 6500, existencias: 12 }
  ]);

  valorTotal = computed(() =>
    this.productos().reduce(
      (total, p) => total + p.precio * p.existencias,
      0
    )
  );

  unidadesTotales = computed(() =>
    this.productos().reduce(
      (total, p) => total + p.existencias,
      0
    )
  );

  productosAgotados = computed(() =>
    this.productos().filter(p => p.existencias === 0).length
  );

  retirar(nombre: string) {
    this.productos.update(lista =>
      lista.map(p => {
        if (p.nombre === nombre && p.existencias > 0) {
          return {
            ...p,
            existencias: p.existencias - 1
          };
        }

        return p;
      })
    );
  }

  vaciar() {
    this.productos.set([]);
  }
}
