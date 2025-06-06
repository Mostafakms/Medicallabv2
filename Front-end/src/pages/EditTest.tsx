import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { useNavigate, useParams } from 'react-router-dom';

const allowedSampleTypes = [
  "Blood", "Urine", "Stool", "Sputum", "Tissue"
];
const allowedCategories = [
  "Hematology", "Clinical Chemistry", "Microbiology", "Immunology", "Endocrinology", "Histopathology", "Immunohematology", "Molecular Diagnostics", "Serology", "Coagulation", "Toxicology", "Cytology", "Parasitology", "Virology", "Blood Bank", "Other"
];

const EditTest = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '', code: '', category: '', department: '', price: '', duration: '', status: 'Active', sample_types: [] as string[]
  });
  const [parameters, setParameters] = useState([{ name: '', unit: '', normal: '' }]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.getTest(id!);
        const test = res.data.data;
        setFormData({
          name: test.name || '',
          code: test.code || '',
          category: test.category || '',
          department: test.department || '',
          price: String(test.price ?? ''),
          duration: test.duration || '',
          status: test.status || 'Active',
          sample_types: Array.isArray(test.sample_types) ? test.sample_types : [],
        });
        setParameters(
          Array.isArray(test.parameters) && test.parameters.length > 0
            ? test.parameters.map((p: any) => ({ name: p.name || '', unit: p.units || '', normal: p.normal_range || '' }))
            : [{ name: '', unit: '', normal: '' }]
        );
      } catch (err) {
        toast.error("Failed to load test");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const handleParameterChange = (idx: number, field: string, value: string) => {
    setParameters(params =>
      params.map((param, i) =>
        i === idx ? { ...param, [field]: value } : param
      )
    );
  };
  const addParameterRow = () => {
    setParameters(params => [...params, { name: '', unit: '', normal: '' }]);
  };
  const removeParameterRow = (idx: number) => {
    setParameters(params => params.filter((_, i) => i !== idx));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Test name is required"); return; }
    if (!formData.code.trim()) { toast.error("Test code is required"); return; }
    if (!formData.category) { toast.error("Category is required"); return; }
    if (!formData.department) { toast.error("Department is required"); return; }
    if (!formData.price || isNaN(Number(formData.price))) { toast.error("Price is required and must be a number"); return; }
    if (!formData.sample_types.length) { toast.error("Sample type is required"); return; }
    if (!parameters.some(p => p.name.trim())) { toast.error("At least one parameter is required"); return; }
    const filteredParameters = parameters.filter(p => p.name.trim());
    if (!filteredParameters.length) { toast.error("At least one parameter is required"); return; }
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...formData,
        parameters: filteredParameters.map(p => ({
          name: p.name.trim(),
          units: p.unit.trim(),
          normal_range: p.normal.trim()
        })),
        price: parseFloat(formData.price) || 0
      };
      await api.updateTest(id!, formattedData);
      toast.success("Test updated successfully");
      navigate('/tests');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update test");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testName">Test Name</Label>
                <Input id="testName" placeholder="Enter test name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testCode">Test Code</Label>
                <Input id="testCode" placeholder="Enter test code" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={val => setFormData({ ...formData, category: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={val => setFormData({ ...formData, department: val })}>
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
                <Input id="price" type="number" placeholder="0.00" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g., 2-4 hours" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="sampleType">Sample Type</Label>
                <Select value={formData.sample_types[0] || ''} onValueChange={val => setFormData({ ...formData, sample_types: [val] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sample type" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedSampleTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={val => setFormData({ ...formData, status: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Test Parameters</Label>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Name</th>
                        <th className="border px-2 py-1">Unit</th>
                        <th className="border px-2 py-1">Normal Value</th>
                        <th className="border px-2 py-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {parameters.map((param, idx) => (
                        <tr key={idx}>
                          <td className="border px-2 py-1">
                            <Input value={param.name} placeholder="Parameter name" onChange={e => handleParameterChange(idx, 'name', e.target.value)} />
                          </td>
                          <td className="border px-2 py-1">
                            <Input value={param.unit} placeholder="Unit" onChange={e => handleParameterChange(idx, 'unit', e.target.value)} />
                          </td>
                          <td className="border px-2 py-1">
                            <Input value={param.normal} placeholder="Normal value" onChange={e => handleParameterChange(idx, 'normal', e.target.value)} />
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {parameters.length > 1 && (
                              <Button type="button" size="sm" variant="ghost" onClick={() => removeParameterRow(idx)}>
                                Remove
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-2">
                    <Button type="button" size="sm" onClick={addParameterRow}>+ Add Parameter</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/tests')}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTest;
