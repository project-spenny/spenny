'use client';
import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Receipt, Images, Upload, X } from 'lucide-react';
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
  const [files, setFiles] = useState<File[]>();
  const inputRef = useRef<HTMLInputElement>(null);

  console.log(files);
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
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
        <Button onClick={() => inputRef.current?.click()}>
          내 PC/갤러리에서 찾기
        </Button>
        <div className="cursor-pointer rounded-lg border-2 border-dashed p-16 text-center">
          <Upload className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            업로드 할 이미지를 드래그해주세요{' '}
          </p>
          <input
            onChange={handleFiles}
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
