// =============================================================================
// acp agent list    — Show all agents (fetches from server, auto-login if needed)
// acp agent switch  — Switch active agent (regenerates API key, auto-login if needed)
// acp agent create  — Create a new agent (auto-login if needed)
// =============================================================================

import * as output from "../lib/output.js";
import {
  readConfig,
  writeConfig,
  getActiveAgent,
  findAgentByName,
  activateAgent,
  type AgentEntry,
} from "../lib/config.js";
import {
  ensureSession,
  fetchAgents,
  createAgentApi,
  regenerateApiKey,
  syncAgentsToConfig,
} from "../lib/auth.js";

function redactApiKey(key: string | undefined): string {
  if (!key || key.length < 8) return "(not available)";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

function displayAgents(agents: AgentEntry[]): void {
  output.heading("Agents");
  for (const a of agents) {
    const marker = a.active ? output.colors.green(" (active)") : "";
    output.log(`  ${output.colors.bold(a.name)}${marker}`);
    output.log(`    ${output.colors.dim("Wallet")}  ${a.walletAddress}`);
    if (a.apiKey) {
      output.log(`    ${output.colors.dim("API Key")} ${redactApiKey(a.apiKey)}`);
    }
    output.log("");
  }
}

export async function list(): Promise<void> {
  const sessionToken = await ensureSession();
  let agents: AgentEntry[];

  try {
    const serverAgents = await fetchAgents(sessionToken);
    agents = syncAgentsToConfig(serverAgents);
  } catch (e) {
    output.warn(
      `Could not fetch agents from server: ${e instanceof Error ? e.message : String(e)}`
    );
    output.log("  Showing locally saved agents.\n");
    agents = readConfig().agents ?? [];
  }

  if (agents.length === 0) {
    output.output({ agents: [] }, () => {
      output.log("  No agents found. Run `acp agent create <name>` to create one.\n");
    });
    return;
  }

  output.output(
    agents.map((a) => ({
      name: a.name,
      id: a.id,
      walletAddress: a.walletAddress,
      active: a.active,
    })),
    () => displayAgents(agents)
  );
}

export async function switchAgent(name: string): Promise<void> {
  if (!name) {
    output.fatal("Usage: acp agent switch <name>");
  }

  // Check the agent exists locally (must have run `agent list` at least once)
  const target = findAgentByName(name);
  if (!target) {
    const config = readConfig();
    const names = (config.agents ?? []).map((a) => a.name).join(", ");
    output.fatal(
      `Agent "${name}" not found. Run \`acp agent list\` first. Available: ${names || "(none)"}`
    );
  }

  // Regenerate API key (requires auth)
  const sessionToken = await ensureSession();

  output.log(`  Switching to ${target.name}...\n`);
  try {
    const result = await regenerateApiKey(sessionToken, target.walletAddress);
    activateAgent(target.id, result.apiKey);

    output.output(
      { switched: true, name: target.name, walletAddress: target.walletAddress },
      () => {
        output.success(`Switched to agent: ${target.name}`);
        output.log(`    Wallet:  ${target.walletAddress}`);
        output.log(`    API Key: ${redactApiKey(result.apiKey)} (regenerated)\n`);
      }
    );
  } catch (e) {
    output.fatal(
      `Failed to switch agent: ${e instanceof Error ? e.message : String(e)}`
    );
  }
}

export async function create(name: string): Promise<void> {
  if (!name) {
    output.fatal("Usage: acp agent create <name>");
  }

  const sessionToken = await ensureSession();

  try {
    const result = await createAgentApi(sessionToken, name);
    if (!result?.apiKey) {
      output.fatal("Create agent failed — no API key returned.");
    }

    // Add to local config and activate
    const config = readConfig();
    const updatedAgents = (config.agents ?? []).map((a) => ({
      ...a,
      active: false,
      apiKey: undefined, // clear other agents' keys
    }));
    const newAgent: AgentEntry = {
      id: result.id,
      name: result.name || name,
      walletAddress: result.walletAddress,
      apiKey: result.apiKey,
      active: true,
    };
    updatedAgents.push(newAgent);

    writeConfig({
      ...config,
      LITE_AGENT_API_KEY: result.apiKey,
      agents: updatedAgents,
    });

    output.output(
      {
        created: true,
        name: newAgent.name,
        id: newAgent.id,
        walletAddress: newAgent.walletAddress,
      },
      () => {
        output.success(`Agent created: ${newAgent.name}`);
        output.log(`    Wallet:  ${newAgent.walletAddress}`);
        output.log(`    API Key: ${redactApiKey(newAgent.apiKey)} (saved to config.json)\n`);
      }
    );
  } catch (e) {
    output.fatal(
      `Create agent failed: ${e instanceof Error ? e.message : String(e)}`
    );
  }
}
