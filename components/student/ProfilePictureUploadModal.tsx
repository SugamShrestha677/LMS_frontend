// components/ProfilePictureUploadModal.tsx
'use client';

import { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { Button } from './Button';
import { X } from 'lucide-react';

interface ProfilePictureUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUrl: string) => void;
}

export function ProfilePictureUploadModal({ isOpen, onClose, onSuccess }: ProfilePictureUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    // Get auth token from your auth store (adjust according to your implementation)
    const token = localStorage.getItem('access_token'); // or useAuthStore().token
    if (!token) {
      setError('Not authenticated');
      setUploading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/student/upload-profile-picture/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess(data.profile_picture_url);
        onClose();
        setSelectedFile(null);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--color-bg-card)] rounded-3xl w-full max-w-md shadow-2xl border border-[var(--color-border)]">
        <div className="flex justify-between items-center p-6 border-b border-[var(--color-border)]">
          <h3 className="text-2xl font-black text-[var(--color-text-primary)]">Update Profile Picture</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--color-muted)] transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <ImageUpload
            label="Choose a profile picture"
            value={selectedFile}
            onChange={(file) => setSelectedFile(file)}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}