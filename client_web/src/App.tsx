import { Routes, Route } from "react-router-dom";
import TopNavBar from "./components/TopNavBar";
import SideNavBar from "./components/SideNavBar";
import RightWidgets from "./components/RightWidgets";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import GuidesPage from "./pages/GuidesPage";
import TutorialsPage from "./pages/TutorialsPage";
import NewsletterPage from "./pages/NewsletterPage";

export default function App() {
  return (
    <>
      <TopNavBar />
      <div className="flex flex-1 w-full max-w-[1440px] mx-auto">
        <SideNavBar />
        
        <main className="flex-1 flex flex-col px-gutter gap-stack-lg min-w-0 pt-stack-lg pb-stack-md">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/tutoriels" element={<TutorialsPage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        
        <RightWidgets />
      </div>
      <Footer />
    </>
  );
}
