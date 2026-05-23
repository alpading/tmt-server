import React from 'react';
import { Loader2, MapPin, AlertCircle, ExternalLink } from 'lucide-react';
import { loadNaverMapScript, createMap, addMarker } from '../services/mapService';

interface MapSectionProps {
  placeName: string;
  latitude?: number;
  longitude?: number;
  naverPlaceId?: string | null;
}

export default function MapSection({ placeName, latitude, longitude, naverPlaceId }: MapSectionProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isApiLoaded, setIsApiLoaded] = React.useState<boolean>(false);

  // 유효한 좌표인지 체크 (0,0은 미설정 값)
  const hasValidCoords = latitude && longitude && !(latitude === 0 && longitude === 0);

  // 외부 링크: naverPlaceId 있으면 플레이스 직접 링크, 없으면 검색
  const externalMapUrl = naverPlaceId
    ? `https://map.naver.com/v5/entry/place/${naverPlaceId}`
    : `https://map.naver.com/v5/search/${encodeURIComponent(placeName)}`;

  // 1. Naver Maps SDK 로드 + 지도 렌더링
  React.useEffect(() => {
    if (!hasValidCoords) {
      setLoading(false);
      return;
    }

    let active = true;

    async function initialize() {
      try {
        setLoading(true);
        await loadNaverMapScript();
        if (active) setIsApiLoaded(true);
      } catch {
        if (active) setIsApiLoaded(false);
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();
    return () => { active = false; };
  }, [latitude, longitude]);

  // 2. 지도 인스턴스 생성
  React.useEffect(() => {
    if (loading || !hasValidCoords || !isApiLoaded || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = createMap(mapContainerRef.current, latitude!, longitude!);
      mapInstanceRef.current = map;
      addMarker(map, latitude!, longitude!, placeName);
    } catch (err) {
      console.error('[MapSection] Map render failed', err);
    }
  }, [loading, isApiLoaded, hasValidCoords]);

  return (
    <div className="relative w-full h-48 bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] group">

      {/* 로딩 */}
      {loading && (
        <div className="absolute inset-0 bg-neutral-50/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-800" />
          <p className="text-xs text-neutral-500 font-bold">지도 불러오는 중...</p>
        </div>
      )}

      {/* 실제 Naver Map */}
      {!loading && hasValidCoords && (
        <>
          <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%', display: isApiLoaded ? 'block' : 'none' }}
          />
          {/* 실제 지도 위 네이버 지도 버튼 */}
          {isApiLoaded && (
            <div className="absolute top-4 right-4 z-10">
              <a
                href={externalMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>네이버 지도</span>
              </a>
            </div>
          )}
        </>
      )}

      {/* Mock UI — API 미인증 또는 좌표 없을 때 */}
      {!loading && (!isApiLoaded || !hasValidCoords) && (
        <div className="absolute inset-0 bg-neutral-100 w-full h-full flex items-center justify-center overflow-hidden select-none">
          {/* 격자 배경 */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-[0.06] pointer-events-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border-r border-b border-black" />
            ))}
          </div>

          <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none">
            {hasValidCoords && (
              <span className="bg-white/90 backdrop-blur-sm border border-neutral-200/60 px-2.5 py-1 rounded-lg text-[9px] font-mono text-neutral-600 font-semibold shadow-sm self-start">
                {latitude!.toFixed(4)}, {longitude!.toFixed(4)}
              </span>
            )}
            <div className="w-full">
              <p className="text-xs font-black text-neutral-900 truncate">{placeName}</p>
            </div>
          </div>

          {/* 핀 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 bg-neutral-900/10 rounded-full animate-ping duration-1000 scale-75" />
              <div className="absolute w-12 h-12 bg-neutral-900/20 rounded-full animate-pulse" />
              <div className="relative flex items-center justify-center w-10 h-10 bg-black text-white rounded-full shadow-lg border-2 border-white group-hover:scale-105 transition-transform duration-300">
                <MapPin className="w-5 h-5 text-white animate-bounce" />
              </div>
            </div>
          </div>

          {/* 네이버 지도 버튼 */}
          <div className="absolute top-4 right-4 z-10">
            <a
              href={externalMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>네이버 지도</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
