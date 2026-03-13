"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = {
  name: string;
  email: string;
  role: User["role"];
  status: User["status"];
  password: string;
  confirmPassword: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  role: "viewer",
  status: "active",
  password: "",
  confirmPassword: "",
};

interface Props {
  user: User | null;
  isNew?: boolean;
  onClose: () => void;
  onSave: (data: User) => void;
}

export function UserDialog({ user, isNew = false, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user && !isNew) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: "",
        confirmPassword: "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setShowPassword(false);
    setShowConfirm(false);
  }, [user, isNew]);

  const set = (key: keyof FormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const passwordMismatch =
    form.password !== "" &&
    form.confirmPassword !== "" &&
    form.password !== form.confirmPassword;

  const isValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    (isNew ? form.password.trim() !== "" && !passwordMismatch : !passwordMismatch);

  const handleSave = () => {
    if (!isValid) return;
    const now = new Date().toISOString().slice(0, 10);
    onSave({
      id: user?.id ?? `u-${Date.now()}`,
      name: form.name,
      email: form.email,
      role: form.role,
      status: form.status,
      createdAt: user?.createdAt ?? now,
      lastLogin: user?.lastLogin ?? "—",
    });
  };

  const open = isNew || !!user;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "Nuevo Usuario" : "Editar Usuario"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Información personal */}
          <div>
            <p className="text-sm font-medium mb-3">Información</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-sm text-text-secondary">Nombre completo</label>
                <Input
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  placeholder="Nombre Apellido"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-text-secondary">Correo electrónico</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  placeholder="correo@rutamx.com"
                />
              </div>
            </div>
          </div>

          {/* Rol y estado */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium mb-3">Rol y Estado</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-text-secondary">Rol</label>
                <Select value={form.role} onValueChange={set("role")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="operator">Operador</SelectItem>
                    <SelectItem value="analyst">Analista</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Estado</label>
                <Select value={form.status} onValueChange={set("status")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="suspended">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contraseña */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium mb-3">
              {isNew ? "Contraseña" : "Cambiar Contraseña"}
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-text-secondary">
                  {isNew ? "Contraseña" : "Nueva Contraseña"}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password")(e.target.value)}
                    placeholder={isNew ? "Contraseña" : "Dejar vacío para no cambiar"}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Confirmar Contraseña</label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword")(e.target.value)}
                    placeholder="Repetir contraseña"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {passwordMismatch && (
                  <p className="text-xs text-accent-red mt-1">Las contraseñas no coinciden</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {isNew ? "Crear Usuario" : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
