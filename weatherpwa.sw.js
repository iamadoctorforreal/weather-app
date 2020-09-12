let CACHE_NAME = 'SITE_CONTENT_V1';

const urlsToCache = [
    '/weather-app/style4.css',
    '/weather-app/weatherpwa.html',
    '/weather-app/weatherpwa.js',
    '/weather-app/img/sun.svg',
    '/weather-app/img/landscape.svg',
   /* '/weather-app/icons/01d.png',
    '/weather-app/icons/01n.png',
    '/weather-app/icons/02d.png',
    '/weather-app/icons/03d.png',
    '/weather-app/icons/03n.png',
    '/weather-app/icons/04d.png',
    '/weather-app/icons/04n.png',
    '/weather-app/icons/09d.png',
    '/weather-app/icons/09n.png',
    '/weather-app/icons/10d.png',
    '/weather-app/icons/10n.png',
    '/weather-app/icons/11d.png',
    '/weather-app/icons/11n.png',
    '/weather-app/icons/13d.png',
    '/weather-app/icons/13n.png',
    '/weather-app/icons/50d.png',
    '/weather-app/icons/50n.png',*/
    '/weather-app/icons/unknown.png',
    '/weather-app/404.html',
    '/weather-app/offline.html'
];

let icons = [];
for(let i=0; i<iconId.length; i++) {
  icons.push(`icons/${weather.iconId}.png`);
}
const contentToCache = urlsToCache.concat(icons);



self.addEventListener('install', installer => {
    console.log('Installing');

    const done = async () => {
        const cache = await caches.open(CACHE_NAME);
        return cache.addAll(contentToCache);
    };
    installer.waitUntil(done());
});

self.addEventListener('fetch', fetchEvent => {
    const url = fetchEvent.request.url;
    console.log(`Fetching: ${url}`);

    const getResponse = async (request) => {
        let response;
        
        response = await caches.match(request);
        if(response && response.status === 200) {
            console.log('File in cache. Returning cached version.');
            return response;
        }
        try {
            reponse = await fetch(request);
            if(response && response.status === 404) {
                return caches.match('/weather-app/404.html');
            }
        } catch (e) {
            return caches.match('/weather-app/offline.html')
        }

        const clone = response.clone();
        const cache = await caches.open(CACHE_NAME);
        cache.put(url, clone);
    
        return response;
    };

    fetchEvent.respondWith(getResponse(fetchEvent.request));
});

self.addEventListener('activate', activator => {
    console.log('Activating');

    const currentCaches = [CACHE_NAME];
    const done = async () => {
        const names = await caches.keys();
        return Promise.all(names.map(name => {
            if (!currentCaches.includes(name)) {
                return caches.delete(name);
            }
        }));
    };

    activator.waitUntil(done());
});