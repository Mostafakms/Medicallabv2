import React, { useState, useEffect } from 'react';
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
import { ErrorState } from '@/components/error-state';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, TestTube, Printer, Barcode } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { toast } from "sonner";

interface Sample {
  id: string;
  patient_id: string;
  patient: {
    id: string;
    name: string;
  };
  type: string;
  collection_date: string;
  collection_time: string;
  priority: string;
  status: string;
  location: string;
  notes: string;
  tests: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

// Sample type options used in both Receive Sample and Tests management
const sampleTypeOptions = [
  { value: "blood", label: "Blood" },
  { value: "urine", label: "Urine" },
  { value: "stool", label: "Stool" },
  { value: "sputum", label: "Sputum" },
  { value: "tissue", label: "Tissue" },
];

const Samples = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isReceivingDialogOpen, setIsReceivingDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    patient_id: '',
    type: '',
    collection_date: new Date().toISOString().slice(0, 10),
    collection_time: (() => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    })(),
    priority: '',
    notes: '',
    tests: [] as string[]
  });

  // Fetch samples with error handling
  const { data: samplesData, isLoading, error, isError } = useQuery({
    queryKey: ["samples"],
    queryFn: async () => {
      try {
        const response = await api.getSamples();
        if (!response?.data?.data) {
          throw new Error("Invalid response format from server");
        }
        return response.data.data;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || "Failed to fetch samples";
        toast.error(message);
        throw new Error(message);
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Fetch available tests with error handling
  const { data: testsData, isError: isTestsError } = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      try {
        const response = await api.getTests();
        if (!response?.data?.data) {
          throw new Error("Invalid response format from server");
        }
        return response.data.data;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || "Failed to fetch tests";
        toast.error(message);
        throw new Error(message);
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Move error dialog close logic to useEffect
  useEffect(() => {
    if (isTestsError && isReceivingDialogOpen) {
      toast.error("Failed to load available tests. Please try again.");
      setIsReceivingDialogOpen(false);
    }
  }, [isTestsError, isReceivingDialogOpen]);

  // Show error state if samples query failed
  if (isError) {
    return <ErrorState error={error as Error} queryKey={["samples"]} queryClient={queryClient} />;
  }

  // Create sample mutation
  const createSampleMutation = useMutation({
    mutationFn: (data: any) => api.createSample(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
      setIsReceivingDialogOpen(false);
      toast.success("Sample received successfully");
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to receive sample");
    }
  });

  const resetForm = () => {
    setFormData({
      patient_id: '',
      type: '',
      collection_date: new Date().toISOString().slice(0, 10),
      collection_time: (() => {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      })(),
      priority: '',
      notes: '',
      tests: []
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSampleMutation.mutate(formData);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "stat": return "bg-red-100 text-red-800";
      case "urgent": return "bg-orange-100 text-orange-800";
      case "normal": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Defensive: ensure samplesData is an array
  const filteredSamples = Array.isArray(samplesData)
    ? samplesData.filter((sample: Sample) =>
        (sample.id?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
        (sample.patient?.name?.toLowerCase?.() || '').includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sample Management</h1>
          <p className="text-gray-600">Track and manage biological specimens</p>
        </div>
        <Dialog open={isReceivingDialogOpen} onOpenChange={setIsReceivingDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Receive Sample
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Receive New Sample</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input 
                    id="patientId" 
                    placeholder="Enter or scan patient ID" 
                    value={formData.patient_id}
                    onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sampleType">Sample Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sample type" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleTypeOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectionDate">Collection Date</Label>
                  <Input 
                    id="collectionDate" 
                    type="date" 
                    value={formData.collection_date}
                    onChange={(e) => setFormData({ ...formData, collection_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectionTime">Collection Time</Label>
                  <Input 
                    id="collectionTime" 
                    type="time" 
                    value={formData.collection_time}
                    onChange={(e) => setFormData({ ...formData, collection_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(val) => setFormData({ ...formData, priority: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stat">Stat</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tests">Requested Tests</Label>
                  <div className="flex flex-col gap-2">
                    {testsData?.map((test: any) => (
                      <label key={test.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={test.id}
                          checked={formData.tests.includes(test.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                tests: [...formData.tests, test.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                tests: formData.tests.filter(t => t !== test.id)
                              });
                            }
                          }}
                        />
                        {test.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Collection Notes</Label>
                  <Input 
                    id="notes" 
                    placeholder="Any special instructions or notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsReceivingDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createSampleMutation.isPending}
                >
                  {createSampleMutation.isPending ? "Receiving..." : "Receive Sample"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search samples by accession number or patient..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
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

      {/* Samples Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Sample Tracking ({filteredSamples.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSamples.length === 0 && !isLoading ? (
            <div className="text-center text-gray-500 py-8">No samples found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Accession #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Sample Type</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : filteredSamples.map((sample: Sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Barcode className="h-4 w-4" />
                      {sample.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sample.patient?.name || <span className="text-gray-400">Unknown</span>}</div>
                        <div className="text-sm text-gray-500">{sample.patient_id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{sample.type}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{sample.collection_date}</div>
                        <div className="text-gray-500">{sample.collection_time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(sample.tests) ? sample.tests.slice(0, 2) : []).map((test) => (
                          <Badge key={test.id} variant="outline" className="text-xs">
                            {test.name}
                          </Badge>
                        ))}
                        {Array.isArray(sample.tests) && sample.tests.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{sample.tests.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(sample.priority)}>
                        {sample.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(sample.status)}>
                        {sample.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{sample.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <TestTube className="h-4 w-4" />
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

export default Samples;
