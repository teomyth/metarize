import { describe, it, expect, afterEach } from 'vitest';
import 'reflect-metadata';
import { NamespacedReflect, Reflector } from '../src';

function givenReflectContextWithNameSpace(): NamespacedReflect {
  const namespace = 'sample-app-context';
  return new NamespacedReflect(namespace);
}

function givenReflectContext(): NamespacedReflect {
  return new NamespacedReflect();
}

function givenDefaultReflector(): NamespacedReflect {
  return Reflector;
}

describe('Reflect Context', () => {
  describe('with namespace', () => {
    runTests(givenReflectContextWithNameSpace());
  });

  describe('without namespace', () => {
    runTests(givenReflectContext());
  });

  describe('with default instance', () => {
    runTests(givenDefaultReflector());
  });

  function runTests(reflectContext: NamespacedReflect) {
    afterEach(resetMetadata);

    it('adds metadata to a class', () => {
      const metadataValue: object = { value: 'sample' };

      // define a metadata using the namespaced reflectContext
      reflectContext.defineMetadata('key', metadataValue, SubClass);

      // get the defined metadata using the namespaced reflectContext
      let metadata = reflectContext.getMetadata('key', SubClass);
      expect(metadata).toBe(metadataValue);

      metadata = reflectContext.getOwnMetadata('key', SubClass);
      expect(metadata).toBe(metadataValue);

      // base class should not be impacted
      metadata = reflectContext.getOwnMetadata('key', BaseClass);
      expect(metadata).toBeUndefined();

      metadata = reflectContext.getMetadata('key', BaseClass);
      expect(metadata).toBeUndefined();

      let result = reflectContext.hasOwnMetadata('key', SubClass);
      expect(result).toBe(true);

      result = reflectContext.hasMetadata('key', SubClass);
      expect(result).toBe(true);
    });

    it('adds metadata to a base class', () => {
      const metadataValue: object = { value: 'sample' };

      // define a metadata using the namespaced reflectContext
      reflectContext.defineMetadata('key', metadataValue, BaseClass);

      // get the defined metadata using the namespaced reflectContext
      let metadata = reflectContext.getMetadata('key', BaseClass);
      expect(metadata).toBe(metadataValue);

      metadata = reflectContext.getOwnMetadata('key', BaseClass);
      expect(metadata).toBe(metadataValue);

      metadata = reflectContext.getOwnMetadata('key', SubClass);
      expect(metadata).toBeUndefined();

      metadata = reflectContext.getMetadata('key', SubClass);
      expect(metadata).toEqual(metadataValue);
    });

    function deleteMetadata(target: object, propertyKey?: string) {
      if (propertyKey) {
        const keys = reflectContext.getOwnMetadataKeys(target, propertyKey);
        for (const k of keys) {
          reflectContext.deleteMetadata(k, target, propertyKey);
        }
      } else {
        const keys = reflectContext.getOwnMetadataKeys(target);
        for (const k of keys) {
          reflectContext.deleteMetadata(k, target);
        }
      }
    }

    // Clean up the metadata
    function resetMetadata() {
      deleteMetadata(BaseClass);
      deleteMetadata(BaseClass, 'staticBaseMethod');
      deleteMetadata(BaseClass.prototype, 'baseMethod');
      deleteMetadata(SubClass);
      deleteMetadata(SubClass, 'staticSubMethod');
      deleteMetadata(SubClass.prototype, 'subMethod');
      deleteMetadata(SubClass.prototype, 'baseMethod');
    }

    class BaseClass {
      static staticBaseMethod() {}
      constructor() {}
      baseMethod() {}
    }

    class SubClass extends BaseClass {
      static staticSubMethod() {}
      constructor() {
        super();
      }
      baseMethod() {
        super.baseMethod();
      }
      subMethod(): boolean {
        return true;
      }
    }
  }

  describe('@Reflector.metadata', () => {
    const val1 = { x: 1 };
    const val2 = { y: 'a' };

    @Reflector.metadata('key1', val1)
    class TestClass {
      @Reflector.metadata('key2', val2)
      testMethod() {}
    }

    it('adds metadata', () => {
      let meta = Reflector.getOwnMetadata('key1', TestClass);
      expect(meta).toEqual(val1);

      meta = Reflector.getOwnMetadata('key2', TestClass.prototype, 'testMethod');
      expect(meta).toEqual(val2);
    });
  });

  describe('@Reflector.decorate', () => {
    const val1 = { x: 1 };
    const val2 = { y: 'a' };

    class TestClass {
      testMethod() {}
    }

    it('adds metadata', () => {
      const x: ClassDecorator = Reflector.metadata('key1', val1);
      Reflector.decorate([x], TestClass);

      const y: MethodDecorator = Reflector.metadata('key2', val2);
      Reflector.decorate([y], TestClass.prototype, 'testMethod');

      let meta = Reflector.getOwnMetadata('key1', TestClass);
      expect(meta).toEqual(val1);

      meta = Reflector.getOwnMetadata('key2', TestClass.prototype, 'testMethod');
      expect(meta).toEqual(val2);
    });
  });

  describe('getMetadataKeys and getOwnMetadataKeys', () => {
    it('returns empty array if no metadata', () => {
      class TestClass {}
      const keys = Reflector.getMetadataKeys(TestClass);
      expect(keys).toEqual([]);

      const ownKeys = Reflector.getOwnMetadataKeys(TestClass);
      expect(ownKeys).toEqual([]);
    });
  });

  describe('deleteMetadata', () => {
    it('returns false if no metadata to delete', () => {
      class TestClass {}
      const result = Reflector.deleteMetadata('key', TestClass);
      expect(result).toBe(false);
    });
  });
});
