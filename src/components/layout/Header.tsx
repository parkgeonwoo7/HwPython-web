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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link 
              to="/" 
              className="group flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-100 transform group-hover:scale-105 transition-transform">
                <img
                  src="/logo.png"
                  alt="HwPython Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                  HwPython
                </span>
                <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium -mt-0.5 sm:-mt-1 hidden sm:block">
                  수학 문제 변환기
                </span>
              </div>
            </Link>
            {currentRoute && (
              <div className="hidden sm:flex items-center gap-2 text-gray-400">
                <span>/</span>
                <span className="text-gray-600 font-medium">{currentRoute.title}</span>
              </div>
            )}
          </div>
          
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="gap-1.5 sm:gap-2 hover:bg-gray-50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">이전 단계</span>
              <span className="sm:hidden">이전</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 