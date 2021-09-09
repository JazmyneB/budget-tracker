
//Files to cache
const FILES_TO_CACHE = [
    "../index.html",
    "./css/styles.css",
    "./icons/icon-72x72.png",
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-152x152.png",
    "./icons/icon-192x192.png",
    "./icons/icon-384x384.png",
    "./icons/icon-512x512.png"

];
const APP_PREFIX = "Budgets-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;


//Installing 
self.addEventListener('install', function (e){
    //Tells browser to wait until the work is complete before terminating service worker
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})


//Retrieve Information from Cache
self.addEventListener('fetch', function(e) {
    //logging URL of the requested resource
    console.log('fetch request : ' + e.request.url)
    //Intercep Fetch Request
    e.respondWith(
        //determine if the resource already exists in caches
        caches.match(e.request).then(function (request) {
            //if resource exists, log URL to console and return cached resource
            if (request) {
                console.log('responding with cache : ' + e.request.url)
                return request
            } else { // If not in caches, we allow the resource to be retrieved from the online network
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
        })

    )
})



//Activating
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            //adding current cache to keeplist
            cacheKeeplist.push(CACHE_NAME);

            //returns a Promise that resolves once all old versions of the cache has been deleted
            return Promise.all(
                keyList.map(function(key, i){
                    if (cacheKeeplist.indexOf(key) === -1){
                        console.log('deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            )
        })
    )
})