'use client'
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "../ui/button"
import { supabase } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Trash } from "lucide-react"
CalendarIcon
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { X } from "lucide-react"

interface Transaction {
  id: string
  title: string
  user_id : string
  category_id: string
  type: 'income' | 'expense'
  date: string
  amount: number
  fixed_rule_id : string|null
  memo : string | null
  created_at : Date
  updated_at : Date
  tags : string[]
}

interface TransactionsSubmitFormProps {
    mode : 'create' | 'edit'
    transaction? : Transaction
    onClose : ()=> void
    onSuccess : ()=> void
}
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
export default function TransactionSubmitForm({
    mode, transaction, onClose, onSuccess
} : TransactionsSubmitFormProps) {

    const [formData, setFormData] = useState({
            title: "",
            transactionType: "",
            amount: "",
            date: new Date(),
            category: "",
            tags: [] as string[]
    })

    const [categoryOpen, setCategoryOpen] = useState(false)
    const [tagInput, setTagInput] = useState<string>("")
    const [error, setError]= useState<string | null>();

    useEffect(() => {
        if (mode === 'edit' && transaction) {
            setFormData({
                title: transaction.title,
                transactionType: transaction.type,
                amount: transaction.amount.toString(),
                date: new Date(transaction.date),
                category: transaction.category_id,
                tags: transaction.tags || []
            })
        } else {
            // create 모드일 때는 초기화
            setFormData({
                title: "",
                transactionType: "",
                amount: "",
                date: new Date(),
                category: "",
                tags: []
            })
        }
    }, [mode, transaction])
    const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${year}년 ${month}월 ${day}일`
    }

    const validateFormData =()=>{
        if(!formData.title.trim()){
            const errorMsg = "제목을 입력해주세요";
            return errorMsg;
        }else if(formData.title.trim().length>20){
            const errorMsg = "제목은 20자 이내로  입력해주세요"
            return errorMsg;
        }

        if(!formData.transactionType){
            const errorMsg = "거래 유형을 선택해주세요";
            return errorMsg;
        }

        if(!formData.category){
            const errorMsg = "카테고리를 선택해주세요";
            return errorMsg;
        }

        if(!formData.amount || Number(formData.amount)<=0){
            const errorMsg = "금액은 0보다 커야 합니다"
            return errorMsg;
        }
        return null;

    }
    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();

        const errorMsg = validateFormData();
        if (errorMsg) {
            return
        }
        try{
            const {data:{user}, error: authError } = await supabase.auth.getUser();
            if(!user||authError ){
                toast.warning('로그인이 필요합니다')
                return
            }
            const formattedDate = formData.date.toISOString().split('T')[0]

            const transactionData = {
                user_id: user.id,
                title: formData.title.trim(),
                type: formData.transactionType,
                amount: Number(formData.amount),
                date: formattedDate,
                category_id: formData.category,
                tags: formData.tags.length > 0 ? formData.tags : null
            }

            if (mode === 'create') {
                const { error } = await supabase
                    .from('transactions')
                    .insert(transactionData)
                    .select()

                if(error) {
                    toast.warning("저장 실패")
                    return
                }

                toast.success("가계부 작성을 완료했습니다")
            } else {
                const { error } = await supabase
                    .from('transactions')
                    .update(transactionData)
                    .eq('id', transaction!.id)

                if (error) {
                    toast.warning("수정 실패")
                    return
                }
                toast.success("가계부 수정을 완료했습니다")
            }

            setFormData({
                title: "",
                transactionType: "",
                amount: "",
                date: new Date(),
                category: "",
                tags: []
            })
            setTagInput("")
            setError(null)
            onSuccess()
            onClose()
        }catch(error){
            toast.warning("수정 실패")
        }
    }

    const handleDelete = async () => {
        if(!transaction) return;

        if (!confirm("삭제하시겠습니까?")) return

        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', transaction.id)

            if (error) {
                toast.warning("삭제에 실패했습니다")
                return
            }

            toast.success("기록이 삭제되었습니다")
            onSuccess()
            onClose()
        } catch (error) {
            toast.error("오류가 발생했습니다")
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
        if (trimmedTag && !formData.tags.includes(trimmedTag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, trimmedTag]
            }))
            setTagInput("")
        }
    }
    
    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6">
            <div className="flex justify-between items-center sticky top-0 bg-white pb-4 border-b">
                <Label className="text-xl">
                    {mode === 'create' ? '가계부 작성' : '가계부 수정'}
                </Label>
                <Button type="button" variant="ghost" onClick={onClose}>
                    <X />
                </Button>
            </div>
            <div className="space-y-2">
                <Label>타이틀</Label>
                <Input
                    id="amount"
                    type="text"
                    placeholder="어떤 지출인가요"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                />
            </div>

            {/* 거래유형 선택 */}
            <div className="space-y-2">
                <Label>거래 유형</Label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({...prev, transactionType: 'income'}))}
                        className={cn(
                            "px-6 py-3 rounded-lg border-2 transition-all font-medium cursor-pointer",
                            formData.transactionType === 'income'
                                ? "border-gray-500"
                                : "border-gray-300 hover:border-gray-400"
                        )}
                    >
                        수입
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({...prev, transactionType: 'expense'}))}
                        className={cn(
                            "px-6 py-3 rounded-lg border-2 transition-all font-medium cursor-pointer",
                            formData.transactionType === 'expense'
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
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({...prev, amount: e.target.value}))}
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
                            {formatDate(formData.date)}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(newDate) => newDate && setFormData(prev => ({...prev, date: newDate}))}
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
                                        setFormData(prev => ({...prev, category: cat.id}))
                                        setCategoryOpen(false)}}
                                    className="text-center w-16 h-16 cursor-pointer" key={cat.id}>{cat.name}</div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
                <div>{formData.category}</div>

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
                {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
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
            <div className="flex gap-2 pt-4 sticky bottom-0 bg-background border-t pb-4">
                {mode === 'edit' && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={()=>handleDelete()}
                        className="w-10"
                    >
                        <Trash/>
                    </Button>
                )}
                <Button
                    type="submit"
                    className="flex-1"
                    onClick={(e)=>handleSubmit(e)}
                >
                    {mode === 'create' ? '저장' : '수정'}
                </Button>
            </div>
            </div>
        </form>
    )
}
