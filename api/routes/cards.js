const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { authenticated } = require('../config/auth')
const Card = mongoose.model('Card')

router.get('/', authenticated, (req, res) => {
  const query = { archived: false }
  if (req.query.project) {
    query.project = req.query.project
  }
  if (req.query.organization) {
    query.organization = req.query.organization
  }
  // note/test_instructions ficam de fora: o editor grava imagens em base64
  // dentro do note, e mandar isso na listagem gerava respostas de 30MB+ (111MB
  // no caso da organizacao inteira), o que estourava a memoria do container.
  // O conteudo completo vem pela rota GET /:id ao abrir o cartao.
  Card.find(query)
    .select('-note -test_instructions')
    .populate('project')
    .sort('order')
    .exec((err, cards) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(cards)
      }
    })
})

router.get('/my-reports', authenticated, async (req, res) => {
  try {
    const userId = req.user._id
    const query = {
      archived: false,
      members: { $in: [userId, userId.toString()] },
      time_spent: { $gt: 0 },
    }
    if (req.query.organization) {
      query.organization = req.query.organization
    }

    const cards = await Card.find(query)
      .select('time_spent tags project')
      .populate('project')

    const projectsMap = {}
    let totalHours = 0

    cards.forEach((card) => {
      const hours = card.time_spent || 0
      totalHours += hours

      const projectId = card.project?._id?.toString() || 'unknown'
      const projectName = card.project?.name || 'Sem projeto'

      if (!projectsMap[projectId]) {
        projectsMap[projectId] = {
          id: projectId,
          name: projectName,
          hours: 0,
          cards: 0,
          tags: {},
        }
      }
      projectsMap[projectId].hours += hours
      projectsMap[projectId].cards += 1

      const tags = card.tags?.length ? card.tags : ['Sem tag']
      const hoursPerTag = hours / tags.length

      tags.forEach((tag) => {
        if (!projectsMap[projectId].tags[tag]) {
          projectsMap[projectId].tags[tag] = { tag, hours: 0, cards: 0 }
        }
        projectsMap[projectId].tags[tag].hours += hoursPerTag
        projectsMap[projectId].tags[tag].cards += 1
      })
    })

    const byProject = Object.values(projectsMap)
      .map((project) => ({
        ...project,
        tags: Object.values(project.tags).sort((a, b) => b.hours - a.hours),
      }))
      .sort((a, b) => b.hours - a.hours)

    res.json({
      totalHours,
      byProject,
    })
  } catch (err) {
    res.status(422).send(err.message)
  }
})

router.get('/my', authenticated, async (req, res) => {
  try {
    const query = {
      archived: false,
      members: [req.user._id],
      status: { $ne: 'published' },
    }
    if (req.query.organization) {
      query.organization = req.query.organization
    }

    const cards = await Card.find(query)
      .select('-note -test_instructions')
      .populate('project')

    const activeCards = cards.filter(
      (card) =>
        card.status === 'developing' ||
        card.status === 'ready_to_test' ||
        card.status === 'testing' ||
        card.status === 'ready_to_prod'
    )

    activeCards.sort((a, b) => {
      const order = ['developing', 'ready_to_test', 'testing', 'ready_to_prod']
      return order.indexOf(a.status) - order.indexOf(b.status)
    })

    const myCards = {
      backlog: cards
        .filter(
          (card) => card.status === 'backlog' || card.status === 'ready_to_dev'
        )
        .sort((a, b) => (a.status === 'backlog' ? 1 : -1)),
      active: activeCards,
    }
    res.json(myCards)
  } catch (err) {
    res.status(422).send(err.message)
  }
})

router.get('/:id', authenticated, (req, res) => {
  const query = { _id: req.params.id }
  Card.findOne(query).exec((err, card) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(card)
    }
  })
})

// O relatorio precisa de note/test_instructions, que a listagem nao devolve
// mais (payload de 30MB+ derrubava o container). Aqui os campos vem apenas
// para os cartoes pedidos, em lotes pequenos, para manter o pico de memoria
// baixo.
const DETAILS_MAX_IDS = 100

router.post('/details', authenticated, async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : []
    if (!ids.length) {
      return res.json([])
    }
    if (ids.length > DETAILS_MAX_IDS) {
      return res
        .status(422)
        .send(`Envie no maximo ${DETAILS_MAX_IDS} cartoes por requisicao.`)
    }
    const cards = await Card.find({ _id: { $in: ids } }).select(
      '_id note test_instructions'
    )
    res.json(cards)
  } catch (err) {
    res.status(422).send(err.message)
  }
})

router.post('/', authenticated, (req, res) => {
  const newCard = new Card(req.body)
  newCard.save((err, card) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(card)
    }
  })
})

router.put('/reorder', authenticated, async (req, res) => {
  if (req.body.cards) {
    for (const item of req.body.cards) {
      await Card.findOneAndUpdate(
        {
          _id: item.id,
        },
        {
          $set: { order: item.order },
        },
        {
          upsert: true,
        }
      )
    }
  }
  res.json('ok')
})

router.put('/:id', authenticated, async (req, res) => {
  try {
    const params = { ...req.body }
    const query = { _id: req.params.id }

    // O end_date so era preenchido pelo formulario do cartao; arrastar o cartao
    // para "Em producao" no kanban mandava apenas o status e o relatorio saia
    // com "Entregue em undefined". Preenche aqui para cobrir os dois caminhos.
    if (params.status === 'published' && !params.end_date) {
      const current = await Card.findOne(query).select('end_date')
      if (current && !current.end_date) {
        params.end_date = new Date()
      }
    }

    const card = await Card.findOneAndUpdate(
      query,
      { $set: params },
      { upsert: true, new: true }
    )
    res.send(card)
  } catch (err) {
    res.status(422).send(err.message)
  }
})

router.delete('/:id', authenticated, (req, res) => {
  const query = { _id: req.params.id }

  Card.findOne(query).exec(async (err, card) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      card.archived = true
      await card.save()
      res.send(card)
    }
  })
})

module.exports = router
