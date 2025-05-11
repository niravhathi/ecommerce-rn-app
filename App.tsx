import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import ApiManager from "./src/api/ApiManager";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./src/context/AppContext";
import RootStack from "./src/navigation/RootStack";
const App = () => {
  useEffect(() => {
    ApiManager.init(); // Initialize the API manager (no need to pass URL anymore)
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          {/* <RootNavigator /> */}
          <RootStack />
        </SafeAreaProvider>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
