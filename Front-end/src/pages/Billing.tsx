
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
import { Search, Plus, DollarSign, Receipt, Download, Eye } from 'lucide-react';

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const invoices = [
    { 
      invoiceId: "INV001",
      patientName: "John Doe",
      patientId: "P001",
      tests: ["Complete Blood Count", "Lipid Profile"],
      totalAmount: 80.00,
      paidAmount: 80.00,
      balance: 0.00,
      status: "Paid",
      date: "2024-01-15",
      dueDate: "2024-01-30",
      insurance: "Blue Cross"
    },
    { 
      invoiceId: "INV002",
      patientName: "Jane Smith",
      patientId: "P002",
      tests: ["Thyroid Panel"],
      totalAmount: 85.00,
      paidAmount: 0.00,
      balance: 85.00,
      status: "Pending",
      date: "2024-01-15",
      dueDate: "2024-01-30",
      insurance: "Aetna"
    },
    { 
      invoiceId: "INV003",
      patientName: "Bob Johnson",
      patientId: "P003",
      tests: ["Liver Function Tests"],
      totalAmount: 55.00,
      paidAmount: 25.00,
      balance: 30.00,
      status: "Partial",
      date: "2024-01-14",
      dueDate: "2024-01-29",
      insurance: "Self-Pay"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Partial": return "bg-orange-100 text-orange-800";
      case "Overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Manage invoices and payment tracking</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="patientSelect">Patient</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P001">John Doe (P001)</SelectItem>
                    <SelectItem value="P002">Jane Smith (P002)</SelectItem>
                    <SelectItem value="P003">Bob Johnson (P003)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue-cross">Blue Cross</SelectItem>
                    <SelectItem value="aetna">Aetna</SelectItem>
                    <SelectItem value="medicare">Medicare</SelectItem>
                    <SelectItem value="self-pay">Self-Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input id="discount" type="number" placeholder="0" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="tests">Tests</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cbc">Complete Blood Count - $45</SelectItem>
                    <SelectItem value="lipid">Lipid Profile - $35</SelectItem>
                    <SelectItem value="liver">Liver Function - $55</SelectItem>
                    <SelectItem value="thyroid">Thyroid Panel - $85</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Additional notes or comments" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Invoice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">${totalOutstanding.toFixed(2)}</p>
              </div>
              <Receipt className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-600">{invoices.length}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                <p className="text-2xl font-bold text-gray-600">{invoices.filter(inv => inv.status === 'Paid').length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search invoices by ID or patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Invoices ({filteredInvoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.invoiceId}>
                  <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.patientName}</div>
                      <div className="text-sm text-gray-500">{invoice.patientId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {invoice.tests.slice(0, 1).map((test, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {test}
                        </Badge>
                      ))}
                      {invoice.tests.length > 1 && (
                        <Badge variant="outline" className="text-xs">
                          +{invoice.tests.length - 1} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>${invoice.paidAmount.toFixed(2)}</TableCell>
                  <TableCell>${invoice.balance.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
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

export default Billing;
