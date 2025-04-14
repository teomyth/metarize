# Metarize Basic Usage Example

This example demonstrates how to use the Metarize library to create and inspect TypeScript decorators with metadata.

## Overview

This example implements a simple API metadata system using decorators, similar to what you might find in frameworks like NestJS or TypeScript-based REST API frameworks. It shows:

1. How to create custom decorators using Metarize
2. How to apply decorators to classes, methods, properties, and parameters
3. How to inspect metadata at runtime

## Project Structure

- `src/decorators.ts` - Defines custom decorators for API endpoints, methods, parameters, and properties
- `src/models.ts` - Contains model classes with property decorators
- `src/controllers.ts` - Contains a controller class with method and parameter decorators
- `src/metadata-inspector.ts` - Utility to inspect and print metadata
- `src/index.ts` - Main entry point that demonstrates the usage

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or pnpm

### Installation

```bash
# Navigate to the example directory
cd examples/basic-usage

# Install dependencies
npm install
# or
pnpm install
```

### Running the Example

```bash
# Build the project
npm run build
# or
pnpm run build

# Run the example
npm start
# or
pnpm start
```

## Key Concepts Demonstrated

1. **Creating Decorators**: The example shows how to create class, method, property, and parameter decorators using Metarize's decorator factories.

2. **Applying Decorators**: Decorators are applied to:

   - Classes (`@apiEndpoint`)
   - Methods (`@apiMethod`)
   - Properties (`@apiProperty`)
   - Parameters (`@apiParam`)

3. **Inspecting Metadata**: The `MetadataInspector` class is used to retrieve and inspect metadata at runtime.

4. **Design-Time Type Information**: The example shows how to access TypeScript's design-time type information.

## Learning Points

- How to define metadata structures for decorators
- How to create and apply different types of decorators
- How to retrieve and use metadata at runtime
- How to build a simple API documentation system using metadata

## Further Reading

For more information about Metarize, visit the [GitHub repository](https://github.com/teomyth/metarize).
