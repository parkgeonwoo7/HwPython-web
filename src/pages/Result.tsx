import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileType, ArrowRight, Plus, Minus } from 'lucide-react';
import axios from 'axios';

interface Choice {
  id: number;
  text: string;
}

export function Result() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [ocrText, setOcrText] = useState('');
  const [questionType, setQuestionType] = useState<'objective' | 'subjective'>('subjective');
  const [formulaCount, setFormulaCount] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([
    { id: 1, text: '' },
    { id: 2, text: '' },
    { id: 3, text: '' },
    { id: 4, text: '' },
    { id: 5, text: '' },
  ]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [conversionProgress, setConversionProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    const processOCR = async () => {
      try {
        const imageData = sessionStorage.getItem('ocrImage');
        if (!imageData) {
          navigate('/');
          return;
        }

        const response = await axios.post(
          "/api/scanner/v1/get-ocr",
          { 
            image: `data:image/jpeg;base64,${imageData}` 
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Qanda-AIDT-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiY3NtIn0.tvkY9dHM-6UP0lSR2p9B7HOzo86gGiAxXLvpBl9VRn4",
            }
          }
        ).catch(error => {
          if (error.response) {
            console.error('API 응답 에러:', error.response.data);
            console.error('상태 코드:', error.response.status);
            console.error('에러 메시지:', error.response.statusText);
            return error.response;
          } else if (error.request) {
            console.error('요청 에러:', error.request);
            return { data: { texts: [] } };
          } else {
            console.error('에러:', error.message);
            return { data: { texts: [] } };
          }
        });

        if (isMounted) {
          if (response.data && response.data.texts) {
            const text = Array.isArray(response.data.texts) ? response.data.texts.join('\n') : '텍스트 추출 실패';
            const modifiedText = text.replace(/\\\(/g, '@').replace(/\\\)/g, '@');
            setOcrText(modifiedText);
            const formulaMatches = modifiedText.match(/@[^@]*@/g) || [];
            setFormulaCount(formulaMatches.length);
          } else {
            setOcrText('텍스트 추출 실패');
            setFormulaCount(0);
          }
        }

        sessionStorage.removeItem('ocrImage');
      } catch (error: unknown) {
        if (isMounted && error && typeof error === 'object' && 'toString' in error && !error.toString().includes('CORS')) {
          console.error("OCR 처리 중 오류 발생:", error);
          setOcrText('OCR 처리 중 오류가 발생했습니다.');
        }
      }

      const timer = setInterval(() => {
        if (isMounted) {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(timer);
              setIsLoading(false);
              return 100;
            }
            return prev + 10;
          });
        }
      }, 500);

      return () => {
        clearInterval(timer);
        isMounted = false;
      };
    };

    processOCR();
  }, [navigate]);

  const addChoice = () => {
    if (choices.length < 5) {
      setChoices([...choices, { id: choices.length + 1, text: '' }]);
    }
  };

  const removeChoice = (id: number) => {
    if (choices.length > 2) {
      setChoices(choices.filter(choice => choice.id !== id));
    }
  };

  const updateChoice = (id: number, text: string) => {
    setChoices(choices.map(choice => 
      choice.id === id ? { ...choice, text } : choice
    ));
  };

  const handleConversion = async () => {
    try {
      setIsConverting(true);
      setConversionError(null);
      setConversionProgress(0);

      // 프로그레스 바 애니메이션
      const progressTimer = setInterval(() => {
        setConversionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressTimer);
            return 90;
          }
          return prev + 5;
        });
      }, 500);

      // 1. 문제 생성 요청
      const response = await fetch('http://54.180.167.112:8000/generate-problem/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: ocrText,
          equation: null,
          position: null
        })
      });
      const { request_id } = await response.json();

      // 2. 상태 확인 (완료될 때까지 반복)
      const checkStatus = async () => {
        const statusResponse = await fetch(`http://54.180.167.112:8000/status/${request_id}`);
        const status = await statusResponse.json();
        
        if (status.status === 'completed') {
          clearInterval(progressTimer);
          setConversionProgress(100);
          // 3. 파일 다운로드
          window.location.href = `http://54.180.167.112:8000/download/${status.filename}`;
          setIsConverting(false);
          return;
        } else if (status.status === 'error') {
          clearInterval(progressTimer);
          setConversionError(status.error);
          setIsConverting(false);
          return;
        }
        
        // 1초 후 다시 확인
        setTimeout(checkStatus, 1000);
      };

      checkStatus();
    } catch (error) {
      setConversionError('변환 중 오류가 발생했습니다.');
      setIsConverting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col justify-center px-4">
        <div className="max-w-3xl mx-auto w-full text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-12">
            OCR 처리 중...
          </h1>
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100">
            <div className="relative mb-8">
              <Progress value={progress} className="h-4" />
              <div className="absolute top-full left-0 right-0 mt-4 flex justify-between text-sm text-gray-500">
                <span>이미지 분석</span>
                <span>텍스트 추출</span>
                <span>수식 변환</span>
              </div>
            </div>
            <p className="text-lg text-gray-600 mt-12">
              이미지에서 수학 문제를 추출하고 있습니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col px-4 py-8 overflow-auto">
      <div className="max-w-3xl mx-auto w-full">
        {isConverting ? (
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              HWP 변환 중...
            </h1>
            <p className="text-xl text-gray-600">
              수학 문제를 한글 문서로 변환하고 있습니다
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              OCR 결과
            </h1>
            <p className="text-xl text-gray-600">
              추출된 텍스트를 확인하고 필요한 경우 수정해주세요
            </p>
          </div>
        )}

        <div className="space-y-6">
          {isConverting ? (
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100">
              <div className="relative mb-8">
                <Progress value={conversionProgress} className="h-4" />
                <div className="absolute top-full left-0 right-0 mt-4 flex justify-between text-sm text-gray-500">
                  <span>텍스트 분석</span>
                  <span>수식 변환</span>
                  <span>HWP 생성</span>
                </div>
              </div>
              <p className="text-lg text-gray-600 mt-12">
                수학 문제를 한글 문서(HWP)로 변환하고 있습니다
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileType className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">추출된 텍스트</h2>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as 'objective' | 'subjective')}
                    className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="subjective">주관식</option>
                  </select>
                </div>
              </div>
              
              <textarea
                value={ocrText}
                onChange={(e) => setOcrText(e.target.value)}
                className="w-full h-32 p-4 border rounded-xl font-mono text-gray-700 bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />

              {questionType === 'objective' && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">선택지 입력</h3>
                    {choices.length < 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addChoice}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        선택지 추가
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {choices.map((choice) => (
                      <div key={choice.id} className="flex items-center gap-2">
                        <span className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600 font-medium text-sm">
                          {choice.id}
                        </span>
                        <input
                          type="text"
                          value={choice.text}
                          onChange={(e) => updateChoice(choice.id, e.target.value)}
                          placeholder={`${choice.id}번 선택지`}
                          className="flex-1 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                        />
                        {choices.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChoice(choice.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">OCR 처리 결과</h3>
            <ul className="grid grid-cols-2 gap-3">
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                문제 유형: {questionType === 'objective' ? '객관식' : '주관식'}
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                인식된 수식: {formulaCount}개
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                처리 시간: 2.3초
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-end gap-2">
          {conversionError && (
            <p className="text-red-500 text-sm">{conversionError}</p>
          )}
          <Button
            onClick={handleConversion}
            disabled={isConverting}
            className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50"
          >
            {isConverting ? '변환 중...' : 'HWP 파일로 변환하기'}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}