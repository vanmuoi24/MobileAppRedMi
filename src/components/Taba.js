// components/Taba.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DichVuCong,
  Qlcanhan,
  TraCuu,
  TroGiup,
} from "../../assets/icon/iconTabar";

// FooterItem có thể nhận SVG component hoặc icon Ionicons
function FooterItem({ IconComponent, iconName, text, active, onPress }) {
  const color = active ? "#0071CE" : "#777";

  return (
    <TouchableOpacity style={styles.footerItem} onPress={onPress}>
      {IconComponent ? (
        <IconComponent width={70} height={80} fill={color} />
      ) : (
        <Ionicons
          name={iconName}
          size={57}
          color={active ? "#0071CE" : "#777"}
        />
      )}
      <Text style={[styles.footerLabel, active && { color: "#0071CE" }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default function Taba({ navigation, activeScreen }) {
  return (
    <View style={styles.footer}>
      <FooterItem
        IconComponent={Qlcanhan}
        text="QL cá nhân"
        active={activeScreen === "PersonalManagement"}
        onPress={() => navigation.navigate("PersonalManagement")}
      />

      <FooterItem
        IconComponent={DichVuCong}
        text="Dịch vụ công"
        active={activeScreen === "DichVuCong"}
      />

      <FooterItem
        IconComponent={TraCuu}
        text="Tra cứu"
        active={activeScreen === "TraCuu"}
      />

      <FooterItem
        IconComponent={TroGiup}
        text="Trợ giúp"
        active={activeScreen === "TroGiup"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 50, // cao cố định
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLabel: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
    bottom: 19,
  },
  footerLabelActive: {
    color: "#0071CE",
  },
});
