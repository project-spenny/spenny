import ModeToggle from '../common/ModeToggle';

const Header = () => {
  return (
    <header className="bg-secondary fixed top-0 flex h-16 w-full items-center justify-between border-b p-2">
      <h1 className="px-4 text-2xl font-bold">Spenny</h1>
      <ModeToggle />
    </header>
  );
};

export default Header;
