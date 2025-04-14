import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import createDebug, { Debugger } from '../src/debug';

describe('debug', () => {
  let originalConsoleLog: typeof console.log;
  let originalProcessEnv: NodeJS.ProcessEnv;
  let mockConsoleLog: any;

  beforeEach(() => {
    // Save original console.log and process.env
    originalConsoleLog = console.log;
    originalProcessEnv = process.env;

    // Mock console.log
    mockConsoleLog = vi.fn();
    console.log = mockConsoleLog;
  });

  afterEach(() => {
    // Restore original console.log and process.env
    console.log = originalConsoleLog;
    process.env = originalProcessEnv;

    // Clear all mocks
    vi.clearAllMocks();
  });

  it('should create a debugger instance with enabled=false by default', () => {
    const debug = createDebug('test');
    expect(debug).toBeDefined();
    expect(debug.enabled).toBe(false);
  });

  it('should not log anything when debug is disabled', () => {
    const debug = createDebug('test');
    debug('test message');
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it('should enable debug when namespace matches DEBUG env var', () => {
    process.env = { ...process.env, DEBUG: 'test' };
    const debug = createDebug('test');
    expect(debug.enabled).toBe(true);
  });

  it('should enable debug when namespace matches wildcard in DEBUG env var', () => {
    process.env = { ...process.env, DEBUG: '*' };
    const debug = createDebug('test');
    expect(debug.enabled).toBe(true);
  });

  it('should enable debug when namespace matches prefix wildcard in DEBUG env var', () => {
    process.env = { ...process.env, DEBUG: 'test:*' };
    const debug = createDebug('test:something');
    expect(debug.enabled).toBe(true);
  });

  it('should enable debug when namespace matches prefix in DEBUG env var', () => {
    process.env = { ...process.env, DEBUG: 'test' };
    const debug = createDebug('test:something');
    expect(debug.enabled).toBe(true);
  });

  it('should log string messages with timestamp and namespace when enabled', () => {
    // Mock Date.toISOString to return a fixed timestamp
    const originalToISOString = Date.prototype.toISOString;
    Date.prototype.toISOString = vi.fn(() => '2023-01-01T00:00:00.000Z');

    process.env = { ...process.env, DEBUG: 'test' };
    const debug = createDebug('test');
    debug('hello %s', 'world');

    expect(mockConsoleLog).toHaveBeenCalledWith('2023-01-01T00:00:00.000Z test hello %s', 'world');

    // Restore original toISOString
    Date.prototype.toISOString = originalToISOString;
  });

  it('should log object messages with timestamp and namespace when enabled', () => {
    // Mock Date.toISOString to return a fixed timestamp
    const originalToISOString = Date.prototype.toISOString;
    Date.prototype.toISOString = vi.fn(() => '2023-01-01T00:00:00.000Z');

    process.env = { ...process.env, DEBUG: 'test' };
    const debug = createDebug('test');
    const obj = { hello: 'world' };
    debug(obj);

    expect(mockConsoleLog).toHaveBeenCalledWith('2023-01-01T00:00:00.000Z test', obj);

    // Restore original toISOString
    Date.prototype.toISOString = originalToISOString;
  });

  it('should handle multiple namespaces in DEBUG env var', () => {
    process.env = { ...process.env, DEBUG: 'foo,bar,baz' };

    const debugFoo = createDebug('foo');
    const debugBar = createDebug('bar');
    const debugBaz = createDebug('baz');
    const debugQux = createDebug('qux');

    expect(debugFoo.enabled).toBe(true);
    expect(debugBar.enabled).toBe(true);
    expect(debugBaz.enabled).toBe(true);
    expect(debugQux.enabled).toBe(false);
  });

  it('should handle namespaces with whitespace in DEBUG env var', () => {
    process.env = { ...process.env, DEBUG: ' foo , bar , baz ' };

    const debugFoo = createDebug('foo');
    const debugBar = createDebug('bar');
    const debugBaz = createDebug('baz');

    expect(debugFoo.enabled).toBe(true);
    expect(debugBar.enabled).toBe(true);
    expect(debugBaz.enabled).toBe(true);
  });
});
