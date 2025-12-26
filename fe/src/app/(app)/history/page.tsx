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
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSelectTransaction = (transaction: Transaction) => {
    console.log(transaction)
    setSelectedTransaction(transaction)
    setFormMode('edit')
    setIsSidebarOpen(true)
  }

  const handleCreateNew = () => {
    setSelectedTransaction(undefined)
    setFormMode('create')
    setIsSidebarOpen(true)
  }

  const handleClose = () => {
    setIsSidebarOpen(false)
  }

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return(
      <>
        <div className="flex w-full h-screen overflow-hidden border-2">
          <div className="flex-1 overflow-auto">
            <Button
              onClick={handleCreateNew}
              className="rounded-full w-12 h-12 z-50 mr-4"
              size="icon"
            >
              <Plus/>
            </Button>
            <TransactionList refreshKey={refreshKey} onSelectTransaction={handleSelectTransaction} />
          </div>

          {isSidebarOpen && (
            <div className="w-96 border-l shadow-2xl overflow-auto bg-white">
              <TransactionSubmitForm
                mode={formMode}
                transaction={selectedTransaction}
                onClose={handleClose}
                onSuccess={handleSuccess}
              />
            </div>
          )}
        </div>
      </>
  )
}
