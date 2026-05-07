'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  label?: string;
  value?: string | File | null;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({ label, value, onChange, onRemove, className = "", disabled = false }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' ? value : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof value === 'string') {
      setPreview(value);
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else if (!value) {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    if (disabled) return;
    setPreview(null);
    onChange(null);
    if (onRemove) onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className} ${disabled ? 'opacity-70' : ''}`}>
      {label && <label className="text-sm font-bold text-[var(--color-text-primary)]">{label}</label>}
      
      <div className={cn("relative group", disabled && "cursor-not-allowed")}>
        {preview ? (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {!disabled && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl"
                >
                  Change
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemove}
                  className="rounded-xl bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <X size={16} />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div 
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={cn(
              "w-full aspect-video rounded-2xl border-2 border-dashed border-[var(--color-border)] transition-all flex flex-col items-center justify-center gap-3 bg-[var(--color-bg-card)]/40",
              !disabled ? "hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/[0.02] cursor-pointer" : "cursor-not-allowed"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
              disabled ? "bg-gray-100 text-gray-400" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
            )}>
              <Upload size={24} />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-bold text-[var(--color-text-primary)]">
                {disabled ? 'No thumbnail' : 'Click to upload thumbnail'}
              </p>
              {!disabled && <p className="text-xs text-[var(--color-text-secondary)]">PNG, JPG or WebP (max. 2MB)</p>}
            </div>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
