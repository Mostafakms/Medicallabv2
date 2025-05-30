
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Package, AlertTriangle, Edit, Eye } from 'lucide-react';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const inventory = [
    { 
      id: "INV001", 
      name: "CBC Reagent Kit",
      category: "Reagents",
      supplier: "MedSupply Co.",
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      unitPrice: 45.00,
      expiryDate: "2024-12-15",
      location: "Refrigerator A-1",
      status: "In Stock"
    },
    { 
      id: "INV002", 
      name: "Blood Collection Tubes",
      category: "Consumables",
      supplier: "LabTech Inc.",
      currentStock: 5,
      minStock: 20,
      maxStock: 500,
      unitPrice: 0.50,
      expiryDate: "2025-06-30",
      location: "Storage Room B",
      status: "Low Stock"
    },
    { 
      id: "INV003", 
      name: "Microscope Slides",
      category: "Equipment",
      supplier: "GlassTech Ltd.",
      currentStock: 200,
      minStock: 50,
      maxStock: 1000,
      unitPrice: 0.25,
      expiryDate: "N/A",
      location: "Supply Cabinet C",
      status: "In Stock"
    },
  ];

  const getStatusColor = (status: string, currentStock: number, minStock: number) => {
    if (currentStock <= minStock) return "bg-red-100 text-red-800";
    if (currentStock <= minStock * 1.5) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage lab supplies, reagents, and equipment</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input id="itemName" placeholder="Enter item name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemCode">Item Code</Label>
                  <Input id="itemCode" placeholder="Enter item code" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reagents">Reagents</SelectItem>
                      <SelectItem value="consumables">Consumables</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="chemicals">Chemicals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" placeholder="Enter supplier name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price ($)</Label>
                  <Input id="unitPrice" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock</Label>
                  <Input id="minStock" type="number" placeholder="10" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search items by name, code, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="reagents">Reagents</SelectItem>
                <SelectItem value="consumables">Consumables</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Items ({filteredInventory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.currentStock}
                      {item.currentStock <= item.minStock && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.minStock}/{item.maxStock}</TableCell>
                  <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status, item.currentStock, item.minStock)}>
                      {item.currentStock <= item.minStock ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
