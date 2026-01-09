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

export default function ReceiptMulti({ onResult }: OCRProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
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
      </DialogContent>
    </Dialog>
  );
}
