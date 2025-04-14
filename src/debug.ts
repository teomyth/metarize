/**
 * Simplified debug utility that provides basic namespace and conditional output functionality
 */

/**
 * Debugger interface definition
 */
export interface Debugger {
  /**
   * Whether debug output is enabled
   */
  enabled: boolean;

  /**
   * Debug output function
   * @param formatter Format string or object
   * @param args Additional parameters
   */
  (formatter: any, ...args: any[]): void;
}

/**
 * Get enabled namespaces from environment variables
 */
function getEnabledNamespaces(): string[] {
  if (typeof process !== 'undefined' && process.env && process.env.DEBUG) {
    return process.env.DEBUG.split(',').map(ns => ns.trim());
  }
  return [];
}

// We'll check the environment variables each time to support testing
function getNamespaces(): string[] {
  return getEnabledNamespaces();
}

/**
 * Check if a namespace is enabled
 * @param namespace Namespace
 */
function isNamespaceEnabled(namespace: string): boolean {
  const namespaces = getNamespaces();
  if (namespaces.length === 0) return false;

  return namespaces.some(
    (ns: string) =>
      ns === '*' ||
      ns === namespace ||
      (ns.endsWith('*') && namespace.startsWith(ns.slice(0, -1))) ||
      namespace.startsWith(ns + ':')
  );
}

/**
 * Create a debugger instance
 * @param namespace Namespace
 */
export function createDebug(namespace: string): Debugger {
  const enabled = isNamespaceEnabled(namespace);

  const debugFn = function (formatter: any, ...args: any[]) {
    if (!debugFn.enabled) return;

    const time = new Date().toISOString();

    if (typeof formatter === 'string') {
      console.log(`${time} ${namespace} ${formatter}`, ...args);
    } else {
      console.log(`${time} ${namespace}`, formatter, ...args);
    }
  };

  debugFn.enabled = enabled;

  return debugFn;
}

/**
 * Default export for createDebug function
 */
export default createDebug;
