import { Outlet, useNavigate } from 'react-router-dom';

export function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b bg-white fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 h-14 sm:h-16 flex items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <img src="/logo.png" alt="HwPython" className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="text-lg sm:text-xl font-semibold text-gray-900">HwPython</span>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full pt-14 sm:pt-16 mt-6 sm:mt-8 mb-6 sm:mb-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-12 sm:h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="HwPython" className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />
            <p className="text-xs sm:text-sm text-gray-400">
              © 2025 HwPython
            </p>
          </div>
          <a 
            href="https://snuai.net" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs sm:text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5"
          >
            <span className="hidden sm:inline">Powered by</span>
            <span className="font-medium">SNUAI</span>
          </a>
        </div>
      </footer>
    </div>
  );
}