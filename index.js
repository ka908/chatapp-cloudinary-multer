const express = require("express");
const chalk = require("chalk");
const app = express();
app.use(express.json());
const chats = require("./routes/chats");
const chatsandmessages = require("./routes/chatsandmessages");
const messages = require("./routes/messages");
const users = require("./routes/users");

app.use("/", chats);
app.use("/", chatsandmessages);
app.use("/", messages);
app.use("/", users);

const PORT = 3000;

// Your middleware and routes here

app.listen(PORT, () => {
  console.log(
    chalk.green(`\n\n
    ┌───────────────────────────────────────┐`)
  );
  console.log(chalk.green(`    │          Your server is running on    │`));
  console.log(
    chalk.green(chalk.bold`    │          http://localhost:${PORT}        │`)
  );

  console.log(chalk.green(`    └───────────────────────────────────────┘\n`));
});

//................................................................user table
// exports.up = function (knex) {
//     return knex.schema.createTable('users', (table) => {
//       table.increments('id').primary();
//       table.string('username').unique().notNullable();
//       table.string('email').unique().notNullable();
//       table.timestamp('created_at').defaultTo(knex.fn.now());
//     });
//   };

//   exports.down = function (knex) {
//     return knex.schema.dropTable('users');
//   };
//......................................................................
// Chats Table
// javascript
// Copy code
// exports.up = function (knex) {
//   return knex.schema.createTable('chats', (table) => {
//     table.increments('id').primary();
//     table.string('name').nullable(); // Optional for group chats
//     table.boolean('is_group').defaultTo(false);
//     table.timestamp('created_at').defaultTo(knex.fn.now());
//   });
// };

// exports.down = function (knex) {
//   return knex.schema.dropTable('chats');
// };
// Chat Participants Table
// Stores users who are part of each chat.

// javascript
// Copy code
// exports.up = function (knex) {
//   return knex.schema.createTable('chat_participants', (table) => {
//     table.increments('id').primary();
//     table.integer('chat_id').unsigned().references('id').inTable('chats').onDelete('CASCADE');
//     table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
//   });
// };

// exports.down = function (knex) {
//   return knex.schema.dropTable('chat_participants');
// };
// Messages Table
// Stores individual messages for each chat.

// javascript
// Copy code
// exports.up = function (knex) {
//   return knex.schema.createTable('messages', (table) => {
//     table.increments('id').primary();
//     table.integer('chat_id').unsigned().references('id').inTable('chats').onDelete('CASCADE');
//     table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
//     table.text('content').notNullable();
//     table.timestamp('sent_at').defaultTo(knex.fn.now());
//   });
// };

// exports.down = function (knex) {
//   return knex.schema.dropTable('messages');
// };
// Message Status Table
// Stores delivery and read status for each message.

// javascript
// Copy code
// exports.up = function (knex) {
//   return knex.schema.createTable('message_status', (table) => {
//     table.increments('id').primary();
//     table.integer('message_id').unsigned().references('id').inTable('messages').onDelete('CASCADE');
//     table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
//     table.boolean('is_read').defaultTo(false);
//     table.timestamp('read_at').nullable();
//   });
// };

// exports.down = function (knex) {
//   return knex.schema.dropTable('message_status');
// };
// Running Migrations
// After writing the migration scripts, run the migrations:

// bash
// Copy code
// npx knex migrate:latest
// Seeding Data (Optional)
// If you need some initial data for testing, create seed files:

// bash
// Copy code
// npx knex seed:make initial_users
// Example seed for users:

// javascript
// Copy code
// exports.seed = async function (knex) {
//   await knex('users').del(); // Clear existing data
//   await knex('users').insert([
//     { username: 'john_doe', email: 'john@example.com' },
//     { username: 'jane_doe', email: 'jane@example.com' },
//   ]);
// };
