import { Layout } from "@/components/Layout";
import { Admin } from "@/pages/Admin";
import { Home } from "@/pages/Home";
import { Reminder } from "@/pages/Reminder";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/administracion",
  component: Admin,
});

const reminderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recordatorio",
  component: Reminder,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  reminderRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
