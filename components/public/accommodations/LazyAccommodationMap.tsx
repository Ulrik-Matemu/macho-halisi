"use client";

import dynamic from "next/dynamic";
import { useNearViewport } from "@/lib/useNearViewport";

// See LazyDestinationMap: the map loads only when scrolled near.
const AccommodationMap = dynamic(() => import("./AccommodationMap"), { ssr: false });

type Props = React.ComponentProps<typeof AccommodationMap>;

export default function LazyAccommodationMap(props: Props) {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  if (near) return <AccommodationMap {...props} />;
  return (
    <div
      ref={ref}
      className={props.className ?? "w-full h-[360px] rounded-lg overflow-hidden border border-white/10"}
      aria-hidden="true"
    />
  );
}
