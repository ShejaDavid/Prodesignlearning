"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
}

const COLORS = ["#A54399", "#7C2D6B", "#10B981", "#F59E0B", "#8B5CF6"];

function Confetti() {
  const [pieces] = useState<ConfettiPiece[]>(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.5,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: piece.color, left: `${piece.x}%`, top: -10 }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{ y: "100vh", opacity: 0, rotate: 720 }}
          transition={{ duration: 2.5, delay: piece.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-lg w-full text-center">
          <CardContent className="pt-10 pb-8 space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
            >
              <CheckCircle className="h-8 w-8 text-success" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">Payment Successful!</h1>
              <p className="mt-2 text-muted-foreground">
                Your payment has been confirmed. You are now enrolled in your course.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="premium">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
