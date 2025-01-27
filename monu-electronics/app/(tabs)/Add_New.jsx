import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { PermissionsAndroid, Platform } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { useLocalSearchParams } from "expo-router";
import Colors from "../../constant/Colors";
import { launchCamera } from "react-native-image-picker";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const brands = [
  "Samsung",
  "LG",
  "Sony",
  "MI",
  "Micromax",
  "Realme",
  "Toshiba",
  "AKAI",
  "Sunsui",
  "Videocon",
  "Onida",
  "Haier",
  "Phillips",
  "Hisense",
  "OnePlus",
  "TCL",
  "BPL",
  "Xiomi",
  "Sharp",
  "Blaupunkt",
  "BOE",
  "JVC",
  "Panasonic",
];

const screenSizes = [
  "21 inches",
  "28 inches",
  "32 inches",
  "40 inches",
  "50 inches",
  "55 inches",
];

const problems = [
  "Panel",
  "Screen",
  "Backlight",
  "Sound",
  "Mother Board",
  "Power Supply",
];

export default function Add_New() {
  // const params = useLocalSearchParams();
  // const item = JSON.parse(params.item);
  // console.log("Adding new item", item);
  // console.log("edit item", item);
  const [contactNo, setContactNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [screenRatio, setScreenRatio] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [expense, setExpense] = useState("");
  const [images, setImages] = useState([]); // State to store clicked images
  const [serviceType, setServiceType] = useState(""); // State to store service type (Shop or Field)
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState(brands);
  const [screenSizeQuery, setScreenSizeQuery] = useState("");
  const [screenSizeSuggestions, setScreenSizeSuggestions] =
    useState(screenSizes);
  const [problemQuery, setProblemQuery] = useState("");
  const [problemSuggestions, setProblemSuggestions] = useState(problems);
  const [receiverName, setReceiverName] = useState("");
  const [isFieldService, setIsFieldService] = useState(false);
  const [isShop, setIsShop] = useState(false);
  const [isLab, setIsLab] = useState(false);
  const [otherExpenses, setOtherExpenses] = useState("");

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setReceiverName(user.displayName);
      }
    });
    return unsubscribe;
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs access to your camera to click images.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const storageGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "Storage Permission",
              message: "App needs access to your storage to save images.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (storageGranted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  // Function to handle image click
  const handleImageClick = async () => {
    console.log("Image click");
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.log("Permission denied");
      return;
    }
    console.log("Permission granted");
    const options = {
      mediaType: "photo",
      saveToPhotos: true,
    };
    launchCamera(options, (response) => {
      console.log(response);
      if (response.didCancel) {
        console.log("User   cancelled image click");
      } else if (response.error) {
        console.log("ImageClick Error: ", response.error);
      } else if (response.assets) {
        // Add clicked image to the state
        setImages([...images, ...response.assets]);
      }
    });
  };

  const handleSubmit = async () => {
    // Handle form submission logic here
    console.log({
      contactNo,
      customerName,
      selectedBrand,
      screenRatio,
      selectedProblem,
      receiverName,
      expense,
      images, // Log clicked images
      serviceType, // Include service type in the form submission
      otherExpenses,
    });
    if (
      contactNo === "" &&
      customerName === "" &&
      selectedBrand === "" &&
      screenRatio === "" &&
      selectedProblem === "" &&
      expense === "" &&
      serviceType === ""
    ) {
      alert("Please fill all the required fields.");
      return;
    } else if (
      contactNo === "" ||
      customerName === "" ||
      selectedBrand === "" ||
      screenRatio === "" ||
      selectedProblem === "" ||
      expense === "" ||
      serviceType === ""
    ) {
      try {
        const docId = Date.now().toString();
        await setDoc(doc(db, "IncompleteForm", docId), {
          contactNo: contactNo,
          customerName: customerName,
          selectedBrand: selectedBrand,
          screenRatio: screenRatio,
          selectedProblem: selectedProblem,
          receiverName: receiverName,
          expense: expense,
          images: images,
          serviceType: isFieldService ? "Field" : isLab ? "Lab" : "Shop",
          otherExpenses: otherExpenses,
          createdAt: new Date(),
          status: "Incomplete",
          docId: docId, // Add the docId to the document
        });
        alert("Data saved successfully with docId: " + docId);
        setContactNo("");
        setCustomerName("");
        setSelectedBrand("");
        setScreenRatio("");
        setSelectedProblem("");
        setExpense("");
        setImages([]);
        setServiceType("");
        setQuery("");
        setOtherExpenses("");
      } catch (e) {
        alert("Error", e);
      }
    } else {
      try {
        const docId = Date.now().toString();
        await setDoc(doc(db, "PendingCases", docId), {
          contactNo: contactNo,
          customerName: customerName,
          selectedBrand: selectedBrand,
          screenRatio: screenRatio,
          selectedProblem: selectedProblem,
          receiverName: receiverName,
          expense: expense,
          images: images,
          serviceType: isFieldService ? "Field" : isLab ? "Lab" : "Shop",
          otherExpenses: otherExpenses,
          createdAt: new Date(),
          status: "Pending",
          docId: docId, // Add the docId to the document
        });
        alert("Data saved successfully with docId: " + docId);
        setContactNo("");
        setCustomerName("");
        setSelectedBrand("");
        setScreenRatio("");
        setSelectedProblem("");
        setExpense("");
        setImages([]);
        setServiceType("");
        setQuery("");
        setOtherExpenses("");
      } catch (e) {
        alert("Error", e);
      }
    }
  };

  const handleAddSuggestion = () => {
    if (query && !suggestions.includes(query)) {
      setSuggestions([...suggestions, query]);
    }
  };

  const handleAddScreenSizeSuggestion = () => {
    if (screenSizeQuery && !screenSizeSuggestions.includes(screenSizeQuery)) {
      setScreenSizeSuggestions([...screenSizeSuggestions, screenSizeQuery]);
    }
  };

  const handleAddProblemSuggestion = () => {
    if (problemQuery && !problemSuggestions.includes(problemQuery)) {
      setProblemSuggestions([...problemSuggestions, problemQuery]);
    }
  };

  const data = [
    { key: "customerContactNumber" },
    { key: "customerName" },
    { key: "brand" },
    { key: "screenSize" },
    { key: "problem" },
    { key: "expense" },
    { key: "serviceType" },
    { key: "otherExpenses" },
    { key: "imageClick" },
    { key: "submitButton" },
  ];

  const renderItem = ({ item }) => {
    switch (item.key) {
      case "customerContactNumber":
        return (
          <View>
            <Text style={styles.label}>Customer Contact Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Contact Number"
              value={contactNo}
              onChangeText={setContactNo}
              keyboardType="phone-pad"
            />
          </View>
        );
      case "customerName":
        return (
          <View>
            <Text style={styles.label}>Customer Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Customer Name"
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>
        );
      case "brand":
        return (
          <View>
            <Text style={styles.label}>Brand</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Type brand name"
                value={query}
                onChangeText={(text) => setQuery(text)}
              />
              {query !== selectedBrand && (
                <View style={styles.suggestionBox}>
                  <FlatList
                    data={
                      query
                        ? suggestions.filter((brand) =>
                            brand.toLowerCase().includes(query.toLowerCase())
                          )
                        : []
                    }
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedBrand(item);
                          setQuery(item);
                        }}
                      >
                        <Text style={styles.suggestionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                  />
                </View>
              )}
              {query && !suggestions.includes(query) && (
                <TouchableOpacity onPress={handleAddSuggestion}>
                  <Text>Add "{query}" to suggestions</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      case "screenSize":
        return (
          <View>
            <Text style={styles.label}>Screen Size (in inches)</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Type screen size"
                value={screenSizeQuery}
                onChangeText={(text) => setScreenSizeQuery(text)}
              />
              {screenSizeQuery !== screenRatio && (
                <View style={styles.suggestionBox}>
                  <FlatList
                    data={
                      screenSizeQuery
                        ? screenSizeSuggestions.filter((size) =>
                            size
                              .toLowerCase()
                              .includes(screenSizeQuery.toLowerCase())
                          )
                        : []
                    }
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setScreenRatio(item);
                          setScreenSizeQuery(item);
                        }}
                      >
                        <Text style={styles.suggestionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                  />
                </View>
              )}
              {screenSizeQuery &&
                !screenSizeSuggestions.includes(screenSizeQuery) && (
                  <TouchableOpacity onPress={handleAddScreenSizeSuggestion}>
                    <Text>Add "{screenSizeQuery}" to suggestions</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        );
      case "problem":
        return (
          <View>
            <Text style={styles.label}>Select Problem</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Type problem"
                value={problemQuery}
                onChangeText={(text) => setProblemQuery(text)}
              />
              {problemQuery !== selectedProblem && (
                <View style={styles.suggestionBox}>
                  <FlatList
                    data={
                      problemQuery
                        ? problemSuggestions.filter((problem) =>
                            problem
                              .toLowerCase()
                              .includes(problemQuery.toLowerCase())
                          )
                        : []
                    }
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedProblem(item);
                          setProblemQuery(item);
                        }}
                      >
                        <Text style={styles.suggestionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                  />
                </View>
              )}
              {problemQuery && !problemSuggestions.includes(problemQuery) && (
                <TouchableOpacity onPress={handleAddProblemSuggestion}>
                  <Text>Add "{problemQuery}" to suggestions</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      case "expense":
        return (
          <View>
            <Text style={styles.label}>Expense</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Expense in Rupees"
              value={expense}
              onChangeText={setExpense}
              keyboardType="numeric"
            />
          </View>
        );
      case "serviceType":
        return (
          <View>
            <Text style={styles.label}> Service Type</Text>
            <View style={styles.serviceTypeToggleContainer}>
              <View style={styles.serviceTypeToggle}>
                <TouchableOpacity
                  style={styles.serviceTypeToggleBox}
                  onPress={() => {
                    setIsFieldService(true);
                    setIsShop(false);
                    setIsLab(false);
                  }}
                >
                  <View
                    style={[
                      styles.serviceTypeToggleBoxInner,
                      isFieldService
                        ? styles.serviceTypeToggleBoxInnerActive
                        : null,
                    ]}
                  />
                </TouchableOpacity>
                <Text style={styles.serviceTypeToggleText}>Field</Text>
              </View>
              <View style={styles.serviceTypeToggle}>
                <TouchableOpacity
                  style={styles.serviceTypeToggleBox}
                  onPress={() => {
                    setIsFieldService(false);
                    setIsShop(true);
                    setIsLab(false);
                  }}
                >
                  <View
                    style={[
                      styles.serviceTypeToggleBoxInner,
                      isShop ? styles.serviceTypeToggleBoxInnerActive : null,
                    ]}
                  />
                </TouchableOpacity>
                <Text style={styles.serviceTypeToggleText}>Shop</Text>
              </View>
              <View style={styles.serviceTypeToggle}>
                <TouchableOpacity
                  style={styles.serviceTypeToggleBox}
                  onPress={() => {
                    setIsFieldService(false);
                    setIsShop(false);
                    setIsLab(true);
                  }}
                >
                  <View
                    style={[
                      styles.serviceTypeToggleBoxInner,
                      isLab ? styles.serviceTypeToggleBoxInnerActive : null,
                    ]}
                  />
                </TouchableOpacity>
                <Text style={styles.serviceTypeToggleText}>Lab</Text>
              </View>
            </View>
            {isFieldService && (
              <View>
                <Text style={styles.label}>Other Expenses</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Other Expenses in Rupees"
                  value={otherExpenses}
                  onChangeText={setOtherExpenses}
                  keyboardType="numeric"
                />
              </View>
            )}
          </View>
        );
      case "imageClick":
        return (
          <View>
            <TouchableOpacity
              onPress={handleImageClick}
              style={styles.imagePickerButton}
            >
              <Text style={styles.imagePickerButtonText}>Click Image</Text>
            </TouchableOpacity>
            <ScrollView horizontal={true}>
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.uri }}
                  style={styles.image}
                />
              ))}
            </ScrollView>
          </View>
        );
      case "submitButton":
        return (
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.submitButton}>Submit</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 0,
    color: Colors.primary,
  },
  input: {
    height: 50,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  imagePickerButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 20,
  },
  suggestionBox: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  suggestionText: {
    fontSize: 18,
    padding: 10,
  },
  serviceTypeToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    // backgroundColor: Colors.primary,
    marginBottom: 15,
  },
  serviceTypeToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceTypeToggleBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  serviceTypeToggleBoxInner: {
    width: 15,
    height: 15,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  serviceTypeToggleBoxInnerActive: {
    backgroundColor: Colors.primary,
  },
  serviceTypeToggleText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: "bold",
  },
});
