import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
export const QuickAmountButtons = ({
  value,
  onClick,
}: {
  value: string;
  onClick: (type: string) => void;
}) => {
  const addAmount = (
    e: React.MouseEvent<HTMLButtonElement>,
    increment: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const currentAmount = parseInt(value.replace(/,/g, '')) || 0;
    const newAmount = currentAmount + increment;
    onClick(newAmount.toString());
  };

  return (
    <div className="flex w-full items-center gap-1">
      <Button
        variant="outline"
        type="button"
        onClick={(e) => addAmount(e, 100000)}
        size="sm"
        className="text-foreground h-6 flex-1 px-2 text-xs"
      >
        +100,000
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={(e) => addAmount(e, 10000)}
        size="sm"
        className="text-foreground h-6 flex-1 px-2 text-xs"
      >
        +10,000
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={(e) => addAmount(e, 1000)}
        size="sm"
        className="text-foreground h-6 flex-1 px-2 text-xs"
      >
        +1,000
      </Button>
    </div>
  );
};
