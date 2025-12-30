import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PortfolioItem {
  id: string;
  title: string;
  thumbnail: string;
  type: 'video' | 'design';
  youtubeUrl?: string;
  imageUrl?: string;
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  discordUsername: string;
  discordServerLink: string;
  waterPulseMode: 'blue_to_white' | 'white_to_blue';
}

interface PortfolioContextType {
  profile: ProfileData;
  videos: PortfolioItem[];
  designs: PortfolioItem[];
  loading: boolean;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  addVideo: (video: Omit<PortfolioItem, 'id' | 'type'>) => Promise<void>;
  updateVideo: (id: string, video: Partial<PortfolioItem>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  addDesign: (design: Omit<PortfolioItem, 'id' | 'type'>) => Promise<void>;
  updateDesign: (id: string, design: Partial<PortfolioItem>) => Promise<void>;
  deleteDesign: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const defaultProfile: ProfileData = {
  name: 'Your Name',
  title: 'Video Editor & Graphic Designer',
  bio: "I'm an editor passionate about creating compelling visual stories through video editing and graphic design.",
  profileImage: '',
  discordUsername: 'your_username',
  discordServerLink: 'https://discord.gg/qDwnyGKxK',
  waterPulseMode: 'blue_to_white',
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [videos, setVideos] = useState<PortfolioItem[]>([]);
  const [designs, setDesigns] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch profile settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('portfolio_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (settingsError) throw settingsError;

      if (settingsData) {
        setSettingsId(settingsData.id);
        setProfile({
          name: settingsData.name,
          title: settingsData.title,
          bio: settingsData.bio,
          profileImage: settingsData.profile_image || '',
          discordUsername: settingsData.discord_username,
          discordServerLink: (settingsData as any).discord_server_link || 'https://discord.gg/qDwnyGKxK',
          waterPulseMode: ((settingsData as any).water_pulse_mode as 'blue_to_white' | 'white_to_blue') || 'blue_to_white',
        });
      }

      // Fetch portfolio items
      const { data: itemsData, error: itemsError } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (itemsError) throw itemsError;

      if (itemsData) {
        const videoItems: PortfolioItem[] = itemsData
          .filter(item => item.type === 'video')
          .map(item => ({
            id: item.id,
            title: item.title,
            thumbnail: '',
            type: 'video' as const,
            youtubeUrl: item.youtube_url || '',
          }));

        const designItems: PortfolioItem[] = itemsData
          .filter(item => item.type === 'design')
          .map(item => ({
            id: item.id,
            title: item.title,
            thumbnail: '',
            type: 'design' as const,
            imageUrl: item.image_url || '',
          }));

        setVideos(videoItems);
        setDesigns(designItems);
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    await fetchData();
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      const payload = {
        name: data.name ?? profile.name,
        title: data.title ?? profile.title,
        bio: data.bio ?? profile.bio,
        profile_image: data.profileImage ?? profile.profileImage,
        discord_username: data.discordUsername ?? profile.discordUsername,
        discord_server_link: data.discordServerLink ?? profile.discordServerLink,
        water_pulse_mode: data.waterPulseMode ?? profile.waterPulseMode,
      };

      if (settingsId) {
        const { data: updatedRow, error } = await supabase
          .from('portfolio_settings')
          .update(payload)
          .eq('id', settingsId)
          .select('id')
          .maybeSingle();

        if (error) throw error;

        // If the row was deleted somehow, recreate it.
        if (!updatedRow) {
          const { data: insertedRow, error: insertError } = await supabase
            .from('portfolio_settings')
            .insert(payload)
            .select('id')
            .single();

          if (insertError) throw insertError;
          setSettingsId(insertedRow.id);
        }
      } else {
        const { data: insertedRow, error } = await supabase
          .from('portfolio_settings')
          .insert(payload)
          .select('id')
          .single();

        if (error) throw error;
        setSettingsId(insertedRow.id);
      }

      setProfile(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const addVideo = async (video: Omit<PortfolioItem, 'id' | 'type'>) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert({
          title: video.title,
          type: 'video',
          youtube_url: video.youtubeUrl || null,
          sort_order: videos.length,
        })
        .select()
        .single();

      if (error) throw error;

      const newVideo: PortfolioItem = {
        id: data.id,
        title: data.title,
        thumbnail: '',
        type: 'video',
        youtubeUrl: data.youtube_url || '',
      };

      setVideos(prev => [...prev, newVideo]);
    } catch (error) {
      console.error('Error adding video:', error);
      throw error;
    }
  };

  const updateVideo = async (id: string, video: Partial<PortfolioItem>) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .update({
          title: video.title,
          youtube_url: video.youtubeUrl,
        })
        .eq('id', id);

      if (error) throw error;

      setVideos(prev => prev.map(v => v.id === id ? { ...v, ...video } : v));
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVideos(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  };

  const addDesign = async (design: Omit<PortfolioItem, 'id' | 'type'>) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert({
          title: design.title,
          type: 'design',
          image_url: design.imageUrl || null,
          sort_order: designs.length,
        })
        .select()
        .single();

      if (error) throw error;

      const newDesign: PortfolioItem = {
        id: data.id,
        title: data.title,
        thumbnail: '',
        type: 'design',
        imageUrl: data.image_url || '',
      };

      setDesigns(prev => [...prev, newDesign]);
    } catch (error) {
      console.error('Error adding design:', error);
      throw error;
    }
  };

  const updateDesign = async (id: string, design: Partial<PortfolioItem>) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .update({
          title: design.title,
          image_url: design.imageUrl,
        })
        .eq('id', id);

      if (error) throw error;

      setDesigns(prev => prev.map(d => d.id === id ? { ...d, ...design } : d));
    } catch (error) {
      console.error('Error updating design:', error);
      throw error;
    }
  };

  const deleteDesign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDesigns(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting design:', error);
      throw error;
    }
  };

  return (
    <PortfolioContext.Provider value={{
      profile,
      videos,
      designs,
      loading,
      updateProfile,
      addVideo,
      updateVideo,
      deleteVideo,
      addDesign,
      updateDesign,
      deleteDesign,
      refreshData,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

// Helper function to extract YouTube video ID
export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

// Get YouTube thumbnail URL
export const getYouTubeThumbnail = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};
