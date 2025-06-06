import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { TestTube, Edit, Eye, Search, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    usage: 'all',
    category: 'all',
    status: 'all'
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const { data: testsResponse, isLoading, error, isError } = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      const response = await api.getTests();
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  const testsData = useMemo(() => {
    if (!Array.isArray(testsResponse)) return [];
    return testsResponse.map((test: any) => ({
      id: test?.id || '',
      name: test?.name || '',
      code: test?.code || '',
      category: test?.category || '',
      department: test?.department || '',
      parameters: Array.isArray(test?.parameters)
        ? test.parameters.map((param: any) => param.name || param)
        : [],
      sample_types: Array.isArray(test?.sample_types) ? test?.sample_types : [],
      price: typeof test?.price === 'number' || typeof test?.price === 'string' ? Number(test?.price) : 0,
      status: test?.status || 'unknown',
      duration: test?.duration || '',
      samples_count: typeof test?.samples_count === 'number' ? test?.samples_count : 0
    }));
  }, [testsResponse]);

  const filteredTests = useMemo(() => {
    if (!Array.isArray(testsData)) return [];
    const searchLower = searchTerm.toLowerCase();
    return testsData.filter((test) =>
      test.name.toLowerCase().includes(searchLower) ||
      test.code.toLowerCase().includes(searchLower) ||
      test.category.toLowerCase().includes(searchLower)
    );
  }, [testsData, searchTerm]);

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

  useEffect(() => {
    if (!isAddDialogOpen) {
      resetForm();
    }
  }, [isAddDialogOpen, resetForm]);

  const createTestMutation = useMutation({
    mutationFn: async (data: any) => {
      const formattedData = {
        ...data,
        parameters: data.parameters ? data.parameters.split(',').map((p: string) => p.trim()) : [],
        price: parseFloat(data.price) || 0
      };
      return await api.createTest(formattedData);
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

  const deleteTestMutation = useMutation({
    mutationFn: (id: string) => api.deleteTest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      toast.success("Test deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete test");
    }
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<any>(null);

  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>An error occurred while fetching tests.</p>
        <p>{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Loading tests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Management</h1>
          <p className="text-gray-600">Configure and manage laboratory tests</p>
        </div>
        <Button
          onClick={() => navigate('/tests/add')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Test
        </Button>
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
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.code}</TableCell>
                    <TableCell>{test.name}</TableCell>
                    <TableCell>{test.category}</TableCell>
                    <TableCell>${Number(test.price).toFixed(2)}</TableCell>
                    <TableCell>{test.status}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/edit-test/${test.id}`)}
                          title="Edit Test"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTestToDelete(test);
                            setDeleteDialogOpen(true);
                          }}
                          title="Delete Test"
                        >
                          <span className="sr-only">Delete</span>
                          <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Test</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete test <b>{testToDelete?.name}</b>?</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (testToDelete) {
                  deleteTestMutation.mutate(testToDelete.id);
                  setDeleteDialogOpen(false);
                  setTestToDelete(null);
                }
              }}
              disabled={deleteTestMutation.isPending}
            >
              {deleteTestMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tests;