import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, ImageIcon, FileImage, FileCheck } from 'lucide-react';

export function Upload() {
  const navigate = useNavigate();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      window.scrollTo(0, 0);
      const file = acceptedFiles[0];
      
      // 이미지 파일을 base64로 변환
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        sessionStorage.setItem('uploadedImage', base64String);
        
        // 이미지 크기 정보 가져오기
        const img = new Image();
        img.onload = () => {
          const fileInfo = {
            name: file.name,
            size: formatFileSize(file.size),
            dimensions: `${img.width}x${img.height}`
          };
          sessionStorage.setItem('fileInfo', JSON.stringify(fileInfo));
          navigate('/preview');
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, [navigate]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col justify-center px-4">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            수학 문제 이미지 변환
          </h1>
          <p className="text-xl text-gray-600">
            이미지를 업로드하여 수학 문제를 텍스트로 변환하세요
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`
            relative overflow-hidden
            border-2 border-dashed rounded-2xl p-12
            flex flex-col items-center justify-center
            transition-all duration-300 cursor-pointer
            group
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          `}
        >
          <input {...getInputProps()} />
          <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">
            {isDragActive ? (
              <div className="p-4 bg-blue-100 rounded-full">
                <UploadIcon className="w-12 h-12 text-blue-500" />
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-full">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? '여기에 파일을 놓으세요' : '이미지 업로드'}
            </p>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? '파일을 놓으면 자동으로 업로드됩니다'
                : '클릭하여 파일을 선택하거나 드래그하여 업로드하세요'}
            </p>
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              지원되는 파일 형식
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { 
                icon: <FileImage className="w-5 h-5 text-blue-500" />,
                format: 'JPG/JPEG',
                desc: '고품질 이미지 지원',
                size: '최대 10MB'
              },
              {
                icon: <FileImage className="w-5 h-5 text-green-500" />,
                format: 'PNG',
                desc: '투명 배경 지원',
                size: '최대 10MB'
              }
            ].map((item) => (
              <div
                key={item.format}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 
                  hover:border-blue-200 hover:shadow-md transition-all duration-200
                  hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  {item.icon}
                  <h3 className="font-medium text-gray-900">{item.format}</h3>
                </div>
                <p className="text-sm text-gray-500">{item.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{item.size}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}