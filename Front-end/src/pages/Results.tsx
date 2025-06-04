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
import { useNavigate } from 'react-router-dom';

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
  const [selectedSample, setSelectedSample] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch sample results with safer error handling
  const { data: resultsResponse, isLoading, error, isError } = useQuery({
    queryKey: ["sample-results"],
    queryFn: async () => {
      try {
        const response = await api.getSampleResults();
        if (!response?.data?.data) {
          throw new Error("Invalid response format from server");
        }
        return response.data.data;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || "Failed to fetch results";
        toast.error(message);
        throw new Error(message);
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Log the API response to inspect its structure
  console.log('API Response:', resultsResponse);

  // Debug: log each result and its sample/patient
  if (Array.isArray(resultsResponse)) {
    resultsResponse.forEach((result: any, idx: number) => {
      console.log(`Result[${idx}] sample:`, result.sample);
      console.log(`Result[${idx}] sample.patient:`, result.sample?.patient);
    });
  }

  // Transform results data safely
  const testResults = useMemo(() => {
    if (!Array.isArray(resultsResponse)) return [];

    return resultsResponse.map((result: any) => ({
      sample_id: result.sample_id || '',
      accession_number: result.sample?.accession_number || '',
      test_id: result.test_id || '',
      user_id: result.sample?.patient?.id || '',
      patient_name: result.sample?.patient?.name 
        || result.sample?.patient_name 
        || result.patient_name 
        || 'Unknown Patient',
      collection_date: result.sample?.collection_date || '',
      test_name: result.test?.name || 'Unknown Test',
      status: result.status || 'pending',
      results: result.results || {},
      created_at: result.created_at || '',
      phone: result.sample?.patient?.phone || '',
      priority: result.priority || 'normal',
    }));
  }, [resultsResponse]);

  // Combine results by sample_id
  const combinedResults = useMemo(() => {
    if (!Array.isArray(testResults)) return [];
    const map = new Map();
    testResults.forEach((result) => {
      if (!map.has(result.sample_id)) {
        map.set(result.sample_id, {
          ...result,
          test_names: [result.test_name],
          test_ids: [result.test_id],
        });
      } else {
        const entry = map.get(result.sample_id);
        entry.test_names.push(result.test_name);
        entry.test_ids.push(result.test_id);
      }
    });
    return Array.from(map.values());
  }, [testResults]);

  // Apply filters safely
  const filteredResults = useMemo(() => {
    try {
      return combinedResults.filter((result) => {
        const matchesSearch =
          String(result.sample_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(result.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(result.test_names.join(', ') || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
        const matchesPriority = priorityFilter === 'all';

        return matchesSearch && matchesStatus && matchesPriority;
      });
    } catch (err) {
      console.error('Error filtering results:', err);
      return [];
    }
  }, [combinedResults, searchTerm, statusFilter, priorityFilter]);

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
      queryClient.invalidateQueries({ queryKey: ["sample-results"] });
      toast.success("Test result updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update test result");
    }
  });

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by patient, test, or sample ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
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
            <Select
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isError ? (
        <ErrorState 
          error={error instanceof Error ? error : new Error("An error occurred while fetching results")}
          queryKey={["sample-results"]}
          queryClient={queryClient}
        />
      ) : (
        <Card>
          <CardContent>
            {filteredResults.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No results found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinedResults.map((result) => (
                    <TableRow key={result.sample_id}>
                      <TableCell>{result.sample_id}</TableCell>
                      <TableCell>{result.patient_name}</TableCell>
                      <TableCell>{result.test_names.join(', ')}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(result.status)}>{formatStatus(result.status)}</Badge>
                      </TableCell>
                      <TableCell>{result.phone || result.sample?.patient?.phone || result.sample?.phone || 'N/A'}</TableCell>
                      <TableCell>{/* Total Price column, empty for now */}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/sample-report/${result.accession_number}`)}
                          >
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
            )}
          </CardContent>
        </Card>
      )}

      {showReport && selectedSample && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-2xl print:w-full print:max-w-full">
            <h2 className="text-xl font-bold mb-4">Sample Report</h2>
            <p><strong>Sample ID:</strong> {selectedSample.sample_id}</p>
            <p><strong>Patient Name:</strong> {selectedSample.patient_name}</p>
            <p><strong>Phone:</strong> {selectedSample.phone || 'N/A'}</p>
            <p><strong>Tests:</strong> {selectedSample.test_names.join(', ')}</p>
            {/* Add more details as needed */}
            <div className="mt-4 flex gap-2">
              <Button onClick={() => window.print()}>Print</Button>
              <Button onClick={() => setShowReport(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
