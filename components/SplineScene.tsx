
import React from 'react';

interface SplineSceneProps {
  url: string;
  className?: string;
  isBackground?: boolean;
}

const SplineScene: React.FC<SplineSceneProps> = ({ url, className = "", isBackground = false }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <iframe 
        src={url} 
        frameBorder="0" 
        width="100%" 
        height="100%"
        title="Spline 3D Scene"
        className={`${isBackground ? 'pointer-events-none' : ''}`}
        style={{ border: 'none' }}
      ></iframe>
      {isBackground && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/40 pointer-events-none" />
      )}
    </div>
  );
};

export default SplineScene;
