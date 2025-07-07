import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById } from '../data';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowLeft, Users, Settings } from 'lucide-react';

const TEAM_DATA = {
  'dev-team': {
    name: 'Development Team',
    description: 'Core development team for software projects',
    members: ['Alice Smith', 'Bob Jones', 'Claire White'],
    attributes: { permission: 'Full Access', created: '2023-01-01' },
  },
  'qa-team': {
    name: 'QA Team',
    description: 'Quality assurance and testing team',
    members: ['Daniel Brown', 'Emma James'],
    attributes: { permission: 'Read Only', created: '2023-02-01' },
  },
  'mgmt-team': {
    name: 'Management Team',
    description: 'Project management and leadership team',
    members: ['Grace Lee'],
    attributes: { permission: 'Admin', created: '2023-03-01' },
  },
};

const TeamDetails: React.FC = () => {
  const { clientId, teamId } = useParams<{ clientId: string; teamId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'members'>('info');

  if (!clientId || !teamId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error</CardTitle>
            <CardDescription>Team or Client ID not provided</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const client = getClientById(clientId);
  const team = TEAM_DATA[teamId as keyof typeof TEAM_DATA];

  if (!client || !team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Team Not Found</CardTitle>
            <CardDescription>The requested team could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate(-1)}>
              Back
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
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Team Details</h1>
            <p className="text-muted-foreground">{client.name}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
          <Button
            variant={activeTab === 'info' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('info')}
            className="flex items-center"
          >
            <Users className="mr-2 h-4 w-4" />
            Info
          </Button>
          <Button
            variant={activeTab === 'members' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('members')}
            className="flex items-center"
          >
            <Settings className="mr-2 h-4 w-4" />
            Team Members
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' ? (
          <Card>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>Team information and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
                <p className="text-sm">{team.description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Permission Level</h3>
                  <Badge variant="outline">{team.attributes.permission}</Badge>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Created</h3>
                  <p className="text-sm">{team.attributes.created}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Total Members</h3>
                  <p className="text-sm">{team.members.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage team membership and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {member.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{member}</p>
                      <p className="text-sm text-muted-foreground">Team Member</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamDetails;
