import { useState, useRef, useEffect, useMemo } from "react";
import { useAuthStore } from "@/presentation/stores/authStore";
import { chatService } from "@/infrastructure/api/chat.service";
import type { Chat, Message } from "@/core/domain/types";
import { useNavigate } from "@tanstack/react-router";
import { ModeToggle } from "@/presentation/components/theme/mode-toggle";

interface Project {
  id: string;
  name: string;
  color: string;
}
const MOCK_PROJECTS: Project[] = [
  { id: "p1", name: "Product Roadmap", color: "bg-violet-500" },
  { id: "p2", name: "HR Automation", color: "bg-amber-500" },
  { id: "p3", name: "Dev Infra", color: "bg-sky-500" },
];

type ChatMessage = Message & { _id?: string };

const ChatPanel = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [copiedMessageKey, setCopiedMessageKey] = useState<string | null>(null);
  const [pinnedChatIds, setPinnedChatIds] = useState<string[]>([]);
  const [showTimestamps, setShowTimestamps] = useState(true);

  const modalRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const pinnedStorageKey = `kelo-pinned-chats-${user?.id ?? "guest"}`;
  const draftStorageKey = `kelo-chat-draft-${activeChat || "new"}-${user?.id ?? "guest"}`;

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const loadChats = async (opts?: { selectFirst?: boolean }) => {
    setLoadingChats(true);
    setError(null);
    try {
      const { data } = await chatService.listChats({
        sortBy: "updatedAt",
        sortOrder: "desc",
        limit: 50,
      });
      setChats(data);
      if (opts?.selectFirst && data.length > 0)
        await handleSelectChat(data[0]._id);
    } catch {
      setError("Unable to load chat history.");
    } finally {
      setLoadingChats(false);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    setActiveChat(chatId);
    setLoadingMessages(true);
    setError(null);
    try {
      const chat = await chatService.getChat(chatId);
      setMessages(chat.messages ?? []);
    } catch {
      setError("Unable to load this conversation.");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        setShowUserModal(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    loadChats({ selectFirst: true });
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const stored = localStorage.getItem(pinnedStorageKey);
    if (!stored) {
      setPinnedChatIds([]);
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setPinnedChatIds(parsed.filter((id) => typeof id === "string"));
      }
    } catch {
      setPinnedChatIds([]);
    }
  }, [pinnedStorageKey]);

  useEffect(() => {
    localStorage.setItem(pinnedStorageKey, JSON.stringify(pinnedChatIds));
  }, [pinnedChatIds, pinnedStorageKey]);

  useEffect(() => {
    const stored = localStorage.getItem(draftStorageKey);
    if (stored !== null) {
      setInput(stored);
    } else {
      setInput("");
    }
  }, [draftStorageKey]);

  useEffect(() => {
    if (input.trim()) {
      localStorage.setItem(draftStorageKey, input);
    } else {
      localStorage.removeItem(draftStorageKey);
    }
  }, [draftStorageKey, input]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const content = input.trim();
    setInput("");
    setIsSending(true);
    setError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    try {
      if (!activeChat) {
        const newChat = await chatService.createChat({
          title: content.slice(0, 60) || "New conversation",
          message: content,
        });
        setChats((prev) => [newChat, ...prev]);
        setActiveChat(newChat._id);
        setMessages(newChat.messages ?? []);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "user", content, timestamp: new Date().toISOString() },
        ]);
        const updated = await chatService.sendMessage(activeChat, content);
        setMessages(updated.messages ?? []);
        setChats((prev) => {
          const f = prev.filter((c) => c._id !== updated._id);
          return [updated, ...f];
        });
      }
    } catch {
      setError("Unable to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setActiveChat(null);
    setMessages([]);
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!window.confirm("Delete this chat?")) return;
    setDeletingId(chatId);
    setError(null);
    try {
      await chatService.deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChat === chatId) {
        setActiveChat(null);
        setMessages([]);
      }
    } catch {
      setError("Unable to delete chat.");
    } finally {
      setDeletingId(null);
    }
  };

  const startRenameChat = (chat: Chat) => {
    setRenamingChatId(chat._id);
    setRenameValue(chat.title);
  };

  const submitRenameChat = async () => {
    if (!renamingChatId) return;
    const nextTitle = renameValue.trim();
    if (!nextTitle) {
      setError("Chat title cannot be empty.");
      return;
    }

    setError(null);
    try {
      const updated = await chatService.updateChat(renamingChatId, {
        title: nextTitle,
      });
      setChats((prev) =>
        prev.map((chat) => (chat._id === updated._id ? updated : chat)),
      );
      if (activeChat === updated._id) {
        setMessages(updated.messages ?? messages);
      }
      setRenamingChatId(null);
      setRenameValue("");
    } catch {
      setError("Unable to rename chat.");
    }
  };

  const handleExportActiveChat = () => {
    if (!activeChat) return;
    const current = chats.find((chat) => chat._id === activeChat);
    if (!current) return;

    const transcript = (current.messages ?? messages)
      .map((msg) => {
        const stamp = new Date(msg.timestamp).toLocaleString();
        const role = msg.role.toUpperCase();
        return `[${stamp}] ${role}: ${msg.content}`;
      })
      .join("\n\n");

    const safeTitle = current.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeTitle || "chat"}-transcript.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopyMessage = async (key: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageKey(key);
      window.setTimeout(() => setCopiedMessageKey(null), 1600);
    } catch {
      setError("Unable to copy message.");
    }
  };

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    const colors = [
      "bg-emerald-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
    ];
    setProjects((p) => [
      ...p,
      {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        color: colors[p.length % colors.length],
      },
    ]);
    setNewProjectName("");
    setShowNewProject(false);
  };

  const togglePinChat = (chatId: string) => {
    setPinnedChatIds((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [chatId, ...prev],
    );
  };

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedFilteredChats = useMemo(() => {
    return [...filteredChats].sort((a, b) => {
      const aPinned = pinnedChatIds.includes(a._id) ? 1 : 0;
      const bPinned = pinnedChatIds.includes(b._id) ? 1 : 0;

      if (aPinned !== bPinned) {
        return bPinned - aPinned;
      }

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [filteredChats, pinnedChatIds]);

  const activeTitle = activeChat
    ? chats.find((c) => c._id === activeChat)?.title || "Conversation"
    : "New Conversation";

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* ── Sidebar ── */}
      {!isSidebarCollapsed && (
        <aside className="w-65 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_10px_1px_color-mix(in_srgb,var(--primary)_35%,transparent)]">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <span className="text-[13px] font-bold tracking-tight">
                Kelo Chat
              </span>
            </div>
            <button
              onClick={handleNewChat}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-sidebar-border text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
              title="New chat"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pb-2">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats... (Ctrl/Cmd+K)"
                className="w-full rounded-xl border border-sidebar-border bg-background/60 pl-8 pr-3 py-2 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
          </div>

          {/* Projects */}
          <div className="px-3 pt-2">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50">
                Projects
              </p>
              <button
                onClick={() => setShowNewProject((v) => !v)}
                className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
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
                  className="flex-1 rounded-lg border border-sidebar-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={handleAddProject}
                  className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Add
                </button>
              </div>
            )}

            <div className="space-y-0.5 mb-1">
              {projects.map((p) => (
                <button
                  key={p.id}
                  className="w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors text-left"
                >
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${p.color}`}
                  />
                  <span className="truncate font-medium">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mx-3 my-2 border-t border-sidebar-border" />

          {/* Chat history */}
          <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50 px-1 mb-2">
              History
            </p>

            {loadingChats && (
              <div className="space-y-2 px-1 py-2">
                {[70, 55, 80].map((w, i) => (
                  <div
                    key={i}
                    className={`h-3 rounded bg-muted animate-pulse`}
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            )}

            {!loadingChats &&
              sortedFilteredChats.map((chat) => (
                <div
                  key={chat._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectChat(chat._id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectChat(chat._id);
                    }
                  }}
                  className={`group w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all outline-none ${
                    activeChat === chat._id
                      ? "bg-primary/10 text-foreground border border-primary/15"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  }`}
                >
                  <svg
                    className="shrink-0 w-3.5 h-3.5 opacity-50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    {renamingChatId === chat._id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            submitRenameChat();
                          }
                          if (e.key === "Escape") {
                            e.preventDefault();
                            e.stopPropagation();
                            setRenamingChatId(null);
                            setRenameValue("");
                          }
                        }}
                        onBlur={() => {
                          if (renameValue.trim()) {
                            void submitRenameChat();
                          } else {
                            setRenamingChatId(null);
                            setRenameValue("");
                          }
                        }}
                        className="w-full rounded-md border border-primary/30 bg-background/80 px-2 py-1 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <p className="truncate text-[11px] font-semibold">
                        {chat.title}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground/60">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-amber-500 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinChat(chat._id);
                    }}
                    title={
                      pinnedChatIds.includes(chat._id)
                        ? "Unpin chat"
                        : "Pin chat"
                    }
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill={
                        pinnedChatIds.includes(chat._id)
                          ? "currentColor"
                          : "none"
                      }
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 17l-5 5v-7H4l4-9h8l4 9h-3v7z" />
                    </svg>
                  </button>
                  <button
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-primary transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      startRenameChat(chat);
                    }}
                    title="Rename chat"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </button>
                  <button
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-destructive transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat._id);
                    }}
                    disabled={deletingId === chat._id}
                  >
                    {deletingId === chat._id ? (
                      <svg
                        className="animate-spin w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}

            {!loadingChats && sortedFilteredChats.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <svg
                  className="w-8 h-8 text-muted-foreground/25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p className="text-xs text-muted-foreground/50">No chats yet</p>
              </div>
            )}
          </div>

          {/* User area */}
          <div
            className="relative border-t border-sidebar-border p-3"
            ref={modalRef}
          >
            {showUserModal && (
              <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-sidebar-border bg-sidebar shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-sidebar-border">
                  <p className="text-sm font-semibold">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg">
                    <span className="text-xs text-muted-foreground">
                      Status
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold capitalize">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {user?.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg">
                    <span className="text-xs text-muted-foreground">Role</span>
                    <span className="text-xs font-semibold capitalize">
                      {user?.role?.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="p-1.5 border-t border-sidebar-border">
                  <button
                    onClick={() => {
                      setShowUserModal(false);
                      navigate({ to: "/dashboard" });
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowUserModal((v) => !v)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${showUserModal ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"}`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                {initials || "U"}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <svg
                className="shrink-0 text-muted-foreground/40"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
          </div>
        </aside>
      )}

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-6 py-3.5 border-b border-border/60 bg-background/80 backdrop-blur-xl shrink-0">
          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            aria-pressed={isSidebarCollapsed}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            )}
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold leading-tight">{activeTitle}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kelo AI · Online
            </p>
          </div>
          {activeChat && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTimestamps((prev) => !prev)}
                className="h-8 px-3 rounded-lg border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {showTimestamps ? "Hide time" : "Show time"}
              </button>
              
              <button
                onClick={handleExportActiveChat}
                className="h-8 px-3 rounded-lg border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
              <button
                onClick={handleNewChat}
                className="h-8 px-3 rounded-lg border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New chat
              </button>
              <button>
                <ModeToggle/>
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mx-6 mt-3 flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/20 text-destructive text-xs font-medium">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loadingMessages && (
            <div className="space-y-4">
              {[50, 75, 60].map((w, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
                  <div
                    className={`h-10 rounded-xl bg-muted animate-pulse`}
                    style={{ width: `${w}%` }}
                  />
                </div>
              ))}
            </div>
          )}

          {!loadingMessages && messages.length === 0 && !isSending && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-16">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg
                  className="text-primary"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold">Ask Kelo anything</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Get instant answers from your company's knowledge base.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {[
                  "What's the PTO policy?",
                  "How do I request access?",
                  "Explain the onboarding process",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-3.5 py-2 rounded-xl border border-border/70 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loadingMessages &&
            messages.map((msg, idx) => {
              const messageKey =
                msg._id || msg.timestamp || `${msg.role}-${idx}`;
              return (
                <div
                  key={messageKey}
                  className={`flex items-start gap-3 mb-5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {msg.role === "user" ? initials || "U" : "AI"}
                  </div>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm shadow-lg shadow-primary/20"
                        : "bg-card border border-border/60 text-foreground rounded-tl-sm shadow-sm"
                    }`}
                  >
                    {msg.content}
                    {showTimestamps && (
                      <p className="mt-2 text-[10px] opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                    {msg.metadata?.sources &&
                      msg.metadata.sources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-current/15 flex flex-wrap gap-1">
                          {msg.metadata.sources.map((src, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold opacity-70 flex items-center gap-1"
                            >
                              📎 {src}
                            </span>
                          ))}
                        </div>
                      )}
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() =>
                          handleCopyMessage(messageKey, msg.content)
                        }
                        className="text-[10px] font-semibold opacity-60 hover:opacity-100 transition-opacity"
                      >
                        {copiedMessageKey === messageKey ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          {isSending && (
            <div className="flex items-start gap-3 mb-5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                AI
              </div>
              <div className="bg-card border border-border/60 rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="px-6 pb-5 pt-3 shrink-0">
          <div className="relative flex items-end gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all shadow-sm">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Kelo anything…"
              rows={1}
              style={{ resize: "none" }}
              className="flex-1 min-w-0 bg-transparent text-sm placeholder:text-muted-foreground/40 focus:outline-none max-h-36 overflow-y-auto leading-relaxed"
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = `${t.scrollHeight}px`;
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all btn-glow"
            >
              {isSending ? (
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M22 2 11 13" />
                  <path d="M22 2 15 22 11 13 2 9l20-7z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/35 mt-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
