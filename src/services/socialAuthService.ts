
/**
 * Service dedicated to handling social authentication methods
 */

// Get backend URL from environment or use default
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';

/**
 * Initiates Google OAuth login flow
 * Redirects the user to Google's authentication page
 */
export const initiateGoogleLogin = (): void => {
  try {
    console.log('🔄 [SOCIAL-AUTH] Starting Google authentication flow');
    
    // Store the current URL for redirection after authentication
    const redirectUrl = window.location.origin + '/redirect';
    localStorage.setItem('auth_redirect_url', redirectUrl);
    
    // Build Google auth URL
    const authUrl = `${backendUrl}/api/auth/google`;
    console.log(`🔄 [SOCIAL-AUTH] Redirecting to Google authentication: ${authUrl}`);
    
    // Redirect to Google auth
    window.location.href = authUrl;
  } catch (error) {
    console.error('❌ [SOCIAL-AUTH] Error initiating Google login:', error);
    throw error;
  }
};

/**
 * Initiates Facebook OAuth login flow
 * Redirects the user to Facebook's authentication page
 */
export const initiateFacebookLogin = (): void => {
  try {
    console.log('🔄 [SOCIAL-AUTH] Starting Facebook authentication flow');
    
    // Store the current URL for redirection after authentication
    const redirectUrl = window.location.origin + '/redirect';
    localStorage.setItem('auth_redirect_url', redirectUrl);
    
    // Build Facebook auth URL
    const authUrl = `${backendUrl}/api/auth/facebook`;
    console.log(`🔄 [SOCIAL-AUTH] Redirecting to Facebook authentication: ${authUrl}`);
    
    // Redirect to Facebook auth
    window.location.href = authUrl;
  } catch (error) {
    console.error('❌ [SOCIAL-AUTH] Error initiating Facebook login:', error);
    throw error;
  }
};

/**
 * Processes social authentication tokens received after OAuth flow
 * @param token The authentication token
 * @returns Whether the token was successfully processed
 */
export const processSocialAuthToken = (token: string): boolean => {
  try {
    console.log('🔄 [SOCIAL-AUTH] Processing social auth token');
    
    if (!token) {
      console.error('❌ [SOCIAL-AUTH] No token provided');
      return false;
    }
    
    // Store the token in localStorage
    localStorage.setItem('token', token);
    console.log('✅ [SOCIAL-AUTH] Token stored successfully');
    
    return true;
  } catch (error) {
    console.error('❌ [SOCIAL-AUTH] Error processing token:', error);
    return false;
  }
};
