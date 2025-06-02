import React, { useState, useEffect, useCallback } from 'react';
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
import { Search, Plus, TestTube, Edit, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { toast } from "sonner";
import { ErrorState } from "@/components/error-state";

interface Test {
  id: string;
  name: string;
  code: string;
  category: string;
  department: string;
  price: number;
  duration: string;
  status: string;
  parameters: string[];
  sample_types: string[];
  samples_count: number;
}

// Standardize allowed sample types for tests to match receive sample
const allowedSampleTypes = [
  "blood",
  "urine",
  "stool",
  "sputum",
  "tissue"
];

const Tests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    usage: 'all', // 'all' or 'active'
    category: 'all',
    status: 'all'
  });
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    department: '',
    price: '',
    duration: '',
    parameters: '',
    sample_types: [] as string[],
    status: 'active'
  });

  // Safe test data fetching with filters
  const { data: testsResponse, isLoading, error, isError } = useQuery({
    queryKey: ["tests", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters.usage === 'active') params.append('usage', 'active');
        if (filters.category !== 'all') params.append('category', filters.category);
        if (filters.status !== 'all') params.append('status', filters.status);

        const response = await api.getTests(params);
        console.log("API Response:", response); // Log API response
        if (!response?.data?.data) {
          throw new Error("Invalid response format from server");
        }
        return response.data.data;
      } catch (err: any) {
        console.error("API Error:", err); // Log API error
        const message = err.response?.data?.message || err.message || "Failed to fetch tests";
        toast.error(message);
        throw new Error(message);
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Update the transformation logic for the `parameters` field to extract only parameter names
  const testsData = React.useMemo(() => {
    if (!Array.isArray(testsResponse)) return [];

    return testsResponse.map((test: any) => ({
      id: test?.id || '',
      name: test?.name || '',
      code: test?.code || '',
      category: test?.category || '',
      department: test?.department || '',
      parameters: Array.isArray(test?.parameters)
        ? test.parameters.map((param: any) => typeof param === 'object' && param.name ? param.name : param)
        : [],
      sample_types: Array.isArray(test?.sample_types) ? test?.sample_types : [],
      price: typeof test?.price === 'number' ? test?.price : 0,
      status: test?.status || 'unknown',
      duration: test?.duration || '',
      samples_count: typeof test?.samples_count === 'number' ? test?.samples_count : 0
    }));
  }, [testsResponse]);

  // Add logging to debug the white page issue
  console.log("Tests Response:", testsResponse);
  console.log("Transformed Tests Data:", testsData);

  // Filter tests safely
  const filteredTests = React.useMemo(() => {
    if (!Array.isArray(testsData)) return [];
    
    return testsData.filter((test) => {
      try {
        const searchLower = searchTerm.toLowerCase();
        return (
          test.name.toLowerCase().includes(searchLower) ||
          test.code.toLowerCase().includes(searchLower) ||
          test.category.toLowerCase().includes(searchLower)
        );
      } catch (err) {
        console.error('Error filtering test:', err);
        return false;
      }
    });
  }, [testsData, searchTerm]);

  // Handle dialog state changes safely
  useEffect(() => {
    if (!isAddDialogOpen) {
      resetForm();
    }
  }, [isAddDialogOpen]);

  // Handle error state
  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>An error occurred while fetching tests.</p>
        <p>{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Loading tests...</p>
      </div>
    );
  }

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      code: '',
      category: '',
      department: '',
      price: '',
      duration: '',
      parameters: '',
      sample_types: [],
      status: 'active'
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTestMutation.mutateAsync(formData);
    } catch (err) {
      console.error('Error submitting test:', err);
    }
  }, [formData]);

  // Create test mutation with safer error handling
  const createTestMutation = useMutation({
    mutationFn: async (data: any) => {
      try {
        const formattedData = {
          ...data,
          parameters: data.parameters ? data.parameters.split(',').map((p: string) => p.trim()).filter(Boolean) : [],
          price: parseFloat(data.price) || 0
        };
        return await api.createTest(formattedData);
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || "Failed to create test";
        toast.error(message);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      setIsAddDialogOpen(false);
      toast.success("Test added successfully");
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add test");
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Management</h1>
          <p className="text-gray-600">Configure and manage laboratory tests</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Test</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="testName">Test Name</Label>
                  <Input 
                    id="testName" 
                    placeholder="Enter test name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testCode">Test Code</Label>
                  <Input 
                    id="testCode" 
                    placeholder="Enter test code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hematology">Hematology</SelectItem>
                      <SelectItem value="clinical_chemistry">Clinical Chemistry</SelectItem>
                      <SelectItem value="microbiology">Microbiology</SelectItem>
                      <SelectItem value="immunology">Immunology</SelectItem>
                      <SelectItem value="endocrinology">Endocrinology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(val) => setFormData({ ...formData, department: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                      <SelectItem value="pathology">Pathology</SelectItem>
                      <SelectItem value="radiology">Radiology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input 
                    id="duration" 
                    placeholder="e.g., 2-4 hours"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="sampleTypes">Sample Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {allowedSampleTypes.map(type => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={type}
                          checked={formData.sample_types.includes(type)}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                sample_types: [...formData.sample_types, type]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                sample_types: formData.sample_types.filter(t => t !== type)
                              });
                            }
                          }}
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="parameters">Test Parameters</Label>
                  <Input 
                    id="parameters" 
                    placeholder="Enter parameters separated by commas"
                    value={formData.parameters}
                    onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createTestMutation.isPending}
                >
                  {createTestMutation.isPending ? "Adding..." : "Add Test"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search tests..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Usage Filter */}
            <Select
              value={filters.usage}
              onValueChange={(value) => setFilters(prev => ({ ...prev, usage: value }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Usage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tests</SelectItem>
                <SelectItem value="active">Active in Samples</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="hematology">Hematology</SelectItem>
                <SelectItem value="clinical_chemistry">Clinical Chemistry</SelectItem>
                <SelectItem value="microbiology">Microbiology</SelectItem>
                <SelectItem value="immunology">Immunology</SelectItem>
                <SelectItem value="endocrinology">Endocrinology</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Laboratory Tests ({filteredTests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No tests found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Code</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Sample Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Parameters</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.code}</TableCell>
                    <TableCell>{test.name}</TableCell>
                    <TableCell>{test.sample_types.join(', ')}</TableCell>
                    <TableCell>{test.category}</TableCell>
                    <TableCell>${test.price.toFixed(2)}</TableCell>
                    <TableCell>{test.duration}</TableCell>
                    <TableCell>{test.parameters.join(', ')}</TableCell>
                    <TableCell>{test.status}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Tests;
