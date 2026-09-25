import { Component, computed, signal } from '@angular/core';

// La forma del dato: así el editor avisa si escribimos f.preci.
interface Fruta {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-frutas',
  templateUrl: './frutas.html',
})
export class Frutas {
  // EL ESTADO — los datos viven en una signal.
  frutas = signal<Fruta[]>([
    { nombre: 'Mango', precio: 1800, cantidad: 12 },
    { nombre: 'Guayaba', precio: 1200, cantidad: 8 },
    { nombre: 'Patilla', precio: 6500, cantidad: 2 },
    { nombre: 'Maracuyá', precio: 3400, cantidad: 5 },
    { nombre: 'Níspero', precio: 2900, cantidad: 4 },
  ]);

  // LOS VALORES DERIVADOS — se recalculan solos.
  totalDinero = computed(() =>
    this.frutas().reduce((suma, f) => suma + f.precio * f.cantidad, 0),
  );

  // Ojo: aquí se suma la CANTIDAD, no el precio por la cantidad.
  totalUnidades = computed(() =>
    this.frutas().reduce((suma, f) => suma + f.cantidad, 0),
  );

  // CÓMO SE CAMBIA — update() devuelve un arreglo NUEVO.
  //
  // Lo que NO funciona y es el error que descuenta:
  //     this.frutas()[0].cantidad--;   <- modifica por dentro
  // La consola mostraría el dato nuevo y la pantalla el viejo.
  venderMango() {
    this.frutas.update((lista) =>
      lista.map((f) =>
        f.nombre === 'Mango' && f.cantidad > 0
          ? { ...f, cantidad: f.cantidad - 1 } // objeto nuevo, con una menos
          : f, // los demás, tal cual
      ),
    );
    // Y aquí NO hay que repintar: no existe pintar().
    // totalDinero() y totalUnidades() ya se actualizaron solos.
  }
}