use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkspaceEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: Option<u64>,
    pub children: Option<Vec<WorkspaceEntry>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShellCommandOutput {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: Option<i32>,
    pub success: bool,
}

#[tauri::command]
pub fn list_workspace_entries(base_path: String) -> Result<Vec<WorkspaceEntry>, String> {
    let root = Path::new(&base_path);
    if !root.exists() {
        return Err(format!("Directory does not exist: {}", base_path));
    }

    read_dir_recursive(root, 0, 3)
}

fn read_dir_recursive(dir: &Path, depth: usize, max_depth: usize) -> Result<Vec<WorkspaceEntry>, String> {
    if depth > max_depth {
        return Ok(Vec::new());
    }

    let read_dir = fs::read_dir(dir).map_err(|e| e.to_string())?;
    let mut entries = Vec::new();

    for entry_result in read_dir {
        if let Ok(entry) = entry_result {
            let path = entry.path();
            let file_name = entry.file_name().to_string_lossy().to_string();

            // Skip hidden directories like .git, node_modules, target
            if file_name == ".git"
                || file_name == "node_modules"
                || file_name == "target"
                || file_name.starts_with(".system_generated")
            {
                continue;
            }

            let is_dir = path.is_dir();
            let size = if is_dir {
                None
            } else {
                entry.metadata().ok().map(|m| m.len())
            };

            let children = if is_dir && depth < max_depth {
                Some(read_dir_recursive(&path, depth + 1, max_depth).unwrap_or_default())
            } else if is_dir {
                Some(Vec::new())
            } else {
                None
            };

            entries.push(WorkspaceEntry {
                name: file_name,
                path: path.to_string_lossy().to_string(),
                is_dir,
                size,
                children,
            });
        }
    }

    // Sort folders first, then alphabetically
    entries.sort_by(|a, b| match (a.is_dir, b.is_dir) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    });

    Ok(entries)
}

#[tauri::command]
pub fn read_workspace_file(file_path: String) -> Result<String, String> {
    let path = PathBuf::from(&file_path);
    if !path.exists() {
        return Err(format!("File not found: {}", file_path));
    }
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn write_workspace_file(file_path: String, content: String) -> Result<(), String> {
    let path = PathBuf::from(&file_path);
    if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn execute_shell_command(cwd: String, command: String) -> Result<ShellCommandOutput, String> {
    let working_dir = PathBuf::from(&cwd);

    #[cfg(target_os = "windows")]
    let mut cmd = std::process::Command::new("powershell");
    #[cfg(target_os = "windows")]
    cmd.args(["-NoProfile", "-Command", &command]);

    #[cfg(not(target_os = "windows"))]
    let mut cmd = std::process::Command::new("sh");
    #[cfg(not(target_os = "windows"))]
    cmd.args(["-c", &command]);

    if working_dir.exists() {
        cmd.current_dir(working_dir);
    }

    let output = cmd.output().map_err(|e| e.to_string())?;

    Ok(ShellCommandOutput {
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
        exit_code: output.status.code(),
        success: output.status.success(),
    })
}
