import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { Switch } from "react-native";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";

export default function StatisticsScreen() {
  const { signOut } = useAuthActions();
  const router = useRouter();
  const user = useQuery(api.users.currentUser);

  const stats = useQuery(api.stats.getStats);
  const resetStats = useMutation(api.stats.resetStats);

  const { colors, isDarkMode, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  const currentStats = stats ?? {
    totalGames: 0,
    winsX: 0,
    winsO: 0,
    draws: 0,
  };

  const handleSignOut = () => {
  Alert.alert("Вихід з акаунта", "Ви впевнені, що хочете вийти з гри?", [
    { text: "Скасувати", style: "cancel" },
    {
      text: "Вийти",
      style: "destructive",
      onPress: async () => {
        await signOut();
        router.replace("/sign-in");
      },
    },
  ]);
};

  const handleResetStats = () => {
    resetStats();
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Статистика ігор</Text>

      <View style={styles.userCard}>
  <View style={styles.userAvatar}>
    <MaterialIcons name="sports-esports" size={28} color="#FFFFFF" />
  </View>
  <View style={styles.userInfo}>
    <Text style={styles.userName}>{user?.name ?? "Гравець"}</Text>
    <Text style={styles.userEmail}>{user?.email ?? ""}</Text>
  </View>
  <TouchableOpacity
    style={styles.signOutBtn}
    onPress={handleSignOut}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <MaterialIcons name="logout" size={22} color={colors.textMuted} />
  </TouchableOpacity>
</View> 

      <View style={styles.themeCard}>
        <View style={styles.themeInfo}>
          <MaterialIcons
            name={isDarkMode ? "dark-mode" : "light-mode"}
            size={24}
            color={isDarkMode ? "#FBBF24" : "#F59E0B"}
          />
          <Text style={styles.themeText}>
            {isDarkMode ? "Темна тема" : "Світла тема"}
          </Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: "#D1D5DB", true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.grid}>
        {/* Картка 1: Загальна кількість */}
        <View style={[styles.card, styles.cardTotal]}>
          <MaterialIcons name="videogame-asset" size={32} color="#4b5563" />
          <Text style={styles.cardNumber}>{currentStats.totalGames}</Text>
          <Text style={styles.cardLabel}>Зіграно партій</Text>
        </View>

        {/* Картка 2: Перемоги X */}
        <View style={[styles.card, styles.cardX]}>
          <Text style={styles.playerBadgeX}>X</Text>
          <Text style={styles.cardNumber}>{currentStats.winsX}</Text>
          <Text style={styles.cardLabel}>Перемог X</Text>
        </View>

        {/* Картка 3: Перемоги O */}
        <View style={[styles.card, styles.cardO]}>
          <Text style={styles.playerBadgeO}>O</Text>
          <Text style={styles.cardNumber}>{currentStats.winsO}</Text>
          <Text style={styles.cardLabel}>Перемог O</Text>
        </View>

        {/* Картка 4: Нічиї */}
        <View style={[styles.card, styles.cardDraw]}>
          <MaterialIcons name="handshake" size={32} color="#f59e0b" />
          <Text style={styles.cardNumber}>{currentStats.draws}</Text>
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      padding: 20,
      alignItems: "center",
      flex: 1,
      backgroundColor: colors.bg,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 20,
      marginTop: 8,
    },
    themeCard: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      marginBottom: 20,
      elevation: 2,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    themeInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    themeText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
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
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      borderTopWidth: 4,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    cardTotal: {
      borderTopColor: colors.textMuted,
    },
    cardX: {
      borderTopColor: colors.xMark,
    },
    cardO: {
      borderTopColor: colors.oMark,
    },
    cardDraw: {
      borderTopColor: colors.draw,
    },
    playerBadgeX: {
      fontSize: 26,
      fontWeight: "900",
      color: colors.xMark,
    },
    playerBadgeO: {
      fontSize: 26,
      fontWeight: "900",
      color: colors.oMark,
    },
    cardNumber: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.text,
      marginVertical: 4,
    },
    cardLabel: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.textMuted,
    },
    resetButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.danger,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      width: "100%",
    },
    resetButtonDisabled: {
      backgroundColor: colors.dangerDisabled,
    },
    resetText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "600",
    },
    userCard: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: 16,
      marginBottom: 24,
      elevation: 3,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },
    userAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textMuted,
      marginTop: 2,
    },
    signOutBtn: {
      padding: 8,
    },
  });
