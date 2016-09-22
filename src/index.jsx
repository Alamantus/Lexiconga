import './index.html';
import './sass/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import {Header} from './components/Header';
import {NewWordForm} from './components/NewWordForm';
import {Button} from './components/Button';
import {Dictionary} from './components/Dictionary';
import {Word} from './components/Word';

import {dynamicSort} from './js/helpers';

class Lexiconga extends React.Component {
  constructor(props) {
    super(props);

    this.showConsoleMessages = this.props.showConsoleMessages || false;

    this.state = {
      scroll: {
        x: 0,
        y: 0
      },

      details: {
        name: "New",
        description: "A new dictionary.",
        createdBy: 'Someone',
        nextWordId: 1,
        externalID: 0
      },
      words: [],
      settings: {
        allowDuplicates: false,
        caseSensitive: false,
        partsOfSpeech: "Noun,Adjective,Verb,Adverb,Preposition,Pronoun,Conjunction",
        sortByEquivalent: false,
        isComplete: false,
        isPublic: false
      },
    };

    this.defaultDictionaryJSON = JSON.stringify(this.state.dictionaryDetails);  //Saves a stringifyed default dictionary.
    this.previousDictionary = {};
  }

  changeDictionaryName() {
    // To change elements within the dictionary object, you can set it to
    // a variable, manipulate the variable, then use setState() to set
    // the object equal to the changed variable.
    let updateDictionary = this.state.currentDictionary;
    updateDictionary.name = 'something else'
    this.setState({
      currentDictionary: updateDictionary
    })
  }

  addWord(wordObject) {
    let newWord = {
      name: wordObject.name || 'errorWord',
      pronunciation: wordObject.pronunciation || '',
      partOfSpeech: wordObject.partOfSpeech || '',
      simpleDefinition: wordObject.simpleDefinition || '',
      longDefinition: wordObject.longDefinition || '',
      wordId: this.state.details.nextWordId
    }

    let sortMethod;
    if (this.state.settings.sortByEquivalent) {
        sortMethod = ['simpleDefinition', 'partOfSpeech'];
    } else {
        sortMethod = ['name', 'partOfSpeech'];
    }

    let updatedWords = this.state.words.concat([newWord]);
    updatedWords.sort(dynamicSort(sortMethod));

    let updatedDetails = this.state.details;
    updatedDetails.nextwordid += 1;

    this.setState({
      words: updatedWords,
      details: updatedDetails
    }, () => {
      if (this.showConsoleMessages) {
        console.log('New word ' + newWord.name + ' added successfully');
      }
    });
  }

  updateWord(index, wordObject) {
    let updatedWords = this.state.words;
    updatedWords[index].name = wordObject.name;
    updatedWords[index].pronunciation = wordObject.pronunciation;
    updatedWords[index].partOfSpeech = wordObject.partOfSpeech;
    updatedWords[index].simpledefinition = wordObject.simpledefinition;
    updatedWords[index].longDefinition = wordObject.longDefinition;
    this.setState({words: updatedWords});
  }

  showWords() {
    let words = this.state.words.map((word, index) => {
      return <Word key={'dictionaryEntry' + index.toString()} isEditing={true}
        name={word.name}
        pronunciation={word.pronunciation}
        partOfSpeech={word.partOfSpeech}
        simpleDefinition={word.simpleDefinition}
        longDefinition={word.longDefinition}
        wordId={word.wordId}
        index={index}
        updateWord={(index, wordObject) => this.updateWord(index, wordObject)} />;
    });

    return <div>{words}</div>;
  }

  render() {
    return (
      <div>
        <Header />
        <NewWordForm addWord={(wordObject) => this.addWord(wordObject)} parent={this} />
        <Button
          action={() => this.changeDictionaryName()}
          label='change name' />

        <div id="incompleteNotice">
          Dictionary is complete: {this.state.settings.isComplete.toString()}
        </div>
        <Dictionary parent={this}>
          {this.showWords()}
        </Dictionary>
      </div>
    );
  }
}

ReactDOM.render(<Lexiconga showConsoleMessages={true} />, document.getElementById('site'));