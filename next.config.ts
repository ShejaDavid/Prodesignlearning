import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the ngrok tunnel used for local testing/sharing connect to the dev
  // server's HMR websocket (otherwise it's blocked as a cross-origin dev request).
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app"],
};

export default nextConfig;
