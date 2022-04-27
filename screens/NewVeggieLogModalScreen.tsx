import { useLayoutEffect, useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { Text, View } from "../components/Themed";
import { GardenTabScreenProps } from "../types";
import { format } from "date-fns";
import { useAppDispatch } from "../store";
import { gardenActions } from "../services/garden/gardenSlice";
import { Calendar } from "../components/shared/Calendar";
import { CrossBtn } from "../components/shared/CrossBtn";

export const NewVeggieLogModalScreen = ({
  navigation,
  route,
}: GardenTabScreenProps<"VeggieScreen">) => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [date, setDate] = useState(Date.now());
  const [notes, setNotes] = useState("");
  const { gardenId, bedId, veggieId } = route.params;

  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    dispatch(
      gardenActions.addVeggieLog({
        gardenId,
        bedId,
        veggieId,
        newLog: { date, notes },
      })
    );
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Add" onPress={handleSubmit} />,
    });
  }, [navigation, date, notes]);

  const dateCalFormatted = format(new Date(date), "yyyy-MM-dd");

  return (
    <View style={styles.container}>
      {calendarVisible ? (
        <View style={styles.calendar}>
          <CrossBtn
            style={{ padding: 5, alignSelf: "flex-end" }}
            onPress={() => setCalendarVisible(false)}
          />
          <Calendar
            current={dateCalFormatted}
            onDayPress={({ timestamp }) => {
              setDate(timestamp);
              setCalendarVisible(false);
            }}
            markedDates={{
              [dateCalFormatted]: { selected: true },
            }}
          />
        </View>
      ) : (
        <Text style={styles.date} onPress={() => setCalendarVisible(true)}>
          {format(new Date(date), "d MMMM yyyy")}
        </Text>
      )}

      <TextInput
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
        style={styles.notesContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  date: { fontSize: 30, fontWeight: "bold", marginBottom: 20 },
  calendar: {
    borderColor: "#d5d5d5",
    borderWidth: 2,
    borderRadius: 10,
    padding: 2,
    marginBottom: 10,
  },
  notesContainer: {
    paddingTop: 10,
    borderColor: "#d5d5d5",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    height: 92,
    maxHeight: 92,
  },
});