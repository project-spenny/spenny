import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent,PopoverTrigger } from "@/components/ui/popover";

const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}년 ${month}월 ${day}일`
}

export const DatePicker = ({value, onChange}: {value: Date; onChange: (date: Date) => void}) =>{
    return(
        <div className="space-y-2">
            <Label>날짜</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(value)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={(newDate) => newDate && onChange(newDate)}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}