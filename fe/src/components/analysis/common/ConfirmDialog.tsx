import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

const ConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>예산 초기화</DialogTitle>
          <DialogDescription className="py-2">
            정말 이번 달 예산을 초기화 하시겠습니까?
          </DialogDescription>
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
