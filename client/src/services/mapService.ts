/**
 * Naver Map API Service Wrapper
 * Provides structural methods for loading dynamic map script,
 * geocoding search, map creation, and marker management.
 */

// Simple helper to get mock coordinates in case of error or missing credentials
export function getMockCoordinates(address: string, placeName?: string): { latitude: number; longitude: number } {
  const normAddress = address || '';
  const normName = placeName || '';
  
  if (normAddress.includes('동호로') || normName.includes('신라호텔')) {
    return { latitude: 37.5562, longitude: 127.005 }; // Silla Hotel Seoul
  }
  if (normAddress.includes('마포나루길') || normName.includes('카약')) {
    return { latitude: 37.541, longitude: 126.986 }; // Mapo Han River area
  }
  if (normAddress.includes('신촌로') || normName.includes('우동신')) {
    return { latitude: 37.5565, longitude: 126.9366 }; // Shinchon/Mapo (Udon Shin)
  }
  return { latitude: 37.5665, longitude: 126.9780 }; // Default Seoul City Hall
}

/**
 * 모듈 레벨 Promise — 스크립트 로드는 앱 전체에서 딱 1번만 수행.
 * 두 번째 호출부터는 같은 Promise를 반환하거나, 이미 성공이면 즉시 resolve.
 */
let _scriptPromise: Promise<void> | null = null;

export function loadNaverMapScript(clientId?: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window object is not defined.'));
  }

  // 이미 로드 완료된 경우 즉시 resolve
  if ((window as any).naver?.maps) {
    return Promise.resolve();
  }

  // 로드 중인 Promise가 있으면 그대로 반환 (중복 listener 방지)
  if (_scriptPromise) {
    return _scriptPromise;
  }

  _scriptPromise = new Promise<void>((resolve, reject) => {
    const scriptId = 'naver-map-script';
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

    const waitForMaps = () => {
      const interval = setInterval(() => {
        if ((window as any).naver?.maps) {
          clearInterval(interval);
          resolve();
        }
      }, 50);

      // 1.5초 안에 naver.maps 세팅 안 되면 인증 실패로 판단
      setTimeout(() => {
        clearInterval(interval);
        if ((window as any).naver?.maps) {
          resolve();
        } else {
          _scriptPromise = null; // 다음 호출 시 재시도 가능하도록 초기화
          reject(new Error('Naver Maps 인증 실패 — NCP 콘솔에서 서비스 URL을 확인하세요.'));
        }
      }, 1500);
    };

    if (existing) {
      // 스크립트 태그가 이미 존재하지만 naver.maps 미세팅
      // → 이미 load 이벤트가 완료된 상태이므로 재등록해도 발화 안 됨
      // → data-loaded 속성으로 완료 여부 확인 후 즉시 fail
      if (existing.dataset.loaded === 'true') {
        _scriptPromise = null;
        reject(new Error('Naver Maps 인증 실패 (스크립트 이미 로드 완료, naver.maps 미세팅)'));
      } else {
        // 아직 로드 중 → 완료 이벤트 대기
        existing.addEventListener('load', () => {
          existing.dataset.loaded = 'true';
          waitForMaps();
        }, { once: true });
        existing.addEventListener('error', () => {
          _scriptPromise = null;
          reject(new Error('Naver Maps 스크립트 로드 실패'));
        }, { once: true });
      }
      return;
    }

    // 최초 로드
    const script = document.createElement('script');
    script.id = scriptId;
    const clientKey = clientId || (import.meta as any).env?.VITE_NAVER_MAP_CLIENT_ID || '';
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientKey}`;
    script.async = true;
    document.head.appendChild(script);

    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      waitForMaps();
    }, { once: true });

    script.addEventListener('error', () => {
      _scriptPromise = null;
      reject(new Error('Naver Maps 스크립트 로드 실패'));
    }, { once: true });
  });

  return _scriptPromise;
}

/**
 * Geocodes a text address to precise latitude and longitude coordinates.
 * Falls back to local coordinate mapper if API is offline/unavailable.
 */
export function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve) => {
    if (
      !(window as any).naver ||
      !(window as any).naver.maps ||
      !(window as any).naver.maps.Service ||
      !(window as any).naver.maps.Service.geocode
    ) {
      // SDK not ready or offline - return mock coord mapping gracefully
      console.log('[mapService] Naver Map Service geocoder not loaded. Using fallback mock coordinate.');
      resolve(getMockCoordinates(address));
      return;
    }

    (window as any).naver.maps.Service.geocode(
      { query: address },
      (status: any, response: any) => {
        if (status !== (window as any).naver.maps.Service.Status.OK) {
          console.warn('[mapService] Geocode request returned error status. Using fallback mock.');
          resolve(getMockCoordinates(address));
          return;
        }

        const addresses = response?.v2?.addresses;
        if (addresses && addresses.length > 0) {
          const item = addresses[0];
          resolve({
            latitude: parseFloat(item.y),
            longitude: parseFloat(item.x),
          });
        } else {
          console.warn('[mapService] Address geocoding found no matches. Using fallback mock.');
          resolve(getMockCoordinates(address));
        }
      }
    );
  });
}

/**
 * Dynamically boots a Naver Map instance inside designated element container.
 * Accepts either a DOM element reference or a string element ID.
 */
export function createMap(element: string | HTMLElement, latitude: number, longitude: number, options?: any): any {
  if (!(window as any).naver || !(window as any).naver.maps) {
    console.warn('[mapService] Naver Maps not loaded yet. Handing off to custom visual container UI.');
    return {
      element,
      center: { latitude, longitude },
      mock: true,
    };
  }

  const mapOptions = {
    center: new (window as any).naver.maps.LatLng(latitude, longitude),
    zoom: 16,
    zoomControl: true,
    zoomControlOptions: {
      position: (window as any).naver.maps.Position.TOP_RIGHT,
    },
    minZoom: 6,
    logoControl: true,
    mapTypeControl: false,
    scaleControl: false,
    ...options,
  };

  return new (window as any).naver.maps.Map(element, mapOptions);
}

/**
 * Attaches a marker element coordinates onto map instance.
 */
export function addMarker(map: any, latitude: number, longitude: number, title?: string): any {
  if (map?.mock) {
    console.log(`[mapService] Mock Marker generated on mock map at (${latitude}, ${longitude}) with title "${title}".`);
    return {
      map,
      latitude,
      longitude,
      title,
      mock: true,
    };
  }

  if (!(window as any).naver || !(window as any).naver.maps) {
    console.warn('[mapService] Naver Maps SDK unavailable for placing marker.');
    return null;
  }

  const markerOptions = {
    position: new (window as any).naver.maps.LatLng(latitude, longitude),
    map: map,
    title: title || '',
    animation: (window as any).naver.maps.Animation.DROP,
  };

  return new (window as any).naver.maps.Marker(markerOptions);
}
