import React from 'react';
import { Menu, Sparkles, Image, Code2, FileText, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../store/appStore';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { branding, darkMode, toggleDarkMode, user, credits, setUser } = useAppStore();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors md:hidden"
        >
          <Menu size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexa-light to-nexa-dark flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-semibold text-lg dark:text-slate-200">
            {branding.appName}
          </span>
        </div>
      </div>

      {/* Center - Model selector placeholder */}
      <div className="hidden md:flex items-center gap-2">
        <ModelSelector />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Credits display */}
        {user && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium dark:text-slate-300">
              {credits.toLocaleString()} credits
            </span>
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? (
            <Sun size={20} className="text-slate-600 dark:text-slate-400" />
          ) : (
            <Moon size={20} className="text-slate-600 dark:text-slate-400" />
          )}
        </button>

        {/* User menu */}
        {user ? (
          <div className="relative group">
            <button className="w-9 h-9 rounded-full bg-nexa/20 flex items-center justify-center text-nexa font-semibold hover:bg-nexa/30 transition-colors">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 
                          rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                          transition-all transform origin-top-right z-50">
              <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                <p className="text-sm font-medium dark:text-slate-200">{user.name || 'User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm 
                                 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg 
                                 transition-colors text-slate-700 dark:text-slate-300">
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={() => setUser(null)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm 
                           hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg 
                           transition-colors text-red-600"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button className="px-4 py-2 bg-nexa hover:bg-nexa-dark text-white rounded-lg 
                           transition-colors font-medium text-sm">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

const ModelSelector: React.FC = () => {
  const { selectedModel, setSelectedModel, models } = useAppStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 
                 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <Code2 size={16} className="text-slate-600 dark:text-slate-400" />
        <span className="text-sm font-medium dark:text-slate-300">
          {selectedModelData?.name}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 
                        rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 
                        z-50 overflow-hidden">
            <div className="p-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors
                            ${selectedModel === model.id
                              ? 'bg-nexa/10 text-nexa'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                                ${selectedModel === model.id
                                  ? 'bg-nexa text-white'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                }`}>
                    {model.id.includes('code') ? (
                      <Code2 size={16} />
                    ) : model.id.includes('vision') ? (
                      <Image size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-medium ${
                      selectedModel === model.id
                        ? 'text-nexa'
                        : 'text-slate-900 dark:text-slate-200'
                    }`}>
                      {model.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {model.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
