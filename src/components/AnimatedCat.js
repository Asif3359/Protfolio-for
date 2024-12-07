'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';

export default function AnimatedCat() {
    const containerRef = useRef(null);
    const controls = useAnimation();
    const { scrollY } = useScroll();
    const [greeting, setGreeting] = useState("Hi there! 😺");

    const opacity = useTransform(
        scrollY,
        [0, 200, 300],
        [1, 1, 0]
    );

    const y = useTransform(
        scrollY,
        [0, 400],
        [0, 200]
    );

    useEffect(() => {
        controls.start({ scale: 1, opacity: 1 });

        // Subscribe to scroll changes
        const unsubscribe = scrollY.onChange(latest => {
            if (latest > 100) {
                setGreeting("Bye bye! 👋");
            } else {
                setGreeting("Hi there! 😺");
            }
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, [controls, scrollY]);

    return (
        <motion.div
            ref={containerRef}
            style={{ opacity, y }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={controls}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex items-center z-0 justify-center relative"
        >
            <div className="relative">
                {/* Cat Face */}
                <motion.div 
                    className="w-64 h-64 bg-gray-300 rounded-full relative"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Eyes */}
                    <motion.div 
                        className="absolute left-1/4 top-1/3 w-8 h-8 bg-black rounded-full z-[2]"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1, 1, 0.8] }}
                        transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatDelay: 3 }}
                    />
                    <motion.div 
                        className="absolute right-1/4 top-1/3 w-8 h-8 bg-black rounded-full z-[2]"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1, 1, 0.8] }}
                        transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatDelay: 3 }}
                    />

                    {/* Nose */}
                    <motion.div 
                        className="absolute left-1/2 top-1/2 w-4 h-4 bg-pink-300 rounded-full -translate-x-1/2 z-[2]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 }}
                    />

                    {/* Mouth */}
                    <motion.div 
                        className="absolute left-1/2 top-[60%] w-8 h-4 -translate-x-1/2 z-[2]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <motion.div 
                            className="w-full h-full border-b-2 border-black rounded-b-full"
                            animate={{ scaleY: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                        />
                    </motion.div>

                    {/* Ears */}
                    <motion.div 
                        className="absolute -top-8 left-8 w-16 h-16 bg-gray-300 rounded-tr-3xl rotate-45 z-[1]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                    />
                    <motion.div 
                        className="absolute -top-8 right-8 w-16 h-16 bg-gray-300 rounded-tl-3xl -rotate-45 z-[1]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                    />
                </motion.div>

                {/* Speech Bubble */}
                <motion.div
                    className="absolute -top-16 -right-32 bg-white px-6 py-3 rounded-xl shadow-lg z-[5]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="text-xl font-bold text-gray-800"
                    >
                        {greeting}
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
} 