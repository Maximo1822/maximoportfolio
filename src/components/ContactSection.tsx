import { usePortfolio } from '@/contexts/PortfolioContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { MessageCircle, Users } from 'lucide-react';
import { Button } from './ui/button';

const ContactSection = () => {
  const { profile } = usePortfolio();
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto max-w-2xl" ref={ref}>
        <h2 
          className={`text-3xl md:text-5xl font-bold text-center mb-12 text-primary text-glow-intense italic ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
        >
          Contact Me
        </h2>

        <div 
          className={`bg-card border border-border rounded-xl p-8 md:p-12 text-center ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.2s' }}
        >
          <p className="text-muted-foreground text-lg mb-8">
            Let's connect on Discord!
          </p>

          {/* Discord Username */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-muted rounded-full border border-border mb-6">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="text-foreground font-medium">{profile.discordUsername}</span>
          </div>

          {/* Join Server Button */}
          <div className="mt-6">
            <Button 
              asChild
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full btn-glow hover:scale-105 transition-transform duration-300"
            >
              <a href={profile.discordServerLink} target="_blank" rel="noopener noreferrer">
                <Users className="w-5 h-5 mr-2" />
                Join Discord Server
              </a>
            </Button>
          </div>

          <p className="text-muted-foreground text-sm mt-8">
            Feel free to reach out for collaborations, projects, or just to chat!
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
