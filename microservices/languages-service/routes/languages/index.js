// Importamos el paquete express
const express = require("express");

// Creamos un objeto Router
const router = express.Router();

// Inportamos el Path de csvtojson
const path = require('path');
const csvPath = '../../data/language-codes.csv';
const directoryPath = path.join(__dirname, csvPath);
console.log(directoryPath);
const csvtojson = require('csvtojson');

const tempArray = [];

csvtojson({
    noheader: true,
    headers: ['code', 'languages']
})
.fromFile(directoryPath)
.then((jsonObject) => {

    for (let items in jsonObject) {
        jsonObject[items]['languages'] = jsonObject[items]['languages'].split(";");

        tempArray.push(jsonObject[items]);
    }
});

// Creamos una función logger que muestra un mensaje en consola
const logger = (message) => console.log(`Languages Service: ${message}`);

router.get("/", (req, res) => {
    const response = {
      // crea una respuesta con información sobre los libros
      service: "languages",
      architecture: "microservices",
      length: tempArray.length,
      data: tempArray,
    };
    logger("Get lenguajes data"); // registra un mensaje en los registros
    return res.json(response); // devuelve la respuesta al cliente
  });

// Exportamos el objeto Router
module.exports = router;

/*
Este código utiliza el framework Express para crear un servicio web que devuelve información sobre autores. A continuación se detallan las acciones que se realizan línea por línea:

En la línea 2, se importa el paquete Express.
En la línea 5, se crea un objeto Router usando el método Router() de Express.
En la línea 8, se importa el módulo data-library que contiene los datos de los autores.
En la línea 11, se define una función logger que recibe un mensaje y lo muestra en la consola usando el método console.log().
En la línea 14, se define la ruta para obtener todos los autores. Cuando se hace una petición GET a la ruta raíz del servicio (/), se ejecuta la función que recibe el objeto Request (req) y el objeto Response (res). Dentro de la función, se crea un objeto response que contiene los datos de los autores y se muestra un mensaje en la consola usando la función logger. Finalmente, se envía la respuesta usando el método res.send().
En la línea 48, se define la ruta para obtener un autor por su id. Cuando se hace una petición GET a la ruta /:id del servicio, se ejecuta la función que recibe el objeto
*/
