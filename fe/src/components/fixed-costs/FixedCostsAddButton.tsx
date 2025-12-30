import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function FixedCostsAddButton() {
  return (
    <Button className="z-50 mr-4 h-12 w-12 rounded-full" size="icon">
      <Plus />
    </Button>
  );
}
