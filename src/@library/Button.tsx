import React from 'react';
import {ButtonProps} from "@web3uikit/core";
import {Button as UiKitButton} from '@web3uikit/core'

interface IButtonProps extends ButtonProps {}

export const Button: React.FC<IButtonProps> = (props) => {
  return (
    <UiKitButton theme={'outline'} {...props} />
  );
};
