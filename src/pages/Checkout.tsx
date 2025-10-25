import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, products } = location.state || { cart: new Map(), products: [] };
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const calculateTotal = () => {
    let total = 0;
    cart.forEach((quantity: number, productId: string) => {
      const product = products.find((p: any) => p.id === productId);
      if (product) {
        total += product.price * quantity;
      }
    });
    return total;
  };

  const calculateShipping = () => {
    const city = formData.city.toLowerCase();
    if (city.includes("alex") || city.includes("cairo")) {
      return 70;
    }
    return 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const subtotal = calculateTotal();
    const shipping = calculateShipping();
    const total = subtotal + shipping;

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone,
          client_address: formData.address,
          client_city: formData.city,
          total_amount: total,
          shipping_cost: shipping,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = Array.from(cart.entries()).map(([productId, quantity]) => {
        const product = products.find((p: any) => p.id === productId);
        return {
          order_id: order.id,
          product_id: productId,
          quantity,
          price: product.price,
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Order Placed Successfully!",
        description: "We'll contact you soon to confirm delivery.",
      });

      navigate("/products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alexandria">Alexandria</SelectItem>
                <SelectItem value="Cairo">Cairo</SelectItem>
                <SelectItem value="Other">Other City</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{calculateTotal()} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formData.city ? calculateShipping() : 0} EGP</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formData.city ? calculateTotal() + calculateShipping() : calculateTotal()} EGP</span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">Place Order</Button>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
