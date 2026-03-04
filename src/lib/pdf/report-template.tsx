"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { KPIData, EmissionsData } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #1E40AF",
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 15,
    borderBottom: "1px solid #E2E8F0",
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  kpiBox: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    marginRight: 10,
  },
  kpiLabel: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 5,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },
  kpiTrend: {
    fontSize: 10,
    color: "#22C55E",
    marginTop: 3,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1E40AF",
    padding: 10,
    borderRadius: 4,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottom: "1px solid #E2E8F0",
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: "#0F172A",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#94A3B8",
    borderTop: "1px solid #E2E8F0",
    paddingTop: 10,
  },
  highlight: {
    color: "#22C55E",
    fontWeight: "bold",
  },
  comparison: {
    flexDirection: "row",
    marginTop: 15,
  },
  comparisonBox: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderRadius: 8,
  },
  dieselBox: {
    backgroundColor: "#FEF2F2",
    borderLeft: "4px solid #EF4444",
  },
  electricBox: {
    backgroundColor: "#F0FDF4",
    borderLeft: "4px solid #22C55E",
  },
  comparisonLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  comparisonItem: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 5,
  },
});

interface ReportProps {
  kpiData: KPIData;
  emissionsData: EmissionsData[];
  generatedDate: string;
}

export function FeasibilityReport({
  kpiData,
  emissionsData,
  generatedDate,
}: ReportProps) {
  const totalCO2 = emissionsData.reduce((a, b) => a + b.co2Avoided, 0);
  const totalDiesel = emissionsData.reduce((a, b) => a + b.dieselEquivalent, 0);
  const totalElectric = emissionsData.reduce(
    (a, b) => a + b.electricConsumption,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>RutaMX</Text>
          <Text style={styles.subtitle}>
            Reporte de Factibilidad - Flota Eléctrica CDMX
          </Text>
          <Text style={styles.subtitle}>Generado: {generatedDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen Ejecutivo</Text>
          <View style={styles.row}>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>ROI Anual</Text>
              <Text style={styles.kpiValue}>{kpiData.roi}%</Text>
              <Text style={styles.kpiTrend}>+{kpiData.roiTrend}% vs año anterior</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Ahorro Combustible</Text>
              <Text style={styles.kpiValue}>
                ${(kpiData.fuelSavingsMXN / 1000000).toFixed(1)}M
              </Text>
              <Text style={styles.kpiTrend}>MXN anuales</Text>
            </View>
            <View style={[styles.kpiBox, { marginRight: 0 }]}>
              <Text style={styles.kpiLabel}>CO₂ Reducido</Text>
              <Text style={[styles.kpiValue, { color: "#22C55E" }]}>
                {(kpiData.co2ReductionTons / 1000).toFixed(1)}K
              </Text>
              <Text style={styles.kpiTrend}>toneladas anuales</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comparación: Diesel vs Eléctrico</Text>
          <View style={styles.comparison}>
            <View style={[styles.comparisonBox, styles.dieselBox]}>
              <Text style={[styles.comparisonLabel, { color: "#EF4444" }]}>
                Flota Diesel
              </Text>
              <Text style={styles.comparisonItem}>
                Consumo: {(totalDiesel / 1000).toFixed(0)}K litros/año
              </Text>
              <Text style={styles.comparisonItem}>
                Emisiones CO₂: {((totalCO2 * 2.5) / 1000).toFixed(1)}K ton/año
              </Text>
              <Text style={styles.comparisonItem}>
                Costo combustible: ${(totalDiesel * 24.5 / 1000000).toFixed(1)}M MXN
              </Text>
              <Text style={styles.comparisonItem}>
                Mantenimiento: Alto (motor combustión)
              </Text>
            </View>
            <View style={[styles.comparisonBox, styles.electricBox, { marginRight: 0 }]}>
              <Text style={[styles.comparisonLabel, { color: "#22C55E" }]}>
                Flota Eléctrica
              </Text>
              <Text style={styles.comparisonItem}>
                Consumo: {(totalElectric / 1000).toFixed(0)}K kWh/año
              </Text>
              <Text style={styles.comparisonItem}>
                Emisiones CO₂: {(totalCO2 * 0.3 / 1000).toFixed(1)}K ton/año
              </Text>
              <Text style={styles.comparisonItem}>
                Costo energía: ${(totalElectric * 2.5 / 1000000).toFixed(1)}M MXN
              </Text>
              <Text style={styles.comparisonItem}>
                Mantenimiento: Bajo (motor eléctrico)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emisiones Mensuales Evitadas</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Mes</Text>
              <Text style={styles.tableHeaderCell}>CO₂ Evitado (ton)</Text>
              <Text style={styles.tableHeaderCell}>Diesel Equiv. (L)</Text>
              <Text style={styles.tableHeaderCell}>Consumo Eléctrico (kWh)</Text>
            </View>
            {emissionsData.slice(0, 6).map((data, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCell}>{data.month}</Text>
                <Text style={[styles.tableCell, styles.highlight]}>
                  {data.co2Avoided.toLocaleString()}
                </Text>
                <Text style={styles.tableCell}>
                  {data.dieselEquivalent.toLocaleString()}
                </Text>
                <Text style={styles.tableCell}>
                  {data.electricConsumption.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flota Actual</Text>
          <View style={styles.row}>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Total Buses</Text>
              <Text style={styles.kpiValue}>{kpiData.totalBuses}</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Buses Activos</Text>
              <Text style={styles.kpiValue}>{kpiData.activeBuses}</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Rutas</Text>
              <Text style={styles.kpiValue}>{kpiData.totalRoutes}</Text>
            </View>
            <View style={[styles.kpiBox, { marginRight: 0 }]}>
              <Text style={styles.kpiLabel}>Utilización</Text>
              <Text style={styles.kpiValue}>{kpiData.fleetUtilization}%</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          RutaMX - Sistema de Gestión de Flota Eléctrica CDMX | Confidencial
        </Text>
      </Page>
    </Document>
  );
}
