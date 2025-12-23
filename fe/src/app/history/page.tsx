import TransactionSubmitForm from "@/components/transaction/TransactionSubmitForm"
import { TransactionList } from "@/components/transaction/TransactionList"
export default function page() {
  return(
      <>
          <div>calendar</div>
          <TransactionSubmitForm/>
          <TransactionList/>
      </>
  )
}
