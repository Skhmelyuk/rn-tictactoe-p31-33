import { useGame } from "@/context/GameContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function StatisticsScreen() {
  // Отримуємо реальні дані та функцію очищення з контексту
  const { stats, resetStats } = useGame();

  const handleResetStats = () => {
    resetStats();
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Статистика ігор</Text>

      <View style={styles.grid}>
        {/* Картка 1: Загальна кількість */}
        <View style={[styles.card, styles.cardTotal]}>
          <MaterialIcons name="videogame-asset" size={32} color="#4b5563" />
          <Text style={styles.cardNumber}>{stats.totalGames}</Text>
          <Text style={styles.cardLabel}>Зіграно партій</Text>
        </View>

        {/* Картка 2: Перемоги X */}
        <View style={[styles.card, styles.cardX]}>
          <Text style={styles.playerBadgeX}>X</Text>
          <Text style={styles.cardNumber}>{stats.winsX}</Text>
          <Text style={styles.cardLabel}>Перемог X</Text>
        </View>

        {/* Картка 3: Перемоги O */}
        <View style={[styles.card, styles.cardO]}>
          <Text style={styles.playerBadgeO}>O</Text>
          <Text style={styles.cardNumber}>{stats.winsO}</Text>
          <Text style={styles.cardLabel}>Перемог O</Text>
        </View>

        {/* Картка 4: Нічиї */}
        <View style={[styles.card, styles.cardDraw]}>
          <MaterialIcons name="handshake" size={32} color="#f59e0b" />
          <Text style={styles.cardNumber}>{stats.draws}</Text>
          <Text style={styles.cardLabel}>Нічиїх</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetStats}
        activeOpacity={0.8}
      >
        <MaterialIcons name="delete-outline" size={20} color="#ffffff" />
        <Text style={styles.resetText}>Очистити статистику</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 24,
    marginTop: 8,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 24,
  },
  card: {
    width: "47%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTotal: {
    borderTopWidth: 4,
    borderTopColor: "#4b5563",
  },
  cardX: {
    borderTopWidth: 4,
    borderTopColor: "#ef4444",
  },
  cardO: {
    borderTopWidth: 4,
    borderTopColor: "#3b82f6",
  },
  cardDraw: {
    borderTopWidth: 4,
    borderTopColor: "#f59e0b",
  },
  playerBadgeX: {
    fontSize: 26,
    fontWeight: "900",
    color: "#ef4444",
  },
  playerBadgeO: {
    fontSize: 26,
    fontWeight: "900",
    color: "#3b82f6",
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginVertical: 4,
  },
  cardLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
  },
  resetText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
