import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ReactNode } from 'react';

interface NavBarProps {
  title: string;
  /** Show a back button – pass a path string or true for navigate(-1) */
  back?: string | boolean;
  backLabel?: string;
  right?: ReactNode;
  /** Large page-title displayed BELOW the nav bar (main tabs) */
  largeTitle?: string;
  largeTitleRight?: ReactNode;
}

export function NavBar({ title, back, backLabel = 'Back', right, largeTitle, largeTitleRight }: NavBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof back === 'string') navigate(back);
    else navigate(-1);
  };

  return (
    <div className="bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md border-b border-[#E5E5EA] dark:border-[#38383A] sticky top-0 z-20 transition-colors duration-300">
      {/* Nav row */}
      <div className="flex items-center justify-between px-4 pt-12 pb-2.5">
        {/* Left */}
        <div className="w-20">
          {back !== undefined && (
            <button
              onClick={handleBack}
              className="flex items-center gap-0.5 text-[#00AEEF] active:opacity-60 transition-opacity"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
              <span className="text-[15px]">{backLabel}</span>
            </button>
          )}
        </div>

        {/* Center title */}
        <h1 className="text-[#1D1D1F] dark:text-white text-[17px] font-semibold text-center flex-1">
          {title}
        </h1>

        {/* Right */}
        <div className="w-20 flex justify-end">
          {right}
        </div>
      </div>

      {/* Large title */}
      {largeTitle && (
        <div className="flex items-end justify-between px-4 pb-4 pt-1">
          <h2 className="text-[#1D1D1F] dark:text-white text-[28px] font-bold leading-tight">{largeTitle}</h2>
          {largeTitleRight && <div className="pb-1">{largeTitleRight}</div>}
        </div>
      )}
    </div>
  );
}
