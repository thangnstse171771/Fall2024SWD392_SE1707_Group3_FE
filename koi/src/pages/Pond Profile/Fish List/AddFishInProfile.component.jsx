import { useState, useEffect, useRef } from "react";
import { Modal, Input, Button, Form, Select, message } from "antd";
import CountrySelect from "react-select-country-list";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../firebase";
import { CircularProgress } from "@mui/material";

const { Option, OptGroup } = Select;

const AddFishInProfile = ({ open, onCancel, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImageUploadError(null);
  };

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    setImageUploadError(null);

    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Image upload failed");
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageUploadError(null);
          form.setFieldsValue({ koiImage: downloadURL });
          setImagePreview(downloadURL);
          message.success("Image uploaded successfully!");
        });
      }
    );
  };

  const koiBreeds = [
    {
      category: "Gosanke",
      breeds: [
        { name: "Kohaku", description: "white koi with red pattern" },
        { name: "Taisho Sanke", description: "white koi with red and black" },
        {
          name: "Showa Sanshoku",
          description: "black koi with red and white patterns",
        },
      ],
    },
    {
      category: "Utsuri",
      breeds: [
        { name: "Hi Utsuri", description: "black and red" },
        { name: "Shiro Utsuri", description: "white" },
        { name: "Ki Utsuri", description: "yellow" },
        { name: "Utsurimono", description: "white and black dot" },
      ],
    },
    {
      category: "Tancho",
      breeds: [{ name: "Tancho", description: "1 red dot on head (rare)" }],
    },
    {
      category: "Asagi",
      breeds: [
        {
          name: "Asagi",
          description: "muted blue-grey and bright red markings",
        },
      ],
    },
    {
      category: "Butterfly Koi",
      breeds: [
        {
          name: "Butterfly Koi",
          description: "symmetric both sides like a butterfly",
        },
      ],
    },
    {
      category: "Ogon",
      breeds: [
        { name: "Platinum Ogon", description: "solid shiny silver-white" },
        {
          name: "Yamabuki Ogon",
          description: "gold, yellow, or bronze shades",
        },
      ],
    },
  ];

  const countries = CountrySelect().getData();

  useEffect(() => {
    if (onCancel) {
      setImagePreview("");
      setFile(null);
      setImageUploadProgress(null);
      setImageUploadError(null);
      form.resetFields();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open, form]);

  return (
    <Modal title="Add New Fish" open={open} onCancel={onCancel} footer={null}>
      <Form
        form={form}
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields();
        }}
        layout="vertical"
        noValidate
      >
        <Form.Item
          label="Koi Name"
          name="koiName"
          rules={[{ required: true, message: "Please enter the Koi name!" }]}
        >
          <Input placeholder="Enter Koi name" />
        </Form.Item>

        <Form.Item
          label="Koi Image"
          name="koiImage"
          rules={[{ required: true, message: "Please provide an image!" }]}
        >
          <Input
            type="hidden"
            placeholder="Koi image URL"
            readOnly
            value={form.getFieldValue("koiImage")}
          />

          <Input type="file" onChange={handleFileChange} ref={fileInputRef} />
          {imageUploadProgress ? (
            <div className="w-16 h-16">
              <CircularProgress
                variant="determinate"
                value={imageUploadProgress}
                style={{ marginTop: "8px" }}
              />
            </div>
          ) : (
            <div>
              <Button onClick={handleUploadImage} style={{ marginTop: "8px" }}>
                Upload Image
              </Button>
              {imageUploadError && (
                <p
                  style={{
                    color: "red",
                    marginTop: "0",
                    marginBottom: "0",
                    textAlign: "left",
                  }}
                >
                  {imageUploadError}
                </p>
              )}
            </div>
          )}
        </Form.Item>

        {imagePreview && (
          <div style={{ margin: "10px 0" }}>
            <img
              src={imagePreview}
              alt="KoiFish"
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        )}

        <Form.Item
          label="Gender"
          name="koiGender"
          rules={[{ required: true, message: "Please select the gender!" }]}
        >
          <Select placeholder="Select gender">
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="koiBreed"
          label="Breed"
          rules={[{ required: true, message: "Please select the breed!" }]}
        >
          <Select placeholder="Select breed">
            {koiBreeds.map((category) => (
              <OptGroup label={category.category} key={category.category}>
                {category.breeds.map((breed) => (
                  <Option value={breed.name} key={breed.name}>
                    {breed.name} - {breed.description}
                  </Option>
                ))}
              </OptGroup>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Koi Origin (Country)"
          name="koiOrigin"
          rules={[
            { required: true, message: "Please select the country of origin!" },
          ]}
        >
          <Select
            showSearch
            placeholder="Select country"
            options={countries.map((country) => ({
              value: country.label,
              label: country.label,
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" danger htmlType="submit" loading={loading}>
            Submit
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFishInProfile;
