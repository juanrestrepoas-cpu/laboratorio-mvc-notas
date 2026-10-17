/**
 * CONTROLADOR · Notas del semestre (PARTE 4 de la guía)
 */

import { ErrorDeReglas } from './modelo.js';

export class NotasControlador {
  #modelo;
  #vista;

  constructor(modelo, vista) {
    this.#modelo = modelo;
    this.#vista = vista;

    this.#vista.alAgregar((datos) => {
      this.#ejecutar(() => {
        this.#modelo.agregar({
          nombre: datos.nombre,
          peso: Number(datos.peso),
          nota: datos.nota === '' ? null : Number(datos.nota)
        }, true);
      }, true);
    });

    this.#vista.alEliminar((id) => {
      this.#ejecutar(() => {
        this.#modelo.eliminar(id);
      });
    });

    this.#vista.alCalificar((id, nota) => {
      this.#ejecutar(() => {
        this.#modelo.calificar(
          id,
          nota === '' ? null : Number(nota)
        );
      });
    });
  }

  #ejecutar(orden, esAgregar = false) {
    try {
      orden();
      this.#vista.limpiarError();

      if (esAgregar) {
        this.#vista.limpiarFormulario();
      }
    } catch (error) {
      if (error instanceof ErrorDeReglas) {
        this.#vista.mostrarError(error.message);
        this.#vista.render();
      } else {
        throw error;
      }
    }
  }
}