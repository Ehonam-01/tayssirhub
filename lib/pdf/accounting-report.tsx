import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPdfDate } from "@/lib/pdf/shared";
import { formatGroupedMoney } from "@/lib/format";
import type { CampaignBreakdown, CurrencyTotal } from "@/lib/accounting";

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
  summaryBox: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#F5F6F8",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: { color: "#64748B", marginBottom: 4 },
  summaryValue: { fontSize: 13, fontWeight: "bold" },
  table: { marginTop: 8 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F2F5",
  },
  colCampaign: { width: "40%" },
  colAmount: { width: "20%", textAlign: "right" },
  thText: { fontSize: 9, color: "#64748B" },
  emptyText: { color: "#94A3B8", marginTop: 8 },
});

export interface AccountingReportData {
  agencyName: string;
  generatedAt: string;
  revenueTotals: CurrencyTotal[];
  expenseTotals: CurrencyTotal[];
  marginTotals: CurrencyTotal[];
  breakdowns: CampaignBreakdown[];
  campaignNames: Record<string, string>;
}

export function AccountingReportDocument({ data }: { data: AccountingReportData }) {
  const sorted = [...data.breakdowns].sort((a, b) => {
    if (a.campaignId === null) return 1;
    if (b.campaignId === null) return -1;
    return (data.campaignNames[a.campaignId] ?? "").localeCompare(data.campaignNames[b.campaignId] ?? "");
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.agencyName}>{data.agencyName}</Text>
          <View>
            <Text style={styles.title}>Rapport comptable</Text>
            <Text style={styles.subtitle}>{formatPdfDate(data.generatedAt)}</Text>
          </View>
        </View>

        <View style={styles.summaryBox}>
          <View>
            <Text style={styles.summaryLabel}>Recettes</Text>
            <Text style={styles.summaryValue}>{formatGroupedMoney(data.revenueTotals)}</Text>
          </View>
          <View>
            <Text style={styles.summaryLabel}>Dépenses</Text>
            <Text style={styles.summaryValue}>{formatGroupedMoney(data.expenseTotals)}</Text>
          </View>
          <View>
            <Text style={styles.summaryLabel}>Marge</Text>
            <Text style={styles.summaryValue}>{formatGroupedMoney(data.marginTotals)}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colCampaign, styles.thText]}>Campagne</Text>
            <Text style={[styles.colAmount, styles.thText]}>Recettes</Text>
            <Text style={[styles.colAmount, styles.thText]}>Dépenses</Text>
            <Text style={[styles.colAmount, styles.thText]}>Marge</Text>
          </View>
          {sorted.length === 0 && <Text style={styles.emptyText}>Aucune donnée comptable.</Text>}
          {sorted.map((breakdown) => (
            <View key={breakdown.campaignId ?? "general"} style={styles.tableRow}>
              <Text style={styles.colCampaign}>
                {breakdown.campaignId
                  ? (data.campaignNames[breakdown.campaignId] ?? "Campagne")
                  : "Dépenses générales"}
              </Text>
              <Text style={styles.colAmount}>{formatGroupedMoney(breakdown.revenue)}</Text>
              <Text style={styles.colAmount}>{formatGroupedMoney(breakdown.expenses)}</Text>
              <Text style={styles.colAmount}>{formatGroupedMoney(breakdown.margin)}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
