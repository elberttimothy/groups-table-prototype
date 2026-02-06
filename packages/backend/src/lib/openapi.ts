import { openApiBuilder } from '@zodios/openapi'
import { healthApi, usersApi } from '../api/contract.js'

export const openApiDocument = openApiBuilder({
  title: 'Autone Backend API',
  version: '1.0.0',
  description: 'API documentation for the Autone backend service',
})
  .addServer({ url: '/api/health', description: 'Health API' })
  .addPublicApi(healthApi)
  .addServer({ url: '/api/users', description: 'Users API' })
  .addPublicApi(usersApi)
  .build()
