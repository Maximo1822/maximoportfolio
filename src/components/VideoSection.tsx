import { usePortfolio } from '@/contexts/PortfolioContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import PortfolioCard from './PortfolioCard';

const VideoSection = () => {
  const { videos } = usePortfolio();
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="videos" className="py-20 px-4">
      <div className="container mx-auto" ref={ref}>
        <h2 
          className={`text-3xl md:text-5xl font-bold text-center mb-12 text-primary text-glow-intense italic ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
        >
          Video Editing
        </h2>

        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
            isVisible ? 'animate-slide-in-left' : 'opacity-0'
          }`}
        >
          {videos.map((video, index) => (
            <div 
              key={video.id} 
              style={{ animationDelay: `${index * 0.1}s` }}
              className={isVisible ? 'animate-slide-in-left' : 'opacity-0'}
            >
              <PortfolioCard item={video} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
