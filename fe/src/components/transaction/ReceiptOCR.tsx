'use client';
import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Images, Upload, X, Sparkles } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { OCRResult } from '@/types/transactions';
import { toast } from 'sonner';
import { supabase } from '@/utils/supabase/client';
import { Input } from '../ui/input';
import { DatePicker } from './common/DatePicker';
import { Checkbox } from '../ui/checkbox';
import { formatLocalDate } from '@/utils/date';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CATEGORIES } from '@/constants/categories';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Label } from '../ui/label';

interface ResultWithPreview {
  result: OCRResult;
  preview: string;
}

export default function ReceiptOCR() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [results, setResults] = useState<ResultWithPreview[]>([]);
  const [step, setStep] = useState<'upload' | 'result'>('upload');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setCheckedItems(new Set(results.map((_, i) => i)));
    } else {
      setCheckedItems(new Set());
    }
  };

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
    setProgress({ current: 0, total: files.length });

    for (let i = 0; i < files.length; i++) {
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

      setProgress({ current: i + 1, total: files.length });
    }

    setLoading(false);

    if (errors.length > 0) {
      toast.error(`${errors.join(', ')}번째 영수증 인식 실패`);
    }

    if (ocrResults.length > 0) {
      toast.success(`${ocrResults.length}개 영수증 인식 완료`);
      setResults(ocrResults);
      setCheckedItems(new Set(ocrResults.map((_, i) => i)));
      setStep('result');
    }
  };

  // 가계부 업로드
  const handleSubmit = async () => {
    if (checkedItems.size === 0) {
      toast.error('가계부에 등록할 데이터를 체크해주세요');
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

      const transactionsData = results
        .filter((_, index) => checkedItems.has(index))
        .map((item) => ({
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
        toast.error('등록 실패');
        return;
      }

      toast.success(`등록 완료!`);
      setOpen(false);
    } catch (error) {
      toast.error('등록 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const updateResult = (
    index: number,
    field: keyof OCRResult,
    value: string | number
  ) => {
    setResults((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, result: { ...item.result, [field]: value } }
          : item
      )
    );
  };

  const reset = () => {
    setFiles([]);
    setPreviews([]);
    setResults([]);
    setStep('upload');
    setSelectedImage(null);
    setCheckedItems(new Set());
  };
  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) reset();
  };
  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          <Button
            className="h-16 w-16 cursor-pointer rounded-full bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100"
            asChild
          >
            {loading ? <Spinner /> : <Sparkles size={12} />}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg overflow-hidden border-none">
          <DialogHeader>
            <DialogTitle>
              {step === 'upload' ? `영수증 업로드` : '인식 결과'}
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
              {loading && (
                <div className="space-y-2">
                  <Progress value={(progress.current / progress.total) * 100} />
                  <p className="text-muted-foreground text-center text-sm">
                    {progress.current} / {progress.total} 처리 중...
                  </p>
                </div>
              )}
              <Button
                onClick={handleUpload}
                disabled={loading || files.length === 0}
              >
                {loading
                  ? '처리 중...'
                  : `${previews.length}개의 영수증 업로드`}
              </Button>
            </>
          )}
          {step === 'result' && (
            <>
              <div className="max-h-[60vh] space-y-3 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2">
                    <Checkbox
                      checked={checkedItems.size === results.length}
                      onCheckedChange={toggleAll}
                    />
                    <span className="text-sm">전체 선택</span>
                  </label>
                </div>
                <div className="flex flex-col gap-2">
                  {results.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-lg border p-4"
                    >
                      <Checkbox
                        checked={checkedItems.has(index)}
                        onCheckedChange={() => toggleCheck(index)}
                        className="h-5 w-5"
                      />
                      <img
                        src={item.preview}
                        onClick={() => setSelectedImage(item.preview)}
                        className="h-32 w-24 cursor-pointer rounded object-cover hover:opacity-70"
                      />
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-center">
                          <Label className="w-20 shrink-0">거래처</Label>
                          <Input
                            value={item.result.title}
                            onChange={(e) =>
                              updateResult(index, 'title', e.target.value)
                            }
                            placeholder="가게명"
                          />
                        </div>
                        <div className="flex items-center">
                          <Label className="w-20 shrink-0">날짜</Label>
                          <DatePicker
                            value={
                              typeof item.result.date === 'string'
                                ? new Date(item.result.date)
                                : item.result.date
                            }
                            onChange={(date) => {
                              const formatted = formatLocalDate(date);
                              updateResult(index, 'date', formatted);
                            }}
                            hideLabel
                          />
                        </div>

                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <Label className="w-20 shrink-0">금액</Label>
                            <Input
                              type="number"
                              value={item.result.amount}
                              onChange={(e) =>
                                updateResult(
                                  index,
                                  'amount',
                                  Number(e.target.value)
                                )
                              }
                              placeholder="금액"
                            />
                            <span className="text-muted-foreground ml-2 text-sm">
                              원
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Label className="w-20 shrink-0">카테고리</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="flex-1 justify-start text-center"
                              >
                                {item.result.category_id
                                  ? CATEGORIES.expense.find(
                                      (cat) =>
                                        cat.category_key ===
                                        item.result.category_id
                                    )?.name_ko || '선택'
                                  : '선택'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                              <div className="grid grid-cols-3">
                                {CATEGORIES.expense.map((cat) => (
                                  <div
                                    key={cat.category_key}
                                    onClick={() => {
                                      updateResult(
                                        index,
                                        'category_id',
                                        cat.category_key
                                      );
                                    }}
                                    className="flex h-12 w-20 cursor-pointer items-center justify-center text-center text-sm hover:bg-gray-100"
                                  >
                                    {cat.name_ko}
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  disabled={loading || results.length === 0}
                  onClick={handleSubmit}
                  className="w-full"
                >
                  {loading
                    ? '등록 중...'
                    : `${checkedItems.size} / ${results.length}개 데이터 등록`}
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
