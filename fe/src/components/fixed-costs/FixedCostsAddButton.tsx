import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type Props = { onClick: () => void };

export default function FixedCostsAddButton({ onClick }: Props) {
  return (
    <Button
      type="button"
      className="fixed right-0 bottom-0 z-50 m-4 h-16 w-16 rounded-full"
      onClick={onClick}
      asChild
    >
      <Plus size={20} />
    </Button>
  );
}
