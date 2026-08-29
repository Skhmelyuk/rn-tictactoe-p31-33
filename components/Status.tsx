import { StyleSheet, Text, View } from "react-native";
import type { CellValue, Player } from "@/types";

interface StatusProps {
  player: Player;
  winner: CellValue;
  isDraw: boolean;
}

export function Status({ player, winner, isDraw }: StatusProps) {
  if (winner) {
    return (
      <View style={styles.turn}>
        <Text style={styles.turnText}>
          Гравець{" "}
          <Text style={winner === "X" ? styles.xMark : styles.oMark}>
            {winner}
          </Text>{" "}
          переміг!
        </Text>
      </View>
    );
  }

  if (isDraw) {
    return (
      <View style={styles.turn}>
        <Text style={styles.turnText}>Нічия!</Text>
      </View>
    );
  }

  return (
    <View style={styles.turn}>
      <Text style={styles.turnText}>
        Хід гравця{" "}
        <Text style={player === "X" ? styles.xMark : styles.oMark}>
          {player}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  turn: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3, // для android тіні
    alignSelf: "center",
  },
  turnText: {
    fontSize: 18,
    color: "#34495e",
    fontWeight: "500",
  },
  xMark: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
  oMark: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
