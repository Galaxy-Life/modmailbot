const attachments = require("../data/attachments");
const utils = require("../utils");
const Thread = require("../data/Thread");
const moderator = require("../data/moderators");

module.exports = ({ bot, knex, config, commands }) => {
  // Mods can reply to modmail threads using !r or !reply
  // These messages get relayed back to the DM thread between the bot and the user
  commands.addInboxThreadCommand("reply", "[text$]", async (msg, args, thread) => {
    if (! args.text && msg.attachments.length === 0) {
      utils.postError(msg.channel, "Text or attachment required");
      return;
    }

    const replied = await thread.replyToUser(msg.member, args.text || "", msg.attachments, false);
    if (replied) msg.delete();
    await moderator.updateModeratorStats(msg.author.id, msg.author.username, { reply_count: 1, reply_char_count: args.text ? args.text.length : 0 });
  }, {
    aliases: ["r"]
  });

  // Anonymous replies only show the role, not the username
  commands.addInboxThreadCommand("anonreply", "[text$]", async (msg, args, thread) => {
    if (! args.text && msg.attachments.length === 0) {
      utils.postError(msg.channel, "Text or attachment required");
      return;
    }

    const replied = await thread.replyToUser(msg.member, args.text || "", msg.attachments, true);
    if (replied) msg.delete();
    await moderator.updateModeratorStats(msg.author.id, msg.author.username, { reply_count: 1, reply_char_count: args.text.length });
  }, {
    aliases: ["ar"]
  });

  if (config.allowStaffEdit) {
    commands.addInboxThreadCommand("edit", "<messageNumber:number> <text:string$>", async (msg, args, thread) => {
      const threadMessage = await thread.findThreadMessageByMessageNumber(args.messageNumber);
      if (! threadMessage) {
        utils.postError(msg.channel, "Unknown message number");
        return;
      }

      if (threadMessage.user_id !== msg.author.id) {
        utils.postError(msg.channel, "You can only edit your own replies");
        return;
      }

      const edited = await thread.editStaffReply(msg.member, threadMessage, args.text);
      if (edited) msg.delete().catch(utils.noop);
      await moderator.updateModeratorStats(msg.author.id, msg.author.username, { reply_edit_count: 1 });
    }, {
      aliases: ["e"]
    });
  }

  if (config.allowStaffDelete) {
    commands.addInboxThreadCommand("delete", "<messageNumber:number>", async (msg, args, thread) => {
      const threadMessage = await thread.findThreadMessageByMessageNumber(args.messageNumber);
      if (! threadMessage) {
        utils.postError(msg.channel, "Unknown message number");
        return;
      }

      if (threadMessage.user_id !== msg.author.id) {
        utils.postError(msg.channel, "You can only delete your own replies");
        return;
      }

      await thread.deleteStaffReply(msg.member, threadMessage);
      msg.delete().catch(utils.noop);
      await moderator.updateModeratorStats(msg.author.id, msg.author.username, { reply_delete_count: 1 });
    }, {
      aliases: ["d"]
    });
  }
};
