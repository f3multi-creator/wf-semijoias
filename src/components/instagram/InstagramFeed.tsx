"use client";

import { useEffect } from "react";
import Script from "next/script";

interface InstagramFeedProps {
    username?: string;
}

/**
 * Componente de Feed do Instagram usando Elfsight
 * 
 * Widget configurado em: https://elfsight.com
 * App ID: ccd53866-10f9-41de-a5fc-068f07721cd7
 */
export function InstagramFeed({ username = "wfsemijoias" }: InstagramFeedProps) {
    return (
        <section className="section bg-cream">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="font-display text-3xl md:text-4xl text-dark mb-3">
                        @{username}
                    </h2>
                    <p className="text-taupe">Siga-nos no Instagram e inspire-se</p>
                </div>

                {/* Elfsight Instagram Feed Widget */}
                <Script
                    src="https://static.elfsight.com/platform/platform.js"
                    strategy="lazyOnload"
                />
                <div
                    className="elfsight-app-ccd53866-10f9-41de-a5fc-068f07721cd7"
                    data-elfsight-app-lazy
                />

                <div className="text-center mt-8">
                    <a
                        href={`https://instagram.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                    >
                        Seguir no Instagram
                    </a>
                </div>
            </div>
        </section>
    );
}

