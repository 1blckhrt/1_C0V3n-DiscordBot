import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import type { ClientOptions } from "discord.js";
import { GatewayIntentBits, Client, Collection, Events } from "discord.js";
import { populateDB } from "./functions/qotd/populateDB.js";
import type { Command } from "./types/command.js";
import type { Component } from "./types/component.js";

export const intentsArray = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.MessageContent,
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CustomClient extends Client {
	public commands: Collection<string, Command>;

	public buttons: Collection<string, Component<"Button">>;

	public modals: Collection<string, Component<"Modal">>;

	public selectMenus: Collection<string, Component<"SelectMenu">>;

	public db: Database.Database;

	public constructor(options: ClientOptions) {
		super(options);

		this.commands = new Collection<string, Command>();
		this.buttons = new Collection<string, Component<"Button">>();
		this.modals = new Collection<string, Component<"Modal">>();
		this.selectMenus = new Collection<string, Component<"SelectMenu">>();

		this.db = this.setupDB();
	}

	public setupDB(): Database.Database {
		const dbPath = path.join(__dirname, "../../database.db");

		return new Database(dbPath);
	}

	public populateDB(): void {
		populateDB(this);
	}
}

export const client = new CustomClient({ intents: intentsArray });

export const events = {
	interactionCreate: Events.InteractionCreate,
	guildMemberAdd: Events.GuildMemberAdd,
	guildMemberRemove: Events.GuildMemberRemove,
};
