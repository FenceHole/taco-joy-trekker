import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { MENU_ICONS } from "@/constants/data";
import { LogEntry, useApp } from "@/context/AppContext";

function StatCard({
  label,
  value,
  unit,
  iconName,
  iconColor,
  bgColor,
}: {
  label: string;
  value: number;
  unit: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: bgColor }]}>
        <MaterialIcons name={iconName} size={20} color={iconColor} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {value}
        <Text style={styles.statUnit}>{unit}</Text>
      </Text>
    </View>
  );
}

function LogCard({ log, onDelete }: { log: LogEntry; onDelete: () => void }) {
  const icon = MENU_ICONS[log.itemId] ?? "🌮";
  return (
    <View style={styles.logCard}>
      <View style={styles.logIconWrap}>
        <Text style={styles.logEmoji}>{icon}</Text>
      </View>
      <View style={styles.logInfo}>
        <Text style={styles.logName} numberOfLines={1}>
          {log.itemName}
        </Text>
        <Text style={styles.logDate}>{log.date}</Text>
        {log.modifiers.length > 0 && (
          <View style={styles.modifierDots}>
            {log.modifiers.slice(0, 4).map((m, i) => (
              <View key={i} style={styles.modDot} />
            ))}
          </View>
        )}
      </View>
      <View style={styles.logRight}>
        <Text style={styles.logJoy}>+{log.joyPoints}</Text>
        <Text style={styles.logJoyLabel}>Joy</Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onDelete();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.deleteBtn}
        >
          <MaterialIcons name="close" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function LevelCard({
  level,
  currentTitle,
  totalJoy,
  levelProgress,
  ptsToNextLevel,
}: {
  level: number;
  currentTitle: string;
  totalJoy: number;
  levelProgress: number;
  ptsToNextLevel: number;
}) {
  const progressWidth = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: levelProgress,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [levelProgress]);

  return (
    <View style={styles.levelCard}>
      <View style={styles.levelBgIcon}>
        <MaterialIcons name="local-fire-department" size={100} color={Colors.primary} />
      </View>
      <View style={styles.levelContent}>
        <Text style={styles.levelStatus}>CURRENT STATUS</Text>
        <Text style={styles.levelTitle}>{currentTitle}</Text>

        <View style={styles.levelBadges}>
          <View style={styles.badge}>
            <MaterialIcons name="sentiment-satisfied" size={14} color={Colors.accentLight} />
            <Text style={styles.badgeText}>Level {level}</Text>
          </View>
          <View style={styles.badge}>
            <MaterialIcons name="bolt" size={14} color={Colors.yellow} />
            <Text style={styles.badgeText}>{totalJoy} Joy Pts</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>{ptsToNextLevel} pts to next rank</Text>
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const {
    logs,
    totalJoy,
    totalProtein,
    totalFiber,
    level,
    currentTitle,
    levelProgress,
    ptsToNextLevel,
    deleteLog,
  } = useApp();

  const handleLogPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/log");
  };

  const isWeb = Platform.OS === "web";
  const topInset = isWeb ? 67 : insets.top;

  return (
    <View style={[styles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scroll, { paddingTop: topInset }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Taco Joy Trekker</Text>
            <Text style={styles.headerSub}>Fueling your body & soul</Text>
          </View>
          <MaterialIcons name="favorite" size={28} color={Colors.accent} />
        </View>

        {/* Level Card */}
        <LevelCard
          level={level}
          currentTitle={currentTitle}
          totalJoy={totalJoy}
          levelProgress={levelProgress}
          ptsToNextLevel={ptsToNextLevel}
        />

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Protein"
            value={totalProtein}
            unit="g"
            iconName="bolt"
            iconColor={Colors.blue}
            bgColor="rgba(59,130,246,0.15)"
          />
          <StatCard
            label="Fiber"
            value={totalFiber}
            unit="g"
            iconName="eco"
            iconColor={Colors.green}
            bgColor="rgba(16,185,129,0.15)"
          />
          <StatCard
            label="Trips"
            value={logs.length}
            unit=""
            iconName="place"
            iconColor={Colors.primaryLight}
            bgColor="rgba(167,139,250,0.15)"
          />
          <StatCard
            label="Joy Pts"
            value={totalJoy}
            unit=""
            iconName="star"
            iconColor={Colors.yellow}
            bgColor="rgba(251,191,36,0.15)"
          />
        </View>

        {/* Recent Treks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Treks</Text>

          {logs.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="restaurant" size={40} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No trips yet!</Text>
              <Text style={styles.emptyText}>
                Grab some comfort food and log it to start earning Joy Points.
              </Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={handleLogPress}>
                <Text style={styles.emptyBtnText}>Log First Trip</Text>
              </TouchableOpacity>
            </View>
          ) : (
            logs.map((log) => (
              <LogCard
                key={log.id}
                log={log}
                onDelete={() => deleteLog(log.id)}
              />
            ))
          )}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FAB */}
      <View style={[styles.fabWrap, { bottom: isWeb ? 34 + 84 : insets.bottom + 80 }]}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleLogPress}
          activeOpacity={0.85}
        >
          <MaterialIcons name="add" size={30} color={Colors.white} />
        </TouchableOpacity>
      </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Level Card
  levelCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    overflow: "hidden",
    position: "relative",
  },
  levelBgIcon: {
    position: "absolute",
    right: -16,
    top: -16,
    opacity: 0.08,
  },
  levelContent: {
    zIndex: 1,
  },
  levelStatus: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: Colors.primaryLight,
    letterSpacing: 2,
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.yellow,
    marginBottom: 12,
  },
  levelBadges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(124,58,237,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.4)",
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(124,58,237,0.2)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    // gradient-like using multiple shadow
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
    textAlign: "right",
  },

  // Stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
  },
  statUnit: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },

  // Section
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    marginBottom: 12,
  },

  // Log Card
  logCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    gap: 12,
  },
  logIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  logEmoji: {
    fontSize: 24,
  },
  logInfo: {
    flex: 1,
  },
  logName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  logDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  modifierDots: {
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
  },
  modDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  logRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  logJoy: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.yellow,
  },
  logJoyLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
  deleteBtn: {
    marginTop: 6,
    padding: 4,
  },

  // Empty state
  emptyState: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    borderStyle: "dashed",
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
  },

  // FAB
  fabWrap: {
    position: "absolute",
    right: 24,
    alignItems: "center",
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
});
