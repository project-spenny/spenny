const Footer = () => {
  return (
    <footer className="bg-secondary z-10 h-16 w-full">
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-center text-xs">
          &copy; {new Date().getFullYear()} Spenny. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
