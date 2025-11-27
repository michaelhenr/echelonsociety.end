-- Allow public read access to orders (admin panel is password-protected)
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Orders are viewable by everyone" 
ON orders 
FOR SELECT 
USING (true);

-- Allow public read access to client_entries (admin panel is password-protected)
DROP POLICY IF EXISTS "Admins can view all client entries" ON client_entries;
CREATE POLICY "Client entries are viewable by everyone" 
ON client_entries 
FOR SELECT 
USING (true);

-- Allow public read access to newsletter_subscribers (admin panel is password-protected)
DROP POLICY IF EXISTS "Admins can view subscribers" ON newsletter_subscribers;
CREATE POLICY "Newsletter subscribers are viewable by everyone" 
ON newsletter_subscribers 
FOR SELECT 
USING (true);

-- Allow public read access to order_items (admin panel is password-protected)
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Order items are viewable by everyone" 
ON order_items 
FOR SELECT 
USING (true);