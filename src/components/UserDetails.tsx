import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, getUsersByClientId, getUserTeam, getTeamsByClientId, CountryKfPayAttributes, BusinessUnit } from '../data';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, User, Settings, Users, ChevronDown, ChevronRight, Search, Plus, X, Check } from 'lucide-react';

const ALL_COUNTRIES = [
  "United States", "Canada", "Germany", "United Kingdom", "France", "Italy", "Spain", "Australia", "New Zealand", "Singapore", "Japan"
];

const UserDetails: React.FC = () => {
  const { clientId, userId } = useParams<{ clientId: string; userId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'teams' | 'attributes'>('info');
  const productTabs = clientId ? getClientById(clientId)?.subscribedProducts || [] : [];
  const [activeProductTab, setActiveProductTab] = useState(productTabs[0] || '');
  const [activePermissionsSubTab, setActivePermissionsSubTab] = useState<'assess' | 'otherProducts' | 'other'>('assess');
  const [isEditing, setIsEditing] = useState(false);
  const [editedAttributes, setEditedAttributes] = useState<CountryKfPayAttributes[]>([]);
  const [newCountry, setNewCountry] = useState<string>("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countryStates, setCountryStates] = useState<Record<string, {
    rewardValue: string;
    benchmarkValue: string;
    marketInsightsValue: string;
    genderEnabled: boolean;
    accessByLevelValue: string;
    referenceLevelEnabled: boolean;
  }>>(() => {
    const initial: Record<string, {
      rewardValue: string;
      benchmarkValue: string;
      marketInsightsValue: string;
      genderEnabled: boolean;
      accessByLevelValue: string;
      referenceLevelEnabled: boolean;
    }> = {};
    ALL_COUNTRIES.forEach(country => {
      initial[country] = {
        rewardValue: 'Access',
        benchmarkValue: 'Access',
        marketInsightsValue: 'Access',
        genderEnabled: true,
        accessByLevelValue: 'Access Exec only',
        referenceLevelEnabled: false,
      };
    });
    return initial;
  });
  const [architectHayLimit, setArchitectHayLimit] = useState('point');
  const [showAllProducts, setShowAllProducts] = useState(false);

  const client = clientId ? getClientById(clientId) : undefined;
  const user = clientId ? getUsersByClientId(clientId).find(u => u.userId === userId) : undefined;
  const userTeam = clientId && userId ? getUserTeam(clientId, userId) : undefined;
  const allTeams = clientId ? getTeamsByClientId(clientId) : [];
  
  // Team management state
  const [primaryTeam, setPrimaryTeam] = useState<string>(user?.teamId || '');
  const [secondaryTeams, setSecondaryTeams] = useState<string[]>([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState('');

  // Initialize edited attributes when user data is available
  React.useEffect(() => {
    if (user?.kfPayAttributes) {
      setEditedAttributes([...user.kfPayAttributes]);
    }
  }, [user]);

  React.useEffect(() => {
    setActiveProductTab(productTabs[0] || '');
    // eslint-disable-next-line
  }, [clientId]);

  // Add state for Add Job toggle, expand/collapse, search, and job properties
  const [addJobEnabled, setAddJobEnabled] = useState(true); // defaultChecked in toggle
  const [jobPropSearch, setJobPropSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Business Unit': true,
    'Job Location': true,
    'Job Status': true,
  });
  const [jobProperties, setJobProperties] = useState([
    {
      group: 'Business Unit',
      summary: 'View: 2 of 2 | Edit: 2 of 2',
      items: [
        { name: 'Business Unit 1', view: true, edit: true },
        { name: 'Business Unit 2', view: true, edit: true },
      ],
    },
    {
      group: 'Job Location',
      summary: 'View: 3 of 3 | Edit: 3 of 3',
      items: [
        { name: 'Rome', view: true, edit: true },
        { name: 'Paris', view: true, edit: true },
        { name: 'Amsterdam', view: true, edit: true },
      ],
    },
    {
      group: 'Job Status',
      summary: 'View: 4 of 4 | Edit: 4 of 4',
      items: [
        { name: 'KF Draft *', view: true, edit: true },
        { name: 'Draft', view: true, edit: true },
        { name: 'Active', view: true, edit: true },
        { name: 'Inactive', view: true, edit: true },
      ],
    },
  ]);

  // Handler for expand/collapse all
  const handleExpandCollapseAll = (expand: boolean) => {
    setExpandedGroups({
      'Business Unit': expand,
      'Job Location': expand,
      'Job Status': expand,
    });
  };

  // Handler for search
  const filteredJobProperties = jobProperties.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.name.toLowerCase().includes(jobPropSearch.toLowerCase())
    ),
  }));

  // Product attribute/toggle configs
  const productConfigs: Record<string, any> = {
    'Pay & Markets': {
      fields: [
        { label: 'Market Reference Date', type: 'date', value: '' },
        { label: 'Market Reference Currency', type: 'text', value: '' },
        { label: 'Market Reference Exchange Rate', type: 'number', value: '' },
      ],
      countries: [
        'Canada', 'France', 'Germany', 'Italy', 'Japan', 'Netherlands', 'Spain', 'UK', 'US',
      ],
    },
    'Select': {
      toggles: [
        { label: 'Candidate List', desc: 'Access to candidate list.' },
        { label: 'Development', desc: 'Access to development features.' },
        { label: 'Professional', desc: 'Access to professional features.' },
        // ...add more as needed
      ],
    },
    'Assess': {
      toggles: assessAttributes, // reuse existing assessAttributes
    },
    'Profile Manager': {
      toggles: [
        { label: 'Create Project', desc: 'Can create new projects.' },
        { label: 'Edit Project Settings', desc: 'Can edit project settings.' },
        // ...add more as needed
      ],
    },
    'Content Library': {
      toggles: [
        { label: 'Access Content Library', desc: 'Access to content library.' },
      ],
    },
    'Organizational Data Collection': {
      toggles: [
        { label: 'Access Org Data', desc: 'Access to organizational data collection.' },
      ],
    },
    'Insight': {
      toggles: [
        { label: 'Access Insight', desc: 'Access to insight features.' },
      ],
    },
    'KF Architect': {
      fields: [
        { label: 'Hay Point Min', type: 'number', value: '' },
        { label: 'Hay Point Max', type: 'number', value: '' },
      ],
      toggles: [
        { label: 'Job Matching', desc: 'Enable job matching.' },
        { label: 'Add Job', desc: 'Allow adding jobs.' },
      ],
      table: [
        { level: 'Level 1', view: true, edit: false },
        { level: 'Level 2', view: true, edit: true },
      ],
    },
    'Pay Equity': {
      toggles: [
        { label: 'Access Pay Equity', desc: 'Access to pay equity features.' },
        { label: 'View Reports', desc: 'Can view pay equity reports.' },
      ],
    },
  };

  if (!clientId || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error</CardTitle>
            <CardDescription>User or Client ID not provided</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!client || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>User Not Found</CardTitle>
            <CardDescription>The requested user could not be found.</CardDescription>
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
            <h1 className="text-2xl font-bold">User Details</h1>
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
            <User className="mr-2 h-4 w-4" />
            Info
          </Button>
          <Button
            variant={activeTab === 'teams' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('teams')}
            className="flex items-center"
          >
            <Users className="mr-2 h-4 w-4" />
            Teams
          </Button>
          <Button
            variant={activeTab === 'attributes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('attributes')}
            className="flex items-center"
          >
            <Settings className="mr-2 h-4 w-4" />
            Permissions
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' ? (
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                  <p className="text-sm">{user.firstName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                  <p className="text-sm">{user.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Team</Label>
                  <p className="text-sm">{userTeam ? userTeam.name : 'No team assigned'}</p>
                </div>
                {userTeam && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Team Description</Label>
                    <p className="text-sm">{userTeam.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : activeTab === 'teams' ? (
          <Card>
            <CardHeader>
              <CardTitle>Team Assignments</CardTitle>
              <CardDescription>Manage user's primary and secondary team memberships</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams..."
                  value={teamSearchTerm}
                  onChange={(e) => setTeamSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Team Selection */}
              <div className="space-y-4">
                {allTeams
                  .filter(team => 
                    team.name.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
                    team.description.toLowerCase().includes(teamSearchTerm.toLowerCase())
                  )
                  .map((team) => (
                    <div
                      key={team.teamId}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        primaryTeam === team.teamId 
                          ? 'border-primary bg-primary/5' 
                          : secondaryTeams.includes(team.teamId)
                          ? 'border-primary/50 bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => {
                        if (primaryTeam === team.teamId) {
                          setPrimaryTeam('');
                        } else if (secondaryTeams.includes(team.teamId)) {
                          setSecondaryTeams(secondaryTeams.filter(id => id !== team.teamId));
                        } else if (primaryTeam === '') {
                          setPrimaryTeam(team.teamId);
                        } else {
                          setSecondaryTeams([...secondaryTeams, team.teamId]);
                        }
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{team.name}</div>
                        <div className="text-xs text-muted-foreground">{team.description}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {primaryTeam === team.teamId && (
                          <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                            Primary
                          </Badge>
                        )}
                        {secondaryTeams.includes(team.teamId) && (
                          <Badge variant="outline" className="text-xs">
                            Secondary
                          </Badge>
                        )}
                        {(primaryTeam === team.teamId || secondaryTeams.includes(team.teamId)) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Summary */}
              {(primaryTeam || secondaryTeams.length > 0) && (
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Current Assignments:</div>
                  <div className="space-y-2">
                    {primaryTeam && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                          Primary
                        </Badge>
                        <span>{allTeams.find(t => t.teamId === primaryTeam)?.name}</span>
                      </div>
                    )}
                    {secondaryTeams.map((teamId) => (
                      <div key={teamId} className="flex items-center space-x-2 text-sm">
                        <Badge variant="outline" className="text-xs">Secondary</Badge>
                        <span>{allTeams.find(t => t.teamId === teamId)?.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Product Tabs */}
            {productTabs.length > 1 && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                  {productTabs.map((product) => (
                    <Button
                      key={product}
                      variant={activeProductTab === product ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveProductTab(product)}
                    >
                      {product}
                    </Button>
                  ))}
                </div>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    // TODO: Implement save functionality
                    console.log('Saving permissions for product:', activeProductTab);
                  }}
                >
                  Save
                </Button>
              </div>
            )}

            {/* Product-specific content */}
            {activeProductTab === 'Pay & Markets' && user?.kfPayAttributes && (
              <Card>
                <CardContent className="space-y-6">
                  {/* Country-wise Pay & Markets attributes */}
                  {user.kfPayAttributes.map((countryAttr, idx) => (
                    <div key={countryAttr.country} className="border rounded-lg mb-4">
                      <button
                        type="button"
                        className="w-full flex justify-between items-center px-4 py-2 bg-muted hover:bg-muted/80 rounded-t-lg focus:outline-none"
                        onClick={() => setExpandedGroups(prev => ({ ...prev, [countryAttr.country]: !prev[countryAttr.country] }))}
                      >
                        <span className="font-semibold text-base">{countryAttr.country}</span>
                        <span>{expandedGroups[countryAttr.country] ? <ChevronDown /> : <ChevronRight />}</span>
                      </button>
                      {expandedGroups[countryAttr.country] && (
                        <div className="p-4 space-y-4 bg-background rounded-b-lg">
                          {/* Access by Level toggle */}
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={countryAttr.attributes.accessbyLevel}
                              readOnly
                              className="h-4 w-4 text-green-600 focus:ring-green-600"
                            />
                            <Label className="text-sm font-medium">Access by Level</Label>
                          </div>
                          {/* Access Level */}
                          <div>
                            <Label className="text-sm font-medium">Access Level</Label>
                            <Input
                              type="text"
                              value={countryAttr.attributes.accessLevel || ''}
                              readOnly
                              className="block w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                          </div>
                          {/* Reference Level */}
                          <div>
                            <Label className="text-sm font-medium">Reference Level</Label>
                            <Input
                              type="text"
                              value={countryAttr.attributes.referenceLevel || ''}
                              readOnly
                              className="block w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                          </div>
                          {/* Business Units */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Business Units</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {(countryAttr.attributes.businessUnits || []).map((bu, i) => (
                                <div key={bu.name} className="flex items-center space-x-2 p-2 border rounded-md bg-background">
                                  <input
                                    type="checkbox"
                                    checked={bu.accessEnabled}
                                    readOnly
                                    className="h-4 w-4 text-green-600 focus:ring-green-600"
                                  />
                                  <span className="text-sm">{bu.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {['Select', 'Profile Manager', 'Content Library', 'Organizational Data Collection', 'Insight', 'Pay Equity'].includes(activeProductTab) && (
              <Card>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productConfigs[activeProductTab].toggles.map((toggle: any) => (
                      <div key={toggle.label} className="flex items-start space-x-3 p-2 border rounded-md bg-background">
                        <input
                          type="checkbox"
                          id={toggle.label}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                        />
                        <div>
                          <label htmlFor={toggle.label} className="block font-medium text-sm text-foreground">{toggle.label}</label>
                          <span className="block text-xs text-muted-foreground mt-1">{toggle.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {activeProductTab === 'Assess' && (
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle>Assess</CardTitle>
                  <CardDescription>Configure access toggles for assessment features</CardDescription>
                </CardHeader>
                <CardContent>
                  <AssessToggles />
                </CardContent>
              </Card>
            )}
            {activeProductTab === 'KF Architect' && (
              <Card>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productConfigs['KF Architect'].fields.map((field: any) => (
                      <div key={field.label}>
                        <Label className="text-sm font-medium">{field.label}</Label>
                        <input type={field.type} className="block w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productConfigs['KF Architect'].toggles.map((toggle: any) => (
                      <div key={toggle.label} className="flex items-start space-x-3 p-2 border rounded-md bg-background">
                        <input
                          type="checkbox"
                          id={toggle.label}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                        />
                        <div>
                          <label htmlFor={toggle.label} className="block font-medium text-sm text-foreground">{toggle.label}</label>
                          <span className="block text-xs text-muted-foreground mt-1">{toggle.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Job Levels</Label>
                    <table className="w-full border text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 text-left">Level</th>
                          <th className="p-2 text-center">View</th>
                          <th className="p-2 text-center">Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productConfigs['KF Architect'].table.map((row: any) => (
                          <tr key={row.level}>
                            <td className="p-2">{row.level}</td>
                            <td className="p-2 text-center"><input type="checkbox" checked={row.view} readOnly className="h-4 w-4 text-green-600" /></td>
                            <td className="p-2 text-center"><input type="checkbox" checked={row.edit} readOnly className="h-4 w-4 text-green-600" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;

/**
 * AssessToggles component renders all toggles and descriptions for the Assess section.
 */
const assessAttributes = [
  { label: 'Potential', desc: 'This toggle only affects access in Assess.' },
  { label: 'Potential + Learning Agility', desc: 'This toggle only affects access in Assess.' },
  { label: 'Leadership', desc: 'This toggle only affects access in Assess.' },
  { label: 'Leadership + Learning Agility', desc: 'This toggle only affects access in Assess.' },
  { label: 'Leadership + Potential add On', desc: 'This toggle only affects access in Assess.' },
  { label: 'Leadership + Potential add on + Learning Agility', desc: 'This toggle only affects access in Assess.' },
  { label: 'Professional', desc: 'This toggle only affects access in Assess.' },
  { label: 'Professional + Learning Agility', desc: 'This toggle only affects access in Assess.' },
  { label: 'Market Insights', desc: 'This toggle also affects access in Select, Profile Manager and Content Library' },
  { label: 'Learning Agility', desc: 'This toggle only affects access in Assess.' },
  { label: 'Grade', desc: 'This toggle also affects access in Select, Profile Manager and Content Library' },
  { label: 'Salary Data', desc: 'This toggle also affects access in Select and Profile Manager.' },
  { label: 'Create Projects', desc: 'This toggle also affects access in Profile Manager.' },
  { label: 'Edit Project Settings', desc: 'This toggle only affects access in Assess.' },
  { label: 'Adjust Success Profile in an assessment project', desc: 'This toggle only affects access in Assess.' },
  { label: 'Save adjusted Success Profile for re-use in other projects', desc: 'This toggle affects access in Assess.' },
  { label: 'Edit Success Profiles', desc: 'This toggle affects access in Assess.' },
  { label: 'Collaborative Edit Success Profile', desc: 'This toggle only affects access in Assess.' },
  { label: 'Add Participants to a Project', desc: 'This toggle only affects access in Assess.' },
  { label: 'Search/view assessment participants across all User Groups', desc: 'This toggle affects access in Assess.' },
  { label: 'Update participant details', desc: 'This toggle only affects access in Assess.' },
  { label: 'Remove participants from a project', desc: 'This toggle only affects access in Assess.' },
  { label: 'Adjust participant feedback setting in an assessment project', desc: 'This toggle only affects access in Assess.' },
  { label: 'Create/Edit Email Templates', desc: 'This toggle only affects access in Assess.' },
  { label: 'Send email invites', desc: 'This toggle only affects access in Assess.' },
  { label: 'Send email reminders', desc: 'This toggle only affects access in Assess.' },
  { label: 'Receive email notifications when participants complete their assessments (default)', desc: 'This toggle affects access in Assess.' },
  { label: 'Compare Participant against multiple Success Profiles', desc: 'This toggle only affects access in Assess. It will not prevent access to downloads from Profile Manager or Content Library.' },
  { label: 'View Results/Download Reports', desc: 'This toggle only affects access in Assess.' },
  { label: 'Technical Skills Inventory', desc: 'This toggle only affects access in Assess.' },
  { label: 'The Inclusive Leader™ Situational Insight Tool', desc: 'This toggle only affects access in Assess.' },
];

const AssessToggles: React.FC = () => {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    // Default: all on except a few (as in screenshot)
    const initial: Record<string, boolean> = {};
    assessAttributes.forEach(attr => {
      if ([
        'Learning Agility',
        'Compare Participant against multiple Success Profiles',
        'Technical Skills Inventory',
        'The Inclusive Leader™ Situational Insight Tool',
      ].includes(attr.label)) {
        initial[attr.label] = false;
      } else {
        initial[attr.label] = true;
      }
    });
    return initial;
  });

  const handleToggle = (label: string) => {
    setToggles(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {assessAttributes.map(attr => (
        <div key={attr.label} className="flex items-start space-x-3 p-2 border rounded-md bg-background">
          <input
            type="checkbox"
            id={attr.label}
            checked={toggles[attr.label]}
            onChange={() => handleToggle(attr.label)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
          />
          <div>
            <label htmlFor={attr.label} className="block font-medium text-sm text-foreground">{attr.label}</label>
            <span className="block text-xs text-muted-foreground mt-1">{attr.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
