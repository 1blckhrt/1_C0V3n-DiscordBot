import process from "node:process";
import { fileURLToPath, URL } from "node:url";
import { env, client } from "./util/constants.js";
import loadStructures from "./util/functions/loadStructures.js";
import { isCommand, isEvent, isComponent } from "./util/types/index.js";

const commands = await loadStructures(fileURLToPath(new URL("commands", import.meta.url)), isCommand);

for (const command of commands) {
	client.commands.set(command.data.name, command);
}

const events = await loadStructures(fileURLToPath(new URL("events", import.meta.url)), isEvent);

for (const event of events) {
	client[event.once ? "once" : "on"](event.name, async (...args) => event.execute(...args));
}

const components = await loadStructures(fileURLToPath(new URL("components", import.meta.url)), isComponent);

for (const component of components) {
	switch (component.type) {
		case "button":
			client.buttons.set(component.customId, component);
			break;
		case "selectMenu":
			client.selectMenus.set(component.customId, component);
			break;
		case "modal":
			client.modals.set(component.customId, component);
			break;
	}
}

await client.login(env.token);

process.on("SIGINT", async () => {
	await client.db.$disconnect();
	process.exit(0);
});
