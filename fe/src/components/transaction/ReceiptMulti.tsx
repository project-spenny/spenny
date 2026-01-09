'use client';
import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Receipt } from 'lucide-react';
import { Images } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { OCRResult } from '@/types/transactions';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog';
interface OCRProps {
  onResult: (data: OCRResult) => void;
}

export default function ReceiptMulti({ onResult }: OCRProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="h-16 w-16 cursor-pointer rounded-full hover:bg-gray-800"
          asChild
        >
          {loading ? <Spinner /> : <Images size={12} />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>영수증 업로드</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
