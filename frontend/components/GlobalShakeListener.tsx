import React, { useEffect } from "react";
import { Alert } from "react-native";
import RNShake from "react-native-shake";
import { useNavigation } from "@react-navigation/native";

const GlobalShakeListener: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      // Example action: Show alert or navigate
      Alert.alert(
        "Emergency Triggered 🚨",
        "Do you want to send a call for help?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Send Help", 
            style: "destructive", 
            onPress: () => navigation.navigate("EmergencyScreen" as never)
          }
        ]
      );
    });

    return () => subscription.remove();
  }, [navigation]);

  return null; // invisible component
};

export default GlobalShakeListener;
