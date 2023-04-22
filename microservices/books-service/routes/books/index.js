const express = require("express"); // importa Express
const router = express.Router(); // crea un nuevo enrutador de Express
const data = require("../../data/data-library"); // importa los datos de data-library

const logger = (message) => console.log(`Author Services: ${message}`);

// define un controlador para la ruta raíz ("/")
router.get("/", (req, res) => {
  const response = {
    // crea una respuesta con información sobre los libros
    service: "books",
    architecture: "microservices",
    length: data.dataLibrary.books.length,
    data: data.dataLibrary.books,
  };
  logger("Get book data"); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});

// define un controlador para la ruta "/title/:title"
router.get("/title/:title", (req, res) => {
  // busca los libros que contengan el título buscado
  const titles = data.dataLibrary.books.filter((title) => {
    return title.title.includes(req.params.title);
  });
  // crea una respuesta con información sobre los libros que coinciden con el título buscado
  const response = {
    service: "books",
    architecture: "microservices",
    length: titles.length,
    data: titles,
  };
  return res.send(response); // devuelve la respuesta al cliente
});

// creamos una ruta para la busqueda por id del autor del libro 
router.get("/author/:authorid", (req, res) => {
  //crear una variable async que espera los datos del endpoint 
  //el cual hace un fetch al servidor donde estan los nombres de los autores de cada libro
  const GetAuthorById = async (req, res) => {
    let EndPoint = "http://authors:3000/api/v2/authors/" + req.params.authorid;
    let AutoresById = await fetch(EndPoint);
    const AuthorJson = await AutoresById.json();
    const book = data.dataLibrary.books.filter((Book) => {
      return Book.authorid == AuthorJson.data[0].id
    });

    // Creamos un objeto de respuesta con los datos de los libros buscado por autorid
    const response = {
      service: "Get books by author id",
      architecture: "microservices",
      length: book.length,
      author: AuthorJson.data[0].author,
      Country: AuthorJson.data[0].country,
      data: book,
    };

    // Enviamos la respuesta
    return res.send(response);
  }
  GetAuthorById(req, res);
});


//obtener los libro buscando por nombre de autor
router.get("/authorName/:author", (req, res) => {
  const GetAuthorByName = async (req, res) => {
    let EndPoint = "http://authors:3000/api/v2/authors/author/" + req.params.author;
    let AutoresByName = await fetch(EndPoint);
    const AuthorJson = await AutoresByName.json();
    const book = data.dataLibrary.books.filter((Book) => {
      return Book.authorid == AuthorJson.data[0].id
    });

    // Creamos un objeto de respuesta con los datos de los libros buscado por autorid
    const response = {
      service: "Get books by Author name ",
      architecture: "microservices",
      length: book.length,
      author: AuthorJson.data[0].author,
      Country: AuthorJson.data[0].country,
      data: book.titles,
    };

    // Enviamos la respuesta
    return res.send(response);
  }
  GetAuthorByName(req, res);
});


// crea una ruta que pedira dos parametros de fecha para buscar los libros publicados entre las dos fechas
router.get('/year/:startYear/:endYear', (req, res) => {
  // Parseamos a enteros los parametros de la ruta y se almacena en variables de inicio y fin.
  const startYear = parseInt(req.params.startYear);
  const endYear = parseInt(req.params.endYear);
  // Se usa filter para que solo devuelva los libros que cumplan la condicion.
  const yearBooks = data.dataLibrary.books.filter((book) => {
    return book.year >= startYear && book.year <= endYear;
  });

  const response = {
    service: 'books',
    architecture: 'microservices',
    length: yearBooks.length,
    data: yearBooks,
  };

  return res.send(response);
});

// para filtrar por años mayor que la fecha escita en la ruta
router.get('/yearOlder/:year', (req, res) => {
  const years = parseInt(req.params.year);
  const yearBooks = data.dataLibrary.books.filter((year) => {
    return year.year >= years;
  });
  const response = {
    service: 'books',
    architecture: 'microservices',
    length: yearBooks.length,
    data: yearBooks,
  };
  return res.send(response);
});

//para filtrar por años menor que la fecha escita en la ruta
router.get('/yearLess/:year', (req, res) => {
  const years = parseInt(req.params.year);
  const yearBooks = data.dataLibrary.books.filter((year) => {
    return year.year <= years;
  });
  const response = {
    service: 'books',
    architecture: 'microservices',
    length: yearBooks.length,
    data: yearBooks,
  };
  return res.send(response);
});

// para filtrar por años igaul al escito en la ruta
router.get('/thisYear/:year', (req, res) => {
  const years = parseInt(req.params.year);
  const yearBooks = data.dataLibrary.books.filter((year) => {
    return year.year === years;
  });
  const response = {
    service: 'books',
    architecture: 'microservices',
    length: yearBooks.length,
    data: yearBooks,
  };
  return res.send(response);
});

// define un controlador para la ruta "/title/:title"
router.get("/Distributed/:country", (req, res) => {
  let countries = [];
  for (let country of data.dataLibrary.books) {
     let contienePais = country.distributedCountries.filter((pais)=>{
      return pais == req.params.country
    });
    if(contienePais.length > 0){
      countries.push(country);
    }
  }
  
  // crea una respuesta con información sobre los paises donde se distribuye ese libro
  const response = {
    service: "books",
    architecture: "microservices",
    length: countries.length,
    data: countries,
    
  };
  return res.send(response); // devuelve la respuesta al cliente
});

// define un controlador para la ruta "/title/:title"
router.get("/Idiom/:language", (req, res) => {
  let languages = [];
  for (let language of data.dataLibrary.books) {
     let contieneLanguage = language.languages.filter((language)=>{
      return language == req.params.language
    });
    if(contieneLanguage.length > 0){
      languages.push(language);
    }
  }
  if (languages.length == 0) {
    return res.status(404).send("Ningun libro se distribuye en paises donde se habla ese idioma");
  }
  // crea una respuesta con información sobre los paises donde se distribuye ese libro
  const response = {
    service: "books",
    architecture: "microservices",
    length: languages.length,
    data: languages,
    
  };
  return res.send(response); // devuelve la respuesta al cliente
});

module.exports = router;

/*
Este código es un ejemplo de cómo crear una API de servicios utilizando Express y un enrutador. El enrutador define dos rutas: una para obtener todos los libros y otra para obtener libros por título. También utiliza una función simple de registro para registrar mensajes en los registros.
*/