import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const routes = [
  { path: '/preview', title: '이미지 미리보기' },
  { path: '/result', title: 'OCR 결과' },
  { path: '/translation', title: 'HWP 변환' },
];

export function Header() {
  const location = useLocation();
  const currentRoute = routes.find(route => route.path === location.pathname);
  const showBack = location.pathname !== '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="HwPython Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                HwPython
              </span>
            </Link>
            {currentRoute && (
              <div className="hidden sm:flex items-center gap-2 text-gray-400">
                <span>/</span>
                <span className="text-gray-600">{currentRoute.title}</span>
              </div>
            )}
          </div>
          
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              이전 단계
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 