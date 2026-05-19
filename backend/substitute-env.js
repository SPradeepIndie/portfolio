#!/usr/bin/env node

/**
 * Substitute environment variables in database.json
 * This script reads database.json, replaces ${VAR} placeholders with env values,
 * and writes the result back to database.json.
 * Usage: node substitute-env.js
 */

import fs from 'fs';
import path from 'path';

const databaseJsonPath = path.join(process.cwd(), 'database.json');

try {
  // Read database.json
  const content = fs.readFileSync(databaseJsonPath, 'utf8');
  
  // Substitute environment variables using ${VAR} pattern
  const substituted = content.replace(/\$\{([A-Z_]+)\}/g, (match, varName) => {
    const value = process.env[varName];
    if (value === undefined) {
      console.error(`Error: Environment variable ${varName} is not set`);
      process.exit(1);
    }
    console.log(`Substituting ${match} → ${value}`);
    return value;
  });

  // Write back to database.json
  fs.writeFileSync(databaseJsonPath, substituted, 'utf8');
  console.log(`✅ Successfully substituted environment variables in ${databaseJsonPath}`);
} catch (error) {
  console.error(`Error substituting environment variables: ${error.message}`);
  process.exit(1);
}
