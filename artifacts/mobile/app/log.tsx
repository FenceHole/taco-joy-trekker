import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
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
import { MENU_ICONS, MENU_ITEMS, MODIFIERS } from "@/constants/data";
import { useApp } from "@/context/AppContext";

function SuccessOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <View style={overlayStyles.container}>
      <View style={overlayStyles.card}>
        <Text style={overlayStyles.emoji}>🎉</Text>
        <Text style={overlayStyles.title}>Treat Enjoyed!</Text>
        <Text style={overlayStyles.sub}>Zero guilt. 100% Joy.</Text>
        <TouchableOpacity style={overlayStyles.btn} onPress={onDismiss}>
          <Text style={overlayStyles.btnText}>Back to Stats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const overlayStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,10,26,0.92)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 32,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 28,
    padding: 36,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    width: "100%",
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: Colors.yellow,
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  btnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
  },
});

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const { addLog } = useApp();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const isWeb = Platform.OS === "web";

  const toggleMod = (modId: string) => {
    Haptics.selectionAsync();
    setSelectedMods((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const selectItem = (id: string) => {
    Haptics.selectionAsync();
    setSelectedItem(id);
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    const item = MENU_ITEMS.find((i) => i.id === selectedItem);
    if (!item) return;

    const mods = MODIFIERS.filter((m) => selectedMods.includes(m.id));
    let joy = 50;
    joy += mods.reduce((sum, m) => sum + m.bonusJoy, 0);

    let protein = item.baseProtein;
    if (selectedMods.includes("add_chicken")) protein += 10;

    let fiber = item.baseFiber;
    if (selectedMods.includes("sub_beans")) fiber += 8;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    await addLog({
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      itemId: item.id,
      itemName: item.name,
      itemIcon: MENU_ICONS[item.id] ?? "🌮",
      modifiers: mods.map((m) => m.name),
      joyPoints: joy,
      protein,
      fiber,
    });

    setShowSuccess(true);
  };

  const handleDismiss = () => {
    setShowSuccess(false);
    router.back();
  };

  const bottomPad = isWeb ? 34 : insets.bottom;

  return (
    <View style={styles.container}>
      {showSuccess && <SuccessOverlay onDismiss={handleDismiss} />}

      {/* Header */}
      <View style={[styles.header, { paddingTop: (isWeb ? 67 : insets.top) + 14 }]}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log a Run</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}
      >
        <Text style={styles.subtitle}>What comfort food did you grab today?</Text>

        {/* Step 1: Item Selection */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Main Item</Text>
          </View>

          <View style={styles.itemList}>
            {MENU_ITEMS.map((item) => {
              const isSelected = selectedItem === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemRow, isSelected && styles.itemRowSelected]}
                  onPress={() => selectItem(item.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.itemEmoji}>{MENU_ICONS[item.id]}</Text>
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, isSelected && styles.itemNameSelected]}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemMacros}>
                      {item.baseProtein}g protein · {item.baseFiber}g fiber
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <MaterialIcons name="check" size={14} color={Colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Modifiers */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Joy & Health Hacks</Text>
          </View>
          <Text style={styles.stepHint}>
            Check any positive choices you made — including just letting yourself enjoy it!
          </Text>

          <View style={styles.modList}>
            {MODIFIERS.map((mod) => {
              const isActive = selectedMods.includes(mod.id);
              return (
                <TouchableOpacity
                  key={mod.id}
                  style={[styles.modRow, isActive && styles.modRowActive]}
                  onPress={() => toggleMod(mod.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.modLeft}>
                    <View style={[styles.checkbox, isActive && styles.checkboxActive]}>
                      {isActive && (
                        <MaterialIcons name="check" size={14} color={Colors.white} />
                      )}
                    </View>
                    <View>
                      <Text style={styles.modName}>{mod.name}</Text>
                      <View style={[styles.modTag, { backgroundColor: `${mod.tagColor}20` }]}>
                        <Text style={[styles.modTagText, { color: mod.tagColor }]}>
                          {mod.tag}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.modJoyBadge}>
                    <Text style={styles.modJoyText}>+{mod.bonusJoy}</Text>
                    <Text style={styles.modJoyLabel}>Joy</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, { paddingBottom: bottomPad + 12 }]}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveBtn, !selectedItem && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!selectedItem}
          activeOpacity={0.85}
        >
          <MaterialIcons
            name="star"
            size={18}
            color={selectedItem ? Colors.white : Colors.textMuted}
          />
          <Text style={[styles.saveBtnText, !selectedItem && styles.saveBtnTextDisabled]}>
            Log It!
          </Text>
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgCardBorder,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginBottom: 24,
  },

  // Section
  section: {
    marginBottom: 28,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
  },
  stepTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  stepHint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    marginBottom: 12,
    marginLeft: 36,
  },

  // Item rows
  itemList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    gap: 12,
  },
  itemRowSelected: {
    borderColor: Colors.primaryLight,
    backgroundColor: "rgba(124,58,237,0.15)",
  },
  itemEmoji: {
    fontSize: 26,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  itemNameSelected: {
    color: Colors.primaryLight,
  },
  itemMacros: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  // Modifier rows
  modList: {
    gap: 8,
    marginLeft: 0,
  },
  modRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
  },
  modRowActive: {
    borderColor: Colors.accent,
    backgroundColor: "rgba(236,72,153,0.1)",
  },
  modLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  modName: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  modTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modTagText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  modJoyBadge: {
    alignItems: "center",
    backgroundColor: "rgba(15,10,26,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  modJoyText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.yellow,
  },
  modJoyLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: Colors.textMuted,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.bgCardBorder,
    backgroundColor: Colors.bg,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.bgCard,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
  },
  saveBtnTextDisabled: {
    color: Colors.textMuted,
  },
});
