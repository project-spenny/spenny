import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export const TitleInput = ({value, onChange}: {value: string; onChange: (type: string) => void}) =>{
    return(
        <div className="space-y-2">
        <Label>타이틀</Label>
            <Input
                id="title"
                type="text"
                placeholder="어떤 지출인가요"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}