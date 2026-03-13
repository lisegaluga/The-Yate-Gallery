/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArtPiece, INITIAL_DATA, fetchArtPieces, getDirectLink } from './types';
import { Printer, Book, CreditCard, LayoutGrid, Maximize2, X, RefreshCw, Loader2 } from 'lucide-react';

const LOGO_ID = "1t2Khozh_1kZOoi_1TL-SCTv_rE9fF7KB"; 
const LOGO_URL = getDirectLink(LOGO_ID);

export default function App() {
  const [view, setView] = useState<'gallery' | 'lookbook' | 'tombstones'>('gallery');
  const [artPieces, setArtPieces] = useState<ArtPiece[]>(INITIAL_DATA);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchArtPieces();
      setArtPieces(data);
    } catch (error) {
      console.error("Failed to load art pieces:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePrint = (targetView: 'gallery' | 'lookbook' | 'tombstones') => {
    setView(targetView);
    setShowPrintModal(false);
    // Small delay to ensure the view has switched before printing
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation - Hidden on print */}
      <nav className="no-print bg-stone-900 text-stone-100 p-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Yate Gallery" className="h-10 w-10 object-contain bg-white rounded-full p-1" referrerPolicy="no-referrer" />
          <h1 className="text-xl font-serif tracking-widest uppercase">The Yate Gallery</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setView('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${view === 'gallery' ? 'bg-stone-700 text-white' : 'hover:bg-stone-800'}`}
          >
            <LayoutGrid size={18} /> Gallery
          </button>
          <button 
            onClick={() => setView('lookbook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${view === 'lookbook' ? 'bg-stone-700 text-white' : 'hover:bg-stone-800'}`}
          >
            <Book size={18} /> Look Book
          </button>
          <button 
            onClick={() => setView('tombstones')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${view === 'tombstones' ? 'bg-stone-700 text-white' : 'hover:bg-stone-800'}`}
          >
            <CreditCard size={18} /> Tombstones
          </button>
          <button 
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 hover:bg-stone-800 rounded-md transition disabled:opacity-50"
            title="Refresh from Google Sheet"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          </button>
          <button 
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md transition ml-4"
          >
            <Printer size={18} /> Print PDF
          </button>
        </div>
      </nav>

      <main className="flex-1 relative">
        {loading && artPieces.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 z-10">
            <Loader2 size={48} className="animate-spin text-stone-400 mb-4" />
            <p className="text-stone-500 font-serif italic">Fetching latest collection from Google Sheets...</p>
          </div>
        )}
        {view === 'gallery' && (
          <div className="p-8 max-w-7xl mx-auto no-print">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-serif italic text-stone-800">Collection</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artPieces.map((piece, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 group relative">
                  <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition">
                    <button 
                      onClick={() => setFullscreenImage(piece.photoUrl)}
                      className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-stone-600 hover:text-stone-900 transition"
                      title="Fullscreen"
                    >
                      <Maximize2 size={18} />
                    </button>
                  </div>
                  <div className="aspect-video mb-4 overflow-hidden rounded-lg border border-stone-100 bg-stone-50 flex items-center justify-center">
                    <img 
                      src={piece.photoUrl} 
                      alt={piece.title} 
                      className="max-w-full max-h-full object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="text-xl font-serif font-bold text-stone-900">{piece.title}</div>
                      <div className="text-sm font-bold bg-stone-100 px-2 py-1 rounded text-stone-600">#{piece.lotNumber}</div>
                    </div>
                    <div className="text-stone-600 font-serif italic">{piece.artist}</div>
                    <div className="grid grid-cols-2 gap-2 text-sm border-t border-stone-100 pt-2">
                      <div className="text-stone-500">{piece.medium} • {piece.year}</div>
                      <div className="text-right font-bold text-stone-800">{piece.estimatedValue}</div>
                    </div>
                    <p className="text-sm text-stone-500 font-serif leading-relaxed">
                      {piece.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'lookbook' && (
          <div className="bg-stone-200 py-12 overflow-auto">
            {/* Cover Page */}
            <div className="print-page mx-auto shadow-2xl">
              <div className="gallery-frame w-full h-full flex flex-col items-center p-24">
                {/* Logo at top */}
                <div className="mt-12 mb-32">
                  <img src={LOGO_URL} alt="Logo" className="w-72" referrerPolicy="no-referrer" />
                </div>
                
                {/* Look Book underlined */}
                <div className="text-center mb-12">
                  <h1 className="text-6xl font-serif tracking-[0.2em] uppercase border-b-2 border-stone-800 pb-6 inline-block">
                    Look Book
                  </h1>
                </div>
                
                {/* Exclusive Unveiling Evening */}
                <p className="text-2xl font-serif italic text-stone-600 text-center">
                  Exclusive Unveiling Evening
                </p>
                
                {/* Lots of whitespace */}
                <div className="flex-1"></div>
                
                {/* Private and Confidential at bottom */}
                <div className="mb-12 text-stone-400 font-serif uppercase tracking-[0.3em] text-sm text-center">
                  Private and Confidential
                </div>
              </div>
            </div>

            {/* Art Pages */}
            {artPieces.map((piece, idx) => (
              <div key={idx} className="print-page mx-auto bg-white shadow-2xl mt-8">
                <div className="gallery-frame w-full h-full p-20 flex flex-col">
                  <div className="flex justify-between items-start mb-8 px-16">
                    <img src={LOGO_URL} alt="Logo" className="h-24" referrerPolicy="no-referrer" />
                    <div className="text-right font-serif pt-4">
                      <div className="text-sm text-stone-400 uppercase tracking-widest leading-none mb-2">Lot Number</div>
                      <div className="text-3xl font-bold leading-none">#{piece.lotNumber}</div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="aspect-[4/3] mb-8 border-4 border-stone-100 shadow-inner overflow-hidden bg-stone-50 flex items-center justify-center">
                      <img 
                        src={piece.photoUrl} 
                        alt={piece.title} 
                        className="max-w-full max-h-full object-contain" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>

                    <div className="space-y-4 max-w-2xl mx-auto text-center">
                      <h2 className="text-4xl font-serif font-bold text-stone-900">{piece.title}</h2>
                      <div className="text-xl font-serif italic text-stone-700">{piece.artist}</div>
                      <div className="flex justify-center gap-8 text-stone-500 uppercase tracking-widest text-sm">
                        <span>{piece.medium}</span>
                        <span>•</span>
                        <span>{piece.year}</span>
                      </div>
                      <p className="text-lg leading-relaxed text-stone-600 font-serif">
                        {piece.description}
                      </p>
                      <div className="pt-4">
                        <div className="text-xs text-stone-400 uppercase tracking-[0.3em] mb-1">Estimated Value</div>
                        <div className="text-2xl font-serif font-bold text-stone-800">{piece.estimatedValue}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-stone-100 flex justify-center items-center">
                    <span className="font-serif text-stone-400">Page {idx + 2}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'tombstones' && (
          <div className="bg-stone-200 py-12 overflow-auto">
            <div className="max-w-[8.5in] mx-auto bg-white p-8 shadow-2xl min-h-[11in]">
              <div className="grid grid-cols-2 gap-12 justify-items-center">
                {artPieces.map((piece, idx) => (
                  <div key={idx} className="tombstone-card bg-[#fdfcf8]">
                    {/* Top Row: Info Block + Logo */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="text-[13px] font-serif font-bold uppercase tracking-wider text-stone-900 leading-tight">{piece.artist}</div>
                        <div className="text-[16px] font-serif italic text-stone-800 leading-tight">{piece.title}</div>
                        <div className="text-[11px] text-stone-500 uppercase tracking-tight mt-0.5">
                          {piece.medium}, {piece.year}
                        </div>
                      </div>
                      <div className="w-24 flex justify-center">
                        <img src={LOGO_URL} alt="Logo" className="h-16 object-contain -mt-1" referrerPolicy="no-referrer" />
                      </div>
                    </div>

                    {/* Middle: Full Width Description */}
                    <div className="flex-1">
                      <p className="text-[11px] leading-snug text-stone-600 font-serif">
                        {piece.description}
                      </p>
                    </div>

                    {/* Bottom Row: Lot # + Est Value */}
                    <div className="mt-2 pt-1 border-t border-stone-200 flex justify-between items-center">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest">Lot #{piece.lotNumber}</span>
                      <div className="w-24 flex justify-center">
                        <span className="text-[12px] font-bold text-stone-800">{piece.estimatedValue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 no-print"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white transition"
            onClick={() => setFullscreenImage(null)}
          >
            <X size={40} />
          </button>
          <img 
            src={fullscreenImage} 
            alt="Fullscreen view" 
            className="max-w-full max-h-full object-contain shadow-2xl"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Print Selection Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-[100] bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-stone-800">Print Selection</h3>
              <button onClick={() => setShowPrintModal(false)} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>
            <p className="text-stone-600 mb-8 font-serif">Select which view you would like to prepare for PDF printing:</p>
            <div className="space-y-4">
              <button 
                onClick={() => handlePrint('gallery')}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-stone-100 hover:border-emerald-600 hover:bg-emerald-50 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-stone-100 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-700 transition">
                    <LayoutGrid size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-stone-800">Gallery View</div>
                    <div className="text-xs text-stone-500">Grid layout of all pieces</div>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => handlePrint('lookbook')}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-stone-100 hover:border-emerald-600 hover:bg-emerald-50 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-stone-100 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-700 transition">
                    <Book size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-stone-800">Look Book</div>
                    <div className="text-xs text-stone-500">Full-page presentation</div>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => handlePrint('tombstones')}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-stone-100 hover:border-emerald-600 hover:bg-emerald-50 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-stone-100 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-700 transition">
                    <CreditCard size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-stone-800">Tombstones</div>
                    <div className="text-xs text-stone-500">Small labels for display</div>
                  </div>
                </div>
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-stone-100">
              <p className="text-sm font-serif italic text-stone-500 text-center">
                Tip: When printing, set "Margins" to "None" and "Background Graphics" to "On" for the best result.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
