const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

async function criarBanco() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const database = client.db("test");
    const collection = database.collection("users");

    // Verificar se o usuário Admin já existe
    const userExist = await collection.findOne({ username: "admin" });
    if (userExist) {
      console.log("Usuário Admin já existe no banco.");
      return;
    }

    // Criar senha hashada
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash("admin", salt);

    const result = await collection.insertOne({
      name: "Admin",
      email: "adm@unesc.net",
      username: "admin",
      pwd: hashedPwd,
      level: "admin",
      status: "active",
    });

    console.log("Usuário Admin criado:", result.insertedId);
  } catch (err) {
    console.error("Erro ao criar o banco:", err);
  } finally {
    await client.close();
  }
}

module.exports = criarBanco;
