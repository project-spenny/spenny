import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type NavItemProps = {
  label: string;
  href: string;
  isActive: boolean;
  itemIcon: React.ComponentType<{ className?: string }>;
};

const NavItem = ({ label, href, isActive, itemIcon: Icon }: NavItemProps) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        'relative flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 transition-all duration-200',
        'md:h-20 md:w-24 md:flex-none md:rounded-md',
        'hover:bg-brand/15 active:bg-brand/20',
        isActive ? 'bg-brand/10 text-brand font-bold' : 'text-muted-foreground'
      )}
    >
      <Link href={href}>
        <Icon
          className={cn(
            'h-6 w-6 transition-transform duration-200',
            isActive ? 'scale-110 stroke-[2.5px]' : 'stroke-[1.5px]'
          )}
        />
        <span className="text-xs">{label}</span>

        {isActive && (
          <div
            className={cn(
              'bg-brand absolute',
              'bottom-0 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-t-full',
              'md:top-1/2 md:left-0 md:h-1/2 md:w-1 md:translate-x-0 md:-translate-y-1/2 md:rounded-t-none md:rounded-r-full'
            )}
          />
        )}
      </Link>
    </Button>
  );
};

export default NavItem;
