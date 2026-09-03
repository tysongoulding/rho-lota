use rho_harness_core::rpc::protocol::{RpcCommand, RpcEvent, RpcRequest, RpcResponse};
use serde_json::json;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;
use tauri::Emitter;
use tokio::sync::Mutex;

#[derive(Clone)]
pub struct EngineState {
    pub session_id: Arc<Mutex<String>>,
    pub active_model: Arc<Mutex<String>>,
    pub active_provider: Arc<Mutex<String>>,
    pub is_running: Arc<AtomicBool>,
    pub abort_flag: Arc<AtomicBool>,
}

impl Default for EngineState {
    fn default() -> Self {
        Self {
            session_id: Arc::new(Mutex::new(format!(
                "sess_{}",
                std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_millis()
            ))),
            active_model: Arc::new(Mutex::new("claude-3-7-sonnet".to_string())),
            active_provider: Arc::new(Mutex::new("anthropic".to_string())),
            is_running: Arc::new(AtomicBool::new(false)),
            abort_flag: Arc::new(AtomicBool::new(false)),
        }
    }
}

pub async fn handle_rpc_command(
    request: RpcRequest,
    app_handle: tauri::AppHandle,
    state: EngineState,
) -> Result<RpcResponse, String> {
    let req_id = request.id.clone();

    match request.command {
        RpcCommand::Prompt { message, .. } => {
            let session_id = state.session_id.lock().await.clone();
            let model = state.active_model.lock().await.clone();
            let provider = state.active_provider.lock().await.clone();

            state.is_running.store(true, Ordering::SeqCst);
            state.abort_flag.store(false, Ordering::SeqCst);

            let app = app_handle.clone();
            let is_running_clone = state.is_running.clone();
            let abort_clone = state.abort_flag.clone();

            // Spawn streaming event generator
            tokio::spawn(async move {
                // 1. Session Start Event
                let _ = app.emit(
                    "rho://event",
                    RpcEvent::SessionStart {
                        session_id: session_id.clone(),
                        model: model.clone(),
                        provider: provider.clone(),
                    },
                );

                // 2. Turn Start Event
                let _ = app.emit(
                    "rho://event",
                    RpcEvent::TurnStart {
                        turn_number: 1,
                        prompt: message.clone(),
                    },
                );

                // 3. Simulated/Streamed Reasoning Chunks
                let reasoning_steps = [
                    "Analyzing query context and workspace environment...\n",
                    "Validating AST token constraints and TDD test requirements...\n",
                    "Formulating solution with zero placeholders and compiling clean code...\n",
                ];

                for step in reasoning_steps {
                    if abort_clone.load(Ordering::SeqCst) {
                        break;
                    }
                    tokio::time::sleep(Duration::from_millis(180)).await;
                    let _ = app.emit(
                        "rho://event",
                        RpcEvent::ReasoningChunk {
                            content: step.to_string(),
                        },
                    );
                }

                // 4. Stream Response Text in chunks
                let response_text = format!(
                    "Understood. Executed directive for: **`{}`**\n\n- Model backend: `{}` (`{}`)\n- Engine status: **Tokio FSM Online**\n- Workspace state: Clean\n",
                    message, model, provider
                );

                let words: Vec<&str> = response_text.split_inclusive(' ').collect();
                for word in words {
                    if abort_clone.load(Ordering::SeqCst) {
                        break;
                    }
                    tokio::time::sleep(Duration::from_millis(35)).await;
                    let _ = app.emit(
                        "rho://event",
                        RpcEvent::TextChunk {
                            content: word.to_string(),
                        },
                    );
                }

                // 5. Usage Telemetry Update
                let _ = app.emit(
                    "rho://event",
                    RpcEvent::UsageUpdate {
                        input_tokens: Some(420),
                        output_tokens: Some(185),
                        context_percent: Some(12.4),
                    },
                );

                // 6. Turn End Event
                let stop_reason = if abort_clone.load(Ordering::SeqCst) {
                    "aborted"
                } else {
                    "end_turn"
                };

                let _ = app.emit(
                    "rho://event",
                    RpcEvent::TurnEnd {
                        stop_reason: stop_reason.to_string(),
                    },
                );

                is_running_clone.store(false, Ordering::SeqCst);
            });

            Ok(RpcResponse::success(
                req_id,
                "prompt",
                Some(json!({ "status": "streaming_started" })),
            ))
        }

        RpcCommand::Abort => {
            state.abort_flag.store(true, Ordering::SeqCst);
            state.is_running.store(false, Ordering::SeqCst);

            let _ = app_handle.emit(
                "rho://event",
                RpcEvent::TurnEnd {
                    stop_reason: "aborted".to_string(),
                },
            );

            Ok(RpcResponse::success(
                req_id,
                "abort",
                Some(json!({ "status": "aborted" })),
            ))
        }

        RpcCommand::Steer { message } => {
            let _ = app_handle.emit(
                "rho://event",
                RpcEvent::TextChunk {
                    content: format!("\n\n> *Steered direction: {}*\n\n", message),
                },
            );
            Ok(RpcResponse::success(req_id, "steer", Some(json!({ "steered": true }))))
        }

        RpcCommand::ToolResponse { approval_id, decision } => {
            let _ = app_handle.emit(
                "rho://event",
                RpcEvent::ToolCallResult {
                    call_id: approval_id.clone(),
                    tool: "tool_dispatch".to_string(),
                    output: format!("Tool approval decision: {}", decision),
                    is_error: decision == "deny",
                    duration_ms: 120,
                },
            );

            Ok(RpcResponse::success(
                req_id,
                "tool_response",
                Some(json!({ "approval_id": approval_id, "decision": decision })),
            ))
        }

        RpcCommand::Compact { instructions } => {
            let _ = app_handle.emit(
                "rho://event",
                RpcEvent::UsageUpdate {
                    input_tokens: Some(150),
                    output_tokens: Some(50),
                    context_percent: Some(4.8),
                },
            );

            Ok(RpcResponse::success(
                req_id,
                "compact",
                Some(json!({
                    "compacted": true,
                    "instructions": instructions,
                    "new_context_percent": 4.8
                })),
            ))
        }

        RpcCommand::SetModel { model, provider } => {
            *state.active_model.lock().await = model.clone();
            if let Some(p) = provider {
                *state.active_provider.lock().await = p;
            }

            Ok(RpcResponse::success(
                req_id,
                "set_model",
                Some(json!({ "model": model })),
            ))
        }

        RpcCommand::GetState => {
            let session_id = state.session_id.lock().await.clone();
            let model = state.active_model.lock().await.clone();
            let provider = state.active_provider.lock().await.clone();
            let is_running = state.is_running.load(Ordering::SeqCst);

            Ok(RpcResponse::success(
                req_id,
                "get_state",
                Some(json!({
                    "session_id": session_id,
                    "model": model,
                    "provider": provider,
                    "is_running": is_running
                })),
            ))
        }

        RpcCommand::Exit => Ok(RpcResponse::success(req_id, "exit", None)),
    }
}
