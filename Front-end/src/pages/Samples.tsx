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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, TestTube, Barcode, Edit } from 'lucide-react'; // Added Edit icon
import { Checkbox } from "@/components/ui/checkbox"; // Assuming Checkbox component exists
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Import useQuery and useQueryClient
import { searchPatients, getSamples, createSample, updateSample, deleteSample, getTests } from '@/lib/api'; // Import the new API call
import axios from 'axios'; // Add this import if not present
import { toast } from 'sonner'; // Add this import for toast error

// Define the structure for a sample
interface Sample {
  id: number; // Add backend numeric ID
  accessionNumber: string;
  patientName: string;
  patientId: string;
  sampleType: string;
  collectionDate: string;
  collectionTime: string;
  sample_tests: number[]; // IDs of selected tests
  status: string;
  priority: string;
  location: string;
  notes?: string; // Added optional notes property
}

// Define a minimal structure for Patient based on search results
interface Patient {
  id: string;
  name: string;
}


const Samples = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false); // State for Receive Sample dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // New state for Edit Sample dialog
  const [allSamples, setAllSamples] = useState<Sample[]>([]); // Remove dummy data, start empty

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    sampleType: '',
    collectionDate: new Date().toISOString().split('T')[0], // Set default date to current date
    collectionTime: new Date().toTimeString().split(' ')[0].substring(0, 5), // Set default time to current time (HH:mm)
    priority: '',
    tests: [] as string[], // test names for form only
    notes: '',
    location: '',
  });

  const [patientSearchTerm, setPatientSearchTerm] = useState(''); // State for patient search input

  // Use useQuery to fetch patient search results from the API
  const { data: patientSearchResults, isLoading: isPatientSearching } = useQuery<Patient[]>({ // Specify return type
    queryKey: ['patients', patientSearchTerm], // Query key includes search term
    queryFn: () => searchPatients(patientSearchTerm).then(res => res.data.data), // Call the API function
    enabled: patientSearchTerm.length > 1, // Only run query if search term is at least 2 characters
  });

  const [editingSample, setEditingSample] = useState<Sample | null>(null); // State to hold the sample being edited
  const [editFormData, setEditFormData] = useState<any>(null); // Use 'any' for form state

  const queryClient = useQueryClient();

  // Fetch samples from backend
  const { data: samplesResponse, isLoading: isSamplesLoading, refetch: refetchSamples } = useQuery({
    queryKey: ["samples"],
    queryFn: async () => {
      const response = await getSamples();
      // Transform backend data to match Sample interface
      return response.data.data.map((sample: any) => ({
        id: sample.id, // Map backend ID
        accessionNumber: sample.accession_number,
        patientName: sample.patient?.name || '',
        patientId: sample.patient_id,
        sampleType: sample.sample_type,
        collectionDate: sample.collection_date,
        collectionTime: sample.collection_time,
        // Always store test IDs (number[])
        sample_tests: Array.isArray(sample.sample_tests)
  ? sample.sample_tests
  : Array.isArray(sample.tests)
    ? sample.tests.map((t: any) => t.id ?? t)
    : [],
        status: sample.status,
        priority: sample.priority,
        location: sample.location,
        notes: sample.notes,
      }));
    },
    refetchOnWindowFocus: false
  });

  // Fetch all tests for mapping names to IDs (fetch all pages)
  const fetchAllTests = async () => {
    let page = 1;
    let allTests: any[] = [];
    let totalPages = 1;

    do {
      const params = new URLSearchParams({ page: String(page) });
      const response = await getTests(params);
      const { data, meta } = response.data;
      allTests = allTests.concat(data);
      totalPages = meta.last_page;
      page++;
    } while (page <= totalPages);

    return allTests;
  };

  const { data: testsResponse, isLoading: isTestsLoading } = useQuery({
    queryKey: ["tests", "all"],
    queryFn: fetchAllTests,
    refetchOnWindowFocus: false
  });

  // Helper: map test names to IDs
  const getTestIdsByNames = (names: string[]) => {
    if (!Array.isArray(testsResponse)) return [];
    return names.map(name => {
      const found = testsResponse.find((t: any) => t.name === name);
      return found ? found.id : null;
    }).filter(Boolean);
  };

  // Use backend samples if available
  useEffect(() => {
    if (samplesResponse) {
      setAllSamples(samplesResponse);
    }
  }, [samplesResponse]);

  const handleInputChange = (field: string, value: string | string[]) => { // Allow string or string[]
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestChange = (testName: string, isChecked: boolean) => {
    setFormData(prev => {
      const currentTests = prev.tests;
      if (isChecked) {
        return { ...prev, tests: [...currentTests, testName] };
      } else {
        return { ...prev, tests: currentTests.filter(test => test !== testName) };
      }
    });
  };

  // New handler for edit form input changes
  const handleEditInputChange = (field: keyof Sample, value: string | string[]) => {
    setEditFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  // New handler for edit form test changes
  const handleEditTestChange = (testName: string, isChecked: boolean) => {
    setEditFormData(prev => {
      if (!prev) return null;
      const currentTests = prev.tests;
      if (isChecked) {
        return { ...prev, tests: [...currentTests, testName] };
      } else {
        return { ...prev, tests: currentTests.filter(test => test !== testName) };
      }
    });
  };


  const handleSubmit = async () => {
    // Simple accession number generation (replace with proper logic)
    const newAccessionNumber = `ACC${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

    // Map test names to IDs for backend      // Convert test names to IDs and filter out any nulls
      const testIds = getTestIdsByNames(formData.tests);

    if (!testIds.length) {
      toast.error("Please select at least one test");
      return;
    }

    // Prepare payload for backend
    const payload = {
      accession_number: newAccessionNumber,
      patient_id: formData.patientId,
      sample_type: formData.sampleType,
      collection_date: formData.collectionDate,
      collection_time: formData.collectionTime,
      priority: formData.priority,
      status: 'Pending',
      location: formData.location || 'Unknown',
      notes: formData.notes,
      tests: testIds // Send IDs instead of names
    };

    try {
      await createSample(payload);
      await refetchSamples();
      setOpen(false); // Close dialog
      // Reset form
      setFormData({
        patientId: '',
        patientName: '',
        sampleType: '',
        collectionDate: new Date().toISOString().split('T')[0],
        collectionTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
        priority: '',
        tests: [],
        notes: '',
        location: '',
      });
    } catch (err) {
      // Error handled by API interceptor
    }
  };

  // Placeholder function for saving edits
  const handleSaveEdit = async () => {
    if (editFormData) {
      // Find the sample by accession number to get its backend ID
      const sample = allSamples.find(s => s.accessionNumber === editFormData.accessionNumber);
      if (!sample) return;
      // Map test names to IDs for backend
      const testIds = getTestIdsByNames(editFormData.tests);
      // Prepare payload for backend
      const payload = {
        sample_type: editFormData.sampleType,
        collection_date: editFormData.collectionDate,
        collection_time: editFormData.collectionTime,
        priority: editFormData.priority,
        status: editFormData.status,
        location: editFormData.location,
        notes: editFormData.notes,
        tests: testIds, // Send IDs instead of names
      };
      try {
        await updateSample(sample.id.toString(), payload); // If backend uses ID, replace with sample.id
        await refetchSamples();
        setIsEditDialogOpen(false);
        setEditingSample(null);
        setEditFormData(null);
      } catch (err) {
        // Error handled by API interceptor
      }
    }
  };

  // Handler for deleting a sample
  const handleDeleteSample = async (accessionNumber: string) => {
    // Find the sample by accession number to get its backend ID
    const sample = allSamples.find(s => s.accessionNumber === accessionNumber);
    if (!sample) return;
    try {
      await deleteSample(String(sample.id)); // Use sample.id as string
      await refetchSamples();
    } catch (err) {
      // Error handled by API interceptor
    }
  };

  // --- SampleForm component for both Receive and Edit dialogs ---
  interface SampleFormProps {
    formData: any;
    onInputChange: (field: string, value: string | string[]) => void;
    onTestChange: (testName: string, isChecked: boolean) => void;
    testsForSelectedType: any[];
    patientSearchTerm?: string;
    setPatientSearchTerm?: (v: string) => void;
    patientSearchResults?: Patient[];
    isPatientSearching?: boolean;
    onPatientSelect?: (p: Patient) => void;
    isEdit?: boolean;
  }
  const SampleForm: React.FC<SampleFormProps> = ({
    formData,
    onInputChange,
    onTestChange,
    testsForSelectedType,
    patientSearchTerm = '',
    setPatientSearchTerm,
    patientSearchResults = [],
    isPatientSearching = false,
    onPatientSelect,
    isEdit = false,
  }) => (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2"> {/* Patient ID Input */}
        <Label htmlFor={isEdit ? 'editPatientId' : 'patientId'}>Patient ID</Label>
        <Input
          id={isEdit ? 'editPatientId' : 'patientId'}
          value={formData.patientId}
          onChange={(e) => onInputChange('patientId', e.target.value)}
          placeholder="Enter or scan patient ID"
          disabled
        />
      </div>
      <div className="space-y-2"> {/* Patient Name Input */}
        <Label htmlFor={isEdit ? 'editPatientName' : 'patientName'}>Patient Name</Label>
        <Input
          id={isEdit ? 'editPatientName' : 'patientName'}
          value={isEdit ? formData.patientName : (patientSearchTerm || formData.patientName)}
          onChange={(e) => isEdit
            ? onInputChange('patientName', e.target.value)
            : setPatientSearchTerm && setPatientSearchTerm(e.target.value)
          }
          placeholder={isEdit ? 'Enter patient name' : 'Search or enter patient name'}
        />
        {/* Only show patient search results in receive mode */}
        {!isEdit && setPatientSearchTerm && patientSearchTerm.length > 1 && (
          <>
            {patientSearchResults && patientSearchResults.length > 0 && (
              <div className="border rounded-md max-h-40 overflow-y-auto">
                {patientSearchResults.map(patient => (
                  <div
                    key={patient.id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => onPatientSelect && onPatientSelect(patient)}
                  >
                    {patient.name} ({patient.id})
                  </div>
                ))}
              </div>
            )}
            {isPatientSearching && (
              <div className="p-2 text-gray-500">Searching...</div>
            )}
            {!isPatientSearching && patientSearchResults?.length === 0 && (
              <div className="p-2 text-gray-500">No patients found.</div>
            )}
          </>
        )}
      </div>
      <div className="space-y-2 col-span-2"> {/* Collection Date and Time */}
        <Label>Collection Date & Time</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            id={isEdit ? 'editCollectionDate' : 'collectionDate'}
            type="date"
            value={formData.collectionDate}
            onChange={(e) => onInputChange('collectionDate', e.target.value)}
          />
          <Input
            id={isEdit ? 'editCollectionTime' : 'collectionTime'}
            type="time"
            value={formData.collectionTime}
            onChange={(e) => onInputChange('collectionTime', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2"> {/* Sample Type Input */}
        <Label htmlFor={isEdit ? 'editSampleType' : 'sampleType'}>Sample Type</Label>
        <Select value={formData.sampleType} onValueChange={(value) => onInputChange('sampleType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select sample type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(sampleTypeMapping).map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"> {/* Priority Input */}
        <Label htmlFor={isEdit ? 'editPriority' : 'priority'}>Priority</Label>
        <Select value={formData.priority} onValueChange={(value) => onInputChange('priority', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Stat">Stat</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"> {/* Location Input */}
        <Label htmlFor={isEdit ? 'editLocation' : 'location'}>Location</Label>
        <Input
          id={isEdit ? 'editLocation' : 'location'}
          value={formData.location}
          onChange={(e) => onInputChange('location', e.target.value)}
          placeholder="Enter sample location"
        />
      </div>
      <div className="space-y-2 col-span-2"> {/* Tests Selection */}
        <Label htmlFor={isEdit ? 'editTests' : 'tests'}>Requested Tests</Label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
          {testsForSelectedType.length > 0 ? (
            testsForSelectedType.map((test: any) => (
              <div key={test.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${isEdit ? 'edit-' : ''}test-${test.id}`}
                  checked={formData.tests.includes(test.name)}
                  onCheckedChange={(isChecked) => onTestChange(test.name, isChecked as boolean)}
                />
                <Label htmlFor={`${isEdit ? 'edit-' : ''}test-${test.id}`}>{test.name}</Label>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-2">Select a sample type to see available tests.</p>
          )}
        </div>
      </div>
      <div className="space-y-2 col-span-2"> {/* Notes Input */}
        <Label htmlFor={isEdit ? 'editNotes' : 'notes'}>Collection Notes</Label>
        <Input
          id={isEdit ? 'editNotes' : 'notes'}
          value={formData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          placeholder="Any special instructions or notes"
        />
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Stat": return "bg-red-100 text-red-800";
      case "Urgent": return "bg-orange-100 text-orange-800";
      case "Normal": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filter samples by accession number OR patient name for the main table
  const filteredSamples = allSamples.filter(sample => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const accessionMatch = sample.accessionNumber.toLowerCase().includes(lowerSearchTerm);
    const patientNameMatch = typeof sample.patientName === 'string' && sample.patientName.length > 0 && sample.patientName.toLowerCase().includes(lowerSearchTerm);
    return accessionMatch || patientNameMatch;
  });

  // Handle selecting a patient from search results
  const handlePatientSelect = (patient: Patient) => { // Expect Patient object
    setFormData(prev => ({
      ...prev,
      patientId: patient.id, // Use patient.id
      patientName: patient.name, // Use patient.name
    }));
    setPatientSearchTerm(''); // Clear search term
  };

  // Handle clicking the Edit button
  const handleEditClick = (sample: Sample) => {
    let testNames: string[] = [];
    if (Array.isArray(sample.sample_tests) && testsResponse) {
      testNames = sample.sample_tests.map((id: number) => {
        const found = testsResponse.find((t: any) => t.id === id);
        return found ? found.name : String(id);
      });
    }
    setEditingSample(sample); // Set the sample to be edited
    setEditFormData({ ...sample, tests: testNames }); // Populate edit form data with sample data
    setIsEditDialogOpen(true); // Open the edit dialog
  };

  // Handle closing the Edit dialog
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditingSample(null); // Clear the editing sample state
    setEditFormData(null); // Clear edit form data
  };

  // Add a mapping for sampleType values to match backend enum
  const sampleTypeMapping: Record<string, string> = {
    'Blood': 'Blood',
    'Urine': 'Urine',
    'Stool': 'Stool',
    'Sputum': 'Sputum',
    'Tissue': 'Tissue'
  };

  // Get tests available for the selected sample type
  const testsForSelectedType = testsResponse
    ? testsResponse.filter((test: any) => 
        Array.isArray(test.sample_types) && 
        test.sample_types.some((type: string) => 
          type.trim().toLowerCase().startsWith(formData.sampleType.trim().toLowerCase())
        )
      )
    : [];

  // Get tests available for the edit form selected sample type
  const testsForEditSelectedType = testsResponse && editFormData
    ? testsResponse.filter((test: any) => 
        Array.isArray(test.sample_types) && 
        test.sample_types.some((type: string) => 
          type.trim().toLowerCase().startsWith(editFormData.sampleType.trim().toLowerCase())
        )
      )
    : [];

  // Group tests by sampleType
  const groupedTests = testsResponse
    ? testsResponse.reduce((acc: Record<string, any[]>, test: any) => {
        if (Array.isArray(test.sample_types)) {
          test.sample_types.forEach((type: string) => {
            const mappedType = sampleTypeMapping[type] || type;
            if (!acc[mappedType]) acc[mappedType] = [];
            if (!acc[mappedType].includes(test)) {
              acc[mappedType].push(test);
            }
          });
        }
        return acc;
      }, {})
    : {}; // Group tests by their sampleTypes

  // Get unique sample types from the tests
  const availableSampleTypes = testsResponse
    ? [...new Set(testsResponse.flatMap((test: any) => 
        Array.isArray(test.sample_types) ? test.sample_types : []
      ))]
        .map(type => ({
          value: String(type),
          label: sampleTypeMapping[String(type)] || String(type)
        }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sample Management</h1>
          <p className="text-gray-600">Track and manage biological specimens</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
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
            <SampleForm
              formData={formData}
              onInputChange={handleInputChange}
              onTestChange={handleTestChange}
              testsForSelectedType={testsForSelectedType}
              patientSearchTerm={patientSearchTerm}
              setPatientSearchTerm={setPatientSearchTerm}
              patientSearchResults={patientSearchResults}
              isPatientSearching={isPatientSearching}
              onPatientSelect={handlePatientSelect}
              isEdit={false}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Receive Sample</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Sample Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Sample</DialogTitle>
            </DialogHeader>
            {editFormData && (
              <SampleForm
                formData={editFormData}
                onInputChange={handleEditInputChange}
                onTestChange={handleEditTestChange}
                testsForSelectedType={testsForEditSelectedType}
                isEdit={true}
              />
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleEditDialogClose}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
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
                <SelectItem value="Pending">Pending</SelectItem> {/* Use capitalized values */}
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Stat">Stat</SelectItem> {/* Use capitalized values */}
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
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
              {filteredSamples.map((sample) => (
                <TableRow key={sample.accessionNumber}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Barcode className="h-4 w-4" />
                    {sample.accessionNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sample.patientName}</div>
                      <div className="text-sm text-gray-500">{sample.patientId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{
  (() => {
    if (!Array.isArray(sample.sample_tests) || !Array.isArray(testsResponse)) return sample.sampleType;
    // Get all base sample_types from the sample's tests
    const typesSet = new Set<string>();
    sample.sample_tests.forEach((testId: number) => {
      const found = testsResponse.find((t: any) => String(t.id) === String(testId));
      if (found && Array.isArray(found.sample_types)) {
        found.sample_types.forEach((type: string) => {
          // Only use the base type (first word, lowercased)
          const base = type.split(/\s|\(/)[0].toLowerCase();
          typesSet.add(base);
        });
      }
    });
    const typesArr = Array.from(typesSet).map(type => type.charAt(0).toUpperCase() + type.slice(1));
    return typesArr.length > 0
      ? typesArr.join(', ')
      : (sampleTypeMapping[String(sample.sampleType)] || sample.sampleType);
  })()
}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-black">
                        {sample.collectionDate && sample.collectionDate.length >= 10
                          ? sample.collectionDate.slice(0, 10)
                          : sample.collectionDate}
                      </div>
                      <div className="text-xs text-gray-500">
                        {sample.collectionTime && sample.collectionTime.length >= 5
                          ? sample.collectionTime.slice(11, 16)
                          : sample.collectionTime}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 items-center">
                      {Array.isArray(sample.sample_tests) && sample.sample_tests.length > 0 ? (
                        Array.isArray(testsResponse) && testsResponse.length > 0 ? (
                          sample.sample_tests.slice(0, 3).map((testId, index) => {
                            const found = testsResponse.find((t: any) => String(t.id) === String(testId));
                            return found ? (
                              <Badge key={index} variant="outline" className="text-xs">
                                {found.name}
                              </Badge>
                            ) : null; // Do not render anything if not found
                          })
                        ) : null
                      ) : (
                        <span className="text-gray-400 text-xs">
                          No tests
                        </span>
                      )}
                      {sample.sample_tests.length > 3 && (
      <span className="text-xs text-gray-500">+{sample.sample_tests.length - 3}</span>
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
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(sample)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <TestTube className="h-4 w-4" /> {/* Kept Test Tube button */}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteSample(sample.accessionNumber)}>
                        <span className="sr-only">Delete</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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

export default Samples;
