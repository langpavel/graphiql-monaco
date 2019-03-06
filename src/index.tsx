import React from 'react';
import ReactDOM from 'react-dom';
import GoldenLayout from 'golden-layout';
import './index.css';
import 'golden-layout/src/css/goldenlayout-base.css';
import 'golden-layout/src/css/goldenlayout-dark-theme.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

declare global {
  interface Window {
    React: typeof React;
    ReactDOM: typeof ReactDOM;
  }
}
window.React = React;
window.ReactDOM = ReactDOM;

const rootElement = document.getElementById('root');

var myLayout = new GoldenLayout({
  content: [
    {
      type: 'row',
      content: [
        {
          type: 'react-component',
          component: 'test-component',
          props: { label: 'A' },
        },
        {
          type: 'column',
          content: [
            {
              type: 'react-component',
              component: 'test-component',
              props: { label: 'B' },
            },
            {
              type: 'react-component',
              component: 'test-component',
              props: { label: 'C' },
            },
          ],
        },
      ],
    },
  ],
});

function TestComponent(props: { label: string }) {
  return <h1>{props.label}</h1>;
}
myLayout.registerComponent('test-component', App);

//Once all components are registered, call
myLayout.init();

// ReactDOM.render(<App />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
