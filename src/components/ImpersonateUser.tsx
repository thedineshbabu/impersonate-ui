import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import keycloak from '../keycloak';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { User, AlertTriangle, Loader2, X } from 'lucide-react';

const ImpersonateUser: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { isImpersonating, impersonatedUserEmail } = useAuth();

  // Pre-fill email from query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) setEmail(emailParam);
  }, [location.search]);

  const handleImpersonate = async () => {
    if (!email.trim()) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Step 1: Get the user ID for the given email
      const keycloakUrl = process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080';
      const keycloakRealm = process.env.REACT_APP_KEYCLOAK_REALM || 'kfone';
      console.log('keycloakUrl', keycloakUrl);
      console.log('keycloakRealm', keycloakRealm);
      console.log('email', email);
      console.log('keycloak.token', keycloak.token);
      const userResponse = await fetch(`${keycloakUrl}/admin/realms/${keycloakRealm}/users?username=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to find user with the provided email');
      }


      const users = await userResponse.json();

      console.log('users', users);

      if (!users || users.length === 0) {
        throw new Error('No user found with the provided email');
      }

      const userId = users[0].id;

      // Step 2: Get the impersonated user token
      const tokenResponse = await fetch(`${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: process.env.REACT_APP_IMPERSONATION_CLIENT_ID || 'pf001',
          client_secret: process.env.REACT_APP_IMPERSONATION_CLIENT_SECRET || 'GLK0c29MTMjC7T60tQDMzbFMxC9l7zr6',
          requested_subject: userId,
          grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
          subject_token: keycloak.token || '',
          subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
          requested_token_type: 'urn:ietf:params:oauth:token-type:access_token'
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to impersonate user');
      }

      const tokenData = await tokenResponse.json();

      console.log('tokenData', tokenData);

      // Step 3: Update the keycloak token with the impersonated token
      if (tokenData.access_token) {
        // Store the impersonated token
        localStorage.setItem('impersonated_token', tokenData.access_token);
        localStorage.setItem('impersonated_user_email', email);

        // Update keycloak token
        keycloak.token = tokenData.access_token;
        keycloak.refreshToken = tokenData.refresh_token;

        // Trigger token update event
        keycloak.onTokenExpired && keycloak.onTokenExpired();

        alert(`Successfully impersonating ${email}`);
        navigate('/');
      } else {
        throw new Error('No access token received from impersonation');
      }

    } catch (error) {
      console.error('Impersonation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to impersonate user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopImpersonating = () => {
    // Clear impersonated tokens
    localStorage.removeItem('impersonated_token');
    localStorage.removeItem('impersonated_user_email');

    // Refresh the page to reset keycloak state
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>User Impersonation</CardTitle>
          <CardDescription>
            Enter the email address of the user you want to impersonate
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isImpersonating && impersonatedUserEmail && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Currently Impersonating</div>
                <p>You are currently impersonating: <strong>{impersonatedUserEmail}</strong></p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handleStopImpersonating}
                >
                  Stop Impersonating
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleImpersonate(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">User Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter the user's email address"
                disabled={isLoading || !!isImpersonating}
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
              disabled={isLoading || !!isImpersonating}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Impersonating...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Impersonate User
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            This action will allow you to access the system as the specified user
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImpersonateUser;
