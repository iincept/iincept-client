import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function VariantTagInput({ 
  label, 
  placeholder, 
  tags = [], 
  onChange, 
  maxTags = 20 
}) {
  const [inputValue, setInputValue] = useState('');

  const addTags = (value) => {
    // Split by comma
    const rawItems = value.split(',');
    const newTags = [];

    for (let item of rawItems) {
      const cleanItem = item.trim();
      
      // Empty check
      if (!cleanItem) continue;

      // Duplicate check
      if (tags.includes(cleanItem) || newTags.includes(cleanItem)) continue;

      // Max tags validation
      if (tags.length + newTags.length >= maxTags) {
        alert(`Maximum ${maxTags} tags allowed for ${label}`);
        break;
      }

      newTags.push(cleanItem);
    }

    if (newTags.length > 0) {
      onChange([...tags, ...newTags]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTags(inputValue);
      }
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    // If user types a comma, immediately convert preceding text to tag
    if (val.endsWith(',')) {
      addTags(val);
    } else {
      setInputValue(val);
    }
  };

  const removeTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, idx) => idx !== indexToRemove);
    onChange(updatedTags);
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[10px] text-zinc-500 font-medium">
          {tags.length} / {maxTags} tags
        </span>
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || `Type value and press Enter or Comma`}
          className="w-full pl-4 pr-12 py-3 rounded-xl border border-zinc-200 focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none text-sm transition-all bg-white"
        />
        <button
          type="button"
          onClick={() => {
            if (inputValue.trim()) addTags(inputValue);
          }}
          className="absolute right-2 p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg transition-colors cursor-pointer"
          title="Add tag"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Render Tags Preview Row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1.5">
          {tags.map((tag, idx) => (
            <div
              key={`${tag}-${idx}`}
              className="group flex items-center gap-1.5 px-3 py-1 bg-zinc-50 text-zinc-800 border border-zinc-200/80 rounded-full text-xs font-medium hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-200 select-none animate-in fade-in zoom-in-95 duration-150"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="p-0.5 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700 transition-all cursor-pointer flex items-center justify-center shrink-0"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
