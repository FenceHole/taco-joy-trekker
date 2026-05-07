import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { TACO_BELL_HACKS } from "@/constants/data";

export default function HacksScreen() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topInset = isWeb ? 67 : insets.top;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scroll, { paddingTop: topInset }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Taco Bell Education</Text>
          <Text style={styles.headerSub}>
            Learn how to make comfort food work for you.
          </Text>
        </View>

        {/* Did You Know Card */}
        <View style={styles.didYouKnow}>
          <View style={styles.dykIconWrap}>
            <MaterialIcons name="info" size={20} color={Colors.blue} />
          </View>
          <View style={styles.dykContent}>
            <Text style={styles.dykTitle}>Did you know?</Text>
            <Text style={styles.dykText}>
              Taco Bell was the first QSR to offer AVA-certified vegetarian
              food. It's actually one of the easiest fast-food chains to hit
              your macro goals — especially protein and fiber!
            </Text>
          </View>
        </View>

        {/* Hacks */}
        <Text style={styles.sectionTitle}>Pro Ordering Hacks</Text>
        <View style={styles.hacksList}>
          {TACO_BELL_HACKS.map((hack, i) => (
            <View key={i} style={styles.hackCard}>
              <View
                style={[
                  styles.hackIconWrap,
                  { backgroundColor: hack.bgColor },
                ]}
              >
                <MaterialIcons
                  name={hack.iconName as keyof typeof MaterialIcons.glyphMap}
                  size={24}
                  color={hack.iconColor}
                />
              </View>
              <View style={styles.hackContent}>
                <Text style={styles.hackTitle}>{hack.title}</Text>
                <Text style={styles.hackDesc}>{hack.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom tip */}
        <View style={styles.tipCard}>
          <MaterialIcons name="favorite" size={16} color={Colors.accent} />
          <Text style={styles.tipText}>
            Remember: There is no "bad" food. Every meal that brings you joy
            is a win. These hacks just help you stack your wins even higher!
          </Text>
        </View>

        <View style={{ height: isWeb ? 34 + 84 : insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },

  // Did You Know
  didYouKnow: {
    flexDirection: "row",
    backgroundColor: "rgba(59,130,246,0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.25)",
    gap: 12,
  },
  dykIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(59,130,246,0.15)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dykContent: {
    flex: 1,
  },
  dykTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: Colors.blue,
    marginBottom: 4,
  },
  dykText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Hacks
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  hacksList: {
    gap: 12,
    marginBottom: 20,
  },
  hackCard: {
    flexDirection: "row",
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    alignItems: "flex-start",
  },
  hackIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  hackContent: {
    flex: 1,
  },
  hackTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  hackDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Tip
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(236,72,153,0.1)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(236,72,153,0.2)",
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
