import { useNavigate } from "react-router";
import Button from "./Button";

function BackButton() {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        type="back"
        onClick={(e) => {
          e.preventDefault(); // this does NOT submit the form
          navigate(-1);
        }}
      >
        &larr; Back
      </Button>
    </div>
  );
}

export default BackButton;
