"use client";

import { useState, useRef } from "react";
import { Camera, Save, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = [
  { value: "ceo", label: "CEO — Director Ejecutivo" },
  { value: "cmo", label: "CMO — Director de Marketing" },
  { value: "cfo", label: "CFO — Director Financiero" },
  { value: "cto", label: "CTO — Director de Tecnología" },
  { value: "coo", label: "COO — Director de Operaciones" },
  { value: "operations_manager", label: "Gerente de Operaciones" },
  { value: "analyst", label: "Analista" },
  { value: "planner", label: "Planificador de Rutas" },
];

export default function ConfiguracionPage() {
  const [name, setName] = useState("Usuario");
  const [email, setEmail] = useState("usuario@rutamx.com");
  const [role, setRole] = useState("");
  const [avatarSrc, setAvatarSrc] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">Configuración</h1>
        <p className="text-xs text-text-secondary">Administra tu perfil y preferencias de cuenta</p>
      </div>

      {/* Profile Picture */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="h-4 w-4 text-primary-light" />
            Foto de Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarSrc} alt={name} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-white shadow hover:opacity-90 transition-opacity"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-text-secondary">{email}</p>
            {role && (
              <p className="text-xs text-primary-light">
                {ROLES.find((r) => r.value === role)?.label.split(" — ")[0]}
              </p>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-text-secondary hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Cambiar foto
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Información de Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Nombre completo</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Correo electrónico</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Role */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Rol en la Organización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Puesto</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          {saved ? "¡Guardado!" : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
