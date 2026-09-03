import { useThemeStore, ThemeMode, ThemeColors } from "../store/themeStore";
import { useProviderStore, PreamblePreset } from "../store/providerStore";
import { useAgentStore, AgentPersona } from "../store/agentStore";

export interface LotaPersistentSettings {
  version?: number;
  theme?: {
    mode?: ThemeMode;
    preset?: string;
    darkColors?: ThemeColors;
    lightColors?: ThemeColors;
  };
  provider?: {
    activeProviderId?: string;
    activeModel?: string;
    preambles?: PreamblePreset[];
    activePreambleId?: string;
  };
  agents?: {
    personas?: AgentPersona[];
    activePersonaId?: string;
  };
  ui?: {
    sidebarCollapsed?: boolean;
    workbenchOpen?: boolean;
    statusbarOpen?: boolean;
  };
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export async function loadSettingsFromDisk(): Promise<LotaPersistentSettings | null> {
  if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const settings = await invoke<LotaPersistentSettings>("load_lota_settings");
      if (settings && typeof settings === "object" && Object.keys(settings).length > 0) {
        // Apply theme settings
        if (settings.theme) {
          const { setMode, setPreset, setColor } = useThemeStore.getState();
          if (settings.theme.mode) setMode(settings.theme.mode);
          if (settings.theme.preset) setPreset(settings.theme.preset);
          if (settings.theme.darkColors) {
            Object.entries(settings.theme.darkColors).forEach(([k, v]) => {
              setColor("dark", k as keyof ThemeColors, v);
            });
          }
          if (settings.theme.lightColors) {
            Object.entries(settings.theme.lightColors).forEach(([k, v]) => {
              setColor("light", k as keyof ThemeColors, v);
            });
          }
        }

        // Apply provider settings
        if (settings.provider) {
          const { setActiveProviderAndModel, setActivePreambleId } = useProviderStore.getState();
          if (settings.provider.activeProviderId && settings.provider.activeModel) {
            setActiveProviderAndModel(settings.provider.activeProviderId, settings.provider.activeModel);
          }
          if (settings.provider.activePreambleId) {
            setActivePreambleId(settings.provider.activePreambleId);
          }
        }

        return settings;
      }
    } catch (err) {
      console.warn("Failed to load settings from ~/.config/lota/settings.json:", err);
    }
  }
  return null;
}

export function scheduleSaveSettingsToDisk() {
  if (saveTimeout) clearTimeout(saveTimeout);

  saveTimeout = setTimeout(async () => {
    if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
      try {
        const theme = useThemeStore.getState();
        const provider = useProviderStore.getState();
        const agent = useAgentStore.getState();

        const payload: LotaPersistentSettings = {
          version: 1,
          theme: {
            mode: theme.mode,
            preset: theme.preset,
            darkColors: theme.darkColors,
            lightColors: theme.lightColors,
          },
          provider: {
            activeProviderId: provider.activeProviderId,
            activeModel: provider.activeModel,
            preambles: provider.preambles,
            activePreambleId: provider.activePreambleId,
          },
          agents: {
            personas: agent.personas,
            activePersonaId: agent.activePersonaId,
          },
        };

        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("save_lota_settings", { settings: payload });
      } catch (err) {
        console.warn("Failed to save settings to ~/.config/lota/settings.json:", err);
      }
    }
  }, 400);
}
