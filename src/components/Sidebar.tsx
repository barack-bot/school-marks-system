import React from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Zap,
  BarChart3,
  FileText,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

// Admin nav items
const adminNavItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "Students",
    path: "/admin/students",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    label: "Teachers",
    path: "/admin/teachers",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    label: "Classes",
    path: "/admin/classes",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "Subjects",
    path: "/admin/subjects",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Marks",
    path: "/admin/marks",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Reports",
    path: "/admin/reports",
  },
];

// Teacher nav items
const teacherNavItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: "Dashboard",
    path: "/teacher/dashboard",
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "Students",
    path: "/teacher/students",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    label: "Teachers",
    path: "/teacher/teachers",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    label: "Classes",
    path: "/teacher/classes",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "Subjects",
    path: "/teacher/subjects",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Marks",
    path: "/teacher/marks",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Reports",
    path: "/teacher/reports",
  },
];

const getNavItems = () => {
  const adminSession = localStorage.getItem("admin_session");
  return adminSession ? adminNavItems : teacherNavItems;
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navItems = getNavItems();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r border-slate-100 transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-primary-50 text-primary-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-slate-100">
            <div className="p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg">
              <p className="text-xs font-semibold text-slate-700 mb-2">
                Version
              </p>
              <p className="text-xs text-slate-500">SchoolHub v1.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Close button for mobile */}
      {isOpen && (
        <button
          onClick={onClose}
          className="fixed top-20 left-64 md:hidden z-30 p-2"
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </>
  );
};
