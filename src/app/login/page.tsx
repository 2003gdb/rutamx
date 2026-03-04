"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bus } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-xl font-bold">
            <Bus className="h-6 w-6 text-primary" />
            <span className="text-foreground">
              Ruta<span className="text-primary">MX</span>
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm text-text-secondary"
            >
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm text-text-secondary"
            >
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
            />
          </div>
          <Button type="button" className="w-full">
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
