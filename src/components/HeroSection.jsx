'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedCat from "./AnimatedCat";

const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function HeroSection({ userData }) {
    const truncatedBio = userData?.bio && userData.bio.length > 70
        ? userData.bio.slice(0, 70) + '...'
        : userData?.bio;

    return (
        <section className="py-20 bg-base-200 mt-10  min-h-screen flex items-center justify-center ">
            <div className="max-w-6xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left side - Content */}
                    <div className="space-y-6 order-2 md:order-1">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.3
                                    }
                                }
                            }}
                            className="space-y-6"
                        >
                            <motion.h1
                                variants={titleVariants}
                                className="text-4xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                            >
                                Hi, I'm {userData?.name || 'Your Name'}
                            </motion.h1>

                            <motion.p
                                variants={titleVariants}
                                className="text-xl md:text-2xl opacity-80"
                            >
                                {userData?.role || 'Your Role'}
                            </motion.p>

                            <motion.div
                                variants={titleVariants}
                                className="space-y-2"
                            >
                                <p className="text-lg opacity-60">
                                    {truncatedBio || 'Loading bio...'}
                                    <span>
                                        {userData?.bio && userData.bio.length > 70 && (
                                            <Link
                                                href="/about"
                                                className="text-primary hover:text-primary-focus transition-colors inline-flex items-center gap-1"
                                            >
                                                See More
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                                </svg>
                                            </Link>
                                        )}
                                    </span>
                                </p>

                            </motion.div>

                            <motion.div
                                variants={titleVariants}
                                className="flex gap-4 flex-wrap pt-4"
                            >
                                {userData?.socialLinks?.github && (
                                    <a
                                        href={userData?.socialLinks?.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline btn-sm btn-primary hover:scale-105 transform transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                        </svg>
                                        GitHub
                                    </a>
                                )}
                                {userData?.socialLinks?.linkedin && (
                                    <a
                                        href={userData?.socialLinks?.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline btn-sm btn-primary hover:scale-105 transform transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                                        </svg>
                                        LinkedIn
                                    </a>
                                )}
                                {userData?.socialLinks?.facebook && (
                                    <a
                                        href={userData?.socialLinks?.facebook}
                                        className="btn btn-outline btn-sm btn-primary hover:scale-105 transform transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                        </svg>
                                        Facebook
                                    </a>
                                )}
                                {userData?.contact?.email && (
                                    <a
                                        href={`mailto:${userData?.contact?.email}`}
                                        className="btn btn-sm btn-primary hover:scale-105 transform transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                                        </svg>
                                        Contact
                                    </a>
                                )}

                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="pt-8"
                        >
                            <a
                                href="#projects"
                                className="btn btn-circle btn-outline animate-bounce"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
                                </svg>
                            </a>
                        </motion.div>
                    </div>

                    {/* Right side - Cat Animation */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center md:justify-end order-1 md:order-2"
                    >
                        <div className="relative w-full max-w-[500px] aspect-square">
                            <AnimatedCat />
                            {/* Decorative circles */}
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-xl animate-pulse delay-300" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
} 