"use client";

import { useState, useRef } from "react";
import { Camera, X, Check, Image as ImageIcon } from "lucide-react";

interface CameraInputProps {
    onImageSelected: (file: File) => void;
}

export default function CameraInput({ onImageSelected }: CameraInputProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onImageSelected(file);
        }
    };

    const clearImage = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (galleryInputRef.current) galleryInputRef.current.value = "";
    };

    const triggerCamera = () => {
        fileInputRef.current?.click();
    };

    const triggerGallery = () => {
        galleryInputRef.current?.click();
    }

    if (preview) {
        return (
            <div className="flex flex-col items-center w-full">
                <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-lg border-4 border-white mb-6">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                    />
                    <button
                        onClick={clearImage}
                        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition backdrop-blur-sm"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex gap-4 w-full max-w-md">
                    <button
                        onClick={clearImage}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition active:scale-95"
                    >
                        <Camera size={20} />
                        Retake
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full py-12">
            <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={galleryInputRef}
                onChange={handleFileChange}
            />

            <div className="text-center space-y-6">
                <div className="inline-block p-6 bg-blue-50 rounded-full mb-2">
                    <Camera className="w-16 h-16 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold">Snap a Question</h2>
                <p className="text-gray-500 max-w-xs mx-auto">
                    Take a clear photo of the math problem you want to solve.
                </p>

                <button
                    onClick={triggerCamera}
                    className="w-full max-w-xs px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition transform active:scale-95 flex items-center justify-center gap-3"
                >
                    <Camera size={24} />
                    Open Camera
                </button>

                <button
                    onClick={triggerGallery}
                    className="text-sm text-gray-400 hover:text-gray-600 underline-offset-4 hover:underline transition"
                >
                    or upload from gallery
                </button>
            </div>
        </div>
    );
}
