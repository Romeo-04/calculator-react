// app/utils/evaluator.js
// This is created to safely evaluate mathematical expressions only
// Prevents the user from injecting codes via eval()
// This is a pure function: same input always gives same output

/**
 * Evaluates a mathematical expression safely
 * @param {string} expr - Expression like "5 + 3 * 2"
 * @returns {number} - The calculated result
 * @throws {Error} - If expression is invalid or division by zero
 */

export function evaluateExpression(expr) {
  // Remove extra spaces and validate
  expr = expr.trim();
  if (!expr) throw new Error("Empty expression");

  // Step 1: TOKENIZE - split into numbers and operators
  // Regex splits on operators while keeping them: "5+3" -> ["5", "+", "3"]
  const tokens = expr.split(/\s+/); // Split by spaces

  // Step 2: PARSE - convert string numbers to actual numbers
  const parsed = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (["+", "-", "*", "/"].includes(token)) {
      parsed.push(token);
    } else {
      const num = parseFloat(token);
      if (isNaN(num)) {
        throw new Error("Invalid number: " + token);
      }
      parsed.push(num);
    }
  }

  // Validate structure: must alternate number-operator-number
  if (parsed.length === 0) throw new Error("Empty expression");
  if (typeof parsed[0] !== "number") throw new Error("Must start with a number");
  if (typeof parsed[parsed.length - 1] !== "number") throw new Error("Must end with a number");

  // Step 3: EVALUATE with correct operator precedence
  // First pass: handle * and / (higher precedence)
  let i = 0;
  while (i < parsed.length) {
    if (parsed[i] === "*") {
      const left = parsed[i - 1];
      const right = parsed[i + 1];
      const result = left * right;
      parsed.splice(i - 1, 3, result); // Replace [left, *, right] with [result]

    } else if (parsed[i] === "/") {
      const left = parsed[i - 1];
      const right = parsed[i + 1];
      if (right === 0) throw new Error("Division by zero");
      const result = left / right;
      parsed.splice(i - 1, 3, result);
    } else {
      i++;
    }
  }

  // Second pass: handle + and - (lower precedence)
  i = 0;
  while (i < parsed.length) {
    if (parsed[i] === "+") {
      const left = parsed[i - 1];
      const right = parsed[i + 1];
      const result = left + right;
      parsed.splice(i - 1, 3, result);
    } else if (parsed[i] === "-") {
      const left = parsed[i - 1];
      const right = parsed[i + 1];
      const result = left - right;
      parsed.splice(i - 1, 3, result);
    } else {
      i++;
    }
  }

  // Should have exactly one number left (the result)
  if (parsed.length !== 1 || typeof parsed[0] !== "number") {
    throw new Error("Invalid expression");
  }

  return parsed[0];
}

/**
 * Formats a number for display (removes unnecessary decimals)
 * @param {number} num - The number to format
 * @returns {string} - Formatted string
 */
export function formatResult(num) {
  // If integer, show as integer. If decimal, limit to 10 places
  if (Number.isInteger(num)) {
    return num.toString();
  }
  // Round to 10 decimal places to avoid floating point errors
  return parseFloat(num.toFixed(10)).toString();
}
