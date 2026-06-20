export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`
          relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          
          <button onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}


/// code for testing the modal component

// const [open, setOpen] = useState(false);

// <>
//   <Button onClick={() => setOpen(true)}>Open Modal</Button>

//   <Modal
//     isOpen={open}
//     onClose={() => setOpen(false)}
//     title="Login"
//   >
//     <p>Hello from modal 👋</p>
//   </Modal>
// </>