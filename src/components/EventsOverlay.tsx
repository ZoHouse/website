'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, ChevronUp, ChevronDown } from 'lucide-react';

interface EventData {
  'Event Name': string;
  'Date & Time': string;
  Location: string;
  Latitude: string;
  Longitude: string;
  'Event URL'?: string;
}

interface EventsOverlayProps {
  isVisible: boolean;
  events: EventData[];
  onEventClick?: (event: EventData) => void;
  closeMapPopups?: (() => void) | null;
}

const EventsOverlay: React.FC<EventsOverlayProps> = ({ isVisible, events, onEventClick, closeMapPopups }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLocation, setActiveLocation] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>(events);
  const [wasVisible, setWasVisible] = useState(isVisible);
  const [isExpanded, setIsExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  useEffect(() => {
    if (wasVisible && !isVisible && closeMapPopups) {
      closeMapPopups();
    }
    setWasVisible(isVisible);
  }, [isVisible, wasVisible, closeMapPopups]);

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

  useEffect(() => {
    let filtered = events;
    if (activeLocation !== 'all') {
      filtered = filtered.filter(event => {
        const loc = event.Location.toLowerCase();
        if (activeLocation === 'bangalore') return loc.includes('bangalore') || loc.includes('bengaluru');
        if (activeLocation === 'sanfrancisco') return loc.includes('san francisco') || loc.includes('sf');
        return true;
      });
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(e => e['Event Name'].toLowerCase().includes(lower) || e.Location.toLowerCase().includes(lower));
    }
    
    // Sort chronologically (earliest upcoming events first)
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a['Date & Time']);
      const dateB = new Date(b['Date & Time']);
      return dateA.getTime() - dateB.getTime();
    });
    
    setFilteredEvents(filtered);
  }, [events, searchTerm, activeLocation]);

  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Past Event';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return eventDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: eventDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex fixed top-10 right-5 bottom-10 w-[380px] z-10 flex-col bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Zo Events
            </h3>
            <p className="text-white/60 text-sm">Discover and join community events</p>
          </div>

          <div className="flex gap-2 mb-4">
            {['all', 'bangalore', 'sanfrancisco'].map(loc => (
              <button 
                key={loc} 
                onClick={() => setActiveLocation(loc)} 
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeLocation === loc 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
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
                placeholder="Search events..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="text-center">
            <a 
              href="https://zostel.typeform.com/to/LgcBfa0M" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🎉 Host Events at Zo
            </a>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div 
                key={index} 
                onClick={() => onEventClick?.(event)} 
                className="group bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-300 transition-colors">
                      {event['Event Name']}
                    </h3>
                    <div className="space-y-1 text-sm text-white/70">
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDate(event['Date & Time'])} at {formatTime(event['Date & Time'])}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.Location}
                      </p>
                    </div>
                  </div>
                  {event['Event URL'] && (
                    <a 
                      href={event['Event URL']} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={e => e.stopPropagation()} 
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Register
                    </a>
                  )}
                </div>
              </div>
            ))}
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
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1">
                Zo Events
              </h3>
              <p className="text-white/60 text-xs">Discover and join community events ({filteredEvents.length})</p>
            </div>

            <div className="flex gap-2 mb-4">
              {['all', 'bangalore', 'sanfrancisco'].map(loc => (
                <button 
                  key={loc} 
                  onClick={() => setActiveLocation(loc)} 
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    activeLocation === loc 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
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
                  placeholder="Search events..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
            </div>

            <div className="text-center">
              <a 
                href="https://zostel.typeform.com/to/LgcBfa0M" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 text-sm"
              >
                🎉 Host Events at Zo
              </a>
            </div>
          </div>

          {/* Events List */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            <div className="space-y-3">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/60 text-sm">No events found</p>
                  <p className="text-white/40 text-xs mt-1">
                    {searchTerm ? 'Try adjusting your search' : 'Check back later for updates'}
                  </p>
                </div>
              ) : (
                filteredEvents.map((event, index) => (
                  <div 
                    key={index} 
                    onClick={() => onEventClick?.(event)} 
                    className="group bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-purple-300 transition-colors line-clamp-2">
                          {event['Event Name']}
                        </h3>
                        <div className="space-y-1 text-xs text-white/70">
                          <p className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {formatDate(event['Date & Time'])} at {formatTime(event['Date & Time'])}
                          </p>
                          <p className="flex items-start gap-2">
                            <MapPin className="w-3 h-3 mt-0.5" />
                            <span className="break-words">{event.Location}</span>
                          </p>
                        </div>
                        {event['Event URL'] && (
                          <a 
                            href={event['Event URL']} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={e => e.stopPropagation()} 
                            className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-xs"
                          >
                            Register Now
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
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

export default EventsOverlay; 