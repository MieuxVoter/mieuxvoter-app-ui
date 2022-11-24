import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import {CSSProperties, useEffect, useState} from 'react';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Button from '@components/Button';
import ButtonCopy from '@components/ButtonCopy';
import Share from '@components/Share';
import ErrorMessage from '@components/Error';
import AdminModalEmail from '@components/admin/AdminModalEmail';
import {ElectionPayload, ErrorPayload} from '@services/api';
import {useAppContext} from '@services/context';
import {getUrlVote, getUrlResults} from '@services/routes';
import urne from '../public/urne.svg'
import star from '../public/star.svg'
import {Container} from 'reactstrap';


export interface WaitingBallotInterface {
  election?: ElectionPayload;
  error?: ErrorPayload;
}

interface InfoElectionInterface extends WaitingBallotInterface {
  display: string;
}

const InfoElection = ({election, error, display}: InfoElectionInterface) => {
  const {t} = useTranslation();

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(m => !m);


  if (!election) return null;

  const urlVote = getUrlVote(election.id)
  const urlResults = getUrlResults(election.id)

  return (
    <div style={{
      display: display,
      transition: "display 2s",
    }}
      className="d-flex flex-column align-items-center"
    >
      {error && error.detail ?
        <ErrorMessage msg={error.detail[0].msg} /> : null}

      {election && election.id ?
        <>
          <h4 className="text-center">
            {t('admin.success-election')}
          </h4>

          {election && election.private ?
            <h5 className="text-center">
              {t('admin.success-emails')}
            </h5>
            : <div className="d-grid w-100">
              <ButtonCopy
                text={t('admin.success-copy-vote')}
                content={urlVote}
              />
              <ButtonCopy
                text={t('admin.success-copy-result')}
                content={urlResults}
              />
            </div>}
          <div className="d-grid w-100">
            <Button
              customIcon={<FontAwesomeIcon icon={faArrowRight} />}
              position="right"
              color="secondary"
              outline={true}
              onClick={toggleModal}
              className="mt-3 py-3 px-4"
            >
              {t('admin.go-to-admin')}
            </Button>
          </div>
          <Share title={t('common.share-short')} />
          <AdminModalEmail
            toggle={toggleModal}
            isOpen={modal}
            electionId={election.id}
            adminToken={election.admin}
          />
        </> : null}
    </div>
  )
}

export default ({election, error}: WaitingBallotInterface) => {
  const {setApp} = useAppContext();

  const [urneProperties, setUrne] = useState<CSSProperties>({width: 0, height: 0, marginBottom: 0});
  const [starProperties, setStar] = useState<CSSProperties>({width: 0, height: 0, marginLeft: 100, marginBottom: 0});
  const [urneContainerProperties, setUrneContainer] = useState<CSSProperties>({height: "100vh"});
  const [electionProperties, setElection] = useState<CSSProperties>({display: "none"});


  useEffect(() => {
    setApp({footer: false});

    setUrne(urne => ({
      ...urne,
      width: 300,
      height: 300,
    }));

    const timer = setTimeout(() => {
      setStar(star => ({
        ...star,
        width: 150,
        height: 150,
        marginLeft: 150,
        marginBottom: 300,
      }
      ));
    }, 1000);

    const timer2 = setTimeout(() => {
      // setElection({display: "block"});
      setUrneContainer(urneContainer => ({
        ...urneContainer,
        height: "50vh",
      }));
      setStar(star => ({
        ...star,
        width: 100,
        height: 100,
        marginLeft: 100,
        marginBottom: 200,
      }));
      setUrne(urne => ({
        ...urne,
        width: 200,
        height: 200,
      }));
    }, 3000);

    const timer3 = setTimeout(() => {
      setElection({display: "grid"});
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };

  }, [])



  return (<Container
    className="d-flex h-100 w-100 align-items-center flex-column"
    style={{
      maxWidth: "400px"
    }}
  >
    <div
      style={{
        transition: "width 2s, height 2s",
        height: urneContainerProperties.height,
      }}
      className="d-flex align-items-center"
    >
      <div
        className="position-relative"
        style={{
          transition: "width 2s, height 2s, margin-bottom 2s",
          zIndex: 2,
          marginTop: urneProperties.marginBottom,
          height: urneProperties.height,
          width: urneProperties.width,
        }}
      >
        <Image
          src={urne}
          alt="urne"
          fill={true}
        />
      </div>
      <div
        className="position-absolute"
        style={{
          transition: "width 2s, height 2s, margin-left 2s, margin-bottom 2s",
          marginLeft: starProperties.marginLeft,
          marginBottom: starProperties.marginBottom,
          height: starProperties.height,
          width: starProperties.width,
        }}
      >
        <Image
          src={star}
          fill={true}
          alt="urne"
        />
      </div>
    </div>
    <InfoElection election={election} error={error} display={electionProperties.display} />
  </Container >)
}
