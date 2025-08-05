'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAllMembers, Member } from '@/lib/supabase';

interface MembersOverlayProps {
  isVisible: boolean;
}

const MembersOverlay: React.FC<MembersOverlayProps> = ({ isVisible }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLocation, setActiveLocation] = useState('all');
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [supabaseMembers, setSupabaseMembers] = useState<Member[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      const members = await getAllMembers();
      if (members) {
        setSupabaseMembers(members);
      }
    };
    if (isVisible) loadMembers();
  }, [isVisible]);

  const allMembers = useMemo(() => {
    return supabaseMembers;
  }, [supabaseMembers]);

  useEffect(() => {
    let filtered = allMembers;
    if (activeLocation !== 'all') {
      filtered = filtered.filter(member => {
        const lat = member.lat || member.latitude || 0;
        const lng = member.lng || member.longitude || 0;
        if (activeLocation === 'bangalore') return lat >= 12.8 && lat <= 13.2 && lng >= 77.4 && lng <= 77.8;
        if (activeLocation === 'sanfrancisco') return lat >= 37.7 && lat <= 37.8 && lng >= -122.5 && lng <= -122.3;
        return true;
      });
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(m => (m.name || '').toLowerCase().includes(lower) || (m.role || '').toLowerCase().includes(lower) || (m.wallet || '').toLowerCase().includes(lower));
    }
    setFilteredMembers(filtered);
  }, [allMembers, searchTerm, activeLocation]);

  const formatAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isVisible) return null;

  const renderContent = () => (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">Members</h2>
      <div className="flex gap-2 mb-4">
        {['all', 'bangalore', 'sanfrancisco'].map(loc => (
          <button 
            key={loc} 
            onClick={() => setActiveLocation(loc)} 
            className={`paper-button flex-1 ${activeLocation === loc ? 'active' : ''}`}
          >
            {loc === 'all' ? 'All' : loc === 'bangalore' ? 'BLR' : 'SF'}
          </button>
        ))}
      </div>
      <input 
        type="text"
        placeholder="Search members..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="paper-input w-full mb-4"
      />
      <div className="flex-1 overflow-y-auto">
        {filteredMembers.map((member, index) => (
          <div key={index} className="paper-card">
            <h3 className="font-bold text-lg mb-1">{member.name || formatAddress(member.wallet)}</h3>
            <p className="text-sm">{member.role}</p>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex paper-overlay fixed top-10 right-5 bottom-10 w-[380px] z-10 flex-col">
        {renderContent()}
      </div>

      {/* Mobile Layout */}
      <div 
        className={`md:hidden paper-overlay fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-300 ease-in-out ${isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-12rem)]'}`}
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        <div className="flex-col h-full">
          <div className="text-center py-2" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto"></div>
          </div>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default MembersOverlay;
