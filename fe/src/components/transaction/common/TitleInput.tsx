import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export const TitleInput = ({value, onChange}: {value: string; onChange: () => void})=>{
    return(
        <div className="space-y-2">
        <Label>타이틀</Label>
            <Input
                id="amount"
                type="text"
                placeholder="어떤 지출인가요"
                value={value}
                onChange={onChange}
            />
        </div>
    )
}