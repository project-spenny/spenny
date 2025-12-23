'use client'
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item"

const dummyTransactions = [
  { title:'점심 식사', category_id: 'cat-001', type: 'expense', date: '2024-12-23', amount: 15000 },
  { title:'출/퇴근 교통비', category_id: 'cat-002', type: 'expense', date: '2024-12-22', amount: 3500 },
  { title:'장갑 구매', category_id: 'cat-003', type: 'expense', date: '2024-12-21', amount: 45000 },
  { title:'월급', category_id: 'cat-004', type: 'income', date: '2024-12-20', amount: 3000000 },
  { title:'간식', category_id: 'cat-001', type: 'expense', date: '2024-12-20', amount: 8500 },
  { title:'대출 이자', category_id: 'cat-005', type: 'expense', date: '2024-12-19', amount: 120000 },
  { title:'티셔츠 구매', category_id: 'cat-006', type: 'expense', date: '2024-12-18', amount: 55000 }
]


export const TransactionList = () => {
    return (
        <div className="space-y-6 max-w-md mx-auto p-6">
            <Label className="text-xl">가계부</Label>
            {dummyTransactions.map((e,index)=>(
            <Item variant="outline" key={index}>
                <ItemContent className="flex flex-row items-center">
                    <div className="flex flex-col gap-1 w-24">
                        <span className="text-xs text-muted-foreground">{e.date}</span>
                        <span className={cn('font-bold text-sm', e.type==='income'?'text-blue-400' : 'text-red-400')}>
                            {e.type==='income'?'+':'-'}{e.amount.toLocaleString()}원
                        </span>
                    </div>
                    <ItemTitle className="p-2 text-left">{e.title}</ItemTitle>
                    <ItemActions className="ml-auto">
                        <Button className="cursor-pointer" size="sm">
                            <ChevronRight/>
                        </Button>
                    </ItemActions>
                </ItemContent>
            </Item>
            ))}
        </div>
    )
}
