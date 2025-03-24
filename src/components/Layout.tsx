import { Outlet, useNavigate } from 'react-router-dom';

export function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b bg-white fixed top-0 w-full z-10">
        <div className="w-full px-4 h-14 flex items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <img src="/logo.png" alt="HwPython" className="w-6 h-6" />
            <span className="text-xl font-semibold text-gray-900">HwPython</span>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full pt-14">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-100">
        <div className="w-full px-4 h-12 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © 2025 HwPython. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://snuai.net" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900">Who are we?</a>
          </div>
        </div>
      </footer>
    </div>
  );
}