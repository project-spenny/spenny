import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
};

const ConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  isLoading,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-start">{title}</DialogTitle>

          <div className="flex items-center gap-4 p-2 md:p-4">
            <div className="flex">
              <AlertTriangle className="h-8 w-8 text-amber-400" />
            </div>
            <DialogDescription className="text-start whitespace-pre-wrap">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-2 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            취소
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? '초기화 중' : '초기화'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
