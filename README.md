## What is Lexiconga Dictionary Builder?
Lexiconga is a tool intended to help build constructed language dictionaries.

You can enter words and definitions, and they will appear nicely formatted and in alphabetical order under your dictionary's title, where you can also sort them by part of speech. If the default parts of speech are not adequate for your conlang, you can change them to whatever parts of speech you might need. You can even enter a description or full set of language rules that you can toggle on and off below the dictionary's title!

It accepts Unicode characters so you can utilize whatever typable characters you might need and Markdown for formatting long text entries, and if you want to share or even just make a backup of your dictionary, you can export it to a single convenient file that can be easily re-imported. It also saves your dictionary to your browser's localStorage every time you make a change, which means as long as you use the same browser and don't deliberately delete it, your dictionary will always be there when you come back. 

## How do I use Lexiconga?

### Getting Started
When you have a brand new, empty dictionary, the first thing you'll probably want to do is change the title to whatever your conlang is called and add at least a little description of what your language is like or how to use it. You can do this by clicking on the Settings button, which will open up the settings screen. Here, you will find all the fields you need to update your dictionary's Name and Description/Rules. The Description/Rules text area uses [Markdown](https://help.github.com/articles/markdown-basics/) to format any text you include, so brush up on how to do basic things in Markdown before you get started (NOTE: a line break is done by adding 2 or more spaces to the end of the line and then going to the next line!). Update these fields to what you want them to say and click the "Save" button to keep the Settings menu open, or the "Save and Close" button to close the menu and start adding words!

To add words, just use the form on the top left side of the window. Hopefully the form is self-explanatory, but if not, here's a little guide:  
Enter the word in your language in the "Word" field, an equivalent word or short definition in the "Equivalent Word" field, a longer definition or fuller explanation of the word using Markdown in the "Explanation" text area, choose a part of speech, and click "Add Word". Your word will instantly appear in your dictionary under the dictionary's name! You can add as many words as you want this way.  
The only things to remember while adding new words is that the minimum information that you can enter is the Word itself and either the Equivalent Word OR the Explanation. You can have both of these or just one, but you need at least one. If you do not want to use the Parts of Speech, you do not need to, though you will miss out on the handy Filter feature of the dictionary.

And that's all you need to get started! Everything else should be pretty self-explanatory, but a full explanation of Dictionary Builder and all of its functions continues below.

### The Settings Menu
While you were in the settings menu, you probably noticed some other things you can set there, like "Parts of Speech", "Allow Duplicates", "Case-Sensitive", and "Dictionary is complete", not to mention the export, import, and erase buttons.

The **Parts of Speech** field is where you can add custom parts of speech for your language if you need to! Just list your parts of speech in a comma-separated list the same way as the default parts of speech are listed, and your options in the word form and filters will update as soon as you save!  
Please note that if you have other parts of speech added to existing words, those words will not update and will keep the old parts of speech. You will need to manually update any words with incorrect parts of speech after the fact, which is why I recommend you update the available parts of speech as one of the first things you do if you need to change them at all!

The **Allow Duplicates** checkbox allows you to control whether or not Dictionary Builder will allow you to add the same word multiple times. If you leave Allow Duplicates unchecked and you try to add a word that is already in the dictionary, Dictionary Builder will tell you that the word already exists and will ask if you want to update it with the newly entered word.

The **Case-Sensitive** checkbox allows you to control Dictionary Builder's duplicate detection. If you leave Case-Sensitive unchecked, you will be alerted when you are trying to add a word with the same letters to your dictionary a second time. For example, "dog" is identified as the same word as "DOG" or "doG". The dictionary will keep whatever capitalization you save but it will identify words with the same spelling as duplicates. If Case-Sensitive is checked, then it will not identify "dog" and "DOG" as the same word.  
If Allow Duplicates is checked, this checkbox becomes unavailable.

The **Dictionary is Complete** checkbox will make the word add/edit form go away so you can view or share it more easily/safely. Plus when you export your dictionary, all of the options to change anything about your dictionary will be excluded when it is re-imported! Your dictionary will become static, and will not be able to be changed or updated without a password.
