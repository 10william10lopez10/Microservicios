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

const LanguageArray = [];

csvtojson({
    noheader: true,
    headers: ['code', 'languages']
  })
  .fromFile(directoryPath)
  .then((jsonObject) => {

    for (let items in jsonObject) {
      jsonObject[items]['languages'] = jsonObject[items]['languages'].split(";");

      LanguageArray.push(jsonObject[items]);
    }
  });

// Creamos una función logger que muestra un mensaje en consola
const logger = (message) => console.log(`Languages Service: ${message}`);

router.get("/", (req, res) => {
  const response = {
    // crea una respuesta con información sobre los libros
    service: "languages",
    architecture: "microservices",
    length: LanguageArray.length,
    data: LanguageArray,
  };
  logger("Get lenguajes data"); // registra un mensaje en los registros
  return res.json(response); // devuelve la respuesta al cliente
});


// segun el language listar los autores los paises dnde se habla ese idioma 
//y los libros que se han distribuido en paises donde se habla ese lenguaje
router.get("/Language/:languages", async (req, res) => {
  let languages = null;
  for (let language of Object.values(LanguageArray)) {
    if (language.code == req.params.languages || language.languages == req.params.languages) {
      console.log(language)
      languages = language;
      break;
    }
  }

  if (!languages) {
    return res.status(404).send("Idioma no encontrado");
  }




  try {
    // obtener los países donde se habla ese idioma
    let countriesResponse = await fetch(`http://countries:5000/api/v2/countries/countries/${languages.code}`);
    const countriesData = await countriesResponse.json();
    const countryNames = countriesData.data.map((country) => country.name);

    const booksNames = [];
    const authorNames = [];
    for (let country of countryNames) {
      const authorsResponse = await fetch(`http://authors:3000/api/v2/authors/CountryAuthor/${country}`);
      const authorsData = await authorsResponse.json();
      if (authorsData.data.length > 0) {
        authorsData.data.map((author) => {
          authorNames.push(author.author)
        });
      }
      const booksResponse = await fetch(`http://books:4000/api/v2/books/Distributed/${country}`);
      const booksData = await booksResponse.json();
      if (booksData.data.length > 0) {
        booksData.data.map((book) => {
          booksNames.push(book.title)
        });
      }

    }

    // crear la respuesta que se enviará al cliente
    const response = {
      service: "Autores, libros y país por idioma",
      architecture: "microservicios",
      autores: authorNames.length,
      autores_nombres: authorNames,
      books: booksNames.length,
      books_títulos: booksNames,
      países: countryNames.length,
      países_nombres: countryNames,
      idioma: languages
    };
    return res.send(response); // devuelve la respuesta al cliente
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error en el servidor");
  }
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