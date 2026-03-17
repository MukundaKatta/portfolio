import { useState, useEffect } from 'react';

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  navItems: NavItem[];
  currentPath: string;
}

export default function MobileMenu({ navItems, currentPath }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-nav"
            className="fixed top-16 right-0 bottom-0 w-64 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 z-50 p-6 animate-slide-down"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-1" role="list">
              {navItems.map(({ label, href }) => {
                const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href));
                return (
                  <li key={href}>
                    <a
                      href={href}
                      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
