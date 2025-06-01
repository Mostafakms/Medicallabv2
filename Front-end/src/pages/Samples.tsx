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

// Define available tests based on sample type
const availableTests: { [key: string]: string[] } = {
  Blood: ["Complete Blood Count", "Lipid Profile", "Liver Function", "Thyroid Panel", "Blood Culture"],
  Urine: ["Urinalysis", "Urine Culture", "Drug Screen"],
  Stool: ["Stool Culture", "Occult Blood Test"],
  Sputum: ["Sputum Culture", "AFB Stain"],
  Tissue: ["Histopathology", "Biopsy Culture"],
};


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
        sample_tests: Array.isArray(sample.tests) ? sample.tests.map((t: any) => t.id ?? t) : [],
        status: sample.status,
        priority: sample.priority,
        location: sample.location,
        notes: sample.notes,
      }));
    },
    refetchOnWindowFocus: false
  });

  // Fetch all tests for mapping names to IDs
  const { data: testsResponse } = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      const response = await getTests();
      return response.data.data;
    },
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

    // Map test names to IDs for backend
    const testIds = getTestIdsByNames(formData.tests);

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
      tests: testIds, // Send IDs instead of names
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
        await updateSample(sample.id, payload); // If backend uses ID, replace with sample.id
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

  // Get tests available for the selected sample type
  const testsForSelectedType = availableTests[formData.sampleType] || [];


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
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2"> {/* Patient ID Input */}
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={formData.patientId}
                  onChange={(e) => handleInputChange('patientId', e.target.value)}
                  placeholder="Enter or scan patient ID"
                  disabled // Disable manual input since it will be populated from search
                />
              </div>
               <div className="space-y-2"> {/* Patient Name Input */}
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={patientSearchTerm || formData.patientName} // Use search term or form data
                  onChange={(e) => setPatientSearchTerm(e.target.value)} // Update patient search term
                  placeholder="Search or enter patient name"
                />
                {/* Display search results */}
                {patientSearchTerm.length > 1 && patientSearchResults && patientSearchResults.length > 0 && ( // Only show results if searching and results exist
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {patientSearchResults.map(patient => (
                      <div
                        key={patient.id} // Use patient.id as key
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handlePatientSelect(patient)}
                      >
                        {patient.name} ({patient.id}) {/* Display patient name and ID */}
                      </div>
                    ))}
                  </div>
                )}
                 {patientSearchTerm.length > 1 && isPatientSearching && ( // Show loading indicator
                  <div className="p-2 text-gray-500">Searching...</div>
                )}
                 {patientSearchTerm.length > 1 && !isPatientSearching && patientSearchResults?.length === 0 && ( // Show no results message
                  <div className="p-2 text-gray-500">No patients found.</div>
                )}
              </div>
              {/* Combined Collection Date and Time Input */}
              <div className="space-y-2 col-span-2"> 
                <Label>Collection Date & Time</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="collectionDate"
                    type="date"
                    value={formData.collectionDate}
                    onChange={(e) => handleInputChange('collectionDate', e.target.value)}
                  />
                  <Input
                    id="collectionTime"
                    type="time"
                    value={formData.collectionTime}
                    onChange={(e) => handleInputChange('collectionTime', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2"> {/* Sample Type Input */}
                <Label htmlFor="sampleType">Sample Type</Label>
                <Select value={formData.sampleType} onValueChange={(value) => handleInputChange('sampleType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sample type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(availableTests).map(type => (
                       <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stat">Stat</SelectItem> {/* Use capitalized values */}
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2"> {/* Added Location Input */}
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter sample location"
                />
              </div>
              <div className="space-y-2 col-span-2"> {/* Modified Tests Selection */}
                <Label htmlFor="tests">Requested Tests</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2"> {/* Added scrollable container */}
                  {testsForSelectedType.length > 0 ? (
                    testsForSelectedType.map(test => (
                      <div key={test} className="flex items-center space-x-2">
                        <Checkbox
                          id={`test-${test}`}
                          checked={formData.tests.includes(test)}
                          onCheckedChange={(isChecked) => handleTestChange(test, isChecked as boolean)}
                        />
                        <Label htmlFor={`test-${test}`}>{test}</Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-2">Select a sample type to see available tests.</p>
                  )}
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Collection Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any special instructions or notes"
                />
              </div>
            </div>
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
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editAccessionNumber">Accession #</Label>
                  <Input id="editAccessionNumber" value={editFormData.accessionNumber} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPatientName">Patient Name</Label>
                  <Input id="editPatientName" value={editFormData.patientName} disabled />
                </div>
                {/* Add other fields for editing */}
                 <div className="space-y-2"> {/* Sample Type Input */}
                  <Label htmlFor="editSampleType">Sample Type</Label>
                  <Select value={editFormData.sampleType} onValueChange={(value) => handleEditInputChange('sampleType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sample type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(availableTests).map(type => (
                         <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Combined Collection Date and Time Input */}
                <div className="space-y-2 col-span-2"> 
                  <Label>Collection Date & Time</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="editCollectionDate"
                      type="date"
                      value={editFormData.collectionDate}
                      onChange={(e) => handleEditInputChange('collectionDate', e.target.value)}
                    />
                    <Input
                      id="editCollectionTime"
                      type="time"
                      value={editFormData.collectionTime}
                      onChange={(e) => handleEditInputChange('collectionTime', e.target.value)}
                    />
                  </div>
                </div>
                 <div className="space-y-2"> {/* Added Location Input */}
                  <Label htmlFor="editLocation">Location</Label>
                  <Input
                    id="editLocation"
                    value={editFormData.location}
                    onChange={(e) => handleEditInputChange('location', e.target.value)}
                    placeholder="Enter sample location"
                  />
                </div>
                 <div className="space-y-2"> {/* Priority Input */}
                  <Label htmlFor="editPriority">Priority</Label>
                  <Select value={editFormData.priority} onValueChange={(value) => handleEditInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stat">Stat</SelectItem> {/* Use capitalized values */}
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2 col-span-2"> {/* Modified Tests Selection */}
                  <Label htmlFor="editTests">Requested Tests</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2"> {/* Added scrollable container */}
                    {availableTests[editFormData.sampleType]?.length > 0 ? (
                      availableTests[editFormData.sampleType].map(test => (
                        <div key={test} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-test-${test}`}
                            checked={editFormData.tests.includes(test)}
                            onCheckedChange={(isChecked) => handleEditTestChange(test, isChecked as boolean)}
                          />
                          <Label htmlFor={`edit-test-${test}`}>{test}</Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 col-span-2">Select a sample type to see available tests.</p>
                    )}
                  </div>
                </div>
                 <div className="space-y-2 col-span-2"> {/* Notes Input */}
                  <Label htmlFor="editNotes">Collection Notes</Label>
                  <Input
                    id="editNotes"
                    value={editFormData.notes || ''}
                    onChange={(e) => handleEditInputChange('notes', e.target.value)}
                    placeholder="Any special instructions or notes"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleEditDialogClose}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button> {/* Added Save button */}
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
                  <TableCell>{sample.sampleType}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{sample.collectionDate}</div>
                      <div className="text-gray-500">{sample.collectionTime}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {/* Map sample_tests IDs to names using testsResponse */}
                      {(Array.isArray(sample.sample_tests) ? sample.sample_tests : []).map((testId, index) => {
                        let testName = String(testId);
                        if (testsResponse) {
                          const found = testsResponse.find((t: any) => t.id === testId);
                          if (found) testName = found.name;
                        }
                        return (
                          <Badge key={index} variant="outline" className="text-xs">
                            {testName}
                          </Badge>
                        );
                      })}
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
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(sample)}> {/* Added onClick handler */}
                        <Edit className="h-4 w-4" /> {/* Added Edit button */}
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
