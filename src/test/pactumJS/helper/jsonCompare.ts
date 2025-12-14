


/**
 * Safely parse a value into JSON if it's a string.
 */
export const parseIfJson = (value: any): any => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/**
 * Recursively compare two JSON structures.
 * Allows placeholders like ${variable} in the expected JSON.
 * Returns { match: boolean, message?: string }.
 */
export const deepCompareWithPlaceholders = (
  actual: any,
  expected: any,
  path: string = ""
): { match: boolean; path?: string; message?: string } => {
  // Handle placeholders
  if (typeof expected === "string" && /\$\{.*?\}/.test(expected)) {
    return { match: true };
  }

  // Strict equality for primitives
  if (actual === expected) return { match: true };

  // Type mismatch
  if (typeof actual !== typeof expected) {
    return {
      match: false,
      message: `Type mismatch at '${path}': expected '${typeof expected}', got '${typeof actual}'`,
    };
  }

  // Arrays
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      return { match: false, message: `Expected array at '${path}', got ${typeof actual}` };
    }
    if (actual.length !== expected.length) {
      return {
        match: false,
        message: `Array length mismatch at '${path}': expected ${expected.length}, got ${actual.length}`,
      };
    }

    for (let i = 0; i < expected.length; i++) {
      const result = deepCompareWithPlaceholders(actual[i], expected[i], `${path}[${i}]`);
      if (!result.match) return result;
    }

    return { match: true };
  }

  // Objects
  if (expected && typeof expected === "object") {
    if (!actual || typeof actual !== "object") {
      return { match: false, message: `Expected object at '${path}', got ${typeof actual}` };
    }

    for (const key of Object.keys(expected)) {
      const result = deepCompareWithPlaceholders(actual[key], expected[key], path ? `${path}.${key}` : key);
      if (!result.match) return result;
    }

    return { match: true };
  }

  // Fallback for primitive mismatch
  return {
    match: false,
    path: `${path}`,
    message: `Value mismatch at '${path}': expected '${expected}', got '${actual}'`,
  };
};