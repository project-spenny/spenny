import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CATEGORIES } from "@/constants/categories"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface CategorySelectorProps {
    transactionType: string
    value: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onChange: (category: string) => void
}

export const CategorySelector = ({ 
        transactionType, 
        value, 
        open, 
        onOpenChange, 
        onChange 
    }: CategorySelectorProps) => {

    if (!transactionType) return null

    const categories = transactionType === "income" 
        ? CATEGORIES.income 
        : CATEGORIES.expense

    return (
        <div className="space-y-2">
            <Label>카테고리</Label>
            <Popover open={open} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                    >{ value === ""  ? "선택" 
                        : categories.find(cat => cat.category_key === value)?.name_ko || "선택"
            }
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="grid grid-cols-3">
                        {categories.map((cat)=>(
                            <div
                                onClick={()=>{
                                    onChange(cat.category_key)
                                    onOpenChange(false)}}
                                className="flex items-center justify-center text-center w-24 h-16 cursor-pointer text-sm hover:bg-gray-100" key={cat.category_key}>{cat.name_ko}</div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
