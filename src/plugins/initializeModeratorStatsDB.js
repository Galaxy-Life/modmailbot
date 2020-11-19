const moment = require("moment");
const config = require("../cfg");

module.exports = function({ bot, knex, commands }) {
  commands.addGlobalCommand("initializeStatsDB", [], async (msg) => {
    if (! msg.member.roles.includes(config.statRoleId)) return;

    if (! await knex.schema.hasTable("moderator_stats")) {
      await knex.schema.createTable("moderator_stats", table => {
        table.string("user_id", 20).primary().notNullable();
        table.string("user_name", 128).notNullable();
        table.integer("reply_count").unsigned().defaultTo(0).notNullable();
        table.integer("reply_char_count").unsigned().defaultTo(0).notNullable();
        table.integer("reply_edit_count").unsigned().defaultTo(0).notNullable();
        table.integer("reply_delete_count").unsigned().defaultTo(0).notNullable();
        table.integer("snippets_used_count").unsigned().defaultTo(0).notNullable();
        table.dateTime("first_action").notNullable();
      });
    }

    let message = {
      "embed": {
        "title": "**ModMail Stats**",
        "description": "Table initialized successfully!",
        "color": 3532299,
        "footer": {
          "text": "success"
        },
        "timestamp": moment.utc().format("YYYY-MM-DD HH:mm:ss"),
        "thumbnail": {
          "url": config.statSuccessEmbedImageUrl
        }
      }
    }

    const dmChannel = await bot.getDMChannel(msg.author.id);
    await dmChannel.createMessage(message);
  });
}