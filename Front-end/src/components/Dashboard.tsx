
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TestTube, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: "Total Patients Today", value: "47", icon: Users, color: "text-blue-600" },
    { title: "Samples Received", value: "89", icon: TestTube, color: "text-green-600" },
    { title: "Pending Reports", value: "23", icon: FileText, color: "text-yellow-600" },
    { title: "Completed Tests", value: "156", icon: CheckCircle, color: "text-purple-600" },
  ];

  const recentSamples = [
    { id: "ACC001", patient: "John Doe", test: "Complete Blood Count", status: "Processing", priority: "Normal" },
    { id: "ACC002", patient: "Jane Smith", test: "Lipid Profile", status: "Completed", priority: "Urgent" },
    { id: "ACC003", patient: "Bob Johnson", test: "Liver Function", status: "Pending", priority: "Normal" },
    { id: "ACC004", patient: "Alice Brown", test: "Thyroid Panel", status: "Processing", priority: "Stat" },
  ];

  const notifications = [
    { message: "Low inventory: CBC reagent kit", type: "warning", time: "2 hours ago" },
    { message: "Quality control due for Chemistry analyzer", type: "info", time: "4 hours ago" },
    { message: "Sample ACC005 requires attention", type: "urgent", time: "1 hour ago" },
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back to your lab management system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Today: {new Date().toLocaleDateString()}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Samples */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Recent Samples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSamples.map((sample) => (
                <div key={sample.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{sample.id}</span>
                      <Badge className={getPriorityColor(sample.priority)}>
                        {sample.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{sample.patient}</p>
                    <p className="text-sm text-gray-500">{sample.test}</p>
                  </div>
                  <Badge className={getStatusColor(sample.status)}>
                    {sample.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'urgent' ? 'bg-red-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              Register Patient
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TestTube className="h-6 w-6" />
              Receive Sample
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              Enter Results
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
