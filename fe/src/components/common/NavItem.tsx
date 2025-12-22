import Link from "next/link"

const NavItem = ({label, href}: {label: string; href: string}) => {
  return (
    <Link
        href={href}
        className="px-3 py-1.5 font-medium flex justify-center items-center rounded-lg hover:bg-neutral-200 active:bg-neutral-300 transition-colors duration-300 md:w-24 md:h-20"
    >
        {label}
    </Link>
  )
}

export default NavItem