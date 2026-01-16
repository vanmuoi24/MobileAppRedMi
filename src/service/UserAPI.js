import instance from "../api/AixiosAPI";

const UserGetById = (id) => {
  return instance.get(`users/${id}`);
};

export { UserGetById };
