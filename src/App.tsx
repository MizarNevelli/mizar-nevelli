import {
  ScrollRestoration,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { Nav } from "./components/Nav";
import { HomePage } from "./pages/Home/HomePage";
import { AboutPage } from "./pages/About/AboutPage";
import { EventLoopPage } from "./pages/EventLoop/EventLoopPage";
import { EventBubblingPage } from "./pages/EventBubbling/EventBubblingPage";
import { ClosuresPage } from "./pages/Closures/ClosuresPage";
import { ContactPage } from "./pages/Contact/ContactPage";
import { BlogListPage } from "./pages/Blog/BlogListPage";
import { BlogPostPage } from "./pages/Blog/BlogPostPage";

function Layout() {
  return (
    <div className="relative min-h-[100dvh]">
      <ScrollRestoration />
      <Nav />
      <Outlet />
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
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
