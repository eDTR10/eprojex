import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider"
import {
  LayoutDashboard,
  FolderKanban,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowUpCircle, 
  ArrowDownCircle, 
  User2Icon
} from "lucide-react"
import { Link, Outlet, useLocation } from "react-router-dom"
// import { ModeToggle } from "@/components/mode-toggle";

function Admin() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      const isBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 10;
      setIsAtBottom(isBottom);
    };

    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleScroll = () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      if (isAtBottom) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        mainContent.scrollTo({ top: mainContent.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  // Update the helper function to check active routes more precisely
  const isActiveRoute = (path: string) => {
    // Special case for dashboard since it's the main route
    if (path === '/react-vite-supreme/admin/dashboard/') {
      return location.pathname === '/react-vite-supreme/admin/dashboard/' || location.pathname === '/react-vite-supreme/admin/dashboard//';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/react-vite-supreme/admin/dashboard/"
    },
    { label: "Projects", icon: <FolderKanban className="w-5 h-5" />, href: "/react-vite-supreme/admin/projects/" },
    { label: "Attendance", icon: <Clock className="w-5 h-5" />, href: "/react-vite-supreme/admin/attendance/" },
    { label: "Employee", icon: <User2Icon className="w-5 h-5" />, href: "/react-vite-supreme/admin/employee/" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/react-vite-supreme/admin/setting/" },
  ];

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="relative bg-background h-screen w-screen flex overflow-hidden">

        {/* <div className=" fixed top-0 right-0 p-4 z-50">
            <ModeToggle/>
        </div> */}
        {/* Burger Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:block hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Navigation */}
        <nav className={`
          z-40 bg-green-500 border-r border-border
          w-[20vw] md:w-[300px] h-full md:absolute relative 
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'fixed -translate-x-full'}
        `}>
          {/* Logo */}
          <div className="p-6 mt-5 flex justify-center">
            <h1 className="text-4xl font-bold text-white">eProjEx</h1>
          </div>

          {/* Navigation Items */}
          <div className="px-4 space-y-2 pt-10">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${isActiveRoute(item.href)
                    ? ' bg-slate-800 text-white font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-8 left-0 right-0 px-4">
            <Link to="/react-vite-supreme" className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className={`
          flex-1 transition-all  duration-300 ease-in-out
          ${isOpen ? '' : 'ml-0'}
          z-30 min-h-[300px] flex flex-col gap-2 overflow-y-scroll relative
        `}
          onClick={() => {
            if (window.innerWidth <= 767) {
              setIsOpen(false)
            }
          }}
        >
          <Outlet />

          {/* Scroll Button */}
          <button
            onClick={handleScroll}
            className="animate__animated animate__bounceIn fixed bottom-8 right-8 z-50 px-4 py-2 rounded-lg bg-primary/10 backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
            aria-label={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
          >
            <span className="text-primary text-sm font-medium">
              {isAtBottom ? "Scroll to top" : "Scroll down, there's more to see!"}
            </span>
            {isAtBottom ? (
              <ArrowUpCircle className="text-primary" size={20} />
            ) : (
              <ArrowDownCircle className="text-primary" size={20} />
            )}
          </button>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default Admin;