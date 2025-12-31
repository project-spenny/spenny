import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type Props = { onClick: () => void };

export default function FixedCostsAddButton({ onClick }: Props) {
  return (
    <Button
      type="button"
      className="z-50 mr-4 h-12 w-12 rounded-full"
      size="icon"
      onClick={onClick}
    >
      <Plus />
    </Button>
  );
}
