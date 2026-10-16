
/**
 * VISTA · Notas del semestre
 * Dibuja el estado del Modelo y comunica las acciones del usuario.
 */

export class NotasVista {
  #modelo;
  #el;

  constructor(raiz, modelo) {
    this.#modelo = modelo;

    this.#el = {
      form: raiz.querySelector('#form'),
      nombre: raiz.querySelector('#nombre'),
      peso: raiz.querySelector('#peso'),
      nota: raiz.querySelector('#nota'),
      error: raiz.querySelector('#error'),
      tabla: raiz.querySelector('#tabla'),
      vacio: raiz.querySelector('#vacio'),
      acumulado: raiz.querySelector('#acumulado'),
      pesoCalificado: raiz.querySelector('#pesoCalificado'),
      pesoPendiente: raiz.querySelector('#pesoPendiente'),
      necesaria: raiz.querySelector('#necesaria'),
      estado: raiz.querySelector('#estado')
    };

    this.#modelo.suscribir(() => this.render());
    this.render();
  }

  // 3B · Eventos

  alAgregar(manejador) {
    this.#el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      manejador(this.leerFormulario());
    });
  }

  alEliminar(manejador) {
    this.#el.tabla.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button[data-eliminar]');

      if (boton) {
        manejador(Number(boton.dataset.eliminar));
      }
    });
  }

  alCalificar(manejador) {
    this.#el.tabla.addEventListener('change', (evento) => {
      const campo = evento.target.closest('input[data-nota]');

      if (campo) {
        manejador(Number(campo.dataset.nota), campo.value);
      }
    });
  }

  // 3C · Órdenes que la Vista obedece

  leerFormulario() {
    return {
      nombre: this.#el.nombre.value,
      peso: this.#el.peso.value,
      nota: this.#el.nota.value
    };
  }

  limpiarFormulario() {
    this.#el.nombre.value = '';
    this.#el.peso.value = '';
    this.#el.nota.value = '';
  }

  mostrarError(mensaje) {
    this.#el.error.textContent = mensaje;
    this.#el.error.hidden = false;
  }

  limpiarError() {
    this.#el.error.textContent = '';
    this.#el.error.hidden = true;
  }

  // 3D · Dibujar

  render() {
    const evaluaciones = this.#modelo.evaluaciones;
    const resumen = this.#modelo.resumen();

    this.#el.tabla.replaceChildren();

    this.#el.vacio.hidden = evaluaciones.length > 0;

    for (const evaluacion of evaluaciones) {
      const fila = document.createElement('tr');

      const nombre = document.createElement('td');
      nombre.textContent = evaluacion.nombre;
      fila.append(nombre);

      const peso = document.createElement('td');
      peso.textContent = `${evaluacion.peso} %`;
      fila.append(peso);

      const celdaNota = document.createElement('td');
      const campoNota = document.createElement('input');

      campoNota.type = 'number';
      campoNota.min = '0';
      campoNota.max = '5';
      campoNota.step = '0.01';
      campoNota.value = evaluacion.nota ?? '';
      campoNota.dataset.nota = evaluacion.id;
      campoNota.setAttribute(
        'aria-label',
        `Nota de ${evaluacion.nombre}`
      );

      celdaNota.append(campoNota);
      fila.append(celdaNota);

      const aporte = document.createElement('td');
      aporte.textContent = evaluacion.nota == null
        ? '—'
        : (evaluacion.peso * evaluacion.nota / 100).toFixed(2);
      fila.append(aporte);

      const celdaAccion = document.createElement('td');
      const botonEliminar = document.createElement('button');

      botonEliminar.type = 'button';
      botonEliminar.textContent = 'Eliminar';
      botonEliminar.dataset.eliminar = evaluacion.id;

      celdaAccion.append(botonEliminar);
      fila.append(celdaAccion);

      this.#el.tabla.append(fila);
    }

    this.#el.acumulado.textContent =
      Number(resumen.acumulado).toFixed(2);

    this.#el.pesoCalificado.textContent =
      `${Number(resumen.pesoCalificado.toFixed(2))} %`;

    this.#el.pesoPendiente.textContent =
      `${Number(resumen.pesoPendiente.toFixed(2))} %`;

    this.#el.necesaria.textContent =
      resumen.notaNecesaria == null
        ? '—'
        : Number(resumen.notaNecesaria).toFixed(2);

    const textosEstado = {
      aprobado: '¡Aprobado! Ya aseguraste la nota mínima.',
      'en-camino': `En camino: necesitas ${Number(resumen.notaNecesaria).toFixed(2)} en lo que falta.`,
      'en-riesgo': `En riesgo: necesitas ${Number(resumen.notaNecesaria).toFixed(2)} en lo que falta.`,
      imposible: 'Imposible aprobar con las notas actuales.'
    };

    const clasesEstado = {
      aprobado: 'ok',
      'en-camino': 'en-camino',
      'en-riesgo': 'riesgo',
      imposible: 'imposible'
    };

    this.#el.estado.textContent =
      textosEstado[resumen.estado] ?? '';

    this.#el.estado.classList.remove(
      'ok',
      'en-camino',
      'riesgo',
      'imposible'
    );

    if (clasesEstado[resumen.estado]) {
      this.#el.estado.classList.add(
        clasesEstado[resumen.estado]
      );
    }
  }
}
