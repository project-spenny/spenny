import ModeToggle from "../common/ModeToggle"

const Header = () => {
  return (
    <header className="fixed top-0 w-full h-16 flex items-center justify-between p-2 border-b bg-secondary">
      <h1 className="text-2xl font-bold px-4">Spenny</h1>
      <ModeToggle/>
    </header>
  )
}

export default Header