import { StyleSheet, Image, FlatList, Pressable } from "react-native";
import { View, Text } from "../components/Themed";
import { GardenTabScreenProps } from "../types";
import { format } from "date-fns";
import { useAppSelector } from "../store";
import { gardenSelectors } from "../services/garden/garden.selectors";
import { VeggieNotesField } from "../components/VeggieNotesField";
import { ActionButton } from "../components/shared/ActionButton";
import { useEffect, useState } from "react";
import { SortBtn } from "../components/shared/SortBtn";
import { MaterialIcons } from "@expo/vector-icons";
import { TagObject, VeggieLog } from "../services/types";
import { Tag } from "../components/shared/Tags/TagElement";
import { nanoid } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-elements";

export const VeggieScreen = ({
  navigation,
  route,
}: GardenTabScreenProps<"VeggieScreen">) => {
  const { selectedGardenId, selectedBedId, veggieId } = route.params;
  const [logsDescending, setLogsDescending] = useState(true);

  const [logsWithPic, setLogsWithPic] = useState<VeggieLog[] | undefined>([]);
  const [logPics, setlogPics] = useState<string[]>([]);

  const veggie = useAppSelector((state) =>
    gardenSelectors.selectVeggieWithSortedLogs(
      state,
      selectedGardenId,
      selectedBedId,
      veggieId,
      logsDescending
    )
  );

  const veggieLogs = veggie?.logs;

  const renderDisplayTag = ({ item }: TagObject) => (
    <Tag
      tagLabel={item.tagLabel}
      tagColor={item.tagColor}
      tagIcon={item.tagIcon}
    />
  );

  //Telmo: check that using tempArr first is better?? TS line 60
  useEffect(() => {
    const tempArr: VeggieLog[] = [];
    veggieLogs?.map((log) => {
      if (log.payloadPics!.length > 0) {
        tempArr.push(log);
      }
      setLogsWithPic(tempArr);
    });
  }, []);

  const convertToUri = async (key: string) => {
    try {
      const uri = await AsyncStorage.getItem(key);
      console.log("converted uri ", uri);
      return uri;
    } catch (error) {
      console.log(error);
    }
  };

  //***Telmo: Ts problem on line 83 if I take away the bang operator
  const createUriList = () => {
    const pictureList:
      | Promise<{ logId: string; uri: string | null }>[]
      | undefined = logsWithPic?.map((log: VeggieLog, index: number) => {
      return new Promise<{ logId: string; uri: string | null }>(
        async (resolve, reject) => {
          const logPic = await convertToUri(log.payloadPics![0]);
          resolve({ logId: log.id, uri: logPic });
        }
      );
    });
    return Promise.all(pictureList);
  };

  useEffect(() => {
    const displayLogPics = () => {
      createUriList().then((newPicArray) => {
        console.log("***promise results: ", newPicArray);
        setlogPics(newPicArray);
      });
    };
    displayLogPics();
  }, [logsWithPic]);

  const con = () => {
    console.log("********************");
    console.log("logsWithPic ", logsWithPic);
    console.log("pics", logPics);
  };

  return veggie ? (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {veggie.veggieInfo?.image && (
          <Image style={styles.img} source={{ uri: veggie.veggieInfo.image }} />
        )}
        <View style={{ alignItems: "flex-end" }}>
          <Text>
            Sowed:{" "}
            {veggie.sowDate && format(new Date(veggie.sowDate), "dd/MM/yy")}
          </Text>
          <Text>
            Harvest:{" "}
            {veggie.harvestDate &&
              format(new Date(veggie.harvestDate), "dd/MM/yy")}
          </Text>
        </View>
      </View>
      {veggie.veggieInfo?.name && (
        <Text style={styles.title}>{veggie.veggieInfo.name}</Text>
      )}

      <VeggieNotesField
        notes={veggie.notes}
        navigation={navigation}
        route={route}
      />
      <Button title={"con"} onPress={con} />
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={styles.heading}>Logs</Text>
          <SortBtn
            descending={logsDescending}
            onPress={() => setLogsDescending((prev) => !prev)}
            style={{ marginRight: 20 }}
          />
          <Pressable
            onPress={() =>
              navigation.navigate("VeggieTimelineScreen", {
                veggieLogs,
              })
            }
          >
            <MaterialIcons name="timeline" size={24} color="black" />
          </Pressable>
        </View>
        <FlatList
          data={veggieLogs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("EditVeggieLogModal", {
                  selectedGardenId,
                  selectedBedId,
                  veggieId,
                  logId: item.id,
                })
              }
              style={{
                borderColor: "#d5d5d5",
                borderWidth: 2,
                borderRadius: 10,
                padding: 10,
                marginVertical: 5,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                {/* <Image
                  source={{ uri: logPics[0] }}
                  style={{ width: 50, height: 50 }}
                /> */}
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {format(new Date(item.date), "d MMM yy")}
                </Text>
                {item.payloadTags && (
                  <FlatList
                    data={item.payloadTags}
                    keyExtractor={() => nanoid()}
                    horizontal={true}
                    renderItem={renderDisplayTag}
                  />
                )}
              </View>
              <Text>Notes: {item.notes}</Text>
            </Pressable>
          )}
        />
      </View>
      <ActionButton
        text="Add Log"
        onPress={() =>
          navigation.navigate("NewVeggieLogModal", {
            selectedGardenId,
            selectedBedId,
            veggieId,
          })
        }
      />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginRight: "auto",
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginRight: 10,
  },
});
