# Entrega · Laboratorio MVC · Notas del semestre

**Equipo:** Santiago Machado, Sergio Perez, Juan Manuel Restrepo   
**Integrantes:** ______________________  
**Repositorio:** ______________________

> Completa este archivo a medida que avanzas (cada sección dice en qué parte de la guía se llena).
> Escribe con tus palabras: las respuestas copiadas de la guía o de otro equipo no cuentan.

---

## 1. Mapa de responsabilidades (Parte 1)

Clasifica cada fragmento de `espagueti.html`: **M** (Modelo), **V** (Vista), **C** (Controlador) o **Mezcla**
(en ese caso, escribe qué roles se mezclan). En "¿Por qué?" justifica en una frase.

| # | Fragmento | Rol(es) | ¿Por qué? |
|---|---|---|---|
| 1 | `var n = document.getElementById('nombre').value.trim();` |V| Lo clasificamos como Vista porque solo lee lo que el usuario escribio en el formulario. No decide nada con ese dato. |
| 2 | `if (isNaN(p) \|\| p < 1 \|\| p > 100) { err.textContent = 'El peso debe estar entre 1 y 100.'; return; }` | Mezcla de M y V | La condicion del peso entre 1 y 100 es una regla del negocio, pero en la misma linea se escribe el mensaje en la pantalla con err.textContent. |
| 3 | `if (total + p > 100) { err.textContent = '...'; return; }` | Mezcla de M y V | Revisar que los pesos no pasen de 100 es una regla, y mostrar el mensaje de error es de pantalla. Van pegadas en el mismo if. |
| 4 | `evals.push({ id: sig++, nombre: n, peso: p, nota: nota });` | M | Aqui se crea la evaluacion y se le asigna el id, o sea que son datos puros. |
| 5 | `localStorage.setItem('notas.v1', JSON.stringify(evals));` | M | Guardar en localStorage es persistencia, y eso le toca al Modelo por atraves de un almacen. La Vista no deberia saber donde se guardan los datos. |
| 6 | `document.getElementById('nombre').value = '';` | V | Solo limpia el campo de la pantalla, no tiene reglas ni datos. |
| 7 | `'<input ... onchange="ponerNota(' + e.id + ', this.value)">'` | Mezcla de V y C | Dibuja el input en la tabla y a la vez engancha el evento con onchange, que es reaccionar al usuario, todo dentro de un texto armado a mano. |
| 8 | `nec = Math.ceil(nec * 100 - 1e-9) / 100;` | M | Es el redondeo hacia arriba de la nota necesaria, una regla de calculo que no tiene que ver con la pantalla. |
| 9 | `if (acum + 1e-9 >= 3.0) { txt = '¡Aprobado! ...'; cls = 'ok'; }` | Mezcla de M y V | Decidir que el estudiante aprobo (acum >= 3.0) es regla del negocio, pero en la misma linea se escoge el texto y la clase CSS que se ven en pantalla. |
| 10 | `document.getElementById('tabla').innerHTML = filas;` | V | Es meter el HTML armado en la tabla, dibujo puro. |
| 11 | `function borrar(id) { ...splice...; localStorage.setItem(...); pintar(); }` | Mezcla de M, V y C | La funcion reacciona al clic que es C, borra de la lista y guarda que seria M y vuelve a pintar y limpia el error que es V. Hace las tres cosas en cuatro lineas. |
| 12 | `(e.peso * e.nota / 100).toFixed(2)` | Mezcla de M y V | El calculo del aporte es peso por nota entre 100, es regla, y el toFixed(2) es solo formato para mostrarlo. Se puede argumentar que es casi todo M, pero como el formato esta pegado, lo clasificamos como mezcla. |

## 2. Olores del espagueti (Parte 1)

Lista **al menos 5** problemas de diseño de `espagueti.html`. Para cada uno, escribe qué consecuencia tiene
cuando el proyecto crece y en qué pieza de MVC viviría la solución.

| Olor | Consecuencia | Dónde se arregla (M, V o C) |
|---|---|---|
| Variables globales son evals y sig | cualquier funcion las puede cambiar y cuesta saber quien dañó algo | M |
| La validacion de la nota esta repetida en agregar y en ponerNota | si cambiamos la regla en un lado y se nos olvida el otro, la app queda inconsistente | M |
| Valores magicos repetidos 3.0, 4.0, 5.0 y la clave notas.v1 | para cambiar la nota minima hay que buscar cada 3.0 y es facil dejar uno viejo | M |
| HTML armado con texto e innerHTML | lo que escribe el usuario se interpreta como HTML, por eso <b>hola</b> sale en negrita, y es un riesgo de seguridad | V |
|Funciones que hacen varias cosas agregar valida, guarda, limpia y pinta | son largas, dificiles de leer y un cambio en una parte puede romper otra | C |

## 3. El flujo de «agregar una evaluación» (Parte 6)

Dibuja (a mano y pega una foto, o con texto/Mermaid) el recorrido completo desde que el usuario presiona
**Agregar** hasta que ve la fila nueva en la tabla. Marca en cada paso **el archivo y el método** que actúa.

```mermaid
sequenceDiagram
    actor U as Usuario
    participant V as Vista (vista.js)
    participant C as Controlador (controlador.js)
    participant M as Modelo (modelo.js)
    participant A as Almacen (almacen.js)
    participant T as Termometro (termometro-vista.js)

    U->>V: presiona Agregar (evento submit)
    V->>C: avisa con el manejador de alAgregar
    C->>V: leerFormulario()
    V-->>C: nombre, peso y nota como texto
    C->>M: agregar con los datos ya convertidos a numero
    M->>M: valida las reglas R1 a R5 y crea la evaluacion
    M->>A: guardar()
    M->>V: avisa a los suscriptores
    M->>T: avisa a los suscriptores
    V->>V: render() dibuja la fila nueva
    T->>T: render() mueve la barra
    C->>V: limpiarFormulario()
    V-->>U: ve la fila nueva en la tabla
```

## 4. Evidencias (Partes 2, 3, 4 y 6)

**Salida de `npm test`** (pega el final, donde dice cuántas pruebas pasan):

```text

```

**Salida de `npm run arquitectura`:**

```text

```

**Captura de pantalla** de la app con las dos vistas (la tabla/resumen y el termómetro): _(pega la imagen o su enlace)_

## 5. Tres cambios, tres lugares (Parte 5)

Después de cada cambio ejecuta `git diff --stat HEAD~1` (o `git show --stat`) y pega el resultado.
La idea: **cada cambio debía tocar solo las piezas que le corresponden**.

| Cambio | Archivos que tocaste | ¿Era lo esperado? ¿Por qué? |
|---|---|---|
| 5A · Nombres únicos | solo src/modelo.js | si, es una regla nueva y las reglas viven en el Modelo. La Vista y el Controlador no cambian, y el error igual aparece en pantalla |
| 5B · Segunda vista (termómetro) | src/termometro-vista.js nuevo y src/main.js | si, es una vista nueva que se suscribe al Modelo y se conecta en main.js. El Modelo no cambia |
| 5C · Otro almacén | src/almacen.js y src/main.js | si, el Modelo solo pide cargar() y guardar(), asi que cambiar donde se guarda no lo afecta |

## 6. Reflexión (Parte 6)

1. En la versión espagueti, ¿qué tuviste que leer o tocar para entender dónde se decide si el estudiante aprobó? ¿Y en la versión MVC?

R/ En el espagueti tuvimos que leer toda la funcion pintar, porque ahi se calcula el acumulado y se decide si aprobo, y todo esta revuelto con el codigo que dibuja la tabla. En la version MVC esa decision queda en resumen() del Modelo, en un solo lugar y sin nada de pantalla.

2. ¿Por qué el Modelo **no** debe llamar a `alert()` ni a `document`? ¿Qué pasaría con las pruebas del Modelo si lo hiciera?

R/ Porque el Modelo solo debe tener datos y reglas. Si usara alert() o document, las pruebas no se podrian correr sin navegador, y cualquier cambio en la pantalla nos obligaria a tocar el Modelo.

3. El Modelo avisa de sus cambios sin saber quién escucha (Observer). ¿Qué ganamos con eso frente a que el Modelo llame directamente a `vista.render()`?

R/ Con el Observer el Modelo no tiene que saber cuantas vistas hay. Asi podemos agregar el termometro sin cambiar el Modelo. Si llamara directo a vista.render(), quedaria amarrado a esa vista y cada vista nueva lo obligaria a cambiar.

4. Elige un olor de MVC (controlador gordo, lógica en la Vista, Modelo que toca la pantalla, Modelo anémico) que te hubiera sido fácil cometer hoy. ¿Cuál y cómo lo evitaron?
R/ 

5. ¿Para qué tipo de aplicación **no** usarías MVC? Justifica con lo que viste en el laboratorio.

R/ No lo usariamos en un script pequeño o de una sola vez, porque separar en tres piezas daria mas trabajo que beneficio. Se justifica cuando la app va a crecer, tiene reglas que probar o necesita varias pantallas.
