import { Loading } from '@web3uikit/core';
import React, {FC} from 'react';

export const Loader: FC = () => {
  return (
    <Loading
      size={40}
      spinnerColor="#2E7DAF"
    />
  );
};
