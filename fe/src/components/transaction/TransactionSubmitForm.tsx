'use client'
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "../ui/button"
CalendarIcon
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { X } from "lucide-react"

const DUMMY_CATEGORIES = [
    "식비",
    "의료비",
    "쇼핑",
    "교통비",
    "공과금",
    "월세",
    "이자",
    "송금",
    "기타"
]
export default function TransactionSubmitForm() {
    const [title, setTitle] = useState<string>("")
    const [transactionType, setTransactionType] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [date, setDate] = useState<Date>(new Date())
    const [category, setCategory] = useState<string>("")
    const [categoryOpen, setCategoryOpen] = useState(false)
    const [tagInput, setTagInput] = useState<string>("")
    const [tags, setTags] = useState<string[]>([])

    const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${year}년 ${month}월 ${day}일`
    }

    const handleSubmit = ()=>{
        console.log('submit')
    }

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
        }
    }
    
    const addTag = () => {
        const trimmedTag = tagInput.trim()
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag])
            setTagInput("")
        }
    }
    
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6">
            <Label htmlFor="transaction-type" className="text-xl">가계부 작성</Label>

            <div className="space-y-2">
                <Label>타이틀</Label>
                <Input
                    id="amount"
                    type="text"
                    placeholder="어떤 지출인가요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* 거래유형 선택 */}
            <div className="space-y-2">
                <Label>거래 유형</Label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setTransactionType('income')}
                        className={cn(
                            "px-6 py-3 rounded-lg border-2 transition-all font-medium cursor-pointer",
                            transactionType === 'income'
                                ? "border-gray-500"
                                : "border-gray-300 hover:border-gray-400"
                        )}
                    >
                        수입
                    </button>
                    <button
                        type="button"
                        onClick={() => setTransactionType('expense')}
                        className={cn(
                            "px-6 py-3 rounded-lg border-2 transition-all font-medium cursor-pointer",
                            transactionType === 'expense'
                                ? "border-gray-500"
                                : "border-gray-300 hover:border-gray-400"
                        )}
                    >
                        지출
                    </button>
                </div>
            </div>

            {/* 금액 입력 */}
            <div className="space-y-2">
                <Label>금액</Label>
                <Input
                    id="amount"
                    type="number"
                    placeholder="금액을 입력하세요"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                />
            </div>

            {/* 날짜 선택 */}
            <div className="space-y-2">
                <Label>날짜</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formatDate(date)}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => newDate && setDate(newDate)}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <Label>카테고리</Label>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                        >
                            선택
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <div className="grid grid-cols-3">
                            {DUMMY_CATEGORIES.map((e,index)=>(
                                <div
                                    onClick={()=>{
                                        setCategory(e)
                                        setCategoryOpen(false)}}
                                    className="text-center w-16 h-16 cursor-pointer" key={index}>{e}</div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
                <div>{category}</div>

                {/* 태그 */}
                <div className="space-y-2">
                <Label>태그 (선택사항)</Label>
                <div className="flex gap-2">
                    <Input
                        id="tags"
                        type="text"
                        placeholder="태그를 입력하세요"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        maxLength={20}
                    />
                    <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                    >
                        추가
                    </Button>
                </div>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="hover:bg-gray-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button type="submit" className="w-full">
                제출
            </Button>
            </div>
        </form>
    )
}
