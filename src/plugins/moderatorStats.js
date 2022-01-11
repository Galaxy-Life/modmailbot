const moment = require("moment");
const config = require("../cfg");
const moderator = require("../data/moderators");

module.exports = function({ commands }) {
  commands.addInboxServerCommand("stats", "<userId:userId>", async (msg, args) => {
    if (msg.channel.id != config.statChannelId) return;

    const stats = await moderator.getModeratorStats(args.userId);

    let message = "";
    if (stats) {
      message = {
        "embed": {
          "title": "**ModMail Stats**",
          "color": 13902811,
          "fields": [
            {
              "name": "Username",
              "value": stats.user_name,
              "inline": true
            },
            {
              "name": "User ID",
              "value": args.userId,
              "inline": true
            },
            {
              "name": "Number of replies",
              "value": stats.reply_count
            },
            {
              "name": "Chars in replies",
              "value": stats.reply_char_count
            },
            {
              "name": "Number of snippets used",
              "value": stats.snippets_used_count
            },
            {
              "name": "Number of edits",
              "value": stats.reply_edit_count
            },
            {
              "name": "Number of deleted replies",
              "value": stats.reply_delete_count
            }
          ],
          "footer": {
            "text": "success"
          },
          "timestamp": moment.utc().format("YYYY-MM-DD HH:mm:ss"),
          "thumbnail": {
            "url": config.statSuccessEmbedImageUrl
          }
        }
      }
    } else {
      message = {
        "embed": {
          "title": "**ModMail Stats**",
          "description": `No data for user with ID "${args.userId}" found!`,
          "color": 16711680,
          "footer": {
            "text": "failed"
          },
          "timestamp": moment.utc().format("YYYY-MM-DD HH:mm:ss"),
          "thumbnail": {
            "url": config.statFailedEmbedImageUrl
          }
        }
      }
    }

    await msg.channel.createMessage(message);
  });

  commands.addInboxServerCommand("stats total", [], async (msg) => {
    if (msg.channel.id != config.statChannelId) return;

    const stats = await moderator.getTotalStats();

    let message = {
      "embed": {
        "title": "**ModMail Stats**",
        "color": 13902811,
        "fields": [
          {
            "name": "Total number of replies",
            "value": stats.reply_count
          },
          {
            "name": "Total chars in replies",
            "value": stats.reply_char_count
          },
          {
            "name": "Total number of snippets used",
            "value": stats.snippets_used_count
          },
          {
            "name": "Total number of edits",
            "value": stats.reply_edit_count
          },
          {
            "name": "Total number of deleted replies",
            "value": stats.reply_delete_count
          }
        ],
        "footer": {
          "text": "success"
        },
        "timestamp": moment.utc().format("YYYY-MM-DD HH:mm:ss"),
        "thumbnail": {
          "url": config.statSuccessEmbedImageUrl
        }
      }
    }

    await msg.channel.createMessage(message);
  });
}
