import React from 'react';
import styled from 'styled-components';

interface Props{
  progress : number
}
const Bar = styled.div`
    height : 4px;
    margin : 0px 3px;
    border-radius: 3px;
    width: 100%;
    display : flex;
    background-color : gray;
    div{
        background-color : white;
    }
`;
const StoryProgressBar : React.FC<Props> = (props: Props) => (
  <Bar>
    <div style={{ width: `${props.progress}%` }} />
  </Bar>
);
export default StoryProgressBar;
