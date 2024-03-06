class Equipo {
  constructor(nombre, id) {
    this.id = id;
    this.nombre = nombre;
    this.puntos = 0;
    this.golesAFavor = 0;
    this.golesEnContra = 0;
    this.diferenciaDeGol = 0;
    this.partidosJugados = 0;
    this.rivales = [];
  }
  partidoCreado(rival) {
    this.rivales.push({
      nombre: rival.nombre,
      jugado: false,
      golesAFavor: 0,
      golesEnContra: 0,
      puntosObtenidos: 0,
    });
  }
  partidoJugado(goles1, goles2, equipoB) {
    let equipoRival;
    let golesEquipoA = parseInt(goles1);
    let golesEquipoB = parseInt(goles2);
    this.rivales.forEach((elemento) => {
      if (equipoB.nombre === elemento.nombre) {
        equipoRival = elemento;
      }
    });

    if (!Number.isInteger(golesEquipoA)) {
      golesEquipoA = 0;
    }
    if (!Number.isInteger(golesEquipoB)) {
      golesEquipoB = 0;
    }
    if (equipoRival.jugado) {
      equipoRival.golesAFavor = golesEquipoA;
      equipoRival.golesEnContra = golesEquipoB;
      if (golesEquipoA > golesEquipoB) {
        equipoRival.puntosObtenidos = 3;
      } else {
        if (golesEquipoA === golesEquipoB) {
          equipoRival.puntosObtenidos = 1;
        } else {
          equipoRival.puntosObtenidos = 0
        }
      }
    } else {
      this.partidosJugados++;
      equipoRival.jugado = true;
      equipoRival.golesAFavor = golesEquipoA;
      equipoRival.golesEnContra = golesEquipoB;
      if (golesEquipoA > golesEquipoB) {
        equipoRival.puntosObtenidos = 3;
      } else {
        if (golesEquipoA === golesEquipoB) {
          equipoRival.puntosObtenidos = 1;
        } else {
          equipoRival.puntosObtenidos = 0
        }
      }
    }
    this.golesAFavor = 0
    this.golesEnContra = 0
    this.puntos = 0
    this.diferenciaDeGol = 0
    this.rivales.forEach((rival) => {
      this.golesAFavor = this.golesAFavor + rival.golesAFavor;
      this.golesEnContra = this.golesEnContra + rival.golesEnContra;
      this.puntos = this.puntos + rival.puntosObtenidos
    });
    this.diferenciaDeGol =
      this.diferenciaDeGol + this.golesAFavor - this.golesEnContra;
  }
}
function creadorDeFechas(equipos, cantFechas) {
  let fechas = [];
  //se agrega o no un "equipo x" que representa las fechas libres
  if (Math.floor(equipos.length / 2) !== equipos.length / 2) {
    equipos.push({ nombre: "x" });
  }
  //se cicla por la cantidad de fechas
  for (let i = 0; i < cantFechas; i++) {
    //push un array vacio donde van a estar los partidos de la fecha
    fechas.push([]);
    //cada equipo se empareja con el del extremo opuesto (equipo1 vs equipo4, equipo2 vs equipo3)
    for (let j = 0; j < equipos.length / 2; j++) {
      let equipo1 = equipos[j];
      let equipo2 = equipos[equipos.length - 1 - j];

      //push en el array de la fecha los dos equipos elegidos si ningun equipo es "x"(fecha vacia)
      if (!(equipo1.nombre === "x" || equipo2.nombre === "x")) {
        equipo1.partidoCreado(equipo2);
        equipo2.partidoCreado(equipo1);
        fechas[i].push([equipo1, equipo2]);
      }
    }
    //cambio del orden del array para volver a iniciar el ciclo en la proxima fecha
    let equipoCiclado = equipos.splice(1, 1);
    equipos.push(equipoCiclado[0]);
  }
  return fechas;
}
//
function cuantasFechas(equipos) {
  if (Math.floor(equipos.length / 2) !== equipos.length / 2) {
    return equipos.length;
  } else {
    return equipos.length - 1;
  }
}
function convertidorPartidos(fechas, equipos) {
  fechas.forEach((fecha) => {
    fecha.forEach((partido) => {
      partido.forEach((idEquipo) => {
        const equipoEncontrado = equipos.find(
          (equipo) => equipo.id === idEquipo
        );
        partido.splice(partido.indexOf(idEquipo), 1, equipoEncontrado);
      });
    });
  });
  return fechas;
}
function agregarInput() {
  const contenedorEquipos = document.querySelector("#sectionSelectorEquipos");
  const div = document.createElement("div");
  div.id = `inputContenedor${contadorInputs}`;
  div.innerHTML = `<input
  class="inputEquipo"
  id="equipoInput${contadorInputs}"
  type="text"
  placeholder="Ingrese un Equipo..."
  autocomplete="off"/>`;
  contenedorEquipos.appendChild(div);

  contadorInputs++;
  arrayInputs.push(div);
}
function eliminarInput() {
  const inputAEliminar = document.querySelector(
    `#inputContenedor${contadorInputs - 1}`
  );
  inputAEliminar.remove();
  contadorInputs--;
  arrayInputs.pop();
}
function creadorMensajePartidos() {
  let mensaje = ``;
  fechas.forEach((fecha) => {
    nroDeFecha = fechas.indexOf(fecha);
    mensaje =
      mensaje +
      `<div id="fecha${nroDeFecha + 1}"> <h3>fecha ${nroDeFecha + 1}</h3>`;
    fecha.forEach((partido) => {
      mensaje =
        mensaje +
        `
      <div  class="partidoFecha"> 
      <label>${partido[0].nombre}</label>
      <input></input>
      <input></input>
      <label>${partido[1].nombre}</label>
      </div>
      `;
    });;
    mensaje = mensaje + "</div>"
  });

  return mensaje;
}
function creadorTabla(contenedorTabla) {

  let mensajeTabla = `<div class="tabla">
    <div class="equipoTabla"> 
    <p>equipo</p> 
    <p>Pts</p>
    <p>PJ</p> 
    <p>GF</p>
    <p>GC</p>
    <p>DG</p>
    </div>`
  equipos.forEach((equipo) => {

    if ((equipo.nombre !== "x")) {
      mensajeTabla = mensajeTabla + `
    <div class="equipoTabla"> 
    <p>${equipo.nombre}</p> 
    <p>${equipo.puntos}</p>
    <p>${equipo.partidosJugados}</p> 
    <p>${equipo.golesAFavor}</p>
    <p>${equipo.golesEnContra}</p>
    <p>${equipo.diferenciaDeGol}</p>
    </div>`
    }


  })
  mensaje = mensaje + "</div>"
  contenedorTabla.innerHTML = mensajeTabla
  return contenedorTabla
}
function actualizarTabla() {
  equipos.sort((a, b) => {
    if (a.puntos > b.puntos) {
      return -1;
    }
    if (b.puntos > a.puntos) {
      return 1;
    }
    if (a.diferenciaDeGol > b.diferenciaDeGol) {
      return -1;
    }
    if (a.diferenciaDeGol < b.diferenciaDeGol) {
      return 1;
    }
    if (a.golesAFavor > b.golesAFavor) {
      return -1;
    }
    if (a.golesAFavor < b.golesAFavor) {
      return 1;
    }
    return 0;
  });
  console.log(equipos)
  const divsTabla = document.querySelectorAll(".equipoTabla")

  console.log(divsTabla)
  equipos.forEach((equipo) => {
    divsTabla.forEach((div) => {
      if (equipo.nombre === div.children[0].innerText) {
        console.log(equipo)
        div.style.order = `${equipos.indexOf(equipo)}`
        div.children[1].innerText = equipo.puntos
        div.children[2].innerText = equipo.partidosJugados
        div.children[3].innerText = equipo.golesAFavor
        div.children[4].innerText = equipo.golesEnContra
        div.children[5].innerText = equipo.diferenciaDeGol
      }
    })
  })

}

function continuar() {
  //guardamos los equipos de los inputs y definimos las fechas
  guardarEquipos();

  //creamos mensaje en el DOM

  mensaje = creadorMensajePartidos();
  contenedor.innerHTML = mensaje;


  const contenedorTabla = document.createElement("div")
  contenedorTabla.classList.add("contenedorTabla")
  const main = document.querySelector("main")
  const tabla = creadorTabla(contenedorTabla)
  main.appendChild(tabla)
  contenedor.classList.add("fechas")
  contenedor.classList.remove("equipos")
  fechas.forEach((fecha) => {
    const divFecha = document.querySelector(
      `#fecha${fechas.indexOf(fecha) + 1}`
    );
    console.log(divFecha)
    for (let i = 1; i < divFecha.children.length; i++) {
      const input1 = divFecha.children[i].children[1];
      const input2 = divFecha.children[i].children[2];

      let equipo1 = divFecha.children[i].children[0].innerText;
      let equipo2 = divFecha.children[i].children[3].innerText;
      equipo1 = equipos.find((equipo) => {
        return equipo1 === equipo.nombre;
      });
      equipo2 = equipos.find((equipo) => {
        return equipo2 === equipo.nombre;
      });
      input1.addEventListener("input", (event) => {
        console.log("aa")
        equipo1.partidoJugado(event.target.value, input2.value, equipo2);
        equipo2.partidoJugado(input2.value, event.target.value, equipo1);
        actualizarTabla()
      });
      input2.addEventListener("input", (event) => {
        console.log("aa")
        equipo2.partidoJugado(event.target.value, input1.value, equipo1);
        equipo1.partidoJugado(input1.value, event.target.value, equipo2);
        actualizarTabla()
      });
    }
  });
}
function guardarEquipos() {
  let p = 1;
  arrayInputs.forEach((input) => {
    equipos.push(new Equipo(input.children[0].value, p));
    p++;
  });
  definirFechas(equipos);
}
function definirFechas(equipos) {
  //definimos cuantas fechas
  cantFechas = cuantasFechas(equipos);
  //creamos las fechas con los id
  fechas = creadorDeFechas(equipos, cantFechas);
  //convertimos los id en los equipos
  // fechas = convertidorPartidos(fechasID, equipos);
}

const contenedor = document.querySelector("#contenedorPrincipal");
contenedor.innerHTML = ` <div id="sectionSelectorEquipos" class="contenedorSelectorEquipos">
        <div>
          <button id="botonMenosEquipo" class="botonEquipo">-</button>
          <button id="botonMasEquipo" class="botonEquipo">+</button>
        </div>
      </div>
      <button id="botonSiguiente" class="botonSiguiente">Siguiente</button>`;
const botonMas = document.querySelector("#botonMasEquipo");
const botonMenos = document.querySelector("#botonMenosEquipo");
const botonSiguiente = document.querySelector("#botonSiguiente");
let contadorInputs = 1;
let arrayInputs = [];
let equipos = [];
let fechas = [];
botonMenos.addEventListener("click", eliminarInput);
botonMas.addEventListener("click", agregarInput);
botonSiguiente.addEventListener("click", continuar);

// fechas.forEach((fecha) => {
//   alert(`FECHA ${fechas.indexOf(fecha) + 1}`);
//   fecha.forEach((partido) => {
//     alert(`Van a jugar ${partido[0].nombre} vs ${partido[1].nombre} `);
//     goles0 = parseInt(prompt(`goles de: ${partido[0].nombre}`));
//     goles1 = parseInt(prompt(`goles de: ${partido[1].nombre}`));
//     partido[0].partido(goles0, goles1);
//     partido[1].partido(goles1, goles0);
//   });
// });
// //
// //ordenar tabla
// equipos.sort((a, b) => {
//   if (a.puntos > b.puntos) {
//     return -1;
//   }
//   if (b.puntos > a.puntos) {
//     return 1;
//   }
//   if (a.diferenciaDeGol > b.diferenciaDeGol) {
//     return -1;
//   }
//   if (a.diferenciaDeGol < b.diferenciaDeGol) {
//     return 1;
//   }
//   if (a.golesAFavor > b.golesAFavor) {
//     return -1;
//   }
//   if (a.golesAFavor < b.golesAFavor) {
//     return 1;
//   }
//   return 0;
// });
// let tabla = ``;
// equipos.forEach((equipo) => {
//   tabla =
//     tabla +
//     `\n  ${equipos.indexOf(equipo) + 1}. ${equipo.nombre}   puntos: ${
//       equipo.puntos
//     }  DG: ${equipo.diferenciaDeGol}  GF: ${equipo.golesAFavor}  GC: ${
//       equipo.golesEnContra
//     }`;
// });
// alert(tabla);
// simular = prompt("quiere volver a simular? (ingresar esc para salir)");
