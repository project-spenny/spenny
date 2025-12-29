'use client'
import { useState, useEffect, useMemo} from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "../ui/button"
import { supabase } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Trash } from "lucide-react"
import { CATEGORIES } from "@/constants/categories"
import { useTransactionForm } from "@/hooks/useTranscationForm"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { X } from "lucide-react"
import { ITransaction } from "@/types/transactions"

import { AmountInput } from "./common/AmountInput"
import { DatePicker } from "./common/DatePicker"
import { TagInput } from "./common/TagInput"
import { TitleInput } from "./common/TitleInput"
import { TypeSelector } from "./common/TypeSelector"
import 

interface TransactionsSubmitFormProps {
    mode : 'create' | 'edit'
    transaction? : ITransaction
    onClose : ()=> void
    onSuccess : ()=> void
}

const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}년 ${month}월 ${day}일`
}
export default function TransactionSubmitForm({
    mode, transaction, onClose, onSuccess
} : TransactionsSubmitFormProps) {
    const initialFormData = useMemo(()=>{
        if (mode === 'edit' && transaction) {
            return {
                title: transaction.title,
                type: transaction.type,
                amount: transaction.amount.toString(),
                date: new Date(transaction.date),
                category_id: transaction.category_id,
                tags: transaction.tags || []
            }
        } else {
            return{
                title: "",
                type: "",
                amount: "",
                date: new Date(),
                category_id: "",
                tags: []
            }
        }
    }, [mode, transaction])

    const {formData,
        setFormData,
        categoryOpen,
        setCategoryOpen,
        validateFormData,
        UpdateField
    } = useTransactionForm(initialFormData);

    const [tags, setTags] = useState<string[]>(
        mode === 'edit' && transaction ? (transaction.tags || []) : []
    )

    const handleSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();

        const errorMsg = validateFormData();

        if (errorMsg) {
            toast(errorMsg)
            return
        }
        try{
            const {data:{user}, error: authError } = await supabase.auth.getUser();
            if(!user||authError ){
                toast.warning('로그인이 필요합니다')
                return
            }
            const year = formData.date.getFullYear();
            const month = String(formData.date.getMonth()+1).padStart(2,'0');
            const day = String(formData.date.getDate()).padStart(2,'0');
            const formattedDate = `${year}-${month}-${day}`

            const transactionData = {
                user_id: user.id,
                title: formData.title.trim(),
                type: formData.type,
                amount: Number(formData.amount),
                date: formattedDate,
                category_id: formData.category_id,
                tags: tags.length > 0 ? formData : null
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
                type: "",
                amount: "",
                date: new Date(),
                category_id: "",
            })
            setTags([])
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

            <TitleInput
                value={formData.title}
                onChange={()=> UpdateField('title', formData.title)}
            />
            
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

            <TypeSelector
                value={formData.type}
                onChange={(type) => {
                UpdateField('type', type)
                UpdateField('category_id', '')
                }}
            />


            <AmountInput
                value={formData.amount}
                onChange={(value) => UpdateField('amount', value)}
            />

            <DatePicker
                value={formData.date}
                onChange={(date) => UpdateField('date', date)}
            />

            <TagInput tags={tags} onChange={setTags} />
            
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
        </form>
    )
}
