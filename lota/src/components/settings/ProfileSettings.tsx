import { useState, useEffect } from "react";
import { User, Mail, Briefcase, FileText, Check, ShieldCheck, Sparkles, GitCommit } from "lucide-react";
import { useToastStore } from "../../store/toastStore";
import { scheduleSaveSettingsToDisk } from "../../lib/settingsSync";

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  bio: string;
  customInstructions: string;
}

const STORAGE_KEY = "rho-lota-profile";

export function loadProfileFromStorage(): UserProfile {
  if (typeof window === "undefined") {
    return {
      name: "Developer",
      email: "developer@local",
      role: "Software Engineer",
      bio: "Building intelligent agents with Rho & Lota.",
      customInstructions: "Prefer concise explanations and clean, modular code.",
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    name: "Developer",
    email: "developer@local",
    role: "Software Engineer",
    bio: "Building intelligent agents with Rho & Lota.",
    customInstructions: "Prefer concise explanations and clean, modular code.",
  };
}

export function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile>(loadProfileFromStorage);
  const [saved, setSaved] = useState(false);
  const { addToast } = useToastStore();

  useEffect(() => {
    const current = loadProfileFromStorage();
    setProfile(current);
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      scheduleSaveSettingsToDisk();
      setSaved(true);
      addToast({
        title: "Profile Saved",
        description: "Your developer profile and custom instructions have been updated.",
        type: "success",
      });
      setTimeout(() => setSaved(false), 2000);
    } catch {
      addToast({
        title: "Save Failed",
        description: "Could not persist profile changes to disk.",
        type: "error",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "DEV";
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl mx-auto text-xs text-[#c9d1d9]">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-1 flex items-center space-x-2">
          <User className="w-4 h-4 text-[#58a6ff]" />
          <span>User Profile & Developer Identity</span>
        </h2>
        <p className="text-[#8b949e]">
          Manage your personal developer profile, git identity, and custom agent instructions.
        </p>
      </div>

      {/* Identity Card */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-5">
        <div className="flex items-center space-x-4 pb-4 border-b border-[#30363d]">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
            {getInitials(profile.name)}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <span>{profile.name || "Anonymous Developer"}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Local Profile</span>
              </span>
            </h3>
            <p className="text-[#8b949e] text-[11px]">{profile.role || "Developer"}</p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              <span>Full Name / Display Name</span>
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="e.g. Tyson Goulding"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white focus:border-[#58a6ff] outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="e.g. tyson@example.com"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white focus:border-[#58a6ff] outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Developer Role / Title</span>
            </label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              placeholder="e.g. Principal Systems Architect"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white focus:border-[#58a6ff] outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">
              <GitCommit className="w-3.5 h-3.5" />
              <span>Bio / Status</span>
            </label>
            <input
              type="text"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="e.g. Building agentic workflows"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white focus:border-[#58a6ff] outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Custom Agent Instructions */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Custom Instructions for AI Agents</span>
          </label>
          <span className="text-[10px] text-[#8b949e]">Injected into conversational preambles</span>
        </div>
        <p className="text-[11px] text-[#8b949e]">
          Specify rules, stylistic preferences, or constraints that all agents should adhere to when responding to your prompts.
        </p>
        <textarea
          rows={4}
          value={profile.customInstructions}
          onChange={(e) => setProfile({ ...profile, customInstructions: e.target.value })}
          placeholder="e.g. Always write production-ready code with complete error handling. Favor Rust and TypeScript..."
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-white focus:border-[#58a6ff] outline-none transition font-mono text-xs resize-none"
        />
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className={`flex items-center space-x-2 px-5 py-2 rounded-lg font-medium transition shadow-sm ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-[#1f6feb] hover:bg-blue-600 text-white"
          }`}
        >
          {saved ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          <span>{saved ? "Saved to Settings" : "Save Profile"}</span>
        </button>
      </div>
    </div>
  );
}
