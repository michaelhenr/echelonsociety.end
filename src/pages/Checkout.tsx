import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { OrdersAPI } from "@/services/api";
import { useNavigate, useLocation } from "react-router-dom";
import bgLogo5 from "@/assets/bg-logo-5.jpg";

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
    paymentMethod: "cash",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
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

    try {
      // Prepare order items
      const items = Array.from(cart.entries()).map(([productId, quantity]) => {
        const product = products.find((p: any) => p.id === productId);
        return {
          product_id: productId,
          quantity,
          price: product?.price || 0,
        };
      });

      // Validate payment method
      if (formData.paymentMethod === "visa") {
        if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVV) {
          toast({
            title: "Error",
            description: "Please fill in all card details",
            variant: "destructive",
          });
          return;
        }
        if (formData.cardNumber.length !== 16) {
          toast({
            title: "Error",
            description: "Card number must be 16 digits",
            variant: "destructive",
          });
          return;
        }
      }

      // Create order using backend API (automatically calculates shipping and total)
      const orderResponse = await OrdersAPI.create({
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        client_address: formData.address,
        client_city: formData.city,
        payment_method: formData.paymentMethod,
        card_last_four: formData.paymentMethod === "visa" ? formData.cardNumber.slice(-4) : null,
        items,
      });

      toast({
        title: "Order Placed Successfully!",
        description: `Total: ${orderResponse.total} EGP. We'll contact you soon!`,
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
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgLogo5})` }}
      >
        <div className="bg-background/90 backdrop-blur-sm min-h-screen">
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

          <div className="border-t pt-6 space-y-4">
            <Label>Payment Method</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === "cash"}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="h-4 w-4"
                />
                <Label htmlFor="cash" className="font-normal cursor-pointer">
                  Cash on Delivery
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="visa"
                  name="paymentMethod"
                  value="visa"
                  checked={formData.paymentMethod === "visa"}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="h-4 w-4"
                />
                <Label htmlFor="visa" className="font-normal cursor-pointer">
                  Visa Card
                </Label>
              </div>
            </div>

            {formData.paymentMethod === "visa" && (
              <div className="space-y-4 mt-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                      setFormData({ ...formData, cardNumber: value });
                    }}
                    maxLength={16}
                    required={formData.paymentMethod === "visa"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardExpiry">Expiry (MM/YY)</Label>
                    <Input
                      id="cardExpiry"
                      placeholder="12/25"
                      value={formData.cardExpiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setFormData({ ...formData, cardExpiry: value });
                      }}
                      maxLength={5}
                      required={formData.paymentMethod === "visa"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCVV">CVV</Label>
                    <Input
                      id="cardCVV"
                      placeholder="123"
                      type="password"
                      value={formData.cardCVV}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setFormData({ ...formData, cardCVV: value });
                      }}
                      maxLength={3}
                      required={formData.paymentMethod === "visa"}
                    />
                  </div>
                </div>
              </div>
            )}
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
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
