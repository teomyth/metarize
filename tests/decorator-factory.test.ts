import { describe, it, expect } from 'vitest';
import {
  ClassDecoratorFactory,
  DecoratorFactory,
  MetadataInspector,
  MethodDecoratorFactory,
  ParameterDecoratorFactory,
  PropertyDecoratorFactory,
  Reflector,
} from '../src';

describe('DecoratorFactory', () => {
  describe('ClassDecoratorFactory', () => {
    it('creates a class decorator', () => {
      function classDecorator(spec: { name: string }): ClassDecorator {
        return ClassDecoratorFactory.createDecorator<{ name: string }>('test:class', spec);
      }

      @classDecorator({ name: 'test-class' })
      class TestClass {}

      const meta = Reflector.getMetadata('test:class', TestClass);
      expect(meta).toEqual({ name: 'test-class' });
    });

    it('throws error if decorator is applied more than once', () => {
      function classDecorator(spec: { name: string }): ClassDecorator {
        return ClassDecoratorFactory.createDecorator<{ name: string }>(
          'test:class:duplicate',
          spec
        );
      }

      expect(() => {
        @classDecorator({ name: 'test1' })
        @classDecorator({ name: 'test2' })
        class TestClass {}
      }).toThrow(/ClassDecorator cannot be applied more than once on class TestClass/);
    });
  });

  describe('MethodDecoratorFactory', () => {
    it('creates a method decorator', () => {
      function methodDecorator(spec: { name: string }): MethodDecorator {
        return MethodDecoratorFactory.createDecorator<{ name: string }>('test:method', spec);
      }

      class TestClass {
        @methodDecorator({ name: 'test-method' })
        testMethod() {}
      }

      const meta = Reflector.getMetadata('test:method', TestClass.prototype);
      expect(meta).toEqual({ testMethod: { name: 'test-method' } });
    });
  });

  describe('PropertyDecoratorFactory', () => {
    it('creates a property decorator', () => {
      function propertyDecorator(spec: { name: string }): PropertyDecorator {
        return PropertyDecoratorFactory.createDecorator<{ name: string }>('test:property', spec);
      }

      class TestClass {
        @propertyDecorator({ name: 'test-property' })
        testProperty: string = 'test';
      }

      const meta = Reflector.getMetadata('test:property', TestClass.prototype);
      expect(meta).toEqual({ testProperty: { name: 'test-property' } });
    });
  });

  describe('ParameterDecoratorFactory', () => {
    it('creates a parameter decorator', () => {
      function parameterDecorator(spec: { name: string }): ParameterDecorator {
        return ParameterDecoratorFactory.createDecorator<{ name: string }>('test:parameter', spec);
      }

      class TestClass {
        testMethod(@parameterDecorator({ name: 'test-parameter' }) param: string) {}
      }

      const meta = Reflector.getMetadata('test:parameter', TestClass.prototype);
      expect(meta).toEqual({ testMethod: [{ name: 'test-parameter' }] });
    });
  });

  describe('Inheritance', () => {
    it('inherits metadata from base class', () => {
      function classDecorator(spec: { name: string }): ClassDecorator {
        return ClassDecoratorFactory.createDecorator<{ name: string }>(
          'test:class:inheritance',
          spec
        );
      }

      @classDecorator({ name: 'base-class' })
      class BaseClass {}

      class SubClass extends BaseClass {}

      const baseMeta = MetadataInspector.getClassMetadata('test:class:inheritance', BaseClass);
      expect(baseMeta).toEqual({ name: 'base-class' });

      const subMeta = MetadataInspector.getClassMetadata('test:class:inheritance', SubClass);
      expect(subMeta).toEqual({ name: 'base-class' });
    });

    it('overrides metadata in subclass', () => {
      function classDecorator(spec: { name: string }): ClassDecorator {
        return ClassDecoratorFactory.createDecorator<{ name: string }>('test:class:override', spec);
      }

      @classDecorator({ name: 'base-class' })
      class BaseClass {}

      @classDecorator({ name: 'sub-class' })
      class SubClass extends BaseClass {}

      const baseMeta = MetadataInspector.getClassMetadata('test:class:override', BaseClass);
      expect(baseMeta).toEqual({ name: 'base-class' });

      const subMeta = MetadataInspector.getClassMetadata('test:class:override', SubClass);
      expect(subMeta).toEqual({ name: 'sub-class' });
    });
  });

  describe('DecoratorFactory.getTargetName', () => {
    it('gets target name for a class', () => {
      class TestClass {}
      const name = DecoratorFactory.getTargetName(TestClass);
      expect(name).toBe('class TestClass');
    });
  });
});
