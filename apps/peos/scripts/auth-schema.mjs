#!/usr/bin/env node
// Prints the Better Auth SQLite schema for the options PEOS uses (email + password, rate limits in the
// database, no plugins).
// Regenerate after a Better Auth upgrade or plugin change and diff against migrations/0001_auth.sql.
// Usage: node scripts/auth-schema.mjs > /tmp/auth.sql
import { DatabaseSync } from 'node:sqlite';
import { getMigrations } from 'better-auth/db/migration';

const { compileMigrations } = await getMigrations({
	database: new DatabaseSync(':memory:'),
	emailAndPassword: { enabled: true },
	rateLimit: { enabled: true, storage: 'database' },
});
process.stdout.write(await compileMigrations());
