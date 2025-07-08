import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useClientStore, 
  useRoleStore, 
  useProductStore, 
  useAuthStore,
  useUIStore 
} from './stores';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Users, Building2, MoreVertical, Plus, Loader2 } from 'lucide-react';
import AddClientForm from './components/AddClientForm';
import ZustandExample from './components/ZustandExample';

// Product icon mapping
const PRODUCT_ICONS: Record<string, string> = {
  Assess: '📝',
  'KF Assess': '📝',
  Pay: '💸',
  'KF pay': '💸',
  Architect: '🏗️',
  'Profile Manager': '👤',
  Listen: '🎧',
  Tableau: '📊',
};

// Random emoji icons for unknown products
const RANDOM_ICONS = ['🌟', '🚀', '🧩', '🔮', '🦄', '🎲', '🎯', '🛠️'];
function getRandomIcon(seed: string) {
  // Simple deterministic hash for consistent icon per product
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return RANDOM_ICONS[Math.abs(hash) % RANDOM_ICONS.length];
}

const Dashboard: React.FC = () => {
  const [tab, setTab] = useState<'Clients' | 'Roles' | 'Zustand'>('Clients');
  const [search, setSearch] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const navigate = useNavigate();

  // Store hooks
  const { 
    clients, 
    isLoading: clientsLoading, 
    error: clientsError, 
    fetchClients, 
    createClient 
  } = useClientStore();
  
  const { 
    roles, 
    isLoading: rolesLoading, 
    error: rolesError, 
    fetchRoles 
  } = useRoleStore();
  
  const { 
    products, 
    isLoading: productsLoading, 
    error: productsError, 
    fetchProducts 
  } = useProductStore();
  
  const { isAuthenticated, userEmail } = useAuthStore();
  const { addNotification } = useUIStore();

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchClients();
      fetchRoles();
      fetchProducts();
    }
  }, [isAuthenticated, fetchClients, fetchRoles, fetchProducts]);

  // Handle errors
  useEffect(() => {
    if (clientsError) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to load clients: ' + clientsError });
    }
    if (rolesError) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to load roles: ' + rolesError });
    }
    if (productsError) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to load products: ' + productsError });
    }
  }, [clientsError, rolesError, productsError, addNotification]);

  // Filter roles by search
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(search.toLowerCase()) ||
    role.type.toLowerCase().includes(search.toLowerCase()) ||
    role.description.toLowerCase().includes(search.toLowerCase())
  );

  // Filter clients by search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.subscribedProducts?.join(', ').toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Handles adding a new client
   */
  const handleAddClient = async (clientData: { 
    name: string; 
    subscribedProducts: string[]; 
    identityType: string; 
    sso: boolean; 
    isExistingClient: boolean 
  }) => {
    try {
      await createClient({
        name: clientData.name,
        subscribedProducts: clientData.subscribedProducts,
        users: [],
        teams: [],
      });
      
      addNotification({ type: 'success', title: 'Success', message: 'Client created successfully' });
      setIsAddClientOpen(false);
    } catch (error) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to create client' });
    }
  };

  // Loading state
  if (clientsLoading || rolesLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-lg">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`px-4 py-2 border-b-2 font-semibold ${tab === 'Clients' ? 'border-green-800 text-green-800' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setTab('Clients')}
        >
          Clients
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-semibold ${tab === 'Roles' ? 'border-green-800 text-green-800' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setTab('Roles')}
        >
          Roles
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-semibold ${tab === 'Zustand' ? 'border-green-800 text-green-800' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setTab('Zustand')}
        >
          Zustand Demo
        </button>
      </div>
      
      {tab === 'Clients' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="border rounded px-3 py-2 w-72"
                placeholder="Search by client name, product, etc."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="text-muted-foreground text-sm">{filteredClients.length} results</span>
            </div>
            <Button 
              className="bg-green-700 text-white hover:bg-green-800"
              onClick={() => setIsAddClientOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3 font-medium">Client</th>
                  <th className="text-left p-3 font-medium">Products</th>
                  <th className="text-left p-3 font-medium">Users</th>
                  <th className="text-left p-3 font-medium">Teams</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-t hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-muted-foreground text-xs">ID: {client.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {client.subscribedProducts?.map((product, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {PRODUCT_ICONS[product] || getRandomIcon(product)} {product}
                          </Badge>
                        )) || <span className="text-muted-foreground">No products</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{client.users?.length || 0}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span>{client.teams?.length || 0}</span>
                    </td>
                                         <td className="p-3">
                       <Badge variant="default">
                         Active
                       </Badge>
                     </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/client/${client.id}`)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Roles' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="border rounded px-3 py-2 w-72"
                placeholder="Search roles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="text-muted-foreground text-sm">{filteredRoles.length} results</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3 font-medium">Role Name</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Permissions</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="border-t hover:bg-muted/50">
                    <td className="p-3">
                      <div className="font-medium">{role.name}</div>
                      <div className="text-muted-foreground text-xs">{role.description}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{role.type}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={role.status === 'active' ? 'default' : 'secondary'}>
                        {role.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.slice(0, 3).map((permission, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                        {role.permissions?.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/role/${role.id}`)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Zustand' && <ZustandExample />}

      <AddClientForm
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onSubmit={handleAddClient}
      />
    </div>
  );
};

export default Dashboard;
