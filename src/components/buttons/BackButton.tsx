import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Icon from "../other/Icons";
import Button from "./Button";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <StyledButton
      onClick={() => {
        navigate(-1);
      }}
      leftIcon={<StyledBackIcon name="backMobile" />}
      type="button"
      buttonPadding="0"
      height="32px"
    />
  );
};

const StyledButton = styled(Button)`
  min-width: 0px;
  width: fit-content;
`;

const StyledBackIcon = styled(Icon)`
  cursor: pointer;
  font-size: 3rem;
  align-self: center;
  color: white;
`;

export default BackButton;
