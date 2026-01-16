import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

export default function Header({ title, onPressMenu }) {
  const navigation = useNavigation();

  const isMainScreen = title === "QUẢN LÝ CÁ NHÂN";

  const handleLeftPress = () => {
    if (isMainScreen) {
      onPressMenu && onPressMenu();
    } else {
      // quay lại hoặc navigate về màn cụ thể
      // navigation.goBack();
      navigation.navigate("PersonalManagement");
    }
  };

  return (
    <LinearGradient
      colors={["#0071CE", "#00AAED"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        {/* Nút bên trái */}
        <TouchableOpacity onPress={handleLeftPress}>
          {isMainScreen ? (
            <Ionicons name="menu" size={28} color="#fff" />
          ) : (
            <MaterialIcons name="arrow-back-ios-new" size={24} color="#fff" />
          )}
        </TouchableOpacity>

        {/* Tiêu đề */}
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>

        {/* Nút bên phải */}
        {isMainScreen ? (
          <View style={styles.headerRight}>
            <FontAwesome name="bell" size={24} color="#fff" />
          </View>
        ) : (
          // để 1 view trống giữ cân layout
          <View style={{ width: 24 }} />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    width: "100%",
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});
