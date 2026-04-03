import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Biography from "./pages/Biography";
import Conferences from "./pages/Conferences";
import Gallery from "./pages/Gallery";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import backImage from "./assets/back.jpg";

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
                height: "100%",
            }}
        >
            {children}
        </motion.div>
    );
}

function App() {
    const location = useLocation();

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                backgroundImage: `
                  linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2)),
                  url(${backImage})
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <Navbar />

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
                        path="/en"
                        element={
                            <PageWrapper>
                                <Home />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/biographie"
                        element={
                            <PageWrapper>
                                <Biography />
                            </PageWrapper>
                        }
                    />
                    <Route
                        path="/en/biography"
                        element={
                            <PageWrapper>
                                <Biography />
                            </PageWrapper>
                        }
                    />
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
                        path="en/gallery"
                        element={
                            <PageWrapper>
                                <Gallery />
                            </PageWrapper>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </div>
    );
}

export default App;