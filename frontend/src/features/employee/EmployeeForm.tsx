// contains the form for adding/editing employees, similar to CafeForm.tsx
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Button, message, Space } from "antd";
import {
  getEmployee,
  createEmployee,
  updateEmployee,
} from "../../api/employees";
import type { EmployeeFormData } from "../../types";
import dayjs from "dayjs";

const EmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const isEditMode = !!id;

  // Fetch employee data if editing
  const { data: employeeData } = useQuery({
    queryKey: ["employeeData", id],
    queryFn: () => getEmployee(id!),
    enabled: isEditMode,
  });

  // Todo: may be needed
  // const startDate = dayjs(employeeData?.start_date);
  // const daysWorked = startDate.isValid() ? dayjs().diff(startDate, "day") : 0;

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && employeeData) {
      form.setFieldsValue({
        name: employeeData.name,
        email_address: employeeData.email_address,
        phone_number: employeeData.phone_number,
        cafe: employeeData.cafeId,
      });
    }
  }, [isEditMode, employeeData, form]);
  // Create mutation
  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      message.success("Employee created successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      navigate("/employees");
    },
    onError: (error: Error) => {
      message.error(`Failed to create employee: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormData }) =>
      updateEmployee(id, data),
    onSuccess: () => {
      message.success("Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      navigate("/employees");
    },
    onError: (error: Error) => {
      message.error(`Failed to update employee: ${error.message}`);
    },
  });

  const handleFinish = (values: EmployeeFormData) => {
    if (isEditMode && id) {
      updateMutation.mutate({ id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        name: "",
        email_address: "",
        phone_number: "",
        days_worked: 0,
        cafe: "",
      }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter employee name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email Address"
        name="email_address"
        rules={[{ required: true, message: "Please enter email address" }]}
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item
        label="Phone Number"
        name="phone_number"
        rules={[{ required: true, message: "Please enter phone number" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Cafe"
        name="cafe"
        rules={[{ required: true, message: "Please enter cafe" }]}
      >
        <Input />
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
  );
};

export default EmployeeForm;
