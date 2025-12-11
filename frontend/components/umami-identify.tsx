"use client";

import { useEffect } from "react";
import { identifyUser } from "@/lib/umami";

interface UmamiIdentifyProps {
  profileId: string;
  firstName?: string;
  properties?: Record<string, unknown>;
}

export function UmamiIdentify({
  profileId,
  firstName,
  properties,
}: UmamiIdentifyProps) {
  useEffect(() => {
    // Identify user session with Umami using Distinct ID
    identifyUser(profileId, {
      name: firstName,
      ...properties,
    });
  }, [profileId, firstName, properties]);

  return null;
}
