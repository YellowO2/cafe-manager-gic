import { useState } from "react";
import { useBlocker } from "react-router-dom";
import { Modal } from "antd";
import type { FormInstance } from "antd";

interface UseFormNavigationBlockerOptions<T> {
  form: FormInstance<T>;
  initialValues: T | null;
  isEnabled?: boolean;
}

interface UseFormNavigationBlockerReturn {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  handleValuesChange: () => void;
  BlockerModal: React.ReactNode;
}

/**
 * Custom hook to prevent navigation when form has unsaved changes.
 * @param form - Ant Design form instance
 * @param initialValues - Initial form values
 * @returns Object with isDirty state, handler, and Modal component
 */
export function useFormNavigationBlocker<T = Record<string, unknown>>({
  form,
  initialValues,
}: UseFormNavigationBlockerOptions<T>): UseFormNavigationBlockerReturn {
  const [isDirty, setIsDirty] = useState(false);

  const handleValuesChange = () => {
    if (initialValues) {
      const currentValues = form.getFieldsValue();
      const hasChanged =
        JSON.stringify(currentValues) !== JSON.stringify(initialValues);
      setIsDirty(hasChanged);
    }
  };

  // Block navigation if form is dirty
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  // Declarative modal for unsaved changes warning
  const BlockerModal = (
    <Modal
      open={blocker.state === "blocked"}
      title="You have unsaved changes"
      onOk={() => blocker.proceed?.()}
      onCancel={() => blocker.reset?.()}
      okText="Leave"
      cancelText="Stay"
    >
      <p>Are you sure you want to leave? Your changes will be lost.</p>
    </Modal>
  );

  return {
    isDirty,
    setIsDirty,
    handleValuesChange,
    BlockerModal,
  };
}
