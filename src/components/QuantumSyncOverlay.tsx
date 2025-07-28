'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';

interface QuantumSyncOverlayProps {
  isVisible: boolean;
  onOpenDashboard: () => void;
}

const QuantumSyncOverlay: React.FC<QuantumSyncOverlayProps> = ({ isVisible, onOpenDashboard }) => {
  const wallet = useWallet();
  const [isCheckingNFT, setIsCheckingNFT] = useState(false);
  const [hasFounderNFT, setHasFounderNFT] = useState(false);

  // Check for Founder NFT when wallet connects
  useEffect(() => {
    if (isVisible && wallet.isConnected && wallet.address) {
      checkFounderNFT();
    }
  }, [isVisible, wallet.isConnected, wallet.address]);

  const checkFounderNFT = async () => {
    setIsCheckingNFT(true);
    try {
      // TODO: Implement actual NFT checking logic
      // For now, simulate checking
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate result - replace with actual NFT check
      const hasNFT = Math.random() > 0.5; // Random for demo
      setHasFounderNFT(hasNFT);
      
      if (hasNFT) {
        // Auto-open dashboard if Founder NFT found
        onOpenDashboard();
      }
    } catch (error) {
      console.error('Error checking Founder NFT:', error);
      setHasFounderNFT(false);
    } finally {
      setIsCheckingNFT(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await wallet.connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  if (!isVisible) return null;

  // If wallet is connected and we're checking NFT, show loading
  if (wallet.isConnected && isCheckingNFT) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none">
        <div className="liquid-glass-pane p-6 rounded-2xl max-w-md w-full mx-4 pointer-events-auto">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Checking Founder Status</h3>
            <p className="text-gray-300 text-sm mb-6">
              Verifying your Zo House membership...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // If wallet is connected but no Founder NFT found
  if (wallet.isConnected && !hasFounderNFT && !isCheckingNFT) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none">
        <div className="liquid-glass-pane p-6 rounded-2xl max-w-md w-full mx-4 pointer-events-auto">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Founder Access Required</h3>
            <p className="text-gray-300 text-sm mb-6">
              You need a Zo House Founder NFT to access the dashboard
            </p>
            
            <div className="space-y-3">
              <a 
                href="https://zo.xyz/membership" 
                target="_blank" 
                rel="noopener noreferrer"
                className="solid-button w-full py-3 text-sm block text-center"
              >
                🎫 Get Founder NFT
              </a>
              <button 
                onClick={() => wallet.disconnectWallet()}
                className="glass-icon-button w-full py-3 text-sm"
              >
                🔄 Connect Different Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default state: Not connected - show connect wallet button
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none">
      <div className="liquid-glass-pane p-6 rounded-2xl max-w-md w-full mx-4 pointer-events-auto">
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-2">Quantum Sync</h3>
          <p className="text-gray-300 text-sm mb-6">
            Connect your wallet to access the Zo House dashboard
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={handleConnectWallet}
              className="solid-button w-full py-3 text-sm"
            >
              🔗 Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumSyncOverlay; 