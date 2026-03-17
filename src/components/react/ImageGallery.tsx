import { useState, useCallback, useEffect } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface Props {
  images: GalleryImage[];
}

export default function ImageGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = useCallback(() => setSelectedIndex(null), []);

  const next = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
  }, [images.length]);

  const prev = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));
  }, [images.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedIndex, close, next, prev]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-8">
        {images.map((image, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 hover:opacity-90 transition-opacity focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            aria-label={`View ${image.alt}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" role="dialog" aria-modal="true" aria-label="Image viewer">
          <button
            onClick={close}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close gallery"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={prev}
            className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="max-w-4xl max-h-[85vh] mx-16 flex flex-col items-center">
            <img
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            {images[selectedIndex].caption && (
              <p className="mt-3 text-sm text-white/70 text-center">{images[selectedIndex].caption}</p>
            )}
            <p className="mt-1 text-xs text-white/50">
              {selectedIndex + 1} / {images.length}
            </p>
          </div>

          <button
            onClick={next}
            className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Next image"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
