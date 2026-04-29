import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Code2, User, Radio, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BottomNav = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Radio, label: 'Webhooks', path: '/webhooks' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
    { icon: User, label: 'Account', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/5 h-20 px-6 flex items-center justify-around z-50">
      <div className="flex justify-around items-center w-full max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 transition-all group',
                isActive ? 'text-cyan-400' : 'text-gray-600'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? "bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "group-hover:bg-white/5"
                )}>
                  <item.icon
                    size={24}
                    className={cn(
                      'transition-all duration-300',
                      isActive ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : ''
                    )}
                  />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-tighter">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
