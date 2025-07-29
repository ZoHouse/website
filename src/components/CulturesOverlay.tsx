'use client';

interface CulturesOverlayProps {
  isVisible: boolean;
}

const CulturesOverlay: React.FC<CulturesOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center liquid-glass-pane p-4">
      <div className="text-center max-w-sm mx-auto">
        <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🌍</div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Cultures of Zo</h2>
        <p className="text-base sm:text-lg text-white/70">This section is currently under development.</p>
        <p className="text-sm sm:text-md text-white/50 mt-3 sm:mt-4">Stay tuned for updates!</p>
      </div>
    </div>
  );
};

export default CulturesOverlay; 