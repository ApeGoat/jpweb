import backImage from "../assets/back.jpg";
import {motion} from "motion/react";

export default function Conferences() {
    return (
        <main
            style={{
                width: "100%",
                height: "100vh",
                color: "white",
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    padding: "0 0 80px 80px",
                    maxWidth: "900px",
                }}
            >
                <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    style={{
                        fontSize: "3.5rem",
                        fontWeight: 300,
                        margin: 0,
                    }}
                >
                    CONFERENCES
                </motion.h1>
            </div>
        </main>
    );
}