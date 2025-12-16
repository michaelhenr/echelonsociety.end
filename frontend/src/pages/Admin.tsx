import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotificationBell } from "@/components/NotificationBell";
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
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);
  const [viewingBrand, setViewingBrand] = useState<any | null>(null);
  const [viewingAd, setViewingAd] = useState<any | null>(null);
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
    // TODO: Implement admin authentication with backend
    // For now, allow access (you can add JWT token check here)
  };

  const fetchData = async () => {
    try {
      const [brandsData, productsData, ordersData, adsData] = await Promise.all([
        api.fetchBrands(),
        api.fetchProducts(true), // Admin needs to see all products (pending/approved/rejected)
        api.fetchOrders(),
        api.fetchAds(),
      ]);

      setBrands(brandsData || []);
      setProducts(productsData || []);
      setOrders(ordersData || []);
      setAds(adsData || []);
      setClientEntries([]); // Not implemented in backend yet

      setStats({
        brands: brandsData?.length || 0,
        products: productsData?.length || 0,
        orders: ordersData?.length || 0,
        ads: adsData?.length || 0,
        clientEntries: 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  const exportToExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const approveProduct = async (product: any) => {
    try {
      const id = product._id || product.id;
      if (!id) {
        toast({ title: "Error", description: "Product ID is missing", variant: "destructive" });
        return;
      }
      console.log('Approving product:', {
        name: product.name,
        id: id,
        idType: typeof id,
        idLength: id?.toString().length
      });
      console.log('Full URL will be:', `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3400'}/product/${id}/approve`);
      await api.approveProduct(id);
      toast({ title: "Success", description: "Product approved" });
      fetchData();
    } catch (error: any) {
      console.error('Approve error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      toast({ title: "Error", description: error.message || "Failed to approve product", variant: "destructive" });
    }
  };

  const rejectProduct = async (product: any) => {
    try {
      const id = product._id || product.id;
      if (!id) {
        toast({ title: "Error", description: "Product ID is missing", variant: "destructive" });
        return;
      }
      await api.rejectProduct(id);
      toast({ title: "Success", description: "Product rejected" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to reject product", variant: "destructive" });
    }
  };

  const deleteProduct = async (product: any) => {
    try {
      const id = product._id || product.id;
      if (!id) {
        toast({ title: "Error", description: "Product ID is missing", variant: "destructive" });
        return;
      }
      await api.deleteProduct(id);
      toast({ title: "Success", description: "Product deleted successfully" });
      setEditingProduct(null); // Close dialog
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete product", variant: "destructive" });
    }
  };

  const deleteBrand = async (brand: any) => {
    try {
      const id = brand._id || brand.id;
      await api.deleteBrand(id);
      toast({ title: "Success", description: "Brand deleted" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete brand", variant: "destructive" });
    }
  };


  const acceptOrder = async (order: any) => {
    try {
      const id = order._id || order.id;
      if (!id) {
        toast({ title: "Error", description: "Order ID is missing", variant: "destructive" });
        return;
      }
      await api.acceptOrder(id);
      toast({ title: "Success", description: "Order accepted" });
      setViewingOrder(null); // Close dialog
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to accept order", variant: "destructive" });
    }
  };

  const rejectOrder = async (order: any) => {
    try {
      const id = order._id || order.id;
      if (!id) {
        toast({ title: "Error", description: "Order ID is missing", variant: "destructive" });
        return;
      }
      await api.rejectOrder(id);
      toast({ title: "Success", description: "Order rejected" });
      setViewingOrder(null); // Close dialog
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to reject order", variant: "destructive" });
    }
  };

  const acceptBrand = async (brand: any) => {
    try {
      const id = brand._id || brand.id;
      if (!id) {
        toast({ title: "Error", description: "Brand ID is missing", variant: "destructive" });
        return;
      }
      const updatedBrand = await api.acceptBrand(id);
      toast({ title: "Success", description: "Brand accepted" });
      // Update the viewing brand with the new status
      setViewingBrand({ ...viewingBrand, status: 'accepted' });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to accept brand", variant: "destructive" });
    }
  };

  const rejectBrand = async (brand: any) => {
    try {
      const id = brand._id || brand.id;
      if (!id) {
        toast({ title: "Error", description: "Brand ID is missing", variant: "destructive" });
        return;
      }
      const updatedBrand = await api.rejectBrand(id);
      toast({ title: "Success", description: "Brand rejected" });
      // Update the viewing brand with the new status
      setViewingBrand({ ...viewingBrand, status: 'rejected' });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to reject brand", variant: "destructive" });
    }
  };

  const acceptAd = async (ad: any) => {
    try {
      const id = ad._id || ad.id;
      if (!id) {
        toast({ title: "Error", description: "Ad ID is missing", variant: "destructive" });
        return;
      }
      const updatedAd = await api.acceptAd(id);
      toast({ title: "Success", description: "Ad accepted" });
      // Update the viewing ad with the new status
      setViewingAd({ ...viewingAd, status: 'accepted' });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to accept ad", variant: "destructive" });
    }
  };

  const rejectAd = async (ad: any) => {
    try {
      const id = ad._id || ad.id;
      if (!id) {
        toast({ title: "Error", description: "Ad ID is missing", variant: "destructive" });
        return;
      }
      const updatedAd = await api.rejectAd(id);
      toast({ title: "Success", description: "Ad rejected" });
      // Update the viewing ad with the new status
      setViewingAd({ ...viewingAd, status: 'rejected' });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to reject ad", variant: "destructive" });
    }
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      brandId: product.brand_id || product.brand?._id || product.brand?.id,
      imageUrl: product.image_url || "",
    });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Image URL is mandatory when editing
    if (!editForm.name || !editForm.price || !editForm.category || !editForm.brandId || !editForm.imageUrl) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including Image URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const productId = editingProduct._id || editingProduct.id;
      await api.updateProduct(productId, {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        category: editForm.category,
        brand_id: editForm.brandId,
        image_url: editForm.imageUrl, // Mandatory
        stock: editingProduct.stock || 0,
      });

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
          <NotificationBell />
        </div>

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
                    {clientEntries.map((entry, index) => {
                      const clientOrders = orders.filter(o => o.client_name === entry.name);
                      const hasNewsletter = entry.email ? "✓" : "-";
                      return (
                        <TableRow key={entry._id || entry.id || `client-${index}`}>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id || order.id || Math.random()}>
                        <TableCell>{order.client_name}</TableCell>
                        <TableCell>{order.client_email}</TableCell>
                        <TableCell>{order.client_phone}</TableCell>
                        <TableCell>{order.client_city}</TableCell>
                        <TableCell>{order.total_amount} EGP</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status || 'pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setViewingOrder(order)}>
                            View Details
                          </Button>
                        </TableCell>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id || product.id || Math.random()}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brands?.name}</TableCell>
                        <TableCell>{product.price} EGP</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            product.status === 'approved' ? 'bg-green-100 text-green-800' :
                            product.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.status || 'pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 flex-wrap">
                            {product.status !== 'approved' && (
                              <Button variant="default" size="sm" onClick={() => approveProduct(product)}>
                                Approve
                              </Button>
                            )}
                            {product.status !== 'approved' && product.status !== 'rejected' && (
                              <Button variant="destructive" size="sm" onClick={() => rejectProduct(product)}>
                                Reject
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                              Edit
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
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brands.map((brand) => (
                      <TableRow key={brand._id || brand.id || Math.random()}>
                        <TableCell>{brand.name}</TableCell>
                        <TableCell>{brand.contact_email}</TableCell>
                        <TableCell>{brand.contact_phone}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            brand.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            brand.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {brand.status || 'pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {brand.status !== 'rejected' && (
                            <Button variant="outline" size="sm" onClick={() => setViewingBrand(brand)}>
                              Brand Details
                            </Button>
                          )}
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
                      <TableRow key={ad._id || ad.id || Math.random()}>
                        <TableCell>{ad.title}</TableCell>
                        <TableCell>{ad.budget} EGP</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            ad.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            ad.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ad.status || 'pending'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {ad.status !== 'rejected' && (
                            <Button variant="outline" size="sm" onClick={() => setViewingAd(ad)}>
                              Ad Details
                            </Button>
                          )}
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
                    <SelectItem key="sport-accessories" value="Sport Accessories">Sport Accessories</SelectItem>
                    <SelectItem key="electronics" value="Electronics">Electronics</SelectItem>
                    <SelectItem key="clothing" value="Clothing">Clothing</SelectItem>
                    <SelectItem key="accessories" value="Accessories">Accessories</SelectItem>
                    <SelectItem key="home-decor" value="Home & Decor">Home & Decor</SelectItem>
                    <SelectItem key="unique-items" value="Unique Items">Unique Items</SelectItem>
                    <SelectItem key="other" value="Other">Other</SelectItem>
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
                      <SelectItem key={brand._id || brand.id || Math.random()} value={brand._id || brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-imageUrl">Image URL *</Label>
                <Input
                  id="edit-imageUrl"
                  type="url"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                  required
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-muted-foreground mt-1">Image URL is required when editing</p>
              </div>

              <div className="flex gap-2 justify-between">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => {
                    if (editingProduct) {
                      deleteProduct(editingProduct);
                    }
                  }}
                >
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Product</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Order Details Dialog */}
        <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {viewingOrder && (
              <div className="space-y-6">
                {/* Client Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Client Name</Label>
                    <p className="text-sm">{viewingOrder.client_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Email</Label>
                    <p className="text-sm">{viewingOrder.client_email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Phone</Label>
                    <p className="text-sm">{viewingOrder.client_phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">City</Label>
                    <p className="text-sm">{viewingOrder.client_city}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-semibold">Full Address</Label>
                    <p className="text-sm">{viewingOrder.client_address || "Not provided"}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Order Items</Label>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewingOrder.items?.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              {item.product_id?.name || `Product ID: ${item.product_id?._id || item.product_id}`}
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.price} EGP</TableCell>
                            <TableCell>{(item.quantity * item.price).toFixed(2)} EGP</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Shipping Cost:</span>
                    <span className="text-sm font-semibold">{viewingOrder.shipping_cost || 0} EGP</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>{viewingOrder.total_amount} EGP</span>
                  </div>
                </div>

                {/* Order Date */}
                <div>
                  <Label className="text-sm font-semibold">Order Date</Label>
                  <p className="text-sm">{new Date(viewingOrder.created_at).toLocaleString()}</p>
                </div>

                {/* Actions */}
                {viewingOrder.status === 'pending' && (
                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      onClick={() => rejectOrder(viewingOrder)}
                    >
                      Reject Order
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={() => acceptOrder(viewingOrder)}
                    >
                      Accept Order
                    </Button>
                  </div>
                )}
                {viewingOrder.status !== 'pending' && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Order status: <span className="font-semibold">{viewingOrder.status}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Brand Details Dialog */}
        <Dialog open={!!viewingBrand} onOpenChange={(open) => !open && setViewingBrand(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Brand Details</DialogTitle>
            </DialogHeader>
            {viewingBrand && (
              <div className="space-y-6">
                {/* Brand Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Brand Name</Label>
                    <p className="text-sm">{viewingBrand.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Status</Label>
                    <p className="text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        viewingBrand.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        viewingBrand.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {viewingBrand.status || 'pending'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Contact Email</Label>
                    <p className="text-sm">{viewingBrand.contact_email || viewingBrand.email || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Contact Phone</Label>
                    <p className="text-sm">{viewingBrand.contact_phone || viewingBrand.phone || "Not provided"}</p>
                  </div>
                  {viewingBrand.description && (
                    <div className="col-span-2">
                      <Label className="text-sm font-semibold">Description</Label>
                      <p className="text-sm">{viewingBrand.description}</p>
                    </div>
                  )}
                  {viewingBrand.logo_url && (
                    <div className="col-span-2">
                      <Label className="text-sm font-semibold">Logo</Label>
                      <img 
                        src={viewingBrand.logo_url} 
                        alt={viewingBrand.name}
                        className="mt-2 w-32 h-32 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Brand Date */}
                {viewingBrand.created_at && (
                  <div>
                    <Label className="text-sm font-semibold">Submitted Date</Label>
                    <p className="text-sm">{new Date(viewingBrand.created_at).toLocaleString()}</p>
                  </div>
                )}

                {/* Actions */}
                {(viewingBrand.status === 'pending' || !viewingBrand.status) && (
                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      onClick={() => rejectBrand(viewingBrand)}
                    >
                      Reject Brand
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={() => acceptBrand(viewingBrand)}
                    >
                      Accept Brand
                    </Button>
                  </div>
                )}
                {viewingBrand.status && viewingBrand.status !== 'pending' && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Brand status: <span className="font-semibold">{viewingBrand.status}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Ad Details Dialog */}
        <Dialog open={!!viewingAd} onOpenChange={(open) => !open && setViewingAd(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ad Details</DialogTitle>
            </DialogHeader>
            {viewingAd && (
              <div className="space-y-6">
                {/* Ad Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Title</Label>
                    <p className="text-sm">{viewingAd.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Status</Label>
                    <p className="text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        viewingAd.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        viewingAd.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {viewingAd.status || 'pending'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Budget</Label>
                    <p className="text-sm">{viewingAd.budget} EGP</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Active</Label>
                    <p className="text-sm">{viewingAd.active ? "Yes" : "No"}</p>
                  </div>
                  {viewingAd.description && (
                    <div className="col-span-2">
                      <Label className="text-sm font-semibold">Description</Label>
                      <p className="text-sm">{viewingAd.description}</p>
                    </div>
                  )}
                  {viewingAd.start_date && (
                    <div>
                      <Label className="text-sm font-semibold">Start Date</Label>
                      <p className="text-sm">{new Date(viewingAd.start_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {viewingAd.end_date && (
                    <div>
                      <Label className="text-sm font-semibold">End Date</Label>
                      <p className="text-sm">{new Date(viewingAd.end_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {viewingAd.image_url && (
                    <div className="col-span-2">
                      <Label className="text-sm font-semibold">Image</Label>
                      <img 
                        src={viewingAd.image_url} 
                        alt={viewingAd.title}
                        className="mt-2 w-full max-w-md h-64 object-cover border rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Ad Date */}
                {viewingAd.created_at && (
                  <div>
                    <Label className="text-sm font-semibold">Submitted Date</Label>
                    <p className="text-sm">{new Date(viewingAd.created_at).toLocaleString()}</p>
                  </div>
                )}

                {/* Actions */}
                {(viewingAd.status === 'pending' || !viewingAd.status) && (
                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      onClick={() => rejectAd(viewingAd)}
                    >
                      Reject Ad
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={() => acceptAd(viewingAd)}
                    >
                      Accept Ad
                    </Button>
                  </div>
                )}
                {viewingAd.status && viewingAd.status !== 'pending' && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Ad status: <span className="font-semibold">{viewingAd.status}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
