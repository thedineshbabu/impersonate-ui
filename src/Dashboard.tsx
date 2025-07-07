import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClients } from './data';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Users, Building2, MoreVertical, Plus } from 'lucide-react';
import AddClientForm from './components/AddClientForm';

// Mock roles data
const mockRoles = [
  {
    name: 'Assess Admin',
    userType: 'Client users',
    roleType: 'Admin',
    clients: 2,
    products: 'KF Assess',
    lastUpdated: 'May 7, 2025',
  },
  {
    name: 'Pay User',
    userType: 'Korn Ferry users',
    roleType: 'Non-admin',
    clients: 3,
    products: '-',
    lastUpdated: 'May 1, 2025',
  },
  {
    name: 'All products',
    userType: 'Client users',
    roleType: 'Admin',
    clients: 35,
    products: 'All products',
    lastUpdated: 'Apr 17, 2025',
  },
  {
    name: 'Client Admin',
    userType: 'Client users',
    roleType: 'Non-admin',
    clients: 25,
    products: 'KF assess, KF pay',
    lastUpdated: 'Apr 11, 2025',
  },
  {
    name: 'Assess user',
    userType: 'Korn Ferry users',
    roleType: 'Admin',
    clients: 432,
    products: '-',
    lastUpdated: 'Apr 11, 2025',
  },
  {
    name: 'User',
    userType: 'Client users',
    roleType: 'Non-admin',
    clients: 230,
    products: 'Profile Manager',
    lastUpdated: 'Apr 8, 2025',
  },
  {
    name: 'Client User',
    userType: 'Client users',
    roleType: 'Non-admin',
    clients: 5,
    products: 'Lorem ipsum dolor sit amet,Lorem ips.',
    lastUpdated: 'Feb 29, 2025',
  },
  {
    name: 'Super Client Admin',
    userType: 'Client users',
    roleType: 'Non-admin',
    clients: 1,
    products: '-',
    lastUpdated: 'Feb 28, 2025',
  },
  {
    name: 'Reports',
    userType: 'Client users',
    roleType: 'Non-admin',
    clients: 3,
    products: 'Lorem ipsum dolor sit amet,Lorem ips.',
    lastUpdated: 'Feb 12, 2025',
  },
  {
    name: 'Link',
    userType: 'Korn Ferry users',
    roleType: 'Non-admin',
    clients: 4,
    products: '-',
    lastUpdated: 'Feb 2, 2025',
  },
];

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
  const [tab, setTab] = useState<'Clients' | 'Roles'>('Clients');
  const [search, setSearch] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clients, setClients] = useState(getClients());
  const navigate = useNavigate();

  // Filter roles by search
  const filteredRoles = mockRoles.filter(role =>
    role.name.toLowerCase().includes(search.toLowerCase()) ||
    role.userType.toLowerCase().includes(search.toLowerCase()) ||
    role.roleType.toLowerCase().includes(search.toLowerCase()) ||
    role.products.toLowerCase().includes(search.toLowerCase())
  );

  // Filter clients by search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.subscribedProducts.join(', ').toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Handles adding a new client to the list
   */
  const handleAddClient = (clientData: { name: string; subscribedProducts: string[]; identityType: string; sso: boolean; isExistingClient: boolean }) => {
    const newClient = {
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: clientData.name,
      subscribedProducts: clientData.subscribedProducts,
      identityType: clientData.identityType,
      sso: clientData.sso,
      isExistingClient: clientData.isExistingClient,
      users: [],
      teams: []
    };
    
    setClients([...clients, newClient]);
  };

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
              <span className="text-muted-foreground text-sm">{clients.length} results</span>
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
                  <th className="p-2 border-b text-left font-semibold">Client name</th>
                  <th className="p-2 border-b text-left font-semibold">Client Type</th>
                  <th className="p-2 border-b text-left font-semibold">Users</th>
                  <th className="p-2 border-b text-left font-semibold">Teams</th>
                  <th className="p-2 border-b text-left font-semibold">Products</th>
                  <th className="p-2 border-b text-left font-semibold">Status</th>
                  <th className="p-2 border-b text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, idx) => {
                  // Assign random client type if not already set
                  const clientTypes = ['Hub', 'Multi Rater', 'Hub & Multi Rater'];
                  const randomClientType = clientTypes[idx % clientTypes.length]; // Use modulo for consistent assignment
                  
                  return (
                    <tr key={client.id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/client/${client.id}`)}>
                      <td className="p-2 font-medium flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {client.name}
                      </td>
                      <td className="p-2">
                        {randomClientType === 'Hub & Multi Rater' ? (
                          <div className="flex gap-1">
                            <Badge 
                              variant="outline" 
                              className="text-xs border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              Hub
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="text-xs border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            >
                              Multi Rater
                            </Badge>
                          </div>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              randomClientType === 'Hub' 
                                ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                                : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {randomClientType}
                          </Badge>
                        )}
                      </td>
                      <td className="p-2 font-mono">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {client.users.length}
                        </div>
                      </td>
                    <td className="p-2 font-mono">
                      {client.teams ? client.teams.length : 0}
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {client.subscribedProducts.map((product, i) => {
                          const icon = PRODUCT_ICONS[product] || getRandomIcon(product);
                          return (
                            <Badge key={i} variant="secondary" className="text-xs" title={product}>
                              {icon}
                            </Badge>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    </td>
                                          <td className="p-2"><MoreVertical className="w-5 h-5 text-muted-foreground cursor-pointer" onClick={e => {e.stopPropagation(); /* actions */}} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Client Form Dialog */}
      <AddClientForm
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onSubmit={handleAddClient}
      />

      {tab === 'Roles' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="border rounded px-3 py-2 w-72"
                placeholder="Search by role name, type, etc."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="text-muted-foreground text-sm">{filteredRoles.length} results</span>
            </div>
            <Button className="bg-green-700 text-white hover:bg-green-800">+ Create Role Template</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 border-b text-left font-semibold">Role name</th>
                  <th className="p-2 border-b text-left font-semibold">User type</th>
                  <th className="p-2 border-b text-left font-semibold">Role type</th>
                  <th className="p-2 border-b text-left font-semibold">Clients</th>
                  <th className="p-2 border-b text-left font-semibold">Products</th>
                  <th className="p-2 border-b text-left font-semibold">Last Updated on</th>
                  <th className="p-2 border-b text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{role.name}</td>
                    <td className="p-2">
                      <Badge className={`text-xs ${role.userType === 'Korn Ferry users' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{role.userType}</Badge>
                    </td>
                    <td className="p-2">
                      <Badge className={`text-xs ${role.roleType === 'Admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{role.roleType}</Badge>
                    </td>
                    <td className="p-2 font-mono">{role.clients}</td>
                    <td className="p-2">{role.products}</td>
                    <td className="p-2">{role.lastUpdated}</td>
                    <td className="p-2"><MoreVertical className="w-5 h-5 text-muted-foreground cursor-pointer" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">Results per page: <select className="border rounded px-1 py-0.5 text-sm"><option>25</option></select> Showing 1 to {Math.min(10, filteredRoles.length)} of {filteredRoles.length} results</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">{'<'}</Button>
              <span className="text-sm">01 of 124 pages</span>
              <Button variant="outline" size="sm">{'>'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
