class Equipo {
  constructor(nombre, id) {
    this.id = id;
    this.nombre = nombre;
    this.puntos = 0;
    this.golesAFavor = 0;
    this.golesEnContra = 0;
    this.diferenciaDeGol = 0;
  }
  partido(golesA, golesB) {
    if (!Number.isInteger(golesA)) {
      golesA = 0;
    }
    if (!Number.isInteger(golesB)) {
      golesB = 0;
    }

    this.golesAFavor = this.golesAFavor + golesA;
    this.golesEnContra = this.golesEnContra + golesB;
    this.diferenciaDeGol = this.diferenciaDeGol + golesA - golesB;
    if (golesA > golesB) {
      this.puntos = this.puntos + 3;
    } else {
      if (golesA === golesB) {
        this.puntos = this.puntos + 1;
      }
    }
    return [golesA, golesB];
  }
}
function creadorDeFechas(equipos, cantFechas) {
  let fechas = [];
  //nuevo array solo con las id de los equipos
  let equiposID = equipos.map((elemento) => {
    return elemento.id;
  });
  //se agrega o no un "equipo x" que representa las fechas libres
  if (Math.floor(equiposID.length / 2) !== equiposID.length / 2) {
    equiposID.push("x");
  }
  //se cicla por la cantidad de fechas
  for (let i = 0; i < cantFechas; i++) {
    //push un array vacio donde van a estar los partidos de la fecha
    fechas.push([]);
    //cada equipo se empareja con el del extremo opuesto (equipo1 vs equipo4, equipo2 vs equipo3)
    for (let j = 0; j < equiposID.length / 2; j++) {
      let equipo1ID = equiposID[j];
      let equipo2ID = equiposID[equiposID.length - 1 - j];
      //push en el array de la fecha los dos equipos elegidos si ningun equipo es "x"(fecha de descanso)
      if (!(equipo1ID === "x" || equipo2ID === "x")) {
        fechas[i].push([equipo1ID, equipo2ID]);
      }
    }
    //cambio del orden del array para volver a iniciar el ciclo en la proxima fecha
    let equipoCiclado = equiposID.splice(1, 1);
    equiposID.push(equipoCiclado[0]);
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
function creadorDeMensaje(fechas) {
  let mensaje = ``;
  fechas.forEach((fecha) => {
    mensaje = mensaje + `<div> <h3> Fecha ${fechas.indexOf(fecha) + 1} </h3>`;
    fecha.forEach((partido) => {
      mensaje =
        mensaje +
        `
        <div class="partido" id="${partido[0].id}${partido[1].id}">
        <p> ${partido[0].nombre} </p> 
        <input class="inputGoles"> 
        <input class="inputGoles"> 
        <p> ${partido[1].nombre} </p>
        </div>`;
    });
    mensaje = mensaje + "</div>";
  });
  const contenedorFechas = document.querySelector("#contenedorFechas");
  contenedorFechas.innerHTML = `
  <div>
      ${mensaje}
  </div>`;
}

let simular = prompt("quiere empezar a simular? (ingresar esc para salir)");
while (simular.toLowerCase() !== "esc") {
  let equipos = [];
  let p = 1;
  let eleccion = new Equipo(
    prompt(`Ingrese el nombre de un nuevo equipo (siguiente para continuar)`),
    p
  );
  while (eleccion.nombre !== "siguiente") {
    equipos.push(eleccion);
    p++;
    eleccion = new Equipo(
      prompt(`Ingrese el nombre de un nuevo equipo (siguiente para continuar)`),
      p
    );
  }

  //definimos cuantas fechas
  cantFechas = cuantasFechas(equipos);
  //creamos las fechas con los id
  fechasID = creadorDeFechas(equipos, cantFechas);
  //convertimos los id en los equipos
  fechas = convertidorPartidos(fechasID, equipos);
  //creamos el mensaje con los partidos y fechas y lo mostramos en el html
  // creadorDeMensaje(fechas);

  //ingresar Resultados
  fechas.forEach((fecha) => {
    alert(`FECHA ${fechas.indexOf(fecha) + 1}`);
    fecha.forEach((partido) => {
      alert(`Van a jugar ${partido[0].nombre} vs ${partido[1].nombre} `);
      goles0 = parseInt(prompt(`goles de: ${partido[0].nombre}`));
      goles1 = parseInt(prompt(`goles de: ${partido[1].nombre}`));
      partido[0].partido(goles0, goles1);
      partido[1].partido(goles1, goles0);
    });
  });
  //
  //ordenar tabla
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
  let tabla = ``;
  equipos.forEach((equipo) => {
    tabla =
      tabla +
      `\n  ${equipos.indexOf(equipo) + 1}. ${equipo.nombre}   puntos: ${
        equipo.puntos
      }  DG: ${equipo.diferenciaDeGol}  GF: ${equipo.golesAFavor}  GC: ${
        equipo.golesEnContra
      }`;
  });
  alert(tabla);
  simular = prompt("quiere volver a simular? (ingresar esc para salir)");
}
