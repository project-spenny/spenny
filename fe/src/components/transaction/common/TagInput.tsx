import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
interface TagInputProps {
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

export const TagInput = ({ tags, addTag, removeTag }: TagInputProps) => {
  const [tagInput, setTagInput] = useState<string>('');

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing) {
        return;
      }
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      addTag(tagInput);
      setTagInput('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label className="w-28 pr-2">태그(선택)</Label>
        <div className="flex w-full gap-2">
          <Input
            id="tags"
            type="text"
            placeholder="태그를 입력하세요"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            maxLength={20}
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            추가
          </Button>
        </div>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-24">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 hover:bg-gray-200"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
