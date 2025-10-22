# TRW Countdown PWA

A Progressive Web App (PWA) that provides a countdown timer with savings tracking for TRW goals. The app works offline, can be installed on any device, and provides a native app-like experience.

## Features

- **📱 Progressive Web App**: Installable on any device (desktop, mobile, tablet)
- **⏰ Countdown Timer**: Real-time countdown to December 31, 2025
- **💰 Savings Tracking**: Track your financial progress towards a $20,000 goal
- **👥 Multi-User Support**: Multiple user accounts with persistent storage
- **🔄 Offline Functionality**: Works without internet connection
- **☁️ Firebase Integration**: Cloud storage for transaction data
- **📲 Installable**: Add to home screen on any device
- **🌐 Cross-Platform**: Works on iOS, Android, Windows, macOS, Linux

## Installation

### Method 1: Install from Browser

1. **Open the app** in any modern browser
2. **Look for install prompt** or install button
3. **Click "Install App"** when prompted
4. **Follow browser instructions** to complete installation

### Method 2: Manual Installation

#### Desktop (Chrome/Edge/Firefox)

1. Click the **install icon** in the address bar
2. Click **"Install"** in the popup
3. The app will open in a standalone window

#### Mobile (iOS Safari)

1. Tap the **Share button**
2. Scroll down and tap **"Add to Home Screen"**
3. Tap **"Add"** to confirm

#### Mobile (Android Chrome)

1. Tap the **menu button** (three dots)
2. Tap **"Add to Home screen"**
3. Tap **"Add"** to confirm

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern browser with PWA support

### Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Development mode**:

   ```bash
   npm run dev
   ```

3. **Build for production**:

   ```bash
   npm run build:pwa
   ```

4. **Preview production build**:
   ```bash
   npm run serve
   ```

### PWA Features

#### Service Worker

- **Offline caching**: App works without internet
- **Background sync**: Syncs data when connection returns
- **Push notifications**: Optional notifications for updates
- **Cache management**: Automatic cache updates

#### App Manifest

- **Installable**: Can be installed on any device
- **Standalone mode**: Runs like a native app
- **Custom icons**: App icons for all platforms
- **Theme colors**: Consistent branding

#### Offline Support

- **Cached assets**: Static files cached for offline use
- **Offline transactions**: Add transactions while offline
- **Background sync**: Sync when back online
- **Offline indicators**: Shows connection status

## Project Structure

```
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                 # Service worker
│   └── icons/                # PWA icons (multiple sizes)
├── src/
│   ├── components/           # React components
│   │   ├── PWAInstallButton.tsx
│   │   └── ...
│   ├── services/             # Services
│   │   ├── pwaService.ts     # PWA functionality
│   │   └── ...
│   └── ...
└── scripts/
    └── generate-icons.js     # Icon generation script
```

## PWA Configuration

### Manifest.json

- **App name and description**
- **Icons for all platforms**
- **Theme and background colors**
- **Display mode (standalone)**
- **Start URL and scope**

### Service Worker

- **Cache strategy**: Cache-first for static assets
- **Network fallback**: Fetch from network when offline
- **Background sync**: Sync offline data
- **Push notifications**: Optional notifications

### Icons

- **Multiple sizes**: 72px to 512px
- **Platform support**: iOS, Android, Windows
- **Maskable icons**: Adaptive icons for Android

## Browser Support

### Full PWA Support

- ✅ Chrome (Android, Desktop)
- ✅ Edge (Windows, Android)
- ✅ Firefox (Android, Desktop)
- ✅ Safari (iOS 11.3+, macOS 11+)

### Partial Support

- ⚠️ Safari (iOS < 11.3): Limited offline support
- ⚠️ Firefox (iOS): No install prompt

## Deployment

### Static Hosting

Deploy to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: `npm run build:pwa`
- **Firebase Hosting**: `firebase deploy`

### HTTPS Required

PWAs require HTTPS in production. Most hosting services provide this automatically.

### Testing PWA Features

1. **Lighthouse**: Run PWA audit
2. **Chrome DevTools**: Check service worker
3. **Install test**: Test installation flow
4. **Offline test**: Test offline functionality

## Configuration

### Firebase Setup

1. Create Firebase project
2. Enable Firestore database
3. Update `src/config/firebase.ts`
4. Set up security rules

### PWA Customization

- **Icons**: Replace icons in `public/icons/`
- **Colors**: Update theme colors in `manifest.json`
- **Name**: Update app name in `manifest.json`
- **Offline page**: Customize offline experience

## Troubleshooting

### Installation Issues

- **HTTPS required**: Ensure site uses HTTPS
- **Manifest valid**: Check manifest.json syntax
- **Icons present**: Verify all icon sizes exist
- **Service worker**: Check service worker registration

### Offline Issues

- **Cache strategy**: Review service worker caching
- **Network requests**: Check fetch event handling
- **Storage limits**: Monitor cache size

### Performance

- **Bundle size**: Optimize JavaScript bundles
- **Image optimization**: Compress images
- **Caching strategy**: Optimize cache policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test PWA functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review PWA documentation
3. Open an issue on GitHub
4. Check browser compatibility
