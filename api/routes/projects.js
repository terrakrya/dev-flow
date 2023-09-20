const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const slugify = require('slugify')
const htmlToPdf = require('html-pdf-node')
const { authenticated } = require('../config/auth')
const Project = mongoose.model('Project')
const Report = mongoose.model('Report')

router.get('/pdf', async (req, res) => {
  const report = await Report.findById(req.query.report)

  const html = `<!DOCTYPE html>
  <html>
  <head>
      <title>Relatório de Tarefas</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
          }

          h1, h2, h3 {
              font-weight: bold;
          }
      </style>
  </head>
  <body>${report.html}</body></html>`

  const file = { content: html }
  const options = { format: 'A4' }
  htmlToPdf.generatePdf(file, options).then((pdfBuffer) => {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
    })
    res.set({ 'Content-Disposition': 'attachment; filename="test.pdf"' })
    res.send(pdfBuffer)
  })
})

router.get('/', authenticated, (req, res) => {
  Project.find({ archived: false }).exec((err, projects) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(projects)
    }
  })
})

router.get('/:id', authenticated, (req, res) => {
  const query = { $or: [{ slug: req.params.id }, { _id: req.params.id }] }
  Project.findOne(query).exec((err, project) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(project)
    }
  })
})

router.post('/', authenticated, (req, res) => {
  const newProject = new Project(req.body)
  newProject.slug = slugify(newProject.name).toLowerCase()
  newProject.save((err, project) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(project)
    }
  })
})

router.put('/:id', authenticated, (req, res) => {
  const params = req.body
  params.slug = slugify(params.name).toLowerCase()
  const query = { $or: [{ slug: req.params.id }, { _id: req.params.id }] }
  Project.findOneAndUpdate(
    query,
    {
      $set: params,
    },
    {
      upsert: true,
    },
    (err, project) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(project)
      }
    }
  )
})

router.delete('/:id', authenticated, (req, res) => {
  const query = { $or: [{ slug: req.params.id }, { _id: req.params.id }] }

  Project.findOne(query).exec(async (err, project) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      project.archived = true
      await project.save()
      res.send(project)
    }
  })
})

router.post('/:id/report', authenticated, (req, res) => {
  const newReport = new Report(req.body)
  newReport.project = req.params.id
  newReport.save((err, report) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(report)
    }
  })
})

module.exports = router
