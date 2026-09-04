//! Discovery commands for lota desktop: Skills, MCPs, Plugins, and Session DAG history.

use rho_harness_core::config::{Config, default_config_dir};
use rho_harness_core::session::summary::list_session_summaries;
use rho_harness_core::skills::resolved_skills;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillDto {
    pub name: String,
    pub description: String,
    pub location: String,
    pub origin: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct McpServerDto {
    pub name: String,
    pub command: String,
    pub args: Vec<String>,
    pub enabled: bool,
    pub env_keys: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PluginDto {
    pub name: String,
    pub command: Option<String>,
    pub path: String,
    pub enabled: bool,
    pub replaces: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PluginsAndMcpsDto {
    pub mcp_servers: Vec<McpServerDto>,
    pub plugins: Vec<PluginDto>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionSummaryDto {
    pub session_id: String,
    pub name: Option<String>,
    pub created_at: String,
    pub last_modified: String,
    pub turn_count: usize,
    pub preview: String,
}

#[tauri::command]
pub fn list_installed_skills(project_dir: Option<String>) -> Result<Vec<SkillDto>, String> {
    let proj_path = project_dir.map(PathBuf::from);
    let resolved = resolved_skills(proj_path.as_deref());

    let dtos = resolved
        .into_iter()
        .map(|s| SkillDto {
            name: s.metadata.name,
            description: s.metadata.description,
            location: s.metadata.location,
            origin: s.origin.to_string(),
        })
        .collect();

    Ok(dtos)
}

#[tauri::command]
pub fn get_configured_plugins_and_mcps() -> Result<PluginsAndMcpsDto, String> {
    let config = Config::load(None).unwrap_or_default();

    let mcp_servers = config
        .mcp
        .servers
        .iter()
        .map(|(name, s)| McpServerDto {
            name: name.clone(),
            command: s.command.clone(),
            args: s.args.clone(),
            enabled: s.enabled,
            env_keys: s.env.keys().cloned().collect(),
        })
        .collect();

    let plugins = config
        .plugins
        .into_iter()
        .map(|(name, p)| PluginDto {
            name,
            command: p.command,
            path: p.path.display().to_string(),
            enabled: p.enabled,
            replaces: p.replaces.into_iter().collect(),
        })
        .collect();

    Ok(PluginsAndMcpsDto { mcp_servers, plugins })
}

#[tauri::command]
pub fn list_saved_sessions() -> Result<Vec<SessionSummaryDto>, String> {
    let sessions_dir = default_config_dir().join("sessions");
    let summaries = list_session_summaries(&sessions_dir).map_err(|e| format!("Failed to list sessions: {e}"))?;

    let dtos = summaries
        .into_iter()
        .map(|s| SessionSummaryDto {
            session_id: s.session_id,
            name: s.name,
            created_at: s.created_at.to_rfc3339(),
            last_modified: s.last_modified.to_rfc3339(),
            turn_count: s.turn_count,
            preview: s.preview,
        })
        .collect();

    Ok(dtos)
}
