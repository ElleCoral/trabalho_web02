const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const routes = require("./routes");
const criarBanco = require("./criarBanco");

const hostname = "127.0.0.1";
const port = 8080;

mongoose.connect("mongodb://127.0.0.1:27017");

mongoose.connection.on("connected", async () => {
  console.log("MongoDB conectado");
  await criarBanco();
});

mongoose.connection.on("error", (err) => {
  console.error("Erro na conexão com o MongoDB: ", err);
});

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

// Configuração do CORS com opções (opcional)
app.use(
  cors({
    origin: "*", // Pode ser substituído por uma lista de origens específicas
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(express.json());
app.use("/", routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
