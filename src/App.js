// App.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";
import { Asset } from "expo-asset";

import PersonalManagementScreen from "./screens/PersonalManagementScreen";
import ParticipationScreen from "./screens/ParticipationScreen";
import LoginScreen from "./screens/LoginScreen";
import Taba from "./components/Taba";

const Stack = createNativeStackNavigator();

// 👉 Expo Go hoặc Dev Client (không phải app standalone)
const isExpoLike = Constants.appOwnership !== "standalone";

// Native splash: chỉ giữ khi KHÔNG chạy Expo Go/Dev Client
if (!isExpoLike) {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

// React Splash (dùng cho Expo Go/Dev Client để thấy ảnh full)
function SplashReact() {
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Image
        source={require("../assets/anhnenloading.png")} // ✅ đúng đường dẫn
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover" // ✅ phủ kín màn
        onError={(e) =>
          console.log("Splash image error:", e.nativeEvent?.error)
        }
      />
      <StatusBar hidden />
    </View>
  );
}

export default function App() {
  const [assetsReady, setAssetsReady] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const hasHiddenRef = useRef(false);

  // 1) Preload ảnh splash (đảm bảo có file & không lỗi)
  useEffect(() => {
    (async () => {
      try {
        await Asset.fromModule(
          require("../assets/anhnenloading.png")
        ).downloadAsync();
        // delay nhỏ cho chắc (tránh “nháy” trên một số máy)
        await new Promise((r) => setTimeout(r, 600));
      } catch (e) {
        console.log("Preload splash error:", e);
      } finally {
        setAssetsReady(true);
      }
    })();
  }, []);

  // 2) Load dữ liệu ban đầu (token…)
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setIsLoggedIn(!!token);
      } catch (e) {
        console.log("check token error:", e);
      } finally {
        setAppReady(true);
      }
    })();
  }, []);

  // 3) Ẩn native splash khi root layout xong (chỉ áp dụng khi build thật)
  const onLayoutRootView = useCallback(async () => {
    if (!isExpoLike && assetsReady && appReady && !hasHiddenRef.current) {
      hasHiddenRef.current = true;
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [assetsReady, appReady]);

  // 👉 Expo Go/Dev Client: hiển thị React Splash cho tới khi ảnh & app sẵn sàng
  if (isExpoLike && (!assetsReady || !appReady)) {
    return <SplashReact />;
  }

  // 👉 Build thật: để system/native splash hiển thị; có thể show spinner tạm nếu muốn
  if (!isExpoLike && (!assetsReady || !appReady)) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "PersonalManagement" : "Login"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="PersonalManagement"
            component={PersonalManagementScreenWithTaba}
          />
          <Stack.Screen
            name="QuaTrinhThamGia"
            component={ParticipationScreenWithTaba}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </View>
  );
}

// Wrapper
function PersonalManagementScreenWithTaba({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <PersonalManagementScreen />
    </View>
  );
}

function ParticipationScreenWithTaba({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <ParticipationScreen navigation={navigation} />
    </View>
  );
}
