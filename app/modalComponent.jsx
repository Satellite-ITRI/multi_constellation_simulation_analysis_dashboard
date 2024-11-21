import PropTypes from 'prop-types';

//通用的ModalInput Component
export const ModalInput = ({
  label,
  value,
  name,
  onChange,
  readOnly = false,
  error
}) => (
  <div className="mb-4">
    <label className="mb-2 block text-sm font-bold text-gray-700">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`${
        readOnly ? 'bg-gray-200' : 'border-blue-500'
      } focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none`}
    />
    <span className="mt-1 text-red-500">{error}</span>
  </div>
);

ModalInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  error: PropTypes.string
};

//通用的DeleteModal Component
export const BaseDeleteModal = ({
  entity,
  entityName,
  onClose,
  onDelete,
  handleDelete
}) => {
  const handleDeleteClick = () => {
    handleDelete(entity.uid, onDelete, onClose);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="w-1/3 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Delete {entityName}</h2>
        <p className="mb-4">
          Are you sure you want to delete the &quot;{entity.name}&quot;?
        </p>
        <div className="flex justify-between">
          <button
            onClick={handleDeleteClick}
            className="rounded-md bg-red-700 px-4 py-2 font-bold text-white"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-gray-700 px-4 py-2 font-bold text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

BaseDeleteModal.propTypes = {
  entity: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  entityName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
};
