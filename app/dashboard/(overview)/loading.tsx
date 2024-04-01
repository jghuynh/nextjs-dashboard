/**
 * This file is in a route group, which helps me organize files into groups without affecting
 * URL path structure.
 * loading.tsx shall apply to only my dashboard overview page
 *
 * However, you can also use route groups to separate your application into sections
 * (e.g. (marketing) routes and (shop) routes) or by teams for larger applications.
 */
import DashboardSkeleton from '@/app/ui/skeletons';
/**
 * Streams a whole page
 * Shows a fallback UI loading screen while page loads content;
 * Built on top of Suspense
 * <SideBar /> is statically rendered: users can see it immediately
 * User does not need to wait for page to finish loading before navigating away
 * @returns
 */
export default function Loading() {
  //   return <div>Loading...</div>;
  // the dashboard skeleton you see while page is loading
  return <DashboardSkeleton />;
}
