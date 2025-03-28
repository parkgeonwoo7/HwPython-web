import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Info, AlertCircle, ArrowRight, Plus } from 'lucide-react';

const API_BASE_URL = 'http://54.180.167.112:8000';

export const Templates = () => {
  const [templates, setTemplates] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/templates/`);
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      setMessage('템플릿 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.hwp')) {
      setMessage('HWP 파일만 업로드 가능합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setMessage('파일 업로드 중...');
      const response = await fetch(`${API_BASE_URL}/templates/upload/`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      setMessage(result.message);
      fetchTemplates();
    } catch (error) {
      setMessage('파일 업로드에 실패했습니다.');
    }
  };

  const handleTemplateSelect = (templateName: string) => {
    navigate(`/create/${encodeURIComponent(templateName)}`);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground p-6 sm:p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          HWP 양식 업로드
        </h1>
        <p className="text-primary-foreground/90 leading-relaxed">
          수학 문제를 HWP 형식으로 변환하기 위한 양식을 선택하거나 새로운 양식을 업로드하세요
        </p>
      </div>

      {/* 액션 섹션 */}
      <div className="bg-card rounded-xl border border-border/60 shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">양식 업로드</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="block flex-1">
            <input
              type="file"
              accept=".hwp"
              onChange={handleUpload}
              className="hidden"
            />
            <Button 
              className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-1px] group cursor-pointer" 
              asChild
            >
              <span className="flex items-center relative z-10">
                <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                <span className="relative">
                  새 양식 업로드
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-primary-foreground/60 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </span>
            </Button>
          </label>
          <p className="text-sm text-muted-foreground">HWP 형식의 문서 템플릿을 업로드하세요</p>
        </div>
        
        <div className="mt-5 bg-muted/20 rounded-lg p-4 border border-border/40">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-base mb-2">템플릿 작성 안내</h3>
              <p className="text-muted-foreground text-sm mb-3">
                HWP 문서 내에 특정 형식의 텍스트를 작성하면 해당 위치에 문제가 자동으로 삽입됩니다
              </p>
              <div className="space-y-2">
                <div className="bg-muted/40 p-2.5 rounded-md text-xs flex items-center">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded mr-3 font-medium">[문제 1]</span>
                  <span className="text-muted-foreground">→ 이 위치에 1번 문제가 삽입됩니다</span>
                </div>
                <div className="bg-muted/40 p-2.5 rounded-md text-xs flex items-center">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded mr-3 font-medium">[문제 2]</span>
                  <span className="text-muted-foreground">→ 이 위치에 2번 문제가 삽입됩니다</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                원하는 위치에 [문제 n] 형식으로 텍스트를 넣고 HWP 파일을 업로드하세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 알림 메시지 */}
      {message && (
        <div className={`p-4 rounded-xl border animate-fadeIn ${
          message.includes('실패')
            ? 'bg-destructive/10 text-destructive border-destructive/20'
            : message.includes('중...')
              ? 'bg-muted text-muted-foreground border-muted-foreground/20'
              : 'bg-primary/10 text-primary border-primary/20'
        }`}>
          <div className="flex items-center gap-2">
            {message.includes('실패') ? 
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> : 
              <Info className="w-5 h-5 flex-shrink-0" />
            }
            <p>{message}</p>
          </div>
        </div>
      )}

      {/* 템플릿 목록 */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-border/40">
          <h2 className="text-lg font-semibold">사용 가능한 템플릿</h2>
          <p className="text-sm text-muted-foreground mt-1">선택한 템플릿을 기반으로 문서를 생성합니다</p>
        </div>
        
        {isLoading ? (
          <div className="py-16 flex items-center justify-center h-[240px]">
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
              <p className="text-muted-foreground text-sm mt-4">템플릿 목록을 불러오는 중...</p>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="p-12">
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <div className="bg-muted/40 p-4 rounded-full">
                <FileText className="w-12 h-12 text-muted-foreground/60" />
              </div>
              <h3 className="font-semibold text-lg">등록된 양식이 없습니다</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                위의 '새 양식 업로드' 버튼을 클릭하여 HWP 형식의 템플릿을 등록해주세요
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {templates.map((template) => (
              <div
                key={template}
                onClick={() => handleTemplateSelect(template)}
                className="flex items-center gap-4 p-5 hover:bg-muted/30 transition-all duration-300 cursor-pointer group relative"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 origin-bottom transition-transform duration-300 group-hover:scale-y-100"></div>
                <div className="bg-primary/10 p-2 rounded-lg transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="font-medium block transition-colors duration-300 group-hover:text-primary">{template}</span>
                  <span className="text-xs text-muted-foreground">HWP 템플릿</span>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-[-4px] relative z-20">
                  선택 <ArrowRight className="ml-1 w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 