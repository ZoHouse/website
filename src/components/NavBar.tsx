'use client';

interface NavBarProps {
  onSectionChange: (section: 'members' | 'quantum-sync' | 'events' | 'cultures') => void;
  activeSection: 'members' | 'quantum-sync' | 'events' | 'cultures';
}

const NavBar: React.FC<NavBarProps> = ({ onSectionChange, activeSection }) => {
  const navItems = [
    { id: 'members' as const, label: 'Members' },
    { id: 'quantum-sync' as const, label: 'Profile' }, // Changed from "Sync" to "Profile"
    { id: 'events' as const, label: 'Events' },
    { id: 'cultures' as const, label: 'Cultures' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="paper-nav max-w-md mx-auto">
        <nav className="flex items-center justify-around">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`paper-nav-item ${activeSection === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
