//
// client/src/pages/UploadPage.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MapPicker from "../components/MapPicker"; // Adjust path if needed
import 'leaflet/dist/leaflet.css';


const UploadPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  const [uploading, setUploading] = useState(false);

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
          // This line is now corrected with backticks
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data: uploadData } = await axios.post(
        "/api/upload",
        formData,
        uploadConfig
      );

      const newItem = {
        name,
        description,
        category,
        address,
        imageUrl: uploadData.imageUrl,
      };

      const itemConfig = {
        headers: {
          "Content-Type": "application/json",
          // This line is also corrected with backticks
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post("/api/items", newItem, itemConfig);

      setUploading(false);
      alert("Item created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating item:", error);
      setUploading(false);
      alert("Failed to create item.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-white p-4">
      <div className="w-full max-w-xl p-8 space-y-6 bg-white rounded-xl shadow-xl border border-emerald-200">
        <h1 className="text-3xl font-bold text-center text-emerald-700">
          List a New Item
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item Name"
            required
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            rows="4"
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address / Pickup Location"
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <p className="text-sm text-gray-600 mb-2">Or select on map:</p>
          <MapPicker onPick={(selectedAddress) => setAddress(selectedAddress)} />


          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-emerald-600 file:hover:bg-emerald-700"
          />
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition"
          >
            {uploading ? "Uploading..." : "List Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
// import React, { useState, useContext, useCallback, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
// import usePlacesAutocomplete, {
//   getGeocode,
//   getLatLng,
// } from "use-places-autocomplete";

// // These are outside the component to prevent re-renders
// const libraries = ["places"]; // Required for Places Autocomplete and Geocoding
// const mapContainerStyle = {
//   width: "100%",
//   height: "300px",
//   borderRadius: "0.5rem",
//   marginTop: "1rem",
//   zIndex: 0, // Ensure map is below autocomplete suggestions when they pop up
// };
// const defaultCenter = {
//   lat: 23.1815,
//   lng: 79.9864, // Approximate center for Jabalpur, Madhya Pradesh, India
// };

// const UploadPage = () => {
//   // Load the Google Maps JavaScript API script
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY,
//     libraries, // Load the 'places' library
//   });

//   // --- Form State Variables ---
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState(null); // Stores the File object for upload
//   const [location, setLocation] = useState(null);
//   const [marker, setMarker] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   // --- Address Input Mode State ---
//   const [useManualAddress, setUseManualAddress] = useState(false);
//   const [manualAddressInput, setManualAddressInput] = useState("");

//   // --- Context and Navigation ---
//   const { userInfo } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // --- usePlacesAutocomplete Hook ---
//   const {
//     ready,
//     value: autocompleteValue,
//     suggestions: { status, data },
//     setValue,
//     clearSuggestions,
//   } = usePlacesAutocomplete({
//     debounce: 300,
//   });

//   // --- Effect to Geocode Manual Address Input ---
//   useEffect(() => {
//     const geocodeManualAddress = async () => {
//       if (useManualAddress && manualAddressInput) {
//         try {
//           const results = await getGeocode({ address: manualAddressInput });
//           if (results[0]) {
//             const { lat, lng } = await getLatLng(results[0]);
//             setMarker({ lat, lng });
//             setLocation({
//               type: "Point",
//               coordinates: [lng, lat],
//               address: manualAddressInput,
//             });
//           } else {
//             setMarker(null);
//             setLocation(null);
//             console.warn(
//               "Manual address could not be geocoded: ",
//               manualAddressInput
//             );
//           }
//         } catch (error) {
//           console.error("Error geocoding manual address: ", error);
//           setMarker(null);
//           setLocation(null);
//           alert(
//             "Failed to confirm manual address. Please check your input or try the map/autocomplete."
//           );
//         }
//       } else if (useManualAddress && !manualAddressInput) {
//         setMarker(null);
//         setLocation(null);
//       }
//     };

//     const handler = setTimeout(() => {
//       geocodeManualAddress();
//     }, 500);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [manualAddressInput, useManualAddress]);

//   // --- Callback for Autocomplete Address Selection ---
//   const handleAddressSelect = useCallback(
//     async (address) => {
//       setValue(address, false);
//       clearSuggestions();

//       try {
//         const results = await getGeocode({ address });
//         const { lat, lng } = await getLatLng(results[0]);
//         const position = { lat, lng };
//         setMarker(position);
//         setLocation({
//           type: "Point",
//           coordinates: [lng, lat],
//           address: address,
//         });
//       } catch (error) {
//         console.error("Error getting location from address select: ", error);
//         alert(
//           "Could not get exact coordinates for the selected address. Please try another or use the map."
//         );
//         setMarker(null);
//         setLocation(null);
//       }
//     },
//     [setValue, clearSuggestions]
//   );

//   // --- Callback for Map Click Event ---
//   const onMapClick = useCallback(
//     async (e) => {
//       if (useManualAddress) return;

//       const lat = e.latLng.lat();
//       const lng = e.latLng.lng();
//       const position = { lat, lng };
//       setMarker(position);

//       try {
//         const results = await getGeocode({ location: position });
//         if (results[0]) {
//           const address = results[0].formatted_address;
//           setValue(address, false);
//           clearSuggestions();
//           setLocation({
//             type: "Point",
//             coordinates: [lng, lat],
//             address: address,
//           });
//         } else {
//           setValue(
//             `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(
//               4
//             )} (Address Not Found)`,
//             false
//           );
//           clearSuggestions();
//           setLocation({
//             type: "Point",
//             coordinates: [lng, lat],
//             address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
//           });
//           console.warn(
//             "No address found for clicked location. Using coordinates."
//           );
//           alert(
//             "No specific address found for this spot. Location saved by coordinates."
//           );
//         }
//       } catch (error) {
//         console.error(
//           "Error getting address from map click (Geocoding API failed): ",
//           error
//         );
//         setValue(
//           `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (API Error)`,
//           false
//         );
//         clearSuggestions();
//         setLocation({
//           type: "Point",
//           coordinates: [lng, lat],
//           address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(
//             4
//           )} (Address lookup failed)`,
//         });
//         alert(
//           "Failed to find address for clicked location, using coordinates only. Check API key/billing."
//         );
//       }
//     },
//     [setValue, clearSuggestions, useManualAddress]
//   );

//   // --- Function to Toggle Address Input Mode ---
//   const toggleAddressMode = () => {
//     setUseManualAddress((prev) => !prev);
//     if (useManualAddress) {
//       setManualAddressInput("");
//       if (location?.address) {
//         setValue(location.address, false);
//       } else {
//         setValue("", false);
//       }
//     } else {
//       setValue("", false);
//       clearSuggestions();
//       if (location?.address) {
//         setManualAddressInput(location.address);
//       }
//     }
//   };

//   // --- Form Submission Handler ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!name || !description || !category) {
//       alert(
//         "Please fill in all item details: Name, Description, and Category."
//       );
//       return;
//     }
//     if (!image) {
//       alert("Please select an image for your item.");
//       return;
//     }
//     if (
//       !location ||
//       !location.address ||
//       !location.coordinates ||
//       location.coordinates.length !== 2
//     ) {
//       alert(
//         "Please set a valid location for your item. Use the map, autocomplete, or manually enter an address."
//       );
//       return;
//     }

//     setUploading(true);

//     const formData = new FormData();
//     formData.append("image", image);

//     try {
//       const uploadConfig = {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//       };
//       const { data: uploadData } = await axios.post(
//         "/api/upload",
//         formData,
//         uploadConfig
//       );

//       const newItem = {
//         name,
//         description,
//         category,
//         imageUrl: uploadData.imageUrl,
//         address: location.address,
//         location: { type: location.type, coordinates: location.coordinates },
//       };
//       const itemConfig = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//       };
//       await axios.post("/api/items", newItem, itemConfig);

//       setUploading(false);
//       alert("Item created successfully!");
//       navigate("/");
//     } catch (error) {
//       console.error("Error creating item:", error);
//       setUploading(false);

//       let errorMessage = "Failed to create item. Please try again.";
//       if (error.response) {
//         if (error.response.data && error.response.data.message) {
//           errorMessage = error.response.data.message;
//         } else if (
//           error.response.status === 401 ||
//           error.response.status === 403
//         ) {
//           errorMessage = "Authentication required. Please log in again.";
//           navigate("/login");
//         } else {
//           errorMessage = `Server responded with status: ${
//             error.response.status
//           } - ${error.response.statusText || "Unknown Error"}`;
//         }
//       } else if (error.request) {
//         errorMessage = "Network error: Could not connect to the server.";
//       } else {
//         errorMessage = `An unexpected error occurred: ${error.message}`;
//       }
//       alert(`Submission Error: ${errorMessage}`);
//     }
//   };

//   // --- Render Loading/Error States for Google Maps ---
//   if (loadError)
//     return (
//       <div className="text-center p-4 bg-red-100 text-red-700 rounded-md max-w-xl mx-auto mt-8 shadow-md">
//         <p className="font-semibold text-lg mb-2">Map Loading Failed!</p>
//         <p className="text-sm">
//           There was an issue loading the map. This often indicates a problem
//           with your Google Maps API key (e.g., incorrect key, missing API
//           service, or billing not enabled) or a temporary network issue.
//         </p>
//         <p className="mt-2 text-xs">
//           Please ensure your VITE_Maps_API_KEY is correct and has the Geocoding
//           and Places APIs enabled with billing.
//         </p>
//       </div>
//     );
//   if (!isLoaded)
//     return (
//       <div className="text-center mt-8 text-gray-700 text-lg">
//         Loading Maps...
//       </div>
//     );

//   // --- Main Component Render ---
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-teal-100 p-4">
//       <div className="w-full max-w-xl p-8 space-y-6 bg-gradient-to-br from-green-300 to-green-600 text-white rounded-lg shadow-xl">
//         <h1 className="text-3xl font-bold text-center mb-6">List a New Item</h1>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label
//               htmlFor="itemName"
//               className="block text-sm font-semibold mb-1"
//             >
//               Item Name
//             </label>
//             <input
//               id="itemName"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="e.g., Vintage Desk Lamp, Gently Used Backpack"
//               required
//               className="w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="description"
//               className="block text-sm font-semibold mb-1"
//             >
//               Description
//             </label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Provide details about the item: its condition, dimensions, what it can be used for, etc."
//               required
//               rows="5"
//               className="w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 resize-y transition duration-150 ease-in-out"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="category"
//               className="block text-sm font-semibold mb-1"
//             >
//               Category
//             </label>
//             <input
//               id="category"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               placeholder="e.g., Furniture, Electronics, Books, Clothing, Decor"
//               required
//               className="w-full p-3 border border-gray-200 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
//             />
//           </div>

//           <div className="relative">
//             <div className="flex justify-between items-center mb-2">
//               <label
//                 htmlFor="address"
//                 className="block text-sm font-semibold mb-1"
//               >
//                 Location / Address
//               </label>
//               <button
//                 type="button"
//                 onClick={toggleAddressMode}
//                 className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition duration-150 ease-in-out"
//               >
//                 {useManualAddress ? "Use Map / Autocomplete" : "Enter Manually"}
//               </button>
//             </div>

//             {useManualAddress ? (
//               <input
//                 id="manual-address"
//                 value={manualAddressInput}
//                 onChange={(e) => setManualAddressInput(e.target.value)}
//                 placeholder="Enter address manually (e.g., 123 Main St, City, State, Zip)"
//                 className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
//               />
//             ) : (
//               <>
//                 <input
//                   id="address"
//                   value={autocompleteValue}
//                   onChange={(e) => setValue(e.target.value)}
//                   disabled={!ready}
//                   placeholder="Type an address or click on the map"
//                   className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
//                   autoComplete="off"
//                 />
//                 {status === "OK" && (
//                   <ul className="bg-white border border-gray-200 rounded-md mt-1 absolute z-10 w-full max-w-lg shadow-xl divide-y divide-gray-200 max-h-60 overflow-y-auto text-gray-900">
//                     {data.map(({ place_id, description }) => (
//                       <li
//                         key={place_id}
//                         onClick={() => handleAddressSelect(description)}
//                         className="p-3 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm"
//                       >
//                         {description}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </>
//             )}
//           </div>

//           <GoogleMap
//             mapContainerStyle={mapContainerStyle}
//             zoom={marker ? 15 : 12}
//             center={marker || defaultCenter}
//             onClick={onMapClick}
//             options={{
//               streetViewControl: false,
//               mapTypeControl: false,
//               fullscreenControl: false,
//               zoomControl: true,
//             }}
//           >
//             {marker && <Marker position={marker} />}
//           </GoogleMap>

//           <input
//             type="file"
//             onChange={(e) => setImage(e.target.files[0])}
//             required
//             className="w-full text-sm text-white
//                          file:mr-4 file:py-2 file:px-4
//                          file:rounded-md file:border-0
//                          file:text-sm file:font-semibold
//                          file:bg-green-700 file:text-white
//                          hover:file:bg-green-800 cursor-pointer transition duration-150 ease-in-out"
//           />
//           <button
//             type="submit"
//             disabled={uploading}
//             className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
//           >
//             {uploading ? "Uploading..." : "List Item"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UploadPage;
