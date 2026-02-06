import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { openApiDocument } from './lib/openapi.js'
import { prisma } from './lib/prisma.js'
import { healthRouter } from './routes/health.js'
import { skuLocationsRouter } from './routes/sku-locations.js'
import { usersRouter } from './routes/users.js'

const app = express()
const port = process.env.PORT || 3000

export { prisma }

// Middleware
app.use(cors())
app.use(express.json())

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))
app.get('/api/openapi.json', (_req, res) => res.json(openApiDocument))

// Routes (Zodios routers work with Express)
app.use('/api/health', healthRouter)
app.use('/api/users', usersRouter)
app.use('/api/sku-locations', skuLocationsRouter)

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
  console.log(`📚 Swagger UI: http://localhost:${port}/api/docs`)
})

