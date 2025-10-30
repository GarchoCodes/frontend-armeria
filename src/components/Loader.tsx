import { useEffect, useState } from "react";
import Login from "../pages/Login"; // ← importa tu componente de login
import { motion } from "framer-motion";

export default function Loader() {
    const [progress, setProgress] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let intervalo: number;

        if (cargando) {
            intervalo = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(intervalo);
                        setTimeout(() => setCargando(false), 1000); // espera 1 segundo tras llegar al 100%
                        return 100;
                    }
                    return prev + 4; // sube cada 100ms → total ~2.5s
                });
            }, 100);
        }

        return () => clearInterval(intervalo);
    }, [cargando]);

    if (!cargando) return <Login />;

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-900 text-white">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl font-bold mb-10 text-indigo-400"
            >
                Cargando Armería ⚙️
            </motion.h1>

            <progress
                className="progress progress-primary w-80 bg-zinc-800 h-4 rounded-full"
                value={progress}
                max="100"
            ></progress>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-lg text-zinc-400"
            >
                {progress}%
            </motion.p>
        </div>
    );
}
