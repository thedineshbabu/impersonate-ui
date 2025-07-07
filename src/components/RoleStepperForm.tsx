import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Check, Ban, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';

const PRODUCTS = ['Pay', 'Assess', 'Architect', 'Profile Manager', 'Pay Equity'];

const STEPS = [
  'Role details',
  'Permissions',
  'Review',
];

// Permission types (columns)
const PERMISSION_TYPES = ['Add', 'Edit', 'Delete', 'View', 'Lists', 'Upload', 'Access'];

// Mock resources for each product and resource type
const RESOURCE_DATA = {
  Assess: {
    'Talent Suite resources': [
      'Assess tab',
      'Assessment usage report',
      'Development roadmap report',
      'Email template',
      'Campaign',
      'Talent group',
      'Insights',
    ],
  },
  Architect: {
    'Talent Suite resources': [
      'Assess tab',
      'Assessment usage report',
      'Development roadmap report',
      'Email template',
      'Campaign',
      'Talent group',
      'Insights',
    ],
  },
  Pay: {
    'Talent Suite resources': [],
  },
  'Profile Manager': {
    'Talent Suite resources': [],
  },
  'Pay Equity': {
    'Talent Suite resources': [
      'Australia',
      'UK',
      'North America',
    ],
  },
};

// Update user type options
const USER_TYPE_OPTIONS = ['Generic Users', 'Kornferry Only Users'] as const;
type UserType = typeof USER_TYPE_OPTIONS[number];

const RoleStepperForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState<UserType>('Generic Users');
  const [roleType, setRoleType] = useState<'Admin' | 'User'>('Admin');
  const [roleName, setRoleName] = useState('');
  const [products, setProducts] = useState<string[]>([]);
  // Step 2 state
  const [activeProduct, setActiveProduct] = useState<string>('');
  const [activeResourceTab, setActiveResourceTab] = useState<string>('Talent Suite resources');
  // Permissions: { [product]: { [resourceType]: { [resource]: { [perm]: boolean } } } }
  const [permissions, setPermissions] = useState<any>({});
  const navigate = useNavigate();

  // --- useEffect hooks at top level (fix hooks error) ---
  React.useEffect(() => {
    const productTabs: (keyof typeof RESOURCE_DATA)[] = (products.length > 0 ? products : ['Assess']) as (keyof typeof RESOURCE_DATA)[];
    if (productTabs.length && !activeProduct) setActiveProduct(productTabs[0]);
  }, [products, activeProduct]);

  React.useEffect(() => {
    if (!activeProduct) return;
    const resourceTabs: string[] = Object.keys((RESOURCE_DATA as any)[activeProduct] || {});
    if (resourceTabs.length && !activeResourceTab) setActiveResourceTab(resourceTabs[0]);
  }, [activeProduct, activeResourceTab]);

  // Validation for Step 1
  const isStep1Valid = roleName.trim() !== '' && products.length > 0;

  // Stepper UI
  const renderStepper = () => (
    <div className="flex items-center justify-center gap-8 py-6">
      {STEPS.map((label, idx) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 ${step === idx ? 'bg-primary text-white border-primary' : 'bg-muted text-muted-foreground border-border'}`}>{idx + 1}</div>
            <span className={`mt-2 text-xs font-medium ${step === idx ? 'text-primary' : 'text-muted-foreground'}`}>{`Step ${idx + 1}: ${label}`}</span>
          </div>
          {idx < STEPS.length - 1 && <div className="w-12 h-0.5 bg-border" />}
        </React.Fragment>
      ))}
    </div>
  );

  // Multi-select for products
  const renderProductSelect = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {products.length > 0 ? products.join(', ') : 'Select products'}
          <span className="ml-2">▼</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {PRODUCTS.map((prod) => (
          <DropdownMenuItem
            key={prod}
            onSelect={() => {
              setProducts((prev) =>
                prev.includes(prod)
                  ? prev.filter((p) => p !== prod)
                  : [...prev, prod]
              );
            }}
          >
            <input
              type="checkbox"
              checked={products.includes(prod)}
              readOnly
              className="mr-2"
            />
            {prod}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Step 1: Role details form
  const renderStep1 = () => (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Role details</CardTitle>
        <CardDescription>Enter basic role details to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>User Type</Label>
          <div className="flex gap-6 mt-2">
            {USER_TYPE_OPTIONS.map(option => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value={option}
                  checked={userType === option}
                  onChange={() => setUserType(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label>Role type</Label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="roleType"
                value="Admin"
                checked={roleType === 'Admin'}
                onChange={() => setRoleType('Admin')}
              />
              Admin
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="roleType"
                value="User"
                checked={roleType === 'User'}
                onChange={() => setRoleType('User')}
              />
              User
            </label>
          </div>
        </div>
        <div>
          <Label htmlFor="roleName">Role name<span className="text-red-500">*</span></Label>
          <Input
            id="roleName"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
            required
          />
        </div>
        <div>
          <Label>Products<span className="text-red-500">*</span></Label>
          {renderProductSelect()}
        </div>
        <div className="flex justify-between pt-4">
          <Button variant="outline" type="button" onClick={() => {/* handle cancel */}}>Cancel</Button>
          <Button type="button" disabled={!isStep1Valid} onClick={() => setStep(1)}>
            Step 2: Permissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Step 2: Permissions form
  const renderStep2 = () => {
    // Only show tabs for selected products
    const productTabs: (keyof typeof RESOURCE_DATA)[] = (products.length > 0 ? products : ['Assess']) as (keyof typeof RESOURCE_DATA)[];
    // Resource types for the active product
    const resourceTabs: string[] = Object.keys((RESOURCE_DATA as any)[activeProduct] || {});
    const resources: string[] = ((RESOURCE_DATA as any)[activeProduct]?.[activeResourceTab] || []) as string[];

    // Helper: get/set permission
    const isChecked = (resource: string, perm: string) =>
      !!permissions?.[activeProduct]?.[activeResourceTab]?.[resource]?.[perm];
    const setChecked = (resource: string, perm: string, checked: boolean) => {
      setPermissions((prev: any) => ({
        ...prev,
        [activeProduct]: {
          ...prev[activeProduct],
          [activeResourceTab]: {
            ...prev[activeProduct]?.[activeResourceTab],
            [resource]: {
              ...prev[activeProduct]?.[activeResourceTab]?.[resource],
              [perm]: checked,
            },
          },
        },
      }));
    };
    // Select all logic
    const isAllChecked = (perm: string) =>
      resources.length > 0 && resources.every((r: string) => isChecked(r, perm));
    const setAllChecked = (perm: string, checked: boolean) => {
      resources.forEach((r: string) => setChecked(r, perm, checked));
    };
    const isRowAllChecked = (resource: string) =>
      PERMISSION_TYPES.every((perm) => isChecked(resource, perm));
    const setRowAllChecked = (resource: string, checked: boolean) => {
      PERMISSION_TYPES.forEach((perm) => setChecked(resource, perm, checked));
    };
    // Render
    return (
      <Card className="max-w-5xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-green-800 text-2xl font-bold">Permissions</CardTitle>
          <CardDescription>Permissions are based off the products</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Product Tabs */}
          <div className="flex gap-4 border-b mb-4">
            {productTabs.map((prod) => (
              <button
                key={prod}
                className={`px-4 py-2 border-b-2 font-semibold ${activeProduct === prod ? 'border-green-800 text-green-800' : 'border-transparent text-muted-foreground'}`}
                onClick={() => setActiveProduct(prod)}
              >
                {prod}
              </button>
            ))}
          </div>
          {/* Resource Type Tabs */}
          <div className="flex gap-2 mb-4">
            {resourceTabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1 rounded ${activeResourceTab === tab ? 'bg-blue-100 text-blue-900' : 'bg-muted text-muted-foreground'}`}
                onClick={() => setActiveResourceTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Permissions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  <th className="p-2 border-b text-left font-medium"><input type="checkbox" aria-label="Select all rows" onChange={e => resources.forEach(r => setRowAllChecked(r, e.target.checked))} checked={resources.length > 0 && resources.every(r => isRowAllChecked(r))} /></th>
                  <th className="p-2 border-b text-left font-medium">Select all</th>
                  {PERMISSION_TYPES.map((perm) => (
                    <th key={perm} className="p-2 border-b text-center font-medium">
                      <input type="checkbox" aria-label={`Select all ${perm}`} onChange={e => setAllChecked(perm, e.target.checked)} checked={isAllChecked(perm)} />
                      <div>{perm}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resources.map((resource) => (
                  <tr key={resource} className="border-b">
                    <td className="p-2 text-center"><input type="checkbox" aria-label={`Select all for ${resource}`} onChange={e => setRowAllChecked(resource, e.target.checked)} checked={isRowAllChecked(resource)} /></td>
                    <td className="p-2">{resource}</td>
                    {PERMISSION_TYPES.map((perm) => (
                      <td key={perm} className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked(resource, perm)}
                          onChange={e => setChecked(resource, perm, e.target.checked)}
                          aria-label={`${perm} for ${resource}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" type="button" onClick={() => setStep(0)}>← Step 1: Role Details</Button>
            <Button type="button" onClick={() => setStep(2)}>
              Step 3: Summary →
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step 3: Review/Summary
  const renderStep3 = () => {
    // Only show tabs for selected products
    const productTabs: (keyof typeof RESOURCE_DATA)[] = (products.length > 0 ? products : ['Assess']) as (keyof typeof RESOURCE_DATA)[];
    // Resource tabs for each product
    const getResourceTabs = (prod: string) => Object.keys((RESOURCE_DATA as any)[prod] || {});
    // Helper: count selected permissions for badge
    const countSelected = (prod: string, resourceTab: string) => {
      const resources: string[] = ((RESOURCE_DATA as any)[prod]?.[resourceTab] || []) as string[];
      let count = 0;
      resources.forEach((resource) => {
        PERMISSION_TYPES.forEach((perm) => {
          if (permissions?.[prod]?.[resourceTab]?.[resource]?.[perm]) count++;
        });
      });
      return count;
    };
    // Helper: render permission cell
    const renderPermCell = (prod: string, resourceTab: string, resource: string, perm: string) => {
      const allowed = permissions?.[prod]?.[resourceTab]?.[resource]?.[perm];
      if (allowed === undefined) return null;
      return allowed ? (
        <span className="flex justify-center"><Check className="text-green-700 w-4 h-4" /></span>
      ) : (
        <span className="flex justify-center"><Ban className="text-gray-400 w-4 h-4" /></span>
      );
    };
    const handleSave = () => {
      // TODO: Save logic here if needed
      navigate('/');
    };
    return (
      <Card className="max-w-5xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-green-800 text-2xl font-bold">Summary</CardTitle>
          <CardDescription>Review your selections and make any changes before saving.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Role Details Summary */}
          <div className="border rounded-md p-4 mb-6 bg-muted/50 relative">
            <div className="absolute top-4 right-4 cursor-pointer"><Pencil className="w-4 h-4 text-muted-foreground" /></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">User Type</div>
                <div className="font-semibold">{userType}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Role type</div>
                <div className="font-semibold">{roleType}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Role name</div>
                <div className="font-semibold">{roleName}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Products</div>
                <div className="font-semibold">{products.join(', ')}</div>
              </div>
            </div>
          </div>
          {/* Permissions Summary */}
          <div className="border rounded-md p-4 bg-muted/50">
            <div className="flex items-center mb-2">
              <span className="font-semibold text-lg mr-2">Permissions:</span>
              <span className="ml-2"><Pencil className="w-4 h-4 text-muted-foreground cursor-pointer" /></span>
            </div>
            {/* Product Tabs */}
            <div className="flex gap-4 border-b mb-4">
              {productTabs.map((prod) => (
                <button
                  key={prod}
                  className={`px-4 py-2 border-b-2 font-semibold flex items-center gap-2 ${activeProduct === prod ? 'border-green-800 text-green-800' : 'border-transparent text-muted-foreground'}`}
                  onClick={() => setActiveProduct(prod)}
                >
                  {prod}
                  <span className="bg-muted px-2 py-0.5 rounded text-xs font-normal">{countSelected(prod, getResourceTabs(prod)[0])}</span>
                </button>
              ))}
            </div>
            {/* Resource Type Tabs */}
            <div className="flex gap-2 mb-4">
              {getResourceTabs(activeProduct).map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded flex items-center gap-2 ${activeResourceTab === tab ? 'bg-blue-100 text-blue-900' : 'bg-muted text-muted-foreground'}`}
                  onClick={() => setActiveResourceTab(tab)}
                >
                  {tab}
                  <span className="bg-muted px-2 py-0.5 rounded text-xs font-normal">{countSelected(activeProduct, tab)}</span>
                </button>
              ))}
            </div>
            {/* Permissions Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr>
                    <th className="p-2 border-b text-left font-medium">Resources</th>
                    {PERMISSION_TYPES.map((perm) => (
                      <th key={perm} className="p-2 border-b text-center font-medium">{perm}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {((RESOURCE_DATA as any)[activeProduct]?.[activeResourceTab] || []).map((resource: string) => (
                    <tr key={resource} className="border-b">
                      <td className="p-2">{resource}</td>
                      {PERMISSION_TYPES.map((perm) => (
                        <td key={perm} className="p-2 text-center">
                          {renderPermCell(activeProduct, activeResourceTab, resource, perm)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" type="button" onClick={() => setStep(1)}>← Step 2: Permissions</Button>
            <Button type="button" className="bg-green-700 text-white hover:bg-green-800" onClick={handleSave}>Save Role Template</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">RBAC User Management</h1>
        </div>
      </div>
      {renderStepper()}
      {step === 0 && renderStep1()}
      {step === 1 && renderStep2()}
      {step === 2 && renderStep3()}
    </div>
  );
};

export default RoleStepperForm; 