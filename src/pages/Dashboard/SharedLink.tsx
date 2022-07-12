import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { downloadFile, fetchDetails } from 'pages/Dashboard/ducks/actions';
import { Card } from 'react-bootstrap';
import { APP_NAME } from 'config';
import 'react-datepicker/dist/react-datepicker.css';

const Shared: React.FC<any> = (props) => {
  const id = get(props, 'match.params.id', '');
  const [state, setState] = useState<any>({});
  const [time, setTime] = useState<any>(0);

  useEffect(() => {
    props
      .fetchDetails(id)
      .then((resp: any) => {
        setState(resp);
        const type = resp.url.name;
        props.downloadFile(id, type);
      })
      .catch((e: any) => {});
  }, [id, props]);

  useEffect(() => {
    const expire: any = new Date(state.expire);
    const date: any = new Date();
    const remainingTime = expire - date;
    setTime(remainingTime);
  }, [state.expire]);
  return (
    <Card className='px-2 py-4 sm-8'>
      <Card.Title className='text-center'>{APP_NAME}</Card.Title>
      <Card.Body>
        {time >= 0 ? (
          <>
            <div className='m-4'>
              <span className='font-weight-bold font-italic m-3'>
                File Name:
              </span>{' '}
              <span className='font-italic text-info'>{state?.url?.name}</span>
            </div>
            <div className='m-4'>
              <span className='font-weight-bold font-italic m-3'>
                File Type:
              </span>
              <span className='font-italic text-info'>{state?.url?.type}</span>
            </div>
            <div className='m-4'>
              <span className='font-weight-bold font-italic m-3'>
                Expire Time:
              </span>
              <span className='font-italic text-info'>{state?.expire}</span>
            </div>
            <div className='m-4'>
              <span className='font-weight-bold font-italic m-3'>
                Uploaded At:
              </span>
              <span className='font-italic text-info'>
                {state?.url?.created}
              </span>
            </div>
            <div className='m-4'>
              <span className='font-weight-bold font-italic m-3'>
                Number of Downloads:
              </span>
              <span className='font-italic text-info'>
                {state?.url?.download}
              </span>
            </div>
          </>
        ) : (
          <p className='text-danger'>Link has expired {time}</p>
        )}
      </Card.Body>
    </Card>
  );
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    downloadFile: (data: any, name: string) =>
      dispatch(downloadFile(data, name)),
    fetchDetails: (data: any) => dispatch(fetchDetails(data)),
  };
};

export default connect(null, mapDispatchToProps)(Shared);
