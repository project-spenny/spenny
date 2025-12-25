'use client'
import { useState } from "react"
import TransactionSubmitForm from "@/components/transaction/TransactionSubmitForm"
import { TransactionList } from "@/components/transaction/TransactionList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
interface Transaction {
  id: string
  title: string
  user_id: string
  category_id: string
  type: 'income' | 'expense'
  date: string
  amount: number
  fixed_rule_id: string | null
  memo: string | null
  created_at: Date
  updated_at: Date
  tags: string[]
}
export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>()

  const handleCreateNew = () => {
    setSelectedTransaction(undefined)
    setFormMode('create')
    setIsSidebarOpen(true)
  }

  const handleClose = () => {
    setIsSidebarOpen(false)
  }

  return(
      <div className="relative flex h-screen overflow-hidden">
        <div className="flex-1 overflow-auto">
          <TransactionList />
          
          <Button
            onClick={handleCreateNew}
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 md:bottom-8 md:right-8 z-30"
            size="icon"
          >
            <Plus/>
          </Button>
        </div>

        {/* moblie */}
        {isSidebarOpen && (
          <div 
            className="fixed bg-black z-20 md:hidden"
            onClick={handleClose}
          />
        )}

        <div
          className={`fixed right-0 top-0 h-full bg-white z-10 w-full md:w-96
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            border-l shadow-2xl
          `}
        >
          <TransactionSubmitForm
            mode={formMode}
            transaction={selectedTransaction}
            onClose={handleClose}
          />
        </div>
    </div>
  )
}
