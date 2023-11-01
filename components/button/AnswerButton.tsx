interface AnswerButtonProps {
  index: number;
  option: string;
  answer: string;
  handler: (ans: string) => void;
}

const AnswerButton: React.FC<AnswerButtonProps> = ({
  option,
  index,
  answer,
  handler,
}) => {
  const handleClick = () => {
    handler(option);
  };

  const label = String.fromCharCode(65 + index);
  const isActive = answer === option;

  return (
    <button
      className={
        isActive
          ? "text-left flex items-center border-gray-300 bg-purple-600 text-white hover:bg-purple-700 border-2 rounded-full p-2 px-4 transition-all"
          : "text-left flex items-center border-gray-300 hover:bg-gray-100 border-2 rounded-full p-2 px-4 transition-all"
      }
      onClick={handleClick}
    >
      <span
        className={`text-xl mr-3 font-medium ${
          isActive ? "text-yellow-400" : "text-purple-800"
        }`}
      >
        {label}
      </span>
      {option}
    </button>
  );
};

export default AnswerButton;
