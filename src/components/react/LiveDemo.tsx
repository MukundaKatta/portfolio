import { useState } from 'react';

interface Props {
  code: string;
  title?: string;
}

export default function LiveDemo({ code, title = 'Live Demo' }: Props) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  return (
    <div className="my-8 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</span>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              activeTab === 'code'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        <div className="p-6 bg-white dark:bg-slate-900">
          <div dangerouslySetInnerHTML={{ __html: code }} />
        </div>
      ) : (
        <pre className="p-4 bg-slate-950 text-slate-300 text-sm overflow-x-auto font-mono">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
