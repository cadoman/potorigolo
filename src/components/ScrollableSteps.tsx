import React, {
  useEffect, useReducer, useRef,
} from 'react';
import styled from 'styled-components';
import animateScrollTo from 'animated-scroll-to';

const StepContainer = styled.div<{ active: boolean }>`
  opacity: ${(props) => (props.active ? '1' : '.6')};
  display : flex;
  flex-direction : column;
  min-height : 80vh;
  padding-top: 150px;
  align-items: center;
`;

const StyledScrollableSpecs = styled.div`
  nav{
      position: fixed;
      height: 150px;
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
                  border-radius: 30px;
                  border: none;
                  background-color: #2275c2;
                  transition: width .2s, height .2s, margin-top .2s;
              }
          }
          button.done{
              div.background{
                  top: 42px;
                  height: 8px;
                  transition-delay: 0s;
              }
              .step-button{
                  border: 5px solid #2275C2;
                  margin-top: 0px;
                  width : 22px;
                  height: 22px;
                  transition-delay: .1s
            }
          }
          button.active{
            .step-button{
              background-color: white;
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
interface ScrollingState {
  currentStep: number;
  doingAutomatedScroll: boolean;
  maxStep: number;
}
interface ScrollAction {
  type: 'scrollup' | 'scrolldown' | 'scrollto' | 'automatedScrollEnd',
  scrollTarget?: number;
  animate? : boolean;
}
const reducer = (state: ScrollingState, action: ScrollAction): ScrollingState => {
  if (state.doingAutomatedScroll && action.type !== 'automatedScrollEnd') {
    return state;
  }
  switch (action.type) {
    case 'scrolldown':
      return {
        ...state,
        doingAutomatedScroll: true,
        currentStep: state.currentStep === state.maxStep ? state.currentStep : state.currentStep + 1,
      };
    case 'scrollup':
      return {
        ...state,
        doingAutomatedScroll: true,
        currentStep: state.currentStep === 0 ? 0 : state.currentStep - 1,
      };
    case 'scrollto':
      return {
        ...state,
        doingAutomatedScroll: action.animate,
        currentStep: action.scrollTarget,
      };
    case 'automatedScrollEnd':
      return {
        ...state,
        doingAutomatedScroll: false,
      };
    default:
      return state;
  }
};

export const ScrollableSteps: React.FC<Props> = ({ children }: Props) => {
  const [{ currentStep, doingAutomatedScroll }, dispatchScroll] = useReducer(reducer, {
    currentStep: 0,
    doingAutomatedScroll: false,
    maxStep: children.length - 1,
  } as ScrollingState);
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    let lastSpeed = 0;
    let lastAccelerationTime = 0;
    const throttleTime = 500;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = new Date().getTime();
      const speed = Math.abs(event.deltaY);
      if (speed - lastSpeed > 10 && now - lastAccelerationTime > throttleTime) {
        // console.log('acceleration : ', speed - lastSpeed);
        dispatchScroll(event.deltaY > 0 ? { type: 'scrolldown' } : { type: 'scrollup' });
        lastAccelerationTime = now;
      }
      lastSpeed = speed;
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);
  useEffect(() => {
    if (doingAutomatedScroll) {
      const nextFocused = containerRef.current.querySelector(`div#\\3${currentStep}`);
      animateScrollTo(nextFocused, { cancelOnUserAction: false }).then((targetReached) => {
        if (targetReached) {
          dispatchScroll({ type: 'automatedScrollEnd' });
        }
      });
    }
  }, [doingAutomatedScroll]);

  useEffect(() => {
    const watchHandMadeScroll = () => {
      const firstVisible = Array.from(containerRef.current.children).findIndex((child) => child.getBoundingClientRect().top >= 0);
      dispatchScroll({ type: 'scrollto', scrollTarget: firstVisible });
    };
    document.addEventListener('scroll', watchHandMadeScroll);
    return () => document.removeEventListener('scroll', watchHandMadeScroll);
  }, [doingAutomatedScroll]);

  // useEffect(() => {
  //   let lastSpeed = 0;
  //   let lastScroll = 0;
  //   const throttleTime = 200;
  //   const updateWheelSpeed = (event : WheelEvent) => {
  //     const currentSpeed = event.deltaY ** 2;
  //     const now = new Date().getTime();
  //     if (currentSpeed > 10 * lastSpeed && now - lastScroll > throttleTime) {
  //       setScrollAllowed(true);
  //       console.log('allowing scroll, lastspeed : ', lastSpeed, 'current speed : ', currentSpeed);
  //     }
  //     lastSpeed = currentSpeed;
  //     lastScroll = now;
  //   };
  //   document.addEventListener('wheel', updateWheelSpeed);
  //   return () => document.removeEventListener('wheel', updateWheelSpeed);
  // }, []);

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
                onClick={() => dispatchScroll({ type: 'scrollto', scrollTarget: index, animate: true })}
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
                className={`${index <= currentStep ? 'done' : ''} ${index === currentStep ? 'active' : ''}`}
                onClick={() => dispatchScroll({ type: 'scrollto', scrollTarget: index, animate: true })}
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
