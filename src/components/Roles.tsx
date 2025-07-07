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
  Shield,
  Eye,
  Users,
  Key,
  Crown
} from 'lucide-react';

// Mock data for roles
const MOCK_ROLES: Role[] = [
  {
    id: '1',
    name: 'Assess User',
    userType: 'Korn Ferry users',
    roleType: 'Admin',
    products: ['Pay', 'Assess'],
    description: 'Access to Assess and Pay modules'
  },
  {
    id: '2',
    name: 'Profile Admin',
    userType: 'Client users',
    roleType: 'Admin',
    products: ['Profile Manager', 'Architect'],
    description: 'Admin for Profile and Architect'
  },
  {
    id: '3',
    name: 'Listen User',
    userType: 'Client users',
    roleType: 'User',
    products: ['Listen'],
    description: 'Standard Listen access'
  },
  {
    id: '4',
    name: 'Tableau User',
    userType: 'Korn Ferry users',
    roleType: 'User',
    products: ['Tableau'],
    description: 'Tableau dashboard access'
  }
];

// Available permissions for assignment
const AVAILABLE_PERMISSIONS = [
  // User permissions
  'read:users', 'write:users', 'delete:users', 'admin:users',
  'read:own', 'write:own', 'delete:own',
  
  // Resource permissions
  'read:resources', 'write:resources', 'delete:resources', 'admin:resources',
  'read:clients', 'write:clients', 'delete:clients',
  
  // Report permissions
  'read:reports', 'export:reports', 'admin:reports',
  
  // System permissions
  'read:all', 'write:all', 'delete:all', 'admin:all',
  'read:public', 'write:public',
  
  // Role management permissions
  'read:roles', 'write:roles', 'delete:roles', 'admin:roles',
  
  // Audit permissions
  'read:audit', 'export:audit', 'admin:audit'
];

interface Role {
  id: string;
  name: string;
  userType: 'Client users' | 'Korn Ferry users';
  roleType: 'Admin' | 'User';
  products: string[];
  description: string;
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Partial<Role>>({});

  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.roleType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handles the creation of a new role
   * Opens the create modal and resets the editing state
   */
  const handleCreateRole = () => {
    setEditingRole({});
    setShowCreateModal(true);
  };

  /**
   * Handles editing an existing role
   * @param role - The role to be edited
   */
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setEditingRole(role);
    setShowEditModal(true);
  };

  /**
   * Handles managing permissions for a specific role
   * @param role - The role whose permissions will be managed
   */
  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissionsModal(true);
  };

  /**
   * Handles deletion of a role with confirmation
   * @param roleId - The ID of the role to delete
   */
  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      setRoles(roles.filter(r => r.id !== roleId));
    }
  };

  /**
   * Handles saving role changes (create or update)
   * Validates required fields and updates the roles state
   */
  const handleSaveRole = () => {
    // Validate required fields
    if (!editingRole.name?.trim()) {
      alert('Role name is required');
      return;
    }

    if (showCreateModal) {
      // Create new role
      const newRole: Role = {
        id: Date.now().toString(),
        name: editingRole.name || '',
        userType: editingRole.userType || 'Korn Ferry users',
        roleType: editingRole.roleType || 'Admin',
        products: editingRole.products || [],
        description: editingRole.description || '',
      };
      setRoles([...roles, newRole]);
      setShowCreateModal(false);
    } else if (showEditModal && selectedRole) {
      // Update existing role
      const updatedRoles = roles.map(r => 
        r.id === selectedRole.id 
          ? { ...r, ...editingRole }
          : r
      );
      setRoles(updatedRoles);
      setShowEditModal(false);
    }
    setEditingRole({});
    setSelectedRole(null);
  };

  /**
   * Handles updating permissions for a role
   * @param newPermissions - Array of permission strings to assign to the role
   */
  const handleUpdatePermissions = (newPermissions: string[]) => {
    if (selectedRole) {
      const updatedRoles = roles.map(r => 
        r.id === selectedRole.id 
          ? { ...r, products: newPermissions }
          : r
      );
      setRoles(updatedRoles);
      setShowPermissionsModal(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Manage Roles</h1>
              <p className="text-muted-foreground">Create, edit, and manage user roles and their permissions</p>
            </div>
            <Button onClick={handleCreateRole}>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
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
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Roles List */}
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{role.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{role.userType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{role.roleType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {role.products.map((prod) => (
                          <Badge key={prod} variant="secondary">{prod}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                        title="Edit Role"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        title="Delete Role"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Role Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{showCreateModal ? 'Create Role' : 'Edit Role'}</CardTitle>
                <CardDescription>
                  {showCreateModal ? 'Add a new role to the system' : 'Update role information'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={editingRole.name || ''}
                    onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editingRole.description || ''}
                    onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                    placeholder="Enter role description"
                  />
                </div>
                <div>
                  <Label htmlFor="userType">User Type</Label>
                  <select
                    id="userType"
                    value={editingRole.userType || 'Korn Ferry users'}
                    onChange={(e) => setEditingRole({...editingRole, userType: e.target.value as 'Client users' | 'Korn Ferry users'})}
                    className="block w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Client users">Client users</option>
                    <option value="Korn Ferry users">Korn Ferry users</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="roleType">Role Type</Label>
                  <select
                    id="roleType"
                    value={editingRole.roleType || 'Admin'}
                    onChange={(e) => setEditingRole({...editingRole, roleType: e.target.value as 'Admin' | 'User'})}
                    className="block w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="products">Products</Label>
                  <select
                    id="products"
                    value={(editingRole.products || []).join(',')}
                    onChange={(e) => setEditingRole({...editingRole, products: e.target.value ? e.target.value.split(',') : []})}
                    className="block w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Pay">Pay</option>
                    <option value="Assess">Assess</option>
                    <option value="Profile Manager">Profile Manager</option>
                    <option value="Architect">Architect</option>
                    <option value="Listen">Listen</option>
                    <option value="Tableau">Tableau</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setEditingRole({});
                      setSelectedRole(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveRole}>
                    {showCreateModal ? 'Create' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Manage Permissions Modal */}
        {showPermissionsModal && selectedRole && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Manage Permissions - {selectedRole.name}</CardTitle>
                <CardDescription>Assign or remove permissions for this role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AVAILABLE_PERMISSIONS.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={permission}
                        checked={selectedRole.products.includes(permission)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...selectedRole.products, permission]
                            : selectedRole.products.filter(p => p !== permission);
                          setSelectedRole({...selectedRole, products: newPermissions});
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={permission} className="text-sm">{permission}</Label>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPermissionsModal(false);
                      setSelectedRole(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleUpdatePermissions(selectedRole.products)}>
                    Save Permissions
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

export default Roles; 