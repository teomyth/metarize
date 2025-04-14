/**
 * Main entry point for the metarize basic example
 */
import 'reflect-metadata';
import { UserController } from './controllers.js';
import { User, CreateUserRequest } from './models.js';
import { ApiMetadataInspector } from './metadata-inspector.js';

// Print banner
console.log('=================================================');
console.log('  Metarize Basic Example - Metadata Inspection  ');
console.log('=================================================');

// Inspect controller metadata
ApiMetadataInspector.inspectController(UserController);

// Inspect model metadata
ApiMetadataInspector.inspectModel(User);
ApiMetadataInspector.inspectModel(CreateUserRequest);

// Demonstrate actual usage of the controller
console.log('\n=== Controller Usage Demo ===');

const userController = new UserController();

// Create users
console.log('\nCreating users...');
const user1 = userController.createUser(
  new CreateUserRequest('John Doe', 'john@example.com', 'password123', 'admin')
);
console.log('Created user:', user1);

const user2 = userController.createUser(
  new CreateUserRequest('Jane Smith', 'jane@example.com', 'password456', 'user')
);
console.log('Created user:', user2);

// Get all users
console.log('\nGetting all users...');
const allUsers = userController.getAllUsers();
console.log('All users:', allUsers);

// Get user by ID
console.log('\nGetting user by ID...');
const foundUser = userController.getUserById(user1.id);
console.log('Found user:', foundUser);

// Delete a user
console.log('\nDeleting a user...');
const deleted = userController.deleteUser(user1.id);
console.log('User deleted:', deleted);

// Get all users after deletion
console.log('\nGetting all users after deletion...');
const remainingUsers = userController.getAllUsers();
console.log('Remaining users:', remainingUsers);

console.log('\n=== Example Completed ===');
