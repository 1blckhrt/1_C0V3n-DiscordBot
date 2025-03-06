import { fileURLToPath, URL } from "node:url";
import { API } from "@discordjs/core";
import { REST } from "discord.js";
import { env } from "./util/constants.js";
import loadStructures from "./util/functions/loadStructures.js";
import { isCommand } from "./util/types/index.js";

if (!env.token || !env.app_id) {
	throw new Error("Missing environment variables!");
}

const rest = new REST().setToken(env.token);

const api = new API(rest);

const commands = await loadStructures(fileURLToPath(new URL("commands", import.meta.url)), isCommand);
const commandData = commands.map((command) => command.data);

const result = await api.applicationCommands.bulkOverwriteGlobalCommands(env.app_id, commandData);

console.info(`Successfully registered ${result.length} commands!`);
