# 🧩 Stats plugin


## Specify plugins to load
The plugin consists of two separate files:
```ini
# Main file
plugins[] = ./src/plugins/moderatorStats.js
# File for SQLite Table creation, can be removed after initial setup
plugins[] = ./src/plugins/initializeModeratorStatsDB.js
```

## Configure needed values
You need to give the plugin the ID of a role that should be able to execute the commands. Furthermore, you CAN make the bot use images in the embed messages
```ini
# required
statRoleId = {ID of role that should be able to execute !stats, !stats total and !initializeStatsDB commands}
# optional
statSuccessEmbedImageUrl = https://cdn.discordapp.com/attachments/778728888602722346/779014008954552410/Starling_Scientist.png
statFailedEmbedImageUrl = https://cdn.discordapp.com/attachments/778728888602722346/779013987990765608/Oopsies.png
```

## Using the plugin
**Please backup your data.sqlite before using this plugin!**

### Initial setup
After initially adding the plugin, run `!initializeStatsDB` in a text channel on the inbox-server (you need the supplied role!). This will create the needed table in the SQLite database. Afterwards, you can delete 
```ini
plugins[] =./src/plugins/initializeModeratorStatsDB.js
```
from the `config.ini` file, since you won't need to run this command again.

### Commands
After these steps, you can use the commands `!stats <userId>` and `!stats total` on the inbox-server. The bot will then DM you the stats of the given moderator or the total stats.