import React from 'react';
import { Image } from '@nextui-org/image';

export default function LoadingSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-sm">
      <div className="text-center">
        <div className="flex justify-center items-center mb-4">
          <Image
            src="/icons/logo-blue.ico"
            alt="loading-skeleton"
            width={100} height={100} />
        </div>
        <div className="flex justify-center items-center space-x-2">
                    <span className="animate-bounce text-gray-600 dark:text-gray-300">
                        Cargando
                    </span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}