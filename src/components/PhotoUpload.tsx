import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Camera } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoSelected: (photoUrl: string) => void;
  onClose: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoSelected, onClose }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreview(imageUrl);
        onPhotoSelected(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [onPhotoSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 5242880
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
      <div className="bg-[#1a0b2e] border-2 border-[#00f3ff] p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#ffcc00]" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
            Upload Your Selfie
          </h2>
          <button onClick={onClose} className="text-[#ff00e0] hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        {!preview ? (
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-[#00f3ff] p-8 text-center cursor-pointer hover:bg-[#00f3ff]/10 transition"
          >
            <input {...getInputProps()} />
            <Upload size={48} className="mx-auto mb-4 text-[#00f3ff]" />
            {isDragActive ? (
              <p style={{ fontFamily: 'monospace' }}>Drop your photo here...</p>
            ) : (
              <>
                <p style={{ fontFamily: 'monospace' }}>Upload your best selfie</p>
                <p className="text-sm text-gray-400 mt-2" style={{ fontFamily: 'monospace' }}>
                  JPG, PNG up to 5MB
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="text-center">
            <img
              src={preview}
              alt="Your selfie"
              className="w-48 h-48 object-cover rounded-full mx-auto mb-4 border-4 border-[#ffcc00]"
            />
            <p className="text-[#00f3ff] mb-2" style={{ fontFamily: 'monospace' }}>Photo ready!</p>
            <button
              onClick={() => setPreview(null)}
              className="text-sm text-[#ff00e0] underline"
              style={{ fontFamily: 'monospace' }}
            >
              Choose different
            </button>
          </div>
        )}
        
        <div className="mt-6 flex gap-3">
          {preview && (
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-[#4a0e6b] border border-[#00f3ff] text-white hover:bg-[#00f3ff] hover:text-[#1a0b2e] transition"
              style={{ fontFamily: 'monospace' }}
            >
              Continue
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-[#ff00e0] text-[#ff00e0] hover:bg-[#ff00e0] hover:text-[#1a0b2e] transition"
            style={{ fontFamily: 'monospace' }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;