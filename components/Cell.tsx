import { Pressable, StyleSheet, Text } from "react-native";
import type { CellValue } from "@/types";

interface CellProps {
  value: CellValue;
  onCellClick: () => void;
  isWinner: boolean;
}

export function Cell({ value, onCellClick, isWinner }: CellProps) {
  return (
    <Pressable
      onPress={onCellClick}
      style={({ pressed }) => [
        styles.cell,
        isWinner && styles.winner,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.cellText,
          value === "X" && styles.xMark,
          value === "O" && styles.oMark,
          isWinner && styles.winnerText,
        ]}
      >
        {value}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 90,
    height: 90,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  winner: {
    backgroundColor: "#2ecc71",
    borderColor: "#27ae60",
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  cellText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  xMark: {
    color: "#e74c3c",
  },
  oMark: {
    color: "#3498db",
  },
  winnerText: {
    color: "#ffffff",
  },
});
