import { describe, expect, it } from 'vitest';
import { cloneDeep } from '../src/utils';

describe('utils', () => {
  describe('cloneDeep', () => {
    it('should clone primitive values', () => {
      expect(cloneDeep(1)).toBe(1);
      expect(cloneDeep('test')).toBe('test');
      expect(cloneDeep(true)).toBe(true);
      expect(cloneDeep(null)).toBe(null);
      expect(cloneDeep(undefined)).toBe(undefined);
    });

    it('should clone objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = cloneDeep(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.b).not.toBe(obj.b);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, { a: 3 }];
      const clone = cloneDeep(arr);
      expect(clone).toEqual(arr);
      expect(clone).not.toBe(arr);
      expect(clone[2]).not.toBe(arr[2]);
    });

    it('should clone Set', () => {
      const set = new Set([1, 2, { a: 3 }]);
      const clone = cloneDeep(set);
      expect(clone).toBeInstanceOf(Set);
      expect(clone).not.toBe(set);

      const originalValues = Array.from(set);
      const cloneValues = Array.from(clone);
      expect(cloneValues).toEqual(originalValues);
      expect(cloneValues[2]).not.toBe(originalValues[2]);
    });

    it('should clone Map', () => {
      const map = new Map([
        ['a', 1],
        ['b', { c: 2 }],
      ]);
      const clone = cloneDeep(map);
      expect(clone).toBeInstanceOf(Map);
      expect(clone).not.toBe(map);

      expect(clone.get('a')).toBe(1);
      expect(clone.get('b')).toEqual({ c: 2 });
      expect(clone.get('b')).not.toBe(map.get('b'));
    });

    it('should clone RegExp', () => {
      const regex = /test/gi;
      const clone = cloneDeep(regex);
      expect(clone).toBeInstanceOf(RegExp);
      expect(clone).not.toBe(regex);
      expect(clone.source).toBe(regex.source);
      expect(clone.flags).toBe(regex.flags);
    });

    it('should clone Date', () => {
      const date = new Date();
      const clone = cloneDeep(date);
      expect(clone).toBeInstanceOf(Date);
      expect(clone).not.toBe(date);
      expect(clone.getTime()).toBe(date.getTime());
    });

    it('should clone ArrayBuffer', () => {
      const buffer = new ArrayBuffer(8);
      const view = new Uint8Array(buffer);
      view[0] = 1;
      view[1] = 2;

      const clone = cloneDeep(buffer);
      expect(clone).toBeInstanceOf(ArrayBuffer);
      expect(clone).not.toBe(buffer);
      expect(clone.byteLength).toBe(buffer.byteLength);

      const cloneView = new Uint8Array(clone);
      expect(cloneView[0]).toBe(1);
      expect(cloneView[1]).toBe(2);
    });

    it('should clone typed arrays', () => {
      const array = new Uint8Array([1, 2, 3]);
      const clone = cloneDeep(array);
      expect(clone).toBeInstanceOf(Uint8Array);
      expect(clone).not.toBe(array);
      expect(clone.length).toBe(array.length);
      expect(clone[0]).toBe(1);
      expect(clone[1]).toBe(2);
      expect(clone[2]).toBe(3);
    });

    it('should not clone custom class instances', () => {
      class TestClass {
        value: number;
        constructor(value: number) {
          this.value = value;
        }
      }

      const instance = new TestClass(42);
      const clone = cloneDeep(instance);
      expect(clone).toBe(instance); // Should return the same instance
    });

    it('should handle circular references', () => {
      const obj: any = { a: 1 };
      obj.self = obj;

      // This should not cause a stack overflow
      expect(() => cloneDeep(obj)).toThrow();
    });
  });
});
