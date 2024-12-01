const { v4: uuidv4 } = require("uuid");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Professional = require("../db/professionalsModel"); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Professional:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - idade
 *         - especialidade
 *         - contato
 *         - numero_de_telefone
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do Profissional
 *         nome:
 *           type: string
 *           description: Nome do Profissional
 *         idade:
 *           type: integer
 *           description: Idade do Profissional
 *         especialidade:
 *           type: string
 *           description: Especialidade do Profissional
 *         contato:
 *           type: string
 *           description: Contato do Profissional
 *         numero_de_telefone:
 *           type: string
 *           description: Número de Telefone do Profissional
 *         status:
 *           type: string
 *           description: Status do Profissional
 *       example:
 *         id: 059c5625-7dbd-4893-9164-33d115c6c1a6
 *         nome: Emily Duarte
 *         idade: 43
 *         especialidade: Psicóloga
 *         contato: wb.psico@gmail.com
 *         numero_de_telefone: 48 7264 5148
 *         status: on
 */

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description:
 *     API de Controle de profissionais
 *     *Por Gabriel Goulart de Souza*
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Retorna uma lista de todos os profissionais
 *     tags: [Professionals]
 *     responses:
 *       200:
 *         description: A lista de profissionais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 */
router.get("/", async (req, res) => {
  try {
    const professionals = await Professional.find();
    res.json(professionals);
  } catch (err) {
    console.error("Erro ao buscar profissionais:", err);
    res.status(500).json({ erro: "Erro ao buscar profissionais!" });
  }
});

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Retorna um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Um profissional pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const professional = await Professional.findOne({ id });
    if (!professional) {
      return res.status(404).json({ erro: "Profissional não encontrado!" });
    }
    res.json(professional);
  } catch (err) {
    console.error("Erro ao buscar profissional:", err);
    res.status(500).json({ erro: "Erro ao buscar profissional!" });
  }
});

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Professionals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       200:
 *         description: O profissional foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 */
router.post("/", async (req, res) => {
  const newProfessional = new Professional({
    ...req.body,
    id: uuidv4(), 
  });

  try {
    await newProfessional.save();
    res.status(201).json(newProfessional);
  } catch (err) {
    console.error("Erro ao criar profissional:", err);
    res.status(500).json({ erro: "Erro ao criar profissional!" });
  }
});

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     summary: Atualiza um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       200:
 *         description: O profissional foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProfessional = req.body;

  try {
    const result = await Professional.updateOne({ id }, { $set: updatedProfessional });
    if (result.matchedCount === 0) {
      return res.status(404).json({ erro: "Profissional não encontrado!" });
    }

    const updated = await Professional.findOne({ id });
    res.json(updated);
  } catch (err) {
    console.error("Erro ao atualizar profissional:", err);
    res.status(500).json({ erro: "Erro ao atualizar profissional!" });
  }
});

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Remove um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: O profissional foi removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Professional.deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ erro: "Profissional não encontrado!" });
    }

    res.json({ id, message: "Profissional removido com sucesso!" });
  } catch (err) {
    console.error("Erro ao remover profissional:", err);
    res.status(500).json({ erro: "Erro ao remover profissional!" });
  }
});

module.exports = router;
