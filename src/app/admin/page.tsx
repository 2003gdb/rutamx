"use client";

import { useState } from "react";
import {
  Users,
  Bus,
  Plus,
  Download,
  MoreHorizontal,
  Pencil,
  Trash2,
  Ban,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { MOCK_USERS } from "@/constants/mock-data";
import { BUS_MODELS } from "@/constants/bus-models";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { User, ElectricBusModel } from "@/types";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchUsers, setSearchUsers] = useState("");
  const [searchBuses, setSearchBuses] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const filteredBuses = BUS_MODELS.filter(
    (bus) =>
      bus.modelName.toLowerCase().includes(searchBuses.toLowerCase()) ||
      bus.manufacturer.toLowerCase().includes(searchBuses.toLowerCase())
  );

  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "suspended" : "active",
            }
          : user
      )
    );
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Role", "Status", "Created At"];
    const rows = users.map((user) => [
      user.id,
      user.name,
      user.email,
      user.role,
      user.status,
      user.createdAt,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      admin: "default",
      operator: "secondary",
      analyst: "secondary",
      viewer: "outline",
    };
    return <Badge variant={variants[role]}>{role}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="success">Activo</Badge>
    ) : (
      <Badge variant="destructive">Suspendido</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-text-secondary">
          Gestión de usuarios y catálogo de buses
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="buses" className="gap-2">
            <Bus className="h-4 w-4" />
            Catálogo de Buses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Buscar usuarios..."
              value={searchUsers}
              onChange={(e) => setSearchUsers(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV} className="gap-2">
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Usuario
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleUserStatus(user.id)}
                          >
                            {user.status === "active" ? (
                              <Ban className="h-4 w-4 text-accent-red" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-accent-green" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-accent-red" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buses" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Buscar buses..."
              value={searchBuses}
              onChange={(e) => setSearchBuses(e.target.value)}
              className="max-w-sm"
            />
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Modelo
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBuses.map((bus) => (
              <Card key={bus.id} className="card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {bus.manufacturer} {bus.modelName}
                      </CardTitle>
                      <p className="text-sm text-text-secondary">
                        ID: {bus.id}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-surface-light rounded-lg mb-4 flex items-center justify-center">
                    <Bus className="h-12 w-12 text-text-muted" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-text-secondary">Rango</p>
                      <p className="font-medium">{bus.rangeKm} km</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Batería</p>
                      <p className="font-medium">{bus.batteryCapacityKwh} kWh</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Capacidad</p>
                      <p className="font-medium">{bus.passengerCapacity} pas.</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Carga</p>
                      <p className="font-medium">{bus.chargingTimeHours}h</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Consumo</p>
                      <p className="font-medium">
                        {bus.energyConsumptionKwhPerKm} kWh/km
                      </p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Garantía</p>
                      <p className="font-medium">{bus.warrantyYears} años</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-text-secondary">
                          Costo Unitario
                        </p>
                        <p className="font-bold text-primary-light">
                          ${formatNumber(bus.unitCostUsd)} USD
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-secondary">Mantto/km</p>
                        <p className="font-medium">
                          ${bus.maintenanceCostPerKm}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Pencil className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-accent-red hover:text-accent-red"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-text-secondary">Nombre</label>
                <Input defaultValue={selectedUser.name} />
              </div>
              <div>
                <label className="text-sm text-text-secondary">Email</label>
                <Input defaultValue={selectedUser.email} />
              </div>
              <div>
                <label className="text-sm text-text-secondary">Rol</label>
                <Input defaultValue={selectedUser.role} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Cancelar
              </Button>
              <Button onClick={() => setSelectedUser(null)}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
