'use client';

import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useProfileGate } from '@/hooks/useProfileGate';
import { supabase } from '@/lib/supabase';
import ProfileSetup from './ProfileSetup';
import NFTGallery from './NFTGallery';
import { NFTData } from '@/lib/nftFetcher';

interface ProfileOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}



const ProfileOverlay: React.FC<ProfileOverlayProps> = ({ isVisible, onClose }) => {
  const { isConnected, address, role, formatAddress, quantumSync, isLoading } = useWallet();
  const [showNFTGallery, setShowNFTGallery] = useState(false);
  
  // Use the profile gate hook for consistent profile management
  const profileGate = useProfileGate();
  const { memberProfile, isProfileComplete, isLoadingProfile, showProfileSetup, setShowProfileSetup } = profileGate;

  // Profile loading is now handled by useProfileGate hook

  const handleQuantumSync = async () => {
    const success = await quantumSync();
    if (success) {
      // Reload profile after sync
      await profileGate.loadMemberProfile();
    }
  };

  const handleProfileSetupComplete = () => {
    profileGate.completeProfileSetup();
  };

  const handleNFTSelection = async (nft: NFTData) => {
    if (!address) return;

    try {
      const { error } = await supabase
        .from('members')
        .update({
          pfp: nft.image,
          last_seen: new Date().toISOString()
        })
        .eq('wallet', address);

      if (error) {
        console.error('Error updating profile picture:', error);
        return;
      }

      // Reload profile to get updated data
      await profileGate.loadMemberProfile();
      console.log('✅ Profile picture updated successfully');
    } catch (error) {
      console.error('Exception updating profile picture:', error);
    }
  };

  // Early return after all hooks
  if (!isVisible) return null;

  // Show NFT Gallery
  if (showNFTGallery && isConnected && address) {
    return (
      <NFTGallery
        isVisible={showNFTGallery}
        walletAddress={address}
        onSelectNFT={handleNFTSelection}
        onClose={() => setShowNFTGallery(false)}
        currentPFP={memberProfile?.pfp}
      />
    );
  }

  // Show Profile Setup
  if (showProfileSetup && isConnected && address) {
    return (
      <ProfileSetup
        isVisible={showProfileSetup}
        walletAddress={address}
        onComplete={handleProfileSetupComplete}
        onClose={() => setShowProfileSetup(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Profile Container */}
      <div className="relative liquid-glass-pane p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 glass-icon-button w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base"
        >
          ✕
        </button>

        {/* Profile Content */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-bold">Profile</h2>
          
          {isConnected ? (
            <div className="space-y-3 sm:space-y-4">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative">
                  {memberProfile?.pfp ? (
                    <img 
                      src={memberProfile.pfp} 
                      alt="Profile" 
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-700 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-sm sm:text-base">👤</span>
                    </div>
                  )}
                  {/* Edit PFP Button */}
                  <button
                    onClick={() => setShowNFTGallery(true)}
                    className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs hover:bg-blue-600"
                    title="Change profile picture"
                  >
                    ✏️
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base sm:text-lg">
                    {memberProfile?.name || 'Unnamed User'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300">{address ? formatAddress(address) : 'No wallet connected'}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${role === 'Founder' ? 'bg-yellow-900 text-yellow-300' : 'bg-gray-700 text-gray-300'}`}>
                      {role}
                    </span>
                    {memberProfile?.founder_nfts_count !== undefined && (
                      <span className="text-xs text-gray-400">
                        {memberProfile.founder_nfts_count} NFTs
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              {isLoadingProfile ? (
                <div className="liquid-glass-card p-3 sm:p-4 text-center">
                  <p className="text-gray-300 text-sm sm:text-base">Loading profile...</p>
                </div>
              ) : isProfileComplete ? (
                <div className="space-y-3 sm:space-y-4">
                  {memberProfile?.bio && (
                    <div className="liquid-glass-card p-3 sm:p-4">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Bio</h4>
                      <p className="text-xs sm:text-sm text-gray-300">{memberProfile.bio}</p>
                    </div>
                  )}
                  
                  {memberProfile?.culture && (
                    <div className="liquid-glass-card p-3 sm:p-4">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Culture</h4>
                      <p className="text-xs sm:text-sm">{memberProfile.culture}</p>
                    </div>
                  )}

                  {memberProfile?.calendar_url && (
                    <div className="liquid-glass-card p-3 sm:p-4">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Calendar</h4>
                      <a 
                        href={memberProfile.calendar_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm break-all"
                      >
                        View Calendar
                      </a>
                    </div>
                  )}

                  {/* Edit Profile Button */}
                  <button
                    onClick={() => setShowProfileSetup(true)}
                    className="glass-icon-button w-full py-2 text-sm sm:text-base"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="liquid-glass-card p-3 sm:p-4 text-center">
                  <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Complete your profile to get started</p>
                  <button
                    onClick={() => setShowProfileSetup(true)}
                    className="solid-button text-sm sm:text-base"
                  >
                    Complete Profile
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="liquid-glass-card p-3 sm:p-4 text-center">
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Connect your wallet to get started</p>
                <button 
                  onClick={handleQuantumSync}
                  disabled={isLoading}
                  className="solid-button text-sm sm:text-base"
                >
                  {isLoading ? 'Connecting...' : 'Quantum Sync'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverlay; 