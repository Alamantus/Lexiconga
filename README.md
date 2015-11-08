## What is Lexiconga Dictionary Builder?
Lexiconga is a tool intended to help you build constructed language (conlang) dictionaries/lexicons.

You can enter words and definitions, and they will appear nicely formatted and in alphabetical order under your dictionary's title, where you can also sort them by part of speech. If the default parts of speech are not adequate for your conlang, you can change them to whatever parts of speech you might need. You can even enter a description or full set of language rules that you can toggle on and off below the dictionary's title!

It accepts Unicode characters so you can utilize whatever typable characters you might need and [Markdown](https://help.github.com/articles/markdown-basics/) for formatting long text entries, and if you want to share or even just make a backup of your dictionary, you can export it to a single convenient file that can be easily re-imported. Your dictionary is saved to your browser's localStorage every time you make a change, which means as long as you use the same browser and don't deliberately delete it, your dictionary will always be there when you come back.

## How do I use Lexiconga?

### Getting Started
When you have a brand new, empty dictionary, the first thing you'll probably want to do is change the title to whatever your conlang is called and add at least a little description of what your language is like or how to use it. You can do this by clicking on the Settings button, which will open up the settings screen. Here, you will find all the fields you need to update your dictionary's Name and Description/Rules. The Description/Rules text area uses [Markdown](https://help.github.com/articles/markdown-basics/) to format any text you include, so brush up on how to do basic things in Markdown before you get started _(NOTE: a line break is done by adding 2 or more spaces to the end of the line and then going to the next line!)_. After this, make sure that the Parts of Speech are adequate for your language _(see below for more information about this)_. Update these fields to what you want them to say and click the "Save" button to keep the Settings menu open, or the "Save and Close" button to close the menu and start adding words!

To add words, just use the form on the top left side of the window. Hopefully the form is self-explanatory, but if not, here's a little guide:  
Enter the word in your language in the "Word" field, an equivalent word or short definition in the "Equivalent Word" field, a longer definition or fuller explanation of the word using [Markdown](https://help.github.com/articles/markdown-basics/) in the "Explanation" text area, choose a part of speech, and click "Add Word". Your word will instantly appear in your dictionary under the dictionary's name! You can add as many words as you want this way.  
The only things to remember while adding new words is that the minimum information that you can enter is the Word itself and either the Equivalent Word OR the Explanation. You can have both of these or just one, but you need at least one. If you do not want to use the Parts of Speech, you do not need to, though you will miss out on the handy Filter feature of the dictionary.

And that's all you need to get started! Everything else should be pretty self-explanatory, but a full explanation of Dictionary Builder and all of its functions continues below.

### Viewing your Dictionary's Description/Rules
After you enter a markdown-formatted description/rules in the Settings menu, you can view the formatted version by clicking the "Show Description" button under your dictionary's name. You can hide it again by clicking "Hide Description" when the description is displayed.

### Entry Management
After adding some words to your dictionary, you'll notice a link icon (&#x1f517;) and an "Edit" and "Delete" button attached to each entry.

The link icon (&#x1f517;) is a link to that word. These links only work when there is nothing entered in the search box and no filters are set. Also note that the links are only intended for linking within the same dictionary and will only work properly when your dictionary is loaded, so only share them with friends if your friends also have your dictionary imported.

The **Edit** button will scroll to the top of the screen and fill the Word form with the current details of the word you edited. You can make any changes you want and click the "Edit Word" button. You will be asked to confirm your changes, and once you do, your word will be saved. If you do not want to make changes, just click the "Cancel" button.

The **Delete** button will ask you to confirm that you want to delete the entry, and if you say yes, the word will be _permanently deleted and **cannot be retrieved**_.

### The Settings Menu
While you were in the settings menu when you were getting started, you probably noticed some other things you can set there, like "Parts of Speech", "Allow Duplicates", "Case-Sensitive", and "Dictionary is complete", not to mention the export, import, and erase buttons.

The **Parts of Speech** field is where you can add custom parts of speech for your language if you need to! Just list your parts of speech in a comma-separated list the same way as the default parts of speech are listed, and your options in the word form and filters will update as soon as you save!  
>_Please note that if you have other parts of speech added to existing words, those words will not update and will keep the old parts of speech. You will need to manually update any words with incorrect parts of speech after the fact, which is why I recommend you update the available parts of speech as one of the first things you do if you need to change them at all!_

The **Allow Duplicates** checkbox allows you to control whether or not Dictionary Builder will allow you to add the same word multiple times. If you leave Allow Duplicates unchecked and you try to add a word that is already in the dictionary, Dictionary Builder will tell you that the word already exists and will ask if you want to update it with the newly entered word.

The **Case-Sensitive** checkbox allows you to control Dictionary Builder's duplicate detection. If you leave Case-Sensitive unchecked, you will be alerted when you are trying to add a word with the same letters to your dictionary a second time. For example, "dog" is identified as the same word as "DOG" or "doG". The dictionary will keep whatever capitalization you save but it will identify words with the same spelling as duplicates. If Case-Sensitive is checked, then it will not identify "dog" and "DOG" as the same word.  
If Allow Duplicates is checked, this checkbox becomes unavailable.

The **Dictionary is Complete** checkbox will make the word add/edit form go away so you can view or share it more easily/safely. Plus when you export your dictionary, all of the options to change anything about your dictionary will be excluded when it is re-imported! Your dictionary will become static, and will not be able to be changed or updated without a password.

The **Total Entries** label is just a live tally of how many words you have added to the current dictionary.

The **Export Current Dictionary** button will immediately do exactly that. Your browser will start downloading a file with your dictionary's name in a ".dict" format. Please note that this may not work as expected on mobile platforms. This export can be a personal backup for your own uses, to work on multiple dictionaries at a time (i.e. export one dictionary and import the other to work on the one you'd like), or you can share it with friends to view it.

The **Import Dictionary** form allows you to upload and view any previously-exported ".dict" files. After selecting your ".dict" file, click the "Import" button to _overwrite your current dictionary_ and view the imported one. Again, please note that this import process will _**permanently overwrite your current dictionary**_, so please be sure to export your dictionary _before_ you import a new one.

The **Empty Current Dictionary** should only be used if you want to completely start over from scratch. It will ask you to confirm that you want to delete, and if you confirm, your dictionary will be gone forever. If you have not exported your dictionary before emptying it, there will be absolutely no way to get it back. Please be careful with this!

## Future Plans
In the future, I'm planning to add the ability to save more than one dictionary at a time by allowing user accounts. Each account will be able to store a certain number of dictionaries and will be able to switch to any saved dictionary at any time without having to worry about exporting and importing .dict files. Along with this will also come the ability to easily share dictionaries if you want, but all dictionaries will be private by default.

## Thanks!
I hope you enjoy Lexiconga and that it helps you build some awesome languages.

–Robbie Antenesse

### Libraries Used
* [Markdown.js](https://github.com/evilstreak/markdown-js) by Dominic Baggott (a.k.a. evilstreak)
* [Defiant.js](http://defiantjs.com) by Hakan Bilgin (a.k.a. hbi99)
