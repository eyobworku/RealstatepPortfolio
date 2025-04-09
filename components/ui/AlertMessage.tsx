import { CircleCheck, CircleX } from "lucide-react";

interface AlertMessageProps {
  type: "success" | "error";
  message: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
  const alertStyles = {
    success: {
      bgColor: "bg-green-50",
      textColor: "text-green-500",
      icon: CircleCheck,
    },
    error: {
      bgColor: "bg-red-50",
      textColor: "text-red-500",
      icon: CircleX,
    },
  };

  const { bgColor, textColor, icon: Icon } = alertStyles[type];

  return (
    <div
      className={`flex items-start space-x-3 mb-8 text-sm ${bgColor} p-4 rounded-lg`}
    >
      <Icon className={`${textColor} text-lg pt-1`} />
      <p className="text-gray-700 text-xl leading-relaxed">{message}</p>
    </div>
  );
};

export default AlertMessage;
