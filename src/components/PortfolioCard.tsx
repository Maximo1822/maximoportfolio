import { PortfolioItem } from '@/contexts/PortfolioContext';
import { Play, Image } from 'lucide-react';

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard = ({ item }: PortfolioCardProps) => {
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border border-border card-hover cursor-pointer">
      {/* Thumbnail */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        {item.thumbnail ? (
          <img 
            src={item.thumbnail} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
      </div>
      
      {/* Title */}
      <div className="p-4">
        <h3 className="text-foreground font-medium group-hover:text-primary transition-colors duration-300">
          {item.title}
        </h3>
      </div>
    </div>
  );
};

export default PortfolioCard;
