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
                Cargando Armería <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5" /></svg>
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
