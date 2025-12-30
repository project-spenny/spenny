import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
export const TypeSelector = ({value, onChange}: {value: string; onChange: (type: string) => void})=>{
    return(
        <div className="space-y-2">
            <Label>거래 유형</Label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => onChange('income')}
                    className={cn(
                        "px-6 py-3 rounded-lg border-2 transition-all font-medium cursor-pointer",
                        value === 'income'
                            ? "border-gray-500"
                            : "border-gray-300 hover:border-gray-400"
                    )}
                >
                    수입
                </button>
                <button
                    type="button"
                    onClick={() => onChange('expense')}
                    className={cn(
                        "px-6 py-3 rounded-lg border-2 transition-all font-medium cursor-pointer",
                        value === 'expense'
                            ? "border-gray-500"
                            : "border-gray-300 hover:border-gray-400"
                    )}
                >
                    지출
                </button>
            </div>
        </div>
    )
}
