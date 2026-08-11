import {
  ScrollRestoration,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { Nav } from "./components/Nav";
import { HomePage } from "./pages/Home/HomePage";
import { AboutPage } from "./pages/About/AboutPage";
import { ContactPage } from "./pages/Contact/ContactPage";
import { BlogListPage } from "./pages/Blog/BlogListPage";
import { BlogPostPage } from "./pages/Blog/BlogPostPage";
import { NomadTaxCalculatorPage } from "./pages/NomadTaxCalculator/NomadTaxCalculatorPage";

// Lazy, visualizer pages are heavy and rarely the landing page.
const EventLoopPage = lazy(() =>
  import("./pages/EventLoop/EventLoopPage").then((m) => ({
    default: m.EventLoopPage,
  }))
);
const EventBubblingPage = lazy(() =>
  import("./pages/EventBubbling/EventBubblingPage").then((m) => ({
    default: m.EventBubblingPage,
  }))
);
const ClosuresPage = lazy(() =>
  import("./pages/Closures/ClosuresPage").then((m) => ({
    default: m.ClosuresPage,
  }))
);
const SpaceScene = lazy(() =>
  import("./components/SpaceScene").then((m) => ({ default: m.SpaceScene }))
);

const SPACE_ROUTES = new Set(["/", "/about", "/contact"]);

function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="relative min-h-[100dvh]">
      <ScrollRestoration />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          visibility: SPACE_ROUTES.has(pathname) ? "visible" : "hidden",
        }}
      >
        <Suspense fallback={null}>
          <SpaceScene />
        </Suspense>
      </div>
      <Nav />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/event-loop" element={<EventLoopPage />} />
      <Route path="/event-bubbling" element={<EventBubblingPage />} />
      <Route path="/closures" element={<ClosuresPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/nomad-tax" element={<NomadTaxCalculatorPage />} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
