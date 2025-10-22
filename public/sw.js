// Service Worker for TRW Countdown PWA
const CACHE_NAME = "trw-countdown-v1";
const STATIC_CACHE_URLS = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  // Add your Firebase config and other critical assets
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install event");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache static assets", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate event");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip Firebase and external API requests
  if (
    event.request.url.includes("firebase") ||
    event.request.url.includes("googleapis") ||
    event.request.url.includes("google.com")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log("Service Worker: Serving from cache", event.request.url);
        return cachedResponse;
      }

      // Otherwise fetch from network
      console.log("Service Worker: Fetching from network", event.request.url);
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.error("Service Worker: Fetch failed", error);

          // Return offline page for navigation requests
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }

          throw error;
        });
    })
  );
});

// Background sync for offline data
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Sync offline transactions when back online
      syncOfflineData()
    );
  }
});

// Push notifications (optional)
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push event", event);

  const options = {
    body: event.data ? event.data.text() : "TRW Countdown Update",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Open App",
        icon: "/icons/icon-96x96.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/icon-96x96.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("TRW Countdown", options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification click", event);

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Helper function to sync offline data
async function syncOfflineData() {
  try {
    // Get offline transactions from IndexedDB
    const offlineTransactions = await getOfflineTransactions();

    if (offlineTransactions.length > 0) {
      console.log(
        "Service Worker: Syncing offline transactions",
        offlineTransactions.length
      );

      // Sync each transaction
      for (const transaction of offlineTransactions) {
        try {
          await syncTransaction(transaction);
          await removeOfflineTransaction(transaction.id);
        } catch (error) {
          console.error("Service Worker: Failed to sync transaction", error);
        }
      }
    }
  } catch (error) {
    console.error("Service Worker: Background sync failed", error);
  }
}

// Helper functions for offline data management
async function getOfflineTransactions() {
  // This would integrate with your Firebase service
  // For now, return empty array
  return [];
}

async function syncTransaction(transaction) {
  // This would integrate with your Firebase service
  console.log("Service Worker: Syncing transaction", transaction);
}

async function removeOfflineTransaction(transactionId) {
  // This would integrate with your Firebase service
  console.log("Service Worker: Removing offline transaction", transactionId);
}
