import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Share2, Download, Loader2, Users } from 'lucide-react';

interface CombinedShareCardProps {
  character: string;
  anime: string;
  funnyLine: string;
  userPhoto: string;
  onClose: () => void;
}

const CombinedShareCard: React.FC<CombinedShareCardProps> = ({
  character,
  anime,
  funnyLine,
  userPhoto,
  onClose
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchCharacterImage = async () => {
      setImageLoading(true);
      
      // Multiple image sources to try
      const imageSources = [
        `https://api.waifu.pics/sfw/waifu`,
        `https://nekos.best/api/v2/waifu`,
        `https://api.nekosapi.com/v3/images/random?&limit=1`
      ];
      
      for (const source of imageSources) {
        try {
          const response = await fetch(source);
          if (!response.ok) continue;
          
          const data = await response.json();
          let imageUrl = null;
          
          // Handle different API response formats
          if (source.includes('waifu.pics')) {
            imageUrl = data.url;
          } else if (source.includes('nekos.best')) {
            imageUrl = data.results[0]?.url;
          } else if (source.includes('nekosapi.com')) {
            imageUrl = data.items[0]?.image_url;
          }
          
          if (imageUrl) {
            // Test if image loads
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = imageUrl;
            });
            setCharacterImage(imageUrl);
            break;
          }
        } catch (error) {
          console.error(`Failed to fetch from ${source}:`, error);
          continue;
        }
      }
      
      setImageLoading(false);
    };
    
    fetchCharacterImage();
  }, [character]);

  const generateCombinedImage = async (): Promise<string> => {
    if (!cardRef.current) throw new Error("Card not found");
    return await toPng(cardRef.current, { quality: 0.95, backgroundColor: '#1a0b2e' });
  };

  const handleShareToWhatsApp = async () => {
    setIsGenerating(true);
    try {
      const imageDataUrl = await generateCombinedImage();
      const link = document.createElement('a');
      link.download = `${character}-my-anime-match.png`;
      link.href = imageDataUrl;
      link.click();
      
      const text = `🔥 I am ${character} from ${anime}! ${funnyLine} Take the quiz: ${window.location.href}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } catch (error) {
      console.error("Failed:", error);
      alert("Long press on the image above and share manually");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const imageDataUrl = await generateCombinedImage();
      const link = document.createElement('a');
      link.download = `${character}-my-anime-match.png`;
      link.href = imageDataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback image using character name encoded
  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(character)}&background=4a0e6b&color=00f3ff&size=120&rounded=true&bold=true&length=2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 overflow-y-auto">
      <div className="max-w-md w-full">
        <div 
          ref={cardRef}
          style={{
            backgroundColor: '#1a0b2e',
            border: '4px solid #00f3ff',
            padding: '24px',
            position: 'relative'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Users size={32} color="#ffcc00" style={{ margin: '0 auto 8px' }} />
            <h2 style={{ fontFamily: 'monospace', fontSize: '14px', color: '#00f3ff' }}>ANIME FIT TZ</h2>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
            {/* User photo circle */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 8px',
                borderRadius: '50%',
                border: '3px solid #ffcc00',
                overflow: 'hidden',
                backgroundColor: '#4a0e6b'
              }}>
                <img src={userPhoto} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#ffcc00' }}>YOU</p>
            </div>
            
            {/* Plus icon */}
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '32px', color: '#ff00e0', fontWeight: 'bold' }}>+</div>
            
            {/* Character image circle */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 8px',
                borderRadius: '50%',
                border: '3px solid #00f3ff',
                overflow: 'hidden',
                backgroundColor: '#4a0e6b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {imageLoading ? (
                  <Loader2 size={40} color="#00f3ff" style={{ animation: 'spin 1s linear infinite' }} />
                ) : characterImage ? (
                  <img 
                    src={characterImage} 
                    alt={character} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                ) : (
                  <img 
                    src={fallbackImage} 
                    alt={character} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
              <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00f3ff' }}>{character}</p>
            </div>
          </div>
          
          <div style={{
            height: '2px',
            background: 'linear-gradient(90deg, #ffcc00, #00f3ff, #ff00e0)',
            margin: '16px 0',
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto'
          }} />
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#ffcc00', fontStyle: 'italic' }}>
              "{funnyLine}"
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00f3ff', marginTop: '12px' }}>
              {character} from {anime}
            </p>
          </div>
          
          <div style={{ borderTop: '1px solid #00f3ff', marginTop: '20px', paddingTop: '16px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#666' }}>Take the quiz at AnimeFitTz</p>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleShareToWhatsApp}
            disabled={isGenerating}
            style={{
              padding: '14px',
              backgroundColor: isGenerating ? '#333' : '#059669',
              border: '2px solid #34d399',
              color: 'white',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isGenerating ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Share2 size={20} />}
            {isGenerating ? 'Generating...' : 'Share to WhatsApp'}
          </button>
          
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            style={{
              padding: '14px',
              backgroundColor: '#4a0e6b',
              border: '2px solid #00f3ff',
              color: 'white',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Download size={20} />
            Download Image
          </button>
          
          <button
            onClick={onClose}
            style={{
              padding: '14px',
              backgroundColor: 'transparent',
              border: '2px solid #ff00e0',
              color: '#ff00e0',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
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

export default CombinedShareCard;