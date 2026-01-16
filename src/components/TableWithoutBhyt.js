import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import ViewDetailModal from "../screens/ViewDetail";
export default function TableWithoutBhyt({ item, onOpenModal }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  function formatDate(dateString) {
    if (!dateString) return "";
    return dayjs(dateString).format("MM/YYYY");
  }
  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.header]}>
        <View style={[styles.cell, { flex: 1.5 }]}>
          <Text style={styles.headerText}>Từ tháng</Text>
        </View>
        <View style={[styles.cell, { flex: 1.3 }]}>
          <Text style={styles.headerText}>Đến tháng</Text>
        </View>
        <View style={[styles.cell, { flex: 2.5 }]}>
          <Text style={styles.headerText}>Đơn vị</Text>
        </View>
        <View style={[styles.cell, { flex: 2 }]}>
          <Text style={styles.headerText}>Nghề nghiệp Chức vụ</Text>
        </View>
        <View style={[styles.cell, { flex: 0.8, borderRightWidth: 0 }]}>
          <Text style={styles.headerText}></Text>
        </View>
      </View>

      {item.data.map((dataItem, idx) => (
        <View
          key={idx}
          style={[styles.row, idx % 2 === 0 && { backgroundColor: "#fdfdfd" }]}
        >
          <View style={[styles.cell, { flex: 1.4 }]}>
            <Text style={styles.textCell}>{formatDate(dataItem.tu)}</Text>
          </View>
          <View style={[styles.cell, { flex: 1.4 }]}>
            <Text style={styles.textCell}>{formatDate(dataItem.den)}</Text>
          </View>
          <View style={[styles.cell, { flex: 2.7 }]}>
            <Text style={styles.textCell}>{dataItem.donvi}</Text>
          </View>
          <View style={[styles.cell, { flex: 2 }]}>
            <Text style={styles.textCell}>{dataItem.nghe}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.cell,
              {
                flex: 0.6,
                alignItems: "center",
                borderRightWidth: 0,
                borderColor: "#3766a1",
              },
            ]}
            onPress={() => {
              setModalVisible(true);
              setSelectedData(dataItem);
            }}
          >
            <FontAwesome
              name="eye"
              size={20}
              color="#3766a1"
              style={{ marginLeft: 3 }}
            />
          </TouchableOpacity>
        </View>
      ))}
      <ViewDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={selectedData}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  table: {
    borderColor: "#3766a1",
    borderLeftWidth: 0.5,

    overflow: "hidden",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",

    borderColor: "#3766a1",
  },
  header: {
    backgroundColor: "#3766a1",
  },

  cell: {
    borderRightWidth: 0.5,
    borderBottomWidth: 0.2,

    borderColor: "#3766a1",
    justifyContent: "center", // giữa trên–dưới
    alignItems: "center", // giữa trái–phải
    paddingVertical: 2,
  },
  textCell: {
    textAlign: "center",
    fontSize: 12,
    paddingVertical: 9,
    color: "#777",
  },
  headerText: {
    color: "#fff",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 12,
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
    marginTop: 6,
    paddingLeft: 9,
    paddingRight: 9,
    flex: 1,
  },
});
