import { useState } from "react";
import {
  Calendar,
  Mail,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Video,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useSessionStore } from "../../store/sessionStore";
import { useRhoEngine } from "../../hooks/useRhoEngine";

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
  attendeesCount: number;
  category: "work" | "review" | "standup" | "personal";
}

export interface EmailItem {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  receivedAt: string;
  urgency: "high" | "medium" | "low";
  isUnread: boolean;
}

const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Engineering Architecture & Rust Engine Sync",
    startTime: "09:30 AM",
    endTime: "10:15 AM",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    attendeesCount: 4,
    category: "work",
  },
  {
    id: "evt-2",
    title: "Lota Studio UI/UX & Red-Green Verification Review",
    startTime: "11:00 AM",
    endTime: "11:45 AM",
    meetingLink: "https://meet.google.com/xyz-uvwx-rst",
    attendeesCount: 3,
    category: "review",
  },
  {
    id: "evt-3",
    title: "Weekly Release Sprint Retrospective",
    startTime: "02:00 PM",
    endTime: "02:30 PM",
    attendeesCount: 6,
    category: "standup",
  },
];

const DEFAULT_EMAILS: EmailItem[] = [
  {
    id: "mail-1",
    sender: "Sara Lindqvist",
    senderEmail: "sara@ember.team",
    subject: "PR #12: Claude plugin schema sync & verification ready",
    preview: "Hey Tyson, the latest plugin changes have passed all unit tests and are ready for your review...",
    receivedAt: "8:15 AM",
    urgency: "high",
    isUnread: true,
  },
  {
    id: "mail-2",
    sender: "Google Cloud Billing",
    senderEmail: "no-reply@cloud.google.com",
    subject: "Monthly Gemini API usage forecast within normal threshold",
    preview: "Your Gemini Pro and Flash model usage for this billing cycle is currently at 14% of budget...",
    receivedAt: "7:45 AM",
    urgency: "medium",
    isUnread: true,
  },
  {
    id: "mail-3",
    sender: "GitHub Notifications",
    senderEmail: "notifications@github.com",
    subject: "[rho-lota] New pull request: Tauri 2.0 window protocol",
    preview: "Branch feature/wire-up has passed all automated Playwright test suites (6/6 passing)...",
    receivedAt: "6:30 AM",
    urgency: "low",
    isUnread: false,
  },
];

export function MorningReportWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "calendar" | "email">("all");
  const [events] = useState<CalendarEvent[]>(DEFAULT_EVENTS);
  const [emails] = useState<EmailItem[]>(DEFAULT_EMAILS);

  const { addUserMessage } = useSessionStore();
  const { prompt } = useRhoEngine();

  const handleSynthesizeBriefing = async () => {
    const promptText =
      "Synthesize my daily morning report: summarize today's calendar meetings, highlight urgent action items from unread emails, and outline my top 3 recommended focus areas for today.";
    addUserMessage(promptText);
    await prompt(promptText);
  };

  const unreadCount = emails.filter((e) => e.isUnread).length;

  return (
    <div className="w-full max-w-3xl bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl transition-all duration-200">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between cursor-pointer hover:bg-[#21262d] transition select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white text-xs">Morning Briefing</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-[#58a6ff] border border-blue-500/30 font-medium">
              {events.length} Meetings Today
            </span>
            {unreadCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
                {unreadCount} Unread Emails
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSynthesizeBriefing();
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-[11px] font-medium shadow transition"
            title="Ask agent to generate a synthesized daily plan"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Synthesize Briefing</span>
          </button>

          <div className="text-[#8b949e] p-1 rounded hover:bg-[#30363d]">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-4 space-y-4 animate-in fade-in duration-150">
          {/* Subtabs */}
          <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
            <div className="flex space-x-1">
              {(
                [
                  { id: "all", label: "Overview" },
                  { id: "calendar", label: `Schedule (${events.length})` },
                  { id: "email", label: `Inbox (${unreadCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    activeTab === tab.id
                      ? "bg-[#21262d] text-white border border-[#30363d]"
                      : "text-[#8b949e] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-[#8b949e]">
              Connected via Google Workspace / Outlook MCP
            </span>
          </div>

          {/* Grid Layout: Calendar & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Today's Schedule */}
            {(activeTab === "all" || activeTab === "calendar") && (
              <div className={`space-y-2.5 ${activeTab === "calendar" ? "md:col-span-2" : ""}`}>
                <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Today's Schedule</span>
                </div>

                <div className="space-y-2">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl hover:border-[#8b949e] transition flex items-center justify-between"
                    >
                      <div className="space-y-1 truncate mr-2">
                        <div className="text-xs font-medium text-white truncate flex items-center space-x-1.5">
                          <span>{evt.title}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-[#8b949e]">
                          <span className="flex items-center space-x-1 text-blue-400 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>
                              {evt.startTime} – {evt.endTime}
                            </span>
                          </span>
                          <span>•</span>
                          <span>{evt.attendeesCount} attendees</span>
                        </div>
                      </div>

                      {evt.meetingLink && (
                        <a
                          href={evt.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1 px-2 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[10px] font-medium transition flex-shrink-0"
                        >
                          <Video className="w-3 h-3" />
                          <span>Join</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Right: Priority Email Inbox */}
            {(activeTab === "all" || activeTab === "email") && (
              <div className={`space-y-2.5 ${activeTab === "email" ? "md:col-span-2" : ""}`}>
                <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Priority Inbox</span>
                </div>

                <div className="space-y-2">
                  {emails.map((mail) => (
                    <div
                      key={mail.id}
                      className={`p-2.5 bg-[#0d1117] border rounded-xl hover:border-[#8b949e] transition space-y-1 ${
                        mail.isUnread ? "border-amber-500/40 bg-amber-950/10" : "border-[#30363d]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 truncate">
                          {mail.isUnread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                          )}
                          <span className="font-semibold text-white text-xs truncate">
                            {mail.sender}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8b949e] flex-shrink-0 font-mono">
                          {mail.receivedAt}
                        </span>
                      </div>

                      <div className="text-[11px] font-medium text-[#c9d1d9] truncate">
                        {mail.subject}
                      </div>

                      <p className="text-[10px] text-[#8b949e] line-clamp-1">
                        {mail.preview}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
