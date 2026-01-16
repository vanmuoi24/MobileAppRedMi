import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
  Animated,
  Easing,
  Alert,
  StatusBar as RNStatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { Ionicons } from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";
import {
  IconVietnam,
  FaceIdIcon,
  Lupxanh,
  Bangtin,
  TaiNghe,
  TiviPlay,
  Dinhvi,
  VanTay,
} from "../../assets/icon/icon";
import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { userLogin } from "../service/LoginAPI";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
export default function LoginScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const STATUSBAR_HEIGHT =
    Platform.OS === "android"
      ? RNStatusBar.currentHeight ?? 24
      : Constants.statusBarHeight;
  // Animation quay logo
  const startLogoSpin = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopLogoSpin = () => {
    spinValue.stopAnimation();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    if (loading) startLogoSpin();
    else stopLogoSpin();
  }, [loading]);

  const fetchLogin = async () => {
    if (!userName || !password)
      return Alert.alert("Thông báo", "Vui lòng nhập đủ thông tin");
    const data = { bhxhNumber: userName, password };
    setLoading(true);
    try {
      const res = await userLogin(data);
      if (res.data?.accessToken) {
        await AsyncStorage.setItem("token", res.data.accessToken);
        await AsyncStorage.setItem("user", JSON.stringify(res.data?.user));

        setTimeout(() => {
          stopLogoSpin();
          setLoading(false);
          navigation.replace("PersonalManagement");
        }, 3000);
      } else {
        stopLogoSpin();
        setLoading(false);
        Alert.alert("Sai tài khoản hoặc mật khẩu");
      }
    } catch (e) {
      stopLogoSpin();
      setLoading(false);
      Alert.alert("Không thể đăng nhập. Vui lòng thử lại.");
      console.log("Login error", e?.response?.data || e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Status Bar */}
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

      <ImageBackground
        source={require("../../assets/anhnen.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Top bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,

            gap: 290,
          }}
        >
          <TouchableOpacity>
            <Fontisto
              name="bell-alt"
              size={22}
              color="#fff"
              style={{ paddingLeft: 60, marginTop: 40 }}
            />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              paddingRight: 60,
              borderRadius: 5,
              marginTop: 40,
            }}
          >
            <IconVietnam width={30} height={26} />
          </View>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo-bao-hiem-xa-hoi-viet-nam.png")}
            style={styles.logo}
          />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name="person"
                size={20}
                color="#fff"
                style={{ marginBottom: 10 }}
              />
            </View>
            <TextInput
              placeholder="Mã số BHXH/Số ĐDCN/CCCD"
              placeholderTextColor="#888"
              style={styles.input}
              onChangeText={setUserName}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name="lock-closed"
                size={20}
                color="#fff"
                style={{ marginBottom: 10 }}
              />
            </View>
            <TextInput
              placeholder="Mật khẩu"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.linkRow}>
            <TouchableOpacity>
              <Text style={styles.linkText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.linkText}>Đăng ký tài khoản</Text>
            </TouchableOpacity>
          </View>

          {/* Nút đăng nhập + Face ID */}
          <View style={styles.viewlogin}>
            <TouchableOpacity style={styles.loginButton} onPress={fetchLogin}>
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
            <VanTay />
          </View>

          {loading && (
            <View
              style={{
                top: 75,
                left: 130,
                marginTop: 60,
                justifyContent: "center",
                position: "absolute",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <Animated.View
                style={{
                  width: 55,
                  height: 55,
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

          <TouchableOpacity style={styles.vnidButton}>
            <View style={styles.vnidContent}>
              <Text style={styles.vnidText}>
                Đăng nhập bằng tài khoản định danh điện tử
              </Text>
              <Image
                source={require("../../assets/vnid.png")}
                style={styles.vnidLogo}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <TouchableOpacity>
            <Text style={styles.footerTop}>Mời cài đặt VssID</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerBottom}>Chính sách quyền riêng tư</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerIcons}>
          <View style={styles.iconGroupLeft}>
            <View>
              <Bangtin />
            </View>
            <TaiNghe />

            <View>
              <Lupxanh />
            </View>
            {/* <Lupxanh /> */}
            <TiviPlay />
          </View>
          <View style={styles.iconGroupRight}>
            <Dinhvi />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "",
  },
  background: {
    flex: 0,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 97,
    height: 97,
    borderWidth: 1.5,
    borderRadius: 80,
    borderColor: "#fff",
    resizeMode: "contain",
    marginTop: 35,
  },
  form: {
    width: 330,
    marginBottom: 190,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    height: 50,
    marginBottom: 10,
    overflow: "hidden",
  },
  iconWrapper: {
    width: 37,
    height: "100%",
    backgroundColor: "#0068ad",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "#000",
    fontSize: 14,
    paddingHorizontal: 10,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  linkText: {
    color: "#3372b5",
    fontSize: 12,
  },
  viewlogin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
    gap: 5,
  },
  loginButton: {
    flex: 1,
    paddingVertical: 9.5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 3,
    borderWidth: 2,
    borderColor: "#0068ad",
  },
  loginText: {
    color: "#0068ad",
    fontSize: 17,
    fontWeight: "700",
  },
  vnidButton: {
    backgroundColor: "#D50000",
    paddingVertical: 0,
    paddingHorizontal: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  vnidContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  vnidText: {
    color: "#fff",
    fontSize: 16,
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 4,
    marginRight: 0,
    marginLeft: 15,
  },
  vnidLogo: {
    width: 65,
    height: 65,
    borderRadius: 6,
  },
  footerContainer: {
    position: "absolute",
    bottom: 230,
    width: "100%",
  },
  footerTop: {
    color: "#3372b5",
    fontSize: 14,
    textAlign: "center",
  },
  footerBottom: {
    color: "#3372b5",
    fontSize: 14,
    textAlign: "right",
    marginTop: 18,
    marginRight: 10,
  },
  footerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "85%",
    marginTop: 40,
    marginBottom: 147,
    marginRight: 30,
  },
  iconGroupLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconGroupRight: {
    alignItems: "center",
    marginLeft: 60,
  },
});
