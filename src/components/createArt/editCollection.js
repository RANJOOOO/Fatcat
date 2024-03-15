import React, { useEffect, useState } from "react";
import Header from "../header";
import ImageUpload from "../imageUpload";
import Button from "../button";
import { toast } from "react-toastify";
import Input from "../inputs";
import Textarea from "../shared/textarea";
import { useLocation } from "react-router-dom";
import {
  getCollectionDetailsFirebase,
  saveEditCollectionDetails,
} from "../../firebase/firebase";

const EditCollection = () => {
  const [image, setImage] = useState("");
  const [featureImage, setFeatureImage] = useState("");
  const [description, setDescription] = useState("");
  const [collectionUrl, setCollectionUrl] = useState("");

  const location = useLocation();

  const saveData = () => {
    console.log(image);
    console.log(featureImage);
    console.log(description);
    console.log(collectionUrl);

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    if (!featureImage) {
      toast.error("Please select a featured image");
      return;
    }

    if (!description) {
      toast.error("Please enter a description");
      return;
    }

    if (!collectionUrl) {
      toast.error("Please enter a collection url");
      return;
    }

    saveEditCollectionDetails(
      image,
      featureImage,
      description,
      collectionUrl,
      location.pathname.split("/")[2]
    );
  };
  const handleImageChange = (image) => {
    console.log(image);
  };

  const [collectionDetails, setCollectionDetails] = useState("");
  useEffect(() => {
    console.log(collectionDetails);
    setImage(collectionDetails.image);
    setFeatureImage(collectionDetails.featureImage);
    setDescription(collectionDetails.description);
    setCollectionUrl(collectionDetails.collectionUrl);
  }, [collectionDetails]);
  const getCollectionDetails = async () => {
    const result = await getCollectionDetailsFirebase(
      location.pathname.split("/")[2]
    );
    setCollectionDetails(result);
  };

  useEffect(() => {
    getCollectionDetails();
  }, []);

  return (
    <div>
      <section className="create-artwork">
        <Header head="Create" />
        <div className="create-artwork-content  ">
          <h4 className="medium-head">Edit collection</h4>

          {/* Collection logo */}
          <div className="preview-file upload-file mt-40">
            <p className="body-large fw-bold v-center justify-content-between">
              Collection Logo
              <span className="body-medium ms-2 text-medium-grey fw-500">
                Optional
              </span>
            </p>
            <p className="body-small mt-3 text-medium-grey">
              JPC, PNC, GIF, SVG. Max size: -'MB
            </p>
            <ImageUpload
              onChange={(e) => {
                console.log(e.target.files[0]);
                setImage(e.target.files[0]);
              }}
              name="logo"
              value={image}
            />
          </div>

          {/*Feature Image */}
          <div className="preview-file upload-file mt-40">
            <p className="body-large fw-bold v-center justify-content-between">
              Feature Image
              <span className="body-medium ms-2 text-medium-grey fw-500">
                Optional
              </span>
            </p>
            <p className="body-small mt-3 text-medium-grey">
              JPG, PNG, Clf, SVC. Max size: 5MB
            </p>
            <ImageUpload
              onChange={(e) => {
                console.log(e.target.files[0].size / 1024 / 1024);
                setFeatureImage(e.target.files[0]);
              }}
              name="featured"
              value={featureImage}
            />
          </div>

          <div className="art-name mt-40 d-flex flex-column">
            <label className="text-black v-center justify-content-between">
              Description
              <span className="body-medium no-text-transform fw-500 text-medium-grey ms-2">
                Optional
              </span>
            </label>
            {/* <div className="text-box br-20 mt-3">
              <textarea placeholder="Add a description..."></textarea>
            </div> */}
            <Textarea
              placeholder="Add a description..."
              maxLength={500}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
            />
            {/* <p className="body-small mt-1 text-medium-grey v-center justify-content-between">
              Use markdown syntax to embed links
              <span>0/500</span>
            </p> */}
          </div>

          <div className="art-name mt-40 d-flex flex-column">
            <label className="text-black v-center justify-content-between ">
              COLLECTION URL
              <span className="body-medium no-text-transform fw-500 text-medium-grey ms-2">
                Optional
              </span>
            </label>
            <div className="input-box-3  mt-3 ps-1">
              <p className="v-center">the-catalyst.app/collection/</p>
              <Input
                type="text"
                placeholder="Artwork Name"
                className=" "
                onChange={(e) => {
                  setCollectionUrl(e.target.value);
                }}
                value={collectionUrl}
              />
            </div>
          </div>
          <div className="divider"></div>

          <Button
            text="Save changes"
            className="btn-prime btn-primary br-30 font-18"
            height="50px"
            width="100%"
            onClick={() => saveData()}
          />
        </div>
      </section>
    </div>
  );
};

export default EditCollection;
