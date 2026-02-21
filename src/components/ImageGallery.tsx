import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface GalleryImage {
    id: number;
    url: string;
    caption?: string;
}

interface ImageGalleryProps {
    title: string;
    photographer: string;
    images: GalleryImage[];
}

export default function ImageGallery({ title, photographer, images }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;

            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowRight') {
                setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
            } else if (e.key === 'ArrowLeft') {
                setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, images.length]);

    const openModal = (index: number) => {
        setSelectedIndex(index);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedIndex(null);
        document.body.style.overflow = 'auto';
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % images.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-16 relative">
                <div className="inline-block relative">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{title}</h1>
                    <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                </div>
                <p className="text-neutral-400 mt-6 text-lg">
                    Fotos cortesía de <span className="text-red-500 font-semibold">{photographer}</span>
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl aspect-square"
                        onClick={() => openModal(index)}
                    >
                        <img
                            src={image.url}
                            alt={image.caption || `${title} - Imagen ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />

                        {/* Hover overlay with zoom icon */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-red-600/90 p-4 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                <ZoomIn className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        {image.caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <p className="text-white font-medium text-sm md:text-base text-center line-clamp-2">
                                    {image.caption}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Fullscreen Modal */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
                    onClick={closeModal}
                >
                    {/* Close button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-6 right-6 text-neutral-400 hover:text-white bg-neutral-900/50 hover:bg-red-600 p-3 rounded-full transition-all z-50"
                        aria-label="Cerrar galería"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative w-full max-w-7xl h-full max-h-[85vh] flex items-center justify-center">
                        {/* Prev button */}
                        <button
                            onClick={prevImage}
                            className="absolute left-2 md:-left-12 text-white/50 hover:text-white p-3 hover:bg-white/10 rounded-full transition-colors z-50 backdrop-blur-sm"
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeft className="w-10 h-10 md:w-16 md:h-16" />
                        </button>

                        {/* Main image */}
                        <div
                            className="relative max-h-full max-w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={images[selectedIndex].url}
                                alt={images[selectedIndex].caption || 'Galería de P1 Speedway'}
                                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Next button */}
                        <button
                            onClick={nextImage}
                            className="absolute right-2 md:-right-12 text-white/50 hover:text-white p-3 hover:bg-white/10 rounded-full transition-colors z-50 backdrop-blur-sm"
                            aria-label="Imagen siguiente"
                        >
                            <ChevronRight className="w-10 h-10 md:w-16 md:h-16" />
                        </button>
                    </div>

                    {/* Caption */}
                    <div
                        className="mt-6 text-center max-w-3xl px-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {images[selectedIndex].caption && (
                            <p className="text-xl md:text-2xl font-semibold text-white mb-2">
                                {images[selectedIndex].caption}
                            </p>
                        )}
                        <p className="text-neutral-400 font-medium">
                            {selectedIndex + 1} / {images.length}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
