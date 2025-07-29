'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAllMembers, Member } from '@/lib/supabase';
import { Search, MapPin, Crown, Users, Wifi, WifiOff, ChevronUp, ChevronDown } from 'lucide-react';

interface MembersOverlayProps {
  isVisible: boolean;
}

const MembersOverlay: React.FC<MembersOverlayProps> = ({ isVisible }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLocation, setActiveLocation] = useState('all');
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [supabaseMembers, setSupabaseMembers] = useState<Member[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  useEffect(() => {
    const loadMembers = async () => {
      const members = await getAllMembers();
      if (members && members.length > 0) {
        // Filter for Founders only
        const founders = members.filter(member => member.role === 'Founder');
        setSupabaseMembers(founders);
      }
    };
    if (isVisible) loadMembers();
  }, [isVisible]);

  // Reset expanded state when overlay becomes invisible
  useEffect(() => {
    if (!isVisible) {
      setIsExpanded(false);
    }
  }, [isVisible]);

  // Simple swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0 && !isExpanded) {
        setIsExpanded(true);
      } else if (deltaY < 0 && isExpanded) {
        setIsExpanded(false);
      }
    }
    
    setTouchStartY(0);
  };

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

  const getLocationName = (lat?: number, lng?: number) => {
    if (!lat || !lng) return 'Unknown';
    if (lat >= 12.8 && lat <= 13.2 && lng >= 77.4 && lng <= 77.8) return 'Bangalore';
    if (lat >= 37.7 && lat <= 37.8 && lng >= -122.5 && lng <= -122.3) return 'San Francisco';
    return 'Remote';
  };

  const getStatus = (lastSeen?: string) => {
    if (!lastSeen) return { key: 'offline', text: 'Offline', color: 'bg-gray-400', icon: WifiOff };
    const diff = (new Date().getTime() - new Date(lastSeen).getTime()) / 60000;
    if (diff < 5) return { key: 'online', text: 'Online', color: 'bg-green-500', icon: Wifi };
    if (diff < 30) return { key: 'busy', text: 'Recently Active', color: 'bg-yellow-500', icon: Wifi };
    return { key: 'offline', text: 'Offline', color: 'bg-gray-400', icon: WifiOff };
  };

  const formatAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getAvatarContent = (member: Member) => {
    // If member has a profile picture, show it
    if (member.pfp) {
      return (
        <img 
          src={member.pfp} 
          alt={member.name || 'Profile'} 
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }
    
    // Fallback to initials
    const initials = member.name 
      ? member.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : member.wallet 
        ? member.wallet.slice(2, 4).toUpperCase() 
        : '?';
    
    return (
      <span className="font-bold text-lg">
        {initials}
      </span>
    );
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="hidden md:flex fixed top-10 right-5 bottom-10 w-[380px] z-10 flex-col bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Founders Directory
            </h3>
            <p className="text-white/60 text-sm">Connect with Zo House Founders</p>
          </div>

          <div className="flex gap-2 mb-4">
            {['all', 'bangalore', 'sanfrancisco'].map(loc => (
              <button 
                key={loc} 
                onClick={() => setActiveLocation(loc)} 
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeLocation === loc 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {loc === 'all' ? 'All' : loc === 'bangalore' ? 'Bangalore' : 'San Francisco'}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search members..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="text-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Users className="w-4 h-4" />
              Connect All
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {filteredMembers.map((member, index) => {
              const status = getStatus(member.last_seen);
              const location = getLocationName(member.lat || member.latitude, member.lng || member.longitude);
              const StatusIcon = status.icon;
              
              return (
                <div 
                  key={index} 
                  className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden">
                        {getAvatarContent(member)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${status.color} rounded-full border-2 border-black flex items-center justify-center`}>
                        <StatusIcon className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-300 transition-colors">
                        {member.name || formatAddress(member.wallet)}
                      </h3>
                      <div className="space-y-1 text-sm text-white/70">
                        <p className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          {member.role}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {location}
                        </p>
                        <p className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          {status.text}
                        </p>
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                      Connect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div 
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-500 ease-out ${
          isExpanded 
            ? 'translate-y-0' 
            : 'translate-y-[calc(100%-24rem)]'
        }`}
        style={{
          height: '100vh',
          paddingTop: '5rem'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-gradient-to-t from-black/95 via-black/90 to-black/80 backdrop-blur-xl border-t border-white/10 rounded-t-3xl h-full flex flex-col">
          {/* Sheet Handle */}
          <div 
            className="flex justify-center pt-3 pb-2 cursor-pointer flex-shrink-0" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
          </div>
          
          {/* Expand/Collapse Indicator */}
          <div className="flex justify-center pb-2 flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronUp className="w-5 h-5 text-white/60" />
            )}
          </div>

          {/* Header */}
          <div className="px-4 pb-4 border-b border-white/10 flex-shrink-0">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                Founders Directory
              </h3>
              <p className="text-white/60 text-xs">Connect with Zo House Founders ({filteredMembers.length})</p>
            </div>

            <div className="flex gap-2 mb-4">
              {['all', 'bangalore', 'sanfrancisco'].map(loc => (
                <button 
                  key={loc} 
                  onClick={() => setActiveLocation(loc)} 
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    activeLocation === loc 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {loc === 'all' ? 'All' : loc === 'bangalore' ? 'Bangalore' : 'San Francisco'}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Search members..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="text-center">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm">
                <Users className="w-4 h-4" />
                Connect All
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            <div className="space-y-3">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60 text-sm">No members found</p>
                </div>
              ) : (
                filteredMembers.map((member, index) => {
                  const status = getStatus(member.last_seen);
                  const location = getLocationName(member.lat || member.latitude, member.lng || member.longitude);
                  const StatusIcon = status.icon;
                  
                  return (
                    <div 
                      key={index} 
                      className="group bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden">
                            {getAvatarContent(member)}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${status.color} rounded-full border-2 border-black flex items-center justify-center`}>
                            <StatusIcon className="w-1.5 h-1.5 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-blue-300 transition-colors line-clamp-1">
                            {member.name || formatAddress(member.wallet)}
                          </h3>
                          <div className="space-y-0.5 text-xs text-white/70">
                            <p className="flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              {member.role}
                            </p>
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="line-clamp-1">{location}</span>
                            </p>
                            {isExpanded && (
                              <p className="flex items-center gap-1">
                                <StatusIcon className="w-3 h-3" />
                                {status.text}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <button className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-xs">
                          Connect
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {/* Bottom padding to ensure last item is visible */}
            <div className="h-20"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembersOverlay; 