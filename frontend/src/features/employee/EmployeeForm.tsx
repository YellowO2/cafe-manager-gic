// Contains the form for adding/editing employees, similar to CafeForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  Input,
  Button,
  message,
  Space,
  Radio,
  Select,
  DatePicker,
} from "antd";
import {
  getEmployee,
  createEmployee,
  updateEmployee,
} from "../../api/employees";
import { getCafes } from "../../api/cafes";
import type { EmployeeFormData } from "../../types";
import dayjs from "dayjs";
import { useFormNavigationBlocker } from "../../hooks/useFormNavigationBlocker";

type EmployeeFormValues = Omit<EmployeeFormData, "start_date"> & {
  start_date?: dayjs.Dayjs | null;
};

const EmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<EmployeeFormValues>();
  const isEditMode = !!id;
  const [initialValues, setInitialValues] = useState<EmployeeFormValues | null>(
    null
  );

  // Use the custom hook for form navigation blocking
  const { setIsDirty, handleValuesChange, BlockerModal } =
    useFormNavigationBlocker({
      form,
      initialValues,
    });

  // Fetch employee data if editing
  const { data: employeeData } = useQuery({
    queryKey: ["employeeData", id],
    queryFn: () => getEmployee(id!),
    enabled: isEditMode,
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && employeeData) {
      const values = {
        name: employeeData.name,
        email_address: employeeData.email_address,
        phone_number: employeeData.phone_number,
        gender: employeeData.gender,
        cafeId: employeeData.cafeId,
        start_date: employeeData.start_date
          ? dayjs(employeeData.start_date)
          : null,
      };
      form.setFieldsValue(values);
      setInitialValues(values);
    } else if (!isEditMode) {
      setInitialValues({
        name: "",
        email_address: "",
        phone_number: "",
        gender: "male",
        cafeId: undefined,
        start_date: null,
      });
    }
  }, [isEditMode, employeeData, form]);

  const [messageApi, contextHolder] = message.useMessage();
  // Create mutation
  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      messageApi.success("Employee created successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsDirty(false); // Reset dirty state on success
      navigate("/employees");
    },
    onError: (error: Error) => {
      messageApi.error(`Failed to create employee: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormData }) =>
      updateEmployee(id, data),
    onSuccess: () => {
      messageApi.success("Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsDirty(false); // Reset dirty state on success
      navigate("/employees");
    },
    onError: (error: Error) => {
      messageApi.error(`Failed to update employee: ${error.message}`);
    },
  });

  const cafes = useQuery({
    queryKey: ["cafes"],
    queryFn: () => getCafes(),
  });

  const handleSubmit = (values: EmployeeFormValues) => {
    const employeeData: EmployeeFormData = {
      name: values.name,
      email_address: values.email_address,
      phone_number: values.phone_number,
      gender: values.gender,
      cafeId: values.cafeId,
      start_date: values.start_date
        ? values.start_date.toISOString()
        : undefined,
    };

    if (isEditMode && id) {
      updateMutation.mutate({ id, data: employeeData });
    } else {
      createMutation.mutate(employeeData);
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  return (
    <>
      {contextHolder}
      {BlockerModal}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        initialValues={{
          name: "",
          email_address: "",
          phone_number: "",
          gender: "",
          cafeId: null,
          start_date: null,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter employee name" },
            { min: 6, message: "Name must be at least 6 characters" },
            { max: 10, message: "Name must not exceed 10 characters" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email Address"
          name="email_address"
          rules={[
            { required: true, message: "Please enter email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              pattern: /^[89]\d{7}$/,
              message:
                "Please enter an 8-digit SG phone number starting with 8 or 9",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select gender" }]}
        >
          <Radio.Group>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Cafe"
          name="cafeId"
          rules={[{ message: "Please enter cafe" }]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Select a cafe"
            optionFilterProp="label"
            options={(cafes.data || []).map((cafe) => ({
              label: cafe.name,
              value: cafe.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.cafeId !== currentValues.cafeId
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("cafeId") ? (
              <Form.Item
                label="Start Date"
                name="start_date"
                // preserve={false}
                rules={[
                  { required: true, message: "Please select a start date" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            ) : null
          }
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
    </>
  );
};

export default EmployeeForm;
