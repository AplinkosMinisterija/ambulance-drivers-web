import { useState } from 'react';
import Div100vh from 'react-div-100vh';
import styled from 'styled-components';
import Button, { ButtonColors } from '../components/buttons/Button';
import { geLoginUrl } from '../utils/api';
import { buttonLabels, descriptions, title } from '../utils/texts';

const Login = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Div100vh>
      <Container>
        <ImageContainer>
          <Image src="/loginImage.jpg" />
        </ImageContainer>
        <Content>
          <InnerContent>
            <Title>{title.login}</Title>
            <Description>{descriptions.login}</Description>
          </InnerContent>
          <Button
            color={'#0A196F'}
            variant={ButtonColors.LOGIN}
            loading={loading}
            onClick={() => {
              setLoading(true);
              window.location.href = geLoginUrl();
            }}
          >
            {buttonLabels.login}
          </Button>
        </Content>
      </Container>
    </Div100vh>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-width: 800px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 120px 24px 72px 24px;
  overflow-y: auto;
  gap: 20px;
`;
const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Image = styled.img`
  object-fit: cover;
  background-blend-mode: multiply;
  mix-blend-mode: luminosity;
  height: 100%;
  width: 100%;
  opacity: 0.31;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #0a196f;
`;

const Title = styled.div`
  font-size: 4.9rem;
  color: #ffffff;
  font-weight: bold;
`;

const Description = styled.div`
  font-size: 1.8rem;
  color: #ffffff;
`;

export default Login;
