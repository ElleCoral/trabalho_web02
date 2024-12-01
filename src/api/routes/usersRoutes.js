const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../db/usersModel"); 

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
    const users = await User.find({ username: { $regex: req.params.username, $options: "i" } });
    if (users.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(users);
  } catch (err) {
    handleError(res, err, "Erro ao buscar usuários");
  }
});

// POST "/users"
router.post("/", async (req, res) => {
  const { name, email, username, pwd, level, status } = req.body;
  try {
    const user = new User({ name, email, username, pwd, level, status });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    handleError(res, err, "Erro ao salvar o usuário");
  }
});

// PUT "/users/:id"
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

module.exports = router;
