const possibleDeclarations = ["let", "const"];

export function replaceVariables(code) {
  const variables = {};
  const executable = [];

  let lines = code.split("\n");

  for (let line of lines) {
    line = line.trim();

    if (possibleDeclarations.some((declaration) => line.startsWith(declaration))) {
      const [keyword, name, sign, value] = line.split(" ");

      if (!possibleDeclarations.includes(keyword)) {
        throw new SyntaxError(`Unexpected variable declaration '${keyword}'.`);
      }

      if (sign !== '=') {
        throw new SyntaxError(`Unexpected token '${sign}'.`);
      }

      if (variables.hasOwnProperty(name)) {
        throw new Error(`Variable ${name} is already defined.`);
      } else {
        variables[name] = { keyword, value };
      }
    } else if (line.indexOf('=') > -1) {
      const [name, sign, value] = line.split(" ");

      if (sign !== '=') {
        throw new SyntaxError(`Unexpected token '${sign}'.`);
      }

      if (!variables.hasOwnProperty(name)) {
        throw new Error(`Variable ${name} is not defined.`);
      }

      if (variables[name].keyword === "const") {
        throw new Error(`Cannot reassign const variable ${name}.`);
      } else {
        variables[name].value = value;
      }
    } else {
      for (let name in variables) {
        const value = variables[name].value;

        const regex = new RegExp(`\\b${name}\\b`, "g");

        line = line.replace(regex, value);
      }
      
      executable.push(line);
    }
  }
  return executable;
}