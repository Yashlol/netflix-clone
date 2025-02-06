import React from "react";
import { View, Text, Button } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Home Screen</Text>
      <Button
        title="Go to Movie Details"
        onPress={() => navigation.navigate("MovieDetail")}
      />
    </View>
  );
};

export default HomeScreen;
