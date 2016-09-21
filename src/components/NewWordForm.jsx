import React from 'react';

import {Input} from './Input';
import {TextArea} from './TextArea';

import {WordForm} from './WordForm';

export class NewWordForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <WordForm action='new'>
        <Input name='Word' />
        <Input name='Pronunciation'
          helperLink={{
            url: "http://r12a.github.io/pickers/ipa/",
            label: "IPA Characters",
            hover: "IPA Character Picker located at http://r12a.github.io/pickers/ipa/"
          }} />
        <Input name='Part of Speech' />
        <Input name={<div style={{display: 'inline'}}>Definition/<wbr /><b className="wbr"></b>Equivalent Word(s)</div>} />
        <TextArea id='newWordForm'
          name={<div style={{display: 'inline'}}>Explanation/<wbr /><b className="wbr"></b>Long Definition</div>} />
      </WordForm>
    );
  }
}