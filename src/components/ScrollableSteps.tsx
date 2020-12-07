import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import animateScrollTo from 'animated-scroll-to';

const StepContainer = styled.div<{ active: boolean }>`
  opacity: ${(props) => (props.active ? '1' : '.6')};
  display : flex;
  flex-direction : column;
  min-height : 80vh;
  padding-top: 50px;
  img{
      align-self: flex-start;
  }
`;

const StyledScrollableSpecs = styled.div`
    nav{
        position: fixed;
        width: 70%;
        top: 0;
        display: flex;
        background-color: white;
        z-index: 2;
        flex-direction:  column;
        ol{
            margin-top: 0;
            margin-bottom: 0;
            display: flex;
            justify-content: stretch;
            list-style-type: none;
            padding-left: 0;
            button{
                background-color: transparent;
                border : none;
                padding-top: 30px;
                flex: 1;
                text-align: center;
                color : gray;
                cursor: pointer;
                outline: none;

            }
            button.remaining{
                color : #2b2b2b;
            }
            button.active{
                color : #2275c2;
                font-weight: bold;
            }
        }
        .ariane{
            button{
                position: relative;
                display: flex;
                justify-content: center;
                div.background{
                    position: absolute;                
                    right: 50% ;
                    left:-50%;
                    background-color: #2275c2;
                    z-index: -1;
                    height: 10px;
                    top: 43px;
                    height: 4px;
                    transition: height .2s, top .2s;
                    transition-delay: .2s
                }
                .step-button{
                    margin-top: 7px;
                    width: 15px;
                    height: 15px;
                    border-radius: 15px;
                    border: none;
                    background-color: #2275c2;
                    transition: width .2s, height .2s, margin-top .2s;
                }
            }
            button.active{
                div.background{
                    top: 41px;
                    height: 8px;
                    transition-delay: 0s;
                }
                .step-button{
                    margin-top: 0px;
                    width : 30px;
                    height: 30px;
                    transition-delay: .1s
              }
            }
            button:first-child{
                div.background{
                    display: none;
                }
            }
        }
    }
    .all-steps{
        margin-top: 200px;
    }
`;

interface StepProps {
  children: any;
  title: string;
}
export const Step: React.FC<StepProps> = ({ children }: StepProps) => children;

interface Props {
  children: React.ReactElement<StepProps>[]
}

export const ScrollableSteps: React.FC<Props> = ({ children }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [lastWheelTime, setLastWheelTime] = useState(0);
  const [emulatingScroll, setEmulatingScroll] = useState(false);
  const containerRef = useRef<HTMLDivElement>();

  const changeStep = (newStep: number) => {
    if (newStep !== currentStep) {
      setCurrentStep(newStep);
      const nextFocused = containerRef.current.querySelector(`div#\\3${newStep}`);
      setEmulatingScroll(true);
      animateScrollTo(nextFocused, { cancelOnUserAction: false }).then((scrollDone) => {
        if (scrollDone) {
          setEmulatingScroll(false);
        }
      });
    }
  };

  useEffect(() => {
    const minimumThrottling = 700;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (new Date().getTime() - lastWheelTime > minimumThrottling) {
        setLastWheelTime(new Date().getTime());
        const delta = event.deltaY > 0 ? 1 : -1;
        let newStep = currentStep + delta;
        if (newStep >= children.length) {
          newStep = children.length - 1;
        } else if (newStep < 0) {
          newStep = 0;
        }
        changeStep(newStep);
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [currentStep]);

  useEffect(() => {
    if (!emulatingScroll) {
      const handleScroll = () => {
        const firstVisible = Array.from(containerRef.current.children)
          .findIndex((child) => (child.firstChild as Element).getBoundingClientRect().y > 0);
        if (firstVisible !== currentStep) {
          setCurrentStep(firstVisible);
        }
      };
      document.addEventListener('scroll', handleScroll);
      return () => document.removeEventListener('scroll', handleScroll);
    }
    return () => { };
  }, [emulatingScroll]);

  return (
    <StyledScrollableSpecs>
      <nav>
        <ol className="titles">
          {
                        children.map((step, index) => (
                          <button
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            type="button"
                            className={(index === currentStep ? 'active' : '') + (index > currentStep ? ' remaining' : '')}
                            onClick={() => changeStep(index)}
                          >
                            {step.props.title}
                          </button>
                        ))
                    }
        </ol>
        <ol className="ariane">
          {
                        children.map((_, index) => (
                          <button
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            type="button"
                            className={`${index <= currentStep ? 'active' : ''}`}
                            onClick={() => changeStep(index)}
                          >
                            <div className="background" />
                            <div className="step-button" />
                          </button>
                        ))
                    }

        </ol>
      </nav>
      <div ref={containerRef}>
        {
                    children.map((step, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <StepContainer id={String(index)} active={index === currentStep} key={index}>
                        {step}
                      </StepContainer>
                    ))
                }
      </div>
    </StyledScrollableSpecs>
  );
};
