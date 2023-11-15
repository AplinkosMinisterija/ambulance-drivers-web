import styled from "styled-components";

export interface DefaultLayoutProps {
  children?: React.ReactNode;
  maxWidth?: string;
  onScroll?: any;
}

const Header = ({ children }: DefaultLayoutProps) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  padding: 16px;
  color: white;
  background-color: #0a196f;
  position: sticky;
  top: 0;
  z-index: 20;
`;

export default Header;
