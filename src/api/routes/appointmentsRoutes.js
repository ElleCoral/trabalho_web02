const { v4: uuidv4 } = require("uuid");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Appointment = require("../db/appointmentModel");

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: API de Controle de Agendamentos **Por Thiago Serafina**
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retorna a lista de todos os agendamentos
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AppointmentResponse'
 */

router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar os agendamentos", error: err });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Retorna um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponse'
 *       404:
 *         description: Agendamento não encontrado
 */

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar o agendamento", error: err });
  }
});

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentCreate'
 *     responses:
 *       200:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponse'
 *       500:
 *         description: Erro ao salvar o agendamento
 */

router.post("/", async (req, res) => {
  const { specialty, comments, date, student, professional } = req.body;
  const newAppointment = new Appointment({
    specialty,
    comments,
    date,
    student,
    professional,
  });

  try {
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ message: "Erro ao salvar o agendamento", error: err });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentUpdate'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponse'
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro ao salvar o agendamento
 */

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { specialty, comments, date, student, professional } = req.body;
  try {
    const appointment = await Appointment.findByIdAndUpdate(id, {
      specialty,
      comments,
      date,
      student,
      professional,
    }, { new: true }); 

    if (!appointment) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar o agendamento", error: err });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Exclui um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento excluído com sucesso
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro ao excluir o agendamento
 */

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    res.json({ id, message: "Agendamento excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir o agendamento", error: err });
  }
});

module.exports = router;
