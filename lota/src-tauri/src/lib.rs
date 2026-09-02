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

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![send_rpc_command])
        .setup(|app| {
            if let Some(main_window) = app.get_webview_window("main") {
                let _ = main_window.show();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running rho lota application");
}
