import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  Modal,
  StatusBar as RNStatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? RNStatusBar.currentHeight || 24 : 0;

const ViewDetailModal = ({ visible, onClose, data }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [rendered, setRendered] = useState(false);
  function formatDate(dateString) {
    if (!dateString) return "";
    return dayjs(dateString).format("MM/YYYY");
  }

  useEffect(() => {
    if (visible) {
      setRendered(true);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 550,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Ẩn overlay ngay
      fadeAnim.setValue(0);

      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 2,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setRendered(false);
      });
    }
  }, [visible]);

  const formatMoney = (value) => {
    if (value === null || value === undefined) return "";
    const num = Number(value) || 0;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // 1.000.000
  };

  if (!rendered) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* StatusBar cho modal */}
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Nền mờ */}
      <Animated.View
        style={[styles.overlay, { opacity: fadeAnim }]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>
      {/* Nội dung modal trượt từ dưới lên */}
      <Animated.View
        style={[
          styles.modalContent,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Safe area cho phần nội dung */}
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          {/* overlay cho vùng status bar (màu xám) */}
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="chevron-back"
                size={24}
                style={{ fontWeight: "900" }}
                color="#345886ff"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chi tiết</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
            {/* Dòng thời gian */}
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>
                Từ tháng: {formatDate(data.tu)}
              </Text>
              <Text style={styles.timeText}>
                Đến tháng: {formatDate(data.den)}
              </Text>
            </View>

            <LinearGradient
              colors={["#436ca1ff", "#3a659cff", "#345886ff"]}
              start={{ x: 0, y: 0 }} // bên trái
              end={{ x: 1, y: 0 }} // sang phải
              style={styles.headerGradient}
            >
              <View style={styles.infoBox}>
                <Text style={styles.label}>
                  Chức vụ: <Text style={styles.value}>{data.nghe}</Text>
                </Text>
                <Text style={styles.label}>
                  Đơn vị công tác:{" "}
                  <Text style={styles.value}>{data.donvi}</Text>
                </Text>
                <Text style={styles.label}>
                  Nơi làm việc:{" "}
                  <Text style={styles.value}>{data.diachilamviec}</Text>
                </Text>
                <Text style={styles.label}>
                  Loại tiền: <Text style={styles.value}>{data.loaitien}</Text>
                </Text>
              </View>
            </LinearGradient>
            {/* Thông tin chi tiết */}

            {/* Bảng lương */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableLeft}>Tiền lương đóng BHXH</Text>
                <Text style={styles.tableRight}>
                  {formatMoney(data.tienluongdongbhxh)}
                </Text>
              </View>
              <View style={[styles.tableRow, styles.lastRow]}>
                <Text style={styles.tableLeft}>Mức lương</Text>
                <Text style={styles.tableRight}>
                  {formatMoney(data.mucluong)}
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

export default ViewDetailModal;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#345886ff",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 14,
    color: "#707070",
    paddingLeft: 20,
    paddingRight: 20,
  },
  infoBox: {
    borderRadius: 2,
    paddingLeft: 10,
    paddingTop: 7,
    paddingBottom: 5,
  },
  label: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
  value: {
    color: "white",

    fontWeight: "600",
  },
  table: {
    marginTop: 0,
    borderWidth: 1,
    borderColor: "#c7dcfc",
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#c7dcfc",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  tableLeft: {
    textAlign: "center",
    flex: 1,
    padding: 6,
    paddingTop: 6,
    fontSize: 13,
    borderRightWidth: 1,
    borderColor: "#c7dcfc",
    color: "#707070",
  },
  tableRight: {
    flex: 1,
    padding: 6,
    paddingTop: 6,
    fontSize: 14,
    color: "#707070",
    textAlign: "right",
  },
  headerGradient: {
    marginTop: 9,
  },
});
