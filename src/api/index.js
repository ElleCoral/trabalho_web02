
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const routes = require("./routes");

const hostname = "127.0.0.1";
const port = 27017;

mongoose.connect('mongodb://127.0.0.1:27017')


mongoose.connection.on('connected', () => {
  console.log('MongoDB conectado');
});

mongoose.connection.on('error', (err) => {
  console.error('Erro na conexão com o MongoDB: ', err)
})

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Exemplo",
      version: "1.0.0",
      description: `API para demonstração de Documentação API via Swagger.  
            ### TD 01    
            Disciplina: DAII 2024.02 Turma 02  
            Equipe: Claudia, Estefani, Gabriel, Gabrielle, Thiago e Rafaela   
			`,
      license: {
        name: "Licenciado para DAII",
      },
      contact: {
        name: "André F Ruaro",
      },
    },
    servers: [
      {
        url: `http://127.0.0.1:8080/`,
        description: "Servidor de Desenvolvimento",
      },
    ],
  },
  apis: ["./src/routes/*.js"], 
};

const specs = swaggerJsDoc(options);

app.use(cors());

app.use(express.json());

app.use("/", routes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.listen(port, function () {
  console.log(`Server running at http://${hostname}:${port}`);
});