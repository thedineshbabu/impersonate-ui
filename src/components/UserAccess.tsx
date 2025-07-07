import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, getUsersByClientId, getTeamsByClientId } from '../data';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { ArrowLeft, Users, UserPlus, Download, Edit, Trash2, UserCheck, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const UserAccess: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'teams'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const teamsPerPage = 5; // Show 5 teams per page
  const usersPerPage = 5; // Show 5 users per page

  if (!clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error</CardTitle>
            <CardDescription>Client ID not provided</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const client = getClientById(clientId);
  const users = getUsersByClientId(clientId);
  const teams = getTeamsByClientId(clientId);

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

  const handleUserRowClick = (userId: string) => {
    navigate(`/client/${clientId}/users/${userId}`);
  };

  const handleTeamRowClick = (teamId: string) => {
    navigate(`/client/${clientId}/teams/${teamId}`);
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic for teams
  const totalTeams = teams.length;
  const totalPages = Math.ceil(totalTeams / teamsPerPage);
  const startIndex = (currentPage - 1) * teamsPerPage;
  const endIndex = startIndex + teamsPerPage;
  const currentTeams = teams.slice(startIndex, endIndex);

  // Pagination logic for users
  const totalUsers = filteredUsers.length;
  const totalUsersPages = Math.ceil(totalUsers / usersPerPage);
  const usersStartIndex = (usersCurrentPage - 1) * usersPerPage;
  const usersEndIndex = usersStartIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(usersStartIndex, usersEndIndex);

  // Reset to page 1 when switching tabs
  const handleTabChange = (tab: 'users' | 'teams') => {
    setActiveTab(tab);
    if (tab === 'teams') {
      setCurrentPage(1);
    } else if (tab === 'users') {
      setUsersCurrentPage(1);
    }
  };

  const renderUsersTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-muted-foreground">Manage user access and permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr 
                    key={user.userId} 
                    className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleUserRowClick(user.userId)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{user.email}</td>
                    <td className="p-4">
                      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit User"
                          onClick={e => {e.stopPropagation(); handleUserRowClick(user.userId);}}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete User"
                          onClick={e => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Impersonate User"
                          onClick={e => {e.stopPropagation(); navigate(`/impersonate?email=${encodeURIComponent(user.email)}`);}}
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Users Pagination Controls */}
      {totalUsersPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {usersStartIndex + 1} to {Math.min(usersEndIndex, totalUsers)} of {totalUsers} users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUsersCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={usersCurrentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalUsersPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={usersCurrentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUsersCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUsersCurrentPage(prev => Math.min(prev + 1, totalUsersPages))}
              disabled={usersCurrentPage === totalUsersPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderTeamsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Teams</h2>
          <p className="text-muted-foreground">Manage team access and permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </div>
      </div>

      {/* Teams Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Team Name</th>
                  <th className="text-left p-4 font-medium">Description</th>
                  <th className="text-left p-4 font-medium">Members</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTeams.map((team) => (
                  <tr 
                    key={team.teamId}
                    className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleTeamRowClick(team.teamId)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="font-medium">{team.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{team.description}</td>
                    <td className="p-4 text-sm">{team.members.length} members</td>
                    <td className="p-4">
                      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit Team"
                          onClick={e => {e.stopPropagation(); handleTeamRowClick(team.teamId);}}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Manage Members"
                          onClick={e => e.stopPropagation()}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete Team"
                          onClick={e => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalTeams)} of {totalTeams} teams
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">User Access Management</h1>
            <p className="text-muted-foreground">{client.name}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('users')}
            className="flex items-center"
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
          <Button
            variant={activeTab === 'teams' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('teams')}
            className="flex items-center"
          >
            <Users className="mr-2 h-4 w-4" />
            Teams
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' ? renderUsersTab() : renderTeamsTab()}
      </div>
    </div>
  );
};

export default UserAccess;
