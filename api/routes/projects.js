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

  const logo = `${process.env.DEFAULT_STORAGE_BUCKET_FULL_URL}api/uploads/images/logo-terrakrya.png`
  const currentDate = new Date()
  const day = currentDate.getDate().toString().padStart(2, '0')
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
  const year = currentDate.getFullYear()
  const slug = slugify(report.title).toLowerCase()

  const html = `<!DOCTYPE html>
  <html>
  <head>
      <title>Relatório de Tarefas</title>
      <style>
          body {font-family: 'Arial', sans-serif}
          h1, h2, h3 {font-weight: bold;}
          #title { text-align:center; width:100%; display:block; margin-bottom:50px }
          #logo { width: 400px; margin: 0 auto; display:block}
          #logo-footer { width: 200px }
      </style>
  </head>
  <body>
    <img src="${logo}" id="logo">
    <h1 id="title">${report.title}</h1>
    ${report.html}
    <br />
    <p>Alto Paraíso de Goiás - GO, ${day}/${month}/${year}</p>
    <img src="${logo}" id="logo-footer">
  </body></html>`

  const file = { content: html }
  const options = {
    format: 'A4',
    margin: {
      top: '20mm',
      right: '10mm',
      bottom: '20mm',
      left: '10mm',
    },
    font: {
      size: '12px',
    },
  }
  htmlToPdf.generatePdf(file, options).then((pdfBuffer) => {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
    })
    res.set({ 'Content-Disposition': `attachment; filename="${slug}.pdf"` })
    res.send(pdfBuffer)
  })
})

router.get('/', authenticated, (req, res) => {
  Project.find({ archived: false })
    .sort({ name: 1 })
    .exec((err, projects) => {
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

router.get('/reports/:id', authenticated, (req, res) => {
  const query = { $or: [{ project: req.params.id }] }
  Report.find(query)
    .sort({ createdAt: -1 })
    .exec((err, reports) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(reports)
      }
    })
})

router.delete('/delete/:id', authenticated, async (req, res) => {
  try {
    const deletedReport = await Report.findByIdAndRemove(req.params.id)

    if (!deletedReport) {
      return res.status(404).json({ message: 'Relatório não encontrado' })
    }

    res.json({ message: 'Relatório excluído com sucesso' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
