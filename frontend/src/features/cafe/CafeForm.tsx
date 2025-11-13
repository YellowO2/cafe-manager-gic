import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Button, message, Space, Upload } from "antd";
import {
  CloseCircleFilled,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { getCafe, createCafe, updateCafe } from "../../api/cafes";
import type { CafeFormData } from "../../types";
import { useFormNavigationBlocker } from "../../hooks/useFormNavigationBlocker";
import { convertFileToBase64 } from "../../utils/fileUtils";
import { FormTextField } from "../../components/FormTextField";
import PageHeader from "../../components/PageHeader";

type CafeFormValues = Omit<CafeFormData, "logo"> & { logo?: UploadFile[] };

const CafeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<CafeFormValues>();
  const isEditMode = !!id;
  const [initialValues, setInitialValues] = useState<CafeFormValues | null>(
    null
  );
  const [logoPreview, setLogoPreview] = useState<string | undefined>();
  const [isLogoLoading, setIsLogoLoading] = useState(false);

  // Use the custom hook for form navigation blocking
  const { setIsDirty, handleValuesChange, BlockerModal } =
    useFormNavigationBlocker({
      form,
      initialValues,
    });

  // Fetch cafe data if editing
  const { data: cafeData } = useQuery({
    queryKey: ["cafeData", id],
    queryFn: () => getCafe(id!),
    enabled: isEditMode,
  });

  // Populate form
  useEffect(() => {
    if (isEditMode && cafeData) {
      const cafeFormInitialValues: CafeFormValues = {
        name: cafeData.name,
        description: cafeData.description,
        location: cafeData.location,
      };

      // Handle logo: if it exists, create a file list item for display
      if (cafeData.logo) {
        cafeFormInitialValues.logo = [
          {
            uid: "-1",
            name: "logo",
            status: "done",
            url: cafeData.logo,
          },
        ];
      }
      form.setFieldsValue(cafeFormInitialValues);
      setInitialValues(cafeFormInitialValues);
      setLogoPreview(cafeData.logo ?? undefined);
    } else if (!isEditMode) {
      setInitialValues({
        name: "",
        description: "",
        logo: undefined,
        location: "",
      });
      setLogoPreview(undefined);
    }
  }, [isEditMode, cafeData, form]);

  const [messageApi, messageContextHolder] = message.useMessage();

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createCafe,
    onSuccess: () => {
      messageApi.success("Café created successfully");
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
      setIsDirty(false); // Reset dirty state on success
    },
    onError: (error: Error) => {
      messageApi.error(`Failed to create café: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CafeFormData }) =>
      updateCafe(id, data),
    onSuccess: () => {
      messageApi.success("Café updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
      setIsDirty(false); // Reset dirty state on success
    },
    onError: (error: Error) => {
      messageApi.error(`Failed to update café: ${error.message}`);
    },
  });

  const handleLogoChange = async (
    info: UploadChangeParam<UploadFile>
  ): Promise<void> => {
    const fileList = info.fileList;
    if (!fileList || fileList.length === 0) {
      setLogoPreview(undefined);
      return;
    }

    const file = fileList[0];

    if (file.url) {
      setLogoPreview(file.url);
      return;
    }

    if (file.originFileObj) {
      try {
        setIsLogoLoading(true);
        const preview = await convertFileToBase64(file.originFileObj as File);
        setLogoPreview(preview);
      } catch {
        messageApi.error("Failed to preview logo");
      } finally {
        setIsLogoLoading(false);
      }
    }
  };

  const handleSubmit = async (values: CafeFormValues) => {
    // Extract the file from the upload component
    let logoValue = "";
    if (values.logo && values.logo.length > 0) {
      const file = values.logo[0];
      if (file.originFileObj) {
        try {
          logoValue = await convertFileToBase64(file.originFileObj as File);
        } catch {
          messageApi.error("Failed to process logo file");
          return;
        }
      } else if (file.url) {
        logoValue = file.url;
      }
    }

    const cafeData: CafeFormData = {
      name: values.name,
      description: values.description,
      logo: logoValue,
      location: values.location,
    };

    if (isEditMode && id) {
      updateMutation.mutate({ id, data: cafeData });
    } else {
      createMutation.mutate(cafeData);
    }
  };

  const handleCancel = () => {
    navigate("/cafes");
  };

  const handleRemoveLogo = () => {
    form.setFieldValue("logo", undefined);
    setLogoPreview(undefined);
    setIsLogoLoading(false);
    setIsDirty(true);
  };

  return (
    <>
      {messageContextHolder}
      {BlockerModal}

      <div
        style={{
          background: "#fff",
          padding: "32px",
          borderRadius: "8px",
        }}
      >
        <PageHeader title={isEditMode ? "Edit Café" : "Add New Café"} />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleValuesChange}
          autoComplete="off"
        >
          <FormTextField
            label="Name"
            name="name"
            placeholder="Enter café name"
            required
            minLength={6}
            maxLength={10}
          />

          <FormTextField
            label="Description"
            name="description"
            placeholder="Enter café description"
            type="textarea"
            required
            maxLength={256}
          />

          <Form.Item
            label="Logo"
            name="logo"
            tooltip="Upload a logo image (max 2MB)"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
            rules={[
              {
                validator: (_, fileList) => {
                  if (!fileList || fileList.length === 0) {
                    return Promise.resolve();
                  }
                  const file = fileList[0];
                  const size =
                    (file.originFileObj as File | undefined)?.size ??
                    file.size ??
                    0;
                  const isLt2M = size / 1024 / 1024 < 2;
                  if (!isLt2M) {
                    return Promise.reject(
                      new Error("Logo must be smaller than 2MB")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
              listType="picture-card"
              showUploadList={false}
              onChange={handleLogoChange}
            >
              {logoPreview ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={logoPreview}
                    alt="logo"
                    style={{ width: "100%" }}
                    draggable={false}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseCircleFilled style={{ fontSize: 20 }} />}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleRemoveLogo();
                    }}
                    style={{
                      top: -10,
                      right: 4,
                      color: "#000000ff",
                      padding: 0,
                      lineHeight: 1,
                      position: "absolute",
                    }}
                  />
                </div>
              ) : (
                <div>
                  {isLogoLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <FormTextField
            label="Location"
            name="location"
            placeholder="Enter location"
            required
          />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {isEditMode ? "Update" : "Submit"}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CafeForm;
