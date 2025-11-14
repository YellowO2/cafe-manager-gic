// Contains the form for adding/editing employees, similar to CafeForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Button, message, Space, Radio, Select, DatePicker } from "antd";
import {
  getEmployee,
  createEmployee,
  updateEmployee,
} from "../../api/employees";
import { getCafes } from "../../api/cafes";
import type { EmployeeFormData } from "../../types";
import dayjs from "dayjs";
import { useFormNavigationBlocker } from "../../hooks/useFormNavigationBlocker";
import { FormTextField } from "../../components/FormTextField";
import PageHeader from "../../components/PageHeader";
import { getErrorMessage } from "../../utils/errorHandler";

type EmployeeFormValues = Omit<EmployeeFormData, "start_date"> & {
  start_date?: dayjs.Dayjs | null;
};

const EmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<EmployeeFormValues>();
  const isEditMode = !!id;
  const [searchParams] = useSearchParams();
  const preselectedCafeName = searchParams.get("cafe");
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
      setIsDirty(false); // Reset dirty state on success
      messageApi.success("Employee created successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      // Redirect back to employees list after a short delay
      setTimeout(() => {
        navigate(
          preselectedCafeName
            ? `/employees?cafe=${preselectedCafeName}`
            : "/employees"
        );
      }, 500);
    },
    onError: (error) => {
      messageApi.error(getErrorMessage(error));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormData }) =>
      updateEmployee(id, data),
    onSuccess: () => {
      setIsDirty(false); // Reset dirty state on success
      messageApi.success(
        "Employee updated successfully. Navigating back in 3s..."
      );
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      // Redirect back to employees list after a short delay
      setTimeout(() => {
        navigate("/employees");
      }, 3000);
    },
    onError: (error) => {
      messageApi.error(getErrorMessage(error));
    },
  });

  const cafes = useQuery({
    queryKey: ["cafes"],
    queryFn: () => getCafes(),
  });

  // Pre-select cafe if coming from filtered employees page
  useEffect(() => {
    if (
      !isEditMode &&
      preselectedCafeName &&
      cafes.data &&
      !form.getFieldValue("cafeId")
    ) {
      const matchingCafe = cafes.data.find(
        (cafe) => cafe.name === preselectedCafeName
      );
      if (matchingCafe) {
        const startDateValue = dayjs();
        form.setFieldsValue({
          cafeId: matchingCafe.id,
          start_date: startDateValue,
        });
        setInitialValues((prev) => ({
          ...(prev ?? {
            name: "",
            email_address: "",
            phone_number: "",
            gender: "male",
            cafeId: undefined,
            start_date: null,
          }),
          cafeId: matchingCafe.id,
          start_date: startDateValue,
        }));
      }
    }
  }, [isEditMode, preselectedCafeName, cafes.data, form]);

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
      <div
        style={{
          margin: "0 auto",
          background: "#fff",
          padding: "32px",
          borderRadius: "8px",
        }}
      >
        <PageHeader title={isEditMode ? "Edit Employee" : "Add New Employee"} />
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
          <FormTextField
            label="Name"
            name="name"
            placeholder="Enter employee name"
            required
            minLength={6}
            maxLength={10}
          />

          <FormTextField
            label="Email Address"
            name="email_address"
            placeholder="Enter email address"
            type="email"
            required
          />

          <FormTextField
            label="Phone Number"
            name="phone_number"
            placeholder="Enter phone number"
            required
            customRules={[
              {
                pattern: /^[89]\d{7}$/,
                message:
                  "Please enter an 8-digit SG phone number starting with 8 or 9",
              },
            ]}
          />

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
      </div>
    </>
  );
};

export default EmployeeForm;
