import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById } from './data';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { ArrowLeft, Users, Star, FileText, Settings, Building2, Download, Plus } from 'lucide-react';

const ClientDetails: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const client = clientId ? getClientById(clientId) : undefined;

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Client Not Found</CardTitle>
            <CardDescription>The requested client could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Side Menu */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Menu</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none border-r-2 border-primary"
                    onClick={() => navigate(`/client/${clientId}`)}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Overview
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate(`/client/${clientId}/users`)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Star className="mr-2 h-4 w-4" />
                    Products
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Reports
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{client.name}</CardTitle>
                    <CardDescription>Client Management Dashboard</CardDescription>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    Comprehensive client management and user access control for {client.name}.
                  </p>
                </div>

                <Separator />

                {/* Client Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Subscribed Products</h4>
                    <div className="flex flex-wrap gap-1">
                      {client.subscribedProducts.map((product, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Total Users</h4>
                    <p className="text-sm">{client.users.length}</p>
                  </div>
                </div>

                <Separator />

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/client/${clientId}/users`)}>
                      <CardContent className="p-4 text-center">
                        <Users className="mx-auto h-8 w-8 text-primary mb-2" />
                        <h4 className="font-medium">Manage Users</h4>
                        <p className="text-sm text-muted-foreground">{client.users.length} users</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Star className="mx-auto h-8 w-8 text-primary mb-2" />
                        <h4 className="font-medium">View Products</h4>
                        <p className="text-sm text-muted-foreground">{client.subscribedProducts.length} products</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <FileText className="mx-auto h-8 w-8 text-primary mb-2" />
                        <h4 className="font-medium">Generate Report</h4>
                        <p className="text-sm text-muted-foreground">Analytics & insights</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
