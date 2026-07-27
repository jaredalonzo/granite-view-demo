import { ReactNode, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import LandingPage from "./pages/LandingPage.tsx";
import RegulatedDocs from "./pages/RegulatedDocs.tsx";
import Page from "./pages/Page.tsx";
import { AppContextComponent } from "./context/AppContext.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Loader from "./components/Loader.tsx";
import { SiteProvider } from "./context/SiteContext.tsx";
import { defaultSite, resolveLockedSite } from "./sites";

const queryClient = new QueryClient();

// Set the theme before first paint (no flash on locked per-site builds).
document.documentElement.dataset.site = (resolveLockedSite() ?? defaultSite).key;

const route = (element: ReactNode) => (
  <QueryClientProvider client={queryClient}>
    <Suspense
      fallback={
        <div className="flex w-screen h-screen justify-center">
          <Loader />
        </div>
      }
    >
      <AppContextComponent>{element}</AppContextComponent>
    </Suspense>
  </QueryClientProvider>
);

const router = createBrowserRouter([
  { path: "/", element: route(<LandingPage />) },
  { path: "/regulated-docs", element: route(<RegulatedDocs />) },
  { path: "/:slug", element: route(<Page />) },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SiteProvider>
      <RouterProvider router={router} />
    </SiteProvider>
  </StrictMode>,
);
