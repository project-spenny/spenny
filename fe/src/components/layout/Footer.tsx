const Footer = () => {
  return (
    <footer className="w-full h-16 z-10 bg-secondary">
      <div className="h-full flex justify-center items-center">
        <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Spenny. All rights reserved.
          </p>
      </div>
    </footer>
  )
}

export default Footer