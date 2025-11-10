// Unit tests for the expression evaluator
// Tests are organized by functionality: basic operations, precedence, errors, edge cases

import { evaluateExpression, formatResult } from './evaluator';

// GROUP 1: Basic arithmetic operations
describe('evaluateExpression - Basic Operations', () => {
  test('adds two numbers correctly', () => {
    expect(evaluateExpression('5 + 3')).toBe(8);
    expect(evaluateExpression('10 + 20')).toBe(30);
    expect(evaluateExpression('0 + 0')).toBe(0);
  });

  test('subtracts two numbers correctly', () => {
    expect(evaluateExpression('10 - 3')).toBe(7);
    expect(evaluateExpression('5 - 5')).toBe(0);
    expect(evaluateExpression('0 - 10')).toBe(-10);
  });

  test('multiplies two numbers correctly', () => {
    expect(evaluateExpression('6 * 7')).toBe(42);
    expect(evaluateExpression('5 * 0')).toBe(0);
    expect(evaluateExpression('3 * 4')).toBe(12);
  });

  test('divides two numbers correctly', () => {
    expect(evaluateExpression('15 / 3')).toBe(5);
    expect(evaluateExpression('10 / 2')).toBe(5);
    expect(evaluateExpression('7 / 2')).toBe(3.5);
  });
});

// GROUP 2: Operator precedence (multiplication/division before addition/subtraction)
describe('evaluateExpression - Operator Precedence', () => {
  test('respects multiplication before addition', () => {
    expect(evaluateExpression('5 + 3 * 2')).toBe(11); // Not 16!
    expect(evaluateExpression('2 * 3 + 4')).toBe(10); // Not 14!
  });

  test('respects division before subtraction', () => {
    expect(evaluateExpression('20 - 4 / 2')).toBe(18); // Not 8!
    expect(evaluateExpression('10 / 2 - 1')).toBe(4);  // Not 5!
  });

  test('handles complex expressions with multiple operators', () => {
    expect(evaluateExpression('2 + 3 * 4 - 1')).toBe(13); // 2 + 12 - 1
    expect(evaluateExpression('10 / 2 + 3 * 2')).toBe(11); // 5 + 6
  });
});

// GROUP 3: Decimal numbers
describe('evaluateExpression - Decimal Numbers', () => {
  test('handles decimal addition', () => {
    expect(evaluateExpression('3.14 + 2.86')).toBeCloseTo(6, 2);
    expect(evaluateExpression('0.1 + 0.2')).toBeCloseTo(0.3, 1); // Floating point!
  });

  test('handles decimal multiplication', () => {
    expect(evaluateExpression('2.5 * 4')).toBe(10);
    expect(evaluateExpression('1.5 * 3')).toBe(4.5);
  });

  test('handles decimal division', () => {
    expect(evaluateExpression('10 / 3')).toBeCloseTo(3.333333, 5);
    expect(evaluateExpression('7.5 / 2.5')).toBe(3);
  });
});

// GROUP 4: Chain calculations (multiple operations)
describe('evaluateExpression - Chain Calculations', () => {
  test('chains multiple additions', () => {
    expect(evaluateExpression('1 + 2 + 3 + 4')).toBe(10);
  });

  test('chains multiple subtractions', () => {
    expect(evaluateExpression('100 - 20 - 30 - 10')).toBe(40);
  });

  test('chains multiple multiplications', () => {
    expect(evaluateExpression('2 * 3 * 4')).toBe(24);
  });

  test('chains mixed operations', () => {
    expect(evaluateExpression('5 + 5 - 2 + 3')).toBe(11);
  });
});

// GROUP 5: Error handling
describe('evaluateExpression - Error Handling', () => {
  test('throws error for division by zero', () => {
    expect(() => evaluateExpression('5 / 0')).toThrow('Division by zero');
    expect(() => evaluateExpression('10 + 5 / 0')).toThrow('Division by zero');
  });

  test('throws error for empty expression', () => {
    expect(() => evaluateExpression('')).toThrow('Empty expression');
    expect(() => evaluateExpression('   ')).toThrow('Empty expression');
  });

  test('throws error for invalid numbers', () => {
    expect(() => evaluateExpression('abc')).toThrow('Invalid number');
    expect(() => evaluateExpression('5 + xyz')).toThrow('Invalid number');
  });

  test('throws error for incomplete expressions', () => {
    expect(() => evaluateExpression('5 +')).toThrow('Must end with a number');
    expect(() => evaluateExpression('+ 5')).toThrow('Must start with a number');
  });
});

// GROUP 6: Edge cases
describe('evaluateExpression - Edge Cases', () => {
  test('handles single number', () => {
    expect(evaluateExpression('42')).toBe(42);
    expect(evaluateExpression('0')).toBe(0);
  });

  test('handles negative results', () => {
    expect(evaluateExpression('5 - 10')).toBe(-5);
    expect(evaluateExpression('0 - 100')).toBe(-100);
  });

  test('handles very small numbers', () => {
    expect(evaluateExpression('0.0001 + 0.0002')).toBeCloseTo(0.0003, 4);
  });

  test('handles very large numbers', () => {
    expect(evaluateExpression('1000000 * 1000')).toBe(1000000000);
  });
});

// GROUP 7: formatResult function
describe('formatResult - Number Formatting', () => {
  test('formats integers without decimals', () => {
    expect(formatResult(8)).toBe('8');
    expect(formatResult(42)).toBe('42');
    expect(formatResult(0)).toBe('0');
  });

  test('formats decimals correctly', () => {
    expect(formatResult(3.14)).toBe('3.14');
    expect(formatResult(2.5)).toBe('2.5');
  });

  test('removes unnecessary trailing zeros', () => {
    expect(formatResult(8.0)).toBe('8');
    expect(formatResult(10.0)).toBe('10');
  });

  test('limits decimal places to avoid floating point errors', () => {
    const result = formatResult(0.1 + 0.2); // JS floating point issue
    expect(result).toBe('0.3'); // Not '0.30000000000000004'
  });

  test('handles very long decimals', () => {
    const result = formatResult(10 / 3); // 3.3333333...
    expect(result.length).toBeLessThanOrEqual(12); // Max 10 decimals + "3."
  });
});
