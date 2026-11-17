-- PEOS data. Both tables cascade from "user", so deleting a user removes their plan and shards.

-- The personal career plan (tasks, KPIs, gates, initial state) as one JSON document.
create table "plan" (
	"userId" text not null primary key references "user" ("id") on delete cascade,
	"data" text not null,
	"updatedAt" integer not null
);

-- State shards, same ids as the spec: core, ops, journal, d-YYYY-MM, rv-YYYY, snap-N-kind.
-- "t" is the client timestamp (ms) the sync protocol compares.
create table "shard" (
	"userId" text not null references "user" ("id") on delete cascade,
	"id" text not null,
	"data" text not null,
	"t" integer not null,
	primary key ("userId", "id")
);
