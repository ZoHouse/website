'use client';

import { Users, Zap, Calendar, Globe } from 'lucide-react';

interface NavBarProps {
  onSectionChange: (section: 'members' | 'quantum-sync' | 'events' | 'cultures') => void;
  activeSection: 'members' | 'quantum-sync' | 'events' | 'cultures';
}

const NavBar: React.FC<NavBarProps> = ({ onSectionChange, activeSection }) => {
  const navItems = [
    { id: 'members' as const, icon: Users, label: 'Members', color: 'from-blue-500 to-cyan-500' },
    { id: 'quantum-sync' as const, icon: Zap, label: 'Quantum Sync', color: 'from-purple-500 to-pink-500' },
    { id: 'events' as const, icon: Calendar, label: 'Events', color: 'from-green-500 to-emerald-500' },
    { id: 'cultures' as const, icon: Globe, label: 'Cultures', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:pb-6">
      <div className="max-w-md mx-auto">
        <nav className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2">
          <div className="flex items-center justify-around">
            {navItems.map(item => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`relative flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl transition-all duration-300 group ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg scale-110'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:scale-105'
                  }`}
                >
                  {/* Active indicator */}
                  {activeSection === item.id && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                  )}
                  
                  {/* Icon */}
                  <IconComponent 
                    className={`w-6 h-6 md:w-7 md:h-7 mb-1 transition-transform duration-200 ${
                      activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  />
                  
                  {/* Label - Only show on desktop */}
                  <span className={`hidden md:block text-xs font-medium tracking-wide leading-tight transition-colors duration-200 ${
                    activeSection === item.id ? 'text-white' : 'text-white/70 group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar; 