

interface DateChipProps {
  label: string;
  value: string;
  active: boolean;
  onClick: (value: string) => void;
}

export default function DateChip({ label, value, active, onClick }:DateChipProps) {
    return (
        <button
            style={buttonStyle}
            onClick={() => onClick(value)}
            className={`px-3 py-1 rounded-full border text-sm transition ${
                active
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
        >
            {label}
        </button>
    );

}

const buttonStyle = {
    cursor: "pointer",
}
