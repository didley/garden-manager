import { StyleSheet } from "react-native";
import { AddBedCard } from "../components/AddBedCard";
import { BedCards } from "../components/BedCards";
import { View } from "../components/Themed";
import { GardenTabScreenProps } from "../types";

export const BedsTabScreen = ({
  navigation,
  route,
}: GardenTabScreenProps<"BedsTabScreen">) => {
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <View>
        <AddBedCard selectedGardenId={id} />
      </View>
      <View>
        <BedCards selectedGardenId={id} navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "50%",
  },
});
