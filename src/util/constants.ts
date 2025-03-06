import process from "node:process";
import { PrismaClient } from "@prisma/client";
import type { ClientOptions } from "discord.js";
import { GatewayIntentBits, Client, Collection, Events } from "discord.js";
import type { Command } from "./types/command.js";
import type { Component } from "./types/component.js";

export const intentsArray = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.MessageContent,
];

export class CustomClient extends Client {
	public commands: Collection<string, Command>;

	public buttons: Collection<string, Component<"Button">>;

	public modals: Collection<string, Component<"Modal">>;

	public selectMenus: Collection<string, Component<"SelectMenu">>;

	public db!: PrismaClient;

	public constructor(options: ClientOptions) {
		super(options);

		this.commands = new Collection<string, Command>();
		this.buttons = new Collection<string, Component<"Button">>();
		this.modals = new Collection<string, Component<"Modal">>();
		this.selectMenus = new Collection<string, Component<"SelectMenu">>();

		this.db = this.setupPrisma();
	}

	public setupPrisma(): PrismaClient {
		return new PrismaClient();
	}
}

export const client = new CustomClient({ intents: intentsArray });

export const devEvents = {
	interactionCreate: Events.InteractionCreate,
	guildMemberAdd: Events.GuildMemberAdd,
	guildMemberRemove: Events.GuildMemberRemove,
};

export const config = {
	feedbackChannel: "",
	devIDs: [""],
	linkBypass: [""],
	linksToBlock: ["soundcloud.com", "music.apple.com", "spotify.com", "discord.gg", "youtube.com"],
	channelsToCheck: ["1312250007000191097"],
};

export const env = {
	token: process.env.token,
	app_id: process.env.app_id,
};
