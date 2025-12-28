import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto flex flex-col items-center gap-6">
        {/* Admin Panel Button */}
        <Link to="/admin">
          <Button 
            variant="outline" 
            className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary btn-glow rounded-full px-6"
          >
            <Lock className="w-4 h-4 mr-2" />
            Admin Panel
          </Button>
        </Link>

        {/* Copyright */}
        <p className="text-muted-foreground text-sm">
          © {currentYear} Portfolio. All rights reserved.
        </p>
        <p className="text-muted-foreground/60 text-xs">
          Crafted with passion and creativity
        </p>
      </div>
    </footer>
  );
};

export default Footer;
