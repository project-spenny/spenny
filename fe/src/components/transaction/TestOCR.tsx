'use client';
import { useState } from 'react';

export default function TestOCR() {
  const [result, setResult] = useState(null);

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
      <input type="file" accept="image/*" onChange={handleTest} />
      <div>{JSON.stringify(result)}</div>
    </div>
  );
}
