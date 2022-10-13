import React, { useState } from "react";
import Head from "next/head";
import UseFormInput from "../../components/components/UseFormInput";
import UseFormTextArea from "../../components/components/UseFormTextArea";
import { Header } from "../../components/layout/Header";
import { Nav } from "../../components/layout/Nav";
import NavLink from "next/link";
import isServer from "../../components/isServer";
import { NFTStorage, File } from "nft.storage";
import styles from "./CreateCertification.module.css";
import { Button } from "@heathmont/moon-core-tw";
import { GenericPicture, TypeZoomOut, ControlsPlus } from "@heathmont/moon-icons-tw";
import { Checkbox } from "@heathmont/moon-core-tw";

export default function CreateCertification() {
  const [Image, setImage] = useState([]);
  //Storage API for images and videos
  const NFT_STORAGE_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8";
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  //Input fields
  const [NumberBox, NumberBoxInput] = UseFormInput({
    defaultValue: "",
    type: "number",
    placeholder: "Number",
    id: "",
  });

  const [Price, PriceInput] = UseFormInput({
    defaultValue: "",
    type: "number",
    placeholder: "Price in Celo",
    id: "",
  });
  const [Location, LocationInput] = UseFormInput({
    defaultValue: "",
    type: "text",
    placeholder: "Site Location",
    id: "",
  });
  const [Description, DescriptionInput] = UseFormTextArea({
    defaultValue: "",
    placeholder: "Description",
    id: "",
    rows: 4,
  });
  const [Collection, CollectionInput] = UseFormInput({
    defaultValue: "",
    type: "text",
    placeholder: "Collection",
    id: "",
  });
  const [DateBox, DateInput] = UseFormInput({
    defaultValue: "",
    type: "datetime-local",
    placeholder: "date",
    id: "",
  });

  if (isServer()) return null;

  //Downloading plugin function
  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  //Creating plugin function
  async function CreatePlugin() {
    const output = `<html><head></head><body><iframe src="${window.location.href}?embed"  style="width: 100%;height: 100%;" /></body></html>`;
    // Download it
    const blob = new Blob([output]);
    const fileDownloadUrl = URL.createObjectURL(blob);
    downloadURI(fileDownloadUrl, "Generated Create Certificate Plugin.html");
    console.log(output);
  }


  //Function after clicking Create  Button
  async function create() {
    var CreateCertificateBTN = document.getElementById("CreateCertificateBTN");
    CreateCertificateBTN.disabled = true;
    let allFiles = [];
    for (let index = 0; index < Image.length; index++) {
      //Gathering all files link
      const element = Image[index];
      const metadata = await client.storeBlob(element);
      const urlImage = {
        url: "https://" + metadata + ".ipfs.nftstorage.link",
        type: element.type,
      };
      allFiles.push(urlImage);
    }


    console.log("======================>Creating Certificate");
    try {

      // Creating  in Smart contract
      await window.contract.create_certificate(window.ethereum.selectedAddress, Number(NumberBox), Number(Price), Location, Description, Collection, DateBox.toString(), JSON.stringify(allFiles))
        .send({
          from: window.ethereum.selectedAddress,
          gasPrice: 1000000000,
          gas: 5_000_000,
        });

    } catch (error) {
      console.error(error);
      window.location.href = "/login?[/]"; //If found any error then it will let the user to login page
    }
    window.location.href = "/ValidateCertification"; //After the success it will redirect the user to / page
  }

  function FilehandleChange(Certificate) {
    var allNames = []
    for (let index = 0; index < Certificate.target.files.length; index++) {
      const element = Certificate.target.files[index].name;
      allNames.push(element)
    }
    for (let index2 = 0; index2 < Certificate.target.files.length; index2++) {
      setImage((pre) => [...pre, Certificate.target.files[index2]])
    }

  }

  function AddBTNClick() {
    var ImagePic = document.getElementById("Image");
    ImagePic.click();

  }

  function CreateBTN() {
    return (
      <>
        <div className="flex gap-4 justify-end">
          {(!window.location.search.includes("embed")) ? (<> 
          <NavLink href="/ValidateCertification">
            <Button variant="secondary">
              <TypeZoomOut className="text-moon-24" />
              Validate Certificate
            </Button>
          </NavLink></>) : (<></>)}

          <Button id="CreateCertificateBTN" onClick={create}>
            <ControlsPlus className="text-moon-24" />
            Create Certificate
          </Button>
        </div>
      </>
    );
  }

  function DeleteSelectedImages(Certificate) {
    //Deleting the selected image
    var DeleteBTN = Certificate.currentTarget;
    var idImage = Number(DeleteBTN.getAttribute("id"));
    var newImages = [];
    var allUploadedImages = document.getElementsByName("deleteBTN");
    for (let index = 0; index < Image.length; index++) {
      if (index != idImage) {
        const elementDeleteBTN = allUploadedImages[index];
        elementDeleteBTN.setAttribute("id", newImages.length.toString());
        const element = Image[index];
        newImages.push(element);
      }
    }
    setImage(newImages);
  }



  return (
    <>
      <Head>
        <title>Create Certification</title>
        <meta name="description" content="Create Certification" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {window.location.search.includes("embed") ? (<></>) : (<Header></Header>)}

      <div className={`${styles.container} flex items-center justify-center flex-col gap-8`}>
        <div className={`${styles.title} gap-8 flex justify-between`}>
          <h1 className="text-moon-32 font-bold">Create Certification</h1>
          <div>
            {(window.location.search.includes("embed") ? (<><Nav></Nav></>) : (<Button onClick={CreatePlugin}>Generate Plugin</Button>))}
          </div>

        </div>
        <div className={styles.divider}></div>
        <div className={`${styles.form} flex flex-col gap-8`}>
          <div>
            <h6> Number</h6>
            {NumberBoxInput}
          </div>
          <div>
            <h6> Price</h6>
            {PriceInput}
          </div>
          <div>
            <h6> Site Location</h6>
            {LocationInput}
          </div>

          <div>
            <h6>Description</h6>
            {DescriptionInput}
          </div>

          <div>
            <h6>Collection</h6>
            {CollectionInput}
          </div>

          <div className="flex gap-8 w-full">
            <div className="flex-1">
              <h6>Date</h6>
              {DateInput}
            </div>

          </div>

          <div className="flex flex-col gap-2">
            <h6>Images and Document</h6>
            <div className="flex gap-4">
              <input
                className="file-input"
                hidden
                onChange={FilehandleChange}
                id="Image"
                name="Image"
                type="file"
                multiple="multiple"
              />
              <div className="flex gap-4">
                {Image.map((item, i) => {
                  return (
                    <>
                      <div key={i} className="flex gap-4">
                        <button
                          onClick={DeleteSelectedImages}
                          name="deleteBTN"
                          id={i}
                        >
                          {item.type.includes("image") ? (
                            <img
                              className={styles.image}
                              src={URL.createObjectURL(item)}
                            />
                          ) : (
                            <>
                              <div className="-Uploaded-File-Container">

                                <span className="-Uploaded-File-name">
                                  {item.name.substring(0, 10)}...
                                </span>
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  );
                })}
                <div className="-ImageAdd">
                  <Button
                    id="Add-Image"
                    onClick={AddBTNClick}
                    variant="secondary"
                    style={{ height: 80, padding: "1.5rem" }}
                    iconLeft
                    size="lg"
                  >
                    <GenericPicture className="text-moon-24" />
                    Add image or document
                  </Button>
                </div>
              </div>
            </div>
          </div>


          <CreateBTN />
        </div>
        <div className={styles.divider}></div>
      </div>
    </>
  );
}
