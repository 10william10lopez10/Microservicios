const server = require("./src/app");

server.listen(process.env.PORT || 6000, () => {
  // Iniciamos el servidor en el puerto especificado en la variable de entorno PORT
  console.log(`Countries Service working in port: ${process.env.PORT || 6000}`);
});
