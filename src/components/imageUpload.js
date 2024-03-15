import React, { useState } from "react";
import Input from "./inputs";
import thumbnail from "../assets/icon/artwork.svg";
import bin from "../assets/icon/bin.svg";
import { useEffect } from "react";

const ImageUpload = ({ onChange, value }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    // props?.setImage(image);
    // props?.setFeatureImage(image);
    // onImageChange(image); // Pass the selected image back to parent component
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        console.log(reader.result);
      };
      reader.readAsDataURL(image);
    }
  };

  useEffect(() => {
    console.log(value);
    setSelectedImage(value);
  }, [value]);
  return (
    <div>
      <div className="file-thumbnails">
        <label className="file-thumbnail pointer mt-3 position-relative">
          <img
            src={thumbnail}
            alt="thumbnail"
            className={`img-48 bin  ${selectedImage ? "d-none" : ""} `}
          />

          <Input
            type="file"
            className="d-none"
            onChange={(e) => {
              console.log(e.target.files[0]);
              const image = e.target.files[0];
              if (image) {
                const reader = new FileReader();
                reader.onload = () => {
                  setSelectedImage(reader.result);
                  console.log(reader.result);
                };
                reader.readAsDataURL(image);
                onChange(e);
              }
            }}
          />
          <img
            src={selectedImage}
            alt="uploaded image"
            className={`img-100 opacity-100 uploaded-img ${
              selectedImage ? "" : "d-none"
            } `}
          />
        </label>

        <img
          src={bin}
          alt="bin"
          className={`img-142 bin bg-white rounded-circle ${
            selectedImage ? "" : "d-none"
          } `}
          onClick={() => setSelectedImage(null)}
        />

        {selectedImage && (
          <label className="medium text-black no-text-transform v-center h-center pointer change-btn">
            Change file
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
