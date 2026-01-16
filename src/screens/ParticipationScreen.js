import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  StatusBar as RNStatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { StatusBar } from "expo-status-bar";

import {
  IconBHXH,
  SVGComponent,
  IconTs2,
  IconYte,
  BHTN,
} from "../../assets/icon/icon";

import { getPartionByIdByType } from "../service/ParticipationAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated, Easing } from "react-native";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import TableWithBhyt from "../components/TableWithBhyt";
import TableWithoutBhyt from "../components/TableWithoutBhyt";
import { SafeAreaView } from "react-native-safe-area-context";
import Taba from "../components/Taba";

dayjs.extend(duration);
// import dayjs from "dayjs";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TableScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const flatListRef = useRef(null);

  const [dataBhxh, setDataBhxh] = useState([]);
  const [totalBhxhTime, setTotalBhxhTime] = useState("0 tháng");
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [loading, setLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [datePartion, setDatePartion] = useState();
  const [totalBhtnTime, setTotalBhtnTime] = useState("0 tháng");
  const [totalBhtnldTime, setTotalBhtnldTime] = useState("0 tháng");
  const [totalBhytTime, setTotalBhytTime] = useState("0 tháng");
  const [bhyt, setbhyt] = useState(false);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const user = await AsyncStorage.getItem("user");
        const idUser = JSON.parse(user);

        const [resBhxh, resBhtn, resBhtnld, resBhyt] = await Promise.all([
          getPartionByIdByType(idUser.id, "BHXH"),
          getPartionByIdByType(idUser.id, "BHXH"),
          getPartionByIdByType(idUser.id, "BHXH"),
          getPartionByIdByType(idUser.id, "BHXH"),
        ]);

        if (resBhxh?.data?.success) {
          const list = resBhxh.data.data || [];
          setDataBhxh(list);
          const total = calculateContinuousTime(list);
          setTotalBhxhTime(total.text);
        }

        if (resBhtn?.data?.success) {
          const list = resBhtn.data.data || [];
          setData1(list);
          const total = calculateContinuousTime(list);
          setTotalBhtnTime(total.text);
        }

        if (resBhtnld?.data?.success) {
          const list = resBhtnld.data.data || [];
          setData2(list);
          const total = calculateContinuousTime(list);
          setTotalBhtnldTime(total.text);
        }

        if (resBhyt?.data?.success) {
          const list = resBhyt.data.data || [];
          setData3(list);
          const total = calculateContinuousTime(list);
          setTotalBhytTime(total.text);
        }
      } catch (e) {
        console.log("fetchAll error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // utils/dateUtils.js

  const calculateContinuousTime = (dataList = []) => {
    if (!dataList.length) {
      return { years: 0, months: 0, totalMonths: 0, text: "0 tháng" };
    }

    let totalMonths = 0;

    dataList.forEach((item) => {
      if (!item.startDate || !item.endDate) return;

      const start = dayjs(item.startDate).startOf("month");
      const end = dayjs(item.endDate).startOf("month");

      // số tháng của từng giai đoạn (tính cả tháng đầu & cuối)
      const months =
        end.year() * 12 + end.month() - (start.year() * 12 + start.month()) + 1;

      if (months > 0) {
        totalMonths += months;
      }
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    let text = "";
    if (years > 0) text += `${years} năm `;
    if (months > 0) text += `${months} tháng`;
    if (!text) text = "0 tháng";

    return {
      years,
      months,
      totalMonths,
      text: text.trim(),
    };
  };

  const tabsData = useMemo(
    () => [
      {
        id: 0,
        icon: IconBHXH,
        lable: "BHXH",
        title: "Quá trình tham gia Bảo hiểm xã hội",
        totalTime: totalBhxhTime,
        lateTime: "0 tháng",
        data: [...(dataBhxh || [])]
          .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
          .map((item) => ({
            tu: item.startDate,
            den: item.endDate,
            donvi: item.companyName || "Không rõ",
            nghe: item.position || "Không rõ",
            diachilamviec: item.workplaceAddress || "Không rõ",
            loaitien: item.currency || "VND",
            tienluongdongbhxh: item.insuranceSalary || "Không rõ",
            mucluong: item.salary || "Không rõ",
          })),
      },
      {
        id: 1,
        icon: SVGComponent,
        lable: "BHTN",
        title: "Quá trình tham gia Bảo hiểm thất nghiệp",
        lateTime: "0 tháng",

        totalTime: totalBhtnTime,

        data: [...(dataBhxh || [])]
          .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
          .map((item) => ({
            tu: item.startDate,
            den: item.endDate,
            donvi: item.companyName || "Không rõ",
            nghe: item.position || "Không rõ",
            diachilamviec: item.workplaceAddress || "Không rõ",
            loaitien: item.currency || "VND",
            tienluongdongbhxh: item.insuranceSalary || "Không rõ",
            mucluong: item.salary || "Không rõ",
          })),
      },
      {
        id: 2,
        icon: BHTN,
        lable: "BHTNLD-BNN",
        title: "Quá trình tham gia Bảo hiểm tai nạn lao động, bệnh nghề nghiêp",
        totalTime: totalBhtnldTime,

        data: [...(dataBhxh || [])]
          .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
          .map((item) => ({
            tu: item.startDate,
            den: item.endDate,
            donvi: item.companyName || "Không rõ",
            nghe: item.position || "Không rõ",
            diachilamviec: item.workplaceAddress || "Không rõ",
            loaitien: item.currency || "VND",
            tienluongdongbhxh: item.insuranceSalary || "Không rõ",
            mucluong: item.salary || "Không rõ",
          })),
      },
      {
        id: 3,
        icon: IconYte,
        lable: "BHYT",
        title: "Quá trình tham gia Bảo hiểm y tế",
        totalTime: totalBhytTime,

        data: [...(dataBhxh || [])]
          .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
          .map((item) => ({
            tu: item.startDate,
            den: item.endDate,
            donvi: item.companyName || "Không rõ",
            nghe: item.position || "Không rõ",
            diachilamviec: item.workplaceAddress || "Không rõ",
            loaitien: item.currency || "VND",
            tienluongdongbhxh: item.insuranceSalary || "Không rõ",
            mucluong: item.salary || "Không rõ",
          })),
      },
      {
        id: 4,
        icon: IconTs2,
        lable: "C14-TS",
        data: [],
      },
    ],
    [
      dataBhxh,
      data1,
      data2,
      data3,
      totalBhxhTime,
      totalBhtnTime,
      totalBhtnldTime,
      totalBhytTime,
    ]
  );

  // Animation quay vòng
  const startLogoSpin = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start(); // 👈 BẮT BUỘC: khởi động vòng quay
  };

  const stopLogoSpin = () => {
    spinValue.stopAnimation();
  };

  // Chuyển giá trị quay thành độ
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Khi loading = true thì bắt đầu quay
  useEffect(() => {
    if (loading) startLogoSpin();
    else stopLogoSpin();
  }, [loading]);
  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);

    if (index !== activeTab) {
      setActiveTab(index);
    }

    // tab BHYT là index = 3
    if (index === 3) {
      setbhyt(true);
    } else {
      setbhyt(false);
    }
  };

  // Mở modal chi tiết
  const openModal = (dataItem) => {
    setSelectedData(dataItem);
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  // Đóng modal
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 1000,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };
  const STATUSBAR_HEIGHT =
    Platform.OS === "android" ? RNStatusBar.currentHeight || 24 : 0;
  const renderTabs = ({ item }) => {
    const hasData = item.data && item.data.length > 0;
    let time = item.lateTime;

    return (
      <ScrollView
        style={{ width: SCREEN_WIDTH, flex: 1, height: 575 }}
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true} // quan trọng khi table có scroll riêng
      >
        <View style={styles.viewtable}>
          {hasData ? (
            <View style={styles.infoBox}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.textNormal}>
                Tổng thời gian tham gia:{" "}
                <Text style={styles.bold}>{item.totalTime}</Text>
              </Text>
              {time && (
                <Text style={styles.textNormal}>
                  <Text style={styles.red}>
                    Tổng thời gian chậm đóng: {item.lateTime}
                  </Text>
                </Text>
              )}
            </View>
          ) : null}

          {!hasData ? (
            <View
              style={{
                paddingVertical: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#999", fontSize: 14 }}>
                Không có dữ liệu
              </Text>
            </View>
          ) : bhyt ? (
            <TableWithBhyt
              item={item}
              onOpenModal={(data) => {
                setSelectedData(data);
                setModalVisible(true);
              }}
            />
          ) : (
            <TableWithoutBhyt
              item={item}
              onOpenModal={(data) => {
                setSelectedData(data);
                setModalVisible(true);
              }}
            />
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
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
        {/* ========= PHẦN NỘI DUNG CHÍNH ========= */}
        <View style={styles.content}>
          {/* Overlay nền tối cho khu vực status bar */}

          <Header title={"QUÁ TRÌNH THAM GIA"} />

          {/* TAB BẢO HIỂM (BHXH, BHTN, ...) */}
          <View style={styles.tabRow}>
            {tabsData && tabsData.length > 0 ? (
              tabsData.map((item, index) => {
                const color = activeTab === index ? "#1976d2" : "#a9a8ad";
                const IconComponent = item.icon;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.tabItem,
                      activeTab === index && styles.tabItemActive,
                    ]}
                    onPress={() => {
                      setActiveTab(index);
                      flatListRef.current?.scrollToIndex({
                        index,
                        animated: true,
                      });
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderWidth: 1.5,
                          borderColor: color,
                          borderRadius: 25,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#fff",
                          marginBottom: 6,
                          paddingTop: 20,
                        }}
                      >
                        <IconComponent width={69} height={80} color={color} />
                      </View>

                      <Text
                        style={{
                          fontSize: 14,
                          color: color,
                          textAlign: "center",
                          fontWeight: "400",
                          width: 67,
                        }}
                      >
                        {item.lable}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={{ color: "#999", fontSize: 14 }}>
                Không có dữ liệu
              </Text>
            )}
          </View>

          {/* LOADING LOGO */}
          {loading && (
            <View
              style={{
                top: 140,
                left: 177,
                marginTop: 45,
                justifyContent: "center",
                position: "absolute",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <Animated.View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  backgroundColor: "rgba(0, 174, 239, 0.15)",
                  position: "absolute",
                  transform: [
                    {
                      scale: spinValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      }),
                    },
                  ],
                }}
              />

              <Animated.View
                style={{
                  width: 53,
                  height: 53,
                  borderWidth: 2,
                  borderColor: "#00AEEF",
                  borderRadius: 50,
                  position: "absolute",
                  transform: [{ rotate: spin }],
                  borderTopColor: "transparent",
                  opacity: spinValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.7, 1, 0.7],
                  }),
                  shadowColor: "#00AEEF",
                  shadowOpacity: 0.9,
                  shadowRadius: 30,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 20,
                }}
              />

              <Image
                source={require("../../assets/logo-bao-hiem-xa-hoi-viet-nam.png")}
                style={{
                  width: 45,
                  height: 45,
                  resizeMode: "contain",
                  borderRadius: 40,
                  backgroundColor: "#fff",
                }}
              />
            </View>
          )}

          {/* NỘI DUNG LIST */}
          {!loading && (
            <FlatList
              ref={flatListRef}
              data={tabsData}
              renderItem={renderTabs}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
              scrollEventThrottle={16}
              snapToInterval={SCREEN_WIDTH}
              decelerationRate="fast"
              style={styles.flatList}
              contentContainerStyle={{ paddingBottom: 80 }} // chừa chỗ cho Taba
            />
          )}
        </View>

        {/* ========= TABA Ở DƯỚI CÙNG ========= */}
        <Taba navigation={navigation} activeScreen="PersonalManagement" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",

    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  content: {
    flex: 1, // chiếm hết phần còn lại
    paddingBottom: 8, // nhỏ cho đẹp
  },

  flatList: {
    flex: 1,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
    padding: 10,
  },
  title: {
    color: "#3c639e",
    fontSize: 16,
  },
  textNormal: {
    fontSize: 14,
    marginTop: 2,
    color: "#777",
  },
  bold: {},
  red: {
    color: "red",
  },
  table: {
    borderColor: "#3766a1",
    borderLeftWidth: 1,

    overflow: "hidden",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#3766a1",
  },
  header: {
    backgroundColor: "#3766a1",
  },

  cell: {
    borderRightWidth: 1,
    borderColor: "#3766a1",
    justifyContent: "center", // giữa trên–dưới
    alignItems: "center", // giữa trái–phải
    paddingVertical: 8,
    fontSize: 14,
    padding: 8,
  },
  textCell: {
    textAlign: "center",
    fontSize: 13,
  },
  headerText: {
    color: "#fff",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: "600",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 9,
    backgroundColor: "#fff",
  },
  tabItem: {
    alignItems: "center",
    paddingHorizontal: 3,
  },
  tabItemActive: {
    // backgroundColor: "#e3f2fd",
  },
  tabText: { color: "#888" },
  tabActive: { color: "#0071CE", fontWeight: "bold" },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  indicatorActive: {
    backgroundColor: "#0071CE",
    width: 24,
  },
  viewtable: {
    marginTop: 10,
    paddingLeft: 9,
    paddingRight: 9,
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalHeaderTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  modalDateRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  modalDateItem: {
    flex: 1,
  },
  modalDateLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  modalDateValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  modalInfoBox: {
    backgroundColor: "#1976d2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalInfoText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  modalSalaryTable: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  modalTableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTableLabel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  modalTableValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    textAlign: "right",
  },
});

export default TableScreen;
