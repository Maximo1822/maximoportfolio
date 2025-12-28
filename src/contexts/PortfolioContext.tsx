import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
}

interface PortfolioContextType {
  profile: ProfileData;
  videos: PortfolioItem[];
  designs: PortfolioItem[];
  updateProfile: (data: Partial<ProfileData>) => void;
  addVideo: (video: Omit<PortfolioItem, 'id' | 'type'>) => void;
  updateVideo: (id: string, video: Partial<PortfolioItem>) => void;
  deleteVideo: (id: string) => void;
  addDesign: (design: Omit<PortfolioItem, 'id' | 'type'>) => void;
  updateDesign: (id: string, design: Partial<PortfolioItem>) => void;
  deleteDesign: (id: string) => void;
}

const defaultProfile: ProfileData = {
  name: 'Your Name',
  title: 'Video Editor & Graphic Designer',
  bio: "I'm an editor passionate about creating compelling visual stories through video editing and graphic design. With a keen eye for detail and creative vision, I bring ideas to life.",
  profileImage: '',
  discordUsername: 'your_username',
  discordServerLink: 'https://discord.gg/your-server',
};

const defaultVideos: PortfolioItem[] = [
  { id: '1', title: 'Video Sample 1', thumbnail: '', type: 'video', youtubeUrl: '' },
  { id: '2', title: 'Video Sample 2', thumbnail: '', type: 'video', youtubeUrl: '' },
  { id: '3', title: 'Video Sample 3', thumbnail: '', type: 'video', youtubeUrl: '' },
  { id: '4', title: 'Video Sample 4', thumbnail: '', type: 'video', youtubeUrl: '' },
];

const defaultDesigns: PortfolioItem[] = [
  { id: '1', title: 'Design Sample 1', thumbnail: '', type: 'design', imageUrl: '' },
  { id: '2', title: 'Design Sample 2', thumbnail: '', type: 'design', imageUrl: '' },
  { id: '3', title: 'Design Sample 3', thumbnail: '', type: 'design', imageUrl: '' },
  { id: '4', title: 'Design Sample 4', thumbnail: '', type: 'design', imageUrl: '' },
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('portfolio_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [videos, setVideos] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('portfolio_videos');
    return saved ? JSON.parse(saved) : defaultVideos;
  });

  const [designs, setDesigns] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('portfolio_designs');
    return saved ? JSON.parse(saved) : defaultDesigns;
  });

  useEffect(() => {
    localStorage.setItem('portfolio_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('portfolio_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('portfolio_designs', JSON.stringify(designs));
  }, [designs]);

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const addVideo = (video: Omit<PortfolioItem, 'id' | 'type'>) => {
    const newVideo: PortfolioItem = {
      ...video,
      id: Date.now().toString(),
      type: 'video',
    };
    setVideos(prev => [...prev, newVideo]);
  };

  const updateVideo = (id: string, video: Partial<PortfolioItem>) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...video } : v));
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const addDesign = (design: Omit<PortfolioItem, 'id' | 'type'>) => {
    const newDesign: PortfolioItem = {
      ...design,
      id: Date.now().toString(),
      type: 'design',
    };
    setDesigns(prev => [...prev, newDesign]);
  };

  const updateDesign = (id: string, design: Partial<PortfolioItem>) => {
    setDesigns(prev => prev.map(d => d.id === id ? { ...d, ...design } : d));
  };

  const deleteDesign = (id: string) => {
    setDesigns(prev => prev.filter(d => d.id !== id));
  };

  return (
    <PortfolioContext.Provider value={{
      profile,
      videos,
      designs,
      updateProfile,
      addVideo,
      updateVideo,
      deleteVideo,
      addDesign,
      updateDesign,
      deleteDesign,
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
