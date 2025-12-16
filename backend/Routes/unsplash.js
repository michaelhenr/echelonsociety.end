import express from 'express';

const router = express.Router();

// Proxy endpoint to convert Unsplash photo page URLs to direct image URLs
// This avoids CORS issues by making the request server-side
router.get('/convert', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    // If it's already a direct image URL, return as-is
    if (url.startsWith('https://images.unsplash.com') || url.startsWith('https://source.unsplash.com')) {
      return res.json({ imageUrl: url });
    }
    
    // Check if it's an Unsplash photo page URL
    if (url.includes('unsplash.com/photos/')) {
      // Extract photo ID from URL
      const segments = url.split('/');
      const lastSegment = segments[segments.length - 1];
      if (lastSegment) {
        const parts = lastSegment.split('-');
        const photoId = parts[parts.length - 1];
        
        if (photoId && photoId.length >= 6) {
          // Use Unsplash's public API endpoint to get photo details
          // This endpoint doesn't require authentication for basic info
          try {
            const apiUrl = `https://api.unsplash.com/photos/${photoId}?client_id=YOUR_ACCESS_KEY`;
            // Since we don't have an API key, we'll use a workaround
            
            // Try to fetch the photo page and extract the download link
            console.log('🔍 Fetching Unsplash photo page:', url);
            const pageResponse = await fetch(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
              },
              redirect: 'follow'
            });
            
            if (pageResponse.ok) {
              const html = await pageResponse.text();
              
              // Look for the download button or direct image link
              // Unsplash pages often have the image URL in data attributes or script tags
              
              // Pattern 1: Look for download URL in data attributes
              const downloadMatch = html.match(/download_location["']?\s*:\s*["']([^"']+)["']/i);
              if (downloadMatch && downloadMatch[1]) {
                // The download_location is an API endpoint, we need to call it
                // But for now, let's try other patterns
              }
              
              // Pattern 2: Look for og:image (most reliable)
              const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
              if (ogImageMatch && ogImageMatch[1]) {
                const imageUrl = ogImageMatch[1].replace(/&amp;/g, '&');
                console.log('✅ Found og:image:', imageUrl);
                return res.json({ imageUrl: imageUrl });
              }
              
              // Pattern 3: Look for images.unsplash.com URLs with full path
              const imageUrlPattern = /https:\/\/images\.unsplash\.com\/photo-\d+-[A-Za-z0-9]+(?:\?[^"'\s<>]*)?/g;
              const imageMatches = html.match(imageUrlPattern);
              if (imageMatches && imageMatches.length > 0) {
                // Get the first match (usually the main image)
                const imageUrl = imageMatches[0];
                console.log('✅ Found image URL in page:', imageUrl);
                return res.json({ imageUrl: imageUrl });
              }
              
              // Pattern 4: Look in JSON data embedded in page
              const jsonDataMatch = html.match(/"urls":\s*\{[^}]*"regular":\s*"([^"]+)"/);
              if (jsonDataMatch && jsonDataMatch[1]) {
                const imageUrl = jsonDataMatch[1].replace(/\\/g, '');
                console.log('✅ Found image in JSON data:', imageUrl);
                return res.json({ imageUrl: imageUrl });
              }
            }
          } catch (err) {
            console.error('❌ Failed to fetch photo page:', err.message);
          }
          
          // Final fallback: Return error with instructions
          return res.status(400).json({ 
            error: 'Unable to automatically convert Unsplash photo page URL',
            message: 'Please use a direct image URL instead',
            instructions: [
              '1. Go to the Unsplash photo page',
              '2. Right-click on the image',
              '3. Select "Copy image address" or "Copy image link"',
              '4. Paste that URL (it will start with https://images.unsplash.com/photo-...)'
            ],
            originalUrl: url
          });
        }
      }
    }
    
    // Return original URL if it doesn't match Unsplash pattern
    return res.json({ imageUrl: url });
  } catch (err) {
    console.error('Error converting Unsplash URL:', err);
    res.status(500).json({ error: 'Failed to convert URL' });
  }
});

export default router;
