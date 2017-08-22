import Inferno from 'inferno';
import marked from 'marked';

import { Modal } from './Modal';

import termsMarkdown from '../../assets/text/terms.md';
import privacyMarkdown from '../../assets/text/privacy.md';

export const Footer = () => {
  return (
    <footer className='footer'>
      <div className='container'>
        <div className='columns'>
          <div className='column is-two-thirds'>
            <div className='content'>
              <p>
                Lexiconga is only guaranteed to work with the most
                up-to-date <a href='https://whatbrowser.org/' target='_blank'>HTML5 browsers</a>.
              </p>
            </div>
          </div>

          <div className='column'>
            <a className='button'
              href='/issues'>
              Issues
            </a>
            <a className='button'
              href='/updates'>
              Updates
            </a>
            <Modal buttonText='Terms' title='Terms and Conditions'>
              <div className='content has-text-left'>
                <div dangerouslySetInnerHTML={{
                  __html: marked(termsMarkdown)
                }} />
              </div>
            </Modal>
            <Modal buttonText='Privacy' title='Privacy Policy'>
              <div className='content has-text-left'>
                <div dangerouslySetInnerHTML={{
                  __html: marked(privacyMarkdown)
                }} />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </footer>
  );
}
