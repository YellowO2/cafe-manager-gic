// Renderer for action buttons in table rows (Edit/Delete)
import { Button, message, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ActionsRendererProps {
  data: {
    id: string;
    name: string;
  };
  editPath: string; // e.g., "/cafes/edit" or "/employees/edit"
  deleteFn: (id: string) => Promise<void>; // The API delete function
  entityName: string; // e.g., "Café" or "Employee"
  queryKey: string[]; // e.g., ["cafes"] or ["employees"]
  deleteWarning?: string; // Optional custom warning message
}

const ActionsRenderer: React.FC<ActionsRendererProps> = (props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modal, contextHolder] = Modal.useModal(); // ✅ Hook version with context support

  const handleEdit = (id: string) => {
    navigate(`${props.editPath}/${id}`);
  };

  const deleteMutation = useMutation({
    mutationFn: props.deleteFn,
    onSuccess: () => {
      message.success(`${props.entityName} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: props.queryKey }); // Trigger refetch react query
    },
    onError: (error: Error) => {
      message.error(
        `Failed to delete ${props.entityName.toLowerCase()}: ${error.message}`
      );
    },
  });

  const handleDelete = (id: string, name: string) => {
    const defaultWarning = `Are you sure you want to delete "${name}"?`;
    const warningMessage = props.deleteWarning
      ? props.deleteWarning.replace("{name}", name)
      : defaultWarning;

    modal.confirm({
      title: `Delete ${props.entityName}`,
      content: warningMessage,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        deleteMutation.mutate(id);
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Space>
        <Button
          type="primary"
          icon={<EditOutlined />}
          size="small"
          aria-label={`Edit ${props.data.name}`}
          onClick={() => handleEdit(props.data.id)}
        ></Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          size="small"
          aria-label={`Delete ${props.data.name}`}
          onClick={() => handleDelete(props.data.id, props.data.name)}
        ></Button>
      </Space>
    </>
  );
};

export default ActionsRenderer;
