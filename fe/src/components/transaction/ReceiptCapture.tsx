'use client';
import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Receipt } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { OCRResult } from '@/types/transactions';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';
interface OCRProps {
  onResult: (data: OCRResult) => void;
}

export default function ReceipCapture({ onResult }: OCRProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    setLoading(true);
    reader.onloadend = async () => {
      try {
        const res = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result }),
        });
        if (!res.ok) {
          throw new Error('영수증 인식에 실패했습니다');
        }
        const data = await res.json();
        toast(`영수증 인식이 완료 되었습니다`);
        onResult(data);
      } catch (error) {
        toast(
          error instanceof Error ? error.message : '영수증 인식에 실패했습니다'
        );
      } finally {
        setLoading(false);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Button
        onClick={() => inputRef.current?.click()}
        className="h-16 w-16 cursor-pointer rounded-full bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100"
        asChild
      >
        {loading ? <Spinner /> : <Camera size={12} />}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleUpload}
        hidden
      />
    </div>
  );
}
