import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { UnidadesPipe } from './pipes';

@Component({
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UnidadesPipe],
  templateUrl: './inv.html',
  styles: [`.agotado { background: #fee2e2; }`]
})
export class Inv {
  hoy = new Date();
  categorias = ['Todas', 'Frutas', 'Verduras', 'Granos'];
  filtro = signal('Todas');

  productos = signal([
    { nombre: 'Mango', categoria: 'Frutas', precio: 1800, cantidad: 12 },
    { nombre: 'Guayaba', categoria: 'Frutas', precio: 1200, cantidad: 0 },
    { nombre: 'Patilla', categoria: 'Frutas', precio: 6500, cantidad: 2 },
    { nombre: 'Tomate', categoria: 'Verduras', precio: 3200, cantidad: 9 },
    { nombre: 'Cebolla', categoria: 'Verduras', precio: 2800, cantidad: 1 },
    { nombre: 'Ahuyama', categoria: 'Verduras', precio: 4500, cantidad: 0 }
  ]);

  visibles = computed(() => this.productos().filter(
    p => this.filtro() === 'Todas' || p.categoria === this.filtro()
  ));

  filas = computed(() => this.visibles().map(p => ({
    ...p,
    estado: p.cantidad === 0 ? 'agotado' : p.cantidad <= 2 ? 'bajo' : 'disponible'
  })));
}