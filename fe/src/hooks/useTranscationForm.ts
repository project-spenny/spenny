import { useState, useMemo } from "react";

interface IFormData{
    title : string
    type : string
    amount : string
    date : Date,
    category_id : string
}

export const useTransactionForm = (initialData? : IFormData) =>{

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [formData, setFormData] = useState<IFormData>({
        title: initialData?.title || "",
        type: initialData?.type || "",
        amount: initialData?.amount.toString() || "",
        date: initialData?.date || new Date(),
        category_id: initialData?.category_id  || "",
    })

    const validateFormData =()=>{
        if(!formData.title.trim()){
            const errorMsg = "제목을 입력해주세요";
            return errorMsg;
        }

        if(formData.title.trim().length>20){
            const errorMsg = "제목은 20자 이내로  입력해주세요"
            return errorMsg;
        }

        if(!formData.type){
            const errorMsg = "거래 유형을 선택해주세요";
            return errorMsg;
        }

        if(!formData.category_id){
            const errorMsg = "카테고리를 선택해주세요";
            return errorMsg;
        }

        if(!formData.amount || Number(formData.amount)<=0){
            const errorMsg = "금액은 0보다 커야 합니다"
            return errorMsg;
        }
        return null;
        
    }
    return {
        formData,
        setFormData,
        categoryOpen,
        setCategoryOpen,
        validateFormData
    }
}