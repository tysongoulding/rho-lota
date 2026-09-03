//! File-backed persistent settings for lota desktop in ~/.config/rho/lota/settings.json

use serde_json::Value;
use std::path::PathBuf;

pub fn lota_config_dir() -> PathBuf {
    if let Ok(custom) = std::env::var("LOTA_HOME") {
        return PathBuf::from(custom);
    }
    rho_harness_core::config::default_config_dir().join("lota")
}

pub fn lota_settings_path() -> PathBuf {
    lota_config_dir().join("settings.json")
}

#[tauri::command]
pub async fn load_lota_settings() -> Result<Value, String> {
    let path = lota_settings_path();
    if !path.exists() {
        return Ok(Value::Object(serde_json::Map::new()));
    }
    let content = std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read settings from {}: {}", path.display(), e))?;
    let parsed: Value = serde_json::from_str(&content).map_err(|e| format!("Failed to parse settings JSON: {}", e))?;
    Ok(parsed)
}

#[tauri::command]
pub async fn save_lota_settings(settings: Value) -> Result<(), String> {
    let dir = lota_config_dir();
    let _ = std::fs::create_dir_all(&dir)
        .map_err(|e| format!("Failed to create config directory {}: {}", dir.display(), e))?;
    let path = lota_settings_path();
    let formatted =
        serde_json::to_string_pretty(&settings).map_err(|e| format!("Failed to serialize settings: {}", e))?;
    std::fs::write(&path, formatted).map_err(|e| format!("Failed to write settings to {}: {}", path.display(), e))?;
    Ok(())
}

#[tauri::command]
pub fn get_lota_config_path() -> Result<String, String> {
    Ok(lota_settings_path().display().to_string())
}
