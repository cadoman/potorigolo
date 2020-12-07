import { shell } from 'electron';
import React from 'react';
import styled from 'styled-components';

const StyledAsLink = styled.button`
    border: none;
    background-color : transparent;
    text-decoration : underline;
    cursor : pointer;
    color: #2e82bb;
    font-size: 1rem;
`;
interface Props {
  to: string;
  children: any
}
const LinkButton: React.FC<Props> = ({ to, children }: Props) => (
  <StyledAsLink type="button" onClick={() => shell.openExternal(to)}>{children}</StyledAsLink>
);

export default LinkButton;
