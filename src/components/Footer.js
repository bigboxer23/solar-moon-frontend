import { Col, Container, Row } from 'react-bootstrap';
import { AiFillGithub } from 'react-icons/ai';

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  let company = 'Solar Moon Analytics, LLC';
  return (
    <Container className='footer' fluid>
      <Row>
        <Col className='footer-copyright' md='4'>
          <h3>Developed by {company}</h3>
        </Col>
        <Col className='footer-copyright' md='4'>
          <h3>
            Copyright © {year} {company}
          </h3>
        </Col>
        <Col className='footer-body' md='4'>
          <ul className='footer-icons'>
            <li className='social-icons'>
              <a
                href='https://github.com/bigboxer23'
                rel='noopener noreferrer'
                style={{ color: 'white' }}
                target='_blank'
              >
                <AiFillGithub />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
