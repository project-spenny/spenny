'use client'
import { useState } from "react"
import TransactionSubmitForm from "@/components/transaction/TransactionSubmitForm"
import { TransactionList } from "@/components/transaction/TransactionList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ITransaction } from "@/types/transactions"
import ResponsivePanel from "@/components/panel/ResponsivePanel"

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | undefined>()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSelectTransaction = (transaction: ITransaction) => {
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
        <ResponsivePanel trigger={<Button>sdfd</Button>}>
          <div>hi</div>
        </ResponsivePanel>
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
