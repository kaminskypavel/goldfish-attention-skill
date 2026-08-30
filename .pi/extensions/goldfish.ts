/**
 * goldfish — always-on final-pass filter for Pi.
 *
 * Injects skills/goldfish-attention-span/SKILL.md plus ACTIVE LEVEL on every
 * agent turn. /goldfish persists the shared Claude/Codex level file.
 */

import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import type {
	BeforeAgentStartEventResult,
	ExtensionAPI,
} from "@earendil-works/pi-coding-agent";

const extensionDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(extensionDir, "../..");
const skillPath = join(packageRoot, "skills/goldfish-attention-span/SKILL.md");

const KNOWN = new Set(["lite", "full", "ultra", "off"]);
const OFF_PHRASE = /\bstop goldfish\b|\bnormal mode\b|(?:\/|@)goldfish\s+off\b/i;
const GOLDFISH_MENTION = /\bgoldfish\b|(?:\/|@)goldfish\b/i;

const COMMAND_OPTIONS = [
	{ value: "lite", label: "lite", description: "200 words" },
	{ value: "full", label: "full", description: "100 words (default)" },
	{ value: "ultra", label: "ultra", description: "50 words" },
	{ value: "off", label: "off", description: "Inert until goldfish again" },
] as const;

function configDir(): string {
	return process.env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude");
}

function levelPath(): string {
	return join(configDir(), ".goldfish-level");
}

/** Same allow-list as hooks/goldfish-activate.sh. */
function sanitizeLevel(raw: string): string {
	const level = raw.replace(/[ \t\r\n]/g, "");
	if (KNOWN.has(level)) return level;
	if (level !== "" && /^[0-9]+$/.test(level)) return level;
	return "full";
}

async function readLevel(): Promise<string> {
	try {
		return sanitizeLevel(await readFile(levelPath(), "utf8"));
	} catch {
		return "full";
	}
}

async function writeLevel(token: string): Promise<void> {
	await writeFile(levelPath(), token);
}

function appendSystemPrompt(
	systemPrompt: string | string[] | null | undefined,
	addition: string,
): string | string[] {
	if (Array.isArray(systemPrompt)) return [...systemPrompt, addition];
	const base = typeof systemPrompt === "string" ? systemPrompt : String(systemPrompt ?? "");
	return base ? `${base}\n\n${addition}` : addition;
}

function applyPromptToLevel(prompt: string, level: string): { level: string; persist: boolean } {
	if (OFF_PHRASE.test(prompt)) return { level: "off", persist: true };
	if (level === "off" && GOLDFISH_MENTION.test(prompt)) return { level: "full", persist: true };
	return { level, persist: false };
}

export default function goldfish(pi: ExtensionAPI) {
	pi.registerCommand("goldfish", {
		description: "Switch goldfish cap level (lite 200 / full 100 / ultra 50 / custom N / off)",
		getArgumentCompletions: (prefix: string) => {
			const normalized = prefix.trim().toLowerCase();
			const items = COMMAND_OPTIONS.filter((item) => item.value.startsWith(normalized));
			return items.length > 0 ? items : null;
		},
		handler: async (args, ctx) => {
			const arg = args?.trim() ?? "";
			let token: string;
			if (!arg) {
				token = "full";
			} else if (KNOWN.has(arg.toLowerCase())) {
				token = arg.toLowerCase();
			} else if (/^[0-9]+$/.test(arg)) {
				token = arg;
			} else {
				ctx.ui.notify(`Unknown: "${arg}". Use lite, full, ultra, a number, or off.`, "error");
				return;
			}
			try {
				await writeLevel(token);
			} catch (err) {
				ctx.ui.notify(`Could not write ${levelPath()}: ${err}`, "error");
				return;
			}
			ctx.ui.notify(token === "off" ? "Goldfish off." : `Goldfish: ${token}`, "info");
		},
	});

	pi.on("before_agent_start", async (event) => {
		let level = await readLevel();
		const prompt = typeof event.prompt === "string" ? event.prompt : "";
		const applied = applyPromptToLevel(prompt, level);
		if (applied.persist) {
			try {
				await writeLevel(applied.level);
			} catch {
				// fail-open — still honor this turn
			}
			level = applied.level;
		}
		if (level === "off") return;

		let skill: string;
		try {
			skill = await readFile(skillPath, "utf8");
		} catch {
			return;
		}
		if (!skill) return;

		const addition = `${skill}\nACTIVE LEVEL: ${level}\n`;
		return {
			systemPrompt: appendSystemPrompt(
				event.systemPrompt as string | string[] | null | undefined,
				addition,
			),
		} as unknown as BeforeAgentStartEventResult;
	});
}
