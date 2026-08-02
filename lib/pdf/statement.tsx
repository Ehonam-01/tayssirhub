import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PDF_METHOD_LABELS, formatPdfAmount, formatPdfDate } from "@/lib/pdf/shared";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#0F172A" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#B8923E",
    paddingBottom: 12,
  },
  agencyName: { fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 20, fontWeight: "bold" },
  subtitle: { fontSize: 10, color: "#64748B", marginTop: 4 },
  section: { marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#64748B" },
  value: { fontWeight: "bold" },
  table: { marginTop: 16 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F2F5",
  },
  colDate: { width: "20%" },
  colDesc: { width: "35%" },
  colMethod: { width: "25%" },
  colAmount: { width: "20%", textAlign: "right" },
  thText: { fontSize: 9, color: "#64748B" },
  emptyText: { color: "#94A3B8", marginTop: 8 },
  summaryBox: { marginTop: 24, padding: 16, backgroundColor: "#F5F6F8", borderRadius: 8 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  summaryLabel: { color: "#64748B" },
  summaryValue: { fontWeight: "bold" },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  balanceLabel: { fontSize: 12, fontWeight: "bold" },
  balanceValue: { fontSize: 14, fontWeight: "bold", color: "#B8923E" },
});

export interface StatementPayment {
  paidAt: string;
  method: string | null;
  receiptNumber: string | null;
  amount: number;
}

export interface StatementData {
  agencyName: string;
  pilgrimName: string;
  campaignName: string | null;
  currency: string;
  totalDue: number | null;
  payments: StatementPayment[];
  generatedAt: string;
}

export function StatementDocument({ data }: { data: StatementData }) {
  const totalPaid = data.payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = data.totalDue !== null ? data.totalDue - totalPaid : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.agencyName}>{data.agencyName}</Text>
          <View>
            <Text style={styles.title}>Relevé de compte</Text>
            <Text style={styles.subtitle}>{formatPdfDate(data.generatedAt)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Pèlerin</Text>
            <Text style={styles.value}>{data.pilgrimName}</Text>
          </View>
          {data.campaignName && (
            <View style={styles.row}>
              <Text style={styles.label}>Campagne</Text>
              <Text style={styles.value}>{data.campaignName}</Text>
            </View>
          )}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDate, styles.thText]}>Date</Text>
            <Text style={[styles.colDesc, styles.thText]}>Reçu</Text>
            <Text style={[styles.colMethod, styles.thText]}>Méthode</Text>
            <Text style={[styles.colAmount, styles.thText]}>Montant</Text>
          </View>
          {data.payments.length === 0 && (
            <Text style={styles.emptyText}>Aucun paiement enregistré.</Text>
          )}
          {data.payments.map((p, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDate}>{formatPdfDate(p.paidAt)}</Text>
              <Text style={styles.colDesc}>{p.receiptNumber ?? "—"}</Text>
              <Text style={styles.colMethod}>
                {p.method ? (PDF_METHOD_LABELS[p.method] ?? p.method) : "—"}
              </Text>
              <Text style={styles.colAmount}>{formatPdfAmount(p.amount, data.currency)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Prix total</Text>
            <Text style={styles.summaryValue}>
              {data.totalDue !== null ? formatPdfAmount(data.totalDue, data.currency) : "Non défini"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total payé</Text>
            <Text style={styles.summaryValue}>{formatPdfAmount(totalPaid, data.currency)}</Text>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Reliquat</Text>
            <Text style={styles.balanceValue}>
              {balance !== null ? formatPdfAmount(balance, data.currency) : "—"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
