import React, { useState } from 'react';
import { useAuthStore } from './stores/authStore';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Alert, AlertDescription } from './components/ui/alert';
import { Loader2, LogIn, X } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email);
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#e5f4ee"/>
              <path d="M24 14a6 6 0 1 1 0 12a6 6 0 0 1 0-12zm0 16c-5.33 0-12 2.67-12 8v2h24v-2c0-5.33-6.67-8-12-8z" fill="#009872"/>
              <path d="M32 24v-2a8 8 0 1 0-16 0v2" stroke="#009872" strokeWidth="2" strokeLinecap="round"/>
              <path d="M28 28l4 4-4 4" stroke="#009872" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 32H20" stroke="#009872" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <CardTitle>Sign in to Korn Ferry Talent</CardTitle>
          <CardDescription>Access your Korn Ferry Talent dashboard</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help? <a href="#" className="text-primary hover:underline">Contact support</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
