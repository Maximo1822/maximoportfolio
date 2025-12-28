import { usePortfolio } from '@/contexts/PortfolioContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const AboutSection = () => {
  const { profile } = usePortfolio();
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl" ref={ref}>
        <h2 
          className={`text-3xl md:text-5xl font-bold text-center mb-12 text-primary text-glow-intense italic ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
        >
          About Me
        </h2>

        <div 
          className={`bg-card border border-border rounded-xl p-8 md:p-12 glow-border ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.2s' }}
        >
          <p className="text-center text-muted-foreground text-lg leading-relaxed">
            {profile.bio}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
