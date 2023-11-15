import styled from 'styled-components';
import Loader from './Loader';

const LoaderComponent = ({ text }: { text?: string }) => (
  <LoaderContainer>
    <Loader />
    <Text>{text}</Text>
  </LoaderContainer>
);
const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  gap: 12px;
`;

const Text = styled.div`
  text-align: center;
  margin: 0 16px;
`;

export default LoaderComponent;
