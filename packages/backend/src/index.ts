import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { prisma } from './lib/prisma.js'
import { healthRouter } from './routes/health.js'
import { usersRouter } from './routes/users.js'

const app = express()
const port = process.env.PORT || 3000

export { prisma }

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/health', healthRouter)
app.use('/api/users', usersRouter)

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`)
  console.log(`📊 Health check: http://localhost:${port}/api/health`)
})

