'use client';
import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Receipt, Images, Upload, X } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { OCRResult } from '@/types/transactions';
import { toast } from 'sonner';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';
import { Input } from '../ui/input';

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

interface ResultWithPreview {
  result: OCRResult;
  preview: string;
}

export default function ReceiptMulti() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [results, setResults] = useState<ResultWithPreview[]>([]);
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

    const ocrResults: ResultWithPreview[] = [];
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
        ocrResults.push({
          result: data,
          preview: previews[i],
        });
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

  // 가계부 업로드
  const handleSubmit = async () => {
    if (results.length === 0) {
      toast.error('저장할 데이터가 없습니다');
      return;
    }

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) {
        toast.warning('로그인이 필요합니다');
        return;
      }

      setLoading(true);

      const transactionsData = results.map((item) => ({
        user_id: user.id,
        title: item.result.title,
        type: 'expense',
        amount: Number(item.result.amount),
        date: item.result.date,
        category_id: item.result.category_id,
        tags: null,
      }));

      const { error } = await supabase
        .from('transactions')
        .insert(transactionsData);

      if (error) {
        toast.error('저장 실패');
        return;
      }

      toast.success(`${results.length} 건 저장 완료`);
      setOpen(false);
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
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
                <div>
                  {results.map((item, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-lg border p-4"
                    >
                      <img
                        src={item.preview}
                        onClick={() => setSelectedImage(item.preview)}
                        className="h-16 w-12 cursor-pointer rounded object-cover hover:opacity-70"
                      />
                      <div className="space-y-2">
                        <Input
                          value={item.result.title}
                          onChange={(e) => {}}
                          placeholder="가게명"
                        />
                        <Input
                          type="date"
                          value={
                            typeof item.result.date === 'string'
                              ? item.result.date
                              : ''
                          }
                          onChange={(e) => {}}
                        />
                        <Input
                          type="number"
                          value={item.result.amount}
                          onChange={(e) => {}}
                          placeholder="금액"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  disabled={loading || results.length === 0}
                  onClick={handleSubmit}
                >
                  {loading ? '등록 중...' : '전체 등록'}
                </Button>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
