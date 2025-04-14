/**
 * This file demonstrates how to use decorators on controller classes
 */
import { apiEndpoint, apiMethod, apiParam } from './decorators.js';
import { User, CreateUserRequest } from './models.js';

@apiEndpoint({
  basePath: '/users',
  description: 'User management endpoints',
  tags: ['users'],
})
export class UserController {
  private users: User[] = [];

  @apiMethod({
    path: '/',
    method: 'GET',
    description: 'Get all users',
    responses: {
      '200': { description: 'List of users' },
    },
  })
  getAllUsers(): User[] {
    return this.users;
  }

  @apiMethod({
    path: '/:id',
    method: 'GET',
    description: 'Get a user by ID',
    responses: {
      '200': { description: 'User found' },
      '404': { description: 'User not found' },
    },
  })
  getUserById(
    @apiParam({
      name: 'id',
      description: 'User ID',
      required: true,
      type: 'string',
    })
    id: string
  ): User | undefined {
    return this.users.find(user => user.id === id);
  }

  @apiMethod({
    path: '/',
    method: 'POST',
    description: 'Create a new user',
    responses: {
      '201': { description: 'User created successfully' },
      '400': { description: 'Invalid request data' },
    },
  })
  createUser(
    @apiParam({
      name: 'createUserRequest',
      description: 'User creation data',
      required: true,
      type: 'CreateUserRequest',
    })
    createUserRequest: CreateUserRequest
  ): User {
    const newUser = new User(
      `user-${Date.now()}`,
      createUserRequest.name,
      createUserRequest.email,
      createUserRequest.role
    );
    this.users.push(newUser);
    return newUser;
  }

  @apiMethod({
    path: '/:id',
    method: 'DELETE',
    description: 'Delete a user',
    responses: {
      '204': { description: 'User deleted successfully' },
      '404': { description: 'User not found' },
    },
  })
  deleteUser(
    @apiParam({
      name: 'id',
      description: 'User ID',
      required: true,
      type: 'string',
    })
    id: string
  ): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return this.users.length !== initialLength;
  }
}
