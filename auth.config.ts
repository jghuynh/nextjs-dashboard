import type { NextAuthConfig } from 'next-auth';

/**
 * Contains the configuration options for NextAuth.js
 */
export const authConfig = {
  pages: {
    signIn: '/login', // redirect user to our custom login page, not NextAuth's default login page
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
  // you can list many different login options
} satisfies NextAuthConfig;
