import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const TagInput = ({tags, onChange} : { tags : string[], onChange : (tags:string[])=>void})=>{
    const [tagInput, setTagInput] = useState<string>("")
    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (e.nativeEvent.isComposing) {
                return;
            }   
            e.preventDefault()
            addTag()
        }
    }
    
    const addTag = () => {
        const trimmedTag = tagInput.trim()
        if (trimmedTag && !tags.includes(trimmedTag)) {
            onChange([...tags, trimmedTag])
            setTagInput("")
        }
    }
    
    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove))
    }
    return(
        <div className="space-y-2">
                <Label>태그 (선택사항)</Label>
                <div className="flex gap-2">
                    <Input
                        id="tags"
                        type="text"
                        placeholder="태그를 입력하세요"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        maxLength={20}
                    />
                    <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                    >
                        추가
                    </Button>
                </div>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="hover:bg-gray-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
    )
}