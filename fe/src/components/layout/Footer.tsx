const Footer = () => {
  return (
    <footer className="bg-background border-border/50 z-10 h-16 w-full border-t py-2 shadow-[0_-1px_12px_rgba(0,0,0,0.03)]">
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-center text-xs">
          &copy; {new Date().getFullYear()} Spenny. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
