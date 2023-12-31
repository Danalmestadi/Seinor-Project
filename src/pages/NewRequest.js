import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Alerts from "../component/Alerts"
import {
  app,
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "../firebase/index";
import {
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/index";

function NewRequest() {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const userRef = doc(db, "Account", currentUser.uid);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    desiredDate: "",
    phoneNumber: "",
    category: "",
    brand: "",
    operatingSystem: "",
    description: "",
    department: "",
    date: '',
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Get a Firestore instance
    const db = getFirestore(app);
    try {
      const userRef = doc(db, "Account", currentUser.uid);
      const newRequest = {
        userid: currentUser.uid,
        name: formData.name,
        lastname: formData.lastname,
        date: Timestamp.fromDate(new Date(formData.desiredDate)),
        phone: formData.phoneNumber,
        type: formData.category,
        brand: formData.brand,
        system: formData.operatingSystem,
        description: formData.description,
        department: formData.department,
        status: "Waiting", // Set default status to "Waiting"
        approved: false,   // Set default approved status to false
      };
      await addDoc(collection(db, "request"), newRequest);
      // Update the user's requests array with the new request
      console.log("Request added to the 'request' collection in Firestore!");
      navigate('/Request', { state: { showSuccessAlert: true } });
    } catch (error) {
      console.error(
        "Error adding request to the 'request' collection in Firestore: ",
        error
      );
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(userData);
          setFormData((prevFormData) => ({
            ...prevFormData,
            name: userData.name,
            lastname: userData.lastname,
            department: userData.department,
            email: userData.email,
            phone: userData.phoneNumber,

          }));
        } else {
          console.log("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [currentUser.uid]);

  return (
    <section className="bg-gray-200 overflow-y-auto overflow-x-hidden flex justify-center items-center w-full md:inset-0 h-modal md:h-full">
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <div class="relative p-4 bg-white rounded-lg shadow-xl sm:p-5">
          <div class="pb-4 mb-4 rounded-t border-b-2 sm:mb-5">
            <h3 className="text-2xl font-semibold text-blue-800">Request New Asset Form</h3>
          </div>
          <form onSubmit={handleSubmit} className="mb-4 px-10">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-900 white:text-white"
                >
                  Asset Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 white:bg-gray-700 white:border-gray-600 white:placeholder-gray-400 white:text-white white:focus:ring-primary-500 white:focus:border-primary-500"
                >
                  <option value="">Select Asset Category</option>
                  <option value="Monitors">Monitors</option>
                  <option value="Laptop">Laptop</option>
                  <option value="PC">PC</option>
                  <option value="Printer">Printer</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
              <div className="w-full">
                <label
                  htmlFor="brand"
                  className="block mb-2 text-sm font-medium text-gray-900 white:text-white"
                >
                  Asset Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  id="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 white:bg-gray-700 white:border-gray-600 white:placeholder-gray-400 white:text-white white:focus:ring-primary-500 white:focus:border-primary-500"
                  placeholder="Asset brand"
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="operatingSystem"
                  className="block mb-2 text-sm font-medium text-gray-900 white:text-white"
                >
                  Operating System
                </label>
                <input
                  type="text"
                  name="operatingSystem"
                  id="operatingSystem"
                  value={formData.operatingSystem}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 white:bg-gray-700 white:border-gray-600 white:placeholder-gray-400 white:text-white white:focus:ring-primary-500 white:focus:border-primary-500"
                  placeholder="Operating System"
                  required
                />
              </div>
              {/* Desired Date */}
              <div className="w-full">
                <label
                  htmlFor="desiredDate"
                  className="block mb-2 text-sm font-medium text-gray-900 white:text-white"
                >
                  Desired Date
                </label>
                <input
                  type="date"
                  name="desiredDate"
                  id="desiredDate"
                  value={formData.desiredDate}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 white:bg-gray-700 white:border-gray-600 white:placeholder-gray-400 white:text-white white:focus:ring-primary-500 white:focus:border-primary-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 white:text-white"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="8"
                  value={formData.description}
                  onChange={handleChange}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 white:bg-gray-700 white:border-gray-600 white:placeholder-gray-400 white:text-white white:focus:ring-primary-500 white:focus:border-primary-500"
                  placeholder="Your description here"
                ></textarea>
              </div>
              <FormSubheader title={"Employee Information"} />
              {/* First Name */}
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 white:text-white"
                >
                  Employee First Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={handleChange}
                  value={formData.name}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 white:bg-gray-700 white:border-gray-600 white:placeholder-gray-400 white:text-white white:focus:ring-primary-500 white:focus:border-primary-500"
                  placeholder="First Name"
                  required
                />
              </div>
              {/* Last Name */}
              <div className="w-full">
                <label
                  htmlFor="lastname"
                  className="block mb-2 text-sm font-medium text-gray-900 white:text-white"
                >
                  Employee Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 white:bg-gray-700 white:border-gray-600 white:placeholder-gray-400 white:text-white white:focus:ring-primary-500 white:focus:border-primary-500"
                  placeholder="Last Name"
                  required
                />
              </div>
              {/* Phone Number */}
              <div className="w-full">
                <label
                  htmlFor="phoneNumber"
                  className="block mb-2 text-sm font-medium text-gray-900 white:text-white"
                >
                  Employee Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  readOnly
                  value={formData.phone}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 white:bg-gray-700 white:border-gray-600 white:placeholder-gray-400 white:text-white white:focus:ring-primary-500 white:focus:border-primary-500"
                />
              </div>
              <div>
                <label
                  htmlFor="department"
                  className="block mb-2 text-sm font-medium text-gray-900 white:text-white"
                >
                  Employee Department
                </label>
                <input
                  readOnly
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 white:bg-gray-700 white:border-gray-600 white:placeholder-gray-400 white:text-white white:focus:ring-primary-500 white:focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Link
                to={`/Request`}
                className=" inline-flex items-center text-black  rounded-lg font-medium text-md px-14 py-2 text-center font-semibold leading-6 bg-transparent hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white focus:outline-none font-medium rounded-full text-sm px-4 py-2 text-center mr-3 border-2 border-gradient-to-r from-blue-500 to-purple-500 "
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex justify-center items-center my-6 py-2 px-4 text-base font-medium text-center text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:bg-purple-500"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}


const FormSubheader = ({ title }) => {
  return (
    <div class="sm:col-span-2 pb-2 mb-2 rounded-t border-b-2 sm:mb-2">
      <h3 class="text-lg font-semibold text-purple-600 ">
        {title}
      </h3>
    </div>
  );
};
export default NewRequest;