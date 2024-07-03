import { parseArgs } from 'node:util';
import fs from 'fs/promises';

const getArguments = () => {
  const args = process.args;
  const options = {
    input: {
      type: 'string',
      short: 'i'
    },
    output: {
      type: 'string',
      short: 'o'
    }
  }

  const { values, positionals: _ } = parseArgs({ args, options });

  if (!values.input) {
    throw new Error('Missing or invalid --input/-i argument');
  }
  if (!values.output) {
    throw new Error('Missing or invalid --output/-o argument');
  }

  return { 
    input: values.input,
    output: values.output
  };
};

const flattenJSON = (json) => {
  const walk = (into, obj, prefix = []) => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        walk(into, value, [...prefix, key]);
      } else {
        into[[...prefix, key].join('.')] = value;
      }
    }
  };
  const out = {};
  walk(out, json);
  return out;
};

const transformKVObjectToCSV = (obj) => {
  let csv = `key;value\n`;
  for (const [key, value] of Object.entries(obj)) {
    csv += `${key};${value}\n`;
  }
  return csv;
};

const init = async () => {
  const { input, output } = getArguments();

  const inputFileContents = await fs.readFile(input, 'utf-8');
  const json = JSON.parse(inputFileContents);

  const flatObject = flattenJSON(json);
  const csv = transformKVObjectToCSV(flatObject);

  try {
    await fs.writeFile(output.endsWith('.csv') ? output : `${output}.csv`, csv, 'utf-8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Find/create output directory
      const outputDir = output.split('/').slice(0, -1).join('/');
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(output.endsWith('.csv') ? output : `${output}.csv`, csv, 'utf-8');
    }
  }
  
};

await init();
