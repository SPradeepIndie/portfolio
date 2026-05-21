#!/usr/bin/env node

import fs from 'fs';

const [, , templatePath, outputPath] = process.argv;

if (!templatePath || !outputPath) {
  console.error('Usage: node scripts/render-template.mjs <templatePath> <outputPath>');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
const rendered = template.replace(/\$\{([A-Z0-9_]+)\}/g, (_, name) => {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
});

fs.writeFileSync(outputPath, rendered, 'utf8');