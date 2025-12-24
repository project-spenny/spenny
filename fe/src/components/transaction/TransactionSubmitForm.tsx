'use client'
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "../ui/button"
import { supabase } from "@/utils/supabase/client"
CalendarIcon
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { X } from "lucide-react"

const CATEGORIES = [
    { id: "3de48bfe-69d9-4dbb-9a5d-ecdb807212f2", name: "식비", type: "expense" },
    { id: "fd66cd8e-83bc-4720-8d71-34046524a849", name: "의료비", type: "expense" },
    { id: "d9f8e176-2594-4a5c-a089-d6cae2fd97ff", name: "쇼핑", type: "expense" },
    { id: "2f7b8dc5-9c32-4065-ac70-0edc3a02502c", name: "주거비", type: "expense" },
    { id: "0f93d6d5-5fd0-416a-b9b0-2e42539c0ad9", name: "교통비", type: "expense" },
    { id: "bee38c89-2393-4f72-8d77-314ca2b9c7e6", name: "문화생활", type: "expense" },
    { id: "92a9dabd-ca15-420e-be12-2b34ab37dfb3", name: "통신비", type: "expense" },
    { id: "94b763c9-48cd-4435-b21b-d93a41dd49da", name: "교육비", type: "expense" },
    { id: "fb48697f-5cae-41e3-869b-0c4922523955", name: "기타", type: "expense" }
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
    const [error, setError]= useState<string | null>();

    const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${year}년 ${month}월 ${day}일`
    }

    const validateFormData =()=>{
        setError(null);

        if(!title.trim()){
            setError("제목을 입력해주세요");
            return false;
        }else if(title.trim().length>20){
            setError("제목은 20자 이내로  입력해주세요")
            return false;
        }

        if(!transactionType){
            setError("거래 유형을 선택해주세요");
            return false;
        }

        if(!category){
            setError("카테고리를 선택해주세요");
            return false;
        }

        if(!amount || Number(amount)<=0){
            setError("금액은 0보다 커야 합니다")
            return false;
        }
        return true;

    }
    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();

        try{
            const {data:{user}, error: authError } = await supabase.auth.getUser();
            if(!user||authError ){
                console.log("로그인이 필요합니다")
            }
            const formattedDate = date.toISOString().split('T')[0]

            const { data, error } = await supabase
                .from('transactions')
                .insert({
                    user_id: user?.id,
                    title: title.trim(),
                    type: transactionType,
                    amount: Number(amount),
                    date: formattedDate,
                    category_id: category,
                    tags: tags.length > 0 ? tags : null
                })
                .select()

                console.log(data)
                if (error) {
                    console.error('Insert error:', error)
                    alert("저장 실패: " + error.message)
                    return
                }

            alert("거래 내역이 저장되었습니다")

        }catch(error){
            console.log('error')
        }
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
                            {CATEGORIES.map((cat)=>(
                                <div
                                    onClick={()=>{
                                        setCategory(cat.id)
                                        setCategoryOpen(false)}}
                                    className="text-center w-16 h-16 cursor-pointer" key={cat.id}>{cat.name}</div>
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
