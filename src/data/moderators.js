const moment = require("moment");
const knex = require("../knex");

/**
 * Returns the moderators stats
 * @param {String} userId
 * @returns {Promise<{ user_name: string, reply_count: integer, reply_chars: integer, snippets_used: integer, first_action: string }>|boolean}
 */
async function getModeratorStats(userId) {
  if (! await moderatorIsInDB(userId)) return false;
  const row = await knex("moderator_stats")
    .where("user_id", userId)
    .first();

  return {
    user_name: row.user_name,
    reply_count: row.reply_count,
    reply_char_count: row.reply_char_count,
    reply_edit_count: row.reply_edit_count,
    reply_delete_count: row.reply_delete_count,
    snippets_used_count: row.snippets_used_count,
    first_action: row.first_action
  };
}

/**
 * Checks whether moderator is already in DB
 * @param {String} userId
 * @returns {Promise<Boolean>}
 */
async function moderatorIsInDB(userId) {
  const moderator = await knex("moderator_stats").where("user_id", userId).first();
  return moderator ? true : false;
}

/**
 * Updates moderators stats in DB
 * @param {String} userId 
 * @param {String} userName 
 * @param {{reply_count: integer, reply_char_count: integer, reply_edit_count: integer, reply_delete_count: integer, snippets_used_count: integer}} data
 * @returns {Promise<void>}
 */

async function updateModeratorStats(userId, userName, data) {
  if (! await moderatorIsInDB(userId)) await addModeratorToDB(userId, userName);
  return knex("moderator_stats")
    .where("user_id", userId)
    .increment("reply_count", data.reply_count || 0)
    .increment("reply_char_count", data.reply_char_count || 0)
    .increment("reply_edit_count", data.reply_edit_count || 0)
    .increment("reply_delete_count", data.reply_delete_count || 0)
    .increment("snippets_used_count", data.snippets_used_count || 0);
}

/**
 * Adds moderator to DB
 * @param {String} userId
 * @param {String} userName
 * @returns {Promise}
 */
async function addModeratorToDB(userId, userName) {
  if (await moderatorIsInDB(userId)) return;
  return knex("moderator_stats")
    .insert({
      user_id: userId,
      user_name: userName,
      reply_count: 0,
      reply_char_count: 0,
      reply_edit_count: 0,
      reply_delete_count: 0,
      snippets_used_count: 0,
      first_action: moment.utc().format("YYYY-MM-DD HH:mm:ss")
    });
}



module.exports = {
  getModeratorStats,
  moderatorIsInDB,
  updateModeratorStats,
  addModeratorToDB,
};
