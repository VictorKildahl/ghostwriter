"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { type ReactNode, useMemo } from "react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

let cachedClient: ConvexReactClient | null = null;

function getConvexClient() {
  if (!cachedClient) {
    cachedClient = new ConvexReactClient(CONVEX_URL);
  }
  return cachedClient;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => getConvexClient(), []);
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
