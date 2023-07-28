import React from 'react';
import {Typography, TypographyProps} from "@web3uikit/core";

interface ITextProps extends TypographyProps {}

export const Text: React.FC<ITextProps> = ({children, ...props}) => {
  return (
    <Typography color={'white'} {...props}>
      {children}
    </Typography>
  );
};
