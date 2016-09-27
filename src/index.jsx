import './index.html';
import './sass/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import {Header} from './components/Header';
import {Footer} from './components/Footer';
import {WordForm} from './components/WordForm';
import {Button} from './components/Button';
import {EditDictionaryForm} from './components/EditDictionaryForm';
import {Dictionary} from './components/Dictionary';

import {dynamicSort} from './js/helpers';

const defaultDictionaryName = 'New',
      defaultDictionaryDescription = 'A new dictionary.',
      defaultDictionaryCreatedBy = 'Someone',
      defaultDictionaryPartsOfSpeech = 'Noun,Adjective,Verb,Adverb,Preposition,Pronoun,Conjunction';

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
        name: defaultDictionaryName,
        description: defaultDictionaryDescription,
        createdBy: defaultDictionaryCreatedBy,
        nextWordId: 1,
        externalID: 0
      },
      words: [],
      settings: {
        allowDuplicates: false,
        caseSensitive: false,
        partsOfSpeech: defaultDictionaryPartsOfSpeech,
        sortByEquivalent: false,
        isComplete: false,
        isPublic: false
      }
    };

    this.defaultDictionaryJSON = JSON.stringify(this.state.dictionaryDetails);  //Saves a stringifyed default dictionary.
    this.previousDictionary = {};
  }

  saveChanges(changesObject) {
    let updatedDetails = this.state.details;
    let updatedSettings = this.state.settings;

    updatedDetails.name = changesObject.name;
    updatedDetails.description = changesObject.description;

    updatedSettings.partsOfSpeech = changesObject.partsOfSpeech;
    updatedSettings.allowDuplicates = changesObject.allowDuplicates;
    updatedSettings.caseSensitive = changesObject.caseSensitive;
    updatedSettings.sortByEquivalent = changesObject.sortByEquivalent;
    updatedSettings.isComplete = changesObject.isComplete;
    updatedSettings.isPublic = changesObject.isPublic;

    this.setState({
      details: updatedDetails,
      settings: updatedSettings
    }, () => {
      this.saveLocalDictionary();
    });
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

  dictionaryIsDefault(dictionary) {
    if (this.showConsoleMessages) {
      console.log('Name: ' + dictionary.name
        + '\nDescription: ' + dictionary.description
        + '\n# Words: ' + dictionary.words.length);
    }
    return dictionary.words.length <= 0 && dictionary.description === defaultDictionaryDescription && dictionary.name === defaultDictionaryName;
  }

  saveLocalDictionary() {
    let saveDictionary = {
      name: this.state.details.name,
      description: this.state.details.description,
      createdBy: this.state.details.createdBy,
      words: this.state.words,
      nextWordId: this.state.details.nextWordId,
      settings: this.state.settings,
      externalID: this.state.details.externalID
    };

    if (!this.dictionaryIsDefault(saveDictionary)) {
      localStorage.setItem('dictionary', JSON.stringify(saveDictionary));

      console.log('Saved "' + this.state.details.name + '" dictionary locally');
    } else {
      if (this.showConsoleMessages) console.log('Current dictionary is default, so it wasn\'t saved');
    }
  }

  loadLocalDictionary() {
    if (localStorage.getItem('dictionary')){
      let localDictionary = JSON.parse(localStorage.getItem('dictionary'));

      if (!this.dictionaryIsDefault(localDictionary)) {
        this.setState({
          details: {
            name: localDictionary.name,
            description: localDictionary.description,
            createdBy: localDictionary.createdBy,
            nextWordId: localDictionary.nextWordId,
            externalID: localDictionary.externalID
          },

          words: localDictionary.words.slice(),

          settings: {
            allowDuplicates: localDictionary.settings.allowDuplicates,
            caseSensitive: localDictionary.settings.caseSensitive,
            partsOfSpeech: localDictionary.settings.partsOfSpeech,
            sortByEquivalent: localDictionary.settings.sortByEquivalent,
            isComplete: localDictionary.settings.isComplete,
            isPublic: localDictionary.settings.isPublic
          }
        }, () => {
          if (this.showConsoleMessages) {
            console.log('Loaded local "' + this.state.details.name + '" dictionary successfully');
          }
        });
      } else {
        if (this.showConsoleMessages) console.log('Locally saved dictionary is default');
      }
    } else {
      if (this.showConsoleMessages) console.log('No saved local dictionary');
    }
  }

  render() {
    return (
      <div>
        <Header />

        <div className='left-column'>
          <div className='floating-form'>
            <WordForm addWord={(wordObject) => this.addWord(wordObject)} submitLabel='Add Word' />
          </div>
        </div>

        <div className='center-column'>
          <div id="incompleteNotice">
            Dictionary is complete: {this.state.settings.isComplete.toString()}
          </div>

          <Button
            action={() => this.saveLocalDictionary()}
            label='Save Dictionary' />

          <Button
            action={() => this.loadLocalDictionary()}
            label='Load Dictionary' />

          <EditDictionaryForm
            details={this.state.details}
            settings={this.state.settings}
            saveChanges={(changesObject) => this.saveChanges(changesObject)} />

          <Dictionary
            details={this.state.details}
            words={this.state.words}
            settings={this.state.settings}
            updateWord={(wordId, wordObject) => this.updateWord(wordId, wordObject)} />
        </div>

        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Lexiconga showConsoleMessages={true} />, document.getElementById('site'));