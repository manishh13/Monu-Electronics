import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { PermissionsAndroid, Platform } from "react-native";
import Autocomplete from "react-native-autocomplete-input";

import Colors from "../../constant/Colors";
import { launchImageLibrary } from "react-native-image-picker";
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
  const [contactNo, setContactNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [screenRatio, setScreenRatio] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [expense, setExpense] = useState("");
  const [images, setImages] = useState([]); // State to store selected images
  const [serviceType, setServiceType] = useState(""); // State to store service type (Shop or Field)
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState(brands);
  const [screenSizeQuery, setScreenSizeQuery] = useState("");
  const [screenSizeSuggestions, setScreenSizeSuggestions] =
    useState(screenSizes);
  const [problemQuery, setProblemQuery] = useState("");
  const [problemSuggestions, setProblemSuggestions] = useState(problems);
  const [receiverName, setReceiverName] = useState("");

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
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs access to your storage to select images.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS doesn't require explicit permission for image picker
  };

  // Function to handle image selection
  const handleImagePicker = async () => {
    console.log("Image selection");
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.log("Permission denied");
      return;
    }
    const options = {
      mediaType: "photo",
      selectionLimit: 10, // Set to 10 for selecting up to 10 images
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      console.log(response);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.assets) {
        // Add selected images to the state
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
      images, // Log selected images
      serviceType, // Include service type in the form submission
    });
    if (
      (!contactNo && !customerName) ||
      !selectedBrand ||
      !selectedProblem ||
      !expense ||
      !serviceType
    ) {
      alert("Please fill all the required fields.");
      return;
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
          serviceType: serviceType,
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

  return (
    <ScrollView style={styles.container}>
      {/* Customer Contact Number */}
      <Text style={styles.label}>Customer Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Contact Number"
        value={contactNo}
        onChangeText={setContactNo}
        keyboardType="phone-pad"
      />

      {/* Customer Name */}
      <Text style={styles.label}>Customer Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
      />

      {/* Select Brand Dropdown */}
      <Text style={styles.label}>Brand</Text>
      <View>
        <Autocomplete
          data={
            query
              ? suggestions.filter((brand) =>
                  brand.toLowerCase().includes(query.toLowerCase())
                )
              : []
          }
          defaultValue={query}
          onChangeText={(text) => setQuery(text)}
          placeholder="Type brand name"
          onSelectItem={(item) => {
            setSelectedBrand(item);
            setQuery(item);
          }}
        />
        {query && !suggestions.includes(query) && (
          <TouchableOpacity onPress={handleAddSuggestion}>
            <Text>Add "{query}" to suggestions</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Select Screen Size */}
      <Text style={styles.label}>Screen Size (in inches)</Text>
      <View>
        <Autocomplete
          data={
            screenSizeQuery
              ? screenSizeSuggestions.filter((size) =>
                  size.toLowerCase().includes(screenSizeQuery.toLowerCase())
                )
              : []
          }
          defaultValue={screenSizeQuery}
          onChangeText={(text) => setScreenSizeQuery(text)}
          placeholder="Type screen size"
          onSelectItem={(item) => {
            setScreenRatio(item);
            setScreenSizeQuery(item);
          }}
        />
        {screenSizeQuery &&
          !screenSizeSuggestions.includes(screenSizeQuery) && (
            <TouchableOpacity onPress={handleAddScreenSizeSuggestion}>
              <Text>Add "{screenSizeQuery}" to suggestions</Text>
            </TouchableOpacity>
          )}
      </View>

      {/* Select Problem */}
      <Text style={styles.label}>Select Problem</Text>
      <View>
        <Autocomplete
          data={
            problemQuery
              ? problemSuggestions.filter((problem) =>
                  problem.toLowerCase().includes(problemQuery.toLowerCase())
                )
              : []
          }
          defaultValue={problemQuery}
          onChangeText={(text) => setProblemQuery(text)}
          placeholder="Type problem"
          onSelectItem={(item) => {
            setSelectedProblem(item);
            setProblemQuery(item);
          }}
        />
        {problemQuery && !problemSuggestions.includes(problemQuery) && (
          <TouchableOpacity onPress={handleAddProblemSuggestion}>
            <Text>Add "{problemQuery}" to suggestions</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Expense */}
      <Text style={styles.label}>Expense</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Expense in Rupees"
        value={expense}
        onChangeText={setExpense}
        keyboardType="numeric"
      />

      {/* Select Service Type Dropdown */}
      <Text style={styles.label}> Service Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={serviceType}
          style={styles.picker}
          onValueChange={(itemValue) => setServiceType(itemValue)}
        >
          <Picker.Item label="Select Service Type" value="" />
          <Picker.Item label="Shop" value="Shop" />
          <Picker.Item label="Field" value="Field" />
        </Picker>
      </View>

      {/* Image Selection Button */}
      <TouchableOpacity
        onPress={handleImagePicker}
        style={styles.imagePickerButton}
      >
        <Text style={styles.imagePickerButtonText}>Select Images</Text>
      </TouchableOpacity>

      {/* Display Selected Images */}
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.image} />
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.submitButton}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
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
  autocompleteContainer: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
});
