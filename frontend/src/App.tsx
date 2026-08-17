import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Conferences from "./pages/Conferences";
import Gallery from "./pages/Gallery";
import Publications from "./pages/Publications";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import backImage from "./assets/back.jpg";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPublications from "./pages/admin/AdminPublications";
import AdminConferences from "./pages/admin/AdminConferences";
import AdminGallery from "./pages/admin/AdminGallery";

function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                minHeight: "100%",
            }}
        >
            {children}
        </motion.div>
    );
}

function App() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin");

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                backgroundImage: `
                  linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2)),
                  url(${backImage})
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                overflowX: "hidden",
                position: "relative",
            }}
        >
            {!isAdmin && <Navbar />}

            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <PageWrapper>
                                <Home />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/jpweb/"
                        element={
                            <PageWrapper>
                                <Home />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/en"
                        element={
                            <PageWrapper>
                                <Home />
                            </PageWrapper>
                        }
                    />
                    <Route path="/biographie" element={<Navigate to="/#biography" replace />} />
                    <Route path="/en/biography" element={<Navigate to="/en#biography" replace />} />
                    <Route
                        path="/conferences"
                        element={
                            <PageWrapper>
                                <Conferences />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/en/conferences"
                        element={
                            <PageWrapper>
                                <Conferences />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/gallerie"
                        element={
                            <PageWrapper>
                                <Gallery />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/en/gallery"
                        element={
                            <PageWrapper>
                                <Gallery />
                            </PageWrapper>
                        }
                    />
                    <Route path="/publications" element={<PageWrapper><Publications /></PageWrapper>} />
                    <Route path="/en/publications" element={<PageWrapper><Publications /></PageWrapper>} />
                    <Route path="/contact" element={<Navigate to="/#contact" replace />} />
                    <Route path="/en/contact" element={<Navigate to="/en#contact" replace />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/publications" element={<AdminPublications />} />
                    <Route path="/admin/conferences" element={<AdminConferences />} />
                    <Route path="/admin/gallery" element={<AdminGallery />} />
                </Routes>
            </AnimatePresence>
        </div>
    );
}

export default App;
