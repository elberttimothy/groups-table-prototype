import { makeApi } from '@zodios/core';
import { z } from 'zod';
import {
  CreateUserSchema,
  ErrorSchema,
  GenericAggregationResponseSchema,
  HealthResponseSchema,
  IdParamSchema,
  SkuLocationBodySchema,
  UpdateUserSchema,
  UserSchema,
} from './schemas/index.js';

export const healthApi = makeApi([
  {
    method: 'get',
    path: '/test',
    alias: 'getHealth',
    description: 'Get health status of the API',
    response: HealthResponseSchema,
    errors: [
      {
        status: 503,
        description: 'Service unavailable',
        schema: HealthResponseSchema,
      },
    ],
  },
]);

export const usersApi = makeApi([
  {
    method: 'get',
    path: '/',
    alias: 'getUsers',
    description: 'Get all users',
    response: z.array(UserSchema),
    errors: [
      {
        status: 500,
        description: 'Internal server error',
        schema: ErrorSchema,
      },
    ],
  },
  {
    method: 'get',
    path: '/:id',
    alias: 'getUserById',
    description: 'Get a user by ID',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: IdParamSchema.shape.id,
      },
    ],
    response: UserSchema,
    errors: [
      {
        status: 404,
        description: 'User not found',
        schema: ErrorSchema,
      },
      {
        status: 500,
        description: 'Internal server error',
        schema: ErrorSchema,
      },
    ],
  },
  {
    method: 'post',
    path: '/',
    alias: 'createUser',
    description: 'Create a new user',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: CreateUserSchema,
      },
    ],
    response: UserSchema,
    status: 201,
    errors: [
      {
        status: 400,
        description: 'Invalid input',
        schema: ErrorSchema,
      },
      {
        status: 500,
        description: 'Internal server error',
        schema: ErrorSchema,
      },
    ],
  },
  {
    method: 'put',
    path: '/:id',
    alias: 'updateUser',
    description: 'Update a user',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: IdParamSchema.shape.id,
      },
      {
        name: 'body',
        type: 'Body',
        schema: UpdateUserSchema,
      },
    ],
    response: UserSchema,
    errors: [
      {
        status: 404,
        description: 'User not found',
        schema: ErrorSchema,
      },
      {
        status: 500,
        description: 'Internal server error',
        schema: ErrorSchema,
      },
    ],
  },
  {
    method: 'delete',
    path: '/:id',
    alias: 'deleteUser',
    description: 'Delete a user',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: IdParamSchema.shape.id,
      },
    ],
    response: z.void(),
    status: 204,
    errors: [
      {
        status: 404,
        description: 'User not found',
        schema: ErrorSchema,
      },
      {
        status: 500,
        description: 'Internal server error',
        schema: ErrorSchema,
      },
    ],
  },
]);

export const skuLocationsApi = makeApi([
  {
    method: 'post',
    path: '/',
    alias: 'getSkuLocations',
    description: 'Get aggregated SKU location metrics',
    response: z.array(GenericAggregationResponseSchema),
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: SkuLocationBodySchema,
      },
    ],
    errors: [
      {
        status: 400,
        description: 'Invalid aggregation parameter',
        schema: ErrorSchema,
      },
      {
        status: 500,
        description: 'Internal server error',
        schema: ErrorSchema,
      },
    ],
  },
]);
