import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Bell,
  Settings,
  UserPlus,
  Calendar,
  ScrollText,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";


import { Card, CardContent } from '@/components/ui/card';


import { Button} from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = {
  student: [
    { name: "Dashboard", path: "/portal/student/dashboard", icon: LayoutDashboard },
    { name: "View Progress", path: "/portal/view-progress", icon: BookOpen },
    { name: "Attendance", path: "/portal/attendance", icon: Calendar },
    { name: "Notifications", path: "/portal/notifications", icon: Bell },
    { name: "Settings", path: "/portal/student-settings", icon: Settings },
  ],
  teacher: [
    { name: "Dashboard", path: "/portal/teacher/dashboard", icon: LayoutDashboard },
    { name: "Mark Progress", path: "/portal/mark-progress", icon: ScrollText },
    { name: "Mark Attendance", path: "/portal/mark-attendance", icon: Calendar },
    { name: "Settings", path: "/portal/teacher-settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", path: "/portal/admin/dashboard", icon: LayoutDashboard },
    { name: "Unassigned Students", path: "/portal/unassigned-students", icon: Users },
    { name: "Create User", path: "/portal/create-student", icon: UserPlus },
    { name: "Settings", path: "/portal/admin-settings", icon: Settings },
  ],
};

const NavItem = ({ icon: Icon, name, path, isActive }) => (
  <Link
    to={path}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-teal-100 dark:hover:bg-teal-900",
      isActive ? "bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-50" : "text-muted-foreground hover:text-teal-900 dark:hover:text-teal-50"
    )}
  >
    <Icon className="h-4 w-4" />
    <span>{name}</span>
  </Link>
);

function Navbar() {
  const role = useSelector((state) => state.role);
  const items = navItems[role] || [];
  const pathname = window.location.pathname;

  return (
    <Card className="h-screen w-60 rounded-none border-r bg-background">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 pb-4">
          <BookOpen className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          <h2 className="text-lg font-semibold text-foreground">
            Portal
          </h2>
        </div>
        <Separator className="mb-4" />
        <nav className="space-y-1">
          {items.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              name={item.name}
              path={item.path}
              isActive={pathname === item.path}
            />
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}

export default Navbar;
