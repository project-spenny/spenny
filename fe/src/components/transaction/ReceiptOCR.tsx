'use client';
import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Camera, Upload, X, Sparkles } from 'lucide-react';
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
  error?: boolean;
  errorMessage?: string;
}

export default function ReceiptOCR() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [results, setResults] = useState<ResultWithPreview[]>([]);
  const [step, setStep] = useState<'upload' | 'result'>('upload');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [isDragging, setIsDragging] = useState(false);

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
      setCheckedItems(
        new Set(
          results.map((r, i) => (!r.error ? i : -1)).filter((i) => i !== -1)
        )
      );
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
    e.target.value = '';
  };

  const handleCameraFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const BATCH_SIZE = 3;

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

    try {
      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.allSettled(
          batch.map(async (file, batchIndex) => {
            const base64 = await fileToBase64(file);
            const res = await fetch('/api/ocr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: base64 }),
            });

            if (!res.ok) {
              throw new Error('영수증 인식 실패');
            }

            const data = await res.json();
            return {
              result: data,
              preview: previews[i + batchIndex],
              error: false,
            };
          })
        );

        batchResults.forEach((result, batchIndex) => {
          const globalIndex = i + batchIndex;
          if (result.status === 'fulfilled') {
            ocrResults.push(result.value);
          } else {
            ocrResults.push({
              result: {
                title: '',
                amount: 0,
                date: new Date(),
                category_id: '',
              },
              preview: previews[globalIndex],
              error: true,
              errorMessage: '영수증 인식에 실패했습니다',
            });
          }
        });

        setProgress({ current: i + batch.length, total: files.length });
      }
    } catch (error) {
      toast.error('처리 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }

    if (ocrResults.length > 0) {
      toast.success(`${ocrResults.length}개 중 ${errors.length}개 분석에 성공했습니다`);
      setResults(ocrResults);
      setCheckedItems(
        new Set(
          ocrResults.map((r, i) => (!r.error ? i : -1)).filter((i) => i !== -1)
        )
      );
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
        .filter((item) => !item.error)
        .map((item) => ({
          user_id: user.id,
          title: item.result?.title,
          type: 'expense',
          amount: Number(item.result?.amount),
          date: item.result?.date,
          category_id: item.result?.category_id,
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
          >
            {loading ? <Spinner /> : <Sparkles size={12} />}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg overflow-hidden border-none">
          <DialogHeader>
            <DialogTitle>
              {step === 'upload' ? `영수증 업로드` : '영수증 분석 결과'}
            </DialogTitle>
            {(step==='upload')?(<p className="text-muted-foreground text-sm">
              AI가 영수증 데이터를 자동으로 추출합니다
            </p>):(
              <p className="text-muted-foreground text-sm pt-2">
              {`성공 ${results.filter(e=> !e.error).length} 실패 ${results.filter(e=> e.error).length}`}
              </p>)
            }
            
            
            
          </DialogHeader>
          {step === 'upload' && (
            <>
              <Button
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraRef.current?.click()
                }}
                type='button'
              >
                <Camera />
                촬영하기
              </Button>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-16 text-center ${isDragging && 'bg-brand-soft/30 border-solid'}`}
              >
                <Upload className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {isDragging ? '여기에 놓아주세요' : '클릭하거나 파일을 드래그하세요'}
                </p>
                <input
                  onChange={handleFiles}
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                />
                <input
                  ref={cameraRef}
                  type="file"
                  accept="image/*"
                  capture
                  onChange={handleCameraFiles}
                  hidden
                />
              <p className="text-xs text-muted-foreground mt-2">
                · 이미지 파일만 가능 · 5MB 이하 권장
              </p>
              </div>
              {/* 미리보기 영역 */}
              {previews.length > 0 && (
                <>
                  <div className="grid h-40 grid-cols-4 gap-6 overflow-y-scroll">
                    {previews.map((src, index) => (
                      <div key={index} className="group relative">
                        <img
                          src={src}
                          onClick={() => setSelectedImage(src)}
                          className="h-30 w-full rounded object-cover hover:opacity-60"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="bg-destructive absolute top-1 right-1 cursor-pointer rounded-full p-1 text-white opacity-60 group-hover:opacity-60 hover:opacity-95"
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
                  <label className="w-full text-right flex cursor-pointer items-center gap-2">
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
                        disabled={item.error}
                      />
                      <img
                        src={item.preview}
                        onClick={() => setSelectedImage(item.preview)}
                        className="h-32 w-24 cursor-pointer rounded object-cover hover:opacity-70"
                      />
                      {item.error ? (
                        <div className="flex flex-1 flex-col justify-center gap-2">
                          <p className="text-destructive font-medium">
                            {item.errorMessage}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            이미지를 확인하고 다시 시도해주세요
                          </p>
                        </div>
                      ) : (
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
                              <PopoverContent
                                className="w-auto p-0"
                                align="end"
                              >
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
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  disabled={loading || results.length === 0 || checkedItems.size===0}
                  onClick={handleSubmit}
                  className="w-full"
                >
                  {loading
                    ? '등록 중...'
                    : `${checkedItems.size} / ${results.length}개 데이터 등록`}
                </Button>
                <Button
                  onClick={()=>setStep('upload')}
                  className="w-full"
                >
                  처음으로 돌아가기
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
