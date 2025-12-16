import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    _id?: string;
    id?: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string;
    brands?: { name: string };
  };
  onAddToCart: (productId: string) => void;
}

// Convert Unsplash photo page URLs to direct image URLs using backend proxy
const getImageUrl = async (url: string | undefined): Promise<string | null> => {
  if (!url) return null;
  
  // If it's already a direct image URL, return as-is
  if (url.startsWith('https://images.unsplash.com') || url.startsWith('https://source.unsplash.com')) {
    return url;
  }
  
  // Check if it's an Unsplash photo page URL and convert it via backend proxy
  if (url.includes('unsplash.com/photos/')) {
    try {
      // Use backend proxy to avoid CORS issues
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3400';
      const proxyUrl = `${apiBase}/unsplash/convert?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          console.log('✅ Converted URL:', url, '→', data.imageUrl);
          return data.imageUrl;
        }
        if (data.error) {
          console.error('❌ Conversion error:', data.error);
          // Return original URL if conversion fails
          return url;
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Proxy returned error:', response.status, errorData);
        // Return original URL if conversion fails
        return url;
      }
    } catch (err) {
      console.error('❌ Failed to convert Unsplash URL via proxy:', url, err);
      // Return original URL if conversion fails
      return url;
    }
  }
  
  // Return original URL if conversion fails
  return url;
};

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    if (product.image_url) {
      setIsLoadingImage(true);
      setImageError(false);
      getImageUrl(product.image_url).then(converted => {
        setImageUrl(converted);
        setIsLoadingImage(false);
        if (product.image_url !== converted) {
          console.log(`Converted Unsplash URL for ${product.name}:`, product.image_url, '→', converted);
        }
      }).catch(err => {
        console.error(`Error converting URL for ${product.name}:`, err);
        setImageUrl(product.image_url); // Fallback to original
        setIsLoadingImage(false);
      });
    } else {
      setImageUrl(null);
      setIsLoadingImage(false);
      console.error(`Product ${product.name} (ID: ${product._id || product.id}) is missing image_url in database`);
    }
  }, [product.image_url, product.name, product._id, product.id]);
  
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {isLoadingImage ? (
        <div className="w-full h-80 bg-muted flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading image...</p>
        </div>
      ) : imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-80 object-cover"
          onError={(e) => {
            console.error(`Failed to load image for ${product.name}:`, imageUrl);
            console.error(`Original URL was:`, product.image_url);
            setImageError(true);
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add('bg-muted');
          }}
        />
              ) : (
                <div className="w-full h-80 bg-muted flex flex-col items-center justify-center p-4">
                  <p className="text-muted-foreground text-sm text-center mb-2">
                    {product.image_url ? 'Failed to load image' : 'No image URL in database'}
                  </p>
                  {product.image_url && product.image_url.includes('unsplash.com/photos/') && (
                    <p className="text-xs text-amber-600 text-center">
                      ⚠️ Unsplash photo page URLs don't work. Please update with a direct image URL.
                    </p>
                  )}
                </div>
              )}
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-1">{product.brands?.name}</p>
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-muted-foreground mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">{product.price} EGP</span>
          <Button onClick={() => onAddToCart(product._id || product.id || '')}>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
};

