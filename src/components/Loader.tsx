import { useEffect, useState } from "react";

export default function Loader() {
    const [progreso, setProgreso] = useState(0);

    useEffect(() => {
        const duracion = 2500; // 2.5 segundos
        const pasos = 100;
        const intervalo = duracion / pasos;

        const timer = setInterval(() => {
            setProgreso((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 1;
            });
        }, intervalo);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-3 p-6">
            <p className="text-white text-lg font-medium">{progreso}%</p>
            <progress
                className="progress progress-primary w-56"
                value={progreso}
                max="100"
            ></progress>
        </div>
    );
}
