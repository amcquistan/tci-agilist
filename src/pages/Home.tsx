import React from 'react';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import IPage from '../interfaces/page';

const HomePage: React.FunctionComponent<IPage> = props => {
  useEffect(() => {
    console.log(`Loading ${props.name}`)
  }, [props.name])

  return (<Redirect to='velocity-planning'/>);
}

export default HomePage;
