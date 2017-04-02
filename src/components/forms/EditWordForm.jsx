// import React from 'react';
import Inferno from 'inferno';
import Component from 'inferno-component';

import {Input} from '../input/Input';
import {TextArea} from '../input/TextArea';

import {WordForm} from './WordForm';

// A component that allows you to edit a word
// export class EditWordForm extends React.Component {
export class EditWordForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <WordForm action='edit'>
        <Input name='Word' />
        <Input name='Pronunciation' helperLink={{url: "http://r12a.github.io/pickers/ipa/", label: 'IPA Characters', hover:"IPA Character Picker located at http://r12a.github.io/pickers/ipa/"}} />
        <Input name='Part of Speech' />
        <Input name='Definition/<wbr><b class=wbr></b>Equivalent Word(s)' />
        <TextArea name='Explanation/<wbr><b class=wbr></b>Long Definition' />
      </WordForm>
    );
  }
}