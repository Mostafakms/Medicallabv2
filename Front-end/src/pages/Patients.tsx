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
import { Search, Plus, Edit, Eye, TestTube, Trash2 } from 'lucide-react';
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  doctor?: string;
  created_at: string;
  updated_at: string;
}

interface PatientFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  insurance: string;
  policyNumber: string;
  doctor: string;
}

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    insurance: '',
    policyNumber: '',
    doctor: '',
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      insurance: '',
      policyNumber: '',
      doctor: '',
    });
    setSelectedPatient(null);
  };

  // Load patient data into form
  const loadPatientData = (patient: Patient) => {
    const [firstName, ...lastNameParts] = patient.name.split(' ');
    setFormData({
      firstName,
      lastName: lastNameParts.join(' '),
      age: patient.age?.toString() || '',
      gender: patient.gender,
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      insurance: '',
      policyNumber: '',
      doctor: patient.doctor || '',
    });
    setSelectedPatient(patient);
  };

  // Create patient mutation
  const createPatientMutation = useMutation({
    mutationFn: (data: any) => api.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setIsDialogOpen(false);
      toast.success("Patient registered successfully");
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to register patient");
    }
  });

  // Update patient mutation
  const updatePatientMutation = useMutation({
    mutationFn: (data: { id: string; updateData: any }) => 
      api.updatePatient(data.id, data.updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setIsEditDialogOpen(false);
      toast.success("Patient updated successfully");
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update patient");
    }
  });

  // Delete patient mutation
  const deletePatientMutation = useMutation({
    mutationFn: (id: string) => api.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete patient");
    }
  });

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      age: parseInt(formData.age),
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      insurance_provider: formData.insurance,
      policy_number: formData.policyNumber,
      doctor: formData.doctor,
    };

    if (selectedPatient) {
      updatePatientMutation.mutate({
        id: selectedPatient.id,
        updateData: patientData
      });
    } else {
      createPatientMutation.mutate(patientData);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch patients
  const { data: patientsData, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await api.getPatients();
      return response.data.data;
    }
  });

  // Filter patients based on search term
  const filteredPatients = (patientsData?.filter((patient: Patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? []).slice().reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Registration</h1>
          <p className="text-gray-600">Manage patient information and registration</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Register New Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Register New Patient</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Provider</Label>
                  <Input 
                    id="insurance" 
                    placeholder="Enter insurance provider"
                    value={formData.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input 
                    id="policyNumber" 
                    placeholder="Enter policy number"
                    value={formData.policyNumber}
                    onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Input 
                    id="doctor" 
                    placeholder="Enter doctor name"
                    value={formData.doctor}
                    onChange={(e) => handleInputChange('doctor', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createPatientMutation.isPending}
                >
                  {createPatientMutation.isPending ? "Registering..." : "Register Patient"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="font-medium">{selectedPatient.name}</div>
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <div className="font-medium">{selectedPatient.age}</div>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="font-medium">{selectedPatient.gender}</div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="font-medium">{selectedPatient.phone || '-'}</div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="font-medium">{selectedPatient.email || '-'}</div>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Address</Label>
                <div className="font-medium">{selectedPatient.address || '-'}</div>
              </div>
              <div className="space-y-2">
                <Label>Doctor</Label>
                <div className="font-medium">{selectedPatient?.doctor || '-'}</div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance Provider</Label>
                <Input 
                  id="insurance" 
                  placeholder="Enter insurance provider"
                  value={formData.insurance}
                  onChange={(e) => handleInputChange('insurance', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input 
                  id="policyNumber" 
                  placeholder="Enter policy number"
                  value={formData.policyNumber}
                  onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Input 
                  id="doctor" 
                  placeholder="Enter doctor name"
                  value={formData.doctor}
                  onChange={(e) => handleInputChange('doctor', e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updatePatientMutation.isPending}
              >
                {updatePatientMutation.isPending ? "Updating..." : "Update Patient"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Patient</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete patient <b>{patientToDelete?.name}</b>?</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (patientToDelete) {
                  deletePatientMutation.mutate(patientToDelete.id);
                  setDeleteDialogOpen(false);
                  setPatientToDelete(null);
                }
              }}
              disabled={deletePatientMutation.isPending}
            >
              {deletePatientMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients by name or ID..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Patients ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredPatients.map((patient: Patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{patient.phone}</div>
                      <div className="text-gray-500">{patient.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.doctor || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          loadPatientData(patient);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigate('/samples', {
                            state: {
                              receiveSampleForPatient: {
                                patientId: patient.id,
                                patientName: patient.name,
                              }
                            }
                          });
                        }}
                        title="Receive Sample"
                      >
                        <TestTube className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPatientToDelete(patient);
                          setDeleteDialogOpen(true);
                        }}
                        title="Delete Patient"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Patients;
