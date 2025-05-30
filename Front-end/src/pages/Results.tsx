import React, { useState, useEffect, useMemo } from 'react';
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Download, Send, Eye, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { toast } from "sonner";
import { ErrorState } from "@/components/error-state";

interface TestResult {
  sample_id: string;
  test_id: string;
  sample: {
    id: string;
    patient: {
      id: string;
      name: string;
    };
    collection_date: string;
    collection_time: string;
    priority: string;
    status: string;
  };
  test: {
    id: string;
    name: string;
    category: string;
  };
  status: string;
  results: Record<string, any>;
  notes: string;
  technician?: string;
  created_at: string;
  updated_at: string;
}

const Results = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const queryClient = useQueryClient();

  // Fetch samples with safer error handling
  const { data: samplesResponse, isLoading, error, isError } = useQuery({
    queryKey: ["samples", "tests"],
    queryFn: async () => {
      try {
        const response = await api.getSamples();
        if (!response?.data?.data) {
          throw new Error("Invalid response format from server");
        }
        
        // Fetch all sample tests in parallel with error handling
        const samples = response.data.data;
        const sampleTestDetails = await Promise.all(
          samples.map(async (sample: any) => {
            try {
              const testsResponse = await api.getSampleTests(sample.id);
              if (!testsResponse?.data?.data) {
                throw new Error(`Failed to fetch tests for sample ${sample.id}`);
              }
              return {
                ...sample,
                tests: testsResponse.data.data
              };
            } catch (err: any) {
              console.error(`Error fetching tests for sample ${sample.id}:`, err);
              // Return sample with empty tests array instead of failing completely
              return {
                ...sample,
                tests: []
              };
            }
          })
        );
        return sampleTestDetails;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || "Failed to fetch test results";
        toast.error(message);
        throw new Error(message);
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Transform samples data safely
  const testResults = useMemo(() => {
    if (!Array.isArray(samplesResponse)) return [];
    
    return samplesResponse.flatMap((sample: any) => {
      try {
        // Ensure sample and its tests array exist
        if (!sample || !Array.isArray(sample.tests)) return [];
        
        return sample.tests.map((test: any) => ({
          sample_id: sample.id || '',
          test_id: test?.id || '',
          sample: {
            id: sample.id || '',
            patient: {
              id: sample.patient?.id || '',
              name: sample.patient?.name || 'Unknown Patient'
            },
            collection_date: sample.collection_date || '',
            collection_time: sample.collection_time || '',
            priority: sample.priority || 'normal',
            status: sample.status || 'pending'
          },
          test: {
            id: test?.id || '',
            name: test?.name || 'Unknown Test',
            category: test?.category || ''
          },
          status: test?.pivot?.status || 'pending',
          results: test?.pivot?.results || {},
          notes: test?.pivot?.notes || '',
          technician: test?.pivot?.technician || '',
          created_at: test?.pivot?.created_at || '',
          updated_at: test?.pivot?.updated_at || ''
        }));
      } catch (err) {
        console.error('Error transforming sample data:', err);
        return [];
      }
    });
  }, [samplesResponse]);

  // Apply filters safely
  const filteredResults = useMemo(() => {
    try {
      return testResults.filter((result: TestResult) => {
        const matchesSearch = 
          (result.sample_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (result.sample.patient.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (result.test.name || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || result.sample.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      });
    } catch (err) {
      console.error('Error filtering results:', err);
      return [];
    }
  }, [testResults, searchTerm, statusFilter, priorityFilter]);

  // Handle error states
  if (isError) {
    return (
      <ErrorState 
        error={error instanceof Error ? error : new Error("An error occurred while fetching results")}
        queryKey={["samples", "tests"]}
        queryClient={queryClient}
      />
    );
  }

  // Helper functions for UI
  const getStatusColor = (status: string) => {
    try {
      switch (status.toLowerCase()) {
        case "completed": return "bg-green-100 text-green-800";
        case "pending_review": return "bg-yellow-100 text-yellow-800";
        case "in_progress": return "bg-blue-100 text-blue-800";
        default: return "bg-gray-100 text-gray-800";
      }
    } catch (err) {
      return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    try {
      switch (priority.toLowerCase()) {
        case "stat": return "bg-red-100 text-red-800";
        case "urgent": return "bg-orange-100 text-orange-800";
        case "normal": return "bg-gray-100 text-gray-800";
        default: return "bg-gray-100 text-gray-800";
      }
    } catch (err) {
      return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    try {
      return status.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } catch (err) {
      return status;
    }
  };

  // Update result handler
  const updateResultMutation = useMutation({
    mutationFn: ({ sampleId, testId, data }: { sampleId: string, testId: string, data: any }) =>
      api.updateSampleTest(sampleId, testId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples", "tests"] });
      toast.success("Test result updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update test result");
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Results & Reports</h1>
          <p className="text-gray-600">View and manage test results and reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by accession number, patient, or test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="stat">Stat</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test Results ({filteredResults.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 && !isLoading ? (
            <div className="text-center text-gray-500 py-8">No results found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sample ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Collection Date</TableHead>
                  <TableHead>Updated Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : filteredResults.map((sample: any) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.sample_id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sample.sample.patient.name}</div>
                        <div className="text-sm text-gray-500">{sample.sample.patient.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{sample.test.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{sample.sample.collection_date}</div>
                        <div className="text-gray-500">{sample.sample.collection_time}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(sample.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(sample.sample.priority)}>
                        {sample.sample.priority.charAt(0).toUpperCase() + sample.sample.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(sample.status)}>
                          {formatStatus(sample.status)}
                        </Badge>
                        {sample.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{sample.technician || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {sample.status === "completed" && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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

export default Results;
