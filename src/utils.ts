/**
 * A collection of types that can be cloned
 */
export const cloneableTypes = new Set<Function>([
  Object,
  Array,
  Set,
  Map,
  RegExp,
  Date,
  Buffer,
  ArrayBuffer,
  Float32Array,
  Float64Array,
  Int8Array,
  Int16Array,
  Int32Array,
  Uint8Array,
  Uint8ClampedArray,
  Uint16Array,
  Uint32Array,
]);

/**
 * Deep clone a value
 * @param val - The value to clone
 * @param refs - Map of references to handle circular references (internal use)
 * @returns A deep clone of the value
 */
export function cloneDeep<V>(val: Readonly<V>, refs = new WeakMap<object, any>()): V {
  if (val === null || typeof val !== 'object') return val;

  // Handle circular references
  if (refs.has(val as object)) {
    throw new Error('Circular reference detected during deep cloning');
  }

  // Handle special types that should not be deep cloned
  if (val.constructor != null && !cloneableTypes.has(val.constructor)) {
    // Do not clone instances of classes/constructors, such as custom classes
    return val;
  }

  // Add this object to the refs map
  refs.set(val as object, true);

  // Handle arrays
  if (Array.isArray(val)) {
    const result = val.map(item => cloneDeep(item, refs)) as unknown as V;
    refs.delete(val as object); // Clean up refs map
    return result;
  }

  // Handle Set
  if (val instanceof Set) {
    const newSet = new Set();
    val.forEach(item => newSet.add(cloneDeep(item, refs)));
    refs.delete(val as object); // Clean up refs map
    return newSet as unknown as V;
  }

  // Handle Map
  if (val instanceof Map) {
    const newMap = new Map();
    val.forEach((value, key) => newMap.set(key, cloneDeep(value, refs)));
    refs.delete(val as object); // Clean up refs map
    return newMap as unknown as V;
  }

  // Handle RegExp
  if (val instanceof RegExp) {
    refs.delete(val as object); // Clean up refs map
    return new RegExp(val.source, val.flags) as unknown as V;
  }

  // Handle Date
  if (val instanceof Date) {
    refs.delete(val as object); // Clean up refs map
    return new Date(val.getTime()) as unknown as V;
  }

  // Handle ArrayBuffer and typed arrays
  if (val instanceof ArrayBuffer) {
    const newBuffer = new ArrayBuffer(val.byteLength);
    new Uint8Array(newBuffer).set(new Uint8Array(val));
    refs.delete(val as object); // Clean up refs map
    return newBuffer as unknown as V;
  }

  if (ArrayBuffer.isView(val) && !(val instanceof DataView)) {
    // Handle typed arrays (Float32Array, Uint8Array, etc.)
    // Use any typed array method that creates a copy
    refs.delete(val as object); // Clean up refs map
    if (val instanceof Float32Array) return new Float32Array(val) as unknown as V;
    if (val instanceof Float64Array) return new Float64Array(val) as unknown as V;
    if (val instanceof Int8Array) return new Int8Array(val) as unknown as V;
    if (val instanceof Int16Array) return new Int16Array(val) as unknown as V;
    if (val instanceof Int32Array) return new Int32Array(val) as unknown as V;
    if (val instanceof Uint8Array) return new Uint8Array(val) as unknown as V;
    if (val instanceof Uint8ClampedArray) return new Uint8ClampedArray(val) as unknown as V;
    if (val instanceof Uint16Array) return new Uint16Array(val) as unknown as V;
    if (val instanceof Uint32Array) return new Uint32Array(val) as unknown as V;

    // Fallback for any other ArrayBufferView types
    return val as V;
  }

  // Handle plain objects
  const newObj: Record<string, any> = {};
  for (const key in val) {
    if (Object.hasOwn(val, key)) {
      newObj[key] = cloneDeep((val as Record<string, any>)[key], refs);
    }
  }

  refs.delete(val as object); // Clean up refs map
  return newObj as V;
}

// 这里可以添加其他工具函数
