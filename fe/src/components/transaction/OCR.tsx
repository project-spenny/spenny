'use client';
import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Receipt } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { OCRResult } from '@/types/transactions';
import { toast } from 'sonner';
interface OCRProps {
  onResult: (data: OCRResult) => void;
}

export default function OCR({ onResult }: OCRProps) {
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
          throw new Error('OCR Request Failed');
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
        className="fixed bottom-0 z-50 m-4 h-16 w-16 cursor-pointer rounded-full"
        asChild
      >
        {loading ? <Spinner /> : <Receipt size={20} />}
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
