import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const defaultSrc =
  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

export const ImageCropperInput = (props) => {
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined" && cropper.getCroppedCanvas()) {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      props.setCroppedImgData(cropper.getCroppedCanvas().toDataURL())
    }
  };

  return (
    <div className="row">
        <div className="col-md-6" style={{ width: "100%" }}>
            <input type="file" onChange={onChange} />
            <br />
            <br />
            <Cropper
            style={{ height: 300, width: "100%" }}
            initialAspectRatio={1}
            //   preview=".img-preview"
            src={image}
            viewMode={1}
            guides={true}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            onInitialized={(instance) => {
                setCropper(instance);
            }}
            />
        </div>
        <div className="col-md-6">
            {/* <div className="box" style={{ width: "50%", float: "right" }}>
            <h1>Preview</h1>
            <div
                className="img-preview"
                style={{ width: "300px", float: "left", height: "300px" }}
            />
            </div> */}
            <div className="box col-md-5" style={{ width: "50%", float: "left", height: "250px" }}>
                <h1>
                    {/* <span>Crop</span> */}
                    <button className="btn btn-primary" onClick={getCropData}>
                        Crop Image
                    </button>
                </h1>
                <img style={{ width: "100%" }} src={cropData} alt="cropped" />
            </div>
        </div>
        <br style={{ clear: "both" }} />
    </div>
  );
};

export default ImageCropperInput;
