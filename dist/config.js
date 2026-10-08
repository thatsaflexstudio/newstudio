// Add approved contact details and media here. Empty values never pretend to be live.
window.FLEX_CONFIG = {
  whatsapp: '18298025315', // Dominican Republic: +1 829-802-5315.
  email: '',
  beatStoreUrl: '',
  newsletterEndpoint: '', // HTTPS endpoint accepting JSON {email}; must return a successful response.
  studioInstagram: 'https://www.instagram.com/thatsaflex.studio/',
  fexInstagram: 'https://www.instagram.com/fexfenix/',
  media: {
    heroImage: '', heroVideo: '',
    fexPortrait: 'assets/fex-portrait-960.webp',
    fexPortraitSrcset: 'assets/fex-portrait-480.webp 480w, assets/fex-portrait-960.webp 960w',
    fexPortraitSizes: '(max-width: 560px) calc(100vw - 44px), (max-width: 1600px) 43vw, 610px',
    fexPortraitAlt: 'Fex Fenix portrait with fire and smoke artwork.',
    fexPortraitWidth: 960, fexPortraitHeight: 1200,
    studioImages: [{
      src: 'assets/studio-01-1672.webp',
      srcset: 'assets/studio-01-800.webp 800w, assets/studio-01-1200.webp 1200w, assets/studio-01-1672.webp 1672w',
      sizes: '(max-width: 640px) 100vw, (max-width: 1600px) 90vw, 1424px',
      width: 1672, height: 941,
      alt: 'Red-lit recording studio with a production desk, monitor speakers and a vocal booth, with That’s A Flex and The Honorable Few wall logos.',
    }], // Add future approved studio photos here.
    instagramPosts: [] // [{image, alt, url}] — approved posts only.
  },
  featuredBeats: [], // [{name, mood, description, artwork, url, preview}] — real releases only.
  future: {flexList: [], flexSessions: [], flexRadio: null, news: []}
};
