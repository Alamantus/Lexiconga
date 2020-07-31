# Lexiconga Help

## Table of Contents

* [What is Lexiconga?](#what-is-lexiconga)
* [How do I use Lexiconga?](#how-do-i-use-lexiconga)
  * [Getting Started](#getting-started)
  * [Viewing your Dictionary's Details](#viewing-your-dictionarys-details)
  * [Referencing Other Words](#referencing-other-words)
  * [Maximizing Large Text Boxes](#maximizing-large-text-boxes)
  * [IPA Auto-Fill Fields](#ipa-auto-fill-fields)
  * [Advanced Fields](#advanced-fields)
  * [Entry Management](#entry-management)
  * [Search/Filter](#searchfilter)
  * [The Settings Window](#the-settings-window)
  * [The Dictionary Settings Window](#the-dictionary-settings-window)
  * [Keyboard Shortcuts](#keyboard-shortcuts)
* [Accounts](#accounts)
  * [Creating An Account](#creating-an-account)
  * [Logging In](#logging-in)
  * [Differences](#differences)
    * [Settings](#settings-1)
    * [Public Dictionaries](#public-dictionaries)
  * [Forgot Your Password?](#forgot-your-password)
  * [Lockout](#lockout)
* [Problems or Requests](#problems-or-requests)
* [Update Log](#update-log)
* [Open Source](#open-source)
* [Thanks](#thanks)

## What is Lexiconga?

Lexiconga is a tool built to help you build constructed language (conlang) dictionaries/lexicons quickly and easily.

You can enter words and definitions, and they will appear nicely formatted and in alphabetical order by name under your dictionary's title and details. You can also set your dicitonary to sort your words by definition if you prefer that view or even specify a fully custom alphabetical order. If the default parts of speech are not adequate for your conlang, you can change them to whatever you might need. You can also enter a description and full set of language rules that you can toggle on and off below the dictionary's title!

Lexiconga accepts Unicode characters so you can utilize whatever typable characters you might need and [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting long text entries, and if you want to share or even just make a backup of your dictionary, you can export it to a single convenient file that can be easily re-imported. Your dictionary is saved to your browser's [localStorage](https://www.w3schools.com/html/html5_webstorage.asp) every time you make a change, which means as long as you use the same browser and don't deliberately delete it by clearing your cache, your dictionary will always be there when you come back.

If you would like an added layer of accessibility and security (in case you clear your browser cache frequently), you can create an account, where you can store and switch between as many dictionaries as you need. Having an account will also allow you to access your dictionaries from any browser by logging in.

## How do I use Lexiconga?

### Getting Started
When you have a brand new, empty dictionary, the first thing you'll probably want to do is change the title to whatever your conlang is called and add at least a little description of what your language is like or how to use it. You can do this by clicking on the **Edit** button, which will open up the Dictionary Settings screen. Here, you will find all the fields you need to update your dictionary's Name, Specification, and Description. The Description text area uses [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to format any text you include, so brush up on how to do basic things in Markdown before you get started _(NOTE: a line break is created by adding 2 or more spaces to the end of the line and then going to the next line!)_.

After this, go to the **Details** tab and make sure that the Parts of Speech are adequate for your language _(see below for more information about this)_, and add phonology information if you'd like _(learning to use the [International Phonetic Alphabet](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet) can be very helpful here)_. Update these fields how you want them and click the "Save" button to keep the Dictionary Settings menu open, or the "Save & Close" button to close the menu and start adding words!

To add words, use the form on the top left side of the window _(in mobile, click the **+** button to show the form)_. Hopefully the form is self-explanatory, but if not, here's a little guide:  
Enter the word in your constructed language in the "Word" field, the pronunciation of the word in the "Pronunciation" field, choose a Part of Speech, enter an definition/equivalent word in the "Definition" field and/or a longer definition or fuller explanation of the word using [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) in the "Details" text area, and click "Add Word". Your word will instantly appear in your dictionary under the dictionary's name! You can add as many words as you want this way.  
The only things to remember while adding new words is that the minimum information that you can enter is the Word itself and either the Definition OR the Details. You can have both of these or just one, but you need at least one. If you do not want to use the Pronunciation or Parts of Speech then you do not need to, though if you leave out Part of Speech, you will miss out on the handy Search Filter feature.

And that's all you need to get started! Everything else should be pretty self-explanatory, but a full explanation of Lexiconga and all of its functions continues below.

### Viewing your Dictionary's Details
After you enter a markdown-formatted description/rules in the Dictionary Settings menu, you can view the formatted version by clicking the "Description" button under your dictionary's name. You can hide it again by clicking "Description" when the description is displayed. The other buttons in the row also display and hide their information.

### Referencing Other Words
If you want to reference another existing word in your dictionary, wrapping the word with its exact name in double-curly-braces \{\{like so\}\} in the Details field will automatically create a link to the word in the dictionary.  

If you have more than one word with the same spelling, the duplicate words will appear in your word listing with small numbers beside them. By writing the number after a colon \{\{like so:2\}\}, you can directly reference the specific homonymn. If you have duplicate words and exclude the reference number, it will link to the homonymn marked with 1.

### Maximizing Large Text Boxes
If you need more space to see what you are entering into a word's Details field or any other long text field with a "Maximize" button, clicking "Maximize" will give you a larger view of the text box to enter text in. When you're done writing, click either the "Done" or &times; button or any of the darker space outside of the larger view, and your text will be in the original text area. It will even preserve your cursor position or highlighted text so you don't lose your place moving from the larger view back to the small (and vice-versa)!

### IPA Auto-Fill Fields
You may notice some buttons around the Pronunciation field in the main word form and some other fields in the Details tab of your Dictionary Settings menu. This indicates that the field is using a special feature that generates [International Phonetic Alphabet](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet) (IPA) characters when typing certain combinations of characters. Click the "Field Help" button below the field for instructions on how to use those fields.

You can also click the "IPA Table" button to display a maximized table that shows all of the characters in the IPA. Clicking them will add it to the pronunciation field wherever you position the cursor in the field. If you hover over the button for an IPA character that is not on a standard keyboard, you can what character combinations will produce that character when you type it in the field.

If you do not want to use the IPA field feaure, you can turn it off in the Settings. Click the "Settings" button in the top right side of the website, uncheck "Use IPA Auto-Fill", and click "Save" or "Save & Close". The "IPA Table" and "Field Help" buttons will be removed from all fields they were around, and you can use those fields as normal.

### Advanced Fields
Clicking the button labeled "Show Advanced Fields" underneath the **Details** field on any word form will expand the "Advanced Fields" section for that word list. Clicking the button again when it says "Hide Advanced Fields" will hide the section again to make it so you don't have to scroll down to reach the "Add Word" button. The fields in the Advanced Fields section are detailed below:

- **Details Field Templates:** A dropdown box with any templates you have previously created (see [Templates for Details Fields](#templates-for-details-fields) in the Settings section below to learn how to create a template). Selecting one of the templates will put that template into the Details field for you, _overwriting **anything** that might have already been written there_.
  - Each time you select a different template (other than the "None Selected" option), it will overwrite anything in the Details field with the template without warning, so please be careful.
  - Selecting the "None Selected" option at the top of the list will _not_ change the Details field.
- **Etymology / Root Words:** Any words that the current word might have stemmed from originally.
  - Words written here are treated as word references (see [Referencing Other Words](#referencing-other-words) for how to reference a word or a duplicate word) without requiring the \{\{double-curly-braces\}\} as in the Details field. The words referenced here will appear below the word's details in the list.
  - Separate each individual root word with a comma.
- **Related Words:** Any words that might be related to the current word.
  - Words written here are treated as word references (see [Referencing Other Words](#referencing-other-words) for how to reference a word or a duplicate word) without requiring the \{\{double-curly-braces\}\} as in the Details field. The words referenced here will appear below the word's details in the list.
  - Separate each individual related word with a comma.
- **Principal Parts:** Any words that someone must know in order to conjugate the current word (see the [Wikipedia entry](https://en.wikipedia.org/wiki/Principal_parts) for more details).
  - Words written here are treated as word references (see [Referencing Other Words](#referencing-other-words) for how to reference a word or a duplicate word) without requiring the \{\{double-curly-braces\}\} as in the Details field. The words referenced here will appear below the word's details in the list.
  - Separate each individual principal part with a comma.

### Entry Management
After adding some words to your dictionary, you'll see an "Options" button on each entry. Clicking the button reveals Edit and Delete buttons.

The **Edit** button will cause a form with the current details of the word you edited to display in the same space that the word previously appeared. You can make any changes you want and click the "Save Changes" button. You will be asked to confirm your changes, and once you do, your word will be saved. If you do not want to make changes, just click the "Cancel" button.

The **Delete** button will ask you to confirm that you want to delete the entry, and if you say yes, the word will be _permanently deleted and **cannot be retrieved**_.

Note that to use these fields, your browser will need to allow "confirm" and "prompt" popups. Preventing these fuctions will prevent words from being edited or deleted.

### Search/Filter
You can search entries or filter by part of speech by clicking the "Search" button at the top of the screen. This will open a small panel that will stick to the top of your screen as you scroll.

From there, you can enter any text you want in the search box and either press Enter or click anywhere outside the search box, and Lexiconga will display any and every entry including your entry. To display the entire dictionary again, you must clear the search box.

You can refine your search by clicking the "Toggle Options" button and using the checkboxes below the search box. There are 3 sections that can help you filter your search:

- **Search For**
  - **Case-Sensitive:** When checked, Lexiconga finds entries matching the letter case in the entered text. When unchecked, it will find any case as long as the letters match.
  - **Ignore Diacritics/Accents:** When checked, Lexiconga will ignore accented letters and diacritics and identify them as their equivalent unaccented letter and vice-versa, in case you want to find a word with a diacritic without entering the diacritic in the search box. When unchecked, it will only find diacritics and accented letters if they are specifically entered in the search box.
  - **Exact Words:** When checked, the search term will find entries with _exact matches_ in only the Word or Definition field. If Word or Definition has _any_ text aside from exactly what was entered in the search bar, it will not be displayed.
  - **Translation:** When checked, Lexiconga will translate all words and references by any specified orthographic translations and compare your search term with that instead of the words as entered.
- **Include in Search**
  - **Word**: When checked, Lexiconga searches your dictionary's "Word" entries for the entered text. When unchecked, it ignores it.
  - **Definition**: When checked, Lexiconga searches your dictionary's "Definition/Equivalent Word(s)" entries for the entered text. When unchecked, it ignores it.
  - **Explanation**: When checked, Lexiconga searches your dictionary's "Explanation/Long Definition" entries for the entered text. When unchecked, it ignores it.
- **Include Only:** Lists all parts of speech and "Unclassified" with a checkbox next to each. If you uncheck any of the parts of speech, any entries in your dictionary with that part of speech will not be shown. Use the "Check All" and "Uncheck All" buttons to quickly select/unselect all of them.
  - **Unclassified:** Checking this box will show entries that do not have a part of speech.

When you have a search term or filter applied, you can see the number of results and "(Filtered)" next to the search button. To close the search panel, click the &times; button or the darker space on either side of it.

To display _all_ of your words again, clear your search bar and ensure all the "Include Only" checkboxes are checked.

### The Settings Window
Clicking the "Settings" button in the top-right side of Lexiconga will show the Settings window with some options.

- **Use IPA Auto-Fill:** Check this to use character combinations to input International Phonetic Alphabet characters into Pronunciation fields. Use the "Field Help" button for instructions on how to use it and the "IPA Table" to display available characters. Uncheck it to disable the feature and hide the buttons.
- **Use Hotkeys:** Check this to enable keyboard combinations to perform different helpful actions (see [Keyboard Shortcuts](#keyboard-shortcuts) below). Unchecking this disables the feature.
  - Note: If your browser does not support required features, this will be disabled automatically.
- **Show Advanced Fields By Default:** Check this to make the advanced fields show on word forms without needing to click the "Show Advanced Fields" button (see [Advanced Fields](#advanced-fields) above). Unchecking this makes it so you need to click the "Show Advanced Fields" button to show the fields each time you edit a word.
- **Default Theme:** Choose what color theme new dictionaries will use when they are created.

After making changes, click the "Save" or "Save & Close" button to save your changes.

#### Templates for Details Fields
Below the "Default Theme" selector is the template editor. Either click "Create New Template" or choose one from the "Saved Templates" dropdown to begin editing the template. Once a new template is created or a saved template is selected, new fields will appear labeled "Template Name" and "Template," plus a "Save Template" and "Delete Template" button.

You can modify the template's name by editing the "Template Name" field, and whatever you set in the "Template" text area will be used as the template in the Details field of a word form if it is selected (see [Advanced Fields](#advanced-fields) above for more about how this is used).

After making any changes to a template, click the "Save Template" button below the "Template" field to save it to your browser. Templates are only stored in the browser they were created on and _do not_ get uploaded to your account (if you have one). If you create a template, it will _not be available on any other web browser_ unless you re-create it!

Clicking the "Delete Template" button will prompt you to confirm that you want to delete it, and if you confirm, it will permanently delete the currently selected template from your browser. There is no way to recover deleted templates!

### The Dictionary Settings Window

Clicking the "Edit" button under your dictionary's name will display a window with tabs that each contain different fields and options.

#### Description

  - **Name:** Your dictionary's name. Displays above the entries.
  - **Specification:** How your dictionary is referred to. For example, you can change this to something like "Word List" or "Lexicon" if you prefer. Displays above the entries after Name.
  - **Description:** Any information you want to enter about your dictionary. Uses [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) formatting.
  
#### Details

  - **Parts of Speech:** The parts of speech available in the dropdown box on word forms. Separate each individual part of speech with a comma.
  - **Alphabetical Order:** The order that your words will be sorted by. Include every letter and different capitalization used in your dictionary to sort your words in whatever order you want—any letters in your words that are not sorted here are sorted by the default ASCII/Unicode order (i.e. English Alphabetical) _after_ any custom-sorted words. Lexiconga can only sort by single characters (rather than sets of characters) and will sort the words _as entered_, not using orthographic translations. Separate each character with a _space_.
  - **Phonology**
    - **Consonants:** The IPA characters representing the consonants present in your language. Uses the IPA Auto-Fill feature unless it is turned off. Separate each consonant with a _space_ so they will be displayed correctly under the Details section of your dictionary.
    - **Vowels:** The IPA characters representing the vowels present in your language. Uses the IPA Auto-Fill feature unless it is turned off. Separate each vowel with a _space_ so they will be displayed correctly under the Details section of your dictionary.
    - **Polyphthongs/Blends:** The IPA characters representing the polyphthongs or blends present in your language. Uses the IPA Auto-Fill feature unless it is turned off. Separate each one with a _space_ so they will be displayed correctly under the Details section of your dictionary.
    - **Notes:** Any notes about your constructed language's phonology that you want to share. Uses Markdown.
  - **Phonotactics**
    - **Onset:** What phonological characters can appear at the beginning of a syllable. Separate each with a _comma_.
    - **Nucleus:** What phonological characters can appear in the middle of a syllable. Separate each with a _comma_.
    - **Coda:** What phonological characters can appear at the end of a syllable. Separate each with a _comma_.
    - **Notes:** Any notes about your phonotactical rules laid out above. Uses Markdown.
  - **Orthography**
    - **Translations:** The specification for how Lexiconga should translate certain character sequences into other character sequences. Use the format "original=new" where "original" is the old letter or sequence of letters and "new" is what you want those letters to change into separated by an equal sign. Put each translation on a _separate line_.
    - **Notes:** Any notes about your constructed language's writing system that you want to share. Uses Markdown.
  - **Grammar**
    - **Notes:** Any notes about your constructed language's grammar that you want to share. Uses Markdown.

#### Settings
  - **Prevent Duplicate Words:** Checking this box will prevent the creation of words with the exact same spelling.
  - **Words are Case-Sensitive:** Only available when "Prevent Duplicate Words" is checked. Checking this box will allow the creation of words with the exact same spelling if their capitalization is different.
  - **Sort by Definition:** Checking this box will sort the words in alphabetical order based on the Definition instead of the Word.
  - **Theme:** Set the color theme for the current dictionary.
  - **Custom Styling:** Specify custom CSS to change the styling of your dictionary. You can use custom fonts by specifying them here and setting the `font-family` style of the `.orthographic-translation` class!
  - **Make Public:** Only visible if logged in with a Lexiconga account. Checking this box will make your dictionary public via a link you can share with others. The link will appear below this checkbox after it is checked.

#### Actions
  - **Import JSON:** Choose a previously exported JSON file or older `.dict` file to import. If you are logged in, this will upload the dictionary to your account and display it. If you are not logged in, it will _replace_ your current dictionary with the imported one.
    - Again, please note that if you are not logged in, this import process will _**permanently overwrite your current dictionary**_, so please be sure to export your dictionary _before_ you import a new one!
  - **Import Words:** Choose a properly-formatted `.csv` file of words to add to your dictionary. This will add all of the words from the file to your current dictionary _even if the list includes duplicate words_. Use the "Download an example file with the correct formatting" link below this field to save a file that you can open with any program that processes CSVs like Microsoft Excel or some other spreadsheet program.
    - Please note that when importing words, you must make sure that the parts of speech specified in the parts of speech column are written _exactly as they are in your dictionary settings_ (capitalized, spelled correctly, or any other details). If they are not the same, then you will not be able to use the filters to find the words! So if you import a word with the part of speech set to "adj" or "adjective", but the part of speech in your dictionary's settings is "Adjective", then you will not be able to find the word using the filters!
    - If you import a word _without_ a part of speech, you _can_ use the filter's "Blanks" option to find any words with empty parts of speech to help you clean up after the import.
  - **Export JSON:** Start a download of a file with your dictionary's name in a `.json` format. _Please note that this may not work as expected on mobile platforms._ This export can be a personal backup for your own uses, to work on multiple dictionaries at a time (i.e. export one dictionary and import the other to work on the one you'd like), or you can share it with friends to view it. The file contains your whole dictionary in a JSON format and is mainly only useful for importing back into Lexiconga.
  - **Export Words:** Start a download of all of the words in the currently loaded dictionary into a convenient CSV file format that you can use to re-import into another Lexiconga dictionary or otherwise use as you need it! All of the data is wrapped in double quotes (`"`) to comply with standard CSV format.
  - **Delete Dictionary:** Clicking this button will confirm that you want to delete your dictionary. If you confirm, it will permanently destroy your dictionary and all of its data. If you are logged in, this also removes the dictionary from your account.

After making any changes, be sure to click "Save" or "Save & Close" to ensure that your changes are saved!

### Keyboard Shortcuts
**Esc** : Closes any open window (i.e. Dictionary Settings, Settings, this help page, etc.) without saving.

**Ctrl/Control +**

- **Enter/Return:** Submit Word (when typing in Word or Edit Form) _OR_ Save & Close the Settings or Dictionary Settings window.
- **D:** Cycle through dictionary description, details, and stats.
- **E:** Open the Dictionary Settings window.
- **H:** Open this help window.
- **M:** Maximize/Minimize Full Screen textbox when typing in the boxes that have the Maximize button.
- **S:** Open the Search panel.
- **Shift + S:** Open the Settings window.
- **Backspace/Delete:** Clear the Search box.

## Accounts
**Note:** Lexiconga is 100% functional _without_ creating an account! Using an account only adds additional syncing features that enable you to store more than one dictionary at a time, access your dictionaries from any computer, and optionally share dicitonaries publicly with a link. _An account is not required_ to build your conlang on your local browser.

If you are using an account with Lexiconga, your experience should remain essentially the same, but you will see some additional options in the Settings menu and you might notice some slight changes in performance as it saves to and loads from the database. This saving/loading process prioritizes your local dictionary, so if you ever lose connection, it will keep retrying the upload until connection is re-established. It also attempts to sync every time you load Lexiconga, so please be aware of that if you refresh the page.

### Creating An Account
The first time you create an account, you will need to enter your email address and a password (for logging in) in addition to a "Public Name". Your Public Name will display whenever you log in and will display under your dictionary's name if you make your dictionary public and share it (see below). If you have a dictionary loaded in your browser, it will be automatically uploaded to your account and saved after it is created.

### Logging In
To log in after creating an account, just click the "Log In/Create Account" button and enter your email address and password under the "Log In" section, just like any other account online. You will know that you are logged in from the "Welcome back!" notification at the bottom of the screen when you load the page. You can also know that you're logged in if you see a "Log Out" button instead of "Log In/Create Account" in the top right corner of the screen.

Logging in creates a cookie in your browser that Lexiconga uses to know that you are logged in and verify your account. That means that if your browser prevents cookies, you cannot use a Lexiconga account's features.

### Differences
Every time you save a change to your dictionary's settings or add, edit, or delete a word, the changes are automatically saved to both your browser's localStorage in addition to being sent to your account. Little confirmation messages will appear in the bottom right side of the screen after every change you make to confirm that things are saved correctly.

#### Settings
After logging in, you'll see some additional options in the "Settings" window under new "Account Settings" and "Account Actions" sections.

##### Account Settings

- **Email:** Allows you to specify a different login and contact email address. Make sure that you do not forget what you chose, because there is no way to retrieve your email address if you change it to something you forget!
- **Public Name:** Allows you to change your public name.
- **Allow Emails:** Check this box if you would like to receive emails about important Lexiconga updates. Make sure that you allow emails from addresses at lexicon.ga or check your spam folder just in case. Note that this checkbox does not affect password reset requests—if you forget your password, Lexiconga will send you a password reset email regardless of your choice here.
- **New Password:** Enter a new password in this field _only if you want to change it_! Leave this field blank to prevent your password from changing.

If you change any of the options above, be sure you click the "Save" or "Save & Close" button.

##### Account Actions

- **Change Dictionary:** Shows all dictionaries created on your account. Choose a different one from the drop-down box to instantly load and display that dictionary.
- **Create New Dictionary:** Clicking this button will create a new dictionary on your account and display the new empty dictionary to you.

#### Public Dictionaries
When a dictionary is marked as public, you can share its public link and allow anyone to view and search its contents without being able to make changes. Public dictionaries also have the ability to share specific word entries using the "➦" buttons in each word box. When viewing a word, anyone can still read the dictionary's description and details.

To log in or create an account when viewing a dictionary, you need to go back to the main Lexiconga page. You can get there by clicking the Lexiconga logo.

### Forgot Your Password?
If you forget your password, you can request a password reset email by clicking the "Forgot Password" button in the "Log In/Create Account" window, entering the email address associated with your account, and clicking "Email Password Reset Key". This will send an email (_check your spam_) with a link that will allow you to reset your password. When you go to the link provided, you'll be able to enter a new password that you can log in with.

### Lockout
If you manage to enter your password wrong 10 times, you'll be locked out from logging in for 1 hour. Use this time to try to remember your password or something. You can get an idea of how long you've waited by trying to log in again. After an hour has passed, refresh the page again and you'll get another 10 tries.

## Problems or Requests
Please report any problems you come across to the [Lexiconga Issues page](https://github.com/Alamantus/Lexiconga/issues). You can also submit enhancement requests to the same place if you have any requests for new features.

## Update Log
You can see all previous updates to Lexiconga on the [Lexiconga Releases page](https://github.com/Alamantus/Lexiconga/releases).

## Open Source
Lexiconga's source code is fully open and readable on Github here: https://github.com/Alamantus/Lexiconga

## Thanks!
If you like Lexiconga and want to help contribute to keeping it online and motivate me to keep adding new features, you can use **[Buy Me A Coffee](https://buymeacoff.ee/robbieantenesse)** to give a one-time donation or **[Liberapay](https://liberapay.com/robbieantenesse)** to make a recurring donation.

I hope you enjoy Lexiconga and that it helps you build some awesome languages.

–Robbie Antenesse
