import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Linea, ResumenPedido } from './resumen-pedido';
import { Producto, TarjetaProducto } from './tarjeta-producto';

@Component({
  selector: 'app-pedido',
  imports: [CurrencyPipe, TarjetaProducto, ResumenPedido],
  template: `
    <section class="space-y-8">
      <header>
        <p class="text-sm font-bold uppercase tracking-wider text-amber-600">
          Taller 03 · Sesión S04
        </p>
        <h1 class="mt-1 text-3xl font-bold text-slate-900">Pedido</h1>
        <p class="mt-2 text-slate-600">
          Agrega productos y revisa el resumen de tu compra.
        </p>
      </header>

      <section>
        <h2 class="mb-4 text-xl font-bold text-slate-900">Productos</h2>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (producto of productos; track producto.nombre) {
            <app-tarjeta-producto
              [producto]="producto"
              [enPedido]="unidadesPorProducto()[producto.nombre] ?? 0"
              (agregar)="agregar($event)"
            />
          }
        </div>
      </section>

      <app-resumen-pedido
        [lineas]="lineas()"
        (quitar)="quitar($event)"
      />
    </section>
  `,
})
export class Pedido {
  productos: Producto[] = [
    { nombre: 'Mango', precio: 1800, existencias: 3 },
    { nombre: 'Aguacate', precio: 4500, existencias: 2 },
    { nombre: 'Limón', precio: 650, existencias: 10 },
    { nombre: 'Queso costeño', precio: 12000, existencias: 1 },
  ];

  pedido = signal<Linea[]>([]);

  lineas = computed(() => this.pedido());

  unidadesPorProducto = computed(() => {
    const unidades: Record<string, number> = {};

    for (const linea of this.pedido()) {
      unidades[linea.nombre] = linea.cantidad;
    }

    return unidades;
  });

  agregar(nombre: string): void {
    const producto = this.productos.find((item) => item.nombre === nombre);

    if (!producto) {
      return;
    }

    this.pedido.update((lineasActuales) => {
      const lineaExistente = lineasActuales.find(
        (linea) => linea.nombre === nombre,
      );

      if (lineaExistente) {
        if (lineaExistente.cantidad >= producto.existencias) {
          return lineasActuales;
        }

        return lineasActuales.map((linea) =>
          linea.nombre === nombre
            ? { ...linea, cantidad: linea.cantidad + 1 }
            : linea,
        );
      }

      return [
        ...lineasActuales,
        { nombre: producto.nombre, precio: producto.precio, cantidad: 1 },
      ];
    });
  }

  quitar(nombre: string): void {
    this.pedido.update((lineasActuales) =>
      lineasActuales.filter((linea) => linea.nombre !== nombre),
    );
  }
}