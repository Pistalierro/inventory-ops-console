import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

const mode = process.argv[2];

if (!mode || !['development', 'production'].includes(mode)) {
  console.error(
    'Usage: node tools/scripts/write-firebase-env.mjs <development|production>'
  );
  process.exit(1);
}

const required = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing Firebase env vars: ${missing.join(', ')}`);
  process.exit(1);
}

function readEnv(name) {
  return (process.env[name] ?? '').trim();
}

const filePath = resolve(
  `apps/console/src/environments/environment.${mode}.ts`
);

mkdirSync(dirname(filePath), { recursive: true });

const production = mode === 'production';

const content = `export const environment = {
  production: ${production},
  firebase: {
    apiKey: '${readEnv('FIREBASE_API_KEY')}',
    authDomain: '${readEnv('FIREBASE_AUTH_DOMAIN')}',
    projectId: '${readEnv('FIREBASE_PROJECT_ID')}',
    storageBucket: '${readEnv('FIREBASE_STORAGE_BUCKET')}',
    messagingSenderId: '${readEnv('FIREBASE_MESSAGING_SENDER_ID')}',
    appId: '${readEnv('FIREBASE_APP_ID')}',
  },
};
`;

writeFileSync(filePath, content, 'utf8');

console.log(`Generated ${filePath}`);
