import assert from "assert";
import { parseVariableExpression } from "../utils/parsers.js";

it('should parse a valid variable declaration with a value', () => {
  const expression = 'x = 5;';
  const declaration = 'let';
  const variables = {};

  const result = parseVariableExpression(expression, declaration, variables);

  assert.deepStrictEqual(result, { x: { declaration: 'let', value: 5 } });
});

it('should parse a valid variable declaration without a value', () => {
  const expression = 'y';
  const declaration = 'let';
  const variables = {};

  const result = parseVariableExpression(expression, declaration, variables);

  assert.deepStrictEqual(result, { y: { declaration: 'let', value: undefined } });
});

it('should parse a valid variable declaration with a variable name containing underscores and dollar signs', () => {
  const expression = '_$var = 10;';
  const declaration = 'let';
  const variables = {};

  const result = parseVariableExpression(expression, declaration, variables);

  assert.deepStrictEqual(result, { _$var: { declaration: 'let', value: 10 } });
});

it('should parse a valid variable declaration with a value containing a variable name', () => {
  const expression = 'z = x + 5;';
  const declaration = 'let';
  const variables = { x: { declaration: 'let', value: 2 } };

  const result = parseVariableExpression(expression, declaration, variables);

  assert.deepStrictEqual(result, { z: { declaration: 'let', value: 7 } });
});
