import styled from 'styled-components';
import { stateTypes } from '../../utils/constants';
import Tag from './Tag';

interface PatientCardProps {
  state: string;
  name: string | JSX.Element;
  onClick: () => void;
}

const borderColors = {
  [stateTypes.tripStart]: '#9CD323',
  [stateTypes.end]: '#9CD323',
  [stateTypes.tripEnd]: '#9CD323',
  [stateTypes.decline]: '#C11574',
};

const tagColors = {
  [stateTypes.tripStart]: '#9cd323',
  [stateTypes.end]: '#9cd323',
  [stateTypes.tripEnd]: '#9cd323',
  [stateTypes.decline]: '#C11574',
};

const backgroundColors = {
  [stateTypes.tripStart]: '#9CD3233D',
  [stateTypes.end]: '#9CD3233D',
  [stateTypes.tripEnd]: '#9CD3233D',
  [stateTypes.decline]: '#FDF2FA',
};

const PatientCard = ({ state, name, onClick }: PatientCardProps) => {
  const hasTagState = [
    stateTypes.tripStart,
    stateTypes.decline,
    stateTypes.end,
    stateTypes.tripEnd,
  ].includes(state);

  return (
    <Container state={state} onClick={onClick}>
      <Row>
        <Name>{name}</Name>
        {hasTagState && <Tag text={state} color={tagColors[state]} />}
      </Row>
    </Container>
  );
};
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled.div<{ state: string }>`
  background: ${({ state }) => backgroundColors[state] || '#f5f5f5'};
  border: ${({ state }) => (borderColors[state] ? `1px solid ${borderColors[state]}` : '')};
  padding: 14px 16px;
  border-radius: 4px;
  cursor: pointer;
`;

const Name = styled.div`
  font-size: 1.4;
  color: #0a196f;
  font-weight: 600;
`;

export default PatientCard;
