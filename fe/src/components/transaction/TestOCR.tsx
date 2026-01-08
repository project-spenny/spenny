'use client';
import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Receipt } from 'lucide-react';
export default function TestOCR() {
  const [result, setResult] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTest = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: reader.result }),
      });
      setResult(await res.json());
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
        <Receipt size={20} />
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleTest}
        hidden
      />
      <div>{JSON.stringify(result)}</div>
    </div>
  );
}
