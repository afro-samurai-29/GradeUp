import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { 
  Home,
  BookOpen,
  FileText,
  MessageCircle,
  Info,
  User,
  LogOut,
  Bell,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const StudentNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const navItems = [
    { path: '/student', label: 'Dashboard', icon: Home, color: 'from-green-500 to-green-600' },
    { path: '/student/notes', label: 'Study Notes', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { path: '/student/past-papers', label: 'Past Papers', icon: FileText, color: 'from-green-500 to-green-600' },
    { path: '/student/requests', label: 'Help Requests', icon: MessageCircle, color: 'from-green-500 to-green-600' },
    { path: '/student/information', label: 'Information', icon: Info, color: 'from-green-500 to-green-600' },
  ];

  const isActive = (path: string) => {
    if (path === '/student') {
      return location.pathname === '/student';
    }
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item, isMobile = false }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    
    return (
      <Link 
        to={item.path} 
        onClick={() => isMobile && setSidebarOpen(false)}
        className={`group relative flex items-center ${
          !isMobile && collapsed ? 'justify-center space-x-0' : 'space-x-3'
        } px-4 py-3 rounded-xl transition-all duration-300 ${
          active 
            ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        } ${isMobile ? 'w-full' : 'w-full'}`}
      >
        <div className={`p-2 rounded-lg transition-all duration-300 ${
          active 
            ? 'bg-white/20' 
            : 'bg-gray-100 group-hover:bg-white'
        }`}>
          <Icon className={`${!isMobile && collapsed ? 'h-6 w-6' : 'h-5 w-5'} transition-colors ${
            active ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'
          }`} />
        </div>
        {!collapsed && (
          <span className={`font-medium transition-colors ${
            active ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
          }`}>
            {item.label}
          </span>
        )}
        {active && !collapsed && (
          <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-xl transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="font-bold text-gray-900">GradeUp</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm"
            className={`relative w-full justify-start ${collapsed ? 'px-2' : 'px-4'} text-gray-600 hover:text-gray-900 hover:bg-gray-50`}
          >
            <Bell className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Notifications</span>}
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-0">
              3
            </Badge>
          </Button>

          {/* Profile */}
          <Link 
            to="/student/profile" 
            className={`flex items-center ${collapsed ? 'justify-center space-x-0 px-2' : 'space-x-3 px-4'} py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300`}
          >
            <div className="p-1.5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <User className={`${collapsed ? 'h-6 w-6' : 'h-4 w-4'} text-white`} />
            </div>
            {!collapsed && <span className="font-medium">Profile</span>}
          </Link>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="sm"
            className={`w-full justify-start ${collapsed ? 'px-2' : 'px-4'} text-gray-600 hover:text-gray-900 hover:bg-gray-50`}
          >
            <Settings className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Settings</span>}
          </Button>

          {/* Logout */}
          <Button 
            variant="outline" 
            size="sm"
            className={`w-full justify-start ${collapsed ? 'px-2' : 'px-4'} text-gray-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 border-gray-200`}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: Menu Button */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">G</span>
                    </div>
                    <span className="font-bold text-gray-900">GradeUp</span>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  {navItems.map((item) => (
                    <NavItem key={item.path} item={item} isMobile={true} />
                  ))}
                </nav>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="ml-3">Notifications</span>
                    <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-0">
                      3
                    </Badge>
                  </Button>

                  <Link 
                    to="/student/profile" 
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300"
                  >
                    <div className="p-1.5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">Profile</span>
                  </Link>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-start px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="ml-3">Settings</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm"
                  className="w-full justify-start px-4 text-gray-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 border-gray-200"
                  onClick={() => { setSidebarOpen(false); handleLogout(); }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="ml-3">Logout</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Center: Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-gray-900">GradeUp</span>
          </div>
          
          {/* Right: Notifications */}
          <Button 
            variant="ghost" 
            size="sm"
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-0">
              3
            </Badge>
          </Button>
        </div>
      </div>

      {/* Spacer for desktop sidebar */}
      <div className={`hidden lg:block ${collapsed ? 'w-16' : 'w-64'}`}></div>
    </>
  );
};

export default StudentNavbar;
