import instance from "../api/AixiosAPI";

// Hàm lấy Participation theo userId và insuranceType
const getPartionByIdByType = (userId, insuranceType) => {
  return instance.get(
    `/participations/by-user/${userId}/type/${insuranceType}`
  );
};

export { getPartionByIdByType };
