const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto flex flex-col items-center gap-6">
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
