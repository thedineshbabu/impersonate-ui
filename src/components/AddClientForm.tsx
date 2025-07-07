import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Badge } from './ui/badge';
import { X, Plus } from 'lucide-react';

// Available products for selection
const AVAILABLE_PRODUCTS = [
  'Pay & Markets',
  'Assess',
  'KF Architect',
  'Profile Manager',
  'Pay Equity',
  'KF Assess',
  'KF Pay',
  'Tableau',
  'Listen'
];

interface AddClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientData: {
    name: string;
    subscribedProducts: string[];
    identityType: string;
    sso: boolean;
    isExistingClient: boolean;
  }) => void;
}

/**
 * Form component for adding new clients
 * Provides input fields for client name and product selection
 */
const AddClientForm: React.FC<AddClientFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [clientName, setClientName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState('');
  const [identityType, setIdentityType] = useState('KF1');
  const [sso, setSso] = useState(false);
  const [isExistingClient, setIsExistingClient] = useState(false);

  /**
   * Handles form submission with validation
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim()) {
      alert('Please enter a client name');
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    // Generate a unique ID for the new client
    const newClientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    onSubmit({
      name: clientName.trim(),
      subscribedProducts: selectedProducts,
      identityType: identityType,
      sso: sso,
      isExistingClient: isExistingClient
    });

    // Reset form
    setClientName('');
    setSelectedProducts([]);
    setNewProduct('');
    setIdentityType('KF1');
    setSso(false);
    setIsExistingClient(false);
    onClose();
  };

  /**
   * Adds a product to the selected products list
   */
  const addProduct = (product: string) => {
    if (!selectedProducts.includes(product)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  /**
   * Removes a product from the selected products list
   */
  const removeProduct = (product: string) => {
    setSelectedProducts(selectedProducts.filter(p => p !== product));
  };

  /**
   * Adds a custom product to the list
   */
  const addCustomProduct = () => {
    if (newProduct.trim() && !selectedProducts.includes(newProduct.trim())) {
      setSelectedProducts([...selectedProducts, newProduct.trim()]);
      setNewProduct('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Name Input */}
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name *</Label>
            <Input
              id="clientName"
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          {/* SSO Checkbox */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sso"
                checked={sso}
                onChange={(e) => setSso(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="sso" className="text-sm font-medium">SSO (Single Sign-On)</Label>
            </div>
            <p className="text-xs text-muted-foreground">Enable Single Sign-On authentication for this client</p>
          </div>

          {/* Is Existing Client Checkbox */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isExistingClient"
                checked={isExistingClient}
                onChange={(e) => {
                  setIsExistingClient(e.target.checked);
                  if (e.target.checked && identityType === 'KF1') {
                    setIdentityType('Hub');
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isExistingClient" className="text-sm font-medium">Is Existing Client</Label>
            </div>
            <p className="text-xs text-muted-foreground">Check if this is an existing client with established identity setup</p>
          </div>

          {/* Client Exist On Selection - Only show if Is Existing Client is checked */}
          {isExistingClient && (
            <div className="space-y-2">
              <Label htmlFor="identityType">Client Exist On *</Label>
              <select
                id="identityType"
                value={identityType}
                onChange={(e) => setIdentityType(e.target.value)}
                className="block w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="Hub">Hub</option>
                <option value="Multi Rater">Multi Rater</option>
                <option value="Hub & Multi Rater">Hub & Multi Rater</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {identityType === 'Multi Rater' 
                  ? 'Authentication will be handled through the Multi Rater Platform. Users are expected to be in the platform.'
                  : 'Authentication will be handled through the Hub Platform. Users are expected to be in the platform.'
                }
              </p>
            </div>
          )}

          {/* Product Selection */}
          <div className="space-y-4">
            <Label>Subscribed Products *</Label>
            
            {/* Available Products */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Available Products</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_PRODUCTS.map((product) => (
                  <Button
                    key={product}
                    type="button"
                    variant={selectedProducts.includes(product) ? "default" : "outline"}
                    size="sm"
                    onClick={() => addProduct(product)}
                    className="text-xs"
                  >
                    {product}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Product Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Add Custom Product</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter custom product name"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomProduct())}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomProduct}
                  disabled={!newProduct.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Selected Products Display */}
            {selectedProducts.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Selected Products ({selectedProducts.length})</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50">
                  {selectedProducts.map((product) => (
                    <Badge
                      key={product}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {product}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeProduct(product)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-700 hover:bg-green-800">
              Add Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientForm; 