import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import Text from './text';
import './style.less';

import 'antd/dist/antd.less';

const App = () => {
  const [state, setState] = useState(1);

  return (
    <div className="container">
      <p className="center">Hello, ESBuild!</p>
      <Text text={state.toString()} />
      <Button type="primary" onClick={() => setState((c) => c + 1)}>
        GOT IT!!
      </Button>
    </div>
  );
};

const container = document.getElementById('root');
ReactDOM.render(<App />, container);
