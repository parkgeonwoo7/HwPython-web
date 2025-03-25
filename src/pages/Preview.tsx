import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Scan, RotateCcw, ImageIcon } from 'lucide-react';

interface FileInfo {
  name: string;
  size: string;
  dimensions: string; 
}

export function Preview() {
  const navigate = useNavigate();
  const [imageData, setImageData] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo>({
    name: '',
    size: '',
    dimensions: ''
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const uploadedImage = sessionStorage.getItem('uploadedImage');
    const fileInfoData = sessionStorage.getItem('fileInfo');
    
    if (uploadedImage) {
      setImageData(uploadedImage);
    }
    
    if (fileInfoData) {
      setFileInfo(JSON.parse(fileInfoData));
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] flex flex-col justify-center px-3 sm:px-4 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center space-y-2 sm:space-y-4 mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
            이미지 미리보기
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            이미지가 올바르게 업로드되었는지 확인해주세요
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {imageData && (
              <img
                src={`data:image/jpeg;base64,${imageData}`}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
          
          <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
                  <ImageIcon className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">
                    {fileInfo.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {fileInfo.size} · {fileInfo.dimensions}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto gap-2 text-xs sm:text-sm py-2 px-3 sm:px-4"
              >
                <RotateCcw className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                다시 선택
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex justify-end">
          <Button
            onClick={() => {
              if (imageData) {
                sessionStorage.setItem('ocrImage', imageData);
                navigate('/result');
              }
            }}
            className="w-full sm:w-auto px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-2 sm:gap-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
          >
            <Scan className="w-4 sm:w-5 h-4 sm:h-5" />
            OCR 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}