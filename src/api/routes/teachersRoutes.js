const { v4: uuidv4 } = require("uuid");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Student = require("../db/studentsModel"); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - idade
 *         - parentes
 *         - numero_de_telefone
 *         - necessidades_especiais
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do Estudante
 *         nome:
 *           type: string
 *           description: Nome do Estudante
 *         idade:
 *           type: integer
 *           description: Idade do Estudante
 *         parentes:
 *           type: string
 *           description: Parentes do Estudante
 *         numero_de_telefone:
 *           type: string
 *           description: Número de Telefone do Estudante
 *         necessidades_especiais:
 *           type: string
 *           description: Necessidades Especiais do Estudante
 *         status:
 *           type: string
 *           description: Status do Estudante
 *       example:
 *         id: d7285041-3a09-4a71-8d0e-3070763d3d00
 *         nome: Emily Goulart
 *         idade: 43
 *         parentes: Leandro Goulart e Carol Goulart
 *         numero_de_telefone: "48 9696 5858"
 *         necessidades_especiais: "Síndrome de down"
 *         status: "on"
 */

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API de Controle de Estudantes
 *   *Por Gabriel Goulart de Souza*
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna uma lista de todos os estudantes
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */

// GET "/students"
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter estudantes: " + err });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Um estudante pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

// GET "/students/:id"
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ erro: "Estudante não encontrado!" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter estudante: " + err });
  }
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: O estudante foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */

// POST "/students"
router.post("/", async (req, res) => {
  const { nome, idade, parentes, numero_de_telefone, necessidades_especiais, status } = req.body;
  try {
    const newStudent = new Student({ nome, idade, parentes, numero_de_telefone, necessidades_especiais, status });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar estudante: " + err });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Atualiza um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: O estudante foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

// PUT "/students/:id"
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, idade, parentes, numero_de_telefone, necessidades_especiais, status } = req.body;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { nome, idade, parentes, numero_de_telefone, necessidades_especiais, status },
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ erro: "Estudante não encontrado!" });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar estudante: " + err });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Remove um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: O estudante foi removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

// DELETE "/students/:id"
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ erro: "Estudante não encontrado!" });
    }
    res.json(deletedStudent);
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir estudante: " + err });
  }
});

module.exports = router;
