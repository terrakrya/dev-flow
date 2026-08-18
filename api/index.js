import './database'
import path from 'path'

import cors from 'cors'
import express from 'express'
import passport from 'passport'
import session from 'express-session'
import createMemoryStore from 'memorystore'
import routes from './routes'

// A partir do Node 15 uma promise rejeitada sem catch derruba o processo inteiro.
// A API tem vários handlers async sem try/catch e o Express 4 não captura o erro
// deles, então uma falha pontual (um upload, uma chamada ao S3) tirava o site do
// ar para todo mundo. Aqui o erro é registrado e o processo continua de pé.
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason)
})

// Estabilização: manter o processo vivo depois de uma exceção não tratada não é
// o ideal, mas hoje a alternativa é o container morrer e reiniciar. Revisar
// quando os handlers async estiverem cobertos.
process.on('uncaughtException', (error) => {
  console.error('[uncaughtException]', error)
})

const app = express()
const secret = process.env.SECRET || process.env.npm_package_name
const isProduction = process.env.NODE_ENV === 'production'

const MemoryStore = createMemoryStore(session)
const SESSION_TTL = 24 * 60 * 60 * 1000

app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(
  session({
    secret,
    // O MemoryStore padrão do express-session nunca descarta sessões: elas ficam
    // na memória do processo até o container morrer. Este descarta o que passa do
    // TTL e faz a varredura de hora em hora.
    store: new MemoryStore({
      ttl: SESSION_TTL,
      checkPeriod: 60 * 60 * 1000,
    }),
    cookie: { maxAge: null },
    resave: false,
    saveUninitialized: false,
  })
)
app.use(express.urlencoded({ extended: false, limit: '100mb' }))
app.use(express.json({ limit: '100mb' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(routes)

// O plano atual do App Platform não expõe métricas de memória pela API, então o
// consumo do processo vai para o log (visível em `doctl apps logs`). Serve para
// confirmar se o container está sendo derrubado por falta de memória.
if (isProduction) {
  const inMB = (bytes) => Math.round(bytes / 1024 / 1024)
  setInterval(() => {
    const { rss, heapUsed, heapTotal, external } = process.memoryUsage()
    console.log(
      `[mem] rss=${inMB(rss)}MB heap=${inMB(heapUsed)}/${inMB(
        heapTotal
      )}MB external=${inMB(external)}MB uptime=${Math.round(process.uptime())}s`
    )
  }, 60 * 1000).unref()
}

module.exports = {
  path: '/api',
  handler: app,
}
