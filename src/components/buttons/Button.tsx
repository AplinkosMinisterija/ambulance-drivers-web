import React from "react";
import styled from "styled-components";
import Loader from "../other/Loader";

export enum ButtonColors {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TERTIARY = "tertiary",
  DANGER = "danger",
  SUCCESS = "success",
  TRANSPARENT = "transparent",
  LOGIN = "login"
}

export interface ButtonProps {
  variant?: ButtonColors;
  route?: string;
  children?: JSX.Element | string;
  leftIcon?: JSX.Element | string;
  rightIcon?: JSX.Element | string;
  height?: string;
  type?: string;
  loading?: boolean;
  padding?: string;
  buttonPadding?: string;
  signature?: boolean;
  disabled?: boolean;
  color?: string;
  fontWeight?: string;
}

const Button = ({
  variant = ButtonColors.PRIMARY,
  route,
  children,
  height = "56px",
  padding,
  leftIcon,
  buttonPadding,
  rightIcon,
  color,
  type,
  loading = false,
  className,
  disabled = false,
  fontWeight = "normal",
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Wrapper className={className} padding={padding || "0"} disabled={disabled}>
      <StyledButton
        padding={buttonPadding}
        color={color}
        fontWeight={fontWeight}
        variant={variant}
        height={height}
        type={type}
        disabled={disabled}
        {...rest}
      >
        {leftIcon}
        {loading ? <Loader color="white" /> : children}
        {rightIcon}
      </StyledButton>
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  padding: string;
  signature?: boolean;
  disabled: boolean;
}>`
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  padding: ${({ padding }) => (padding ? padding : 0)};
  min-width: 180px;
`;

const StyledButton = styled.button<{
  variant: ButtonColors;
  height: string;
  padding?: string;
  color?: string;
  fontWeight?: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => height};
  border-radius: 50px;
  padding: ${({ padding }) => (padding ? padding : "11px 20px;")};
  background-color: ${({ variant, theme }) => theme.colors[variant]};
  color: ${({ color, variant }) =>
    color ||
    (variant === ButtonColors.TRANSPARENT ? " rgb(35, 31, 32)" : "white")};
  border: ${({ variant }) =>
      variant === ButtonColors.TRANSPARENT ? "1.4px" : "1px"}
    solid
    ${({ variant, theme }) =>
      variant !== ButtonColors.TRANSPARENT
        ? "transparent"
        : " rgb(35, 31, 32)"};
  font-weight: ${({ fontWeight }) => fontWeight};
  font-size: 1.8rem;
  :hover {
    background-color: ${({ variant, theme }) => theme.colors.hover[variant]};
  }
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  width: 100%;
`;

Button.colors = ButtonColors;

export default Button;
