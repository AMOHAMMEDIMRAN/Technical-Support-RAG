import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/presentation/stores/authStore";

// ── Types ────────────────────────────────────────────────
interface ChatItem {
  id: string;
  title: string;
  timestamp: string;
}

interface Project {
  id: string;
  name: string;
  color: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ── Mock data ─────────────────────────────────────────────
const MOCK_CHATS: ChatItem[] = [
  { id: "1", title: "Onboarding workflow help", timestamp: "Today" },
  { id: "2", title: "Q3 report analysis", timestamp: "Today" },
  { id: "3", title: "Bug in auth middleware", timestamp: "Yesterday" },
  { id: "4", title: "Salary structure review", timestamp: "Yesterday" },
  { id: "5", title: "Marketing campaign copy", timestamp: "Mon" },
  { id: "6", title: "Database optimisation", timestamp: "Sun" },
];

const MOCK_PROJECTS: Project[] = [
  { id: "p1", name: "Product Roadmap", color: "bg-violet-500" },
  { id: "p2", name: "HR Automation", color: "bg-amber-500" },
  { id: "p3", name: "Dev Infra", color: "bg-sky-500" },
];

// ── Sub-components ────────────────────────────────────────

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const PlusIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9l20-7z" />
  </svg>
);

const LogOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

// ── Main component ────────────────────────────────────────
const ChatPanel = () => {
  const { user, logout } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>("1");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", role: "assistant", content: "Hi there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  // Close modal on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowUserModal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "I'm Kelo, your AI assistant. This is a placeholder response — the full AI integration is coming soon!",
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setActiveChat(null);
    setMessages([{ id: "new", role: "assistant", content: "New conversation started. What's on your mind?" }]);
  };

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    const colors = ["bg-emerald-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"];
    setProjects((p) => [
      ...p,
      { id: Date.now().toString(), name: newProjectName.trim(), color: colors[p.length % colors.length] },
    ]);
    setNewProjectName("");
    setShowNewProject(false);
  };

  const filteredChats = MOCK_CHATS.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped = filteredChats.reduce<Record<string, ChatItem[]>>((acc, c) => {
    acc[c.timestamp] = [...(acc[c.timestamp] || []), c];
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 flex flex-col border-r border-border bg-card">

        {/* Logo + New Chat */}
        <div className="px-3 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 px-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <SparkleIcon />
            </div>
            <span className="text-sm font-semibold tracking-tight">Kelo Chat</span>
          </div>
          <button
            onClick={handleNewChat}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="New chat"
          >
            <PlusIcon />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
              <SearchIcon />
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats…"
              className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
        </div>

        {/* Projects */}
        <div className="px-3 pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-1">Projects</p>
            <button
              onClick={() => setShowNewProject((v) => !v)}
              className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="New project"
            >
              <PlusIcon size={12} />
            </button>
          </div>

          {showNewProject && (
            <div className="flex gap-1.5 mb-2">
              <input
                autoFocus
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
                placeholder="Project name…"
                className="flex-1 min-w-0 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
              <button
                onClick={handleAddProject}
                className="rounded-lg bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            </div>
          )}

          <div className="space-y-0.5 mb-1">
            {projects.map((p) => (
              <button
                key={p.id}
                className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-left"
              >
                <span className={`h-2 w-2 rounded-full shrink-0 ${p.color}`} />
                <span className="truncate text-xs">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-3 my-2 border-t border-border" />

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-3 scrollbar-thin">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-1 mb-1">History</p>

          {Object.entries(grouped).map(([timestamp, chats]) => (
            <div key={timestamp}>
              <p className="text-[10px] text-muted-foreground/60 px-2 py-1">{timestamp}</p>
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors group ${
                    activeChat === chat.id
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <span className="shrink-0 text-muted-foreground/50">
                    <ChatBubbleIcon />
                  </span>
                  <span className="truncate text-xs">{chat.title}</span>
                </button>
              ))}
            </div>
          ))}

          {filteredChats.length === 0 && (
            <p className="text-xs text-muted-foreground/50 px-2 py-4 text-center">No chats found</p>
          )}
        </div>

        {/* ── User row ── */}
        <div className="relative px-3 pb-4 pt-2 border-t border-border" ref={modalRef}>

          {/* User modal */}
          {showUserModal && (
            <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <div className="p-1">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium capitalize">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_1px_rgba(16,185,129,0.5)]" />
                    {user?.status}
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg">
                  <span className="text-xs text-muted-foreground">Role</span>
                  <span className="text-xs font-medium capitalize">{user?.role}</span>
                </div>
              </div>
              <div className="p-1 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOutIcon />
                  Sign out
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowUserModal((v) => !v)}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
              showUserModal ? "bg-accent" : "hover:bg-accent"
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {initials || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground/50">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SparkleIcon />
          </div>
          <div>
            <p className="text-sm font-semibold">Kelo AI</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_1px_rgba(16,185,129,0.5)]" />
              Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {msg.role === "user" ? (initials || "U") : "AI"}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-card border border-border text-foreground rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="px-6 pb-6 pt-3 shrink-0">
          <div className="relative flex items-end gap-3 rounded-2xl border border-border bg-card px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Kelo…"
              rows={1}
              style={{ resize: "none" }}
              className="flex-1 min-w-0 bg-transparent text-sm placeholder:text-muted-foreground/40 focus:outline-none max-h-36 overflow-y-auto"
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = `${t.scrollHeight}px`;
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <SendIcon />
            </button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/40 mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;