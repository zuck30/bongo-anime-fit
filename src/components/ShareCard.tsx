import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, Copy, Gamepad2, Loader2 } from 'lucide-react';

interface ShareCardProps {
  character: string;
  anime: string;
  description: string;
  funnyLine: string;
  traits: string[];
  onClose: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ character, anime, description, funnyLine, traits, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Dynamic character image from reliable anime image API
  const characterImageUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(character)}&backgroundColor=4a0e6b`;
  
  // Alternative: Use Anime character search API (no hardcoding)
  const searchImageUrl = `https://api.waifu.pics/sfw/waifu`;

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, backgroundColor: '#1a0b2e' });
      const link = document.createElement('a');
      link.download = `${character.toLowerCase().replace(/\s/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Long press on the card and select 'Save Image'");
    } finally {
      setIsDownloading(false);
    }
  };

  const shareWhatsApp = () => {
    const text = `🔥 I am ${character} from ${anime}! ${funnyLine} Take the quiz: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 overflow-y-auto">
      <div className="max-w-md w-full">
        <div 
          ref={cardRef}
          style={{
            backgroundColor: '#1a0b2e',
            border: '4px solid #00f3ff',
            padding: '24px',
            minHeight: '500px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Gamepad2 size={48} color="#ffcc00" style={{ margin: '0 auto 8px' }} />
            <h2 style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00f3ff' }}>ANIME FIT TZ</h2>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 16px',
              backgroundColor: '#4a0e6b',
              border: '3px solid #ffcc00',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {!imageError ? (
                <img 
                  src={`https://api.waifu.pics/sfw/waifu`}
                  alt={character}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div style={{ fontSize: '48px' }}>{character.charAt(0)}</div>
              )}
            </div>
            
            <h1 style={{ fontFamily: 'monospace', fontSize: '28px', color: '#ff00e0', marginBottom: '8px' }}>
              {character}
            </h1>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#00f3ff', marginBottom: '16px' }}>
              from {anime}
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '16px', color: '#ffcc00', marginBottom: '16px' }}>
              "{funnyLine}"
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', color: 'white', marginBottom: '16px' }}>
              {description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {traits.map((trait, i) => (
                <span key={i} style={{ backgroundColor: '#4a0e6b', padding: '4px 12px', fontSize: '12px', fontFamily: 'monospace' }}>
                  #{trait}
                </span>
              ))}
            </div>
          </div>
          
          <div style={{ borderTop: '2px solid #00f3ff', marginTop: '24px', paddingTop: '24px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#00f3ff' }}>Take the quiz at AnimeFitTz</p>
          </div>
        </div>
        
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={downloadImage} disabled={isDownloading} style={{ padding: '12px', backgroundColor: isDownloading ? '#333' : '#4a0e6b', border: '2px solid #00f3ff', color: 'white', fontFamily: 'monospace', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {isDownloading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={16} />} {isDownloading ? 'Generating...' : 'Download Image'}
          </button>
          <button onClick={shareWhatsApp} style={{ padding: '12px', backgroundColor: '#059669', border: '2px solid #34d399', color: 'white', fontFamily: 'monospace', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Share2 size={16} /> Share WhatsApp
          </button>
          <button onClick={copyLink} style={{ padding: '12px', backgroundColor: '#4a0e6b', border: '2px solid #00f3ff', color: 'white', fontFamily: 'monospace', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Copy size={16} /> Copy Link
          </button>
          <button onClick={onClose} style={{ padding: '12px', backgroundColor: 'transparent', border: '2px solid #ff00e0', color: '#ff00e0', fontFamily: 'monospace', cursor: 'pointer' }}>
            Play Again
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ShareCard;