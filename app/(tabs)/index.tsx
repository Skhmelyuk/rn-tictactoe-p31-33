import { Cell } from "@/components/Cell";
import { Status } from "@/components/Status";
import { TitleGame } from "@/components/TitleGame";
import { ThemeColors, useTheme } from "@/context/ThemeContext";
import { api } from "@/convex/_generated/api";
import type { BoardState, Player } from "@/types";
import { checkWinner } from "@/utils/utilsGame";
import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GameScreen() {
  const [cells, setCells] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");

  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Отримуємо функцію фіксації результату з контексту
  const recordGame = useMutation(api.games.recordGame);

  // Прапорець, щоб зараховувати результат гри лише 1 раз за партію
  const gameRecordedRef = useRef(false);

  const winnerResult = checkWinner(cells);
  const winner = winnerResult ? winnerResult.winner : null;
  const winnerCombination = winnerResult ? winnerResult.combination : [];
  const isDraw = !winner && cells.every((cell) => cell != null);

  // Автоматичний запис результату при завершенні партії
  useEffect(() => {
    if (winner && !gameRecordedRef.current) {
      recordGame({
        winner,
        board: cells,
        winningCombination: winnerCombination,
      });
      gameRecordedRef.current = true;
    } else if (isDraw && !gameRecordedRef.current) {
      recordGame({
        winner: "DRAW",
        board: cells,
      });
      gameRecordedRef.current = true;
    }
  }, [winner, isDraw, cells, recordGame]);

  const handleCellClick = (index: number): void => {
    if (cells[index] || winner || isDraw) {
      return;
    }

    const newCells = [...cells];
    newCells[index] = currentPlayer;
    setCells(newCells);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleReset = () => {
    setCells(Array(9).fill(null));
    gameRecordedRef.current = false; // Дозволяємо запис для нової партії
    if (winner) {
      setCurrentPlayer(winner === "X" ? "O" : "X");
    }
  };

  return (
    <View style={styles.game}>
      <TitleGame title="Гра хрестики нулики" />
      <Status player={currentPlayer} winner={winner} isDraw={isDraw} />
      <View style={styles.board}>
        {cells.map((cell, index) => (
          <Cell
            value={cell}
            key={index}
            onCellClick={() => handleCellClick(index)}
            isWinner={winnerCombination.includes(index)}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleReset}
        activeOpacity={0.8}
      >
        <Text style={styles.resetText}>Скинути гру</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    game: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bg,
      flex: 1,
    },
    board: {
      width: 290,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 10,
      marginVertical: 10,
    },
    resetButton: {
      marginTop: 20,
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: colors.primary,
      borderRadius: 8,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    resetText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
  });
