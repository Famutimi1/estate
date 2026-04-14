"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "pwa-prompt";
const DISMISSED_KEY = "pwa-dismissed";
// Show again after 7 days if dismissed
const REDISPLAY_DAYS = 7;

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Don't show if dismissed recently
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < REDISPLAY_DAYS) return;
    }

    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    if (ios) {
      // iOS can't use beforeinstallprompt — show banner with Safari instructions after delay
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }

    // For Chrome/Edge/Android: only show banner when browser signals the app is installable
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true); // show immediately when we have the real install prompt
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShow(false);
        localStorage.removeItem(DISMISSED_KEY);
      }
    } finally {
      setDeferredPrompt(null);
      setInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, new Date().toISOString());
  };

  const handleNeverShow = () => {
    setShow(false);
    // Set a far future date to suppress permanently
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 10);
    localStorage.setItem(DISMISSED_KEY, farFuture.toISOString());
  };

  if (!show || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-green-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/company_logo/company_logo.png"
              alt="Logo"
              className="w-8 h-8 object-contain rounded-lg bg-white p-0.5"
            />
            <span className="text-white font-semibold text-sm">Stan Grace Properties</span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-green-200 hover:text-white transition-colors"
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4">
          <h3 className="text-gray-800 font-bold text-base mb-1">
            {isIOS ? "Add to Home Screen" : "Install Our App"}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {isIOS
              ? "To install: tap the Share icon in Safari, then tap \"Add to Home Screen\"."
              : "Get faster access, offline browsing, and a better experience."}
          </p>

          {/* Features */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <i className="fas fa-bolt text-green-600"></i>
              <span>Faster</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <i className="fas fa-wifi-slash text-green-600"></i>
              <span>Works offline</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <i className="fas fa-bell text-green-600"></i>
              <span>Notifications</span>
            </div>
          </div>

          {/* Install button — only shown on non-iOS where we have native prompt */}
          {!isIOS && (
            <button
              onClick={handleInstall}
              disabled={installing}
              className="w-full bg-green-700 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-green-800 transition-colors mb-2 cursor-pointer disabled:opacity-70"
            >
              <i className={`fas ${installing ? "fa-spinner fa-spin" : "fa-download"} mr-2`}></i>
              {installing ? "Installing..." : "Install App"}
            </button>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={handleDismiss}
              className="text-gray-400 text-xs hover:text-gray-600 transition-colors py-1"
            >
              Maybe later
            </button>
            <button
              onClick={handleNeverShow}
              className="text-gray-400 text-xs hover:text-gray-600 transition-colors py-1"
            >
              Don&apos;t show again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
