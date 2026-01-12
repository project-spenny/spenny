'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

type Props = {
  onDelete: () => void | Promise<void>;
};

export default function FixedCostDeleteDialog({ onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      setPending(true);
      await onDelete();
      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="hover:text-destructive"
          aria-label="고정비 규칙 삭제"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>고정비 규칙을 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            ⚠️ 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
          <li>• 해당 고정비 규칙은 완전히 삭제됩니다.</li>
          <li>• 이 규칙으로 생성된 거래는 삭제되지 않습니다.</li>
          <li>• 기존 거래는 일반 거래로 유지되며, 고정비 연결만 해제됩니다.</li>
          <li>• 삭제 이후에는 자동 거래 생성이 중단됩니다.</li>
        </ul>

        <DialogFooter className="mt-2 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={pending}
            className="flex-1"
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
