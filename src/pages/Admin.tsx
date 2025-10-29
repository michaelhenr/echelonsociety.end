import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from "xlsx";
import bgLogo6 from "@/assets/bg-logo-6.jpg";

const Admin = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({ brands: 0, products: 0, orders: 0, ads: 0, clientEntries: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [clientEntries, setClientEntries] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brandId: "",
    imageUrl: "",
  });

  useEffect(() => {
    checkAdminAccess();
    fetchData();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Access Denied",
        description: "Please log in as admin",
        variant: "destructive",
      });
      return;
    }

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!data) {
      toast({
        title: "Access Denied",
        description: "You don't have admin permissions",
        variant: "destructive",
      });
    }
  };

  const fetchData = async () => {
    const [brandsRes, productsRes, ordersRes, adsRes, clientEntriesRes] = await Promise.all([
      supabase.from("brands").select("*"),
      supabase.from("products").select("*, brands(name)"),
      supabase.from("orders").select("*, order_items(*, products(name))"),
      supabase.from("ads").select("*"),
      supabase.from("client_entries").select("*").order("created_at", { ascending: false }),
    ]);

    if (brandsRes.data) setBrands(brandsRes.data);
    if (productsRes.data) setProducts(productsRes.data);
    if (ordersRes.data) setOrders(ordersRes.data);
    if (adsRes.data) setAds(adsRes.data);
    if (clientEntriesRes.data) setClientEntries(clientEntriesRes.data);

    setStats({
      brands: brandsRes.data?.length || 0,
      products: productsRes.data?.length || 0,
      orders: ordersRes.data?.length || 0,
      ads: adsRes.data?.length || 0,
      clientEntries: clientEntriesRes.data?.length || 0,
    });
  };

  const exportToExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Product deleted" });
      fetchData();
    }
  };

  const deleteBrand = async (id: string) => {
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Brand deleted" });
      fetchData();
    }
  };

  const deleteAd = async (id: string) => {
    const { error } = await supabase.from("ads").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Ad deleted" });
      fetchData();
    }
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      brandId: product.brand_id,
      imageUrl: product.image_url || "",
    });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editForm.name || !editForm.price || !editForm.category || !editForm.brandId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: editForm.name,
          description: editForm.description,
          price: parseFloat(editForm.price),
          category: editForm.category,
          brand_id: editForm.brandId,
          image_url: editForm.imageUrl,
        })
        .eq("id", editingProduct.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Product updated successfully",
      });

      setEditingProduct(null);
      fetchData();
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
        style={{ backgroundImage: `url(${bgLogo6})` }}
      >
        <div className="bg-background/90 backdrop-blur-sm min-h-screen">
          <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Client Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.clientEntries}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Brands</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.brands}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.products}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.orders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.ads}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clients">
          <TabsList>
            <TabsTrigger value="clients">Client Entries</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="ads">Ads</TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Client Entries</CardTitle>
                <Button onClick={() => exportToExcel(clientEntries, "client-entries")}>Export to Excel</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Entry Date</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Newsletter</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientEntries.map((entry) => {
                      const clientOrders = orders.filter(o => o.client_name === entry.name);
                      const hasNewsletter = entry.email ? "✓" : "-";
                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.name}</TableCell>
                          <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{clientOrders.length} order(s)</TableCell>
                          <TableCell>{hasNewsletter}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Orders</CardTitle>
                <Button onClick={() => exportToExcel(orders, "orders")}>Export to Excel</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.client_name}</TableCell>
                        <TableCell>{order.client_email}</TableCell>
                        <TableCell>{order.client_phone}</TableCell>
                        <TableCell>{order.client_city}</TableCell>
                        <TableCell>{order.total_amount} EGP</TableCell>
                        <TableCell>{order.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brands?.name}</TableCell>
                        <TableCell>{product.price} EGP</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brands">
            <Card>
              <CardHeader>
                <CardTitle>Brands</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brands.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell>{brand.name}</TableCell>
                        <TableCell>{brand.contact_email}</TableCell>
                        <TableCell>{brand.contact_phone}</TableCell>
                        <TableCell>
                          <Button variant="destructive" size="sm" onClick={() => deleteBrand(brand.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads">
            <Card>
              <CardHeader>
                <CardTitle>Advertisements</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell>{ad.title}</TableCell>
                        <TableCell>{ad.budget} EGP</TableCell>
                        <TableCell>{ad.active ? "Active" : "Inactive"}</TableCell>
                        <TableCell>
                          <Button variant="destructive" size="sm" onClick={() => deleteAd(ad.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="edit-price">Price (EGP) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={editForm.category} onValueChange={(value) => setEditForm({ ...editForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sweatshirts">Sweatshirts</SelectItem>
                    <SelectItem value="Hoodies">Hoodies</SelectItem>
                    <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-brand">Brand *</Label>
                <Select value={editForm.brandId} onValueChange={(value) => setEditForm({ ...editForm, brandId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-imageUrl">Image URL</Label>
                <Input
                  id="edit-imageUrl"
                  type="url"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                  Cancel
                </Button>
                <Button type="submit">Update Product</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
