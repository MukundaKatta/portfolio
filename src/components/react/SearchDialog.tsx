import { useState, useEffect, useRef, useCallback } from 'react';

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      // @ts-ignore - pagefind is loaded at runtime
      if (window.pagefind) {
        // @ts-ignore
        const searchResult = await window.pagefind.search(q);
        const items = await Promise.all(
          searchResult.results.slice(0, 8).map((r: any) => r.data())
        );
        setResults(items);
      }
    } catch {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Load pagefind on first open
      // @ts-ignore
      if (!window.pagefind) {
        const script = document.createElement('script');
        script.src = '/pagefind/pagefind.js';
        script.onload = () => {
          // @ts-ignore
          window.pagefind?.init?.();
        };
        document.head.appendChild(script);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
        aria-label="Search (Cmd+K)"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-xs">Search</span>
        <kbd className="hidden lg:inline text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Mobile search button */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            <div className="flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts, projects..."
                className="flex-1 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm"
                aria-label="Search query"
              />
              <kbd
                className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                <ul className="py-2" role="listbox">
                  {results.map((result, i) => (
                    <li key={i}>
                      <a
                        href={result.url}
                        className="flex flex-col px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {result.meta?.title || 'Untitled'}
                        </span>
                        <span
                          className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : query.trim() ? (
                <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
