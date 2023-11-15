import styled from "styled-components";
import Button, { ButtonColors } from "../../components/buttons/Button";
import Icon from "../../components/other/Icons";
import Modal from "../../components/other/Modal";
import { device } from "../../styles";
import { buttonsTitles } from "../texts";
import useIosInstallPrompt from "./useIosInstallPrompt";
import useWebInstallPrompt from "./useWebInstallPrompt";

export const InstallPWA = () => {
  const [iosInstallPrompt, handleIOSInstallDeclined] = useIosInstallPrompt();
  const [webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted] =
    useWebInstallPrompt();

  const isiOS13AndUp = /OS (13|14)/.test(window.navigator.userAgent);
  const iOSClass = isiOS13AndUp ? "modernShare" : "share";

  if (!iosInstallPrompt && !webInstallPrompt) {
    return null;
  }

  return (
    <Modal visible>
      <Container>
        <Icon name="logo" />
        <InnerContainer>
          <Title>Įdiegti aplikaciją</Title>
          {iosInstallPrompt && (
            <>
              <Description className="text-center">
                Norint įdiegti aplikaciją, pasinaudokite spustelėjimu ant šios
                ikonos, ekrano apačioje.
                <StyledIcon name={iOSClass} />
              </Description>
              <Button
                height={"30px"}
                variant={ButtonColors.TRANSPARENT}
                onClick={handleIOSInstallDeclined}
              >
                {buttonsTitles.close}
              </Button>
            </>
          )}
          {webInstallPrompt && (
            <>
              <Button height={"30px"} onClick={handleWebInstallAccepted}>
                {buttonsTitles.install}
              </Button>
              <Button
                height={"30px"}
                variant={ButtonColors.TRANSPARENT}
                onClick={handleWebInstallDeclined}
              >
                {buttonsTitles.close}
              </Button>
            </>
          )}
        </InnerContainer>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  background-color: #ffffff;
  box-shadow: 0px 18px 41px #121a5529;
  border-radius: 10px;
  padding: 40px;
  display: flex;
  margin: 0 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  @media ${device.mobileL} {
    padding: 50px;
    max-width: 100%;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.div`
  text-align: center;
  margin-top: 16px;

  font-size: 2.5rem;
`;

const StyledIcon = styled(Icon)`
  text-align: center;
  height: 20px;
  width: 20px;
`;

const Description = styled.div`
  text-align: center;
  font: normal normal medium 16px/26px;
  color: #7a7e9f;
  text-align: center;
`;
