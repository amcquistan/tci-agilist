import React, { useState } from 'react';
import { useEffect } from 'react';
import IPage from '../interfaces/page';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

const AboutPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    console.log(`Loading ${props.name}`);
    let num = props.match.params.number;
    if (num) {
      setMessage(`The number is ${num}`)
    } else {
      setMessage("No number given")
    }
  }, [props])

  return (
    <>
      <p>{message}</p>
      <Link to="/">Go to Home Page</Link>
    </>
  );
}

export default withRouter(AboutPage);
