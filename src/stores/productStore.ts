import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { productsApi, ApiError } from '../services/api';

/**
 * Product interface
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  status: string;
  version: string;
  features: string[];
  specifications: Record<string, any>;
  clientId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product management state interface
 */
export interface ProductState {
  // Data
  products: Product[];
  selectedProduct: Product | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    category?: string; 
    clientId?: string 
  }) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  selectProduct: (productId: string) => void;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  fetchProductFeatures: (productId: string) => Promise<void>;
  fetchProductSpecifications: (productId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Zustand store for product management
 * Handles all product-related state and operations with API integration
 */
export const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      // Initial state
      products: [],
      selectedProduct: null,
      isLoading: false,
      error: null,

      /**
       * Fetch all products from API
       */
      fetchProducts: async (params) => {
        try {
          set({ isLoading: true, error: null });
          const response = await productsApi.getAll(params);
          set({ products: response.data, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch products';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch a specific product by ID
       */
      fetchProductById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const product = await productsApi.getById(id);
          set({ selectedProduct: product, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch product';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Select a product by ID
       */
      selectProduct: (productId: string) => {
        const product = get().products.find(p => p.id === productId) || null;
        set({ selectedProduct: product });
      },

      /**
       * Create a new product
       */
      createProduct: async (productData) => {
        try {
          set({ isLoading: true, error: null });
          const newProduct = await productsApi.create(productData);
          set(state => ({
            products: [...state.products, newProduct],
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to create product';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Update an existing product
       */
      updateProduct: async (productId: string, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedProduct = await productsApi.update(productId, updates);
          set(state => ({
            products: state.products.map(product =>
              product.id === productId ? updatedProduct : product
            ),
            selectedProduct: state.selectedProduct?.id === productId 
              ? updatedProduct
              : state.selectedProduct,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to update product';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Delete a product
       */
      deleteProduct: async (productId: string) => {
        try {
          set({ isLoading: true, error: null });
          await productsApi.delete(productId);
          set(state => ({
            products: state.products.filter(product => product.id !== productId),
            selectedProduct: state.selectedProduct?.id === productId ? null : state.selectedProduct,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete product';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch product features
       */
      fetchProductFeatures: async (productId: string) => {
        try {
          set({ isLoading: true, error: null });
          const features = await productsApi.getFeatures(productId);
          set(state => ({
            selectedProduct: state.selectedProduct?.id === productId
              ? { ...state.selectedProduct, features }
              : state.selectedProduct,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch product features';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch product specifications
       */
      fetchProductSpecifications: async (productId: string) => {
        try {
          set({ isLoading: true, error: null });
          const specifications = await productsApi.getSpecifications(productId);
          set(state => ({
            selectedProduct: state.selectedProduct?.id === productId
              ? { ...state.selectedProduct, specifications }
              : state.selectedProduct,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch product specifications';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Set loading state
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * Set error state
       */
      setError: (error: string | null) => {
        set({ error });
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'product-store',
    }
  )
);

/**
 * Hook to get products by client
 */
export const useProductsByClient = (clientId: string) => {
  const { products } = useProductStore();
  return products.filter(product => product.clientId === clientId);
};

/**
 * Hook to get products by category
 */
export const useProductsByCategory = (category: string) => {
  const { products } = useProductStore();
  return products.filter(product => product.category === category);
};

/**
 * Hook to get products by type
 */
export const useProductsByType = (type: string) => {
  const { products } = useProductStore();
  return products.filter(product => product.type === type);
}; 