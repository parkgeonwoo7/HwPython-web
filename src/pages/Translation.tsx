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
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          HWP 변환 중...
        </h1>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="relative mb-6">
            <Progress value={progress} className="h-3" />
            <div className="absolute top-full left-0 right-0 mt-2 flex justify-between text-sm text-gray-500">
              <span>텍스트 추출</span>
              <span>서식 적용</span>
              <span>HWP 변환</span>
            </div>
          </div>
          <p className="text-gray-600 mt-8">
            수학 문제를 한글 문서(HWP)로 변환하고 있습니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          변환 완료
        </h1>
        <p className="text-gray-600">
          한글 문서(HWP)로 변환이 완료되었습니다
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-6 mb-8">
          <div className="flex-1 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FileType className="w-5 h-5 text-gray-400" />
              <h3 className="font-medium text-gray-700">원본</h3>
            </div>
            <p className="font-mono text-sm">
              2x + 5 = 13<br />
              y = 3x - 2<br />
              z² = 16
            </p>
          </div>
          <Languages className="w-8 h-8 text-blue-500" />
          <div className="flex-1 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Check className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium text-gray-700">HWP 변환 완료</h3>
            </div>
            <p className="font-mono text-sm">
              이엑스 곱하기 이 더하기 오는 십삼과 같다<br />
              와이는 삼엑스 빼기 이와 같다<br />
              제트의 제곱은 십육과 같다
            </p>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
        >
          <FileDown className="w-5 h-5 mr-2" />
          한글 문서(HWP) 다운로드
        </Button>
      </div>

      <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">HWP 파일 정보</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• 파일 형식: 한글 문서(HWP)</li>
          <li>• 글꼴: 맑은 고딕</li>
          <li>• 글자 크기: 11pt</li>
          <li>• 줄 간격: 160%</li>
          <li>• 여백: 기본 설정</li>
        </ul>
      </div>
    </div>
  );
}