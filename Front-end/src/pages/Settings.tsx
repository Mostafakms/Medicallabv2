import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, User, Bell, Shield, Database, Printer } from 'lucide-react';

const BASE_API_URL = 'http://127.0.0.1:8000'; // Always use full backend URL for local dev

const Settings = () => {
  const [labInfo, setLabInfo] = useState({ name: '', address: '', phone: '', email: '', logo: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/lab-settings`)
      .then(res => res.json())
      .then(data => {
        if (data) setLabInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load lab info: ' + err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    if (id === 'logo' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLabInfo(prev => ({ ...prev, logo: ev.target?.result as string }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setLabInfo(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const res = await fetch(`${BASE_API_URL}/api/lab-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(labInfo),
      });
      if (!res.ok) {
        let errMsg = 'Failed to save';
        try {
          const errData = await res.json();
          errMsg = errData.message || JSON.stringify(errData) || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      // Re-fetch lab info to update UI (especially logo)
      const updated = await fetch(`${BASE_API_URL}/api/lab-settings`).then(r => r.json());
      setLabInfo(updated);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || 'Failed to save lab info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure system preferences and settings</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-600">Saved!</div>}
            <div className="space-y-2">
              <Label htmlFor="labName">Laboratory Name</Label>
              <Input id="name" value={labInfo.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={labInfo.address} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={labInfo.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={labInfo.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <Input id="logo" type="file" accept="image/*" onChange={handleChange} />
              {labInfo.logo && <img src={labInfo.logo} alt="Lab Logo" className="h-16 mt-2" />}
            </div>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </CardContent>
        </Card>

        {/* User Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  <SelectItem value="cst">Central Time (CST)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="yyyymmdd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="resultAlerts">Result Ready Alerts</Label>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button>Change Password</Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Backup Database</Label>
                <p className="text-sm text-gray-500">Create a backup of current data</p>
              </div>
              <Button variant="outline">Backup Now</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Export Data</Label>
                <p className="text-sm text-gray-500">Export data to CSV/Excel</p>
              </div>
              <Button variant="outline">Export</Button>
            </div>
          </CardContent>
        </Card>

        {/* Print Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Print Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultPrinter">Default Printer</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select printer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hp-laser">HP LaserJet Pro</SelectItem>
                  <SelectItem value="canon-inkjet">Canon PIXMA</SelectItem>
                  <SelectItem value="brother-label">Brother Label Printer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paperSize">Paper Size</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save Print Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
