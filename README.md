# Metarize

A lightweight, ESM-compatible TypeScript metadata library for creating and inspecting decorators with zero dependencies. Inspired by @loopback/metadata but modernized for today's JavaScript ecosystem.

[![npm version](https://img.shields.io/npm/v/metarize.svg)](https://www.npmjs.com/package/metarize)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![ESM](https://img.shields.io/badge/ESM-compatible-brightgreen.svg)](https://nodejs.org/api/esm.html)
[![GitHub](https://img.shields.io/github/stars/teomyth/metarize?style=social)](https://github.com/teomyth/metarize)

Metarize provides a powerful yet simple API for working with TypeScript decorators and metadata. It helps you implement custom decorators, define and merge metadata, and inspect metadata at runtime.

## Features

- **Reflector**: Wrapper of [reflect-metadata](https://github.com/rbuckton/reflect-metadata) with namespace support
- **Decorator factories**: A set of factories for class/method/property/parameter decorators to apply metadata to a given class and its static or instance members
- **MetadataInspector**: High level APIs to inspect a class and/or its members to get metadata applied by decorators
- **Zero external dependencies**: Unlike @loopback/metadata, Metarize has no external runtime dependencies
- **ESM support**: Built with modern ESM format for better compatibility with current JavaScript ecosystem
- **Lightweight**: Smaller bundle size and simplified implementation for better performance
- **TypeScript-first**: Designed with full TypeScript support for better developer experience

## Quick Start

```bash
# Install the package
npm install metarize
```

```typescript
// Create a simple class decorator
import { ClassDecoratorFactory, MetadataInspector } from 'metarize';

// Define a decorator
function controller(basePath: string): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<string>('example:controller', basePath);
}

// Use the decorator
@controller('/users')
class UserController {}

// Inspect the metadata
const path = MetadataInspector.getClassMetadata<string>('example:controller', UserController);

console.log(path); // '/users'
```

## Installation

```bash
# Using npm
npm install metarize

# Using pnpm
pnpm add metarize

# Using yarn
yarn add metarize
```

## Basic Usage

### Creating a Class Decorator

```typescript
import { ClassDecoratorFactory } from 'metarize';

export interface MyClassMetadata {
  name: string;
  description?: string;
}

function myClassDecorator(spec: MyClassMetadata): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<MyClassMetadata>(
    'metadata-key-for-my-class-decorator',
    spec,
    { decoratorName: '@myClassDecorator' }
  );
}

// Usage
@myClassDecorator({ name: 'my-controller' })
class MyController {}
```

### Creating a Method Decorator

```typescript
import { MethodDecoratorFactory } from 'metarize';

export interface MyMethodMetadata {
  name: string;
  description?: string;
}

function myMethodDecorator(spec: MyMethodMetadata): MethodDecorator {
  return MethodDecoratorFactory.createDecorator<MyMethodMetadata>(
    'metadata-key-for-my-method-decorator',
    spec
  );
}

// Usage
class MyController {
  @myMethodDecorator({ name: 'my-method' })
  myMethod(x: string): string {
    return 'Hello, ' + x;
  }
}
```

### Creating a Property Decorator

```typescript
import { PropertyDecoratorFactory } from 'metarize';

export interface MyPropertyMetadata {
  name: string;
  description?: string;
}

function myPropertyDecorator(spec: MyPropertyMetadata): PropertyDecorator {
  return PropertyDecoratorFactory.createDecorator<MyPropertyMetadata>(
    'metadata-key-for-my-property-decorator',
    spec
  );
}

// Usage
class MyController {
  @myPropertyDecorator({ name: 'my-property' })
  myProperty: string;
}
```

### Creating a Parameter Decorator

```typescript
import { ParameterDecoratorFactory } from 'metarize';

export interface MyParameterMetadata {
  name: string;
  description?: string;
}

function myParameterDecorator(spec: MyParameterMetadata): ParameterDecorator {
  return ParameterDecoratorFactory.createDecorator<MyParameterMetadata>(
    'metadata-key-for-my-parameter-decorator',
    spec
  );
}

// Usage
class MyController {
  myMethod(@myParameterDecorator({ name: 'my-parameter' }) param: string): string {
    return 'Hello, ' + param;
  }
}
```

### Using TypedMetadataAccessor

You can use MetadataAccessor to provide type checks for metadata access via keys:

```typescript
import { MetadataAccessor, ClassDecoratorFactory, MetadataInspector } from 'metarize';

// Create a strongly-typed metadata accessor
const CLASS_KEY = MetadataAccessor.create<MyClassMetadata, ClassDecorator>(
  'my-class-decorator-key'
);

// Create a class decorator with the key
function myClassDecorator(spec: MyClassMetadata): ClassDecorator {
  return ClassDecoratorFactory.createDecorator(CLASS_KEY, spec);
}

@myClassDecorator({ name: 'my-controller' })
class MyController {}

// Inspect a class with the key
const myClassMeta = MetadataInspector.getClassMetadata(CLASS_KEY, MyController);
// myClassMeta is strongly typed as MyClassMetadata
console.log(myClassMeta?.name); // 'my-controller'
```

### Inspecting Metadata

```typescript
import { MetadataInspector } from 'metarize';

// Get class metadata
const classMeta = MetadataInspector.getClassMetadata(
  'metadata-key-for-my-class-decorator',
  MyController
);

// Get method metadata
const methodMeta = MetadataInspector.getMethodMetadata(
  'metadata-key-for-my-method-decorator',
  MyController.prototype,
  'myMethod'
);

// Get property metadata
const propertyMeta = MetadataInspector.getPropertyMetadata(
  'metadata-key-for-my-property-decorator',
  MyController.prototype,
  'myProperty'
);

// Get parameter metadata
const parameterMeta = MetadataInspector.getParameterMetadata(
  'metadata-key-for-my-parameter-decorator',
  MyController.prototype,
  'myMethod',
  0 // Parameter index
);
```

### Inspecting Design-Time Metadata

Metarize can also inspect TypeScript's design-time metadata:

```typescript
import { MetadataInspector } from 'metarize';

class MyController {
  myMethod(param: string): number {
    return param.length;
  }
}

// Get parameter types
const paramTypes = MetadataInspector.getDesignTypeForMethod(MyController.prototype, 'myMethod');
console.log(paramTypes.parameterTypes); // [String]

// Get return type
console.log(paramTypes.returnType); // Number

// Get property type
class MyModel {
  name: string;
  age: number;
}

const nameType = MetadataInspector.getDesignTypeForProperty(MyModel.prototype, 'name');
console.log(nameType); // String
```

### Multiple Decorators

Metarize supports applying multiple decorators of the same type:

```typescript
import { MethodDecoratorFactory, MetadataInspector } from 'metarize';

interface GeometryMetadata {
  points: Array<{ x?: number; y?: number; z?: number }>;
}

function geometry(spec: GeometryMetadata): MethodDecorator {
  return MethodDecoratorFactory.createDecorator<GeometryMetadata>(
    'metadata-key-for-my-method-multi-decorator',
    spec,
    { allowMultiple: true }
  );
}

class Shape {
  @geometry({ points: [{ x: 1 }] })
  @geometry({ points: [{ x: 2 }, { y: 3 }] })
  @geometry({ points: [{ z: 5 }] })
  draw() {
    // Draw the shape
  }
}

// Get all metadata for the method
const allMetadata = MetadataInspector.getAllMethodMetadata<GeometryMetadata[]>(
  'metadata-key-for-my-method-multi-decorator',
  Shape.prototype
);

console.log(allMetadata?.draw);
// [
//   { points: [{x: 1}] },
//   { points: [{x: 2}, {y: 3}] },
//   { points: [{z: 5}] },
// ]
```

## Advanced Usage

### Inheritance and Metadata Merging

Metarize supports inheritance of metadata from parent classes:

```typescript
import { ClassDecoratorFactory, MetadataInspector } from 'metarize';

interface ComponentMetadata {
  selector: string;
  template?: string;
  styles?: string[];
}

function Component(spec: ComponentMetadata): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<ComponentMetadata>(
    'metadata:component',
    spec,
    { inherit: true } // Enable inheritance
  );
}

@Component({
  selector: 'base-component',
  styles: ['base-styles.css'],
})
class BaseComponent {}

@Component({
  selector: 'child-component',
  template: '<div>Child Component</div>',
})
class ChildComponent extends BaseComponent {}

const metadata = MetadataInspector.getClassMetadata<ComponentMetadata>(
  'metadata:component',
  ChildComponent
);

console.log(metadata);
// {
//   selector: 'child-component',
//   template: '<div>Child Component</div>',
//   styles: ['base-styles.css']
// }
```

### Real-World Example: Dependency Injection

Here's how you might use Metarize to implement a simple dependency injection system:

```typescript
import { ClassDecoratorFactory, MetadataInspector } from 'metarize';

// Service registry
const serviceRegistry = new Map<string, any>();

// Service decorator
function Service(name: string): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<string>('di:service', name);
}

// Inject decorator
interface InjectMetadata {
  serviceName: string;
}

function Inject(serviceName: string): PropertyDecorator {
  return PropertyDecoratorFactory.createDecorator<InjectMetadata>('di:inject', { serviceName });
}

// Register a service
function registerService(serviceClass: Function): void {
  const serviceName = MetadataInspector.getClassMetadata<string>('di:service', serviceClass);

  if (!serviceName) {
    throw new Error(`Class is not decorated with @Service`);
  }

  serviceRegistry.set(serviceName, new (serviceClass as any)());
}

// Resolve dependencies for an instance
function resolveDependencies(instance: any): void {
  const constructor = instance.constructor;
  const injectMetadata = MetadataInspector.getAllPropertyMetadata<InjectMetadata>(
    'di:inject',
    constructor.prototype
  );

  if (!injectMetadata) return;

  for (const [propertyName, metadata] of Object.entries(injectMetadata)) {
    const service = serviceRegistry.get(metadata.serviceName);
    if (!service) {
      throw new Error(`Service ${metadata.serviceName} not found`);
    }
    instance[propertyName] = service;
  }
}

// Usage
@Service('logger')
class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

@Service('userService')
class UserService {
  @Inject('logger')
  private logger!: Logger;

  constructor() {
    // Resolve dependencies after construction
    resolveDependencies(this);
  }

  getUserName(id: number): string {
    this.logger.log(`Getting user ${id}`);
    return `User ${id}`;
  }
}

// Register services
registerService(Logger);
registerService(UserService);

// Use the service
const userService = serviceRegistry.get('userService') as UserService;
console.log(userService.getUserName(123)); // Logs: [LOG] Getting user 123, then returns: User 123
```

## API Reference

Metarize provides several key components for working with decorators and metadata:

### Decorator Factories

- **ClassDecoratorFactory**: Creates class decorators
- **MethodDecoratorFactory**: Creates method decorators
- **PropertyDecoratorFactory**: Creates property decorators
- **ParameterDecoratorFactory**: Creates parameter decorators

Each factory provides a `createDecorator` method with the following signature:

```typescript
static createDecorator<T>(
  key: string | MetadataAccessor<T, D>,
  spec: T,
  options?: DecoratorOptions
): D
```

Where:

- `key`: Metadata key (string or MetadataAccessor)
- `spec`: Metadata value
- `options`: Optional configuration
  - `allowMultiple`: Allow multiple decorators of the same type
  - `inherit`: Inherit metadata from parent classes
  - `cloneInputSpec`: Clone the input spec to prevent mutations

### MetadataInspector

Provides methods to inspect metadata:

```typescript
// Class metadata
MetadataInspector.getClassMetadata<T>(key, target, options?)

// Method metadata
MetadataInspector.getMethodMetadata<T>(key, target, methodName, options?)
MetadataInspector.getAllMethodMetadata<T>(key, target, options?)

// Property metadata
MetadataInspector.getPropertyMetadata<T>(key, target, propertyName, options?)
MetadataInspector.getAllPropertyMetadata<T>(key, target, options?)

// Parameter metadata
MetadataInspector.getParameterMetadata<T>(key, target, methodName, index, options?)
MetadataInspector.getAllParameterMetadata<T>(key, target, methodName, options?)

// Design-time metadata
MetadataInspector.getDesignTypeForProperty(target, propertyName)
MetadataInspector.getDesignTypeForMethod(target, methodName)
```

### MetadataAccessor

Provides type-safe access to metadata:

```typescript
const KEY = MetadataAccessor.create<T, D>(name);
```

## Contributing to Metarize

Contributions are welcome! Please feel free to submit a Pull Request to the [teomyth/metarize](https://github.com/teomyth/metarize) repository.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

### Development Environment

Here's how to set up the development environment:

```bash
# Clone the repository
git clone https://github.com/teomyth/metarize.git
cd metarize

# Install dependencies
pnpm install

# Build the library
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run linting
pnpm lint

# Format code
pnpm format
```

The project uses:

- **TypeScript** for type-safe code
- **Vitest** for testing
- **ESLint** for code quality
- **Prettier** for code formatting
- **pnpm** for package management

## Best Practices

### Organizing Decorators

When creating multiple decorators for a project, it's recommended to organize them in a structured way:

```typescript
// decorators/index.ts
export * from './service.decorator';
export * from './controller.decorator';
export * from './inject.decorator';

// decorators/service.decorator.ts
import { ClassDecoratorFactory } from 'metarize';

export function Service(name: string): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<string>('app:service', name);
}
```

### Using Metadata Keys

Create constants for your metadata keys to avoid typos and improve maintainability:

```typescript
// metadata-keys.ts
import { MetadataAccessor } from 'metarize';

export const SERVICE_KEY = MetadataAccessor.create<string, ClassDecorator>('app:service');

export const CONTROLLER_KEY = MetadataAccessor.create<ControllerOptions, ClassDecorator>(
  'app:controller'
);
```

## Use Cases

Metarize is ideal for a variety of use cases:

### Framework Development

Build your own frameworks with declarative APIs using decorators:

```typescript
@controller('/users')
class UserController {
  @get('/:id')
  getUser(@param('id') id: string) {
    // Implementation
  }
}
```

### Dependency Injection

Create your own dependency injection system:

```typescript
@injectable()
class UserService {
  @inject('DatabaseConnection')
  private db: Database;
}
```

### Validation

Implement validation logic using decorators:

```typescript
class User {
  @validate({ minLength: 3, maxLength: 50 })
  username: string;

  @validate({ isEmail: true })
  email: string;
}
```

### API Documentation

Generate API documentation from metadata:

```typescript
@controller('/users')
@tags(['Users'])
class UserController {
  @post('/')
  @summary('Create a new user')
  @response(201, 'User created successfully')
  createUser(@body() userData: UserDTO) {
    // Implementation
  }
}
```

## Comparison with @loopback/metadata

Metarize is inspired by @loopback/metadata but has several key differences:

- **Zero external dependencies**: Metarize only depends on reflect-metadata, while @loopback/metadata has additional dependencies
- **ESM support**: Built with modern ESM format for better compatibility with current JavaScript ecosystem
- **Simplified implementation**: Streamlined codebase with the same functionality but less complexity
- **Smaller bundle size**: Reduced package size for better performance in both Node.js and browser environments
- **Modern TypeScript features**: Takes advantage of newer TypeScript features for better type safety
- **Browser compatibility**: Designed to work well in both Node.js and browser environments

## License

MIT
