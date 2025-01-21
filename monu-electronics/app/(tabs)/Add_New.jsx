import React, { useState } from "react";
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

import Colors from "../../constant/Colors";
import { launchImageLibrary } from "react-native-image-picker";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebaseConfig";

export default function Add_New() {
  const [contactNo, setContactNo] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [screenRatio, setScreenRatio] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [expense, setExpense] = useState("");
  const [images, setImages] = useState([]); // State to store selected images
  const [serviceType, setServiceType] = useState(""); // State to store service type (Shop or Field)

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
      if (response.didCancel) {
        console.log("User  cancelled image picker");
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
      selectedBrand,
      screenRatio,
      selectedProblem,
      receiverName,
      expense,
      images, // Log selected images
      serviceType, // Include service type in the form submission
    });
    if (
      !contactNo ||
      !selectedBrand ||
      !selectedProblem ||
      !receiverName ||
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
        setSelectedBrand("");
        setScreenRatio("");
        setSelectedProblem("");
        setReceiverName("");
        setExpense("");
        setImages([]);
        setServiceType("");
      } catch (e) {
        alert("Error", e);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Customer Contact Number */}
      <Text style={styles.label}>Customer Contact Number*</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Contact Number"
        value={contactNo}
        onChangeText={setContactNo}
        keyboardType="phone-pad"
        required
      />

      {/* Select Brand Dropdown */}
      <Text style={styles.label}>Select Brand</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedBrand}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedBrand(itemValue)}
        >
          <Picker.Item label="Select Brand" value="" />
          <Picker.Item label="Samsung" value="Samsung" />
          <Picker.Item label="LG" value="LG" />
          <Picker.Item label="Sony" value="Sony" />
          <Picker.Item label="MI" value="MI" />
          <Picker.Item label="Micromax" value="Micromax" />
          <Picker.Item label="Realme" value="Realme" />
          <Picker.Item label="Toshiba" value="Toshiba" />
          <Picker.Item label="AKAI" value="AKAI" />
          <Picker.Item label="Sunsui" value="Sunsui" />
          <Picker.Item label="Videocon" value="Videocon" />
          <Picker.Item label="Onida" value="Onida" />
          <Picker.Item label="Haier" value="Haier" />
          <Picker.Item label="Phillips" value="Phillips" />
          <Picker.Item label="Hisense" value="Hisense" />
          <Picker.Item label="OnePlus" value="OnePlus" />
          <Picker.Item label="TCL" value="TCL" />
          <Picker.Item label="BPL" value="BPL" />
          <Picker.Item label="Xiomi" value="Xiomi" />
          <Picker.Item label="Sharp" value="Sharp" />
          <Picker.Item label="Blaupunkt" value="Blaupunkt" />
          <Picker.Item label="BOE" value="BOE" />
          <Picker.Item label="JVC" value="JVC" />
          <Picker.Item label="Panasonic" value="Panasonic" />
        </Picker>
      </View>

      {/* Select Screen Ratio Dropdown */}
      <Text style={styles.label}> Screen Size (in inches)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={screenRatio}
          style={styles.picker}
          onValueChange={(itemValue) => setScreenRatio(itemValue)}
        >
          <Picker.Item label="Select Screen Size" value="" />
          <Picker.Item label="21 inches" value="21" />
          <Picker.Item label="28 inches" value="28" />
          <Picker.Item label="32 inches" value="32" />
          <Picker.Item label="40 inches" value="40" />
          <Picker.Item label="50 inches" value="50" />
          <Picker.Item label="55 inches" value="55" />
        </Picker>
      </View>

      {/* Select Problem Dropdown */}
      <Text style={styles.label}>Select Problem</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedProblem}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedProblem(itemValue)}
        >
          <Picker.Item label="Select Problem" value="" />
          <Picker.Item label="Panel" value="Panel" />
          <Picker.Item label="Screen" value="Screen" />
          <Picker.Item label="Backlight" value="Backlight" />
          <Picker.Item label="Sound" value="Sound" />
          <Picker.Item label="Mother Board" value="MotherBoard" />
          <Picker.Item label="Power Supply" value="PowerSupply" />
        </Picker>
      </View>

      {/* Receiver Name */}
      <Text style={styles.label}>Receiver Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Receiver Name"
        value={receiverName}
        onChangeText={setReceiverName}
      />

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
});
