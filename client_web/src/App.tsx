import { Routes, Route } from "react-router-dom";
import TopNavBar from "./components/TopNavBar";
import SideNavBar from "./components/SideNavBar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import GuidesPage from "./pages/GuidesPage";
import TutorialsPage from "./pages/TutorialsPage";
import NewsletterPage from "./pages/NewsletterPage";
import ContentPage from "./pages/ContentPage";
import TagPage from "./pages/TagPage";

export default function App() {
  return (
    <>
      <TopNavBar />
      <div className="flex flex-1 w-full">
        <div className="hidden lg:block">
          <SideNavBar />
        </div>
        
        <div className="flex-1 flex justify-start lg:ml-12">
          <main className="w-full flex flex-col px-gutter gap-stack-lg min-w-0 pt-stack-lg pb-stack-md max-w-[800px]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/tutoriels" element={<TutorialsPage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
            <Route path="/articles/:slug" element={<ContentPage />} />
            <Route path="/guides/:slug" element={<ContentPage />} />
            <Route path="/tutoriels/:slug" element={<ContentPage />} />
            <Route path="/tags/:tag" element={<TagPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
