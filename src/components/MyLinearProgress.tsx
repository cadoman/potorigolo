/* eslint-disable react/jsx-props-no-spreading */
import React, { CSSProperties } from 'react';
import {
  createStyles, withStyles,
} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles(() => createStyles({
  root: {
    height: 20,
  },
}))(LinearProgress);

export default function MyLinearProgress({ progress, style } : {progress : number, style : CSSProperties}) {
  return (
    <div style={style}>
      <BorderLinearProgress variant="determinate" value={progress} />
    </div>
  );
}
