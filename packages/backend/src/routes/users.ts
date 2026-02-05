import { Router, type Router as RouterType } from 'express'
import { prisma } from '../lib/prisma.js'

export const usersRouter: RouterType = Router()

// Get all users
usersRouter.get('/', async (_req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch users',
    })
  }
})

// Get user by ID
usersRouter.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch user',
    })
  }
})

// Create user
usersRouter.post('/', async (req, res) => {
  try {
    const { email, name } = req.body
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }
    
    const user = await prisma.user.create({
      data: { email, name },
    })
    
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create user',
    })
  }
})

// Update user
usersRouter.put('/:id', async (req, res) => {
  try {
    const { email, name } = req.body
    
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { email, name },
    })
    
    res.json(user)
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to update user',
    })
  }
})

// Delete user
usersRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    })
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to delete user',
    })
  }
})

