import { useState } from 'react';
import { PortfolioItem, getYouTubeVideoId, getYouTubeThumbnail } from '@/contexts/PortfolioContext';
import { Play, Image, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard = ({ item }: PortfolioCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const youtubeId = item.youtubeUrl ? getYouTubeVideoId(item.youtubeUrl) : null;
  const youtubeThumbnail = item.youtubeUrl ? getYouTubeThumbnail(item.youtubeUrl) : null;
  
  // Determine what image to show
  const displayImage = item.type === 'video' 
    ? (youtubeThumbnail || item.thumbnail)
    : (item.imageUrl || item.thumbnail);

  const handleClick = () => {
    if (item.type === 'video' && youtubeId) {
      setIsOpen(true);
    } else if (item.type === 'design' && (item.imageUrl || item.thumbnail)) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div 
        className="group relative bg-card rounded-lg overflow-hidden border border-border card-hover cursor-pointer"
        onClick={handleClick}
      >
        {/* Thumbnail */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          {displayImage ? (
            <img 
              src={displayImage} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {item.type === 'video' ? (
                <Play className="w-12 h-12 text-muted-foreground/30" />
              ) : (
                <Image className="w-12 h-12 text-muted-foreground/30" />
              )}
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center glow-border">
              {item.type === 'video' ? (
                <Play className="w-6 h-6 text-primary-foreground ml-1" />
              ) : (
                <Image className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
          </div>

          {/* YouTube indicator */}
          {item.type === 'video' && youtubeId && (
            <div className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground text-xs px-2 py-1 rounded">
              YouTube
            </div>
          )}
        </div>
        
        {/* Title */}
        <div className="p-4">
          <h3 className="text-foreground font-medium group-hover:text-primary transition-colors duration-300">
            {item.title}
          </h3>
        </div>
      </div>

      {/* Video/Image Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card border-border max-w-4xl w-full p-0 overflow-hidden">
          <DialogTitle className="sr-only">{item.title}</DialogTitle>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          {item.type === 'video' && youtubeId ? (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="max-h-[80vh] overflow-auto">
              <img
                src={item.imageUrl || item.thumbnail}
                alt={item.title}
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="p-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PortfolioCard;
