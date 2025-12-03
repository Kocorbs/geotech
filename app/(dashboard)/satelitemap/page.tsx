"use client";
import { SiteHeader } from "@/components/site-header";
import dynamic from "next/dynamic";

const SateliteMap = dynamic(() => import("./SateliteMap"), {
  ssr: false, // disable server-side rendering
});

export default function SateliteMapPage() {
  return (
    <main>
      <SiteHeader title="Satellite Map" />
      <section className="p-5">
        <SateliteMap />
      </section>
    </main>
  );
}
