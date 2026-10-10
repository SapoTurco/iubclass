import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export interface Linea {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-resumen-pedido',
  imports: [CurrencyPipe],
  template: `
    <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="text-xl font-bold text-slate-900">Resumen del pedido</h2>

      <div class="mt-4 divide-y divide-slate-200">
        @for (linea of lineas(); track linea.nombre) {
          <div class="flex items-center justify-between gap-4 py-3">
            <div>
              <p class="font-semibold text-slate-800">{{ linea.nombre }}</p>
              <p class="text-sm text-slate-600">
                {{ linea.cantidad }} ×
                {{ linea.precio | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO' }}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <span class="font-semibold text-slate-800">
                {{
                  linea.precio * linea.cantidad
                    | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO'
                }}
              </span>

              <button
                type="button"
                class="rounded-lg border border-red-200 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-50"
                (click)="quitar.emit(linea.nombre)"
              >
                Quitar
              </button>
            </div>
          </div>
        } @empty {
          <p class="py-5 text-slate-600">El pedido está vacío</p>
        }
      </div>

      <div class="mt-4 space-y-2 border-t border-slate-200 pt-4">
        <div class="flex justify-between text-slate-700">
          <span>Subtotal</span>
          <span>{{ subtotal() | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO' }}</span>
        </div>

        <div class="flex justify-between text-slate-700">
          <span>Domicilio</span>
          @if (lineas().length === 0) {
            <span>—</span>
          } @else if (domicilio() === 0) {
            <span>Gratis</span>
          } @else {
            <span>
              {{ domicilio() | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO' }}
            </span>
          }
        </div>

        <div class="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold text-slate-900">
          <span>Total</span>
          <span>{{ total() | currency: 'COP' : 'symbol' : '1.0-0' : 'es-CO' }}</span>
        </div>
      </div>
    </section>
  `,
})
export class ResumenPedido {
  lineas = input.required<Linea[]>();
  quitar = output<string>();

  subtotal = computed(() =>
    this.lineas().reduce(
      (suma, linea) => suma + linea.precio * linea.cantidad,
      0,
    ),
  );

  domicilio = computed(() => {
    if (this.lineas().length === 0) {
      return 0;
    }

    return this.subtotal() < 20000 ? 3000 : 0;
  });

  total = computed(() => this.subtotal() + this.domicilio());
}