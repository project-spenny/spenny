'use client';
import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Receipt, Images, Upload, X } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { OCRResult } from '@/types/transactions';
import { toast } from 'sonner';
import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog';
import { read } from 'fs';
interface OCRProps {
  onResult: (data: OCRResult) => void;
}

export default function ReceiptMulti() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [results, setResults] = useState<OCRResult[]>([]);
  const [step, setStep] = useState<'upload' | 'result'>('upload');
  // 이미지를 base64 문자열로 변환
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const addFiles = async (newFiles: File[]) => {
    const imgFiles = newFiles.filter((file) => file.type.startsWith('image/')); // 이미지 아닌 파일은 걸러내기
    if (imgFiles.length === 0) {
      toast.error('이미지 파일만 업로드 가능합니다');
      return;
    }
    setFiles((prev) => [...(prev || []), ...imgFiles]);

    //미리보기 생성
    const newPreviews = await Promise.all(
      imgFiles.map((file) => fileToBase64(file))
    );
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // 업로드
  const handleUpload = async () => {
    // 파일 없을 때 예외처리
    if (files.length === 0) {
      toast.error('업로드 할 파일을 등록해주세요');
      return;
    }

    const ocrResults: OCRResult[] = [];
    const errors: number[] = [];

    setLoading(true);

    for (let i = 0; i < files.length; i++) {
      toast(`${i} 번째`);
      try {
        const base64 = await fileToBase64(files[i]);
        const res = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        if (!res.ok) {
          throw new Error('영수증 인식에 실패했습니다');
        }

        const data = await res.json();
        ocrResults.push(data);
      } catch {
        errors.push(i + 1);
      }
    }

    setLoading(false);

    if (errors.length > 0) {
      toast.error(`${errors.join(', ')}번째 영수증 인식 실패`);
    }

    if (ocrResults.length > 0) {
      toast.success(`${results.length}개 영수증 인식 완료`);
      setResults(ocrResults);
      setStep('result');
    }
  };
  return (
    <>
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
        <DialogContent className="max-w-lg overflow-hidden border-none">
          <DialogHeader>
            <DialogTitle>
              {step === 'upload' ? '영수증 업로드' : '인식 결과'}
            </DialogTitle>
          </DialogHeader>
          {step === 'upload' && (
            <>
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
              {/* 미리보기 영역 */}
              {previews.length > 0 && (
                <>
                  <p className="text-muted-foreground">
                    {previews.length}개의 이미지
                  </p>
                  <div className="grid grid-cols-4 gap-6 overflow-y-scroll">
                    {previews.map((src, index) => (
                      <div key={index} className="group relative">
                        <img
                          src={src}
                          onClick={() => setSelectedImage(src)}
                          className="h-30 w-full rounded object-cover hover:opacity-60"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="bg-destructive absolute top-1 right-1 cursor-pointer rounded-full p-1 text-white opacity-0 group-hover:opacity-60 hover:opacity-95"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* 이미지 상세보기 overlay */}
              {selectedImage && (
                <div
                  className="round-lg absolute inset-0 flex items-center justify-center bg-black/70"
                  onClick={() => setSelectedImage(null)}
                >
                  <Button
                    className="absolute bottom-4 h-16 w-16 cursor-pointer rounded-full text-white"
                    onClick={() => setSelectedImage(null)}
                    asChild
                  >
                    <X size={12} />
                  </Button>
                  <img
                    src={selectedImage}
                    className="max-h-96 max-w-96 object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <Button
                onClick={handleUpload}
                disabled={loading || files.length === 0}
              >
                {loading ? '처리 중...' : `영수증 업로드`}
              </Button>
            </>
          )}
          {step === 'result' && (
            <>
              <div className="space-y-3 overflow-y-auto">
                <p className="text-muted-foreground text-md">
                  총 {results.length}건
                </p>
                {results.map((result, index) => (
                  <div key={index} className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{result.title}</span>
                      <span className="text-muted-foreground text-sm">
                        {typeof result.date === 'string'
                          ? result.date
                          : new Date(result.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        {result.category_id}
                      </span>
                      <span className="font-bold">
                        {result.amount.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
