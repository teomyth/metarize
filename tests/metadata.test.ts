import { describe, it, expect } from 'vitest';
import {
  ClassDecoratorFactory,
  MetadataInspector,
  MethodDecoratorFactory,
  PropertyDecoratorFactory,
} from '../src';

// Define metadata interfaces
interface TestClassMetadata {
  name: string;
  description?: string;
}

interface TestMethodMetadata {
  name: string;
  description?: string;
}

interface TestPropertyMetadata {
  name: string;
  description?: string;
}

// Create decorators
function testClass(spec: TestClassMetadata): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<TestClassMetadata>('test:class', spec, {
    decoratorName: '@testClass',
  });
}

function testMethod(spec: TestMethodMetadata): MethodDecorator {
  return MethodDecoratorFactory.createDecorator<TestMethodMetadata>('test:method', spec);
}

function testProperty(spec: TestPropertyMetadata): PropertyDecorator {
  return PropertyDecoratorFactory.createDecorator<TestPropertyMetadata>('test:property', spec);
}

// Test classes
@testClass({ name: 'TestController', description: 'A test controller' })
class TestController {
  @testProperty({ name: 'testProp', description: 'A test property' })
  testProp: string = 'test';

  @testMethod({ name: 'testMethod', description: 'A test method' })
  testMethod(param: string): string {
    return `Hello, ${param}`;
  }
}

describe('Metadata', () => {
  describe('ClassDecorator', () => {
    it('should apply class metadata', () => {
      const meta = MetadataInspector.getClassMetadata<TestClassMetadata>(
        'test:class',
        TestController
      );
      expect(meta).toBeDefined();
      expect(meta?.name).toBe('TestController');
      expect(meta?.description).toBe('A test controller');
    });
  });

  describe('MethodDecorator', () => {
    it('should apply method metadata', () => {
      const meta = MetadataInspector.getMethodMetadata<TestMethodMetadata>(
        'test:method',
        TestController.prototype,
        'testMethod'
      );
      expect(meta).toBeDefined();
      expect(meta?.name).toBe('testMethod');
      expect(meta?.description).toBe('A test method');
    });
  });

  describe('PropertyDecorator', () => {
    it('should apply property metadata', () => {
      const meta = MetadataInspector.getPropertyMetadata<TestPropertyMetadata>(
        'test:property',
        TestController.prototype,
        'testProp'
      );
      expect(meta).toBeDefined();
      expect(meta?.name).toBe('testProp');
      expect(meta?.description).toBe('A test property');
    });
  });
});
