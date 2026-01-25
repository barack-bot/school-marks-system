import React from "react";
import { Bell, Settings, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

interface TopNavProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 shadow-soft z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">SchoolHub</h1>
              <p className="text-xs text-slate-500">Management System</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors group">
            <Bell className="w-6 h-6 text-slate-600 group-hover:text-slate-900" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="w-6 h-6 text-slate-600" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Admin</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-2">
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700">
                  <User className="w-4 h-4" />
                  Profile Settings
                </button>
                <hr className="my-1" />
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-red-600">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
