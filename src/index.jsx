import './index.html';
import './sass/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import {Header} from './components/Header';
import {WordForm} from './components/WordForm';
import {Button} from './components/Button';
import {Dictionary} from './components/Dictionary';

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
      }
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

  sortWords(array) {
    let sortMethod;
    if (this.state.settings.sortByEquivalent) {
        sortMethod = ['simpleDefinition', 'partOfSpeech'];
    } else {
        sortMethod = ['name', 'partOfSpeech'];
    }

    return array.sort(dynamicSort(sortMethod));
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

    let updatedWords = this.state.words.concat([newWord]);
    updatedWords = this.sortWords(updatedWords);

    let updatedDetails = this.state.details;
    updatedDetails.nextWordId += 1;

    this.setState({
      words: updatedWords,
      details: updatedDetails
    }, () => {
      if (this.showConsoleMessages) {
        console.log('New word ' + newWord.name + ' added successfully');
      }
    });
  }

  firstIndexWordWithId(id) {
    let resultIndex = -1;

    for (let i = 0; i < this.state.words.length; i++) {
      let word = this.state.words[i];

      if (word.wordId === id) {
        resultIndex = i;
        break;
      }
    }

    return resultIndex;
  }

  updateWord(wordId, wordObject) {
    let index = this.firstIndexWordWithId(wordId);

    if (index >= 0) {
      if (this.showConsoleMessages) console.log('Updating ' + this.state.words[index].name + ' to ' + wordObject.name);

      let updatedWords = this.state.words;
      updatedWords[index].name = wordObject.name;
      updatedWords[index].pronunciation = wordObject.pronunciation;
      updatedWords[index].partOfSpeech = wordObject.partOfSpeech;
      updatedWords[index].simpleDefinition = wordObject.simpleDefinition;
      updatedWords[index].longDefinition = wordObject.longDefinition;

      updatedWords = this.sortWords(updatedWords);

      this.setState({words: updatedWords}, () => {
        if (this.showConsoleMessages) {
          console.log('Updated successfully');
        }
      });
    } else {
      console.log('Could not update. No word with id of ' + wordId.toString());
    }
  }

  render() {
    return (
      <div>
        <Header />
        <WordForm addWord={(wordObject) => this.addWord(wordObject)} submitLabel='Add Word' />
        <Button
          action={() => this.changeDictionaryName()}
          label='change name' />

        <div id="incompleteNotice">
          Dictionary is complete: {this.state.settings.isComplete.toString()}
        </div>
        <Dictionary
          details={this.state.details}
          words={this.state.words}
          settings={this.state.settings}
          updateWord={(wordId, wordObject) => this.updateWord(wordId, wordObject)} />
      </div>
    );
  }
}

ReactDOM.render(<Lexiconga showConsoleMessages={true} />, document.getElementById('site'));