import { useEffect, useState } from "react";

const GifBackground = () => {
    const [strips, setStrips] = useState([]);

    const generateStrips = () => {
        const height = window.innerHeight;
        const stripHeight = 300;
        const count = Math.ceil(height / stripHeight);

        const gifPaths = [
            "/img.gif",
            "/img2.gif",
            "/img4.gif",
            "/img5.gif",
        ];

        const generated = Array.from({ length: count }, (_, i) => ({
            top: i * stripHeight,
            gif: gifPaths[i % gifPaths.length],
            zIndex: 999 - i,
        }));

        setStrips(generated);
    };

    useEffect(() => {
        generateStrips();
        window.addEventListener("resize", generateStrips);
        return () => {
            window.removeEventListener("resize", generateStrips);
        };
    }, []);

    return (
        <>
            {strips.map((strip, index) => (
                <div
                    key={index}
                    className="background-strip"
                    style={{
                        top: `${strip.top}px`,
                        backgroundImage: `url(${strip.gif})`,
                        zIndex: strip.zIndex,
                    }}
                ></div>
            ))}
        </>
    );
};

export default GifBackground;
