"use client";

import dynamic from "next/dynamic";
import { useNearViewport } from "@/lib/useNearViewport";

// mapbox-gl is large, and the map sits far down the page: its code and the
// map itself load only once the visitor scrolls close to it.
const DestinationMap = dynamic(() => import("./DestinationMap"), { ssr: false });

type Props = React.ComponentProps<typeof DestinationMap>;

export default function LazyDestinationMap(props: Props) {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  if (near) return <DestinationMap {...props} />;
  return <div ref={ref} className={props.className} aria-hidden="true" />;
}
