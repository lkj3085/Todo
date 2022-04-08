import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@toDo";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDo, setTodo] = useState({});

  useEffect(() => {
    loadTodo();
  }, []);

  const plan = () => setWorking(false);
  const work = () => setWorking(true);

  const onChangeText = (payload) => setText(payload);
  const saveTodo = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadTodo = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s) {
      setTodo(JSON.parse(s));
    }
  };

  const addTodo = async () => {
    if (text === "") {
      return;
    }
    // const newTodo = Object.assign({}, toDo, {
    //   [Date.now()]: { text, work: working },
    // });
    const newTodo = { ...toDo, [Date.now()]: { text, working } };
    setTodo(newTodo);
    await saveTodo(newTodo);
    setText("");
  };

  const deleteTodo = (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("Delete?");
      if (ok) {
        const newTodo = { ...toDo };
        delete newTodo[key];
        setTodo(newTodo);
        saveTodo(newTodo);
      }
    } else {
      Alert.alert("Delete", "삭제하기", [
        { text: "취소" },
        {
          text: "확인",
          onPress: async () => {
            const newTodo = { ...toDo };
            delete newTodo[key];
            setTodo(newTodo);
            await saveTodo(newTodo);
          },
        },
      ]);
    }

    return;
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: "600",
              color: working ? "white" : theme.grey,
            }}
          >
            할 일
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={plan}>
          <Text
            style={{
              fontSize: 38,
              fontWeight: "600",
              color: working ? theme.grey : "white",
            }}
          >
            계획
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={addTodo}
        value={text}
        style={styles.input}
        placeholder={working ? "내가 해야 할 일" : "앞으로의 일정"}
        placeholderTextColor="black"
      />
      <ScrollView>
        {Object.keys(toDo).map((key) =>
          toDo[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDo[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 25,
    fontSize: 15,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
