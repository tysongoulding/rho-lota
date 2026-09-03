pub mod engine_bridge;
pub mod workspace_cmd;

use engine_bridge::{EngineState, ProviderTestResult, handle_rpc_command, test_provider_key_direct};
use rho_harness_core::rpc::protocol::{RpcRequest, RpcResponse};
use std::collections::HashMap;
use tauri::Manager;
use workspace_cmd::{execute_shell_command, list_workspace_entries, read_workspace_file, write_workspace_file};

#[tauri::command]
async fn send_rpc_command(
    request: RpcRequest,
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, EngineState>,
) -> Result<RpcResponse, String> {
    handle_rpc_command(request, app_handle, (*state).clone()).await
}

#[tauri::command]
async fn sync_provider_keys(keys: HashMap<String, String>, state: tauri::State<'_, EngineState>) -> Result<(), String> {
    let mut api_keys = state.api_keys.lock().await;
    let config_dir = rho_harness_core::config::default_config_dir();
    let _ = std::fs::create_dir_all(&config_dir);
    let auth_file = config_dir.join("auth.json");
    let mut auth_store = rho_engine::auth::AuthStore::load(&auth_file).unwrap_or_default();

    for (k, v) in keys {
        if !v.trim().is_empty() {
            api_keys.insert(k.clone(), v.clone());
            let _ = auth_store.set_key(&k, &v);
        }
    }
    Ok(())
}

#[tauri::command]
async fn get_saved_auth_keys() -> Result<HashMap<String, String>, String> {
    let config_dir = rho_harness_core::config::default_config_dir();
    let auth_file = config_dir.join("auth.json");
    let auth_store = rho_engine::auth::AuthStore::load(&auth_file).unwrap_or_default();
    let mut result = HashMap::new();

    for provider in [
        "gemini",
        "anthropic",
        "openai",
        "deepseek",
        "groq",
        "openrouter",
        "xai",
        "mistral",
        "cohere",
    ] {
        if let Ok(Some(key)) = auth_store.get_key_sync(provider) {
            if !key.trim().is_empty() {
                result.insert(provider.to_string(), key);
            }
        }
    }
    Ok(result)
}

#[tauri::command]
async fn test_provider_key(provider: String, key: String) -> Result<ProviderTestResult, String> {
    test_provider_key_direct(&provider, &key).await
}

#[tauri::command]
fn start_drag_window(window: tauri::Window) {
    let _ = window.start_dragging();
}

#[tauri::command]
fn minimize_window(window: tauri::Window) {
    let _ = window.minimize();
}

#[tauri::command]
fn toggle_maximize_window(window: tauri::Window) {
    if let Ok(is_max) = window.is_maximized() {
        if is_max {
            let _ = window.unmaximize();
        } else {
            let _ = window.maximize();
        }
    }
}

#[tauri::command]
fn close_window(window: tauri::Window) {
    let _ = window.close();
}

#[tauri::command]
fn open_local_path(path: String) {
    #[cfg(target_os = "windows")]
    {
        let _ = std::process::Command::new("explorer.exe").arg(&path).spawn();
    }
    #[cfg(target_os = "macos")]
    {
        let _ = std::process::Command::new("open").arg(&path).spawn();
    }
    #[cfg(target_os = "linux")]
    {
        let _ = std::process::Command::new("xdg-open").arg(&path).spawn();
    }
}

#[tauri::command]
fn open_external_url(url: String) {
    #[cfg(target_os = "windows")]
    {
        let _ = std::process::Command::new("cmd")
            .args(["/C", "start", "", &url])
            .spawn();
    }
    #[cfg(target_os = "macos")]
    {
        let _ = std::process::Command::new("open").arg(&url).spawn();
    }
    #[cfg(target_os = "linux")]
    {
        let _ = std::process::Command::new("xdg-open").arg(&url).spawn();
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(EngineState::default())
        .invoke_handler(tauri::generate_handler![
            send_rpc_command,
            sync_provider_keys,
            get_saved_auth_keys,
            test_provider_key,
            start_drag_window,
            minimize_window,
            toggle_maximize_window,
            close_window,
            open_local_path,
            open_external_url,
            list_workspace_entries,
            read_workspace_file,
            write_workspace_file,
            execute_shell_command
        ])
        .setup(|app| {
            if let Some(main_window) = app.get_webview_window("main") {
                let _ = main_window.show();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running rho lota application");
}
