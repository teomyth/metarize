/**
 * This file contains model classes with decorators
 */
import { apiProperty } from './decorators.js';

export class User {
  @apiProperty({
    name: 'id',
    description: 'Unique identifier for the user',
    required: true,
    type: 'string',
  })
  id: string;

  @apiProperty({
    name: 'name',
    description: 'Full name of the user',
    required: true,
    type: 'string',
  })
  name: string;

  @apiProperty({
    name: 'email',
    description: 'Email address of the user',
    required: true,
    type: 'string',
  })
  email: string;

  @apiProperty({
    name: 'role',
    description: 'Role of the user in the system',
    required: false,
    type: 'string',
  })
  role?: string;

  constructor(id: string, name: string, email: string, role?: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

export class CreateUserRequest {
  @apiProperty({
    name: 'name',
    description: 'Full name of the user',
    required: true,
    type: 'string',
  })
  name: string;

  @apiProperty({
    name: 'email',
    description: 'Email address of the user',
    required: true,
    type: 'string',
  })
  email: string;

  @apiProperty({
    name: 'password',
    description: 'Password for the user account',
    required: true,
    type: 'string',
  })
  password: string;

  @apiProperty({
    name: 'role',
    description: 'Role of the user in the system',
    required: false,
    type: 'string',
  })
  role?: string;

  constructor(name: string, email: string, password: string, role?: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
