// Importamos la biblioteca Express
const express = require("express");

// Importamos el archivo data-library.js que contiene la información sobre los países.
const data = require("../../data/data-library");

// Creamos un router de Express
const router = express.Router();

// Creamos una función de registro que imprime mensajes de registro en la consola
const logger = (message) => console.log(`Countries Service: ${message}`);

// Creamos una ruta GET en la raíz del router que devuelve todos los países
router.get("/", (req, res) => {
  // Creamos un objeto de respuesta con información sobre el servicio y los datos de los países
  const response = {
    service: "countries",
    architecture: "microservices",
    length: data.dataLibrary.countries.length,
    data: data.dataLibrary.countries,
  };
  // Registramos un mensaje en la consola
  logger("Get countries data");
  // Enviamos la respuesta al cliente
  return res.send(response);
});

router.get("/country/:capital", (req, res) => {
  // buscar el país que contenga la capital que se busca
  let country = null;
  for (let countryCode in data.dataLibrary.countries) {
    const currentCountry = data.dataLibrary.countries[countryCode];
    if (currentCountry.capital == req.params.capital) {
      country = currentCountry;
    }
    break;
  }
  // si no se encuentra el país, devolver un mensaje de error
  if (!country) {
    return res.status(404).send("No se encontró el país con la capital buscada");
  }
  // si se encuentra el país, crear una respuesta con el nombre del país
  const response = {
    service: "País por capital",
    architecture: "microservicios",
    data: country.name,
  };
  return res.send(response); // devuelve la respuesta al cliente
});

// Listar los nombres de los países y los autores según la capital del país que se busca
router.get("/AuthorCountry/:capital", async (req, res) => {
  // buscar el país que contenga la capital que se busca
  let country = null;
  for (let countryCode in data.dataLibrary.countries) {
    const currentCountry = data.dataLibrary.countries[countryCode];
    if (currentCountry.capital == req.params.capital) {
      country = currentCountry;
      break;
    }
  }
  // si no se encuentra el país, devolver un mensaje de error
  if (!country) {
    return res.status(404).json({
      error: "No se encontró el país con la capital buscada"
    });
  }

  // obtener los nombres de autores que pertenecen al país buscado
  let authorsResponse = await fetch(`http://authors:3000/api/v2/authors/CountryAuthor/${country.name}`);
  const authorJson = await authorsResponse.json();
  const authorNames = [];
  for(let author of authorJson.data){
    authorNames.push(author.author);
  }

  // obtener los títulos de libros que se han distribuido en el país buscado
  const booksResponse = await fetch(`http://books:4000/api/v2/books/Distributed/${country.name}`);
  const booksData = await booksResponse.json();
  const bookTitles = [];
  for(let book of booksData.data){
    bookTitles.push(book.title);
  }

  // crear la respuesta que se enviará al cliente
  const response = {
    service: "Autores, libros y pais por capital",
    architecture: "microservicios",
    authores: authorNames.length,
    autores: authorNames,
    books: bookTitles.length,
    Titles: bookTitles,
    data: country
  };
  return res.send(response); // devuelve la respuesta al cliente
});


//Listar los paises donde se hable determinado idioma 
router.get('/countries/:language', (req, res) => {
  // Creamos un array vacío para almacenar los países que coinciden con el idioma especificado
  let countriesMatched = [];
  for (let countryCode in data.dataLibrary.countries) {
    const currentCountry = data.dataLibrary.countries[countryCode];
    if (currentCountry.languages.includes(req.params.language)) {
      countriesMatched.push(currentCountry);
    }
  }

  // Si no se encontraron países que coinciden con el idioma especificado
  if (countriesMatched.length === 0) {
    return res.status(404).send(`No se encontraron países que hablan ${req.params.language}`);
  }

  const response = {
    service: 'countries',
    architecture: 'microservices',
    data: countriesMatched,
  };

  // Devolvemos la respuesta en formato JSON
  return res.json(response); 
});


// Exportamos el router
module.exports = router;