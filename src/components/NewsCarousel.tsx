import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface NewsItem {
    id: number;
    title: string;
    image: string;
}

interface NewsCarouselProps {
    newsItems: NewsItem[];
}

export default function NewsCarousel({ newsItems }: NewsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying && !isFullscreen) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
            }, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [newsItems.length, isPlaying, isFullscreen]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length);
    };

    const handleImageClick = () => {
        setIsPlaying(false);
        setIsFullscreen(true);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
        setIsPlaying(true);
        document.body.style.overflow = 'auto';
    };

    // Keyboard navigation for fullscreen
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isFullscreen) return;
            if (e.key === 'Escape') handleCloseFullscreen();
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    if (!newsItems || newsItems.length === 0) return null;

    return (
        <div className="w-full group">
            {/* 16:9 Container */}
            <div className="relative w-full overflow-hidden rounded-xl shadow-2xl border border-neutral-800" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0">
                    {newsItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`Noticia ${index + 1} de ${newsItems.length}`}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
                                onClick={handleImageClick}
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 md:p-8 pt-20">
                                <h3 className="text-2xl md:text-3xl font-black text-white">{item.title}</h3>
                            </div>
                        </div>
                    ))}

                    {/* Controls - visible on hover for desktop */}
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
                        {newsItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-red-600 w-6' : 'bg-white/50 hover:bg-white'
                                    }`}
                                aria-label={`Ir a la noticia ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
                    <button
                        onClick={handleCloseFullscreen}
                        className="absolute top-6 right-6 text-neutral-400 hover:text-white bg-neutral-900/50 hover:bg-red-600 p-3 rounded-full transition-all z-50"
                        aria-label="Cerrar pantalla completa"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative w-full max-w-7xl max-h-[85vh] flex items-center justify-center">
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 md:-left-12 text-white/50 hover:text-white p-2 transition-colors z-50"
                            aria-label="Noticia anterior"
                        >
                            <ChevronLeft className="w-12 h-12" />
                        </button>

                        <img
                            src={newsItems[currentIndex].image}
                            alt={newsItems[currentIndex].title}
                            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                        />

                        <button
                            onClick={nextSlide}
                            className="absolute right-2 md:-right-12 text-white/50 hover:text-white p-2 transition-colors z-50"
                            aria-label="Noticia siguiente"
                        >
                            <ChevronRight className="w-12 h-12" />
                        </button>
                    </div>
                    <div className="mt-6 text-center">
                        <h3 className="text-2xl font-bold text-white">{newsItems[currentIndex].title}</h3>
                        <p className="text-neutral-400 mt-2">{currentIndex + 1} de {newsItems.length}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
