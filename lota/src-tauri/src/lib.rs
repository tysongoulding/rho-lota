use rho_harness_core::rpc::protocol::{RpcRequest, RpcResponse};
use tauri::Manager;

#[tauri::command]
async fn send_rpc_command(request: RpcRequest, _app_handle: tauri::AppHandle) -> Result<RpcResponse, String> {
    let req_id = request.id.clone();
    let cmd_name = match &request.command {
        rho_harness_core::rpc::protocol::RpcCommand::Prompt { .. } => "prompt",
        rho_harness_core::rpc::protocol::RpcCommand::Steer { .. } => "steer",
        rho_harness_core::rpc::protocol::RpcCommand::Abort => "abort",
        rho_harness_core::rpc::protocol::RpcCommand::ToolResponse { .. } => "tool_response",
        rho_harness_core::rpc::protocol::RpcCommand::Compact { .. } => "compact",
        rho_harness_core::rpc::protocol::RpcCommand::SetModel { .. } => "set_model",
        rho_harness_core::rpc::protocol::RpcCommand::GetState => "get_state",
        rho_harness_core::rpc::protocol::RpcCommand::Exit => "exit",
    };

    Ok(RpcResponse::success(req_id, cmd_name, None))
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
        let _ = std::process::Command::new("cmd").args(["/C", "start", "", &url]).spawn();
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
        .invoke_handler(tauri::generate_handler![
            send_rpc_command,
            start_drag_window,
            minimize_window,
            toggle_maximize_window,
            close_window,
            open_local_path,
            open_external_url
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
