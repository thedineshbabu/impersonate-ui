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
  Package,
  Star,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';

// Mock data for products
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Talent Acquisition Suite',
    description: 'Comprehensive platform for recruiting, hiring, and onboarding top talent with AI-powered candidate matching and automated workflows.',
    category: 'HR Software',
    status: 'Active',
    price: '$299/month',
    features: ['AI Candidate Matching', 'Automated Workflows', 'Analytics Dashboard', 'Integration APIs'],
    usersCount: 1250,
    rating: 4.8,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Performance Management Pro',
    description: 'Advanced performance tracking and evaluation system with goal setting, 360-degree feedback, and performance analytics.',
    category: 'HR Software',
    status: 'Active',
    price: '$199/month',
    features: ['Goal Setting', '360 Feedback', 'Performance Analytics', 'Custom Reports'],
    usersCount: 890,
    rating: 4.6,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Learning Management System',
    description: 'Complete learning platform for employee training, skill development, and certification management with mobile support.',
    category: 'Training',
    status: 'Active',
    price: '$149/month',
    features: ['Course Creation', 'Mobile Learning', 'Certification Tracking', 'Progress Analytics'],
    usersCount: 2100,
    rating: 4.7,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12'
  },
  {
    id: '4',
    name: 'Employee Engagement Hub',
    description: 'Platform for fostering employee engagement through surveys, recognition programs, and team collaboration tools.',
    category: 'Employee Experience',
    status: 'Beta',
    price: '$99/month',
    features: ['Pulse Surveys', 'Recognition Programs', 'Team Collaboration', 'Engagement Analytics'],
    usersCount: 450,
    rating: 4.5,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-08'
  },
  {
    id: '5',
    name: 'Payroll & Benefits Manager',
    description: 'Integrated payroll processing and benefits administration system with compliance tracking and reporting.',
    category: 'Payroll',
    status: 'Active',
    price: '$399/month',
    features: ['Payroll Processing', 'Benefits Admin', 'Compliance Tracking', 'Tax Reporting'],
    usersCount: 750,
    rating: 4.9,
    createdAt: '2023-12-15',
    updatedAt: '2024-01-15'
  }
];

// Available categories for products
const PRODUCT_CATEGORIES = [
  'HR Software',
  'Training',
  'Employee Experience',
  'Payroll',
  'Analytics',
  'Integration',
  'Mobile App',
  'Consulting'
];

// Available features for assignment
const AVAILABLE_FEATURES = [
  // Core Features
  'AI-Powered Analytics', 'Mobile Support', 'API Integration', 'Custom Branding',
  'Multi-language Support', 'SSO Integration', 'Data Export', 'Real-time Sync',
  
  // HR Features
  'Candidate Matching', 'Automated Workflows', 'Performance Tracking', 'Goal Setting',
  '360 Feedback', 'Employee Surveys', 'Recognition Programs', 'Team Collaboration',
  
  // Training Features
  'Course Creation', 'Learning Paths', 'Certification Tracking', 'Progress Analytics',
  'Video Conferencing', 'Assessment Tools', 'Gamification', 'Microlearning',
  
  // Analytics Features
  'Custom Reports', 'Data Visualization', 'Predictive Analytics', 'Benchmarking',
  'ROI Tracking', 'Performance Metrics', 'Trend Analysis', 'Executive Dashboards',
  
  // Compliance Features
  'Compliance Tracking', 'Audit Logs', 'Data Privacy', 'GDPR Compliance',
  'Tax Reporting', 'Regulatory Updates', 'Document Management', 'Workflow Automation'
];

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  price: string;
  features: string[];
  usersCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handles the creation of a new product
   * Opens the create modal and resets the editing state
   */
  const handleCreateProduct = () => {
    setEditingProduct({});
    setShowCreateModal(true);
  };

  /**
   * Handles editing an existing product
   * @param product - The product to be edited
   */
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditingProduct(product);
    setShowEditModal(true);
  };

  /**
   * Handles managing features for a specific product
   * @param product - The product whose features will be managed
   */
  const handleManageFeatures = (product: Product) => {
    setSelectedProduct(product);
    setShowFeaturesModal(true);
  };

  /**
   * Handles deletion of a product with confirmation
   * @param productId - The ID of the product to delete
   */
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  /**
   * Handles saving product changes (create or update)
   * Validates required fields and updates the products state
   */
  const handleSaveProduct = () => {
    // Validate required fields
    if (!editingProduct.name?.trim()) {
      alert('Product name is required');
      return;
    }

    if (showCreateModal) {
      // Create new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        category: editingProduct.category || 'HR Software',
        status: editingProduct.status || 'Active',
        price: editingProduct.price || '$0/month',
        features: editingProduct.features || [],
        usersCount: 0, // New products start with 0 users
        rating: 0, // New products start with 0 rating
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, newProduct]);
      setShowCreateModal(false);
    } else if (showEditModal && selectedProduct) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...editingProduct, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      );
      setProducts(updatedProducts);
      setShowEditModal(false);
    }
    setEditingProduct({});
    setSelectedProduct(null);
  };

  /**
   * Handles updating features for a product
   * @param newFeatures - Array of feature strings to assign to the product
   */
  const handleUpdateFeatures = (newFeatures: string[]) => {
    if (selectedProduct) {
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, features: newFeatures, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      );
      setProducts(updatedProducts);
      setShowFeaturesModal(false);
      setSelectedProduct(null);
    }
  };

  /**
   * Renders star rating display
   * @param rating - The rating value (0-5)
   * @returns JSX element with star display
   */
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return (
      <div className="flex items-center space-x-1">
        {stars}
        <span className="text-sm text-muted-foreground ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Manage Products</h1>
              <p className="text-muted-foreground">Create, edit, and manage platform products and their features</p>
            </div>
            <Button onClick={handleCreateProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Create Product
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <Badge variant={product.status === 'Active' ? 'default' : product.status === 'Beta' ? 'secondary' : 'outline'}>
                          {product.status}
                        </Badge>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{product.price}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{product.usersCount} users</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated: {product.updatedAt}</span>
                        </span>
                        <span>{product.features.length} features</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderRating(product.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleManageFeatures(product)}
                      title="Manage Features"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                      title="Edit Product"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      title="Delete Product"
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

        {/* Create/Edit Product Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{showCreateModal ? 'Create Product' : 'Edit Product'}</CardTitle>
                <CardDescription>
                  {showCreateModal ? 'Add a new product to the platform' : 'Update product information'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    placeholder="Enter product description"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={editingProduct.category || 'HR Software'}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="block w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {PRODUCT_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    placeholder="e.g., $199/month"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={editingProduct.status || 'Active'}
                    onChange={(e) => setEditingProduct({...editingProduct, status: e.target.value})}
                    className="block w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Active">Active</option>
                    <option value="Beta">Beta</option>
                    <option value="Deprecated">Deprecated</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setEditingProduct({});
                      setSelectedProduct(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProduct}>
                    {showCreateModal ? 'Create' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Manage Features Modal */}
        {showFeaturesModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Manage Features - {selectedProduct.name}</CardTitle>
                <CardDescription>Assign or remove features for this product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AVAILABLE_FEATURES.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={feature}
                        checked={selectedProduct.features.includes(feature)}
                        onChange={(e) => {
                          const newFeatures = e.target.checked
                            ? [...selectedProduct.features, feature]
                            : selectedProduct.features.filter(f => f !== feature);
                          setSelectedProduct({...selectedProduct, features: newFeatures});
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={feature} className="text-sm">{feature}</Label>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowFeaturesModal(false);
                      setSelectedProduct(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleUpdateFeatures(selectedProduct.features)}>
                    Save Features
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

export default Products; 