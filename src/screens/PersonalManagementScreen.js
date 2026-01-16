import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Platform,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserGetById } from "../service/UserAPI";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Taba from "../components/Taba";
import { Chamthan, ChuThap, The, VongXoay } from "../../assets/icon/iconHome";

export default function PersonalManagementScreen() {
  const navigation = useNavigation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dataUser, setDataUser] = useState({});
  const [title, setTitle] = useState();
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
    } catch {}
    setDrawerOpen(false);
    navigation.replace("Login");
  };
  const fetchDataUserById = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      if (!user || !user.id) return;
      const res = await UserGetById(user.id);
      if (res && res.data && res.data.success === true) {
        setDataUser(res.data.data || {});
      }
    } catch (e) {
      console.log("fetch user error:", e);
    }
  };

  useEffect(() => {
    fetchDataUserById();
    setTitle("cn");
  }, []);

  const STATUSBAR_HEIGHT =
    Platform.OS === "android" ? RNStatusBar.currentHeight || 24 : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* StatusBar */}
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Overlay nền tối cho khu vực status bar */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: STATUSBAR_HEIGHT,
          backgroundColor: "#757575",
          zIndex: 10,
        }}
      />

      <View style={styles.container}>
        {/* ===== HEADER ===== */}
        <Header
          title={"QUẢN LÝ CÁ NHÂN"}
          onPressMenu={() => setDrawerOpen(true)}
        />

        {/* ===== BODY ===== */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Thông tin người dùng */}
          <LinearGradient
            colors={["#f1f0f5", "#e4edf2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.userCard}
          >
            {/* Avatar + Tên */}
            <View style={styles.userRow}>
              <Image
                source={
                  dataUser.avatarUrl
                    ? { uri: dataUser.avatarUrl }
                    : require("../../assets/avtVssID.png")
                }
                style={styles.avatar}
              />
              <View>
                <Text style={styles.userName}>{dataUser.userFullname}</Text>
                <Text style={styles.userCode}>
                  Mã BHXH: {dataUser.bhxhNumber}
                </Text>
              </View>
            </View>

            {/* Dòng thông tin */}
            <View
              style={[
                styles.infoRow,
                { borderTopWidth: 1, borderColor: "#858a8f", marginTop: 10 },
              ]}
            >
              <Text style={styles.label}>Ngày sinh</Text>
              <Text style={styles.value}>{dataUser.dateOfBirth}</Text>
            </View>

            <View style={styles.infoHc}>
              <Text style={styles.label}>ĐDCN/CCCD/Hộ chiếu</Text>
              <Text style={styles.valuehochieu}>{dataUser.citizenId}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Số điện thoại</Text>
              <Text style={styles.value}>{dataUser.userPhone}</Text>
            </View>

            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.address}>Địa chỉ</Text>
              <Text style={styles.value}>{dataUser.address}</Text>
            </View>
          </LinearGradient>
          <View style={styles.menuList}>
            <MenuItem icon={<The />} text="THẺ BHYT" />
            <MenuItem
              icon={<VongXoay />}
              text="QUÁ TRÌNH THAM GIA"
              onPress={() => navigation.navigate("QuaTrinhThamGia")}
            />
            <MenuItem icon={<Chamthan />} text="THÔNG TIN HƯỞNG" />
            <MenuItem icon={<ChuThap />} text="SỔ KHÁM CHỮA BỆNH" />
          </View>
        </ScrollView>
      </View>

      {/* ===== SIMPLE SIDEBAR OVERLAY ===== */}
      {drawerOpen && (
        <View style={styles.overlayWrapper}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setDrawerOpen(false)}
          />
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Tài khoản</Text>
              <TouchableOpacity onPress={() => setDrawerOpen(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#d32f2f" />
              <Text style={styles.drawerItemText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Taba navigation={navigation} activeScreen="PersonalManagement" />
    </SafeAreaView>
  );
}

/** ====== COMPONENT MENU ITEM (JS thuần) ====== */
/** ====== COMPONENT MENU ITEM ====== */
function MenuItem({ icon, text, onPress }) {
  return (
    <View>
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuLeft}>
          {/* Hiển thị icon SVG trực tiếp */}
          <View style={styles.circleIcon}>{icon}</View>

          {/* Text và gạch chân */}
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>{text}</Text>
            <View style={styles.underline} />
          </View>
        </View>

        {/* Mũi tên bên phải */}

        <Ionicons name="chevron-forward-sharp" size={24} color="#777" />
      </TouchableOpacity>
    </View>
  );
}

/** ====== STYLES ====== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },

  scrollContent: {
    paddingBottom: 24,
  },

  userCard: {
    backgroundColor: "#e4edf2",
    margin: 20,
    padding: 20,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
    marginTop: 4,
    marginLeft: 3,
  },
  userCode: { color: "#555", fontSize: 14, marginTop: 10, marginLeft: 3 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cacfce",
  },
  infoHc: {
    width: 310,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cacfce",
  },
  valuehochieu: {
    fontSize: 14,
    color: "#4f4f4f",
  },
  label: {
    color: "#4f4f4f",
    fontSize: 14,
  },
  address: {
    color: "#4f4f4f",
    fontSize: 14,
  },
  value: {
    color: "#4f4f4f",
    fontSize: 14,
    textAlign: "right",
    lineHeight: 20,
    maxWidth: 203,
  },

  menuList: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#0074c7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 9,
  },
  textContainer: {
    flexDirection: "column",
    flexGrow: 1,
    marginLeft: 8,
  },
  menuText: {
    color: "#4f4f4f",
    fontSize: 18,
    marginTop: 5,
  },
  underline: {
    height: 1.2,
    backgroundColor: "#878787",
    marginTop: 20,
    width: "100%",
  },

  // Drawer
  overlayWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: "row",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  drawer: {
    width: 260,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 0 },
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  drawerTitle: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  drawerItemText: {
    fontSize: 16,
    color: "#333",
  },
});
