const Footer = () => {
  return (
    <footer className="bg-background z-10 h-16 w-full border-t py-2">
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-center text-xs">
          &copy; {new Date().getFullYear()} Spenny. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
