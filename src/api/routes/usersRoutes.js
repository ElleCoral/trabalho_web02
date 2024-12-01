const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Para comparar a senha
const jwt = require("jsonwebtoken"); // Para gerar o token JWT
const router = express.Router();

const User = require("../db/usersModel");

const JWT_SECRET = "sua_chave_secreta_segura"; // Substitua por uma chave segura

/**
 * @swagger
 * components:
 *   schemas:
 *     UsersResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do usuário
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         username:
 *           type: string
 *           description: Nome de usuário
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *         level:
 *           type: string
 *           description: Tipo de permissão do usuário
 *         status:
 *           type: string
 *           description: Status do usuário
 *       example:
 *         id: 5b7cc1282c4f6ec0235acd4bfa780145aa2a67fd
 *         name: Claudia Trescher
 *         email: claudia@gmail.com
 *         username: claudia.trescher
 *         pwd: claudia123
 *         level: admin
 *         status: on
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para cadastro de usuários *Por Claudia Trescher*
 */

// Função para tratar erros
const handleError = (res, err, message = "Erro interno do servidor") => {
  console.error(err);
  res.status(500).json({ erro: message });
};

// GET "/users"
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    handleError(res, err, "Erro ao buscar usuários");
  }
});

// GET "/users/:id"
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(user);
  } catch (err) {
    handleError(res, err, "Erro ao buscar o usuário");
  }
});

// GET "/users/username/:username"
router.get("/username/:username", async (req, res) => {
  try {
    const users = await User.find({
      username: { $regex: req.params.username, $options: "i" },
    });
    if (users.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(users);
  } catch (err) {
    handleError(res, err, "Erro ao buscar usuários");
  }
});

// PUT "/users/:id"
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(updatedUser);
  } catch (err) {
    handleError(res, err, "Erro ao atualizar o usuário");
  }
});

// DELETE "/users/:id"
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json({ id: user.id, message: "Usuário removido com sucesso" });
  } catch (err) {
    handleError(res, err, "Erro ao excluir o usuário");
  }
});

/**
 * Rota de cadastro de usuário
 * POST "/users/register"
 */
router.post("/register", async (req, res) => {
  const { name, email, username, pwd, level, status } = req.body;

  // Verificar se todos os campos obrigatórios estão presentes
  if (!name || !email || !username || !pwd) {
    return res
      .status(400)
      .json({ erro: "Campos obrigatórios não preenchidos" });
  }

  try {
    // Verificar se o email ou username já existem
    const emailExistente = await User.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const usernameExistente = await User.findOne({ username });
    if (usernameExistente) {
      return res.status(400).json({ erro: "Username já cadastrado" });
    }

    // Gerar hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(pwd, salt);

    // Criar o usuário
    const newUser = new User({
      name,
      email,
      username,
      pwd: hashedPwd, // Salva a senha hashada
      level: level || "user", // Define o nível padrão como 'user'
      status: status || "active", // Define o status padrão como 'active'
    });

    // Salvar no banco
    await newUser.save();

    res
      .status(201)
      .json({ message: "Usuário cadastrado com sucesso", userId: newUser._id });
  } catch (err) {
    handleError(res, err, "Erro ao cadastrar o usuário");
  }
});

/**
 * Rota de login
 * POST "/users/login"
 */
router.post("/login", async (req, res) => {
  const { email, pwd } = req.body;
  console.log("API - Tentando realizar login");
  if (!email || !pwd) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Verifica a senha
    const senhaCorreta = await bcrypt.compare(pwd, user.pwd);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, level: user.level },
      JWT_SECRET,
      { expiresIn: "1h" } // Token válido por 1 hora
    );

    res.json({ message: "Login bem-sucedido", token });
  } catch (err) {
    handleError(res, err, "Erro ao realizar login");
  }
});

/**
 * Middleware de autenticação (opcional)
 * Valida o token JWT
 */
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Armazena os dados do token no request
    next();
  } catch (err) {
    res.status(401).json({ erro: "Token inválido ou expirado" });
  }
};

// Exemplo de rota protegida
router.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Você acessou uma rota protegida", user: req.user });
});

module.exports = router;
