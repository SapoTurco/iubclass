import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'unidades', standalone: true })
export class UnidadesPipe implements PipeTransform {
  transform(n: number): string {
    return n === 0 ? 'sin existencias' : n === 1 ? '1 unidad' : `${n} unidades`;
  }
}