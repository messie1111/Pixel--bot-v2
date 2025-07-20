 const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

// Remplacez cette URL par celle de votre image (photo)
const botImage = "https://tiny.one/2p9673jt"; // J'ai remplacé l'URL du GIF par celle de votre photo

// Configuration du propriétaire
const BOT_OWNER = "Master Charbel";
const FACEBOOK_LINK = "https://www.facebook.com/charbel.bot.2024";

function roleTextToString(role) {
  switch (role) {
    case 0: return "0 (Tous les utilisateurs)";
    case 1: return "1 (Admins de groupe)";
    case 2: return "2 (Admins du bot)";
    default: return "Inconnu";
  }
}

module.exports = {
  config: {
    name: "help",
    version: "3.1",
    author: "M•CHARBEL TEAM",
    countDown: 5,
    role: 0,
    shortDescription: "Menu d'aide stylisé",
    longDescription: "Affiche toutes les commandes par catégorie avec le style M•CHARBEL",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = await getPrefix(threadID);

    if (!args[0]) {
      // Organiser les commandes par catégorie
      const categories = {};
      let totalCommands = 0;

      for (const [cmdName, cmd] of commands) {
        if (cmd.config.role > role) continue;
        const category = cmd.config.category || "GÉNÉRAL";
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(cmdName);
        totalCommands++;
      }

      // Construire le message avec le style demandé
      let helpMessage = `▧▧━━━━━━━━━━━━━━▧▧\n ▧ 𝗠•𝗖𝗛𝗔𝗥𝗕𝗘𝗟⊶⊷𝗕ⓞ𝗧 ▧\n▨▨━━━━━━━━━━━━━━▨▨\n\n`;

      // Ajouter chaque catégorie dans un bloc séparé
      for (const [category, cmdList] of Object.entries(categories)) {
        helpMessage += `┍━[ ${category.toUpperCase()} ]\n`;
        cmdList.sort().forEach(cmd => {
          helpMessage += `┋▦ ${cmd}\n`;
        });
        helpMessage += `┕━━━━━━━━━━━━━━━▧▧\n\n`;
      }

      // Ajouter le bloc INFO en bas
      helpMessage += `┍━━━[ �𝙽𝙵𝙾 ]━━━▧▧\n` +
                     `┋➥ 𝐓𝐎𝐓𝐀𝐋 𝐂𝐌𝐃: ${totalCommands}\n` +
                     `┋➥ 𝐏𝐑𝐄𝐅𝐈𝐗 : ${prefix}\n` +
                     `┋➥ 𝐎𝐖𝐍𝐄𝐑 : ${BOT_OWNER}\n` +
                     `┋➥ 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 : ${FACEBOOK_LINK}\n` +
                     `┕━━━━━━━━━━━━▧▧`;

      // Envoyer avec l'image (remplacement du GIF)
      await message.reply({
        body: helpMessage,
        attachment: await global.utils.getStreamFromURL(botImage) // J'ai changé botGif en botImage
      });
    } else {
      // Aide d'une commande précise
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`❌ La commande "${commandName}" est introuvable.`);
        return;
      }

      const c = command.config;

      const description =
        (typeof c.longDescription === "string" ? c.longDescription :
        (c.shortDescription?.fr || c.longDescription?.fr)) || "Aucune description";

      const aliasText = c.aliases && c.aliases.length > 0 ? c.aliases.join(", ") : "Aucun";

      let guideText = "";
      if (c.guide) {
        if (typeof c.guide === "string") guideText = c.guide;
        else if (typeof c.guide === "object") {
          guideText = Object.entries(c.guide).map(([k, v]) => `${k}: ${v}`).join("\n");
        }
      } else guideText = "Aucun guide disponible.";

      const usageText = c.usage || c.usages || "Aucun exemple d'utilisation.";

      let remarksText = "";
      if (Array.isArray(c.remarks) && c.remarks.length > 0) {
        remarksText = c.remarks.map(r => `┋➥ ${r}`).join("\n");
      } else {
        remarksText = "Aucune remarque.";
      }

      const helpMsg =
`▧▧━━━━━━━━━━━━━━▧▧
 ▧ 𝗠•𝗖𝗛𝗔𝗥𝗕𝗘𝗟⊶⊷𝗕ⓞ𝗧 ▧
▨▨━━━━━━━━━━━━━━▨▨

┍━[ 🔎 AIDE DE LA CMD ]
┋➥ NOM: ${c.name}
┋➥ DESCRIPTION: ${description}
┋➥ AUTRES NOMS: ${aliasText}
┋➥ VERSION: ${c.version || "1.0"}
┋➥ ROLE: ${roleTextToString(c.role)}
┋➥ DELAI: ${c.countDown || c.cooldown || 2}s
┋➥ AUTEUR: ${c.author || "Inconnu"}
┕━━━━━━━━━━━━━━━▧▧

┍━[ 📜 UTILISATION  ]
${guideText.split("\n").map(line => "┋➥ " + line).join("\n")}
┕━━━━━━━━━━━━━━━▧▧

┍━[ 💡 USAGE EXEMPLE ]
┋➥ ${usageText}
┕━━━━━━━━━━━━━━━▧▧

┍━[ 📝 REMARQUES  ]
${remarksText}
┕━━━━━━━━━━━━━━━▧▧`;

      // Envoyer avec l'image (remplacement du GIF)
      await message.reply({
        body: helpMsg,
        attachment: await global.utils.getStreamFromURL(botImage) // J'ai changé botGif en botImage
      });
    }
  }
};
