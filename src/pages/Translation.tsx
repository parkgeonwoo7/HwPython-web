import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileDown, FileType, Languages, Check } from 'lucide-react';

export function Translation() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const handleDownload = () => {
    // In a real app, this would trigger the actual HWP file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = '수학문제.hwp';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-3.5rem)] flex flex-col justify-center px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto w-full text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            HWP 변환 중...
          </h1>
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
            <div className="relative mb-4 sm:mb-6">
              <Progress value={progress} className="h-2.5 sm:h-3" />
              <div className="absolute top-full left-0 right-0 mt-2.5 sm:mt-3 flex justify-between text-xs sm:text-sm text-gray-500">
                <span>텍스트 추출</span>
                <span>서식 적용</span>
                <span>HWP 변환</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mt-6 sm:mt-8">
              수학 문제를 한글 문서(HWP)로 변환하고 있습니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] flex flex-col justify-center px-3 sm:px-4 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            변환 완료
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            한글 문서(HWP)로 변환이 완료되었습니다
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex-1 p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <FileType className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                <h3 className="font-medium text-sm sm:text-base text-gray-700">원본</h3>
              </div>
              <p className="font-mono text-xs sm:text-sm">
                2x + 5 = 13<br />
                y = 3x - 2<br />
                z² = 16
              </p>
            </div>
            <div className="hidden sm:flex items-center">
              <Languages className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500" />
            </div>
            <div className="flex-1 p-4 sm:p-6 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Check className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500" />
                <h3 className="font-medium text-sm sm:text-base text-gray-700">HWP 변환 완료</h3>
              </div>
              <p className="font-mono text-xs sm:text-sm">
                이엑스 곱하기 이 더하기 오는 십삼과 같다<br />
                와이는 삼엑스 빼기 이와 같다<br />
                제트의 제곱은 십육과 같다
              </p>
            </div>
          </div>

          <Button
            onClick={handleDownload}
            className="w-full py-3 sm:py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl shadow-md transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
          >
            <FileDown className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
            한글 문서(HWP) 다운로드
          </Button>
        </div>

        <div className="mt-6 sm:mt-8 bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">HWP 파일 정보</h2>
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
            <li>• 파일 형식: 한글 문서(HWP)</li>
            <li>• 글꼴: 맑은 고딕</li>
            <li>• 글자 크기: 11pt</li>
            <li>• 줄 간격: 160%</li>
            <li>• 여백: 기본 설정</li>
          </ul>
        </div>
      </div>
    </div>
  );
}