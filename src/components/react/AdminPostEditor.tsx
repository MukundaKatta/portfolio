import { useState, useCallback } from 'react';

interface Props {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string;
}

export default function AdminPostEditor({
  initialTitle = '',
  initialContent = '',
  initialTags = '',
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState(initialTags);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSave = useCallback(async () => {
    setStatus('saving');
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 2000);
      } else {
        throw new Error('Save failed');
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [title, content, tags]);

  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = document.getElementById('editor-content') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }, [content]);

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="editor-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Title
        </label>
        <input
          id="editor-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent text-lg"
          placeholder="Post title..."
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="editor-tags" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Tags (comma-separated)
        </label>
        <input
          id="editor-tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
          placeholder="react, typescript, tutorial"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <button onClick={() => insertMarkdown('**', '**')} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold" title="Bold">B</button>
        <button onClick={() => insertMarkdown('*', '*')} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-sm italic" title="Italic">I</button>
        <button onClick={() => insertMarkdown('`', '`')} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-mono" title="Inline code">{'{}'}</button>
        <button onClick={() => insertMarkdown('```\n', '\n```')} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono" title="Code block">{'<>'}</button>
        <button onClick={() => insertMarkdown('## ')} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-sm" title="Heading">H2</button>
        <button onClick={() => insertMarkdown('[', '](url)')} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-sm" title="Link">Link</button>
        <div className="flex-1" />
        <button
          onClick={() => setPreview(!preview)}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            preview ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div className="min-h-[400px] p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
        </div>
      ) : (
        <textarea
          id="editor-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[400px] px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono text-sm resize-y"
          placeholder="Write your post in Markdown..."
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Save Draft'}
        </button>
        {status === 'error' && (
          <span className="text-sm text-red-600 dark:text-red-400">Failed to save. Please try again.</span>
        )}
        <span className="text-xs text-slate-400 ml-auto">
          {content.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  );
}
