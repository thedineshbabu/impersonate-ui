import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Settings, 
  Eye,
  Database,
  Shield,
  Users
} from 'lucide-react';

// Mock data for resources
const MOCK_RESOURCES = [
  {
    id: '1',
    name: 'User Management API',
    description: 'API endpoints for managing user accounts and permissions',
    type: 'API',
    status: 'Active',
    scopes: ['read:users', 'write:users', 'delete:users'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Client Data Service',
    description: 'Service for accessing and managing client information',
    type: 'Service',
    status: 'Active',
    scopes: ['read:clients', 'write:clients'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Reporting Dashboard',
    description: 'Web interface for generating and viewing reports',
    type: 'Web App',
    status: 'Inactive',
    scopes: ['read:reports', 'export:reports'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12'
  }
];

// Available scopes for assignment
const AVAILABLE_SCOPES = [
  'read:users', 'write:users', 'delete:users',
  'read:clients', 'write:clients', 'delete:clients',
  'read:reports', 'export:reports', 'admin:reports',
  'read:resources', 'write:resources', 'delete:resources',
  'read:scopes', 'write:scopes', 'delete:scopes'
];

interface Resource {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  scopes: string[];
  createdAt: string;
  updatedAt: string;
}

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScopesModal, setShowScopesModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [editingResource, setEditingResource] = useState<Partial<Resource>>({});

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateResource = () => {
    setEditingResource({});
    setShowCreateModal(true);
  };

  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setEditingResource(resource);
    setShowEditModal(true);
  };

  const handleManageScopes = (resource: Resource) => {
    setSelectedResource(resource);
    setShowScopesModal(true);
  };

  const handleDeleteResource = (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(r => r.id !== resourceId));
    }
  };

  const handleSaveResource = () => {
    if (showCreateModal) {
      const newResource: Resource = {
        id: Date.now().toString(),
        name: editingResource.name || '',
        description: editingResource.description || '',
        type: editingResource.type || 'API',
        status: editingResource.status || 'Active',
        scopes: editingResource.scopes || [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setResources([...resources, newResource]);
      setShowCreateModal(false);
    } else if (showEditModal && selectedResource) {
      const updatedResources = resources.map(r => 
        r.id === selectedResource.id 
          ? { ...r, ...editingResource, updatedAt: new Date().toISOString().split('T')[0] }
          : r
      );
      setResources(updatedResources);
      setShowEditModal(false);
    }
    setEditingResource({});
    setSelectedResource(null);
  };

  const handleUpdateScopes = (newScopes: string[]) => {
    if (selectedResource) {
      const updatedResources = resources.map(r => 
        r.id === selectedResource.id 
          ? { ...r, scopes: newScopes, updatedAt: new Date().toISOString().split('T')[0] }
          : r
      );
      setResources(updatedResources);
      setShowScopesModal(false);
      setSelectedResource(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Manage Resources</h1>
              <p className="text-muted-foreground">Create, edit, and manage application resources and their scopes</p>
            </div>
            <Button onClick={handleCreateResource}>
              <Plus className="mr-2 h-4 w-4" />
              Create Resource
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{resource.name}</h3>
                        <Badge variant={resource.status === 'Active' ? 'default' : 'secondary'}>
                          {resource.status}
                        </Badge>
                        <Badge variant="outline">{resource.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Created: {resource.createdAt}</span>
                        <span>Updated: {resource.updatedAt}</span>
                        <span>{resource.scopes.length} scopes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleManageScopes(resource)}
                      title="Manage Scopes"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditResource(resource)}
                      title="Edit Resource"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteResource(resource.id)}
                      title="Delete Resource"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create/Edit Resource Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{showCreateModal ? 'Create Resource' : 'Edit Resource'}</CardTitle>
                <CardDescription>
                  {showCreateModal ? 'Add a new resource to the system' : 'Update resource information'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Resource Name</Label>
                  <Input
                    id="name"
                    value={editingResource.name || ''}
                    onChange={(e) => setEditingResource({...editingResource, name: e.target.value})}
                    placeholder="Enter resource name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editingResource.description || ''}
                    onChange={(e) => setEditingResource({...editingResource, description: e.target.value})}
                    placeholder="Enter resource description"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={editingResource.type || 'API'}
                    onChange={(e) => setEditingResource({...editingResource, type: e.target.value})}
                    className="block w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="API">API</option>
                    <option value="Service">Service</option>
                    <option value="Web App">Web App</option>
                    <option value="Database">Database</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={editingResource.status || 'Active'}
                    onChange={(e) => setEditingResource({...editingResource, status: e.target.value})}
                    className="block w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setEditingResource({});
                      setSelectedResource(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveResource}>
                    {showCreateModal ? 'Create' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Manage Scopes Modal */}
        {showScopesModal && selectedResource && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Manage Scopes - {selectedResource.name}</CardTitle>
                <CardDescription>Assign or remove scopes for this resource</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AVAILABLE_SCOPES.map((scope) => (
                    <div key={scope} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={scope}
                        checked={selectedResource.scopes.includes(scope)}
                        onChange={(e) => {
                          const newScopes = e.target.checked
                            ? [...selectedResource.scopes, scope]
                            : selectedResource.scopes.filter(s => s !== scope);
                          setSelectedResource({...selectedResource, scopes: newScopes});
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={scope} className="text-sm">{scope}</Label>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowScopesModal(false);
                      setSelectedResource(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleUpdateScopes(selectedResource.scopes)}>
                    Save Scopes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources; 