import AntDesign from "@expo/vector-icons/AntDesign";
import { StyleSheet, Text } from "react-native";
import { ThemeColors, useTheme } from "@/context/ThemeContext";

interface TitleGameProps {
  title: string;
}

export function TitleGame({ title }: TitleGameProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return <Text style={styles.title}>{title}</Text>;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    title: {
      color: colors.text,
      marginBottom: 20,
      fontSize: 24,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 2,
      textAlign: "center",
    },
  });
