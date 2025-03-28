import { Outlet, useNavigate } from 'react-router-dom';

export function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl h-14 sm:h-16">
          <div className="flex h-full items-center justify-between">
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-primary/5 scale-110" />
                <img 
                  src="/logo.png" 
                  alt="HwPython" 
                  className="relative w-8 h-8 sm:w-9 sm:h-9 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="logo-text text-lg sm:text-xl font-bold bg-gradient-to-r from-primary/80 via-primary to-primary/90 bg-clip-text text-transparent">
                  HwPython
                </span>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground/90 font-medium -mt-0.5">
                  수학 문제 HWP 변환기
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-7xl py-6 sm:py-8 animate-fadeIn">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="HwPython" 
              className="w-4 h-4 sm:w-5 sm:h-5 opacity-40"
            />
            <p className="header-footer-text text-xs sm:text-sm text-muted-foreground">
              © 2025 HwPython
            </p>
          </div>
          <a 
            href="https://snuai.net" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="header-footer-text text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <span className="hidden sm:inline">Powered by</span>
            <span className="font-medium">SNUAI</span>
          </a>
        </div>
      </footer>
    </div>
  );
}