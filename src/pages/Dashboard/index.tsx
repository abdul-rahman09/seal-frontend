import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import get from 'lodash/get';
import { Table, Button, FormCheck, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon';
import { API_BASE_PATH } from 'config';
import {
  downloadMultipleFiles,
  fetchAllFiles,
  getShareableLink,
  uploadFile,
} from 'pages/Auth/ducks/actions';
import { DateWrapper, IconWrapper, FileWrapper } from 'pages/Dashboard/style';
import 'react-datepicker/dist/react-datepicker.css';

const FileViewer = require('react-file-viewer');

const onError = (e: any) => {
  console.log(e, 'error in file-viewer');
};
interface IDocument {
  id: number;
  name: string;
  type: DefaultExtensionType;
  download: number;
  rdoc: string;
  created: string;
}
interface IAppProps {
  documents: IDocument[];
  fetchFiles: () => void;
  uploadFile: (data: FormData) => void;
  downloadMultipleFiles: (data: any) => void;
  shareLink: (data: any) => void;
}
const Example: React.FC<any> = ({ shared, onHide, shareLink }) => {
  const [startDate, setStartDate] = useState<any>();
  const [link, setLink] = useState<any>('');
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  function copyToClipboard(e: any) {
    const area: any = textAreaRef.current;
    if (area) {
      area.select();
      document.execCommand('copy');
      e.target.focus();
      setCopySuccess('Copied!');
    }
  }

  const handleShareLink = () => {
    const obj = {
      expire: new Date(startDate).toISOString(),
      url: shared.id,
    };

    shareLink(obj)
      .then((resp: any) => {
        setLink(`${window.location.origin}/shared/${resp.link}`);
      })
      .catch(() => {});
  };
  return (
    <>
      <Modal show={true} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please select expire time</Modal.Body>
        <DateWrapper>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat='p'
            timeIntervals={1}
            dateFormat='Pp'
          />
        </DateWrapper>

        {link && (
          <form>
            <input readOnly ref={textAreaRef} value={link} />
            <span>
              <Button variant='primary' onClick={copyToClipboard}>
                Copy
              </Button>
              {copySuccess}
            </span>
          </form>
        )}

        <Modal.Footer>
          <Button variant='secondary' onClick={onHide}>
            Close
          </Button>
          <Button
            disabled={!startDate}
            variant='primary'
            onClick={handleShareLink}
          >
            Get Shareable Link
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const App: React.FC<IAppProps> = ({
  documents,
  fetchFiles,
  uploadFile,
  downloadMultipleFiles,
  shareLink,
}) => {
  const [shared, setShared] = useState<IDocument>();
  const [rdoc, setRdoc] = useState<File[]>([]);
  const [seleced, setSelected] = useState<number[]>([]);

  const resetForm = () => {
    setRdoc([]);
  };
  const clearShared = () => {
    setShared(undefined);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data: any = new FormData();
    for (let i = 0; i < rdoc.length; i++) {
      data.append(i, rdoc[i]);
    }
    uploadFile(data);
    resetForm();
    e.target.value = null;
  };

  const handleDownload = async (name: string, rdoc: string) => {
    const link = document.createElement('a');
    link.href = `${API_BASE_PATH}/download/${name}`;
    document.body.appendChild(link);
    link.setAttribute('download', rdoc); //or any other extension
    link.click();
    document.body.removeChild(link);
    fetchFiles();
  };

  const downloadMultiple = async () => {
    const names = [];
    for (let index = 0; index < documents.length; index++) {
      if (seleced.includes(documents[index].id)) {
        names.push(documents[index].name);
      }
    }
    downloadMultipleFiles(names);
    setSelected([]);
  };

  const handleChange = (e: any, index: number) => {
    const id = documents[index].id;
    if (e.target.checked) {
      const updated = [...seleced];
      updated.push(id);
      setSelected(updated);
    } else {
      const updated = [...seleced];
      updated.splice(index, 1);
      setSelected(updated);
    }
  };

  return (
    <>
      <div className='m-4'>
        {shared && (
          <Example shared={shared} onHide={clearShared} shareLink={shareLink} />
        )}

        <label htmlFor='resume-file'>
          <input
            accept='doc/*'
            id='resume-file'
            multiple={true}
            type='file'
            onChange={(e) => {
              setRdoc(get(e, 'target.files'));
            }}
          />
        </label>
        <Button
          className='mr-4'
          disabled={rdoc.length === 0}
          variant='info'
          onClick={handleSubmit}
        >
          Upload
        </Button>
        {seleced.length > 0 && (
          <Button variant='info' onClick={downloadMultiple}>
            Download Selected Files
          </Button>
        )}
      </div>
      <Table striped bordered hover variant='dark'>
        <thead>
          <tr>
            <th>#</th>
            <th> Name</th>
            <th> Preview</th>
            <th>Type</th>
            <th># Of Downloads</th>
            <th>Uploaded At</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {map(
            documents,
            ({ id, name, type, download, rdoc, created }, index: number) => (
              <tr key={id}>
                <td>
                  <FormCheck
                    checked={seleced.includes(id)}
                    size={50}
                    onChange={(e: any) => handleChange(e, index)}
                  />
                  {id}
                </td>
                <td>
                  <>
                    <IconWrapper>
                      <FileIcon extension={type} {...defaultStyles[type]} />
                    </IconWrapper>
                    {name}
                  </>
                </td>
                <td>
                  <FileWrapper>
                    <FileViewer
                      allowFullScreen={false}
                      fileType={type}
                      filePath={`http://localhost:8000/media/rdocs/${name}`}
                      onError={onError}
                    />
                  </FileWrapper>
                </td>
                <td>{type}</td>
                <td>{download}</td>
                <td>{new Date(created).toLocaleString()}</td>
                <td>
                  <Button
                    variant='light'
                    size='sm'
                    onClick={() =>
                      setShared({ id, name, type, download, rdoc, created })
                    }
                  >
                    Share
                  </Button>
                </td>
                <td>
                  <Button
                    variant='success'
                    size='sm'
                    onClick={() => handleDownload(name, rdoc)}
                  >
                    Download
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    documents: state.documents.files,
  };
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchFiles: () => dispatch(fetchAllFiles()),
    uploadFile: (formdata: any) => dispatch(uploadFile(formdata)),
    downloadMultipleFiles: (formdata: any) =>
      dispatch(downloadMultipleFiles(formdata)),
    shareLink: (data: any) => dispatch(getShareableLink(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
