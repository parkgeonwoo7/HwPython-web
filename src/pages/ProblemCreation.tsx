import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Download, Info, FileText, AlertCircle, CheckCircle, HomeIcon } from 'lucide-react';

const API_BASE_URL = 'http://54.180.167.112:8000';

interface Question {
  number: number;
  content: string;
}

export const ProblemCreation = () => {
  const { templateName } = useParams<{ templateName: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchQuestionNumbers = async () => {
      if (!templateName) return;

      try {
        const response = await fetch(`${API_BASE_URL}/templates/${encodeURIComponent(templateName)}/questions`);
        if (!response.ok) {
          throw new Error('문제 번호를 가져오는데 실패했습니다.');
        }
        const data = await response.json();
        setAvailableNumbers(data.question_numbers);
        
        const initialQuestions = data.question_numbers.map((number: number) => ({
          number,
          content: ''
        }));
        setQuestions(initialQuestions);
      } catch (error) {
        setError('템플릿의 문제 번호를 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionNumbers();
  }, [templateName]);

  // 로딩 진행 애니메이션 효과
  useEffect(() => {
    if (status === 'generating') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + 5;
        });
      }, 500);
      return () => clearInterval(interval);
    } else if (status === 'completed') {
      setProgress(100);
    } else {
      setProgress(0);
    }
  }, [status]);

  const handleQuestionChange = (index: number, content: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], content };
    setQuestions(newQuestions);
  };

  const generateProblem = async () => {
    if (!templateName) return;

    try {
      setStatus('generating');
      setError('');
      setProgress(10);

      const response = await fetch(`${API_BASE_URL}/generate-problem/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_name: decodeURIComponent(templateName),
          questions: questions,
        }),
      });

      const data = await response.json();
      if (data.request_id) {
        pollStatus(data.request_id);
      } else {
        throw new Error('요청 ID를 받지 못했습니다.');
      }
    } catch (error) {
      setStatus('error');
      setError('HWP 변환 요청에 실패했습니다.');
    }
  };

  const pollStatus = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/status/${id}`);
      const data = await response.json();

      if (data.status === 'completed') {
        setStatus('completed');
        setFilename(data.filename);
      } else if (data.status === 'error') {
        setStatus('error');
        setError(data.error || 'HWP 변환 중 오류가 발생했습니다.');
      } else {
        setTimeout(() => pollStatus(id), 1000);
      }
    } catch (error) {
      setStatus('error');
      setError('상태 확인 중 오류가 발생했습니다.');
    }
  };

  const downloadFile = async (filename: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/download/${filename}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('파일 다운로드에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-75"></div>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center relative">
              <FileText className="w-8 h-8 text-primary/60 animate-pulse" />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="h-4 w-48 bg-muted rounded-full animate-pulse mx-auto"></div>
            <div className="h-3 w-32 bg-muted/80 rounded-full animate-pulse mx-auto"></div>
          </div>
          <p className="text-muted-foreground text-sm mt-4">템플릿 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const emptyQuestions = questions.some(q => !q.content.trim());
  const buttonDisabled = status === 'generating' || emptyQuestions;

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn pb-8">
      {/* 헤더 및 네비게이션 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2 hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">템플릿 목록으로</span>
          </Button>
        </div>

        <nav className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 px-3 rounded-lg">
          <HomeIcon className="w-3.5 h-3.5" />
          <button 
            onClick={() => navigate('/')}
            className="hover:text-foreground transition-colors hover:underline"
          >
            템플릿 목록
          </button>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">
            {decodeURIComponent(templateName || '')}
          </span>
        </nav>

        <div className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground p-6 sm:p-8 rounded-xl shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            문제 입력
          </h1>
          
          {availableNumbers.length > 0 && (
            <p className="text-primary-foreground/90 leading-relaxed flex items-start gap-2">
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-md text-sm font-medium shrink-0">
                {availableNumbers.length}개
              </span>
              <span>문제를 입력할 수 있습니다. 모든 문제를 채워주세요.</span>
            </p>
          )}
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-card rounded-xl border border-border/60 shadow-sm p-6">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full shrink-0">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-1">수식 입력 안내</h3>
            <p className="text-muted-foreground text-sm">
              수식은 <code className="bg-muted px-1.5 py-0.5 rounded text-xs">@</code> 기호로 감싸서 입력하세요
            </p>
            <div className="mt-2 bg-muted/40 p-3 rounded-lg text-xs">
              <span className="text-muted-foreground mr-3">예시:</span>
              <code>@x^{2}@</code> <span className="text-muted-foreground mx-2">→</span> x²
            </div>
          </div>
        </div>
      </div>

      {/* 문제 입력 폼 */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div 
            key={index}
            className="p-5 sm:p-6 bg-card rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
              <span className="bg-primary/10 h-7 w-7 rounded-lg flex items-center justify-center text-sm">
                {question.number}
              </span>
              <span>번 문제</span>
            </h2>
            <textarea
              rows={5}
              value={question.content}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              placeholder="문제 내용을 입력하세요 (수식은 @ 기호로 감싸주세요)"
              className="w-full p-4 rounded-lg bg-background border border-input hover:border-ring focus:border-ring focus:ring-1 focus:ring-ring transition-colors resize-none font-medium"
            />
            {!question.content.trim() && (
              <p className="mt-2 text-xs text-destructive flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3" />
                <span>문제 내용을 입력해주세요</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 flex items-start gap-3 shadow-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">오류가 발생했습니다</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* 변환 액션 영역 */}
      <div className="p-5 sm:p-6 bg-card rounded-xl border border-border shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {status !== 'completed' ? (
            <Button
              onClick={generateProblem}
              disabled={buttonDisabled}
              className={`sm:w-auto w-full gap-2 ${buttonDisabled ? '' : 'animate-pulse'}`}
            >
              {status === 'generating' ? (
                <>변환 중...</>
              ) : (
                <>HWP 문서로 변환</>
              )}
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => downloadFile(filename)}
                className="sm:w-auto w-full gap-2 border-primary/20 text-primary hover:bg-primary/5"
              >
                <Download className="w-4 h-4" />
                <span>파일 다운로드</span>
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                className="sm:w-auto w-full gap-2 bg-primary/90 hover:bg-primary text-primary-foreground"
              >
                <HomeIcon className="w-4 h-4" />
                <span>메인 페이지로</span>
              </Button>
            </div>
          )}

          {status === 'generating' && (
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>변환 중...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {status === 'completed' && (
            <div className="flex items-center gap-2 text-primary sm:ml-auto bg-primary/5 py-1.5 px-3 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium text-sm whitespace-nowrap">변환 완료! 파일을 다운로드하세요.</span>
            </div>
          )}

          {emptyQuestions && status !== 'generating' && status !== 'completed' && (
            <p className="text-xs text-muted-foreground sm:ml-auto flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 text-destructive" />
              <span>모든 문제를 입력해주세요</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 