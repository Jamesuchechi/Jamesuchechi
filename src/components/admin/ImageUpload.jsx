'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FiUpload, FiX } from 'react-icons/fi';

export default function ImageUpload({ label, value, onChange, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          let message = 'Upload failed';
          try {
            const err = await res.json();
            if (err?.error) message = err.error;
            if (err?.details) message = `${message}: ${err.details}`;
          } catch {
            // Ignore parse failures and use the default message.
          }
          throw new Error(message);
        }
        return res.json();
      });

      const results = await Promise.all(uploadPromises);
      
      if (multiple) {
        const newUrls = results.map(r => r.url);
        onChange([...(Array.isArray(value) ? value : []), ...newUrls]);
      } else {
        onChange(results[0].url);
        setPreview(results[0].url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    if (multiple && Array.isArray(value)) {
      const newValue = value.filter((_, i) => i !== index);
      onChange(newValue);
    } else {
      onChange('');
      setPreview('');
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${
          uploading ? 'border-blue-400 bg-blue-50' : 'hover:border-gray-400'
        }`}>
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {/* Preview */}
      {preview && !multiple && (
        <div className="relative inline-block">
          <Image
            src={preview}
            alt="Preview"
            width={200}
            height={200}
            className="rounded-lg object-cover"
          />
          <button
            onClick={() => removeImage()}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Multiple Preview */}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative">
              <Image
                src={url}
                alt={`Preview ${index + 1}`}
                width={150}
                height={150}
                className="rounded-lg object-cover w-full h-32"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
