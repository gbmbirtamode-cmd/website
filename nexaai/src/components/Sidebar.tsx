import React from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Search } from 'lucide-react';
import { useAppStore } from '../store/appStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    conversations,
    currentConversationId,
    setCurrentConversation,
    deleteConversation,
    updateConversation,
    sidebarOpen,
    setSidebarOpen,
    user,
  } = useAppStore();

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleNewChat = () => {
    setCurrentConversation(null);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveTitle = (id: string) => {
    updateConversation(id, { title: editTitle });
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(id);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative
          top-0 left-0
          h-full w-72
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-800
          transform transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 
                     bg-nexa hover:bg-nexa-dark text-white rounded-lg
                     transition-colors font-medium"
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 
                       border-none rounded-lg text-sm
                       focus:ring-2 focus:ring-nexa outline-none
                       text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setCurrentConversation(conv.id);
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className={`
                    group flex items-center gap-2 px-3 py-2.5 rounded-lg
                    cursor-pointer transition-colors
                    ${
                      currentConversationId === conv.id
                        ? 'bg-nexa/10 text-nexa'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <MessageSquare size={18} className="shrink-0" />
                  
                  {editingId === conv.id ? (
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitle(conv.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        className="flex-1 bg-transparent border-b border-nexa outline-none text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Check
                        size={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveTitle(conv.id);
                        }}
                        className="text-green-600 cursor-pointer"
                      />
                      <X
                        size={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                        className="text-red-600 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 truncate text-sm">{conv.title}</span>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                        <Edit2
                          size={14}
                          onClick={(e) => handleEdit(e, conv.id, conv.title)}
                          className="text-slate-400 hover:text-nexa cursor-pointer"
                        />
                        <Trash2
                          size={14}
                          onClick={(e) => handleDelete(e, conv.id)}
                          className="text-slate-400 hover:text-red-600 cursor-pointer"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User section */}
        {user && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-nexa/20 flex items-center justify-center text-nexa font-semibold">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate dark:text-slate-200">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {user.plan} Plan
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
