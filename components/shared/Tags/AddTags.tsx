import { nanoid } from "@reduxjs/toolkit";
import { useContext, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { Button, Divider } from "react-native-elements";
import { pressedTagsContext } from "../../../services/context";
import { TagObject } from "../../../services/types";
import { Text, View } from "../../Themed";
import {
  AddTagToList,
  convertToTag,
  defaultTagsList,
  RemoveTagFromList,
} from "./Tag.utils";
import { Tag } from "./TagElement";

export const AddTags = () => {
  const { pressedTags, setPressedTags } = useContext(pressedTagsContext);
  const [combinedTagsList, setCombinedTagsList] = useState([]);
  const [pressedTagObjectState, setPressedTagObjectState] = useState([]);
  const [selectableTags, setSelectableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  console.log("**AddTag Render**");
  useEffect(() => {
    console.log("onMount effects");
    const combinedTags: any = defaultTagsList.map((tag) => convertToTag(tag));
    setCombinedTagsList(combinedTags);
    console.log("effect pressed", pressedTags);
    setPressedTagObjectState(pressedTags);
    // filterList(pressedTags);
  }, []);

  useEffect(() => {
    const filteredList = combinedTagsList.filter((tag: any) => {
      return !pressedTags.some((t: any) => t.tagLabel === tag?.tagLabel);
    });
    console.log("filteredList: ", filteredList);
    setSelectableTags(filteredList);
  }, [pressedTags, combinedTagsList]);

  const filterList = (tagObject: any) => {
    if (tagObject.length > 0) {
      console.log("**tagObject**", tagObject);
      setSelectedTags(pressedTags);
    }
  };

  useEffect(() => {
    console.log("**pressed effect**");
    filterList(pressedTagObjectState);
    filterList(pressedTags);
  }, [pressedTags]);

  const selectableOnPress = (
    tag: string
    // setPressedTags: Dispatch<typeof tag[]>
  ) => {
    console.log("selectableOnPress");
    const pressedTagObject: any = AddTagToList(pressedTags, tag);
    setPressedTagObjectState(pressedTagObject);
    setPressedTags(pressedTagObject);
    // setPressedTags(AddTagToList(pressedTags, tag));
  };

  const selectedOnPress = (
    tag: string
    // setPressedTags: Dispatch<typeof tag[]>
  ) => {
    console.log("selectedOnPress");
    // setPressedTags(RemoveTagFromList(pressedTags, tag));
    const removeTag = RemoveTagFromList(pressedTags, tag);
    setPressedTags([...removeTag]);
  };

  // combine next two functions ans pass onPress prop
  // ***type error***
  const renderSelectableItem = ({ item }: any) => {
    return (
      <Pressable onPress={() => selectableOnPress(item.tagLabel)}>
        <Tag
          tagLabel={item.tagLabel}
          tagColor={item.tagColor}
          extraStyleProps={{ label: { paddingRight: 15 } }}
        />
      </Pressable>
    );
  };

  // ***type error***
  const renderSelectedItem = ({ item }: TagObject) => {
    return (
      <Pressable onPress={() => selectedOnPress(item.tagLabel)}>
        <Tag
          tagLabel={item.tagLabel}
          tagColor={item.tagColor}
          tagIcon={item.tagIcon}
          isRemovable={true}
        />
      </Pressable>
    );
  };

  const con = () => {
    console.log("AddTags: Pressed", pressedTags);
    console.log("AddTags: PressedObject", pressedTagObjectState);
    console.log("AddTags: Selected", selectedTags);
  };

  return (
    <View style={styles.container}>
      <Button title={"AddCon"} onPress={con} />
      <FlatList
        style={{ height: 100, backgroundColor: "orange" }}
        data={selectedTags}
        keyExtractor={() => nanoid()}
        extraData={pressedTags}
        horizontal={true}
        renderItem={renderSelectedItem}
      />
      <View style={styles.addContainer}>
        <Text style={styles.title}>Add Tag</Text>
        <FlatList
          data={selectableTags}
          keyExtractor={() => nanoid()}
          horizontal={true}
          renderItem={renderSelectableItem}
        />

        <Divider style={{ paddingTop: 30 }} />
        {/* <Text
          style={styles.createButton}
          onPress={() =>
            navigation.navigate("CreateTagModal", {
              // selectedGardenId,
              selectedBedId,
              veggieId,
            })
          }
        >
          Create New Tag
        </Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    // backgroundColor: "grey",
  },
  addContainer: {
    // justifyContent: "flex-end",
    // alignContent: "flex-end",
    backgroundColor: "rgba(236, 236, 236, 0.8)",
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    // height: 100,
  },
  createButton: {
    textAlign: "center",
    color: "rgb(52, 170,	220)",
    fontWeight: "bold",
    // marginTop: 40,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
