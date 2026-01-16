import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ViewDetailModal from "../screens/ViewDetail";
import { useState } from "react";
import dayjs from "dayjs";

export default function TableWithBhyt({ item, onOpenModal }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  function formatDate(dateString) {
    if (!dateString) return "";
    return dayjs(dateString).format("MM/YYYY");
  }

  return (
    <View style={styles.table}>
      {/* HEADER */}
      <View style={[styles.row, styles.header]}>
        <View style={[styles.cell, { flex: 0.9 }]}>
          <Text style={styles.headerText}>Từ tháng</Text>
        </View>
        <View style={[styles.cell, { width: 66 }]}>
          <Text style={[styles.headerText, { width: 53 }]}>Đến tháng</Text>
        </View>
        <View style={[styles.cell, { flex: 2.9 }]}>
          <Text style={styles.headerText}>Đơn vị</Text>
        </View>
        <View style={[styles.cell, { flex: 0.4, borderRightWidth: 0 }]}>
          <Text style={styles.headerText}></Text>
        </View>
      </View>

      {/* BODY */}
      {item.data.map((dataItem, idx) => (
        <View
          key={idx}
          style={[styles.row, idx % 2 === 0 && { backgroundColor: "#fdfdfd" }]}
        >
          <View style={[styles.cell, { flex: 0.9 }]}>
            <Text style={styles.textCell}>{formatDate(dataItem.tu)}</Text>
          </View>

          <View style={[styles.cell, { flex: 0.9 }]}>
            <Text style={styles.textCell}>{formatDate(dataItem.den)}</Text>
          </View>

          <View style={[styles.cell, { flex: 2.9 }]}>
            <Text style={styles.textCell}>{dataItem.donvi}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.cell,
              { flex: 0.4, borderRightWidth: 0, alignItems: "center" },
            ]}
            onPress={() => {
              setModalVisible(true);
              setSelectedData(dataItem);
            }}
          >
            <FontAwesome name="eye" size={20} color="#3766a1" />
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
    borderColor: "#c7dcfc",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRightWidth: 0,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#c7dcfc",
  },
  header: {
    backgroundColor: "#3766a1",
  },
  cell: {
    borderRightWidth: 1,
    borderColor: "#c7dcfc",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
  },
  headerText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  textCell: {
    fontSize: 12,
    color: "#777",

    textAlign: "center",
    paddingVertical: 5,
  },
});
