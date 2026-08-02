import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PDF_METHOD_LABELS, formatPdfAmount, formatPdfDate } from "@/lib/pdf/shared";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#0F172A" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#B8923E",
    paddingBottom: 12,
  },
  agencyName: { fontSize: 16, fontWeight: "bold" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  receiptNumber: { fontSize: 10, color: "#64748B" },
  section: { marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { color: "#64748B" },
  value: { fontWeight: "bold" },
  amountBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#F5F6F8",
    borderRadius: 8,
    alignItems: "center",
  },
  amountLabel: { color: "#64748B", marginBottom: 4 },
  amount: { fontSize: 24, fontWeight: "bold" },
  footer: { marginTop: 40, fontSize: 9, color: "#94A3B8", textAlign: "center" },
});

export interface ReceiptData {
  agencyName: string;
  receiptNumber: string;
  pilgrimName: string;
  campaignName: string | null;
  amount: number;
  currency: string;
  method: string;
  paidAt: string;
  reference: string | null;
}

export function ReceiptDocument({ data }: { data: ReceiptData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.agencyName}>{data.agencyName}</Text>
          <View>
            <Text style={styles.title}>Reçu</Text>
            <Text style={styles.receiptNumber}>{data.receiptNumber}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Reçu de</Text>
            <Text style={styles.value}>{data.pilgrimName}</Text>
          </View>
          {data.campaignName && (
            <View style={styles.row}>
              <Text style={styles.label}>Campagne</Text>
              <Text style={styles.value}>{data.campaignName}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formatPdfDate(data.paidAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mode de paiement</Text>
            <Text style={styles.value}>{PDF_METHOD_LABELS[data.method] ?? data.method}</Text>
          </View>
          {data.reference && (
            <View style={styles.row}>
              <Text style={styles.label}>Référence</Text>
              <Text style={styles.value}>{data.reference}</Text>
            </View>
          )}
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Montant reçu</Text>
          <Text style={styles.amount}>{formatPdfAmount(data.amount, data.currency)}</Text>
        </View>

        <Text style={styles.footer}>
          Ce reçu atteste de la réception du montant indiqué ci-dessus par {data.agencyName}.
        </Text>
      </Page>
    </Document>
  );
}
