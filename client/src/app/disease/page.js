"use client";
import React, { useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import translate from "translate";
import axios from "axios";

const Disease = () => {
  const [language, setLanguage] = useState("en");
  const [prevLanguage, setPrevLanguage] = useState("en");
  const [engArr, setEngArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [responseInfo, setResponseInfo] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [modalText, setModalText] = useState(""); // State to hold modal text content
  const [level, setLevel] = useState(1);
  const [fertilizer, setFertilizer] = useState([]);
  const [treatment, setTreatment] = useState([]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      setLoading(true);

      fetch("https://ipd-670g.onrender.com/diseasePrediction", {
        method: "POST",
        body: formData,
        mode: "cors",
        headers: {},
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result.data);
          setResponseInfo(result.data);
        })
        .catch((error) => console.log("error", error))
        .finally(() => setLoading(false));
    } else {
      console.warn("No image selected");
    }
  };

  const openModal = async () => {
    setLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        symptoms: responseInfo.plant_description,
        cropName: responseInfo.cropName,
        disease_name: responseInfo.disease_name,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("https://ipd-670g.onrender.com/remedies", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          console.log(result.data);
          setFertilizer(result.data.Fertilizer);
          setTreatment([]);
          setTreatment(result.data.Treatment);
          setShowModal(true);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const changeLang = async (lang) => {
    // Your language change logic
  };

  useEffect(() => {
    changeLang(language);
  }, [language]);

  return (
    <div className="bg-white flex flex-col min-h-screen w-full relative">
      {responseInfo ? (
        <div className="flex flex-col min-h-screen">
          <div className="h-[40%]">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Background"
              className="object-cover h-full w-full"
            />
          </div>
          <div className="h-[65%] bg-white p-7">
            <div className="flex justify-between">
              <div
                className={` px-3 text-[15px] font-semibold rounded-md  mb-7 w-fit ${
                  responseInfo.health_status === "yes"
                    ? "bg-[#e2f5ef] text-[#0d9e6b]"
                    : "bg-red-100 border-[1px] text-red-800"
                }`}
              >
                {responseInfo.health_status === "yes"
                  ? "Healthy"
                  : "Not Healthy"}
              </div>
              {responseInfo.health_status === "yes" ? (
                <></>
              ) : (
                <div
                  className={` cursor-pointer px-3 text-[15px] font-semibold rounded-md mb-7 w-fit bg-[#e2f5ef] text-[#0d9e6b]`}
                  onClick={openModal}
                >
                  Get remedies
                </div>
              )}
            </div>
            <div className="text-[#0d9e6b] text-[35px] font-bold mb-6">
              {responseInfo.cropName}
            </div>
            {responseInfo.health_status === "yes" ? (
              <></>
            ) : (
              <div className="flex flex-col mb-7">
                <p className="text-[#0d9e6b] text-[18px] mb-[6px] font-semibold">
                  DISEASE
                </p>
                <p className="text-[#0d9e6b] bg-[#e2f5ef] px-3 rounded-md w-fit">
                  {responseInfo.disease_name}
                </p>
              </div>
            )}

            <div className="flex flex-col mb-10">
              <p className="text-[#0d9e6b] text-[18px] mb-[6px] font-semibold">
                Description
              </p>
              <p className="text-[#0d9e6b]">{responseInfo.plant_description}</p>
            </div>
          </div>
          <div className="flex flex-col w-[90%] mx-auto rounded-[10px] px-[5px] py-[10px] bg-red-100">
            <div className="flex flex-row items-center justify-center">
              <div className="font-semibold text-[16px]">Level of Damage</div>
            </div>

            <div className="flex flex-col w-[90%] self-center justify-between">
              <div className="bg-red-200 h-[2px] mt-[25px] mb-[15px] relative rounded-sm">
                <div
                  className={`absolute bg-red-500 h-[4px] ${
                    level == 1 && "w-[20px]"
                  } ${level == 2 && "w-[50%]"} ${
                    level == 3 && "w-[100%]"
                  } mt-[-1px] flex flex-row items-center rounded-sm`}
                >
                  <div
                    className={`rounded-full w-[10px] h-[10px] ml-auto bg-red-500`}
                  ></div>
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <div>Low</div>
                <div>Medium</div>
                <div>High</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen w-full pt-[20px] items-center">
          <div className="p-8">
            <h2 className=" text-3xl font-bold mb-[25px] text-[#0d9e6b]">
              Upload a Photo of your Crop or Plant
            </h2>
            <p className="mb-[15px] text-black">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's
            </p>
          </div>
          {selectedImage ? (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="image"
              className="w-[300px] h-[300px]"
            />
          ) : (
            <div className="p-8 border-[3px] border-dotted border-[#0d9e6b] rounded-lg bg-[#e2f5ef] text-center flex flex-col justify-center items-center ">
              {/* <h2 className="text-xl font-semibold text-[#3f7cf5]">UPLOAD Image</h2> */}
              <label className="flex flex-col justify-center items-center mt-4 ">
                <div className="cursor-pointer border-2 border-dotted h-[100%] w-[100%] border-[#0d9e6b] px-4 rounded-lg bg-white py-[30px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-[#0d9e6b]"
                    height="24"
                    fill="#0d9e6b"
                    viewBox="0 -960 960 960"
                    stroke="currentColor"
                  >
                    <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
                  </svg>
                  <p className="text-[#0d9e6b] mt-2">
                    Choose a file or drag it here
                  </p>
                  <input
                    className=" hidden"
                    type="file"
                    accept=".jpg,.png,.jpeg,.webp"
                    onChange={handleImageChange}
                  />
                </div>
              </label>
            </div>
          )}
          {/* <p>{image?.name}</p> */}

          {/* {responseInfo && (
          <div className={`w-[95%] mt-4 p-4 rounded-lg ${responseInfo.health_status === 'yes' ? 'bg-green-100 border-green-800 border-[1px]' : 'bg-red-100 border-[1px] border-red-800'}`}>
            <h2 className={`text-3xl font-semibold ${responseInfo.health_status === 'yes' ? 'text-green-800 ' : 'text-[#a20220]'} `}>{responseInfo.health_status === 'yes' ? 'Healthy' : 'Not Healthy'}</h2>
            <div className="mt-2 flex flex-col">
             
              <div className={`y-2 mr-2 ${responseInfo.health_status === 'yes' ? ' text-green-800' : ' text-[#a20220]'} `}>
                {responseInfo.cropName}
              </div>
              <div className={`p-2 rounded-md my-2 mr-2 w-fit ${responseInfo.health_status === 'yes' ? 'bg-green-800 text-white' : 'bg-[#f7a6b5] border-[1px] border-[#a20220]'} `}>
                {responseInfo.disease_name}
              </div>
              <button className=" bg-[#57a0f3] py-[4px] px-[6px] text-white rounded-md  " >Get Remdies</button>

            </div>
          </div>
        )} */}
          {loading ? (
            <div className="mt-4">
              <ScaleLoader color="#2563eb" />
              Hold on!
            </div>
          ) : (
            <button
              className="mt-4 py-2 px-6 bg-[#0d9e6b] text-[#e2f5ef] rounded-full"
              onClick={handleUpload}
            >
              Upload Image
            </button>
          )}
        </div>
      )}
      {/* Button to open the modal */}

      {/* Modal */}
      {showModal && (
        <div className="px-[15px] fixed top-0 left-0 w-full h-full  flex justify-center items-center bg-gray-900 bg-opacity-60">
          <div className="bg-white rounded-lg p-6 h-[450px] overflow-y-scroll">
            <h2 className="text-lg font-semibold mb-4">Fertilizer</h2>
            {fertilizer.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">{item.fertilizerName}</p>
                <p>{item.fertilizer}</p>
              </div>
            ))}
            <h2 className="text-lg font-semibold mt-4 mb-2">Treatment</h2>
            {treatment.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">{item.treatmentName}</p>
                <p>{item.treatment}</p>
              </div>
            ))}

            {/* Close button */}
            <button
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Disease;