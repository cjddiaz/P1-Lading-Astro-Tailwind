import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

// Define the interface for a calendar item
interface CalendarItem {
    id: number | string;
    image: string;
    title: string;
}

// Define the props for the component
interface CalendarCarouselProps {
    calendarItems: CalendarItem[];
}

const CalendarCarousel: React.FC<CalendarCarouselProps> = ({ calendarItems }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % calendarItems.length);
    }, [calendarItems.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + calendarItems.length) % calendarItems.length);
    }, [calendarItems.length]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isPlaying && !isFullscreen && calendarItems.length > 1) {
            interval = setInterval(nextSlide, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, isFullscreen, calendarItems.length, nextSlide]);

    const handleImageClick = () => {
        setIsPlaying(false);
        setIsFullscreen(true);
        // Prevent scrolling when full screen
        document.body.style.overflow = 'hidden';
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
        setIsPlaying(true);
        document.body.style.overflow = 'auto';
    };

    if (!calendarItems || calendarItems.length === 0) return null;

    return (
        <div className="w-full relative mx-auto group">
            {/* Aspect Ratio Container (Portrait format like calendar) */}
            <div className="relative w-full overflow-hidden rounded-xl border border-neutral-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] md:hover:border-red-600/50 transition-colors duration-500 bg-neutral-900" style={{ paddingTop: '141.4%' }}> {/* ~A4 aspect ratio */}
                <div className="absolute inset-0">
                    {calendarItems.map((item: CalendarItem, index: number) => (
                        <div
                            key={item.id}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentIndex
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-95 pointer-events-none'
                                }`}
                            aria-hidden={index !== currentIndex}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-contain cursor-zoom-in bg-black p-2"
                                onClick={handleImageClick}
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 p-6 pointer-events-none opacity-0 md:opacity-100">
                                <h3 className="text-xl font-bold tracking-wide text-white">{item.title}</h3>
                                <p className="text-sm text-neutral-400">Click para expandir</p>
                            </div>
                        </div>
                    ))}

                    {calendarItems.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 border border-white/10"
                                aria-label="Anterior"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 border border-white/10"
                                aria-label="Siguiente"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Controls to pause/play and index indicators */}
                    {calendarItems.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 opacity-0 md:group-hover:opacity-100 transition-opacity">
                            {calendarItems.map((_: CalendarItem, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-red-500 w-5' : 'bg-white/50 hover:bg-white'} `}
                                    aria-label={`Ir al slide ${idx + 1}`}
                                />
                            ))}
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="ml-2 text-white/70 hover:text-white"
                                aria-label={isPlaying ? "Pausar" : "Reproducir"}
                            >
                                {isPlaying ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Fullscreen Overlay */}
            {isFullscreen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300"
                    onClick={handleCloseFullscreen}
                >
                    <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[101]">
                        <button
                            onClick={handleCloseFullscreen}
                            className="text-white bg-neutral-900/50 hover:bg-red-600 p-3 rounded-full transition-colors duration-300 border border-white/10 flex items-center gap-2 group"
                            aria-label="Cerrar pantalla completa"
                        >
                            <span className="text-sm font-semibold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all absolute right-full pr-4 whitespace-nowrap hidden sm:block">
                                Cerrar pantalla
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="w-full h-full p-4 md:p-12 flex items-center justify-center" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <img
                            src={calendarItems[currentIndex].image}
                            alt={calendarItems[currentIndex].title}
                            className="max-h-full max-w-full object-contain rounded drop-shadow-2xl select-none"
                        />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default CalendarCarousel;
