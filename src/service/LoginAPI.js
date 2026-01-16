import instance from "../api/AixiosAPI";
const userLogin = (data) => {
  return instance.post("auth/login", data);
};

export { userLogin };
