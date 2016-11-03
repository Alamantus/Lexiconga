// Import the HTML file and sass for Webpack to handle.
import './index.html';
import './sass/main.scss';

// Import React for the React.Component class and ReactDOM for rendering.
import React from 'react';
import ReactDOM from 'react-dom';

// Import the necessary components.
import {Header} from './components/Header';
import {Footer} from './components/Footer';
import {WordForm} from './components/WordForm';
import {Button} from './components/Button';
import {InfoDisplay} from './components/InfoDisplay';
import {EditDictionaryForm} from './components/EditDictionaryForm';
import {Dictionary} from './components/Dictionary';

// Import the helper functions needed for this file.
import {dynamicSort} from './js/helpers';

// Declare the values of the default empty dictionary.
const defaultDictionaryName = 'New'
    , defaultListTypeName = 'Dictionary'
    , defaultDictionaryDescription = 'A new dictionary.'
    , defaultDictionaryCreatedBy = 'Someone'
    , defaultDictionaryPartsOfSpeech = 'Noun,Adjective,Verb,Adverb,Preposition,Pronoun,Conjunction'
    ;

// Create the Lexiconga component just for rendering the whole site.
class Lexiconga extends React.Component {
  constructor(props) {
    super(props);

    // This could probably be a global constant instead.
    this.showConsoleMessages = this.props.showConsoleMessages || false;

    // Put the dictionary details, settings, and words into the state so modifications will affect display.
    this.state = {
      scroll: {
        x: 0
      , y: 0
      }

    , details: {
        name: defaultDictionaryName
      , listTypeName: defaultListTypeName
      , description: defaultDictionaryDescription
      , createdBy: defaultDictionaryCreatedBy
      , nextWordId: 1
      , externalID: 0
      }
    , words: []
    , settings: {
        allowDuplicates: false
      , caseSensitive: false
      , partsOfSpeech: defaultDictionaryPartsOfSpeech
      , sortByEquivalent: false
      , isComplete: false
      , isPublic: false
      }
    };

    //Saves a stringifyed default dictionary. Actually does nothing because this value doesn't exist.
    this.defaultDictionaryJSON = JSON.stringify(this.state.dictionaryDetails);
    this.previousDictionary = {};
  }

  // Receive an object containing changes to the dictionary details and settings, apply them to the state,
  // and save the local dictionary after the state is updated.
  saveChanges(changesObject) {
    let updatedDetails = this.state.details;
    let updatedSettings = this.state.settings;

    updatedDetails.name = changesObject.name;
    updatedDetails.listTypeName = changesObject.listTypeName;
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

  // Sort the given array of word objects in the state according to the sortByEquivalent setting.
  sortWords(wordsArray) {
    let sortMethod;
    if (this.state.settings.sortByEquivalent) {
        sortMethod = ['simpleDefinition', 'partOfSpeech'];
    } else {
        sortMethod = ['name', 'partOfSpeech'];
    }

    return wordsArray.sort(dynamicSort(sortMethod));
  }

  // Receive a word object, process it, and update the words state array with the new word.
  addWord(wordObject) {
    let newWord = {
      name: wordObject.name || 'errorWord'
    , pronunciation: wordObject.pronunciation || ''
    , partOfSpeech: wordObject.partOfSpeech || ''
    , simpleDefinition: wordObject.simpleDefinition || ''
    , longDefinition: wordObject.longDefinition || ''
    , wordId: this.state.details.nextWordId
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

  // Search the words list for the first word with the given idea and return its index in the array.
  firstIndexWordWithId(id) {
    this.state.words.forEach((word, index) => {
      if (word.wordId === id) {
        return index;
      }
    });

    return -1;
  }

  // Receive a wordId and a wordObject, find the index of the first word in the words state array with
  // the given wordId, and set that word's values to the values in the given wordObject.
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

  // Return true if the given dictionary reference has no words and its name and description are the same as the defaults.
  dictionaryIsDefault(dictionary) {
    if (this.showConsoleMessages) {
      console.log('Name: ' + dictionary.name
        + '\nDescription: ' + dictionary.description
        + '\n# Words: ' + dictionary.words.length);
    }
    return dictionary.words.length <= 0 && dictionary.description === defaultDictionaryDescription && dictionary.name === defaultDictionaryName;
  }

  // Put the state details, words, and settings into an object, stringify it, and save it to the browser's localStorage as 'dictionary' if
  // the dictionary in the state is not the default dictionary.
  saveLocalDictionary() {
    let saveDictionary = {
      name: this.state.details.name
    , listTypeName: this.state.details.listTypeName
    , description: this.state.details.description
    , createdBy: this.state.details.createdBy
    , words: this.state.words
    , nextWordId: this.state.details.nextWordId
    , settings: this.state.settings
    , externalID: this.state.details.externalID
    };

    if (!this.dictionaryIsDefault(saveDictionary)) {
      localStorage.setItem('dictionary', JSON.stringify(saveDictionary));

      console.log('Saved "' + this.state.details.name + '" dictionary locally');
    } else {
      if (this.showConsoleMessages) console.log('Current dictionary is default, so it wasn\'t saved');
    }
  }

  // If there is a saved 'dictionary' JSON string in localStorage, parse it, and set the state with its values.
  loadLocalDictionary() {
    if (localStorage.getItem('dictionary')){
      let localDictionary = JSON.parse(localStorage.getItem('dictionary'));

      if (!this.dictionaryIsDefault(localDictionary)) {
        this.setState({
          details: {
            name: localDictionary.name
          , listTypeName: localDictionary.listTypeName || defaultListTypeName
          , description: localDictionary.description
          , createdBy: localDictionary.createdBy
          , nextWordId: localDictionary.nextWordId
          , externalID: localDictionary.externalID
          }

        , words: localDictionary.words.slice()

        , settings: {
            allowDuplicates: localDictionary.settings.allowDuplicates
          , caseSensitive: localDictionary.settings.caseSensitive
          , partsOfSpeech: localDictionary.settings.partsOfSpeech
          , sortByEquivalent: localDictionary.settings.sortByEquivalent
          , isComplete: localDictionary.settings.isComplete
          , isPublic: localDictionary.settings.isPublic
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

  // Put all of the components together.
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

          <h1 className="dictionary-name">
            {this.state.details.name} {this.state.details.listTypeName}
          </h1>

          <InfoDisplay
            details={this.state.details}
            numberOfWords={this.state.words.length}
            isComplete={this.state.settings.isComplete} />

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

// Put the app on the screen.
ReactDOM.render(<Lexiconga showConsoleMessages={true} />, document.getElementById('site'));