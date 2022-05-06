import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import { Button } from "react-native-elements";
import { View } from "../Themed";

type props = {
  routeName: string;
  selectedGardenId?: string;
};

export const AddCardButton: FC<props> = ({ routeName, selectedGardenId }) => {
  const navigation = useNavigation();
  const areaTitle = routeName === "GardenTabScreen" ? "garden" : "bed";
  return (
    <View>
      <Button
        onPress={() =>
          navigation.navigate("CreateCardModal", {
            areaTitle,
            routeName,
            selectedGardenId,
          })
        }
        title={`Add new ${areaTitle}`}
        containerStyle={{
          borderRadius: 30,
          marginHorizontal: 40,
          marginVertical: 30,
          width: 200,
        }}
      />
    </View>
  );
};
