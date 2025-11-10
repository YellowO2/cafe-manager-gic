import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Button, message, Space } from "antd";
import { getCafe, createCafe, updateCafe } from "../../api/cafes";
import type { CafeFormData } from "../../types";

const { TextArea } = Input;

const CafeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const isEditMode = !!id;

  // Fetch cafe data if editing
  const { data: cafeData } = useQuery({
    queryKey: ["cafeData", id],
    queryFn: () => getCafe(id!),
    enabled: isEditMode,
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && cafeData) {
      form.setFieldsValue({
        name: cafeData.name,
        description: cafeData.description,
        logo: cafeData.logo,
        location: cafeData.location,
      });
    }
  }, [isEditMode, cafeData, form]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createCafe,
    onSuccess: () => {
      message.success("Café created successfully");
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
      navigate("/cafes");
    },
    onError: (error: Error) => {
      message.error(`Failed to create café: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CafeFormData }) =>
      updateCafe(id, data),
    onSuccess: () => {
      message.success("Café updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
      navigate("/cafes");
    },
    onError: (error: Error) => {
      message.error(`Failed to update café: ${error.message}`);
    },
  });

  const handleSubmit = (values: CafeFormData) => {
    const cafeData = {
      name: values.name,
      description: values.description,
      logo: values.logo || "",
      location: values.location,
    };

    if (isEditMode && id) {
      updateMutation.mutate({ id, data: cafeData });
    } else {
      createMutation.mutate(cafeData);
    }
  };

  const handleCancel = () => {
    // TODO: Add unsaved changes warning
    navigate("/cafes");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>{isEditMode ? "Edit Café" : "Add New Café"}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter café name" },
            { min: 6, message: "Name must be at least 6 characters" },
            { max: 10, message: "Name must not exceed 10 characters" },
          ]}
        >
          <Input placeholder="Enter café name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter description" },
            { max: 256, message: "Description must not exceed 256 characters" },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Enter café description"
            showCount
            maxLength={256}
          />
        </Form.Item>

        <Form.Item
          label="Logo URL"
          name="logo"
          tooltip="Optional: Enter a URL to the café logo image"
        >
          <Input placeholder="https://example.com/logo.png" />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

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
  );
};

export default CafeForm;
