import { usePortfolio } from '@/contexts/PortfolioContext';
import { ChevronDown, User } from 'lucide-react';

const HeroSection = () => {
  const { profile } = usePortfolio();

  const scrollToVideos = () => {
    const element = document.getElementById('videos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Profile Image with Glow Ring */}
        <div className="relative mb-8">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-primary profile-glow pulse-glow flex items-center justify-center bg-card overflow-hidden">
            {profile.profileImage ? (
              <img 
                src={profile.profileImage} 
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-24 h-24 text-primary/50" />
            )}
          </div>
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
        </div>

        {/* Name */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in">
          {profile.name}
        </h1>

        {/* Title with glow */}
        <p className="text-xl md:text-2xl text-primary text-glow font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {profile.title}
        </p>

        {/* Scroll indicator */}
        <button 
          onClick={scrollToVideos}
          className="mt-16 animate-float"
        >
          <div className="w-8 h-8 rounded-full border-2 border-primary/50 flex items-center justify-center hover:border-primary hover:glow-border transition-all duration-300">
            <ChevronDown className="w-5 h-5 text-primary" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
