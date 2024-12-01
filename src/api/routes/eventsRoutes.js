const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();

const Event = require("../db/eventsModel"); 
/**
 * @swagger
 * components:
 *   schemas:
 *     EventsResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do evento
 *         description:
 *           type: string
 *           description: Nome do evento
 *         comments:
 *           type: string
 *           description: Comentário sobre o evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento
 *         example:
 *           id: ee52f313-2483-4715-ad80-eb2a28cf8eea
 *           description: Oficina de Desenho e Expressão
 *           comments: Atividade de artes para estimular a criatividade dos alunos
 *           date: 2023-08-22 14:30:00
 *     EventsCreate:
 *       type: object
 *       required:
 *         - description
 *         - comments
 *         - date
 *       properties:
 *         description:
 *           type: string
 *           description: Nome do evento
 *         comments:
 *           type: string
 *           description: Comentário sobre o evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento
 *         example:
 *           description: Aula de Música e Ritmo
 *           comments: Explorando instrumentos simples para desenvolver o senso de ritmo
 *           date: 2023-09-05 10:00:00
 *     EventsUpdate:
 *       type: object
 *       required:
 *         - description
 *         - comments
 *         - date
 *       properties:
 *         description:
 *           type: string
 *           description: Nome do evento
 *         comments:
 *           type: string
 *           description: Comentário sobre o evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento
 *         example:
 *           description: Sessão de Leitura Interativa
 *           comments: Leitura de histórias com a participação ativa dos alunos
 *           date: 2023-09-12 11:00:00
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API de Cadastros de Eventos *Por Gabrielle Coral*
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna a lista de todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista dos eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventsResponse'
 */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error("Erro ao buscar eventos:", err);
    res.status(500).json({ erro: "Erro ao buscar eventos!" });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Retorna o evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventsResponse'
 *       404:
 *         description: Evento não encontrado!
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ erro: "Evento não encontrado!" });
    }
    res.json(event);
  } catch (err) {
    console.error("Erro ao buscar evento:", err);
    res.status(500).json({ erro: "Erro ao buscar evento!" });
  }
});

/**
 * @swagger
 * /events/name/{name}:
 *   get:
 *     summary: Retorna eventos por nome
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do evento
 *     responses:
 *       200:
 *         description: Evento(s) encontrado(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventsResponse'
 *       404:
 *         description: Nenhum evento encontrado com esse nome!
 */
router.get("/name/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const events = await Event.find({
      description: { $regex: name, $options: "i" },
    });
    if (events.length === 0) {
      return res.status(404).json({ erro: "Nenhum evento encontrado com esse nome!" });
    }
    res.json(events);
  } catch (err) {
    console.error("Erro ao buscar eventos:", err);
    res.status(500).json({ erro: "Erro ao buscar eventos!" });
  }
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cadastrar um novo evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventsCreate'
 *     responses:
 *       200:
 *         description: Evento cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventsResponse'
 *       500:
 *         description: Erro ao salvar evento!
 */
router.post("/", async (req, res) => {
  const { description, comments, date } = req.body;
  const event = new Event({
    description,
    comments,
    date,
  });

  try {
    await event.save(); 
    res.status(201).json(event); 
  } catch (err) {
    console.error("Erro ao salvar evento:", err);
    res.status(500).json({ erro: "Erro ao salvar evento!" });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventsUpdate'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventsResponse'
 *       404:
 *         description: Evento não encontrado!
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { description, comments, date } = req.body;

  try {
    const event = await Event.findByIdAndUpdate(
      id,
      { description, comments, date },
      { new: true } 
    );
    if (!event) {
      return res.status(404).json({ erro: "Evento não encontrado!" });
    }
    res.json(event);
  } catch (err) {
    console.error("Erro ao atualizar evento:", err);
    res.status(500).json({ erro: "Erro ao atualizar evento!" });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Exclui um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento excluído com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Evento não encontrado!
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Event.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ erro: "Evento não encontrado!" });
    }
    res.json({ id, message: "Evento excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir evento:", err);
    res.status(500).json({ erro: "Erro ao excluir evento!" });
  }
});

module.exports = router;
