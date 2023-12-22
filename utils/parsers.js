import calculator from "../calculator.js";

const possibleDeclarations = ["let", "const"];

export function replaceVariables(code, variables) {
  let localVariables = variables || {};

  let lines = code.split("\n");

  for (let line of lines) {
    line = line.trim();

    if (possibleDeclarations.some((declaration) => line.startsWith(declaration))) {
      const [declaration, expression] = line.split(/(?<=^\S+)\s/);

      if (!expression) {
        throw new ReferenceError(`${declaration} is not defined.`);
      }

      const splittedExpression = expression.split(',');

      for (let i = 0; i < splittedExpression.length; i++) {
        const expressionVariables = parseVariableExpression(splittedExpression[i].trim(), declaration, localVariables);

        localVariables = {
          ...localVariables,
          ...expressionVariables,
        };
      }
    } else if (line.indexOf('=') > -1) {
      let [variable, value] = expression.trim().split(/(?<!=)=(?!=)/g);

      variable = variable.trim();

      if (value) {
        const expressionRegex = new RegExp(/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^=]+$/gm);
      
        if (!expressionRegex.test(expression)) {
          throw new SyntaxError(`Invalid variable assignment syntax: ${expression}`);
        }
      }
      
      if (!possibleDeclarations.includes(variable) && !localVariables.hasOwnProperty(variable)) {
        throw new SyntaxError(`Unexpected variable declaration '${variable}'.`);
      }
      
      if (!localVariables.hasOwnProperty(variable)) {
        throw new ReferenceError(`Variable ${variable} is not defined.`);
      }

      if (localVariables[variable].declaration === "const") {
        throw new TypeError(`Assignment to constant variable ${variable}.`);
      } else {
        localVariables[variable].value = value;
      }
    } else {
      for (let variable in localVariables) {
        const value = localVariables[variable].value;

        const regex = new RegExp(`\\b${variable}\\b`, "g");

        line = line.replace(regex, value);
      }

      return line;
    }
  }
}

const parseVariableExpression = (expression, declaration, variables) => {
  const expressionVariables = {};

  let [variable, value] = expression.trim().split(/(?<!=)=(?!=)/g);

  variable = variable.trim();

  if (!variable) {
    throw new SyntaxError("Variable name can't be empty.")
  }

  const variableRegex = new RegExp(/^([a-zA-Z_$][a-zA-Z\d_$]*)$/g);

  if (!variableRegex.test(variable)) {
    throw new SyntaxError(`Invalid variable name: ${variable}.`);
  }

  if (value) {
    const expressionRegex = new RegExp(/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^=]+$/gm);
  
    if (!expressionRegex.test(expression)) {
      throw new SyntaxError(`Invalid variable assignment syntax: ${expression}`);
    }
  }

  if (declaration === 'const') {
    if (!value) {
      throw new SyntaxError('Missing initializer in const declaration');
    }

    if (variables.hasOwnProperty(variable)) {
      throw new TypeError(`Assignment to constant variable ${variable}.`);
    }

    const stringFirstCharRegex = new RegExp(/^[a-zA-Z]/gm)

    if (stringFirstCharRegex.test(value.trim())) {
      value = replaceVariables(value, variables);
    }

    expressionVariables[variable] = { declaration, value: calculator(value.trim()) };
  } else {
    if (!value) {
      expressionVariables[variable] = { declaration, value: undefined };

      return expressionVariables;
    }

    if (variables.hasOwnProperty(variable)) {
      throw new SyntaxError(`Identifier '${variable}' has already been declared.`);
    }

    const stringFirstCharRegex = new RegExp(/^[a-zA-Z]/gm)

    if (stringFirstCharRegex.test(value.trim())) {
      value = replaceVariables(value, variables);
    }

    expressionVariables[variable] = { declaration, value: calculator(value.trim()) };
  }

  return expressionVariables;
}
