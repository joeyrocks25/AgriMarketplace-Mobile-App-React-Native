import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Platform,
} from "react-native";

function Screen({ children, style }) {
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  return (
    <SafeAreaView
      style={[styles.screen, { paddingTop: statusBarHeight }, style]}
    >
      <StatusBar style="auto" />
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  view: {
    flex: 1,
  },
});

export default Screen;
