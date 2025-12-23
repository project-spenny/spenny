import { Button } from "@/components/ui/button";
import Link from "next/link"
import { cn } from "@/lib/utils";

const NavItem = ({label, href, isActive}: {label: string; href: string; isActive: boolean}) => {
  return (
    <Button 
      asChild 
      variant={isActive ? 'outline' : 'ghost'}
      className={cn(
        "active:bg-primary/10 duration-200 md:w-24 md:h-20",
        isActive ? 'font-bold' : 'font-normal'
      )}
    >
      <Link href={href}>
        {label}
      </Link>
    </Button>
  )
}

export default NavItem