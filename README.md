## What is Lexiconga Dictionary Builder?
Lexiconga is a tool intended to help you build constructed language (conlang) dictionaries/lexicons.

You can enter words and definitions, and they will appear nicely formatted and in alphabetical order under your dictionary's title, where you can also sort them by part of speech. If the default parts of speech are not adequate for your conlang, you can change them to whatever parts of speech you might need. You can even enter a description or full set of language rules that you can toggle on and off below the dictionary's title!

It accepts Unicode characters so you can utilize whatever typable characters you might need and [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting long text entries, and if you want to share or even just make a backup of your dictionary, you can export it to a single convenient file that can be easily re-imported. Your dictionary is saved to your browser's localStorage every time you make a change, which means as long as you use the same browser and don't deliberately delete it (by clearing your cache), your dictionary will always be there when you come back.

If you would like an added layer of accessibility and security (in case you clear your browser cache frequently), you can create an account, where you can store and switch between as many dictionaries as you need. Having an account will also allow you to access your dictionaries from any browser by logging in. (Just be careful you don't overwrite dictionaries by logging in and saving from separate locations!)

## Table of Contents
* [How do I use Lexiconga?](#how-do-i-use-lexiconga)
  * [Getting Started](#getting-started)
  * [Viewing your Dictionary's Description/Rules](#viewing-your-dictionary-s-description-rules)
  * [Entry Management](#entry-management)
  * [The Settings Menu](#the-settings-menu)
  * [Search/Filter](#search-filter)
* [Accounts](#accounts)
  * [Creating An Account](#creating-an-account)
  * [Logging In](#logging-in)
  * [Differences](#differences)
    * [Account Settings](#account-settings)
    * [Dictionary Settings](#dictionary-settings)
    * [Public Dictionaries](#public-dictionaries)
  * [Forgot Your Password?](#forgot-your-password-)
  * [Lockout](#lockout)
* [Problems or Requests](#problems-or-requests)
* [Future Plans](#future-plans)
* [Thanks](#thanks-)
* [Libraries Used](#libraries-used)

## How do I use Lexiconga?

### Getting Started
When you have a brand new, empty dictionary, the first thing you'll probably want to do is change the title to whatever your conlang is called and add at least a little description of what your language is like or how to use it. You can do this by clicking on the Settings button, which will open up the settings screen. Here, you will find all the fields you need to update your dictionary's Name and Description/Rules. The Description/Rules text area uses [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to format any text you include, so brush up on how to do basic things in Markdown before you get started _(NOTE: a line break is done by adding 2 or more spaces to the end of the line and then going to the next line!)_. After this, make sure that the Parts of Speech are adequate for your language _(see below for more information about this)_. Update these fields to what you want them to say and click the "Save" button to keep the Settings menu open, or the "Save and Close" button to close the menu and start adding words!

To add words, just use the form on the top left side of the window. Hopefully the form is self-explanatory, but if not, here's a little guide:  
Enter the word in your language in the "Word" field, the pronunciation of the word in the "Pronunciation" field, choose a Part of Speech, enter an equivalent word/short definition in the "Equivalent Word(s)" field and/or a longer definition or fuller explanation of the word using [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) in the "Explanation/Long Definition" text area, and click "Add Word". Your word will instantly appear in your dictionary under the dictionary's name! You can add as many words as you want this way.  
The only things to remember while adding new words is that the minimum information that you can enter is the Word itself and either the Equivalent Word OR the Explanation. You can have both of these or just one, but you need at least one. If you do not want to use the Pronunciation or Parts of Speech then you do not need to, though if you leave out Part of Speech, you will miss out on the handy Filter feature of the dictionary.

And that's all you need to get started! Everything else should be pretty self-explanatory, but a full explanation of Dictionary Builder and all of its functions continues below.

### Viewing your Dictionary's Description/Rules
After you enter a markdown-formatted description/rules in the Settings menu, you can view the formatted version by clicking the "Show Description" button under your dictionary's name. You can hide it again by clicking "Hide Description" when the description is displayed.

### Entry Management
After adding some words to your dictionary, you'll notice a link icon (🔗) and an "Edit" and "Delete" button attached to each entry.

The link icon (🔗) is a link to that word. These links only work when there is nothing entered in the search box and no filters are set. Also note that the links are only intended for linking within the same dictionary and will only work properly when your dictionary is loaded, so only share them with friends if your friends also have your dictionary imported.

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

### Search/Filter
You can search entries or filter by part of speech by clicking the "Search/Filter Options" button to expand the search panel.

From there, you can enter any text you want in the search box and either press Enter or click anywhere outside the search box, and Lexiconga will display any and every entry including your entry. To display the entire dictionary again, you must clear the search box.

You can refine your search by using the checkboxes below the search box:

* **Word**: When checked, Lexiconga searches your dictionary's "Word" entries for the entered text. When unchecked, it ignores it.
* **Equivalent**: When checked, Lexiconga searches your dictionary's "Equivalent Word(s)" entries for the entered text. When unchecked, it ignores it.
* **Explanation**: When checked, Lexiconga searches your dictionary's "Explanation/Long Definition" entries for the entered text. When unchecked, it ignores it.
* **Search Case-Sensitive**: When checked, Lexiconga finds entries matching the letter case in the entered text. When unchecked, it will find any case as long as the letters match.
* **Ignore Diacritics/Accents**: When checked, Lexiconga will ignore accented letters and diacritics and identify them as their equivalent unaccented letter and vice-versa, in case you want to find a word with a diacritic without entering the diacritic in the search box. When unchecked, it will only find diacritics and accented letters if they are specifically entered in the search box.

The "Filter Words" drop-down box allows you to filter your dictionary by part of speech. To display the whole dictionary again after setting a filter, reset the filter option to "All".

## Accounts
If you are using an account with Lexiconga, your experience should remain essentially the same, but you will see some additional options in the Settings menu and you might notice some slight changes in performance as it saves to and loads from the database.

### Creating An Account
The first time you create an account, you will need to enter your email address and a password (for logging in) in addition to a "Public Name". Your Public Name will be more important when we add dictionary sharing later, but for now, it is important in that it helps indicate whether or not you are logged in (see below). If you have a dictionary loaded in your browser, it will be automatically uploaded to your account and saved after it is created.

### Logging In
To log in after creating an account, just click the "Log In/Create Account" button and enter your email address and password under the "Log In" form, just like any other account online. You will know that you are logged in from the "Welcome back!" notification at the top of the screen when you load the page. You can also know that you're logged in if you see a "Log Out" button instead of "Log In/Create Account" in the top right corner of the screen.

### Differences
Every time you save a change to your dictionary's settings or add, edit, or delete a word, the changes are automatically saved to both your browser's localStorage in addition to being sent to your account. If you're paranoid that your changes are not being saved, you can check your browser's console log to see the little save and update notifications.

#### Account Settings
After logging in, you'll see an "Account Settings" button in the top, right side of the Lexiconga window. Clicking this will allow you to change a few settings about your account:

The **Email** field allows you to specify a different login and contact email address. Make sure that you do not forget what you chose, because there is no way to retrieve your email address if you change it to something you forget!

The **Public Name** field allows you to change your public name.

The **Allow Emails** checkbox allows you to choose if you would like to receive emails about important Lexiconga updates. Make sure that you allow emails from addresses at lexicon.ga or check your spam folder just in case. Note that this checkbox does not affect password reset requests—if you forget your password, Lexiconga will send you a password reset email regardless of your choice here.

If you change any of the three options above, be sure you click the "Save Settings" button.

The "Reset Password" button in the "Reset Your Password" section will allow you to reset your login password. Don't forget it!

#### Dictionary Settings
Under the Settings menu, you'll see some additional options:

The **Dictionary is Public** checkbox determines whether or not the current dictionary can be viewed by anyone online using the Public Link that appears when checked. Public dictionaries are explained more below.

The **Change Dicitonaries** dropdown box contains the names of all of your created dictionaries. If you have more than one, selecting a different dictionary from the list will immediately download and display that dictionary.

The **Create New Dictionary** button will instantly create and save a new blank dictionary to your account.

The **Import Dictionary** button acts the same as before, but instead of overwriting your dictionary, it imports the dictionary as a new, separate dictionary and saves it to your account. After importing, the imported dictionary will display, and you can use the Change Dictionaries dropdown box to change to a previous one if you desire.

The **Delete Current Dictionary** button will permanently and irretrievably delete the currently loaded dictionary from your account! Be careful with that one. After deleting, you will then be prompted to either select another dictionary to load or create a new one, _or_ if you have no other dictionaries, immediately create a new one for you.

#### Public Dictionaries
When a dictionary is marked as public, you can share its public link and allow anyone to view its contents without being able to make changes. The dictionary's description and the search/filter area is visible by default, and the viewer can scroll through or search your dictionary without being able to make changes.

To log in or create an account when viewing a dictionary, you need to go back to the main Lexiconga page. You can get there by clicking either the logo or the "Go Home" button.

### Forgot Your Password?
If you forget your password, you can request a password reset email by clicking the "Forgot Password" button on the "Log In/Create Account" button entering the email address associated with your account and clicking "Email Password Reset Key". This will send an email (_check your spam_) with a link that will allow you to reset your password. When you go to the link provided, you'll be able to enter a new password that you can log in with.

### Lockout
If you manage to enter your password wrong 10 times, you'll be locked out from logging in for an hour. Use this time to try to remember your password or something. You can get an idea of how long you've waited by refreshing the page and clicking the unfortunate "Can't Login" button. After an hour has passed, refresh the page again and you'll get another 10 tries.

## Problems or Requests
Please report any problems you come across to the [Dictionary Builder Issues page](https://github.com/Alamantus/DictionaryBuilder/issues). You can also submit enhancement requests to the same place if you have any requests for new features.

## Future Plans
In the future, I'm planning to:
* add the ability to easily share dictionaries by your Public Name, but all dictionaries will be private by default
* enable account deletion if you lose trust or hope in Lexiconga's services
* ad removal option?

## Thanks!
If you like Lexiconga and want to buy me a cup of coffee for the service, you can **[donate throughPaypal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=MCCSYGQCR5TLY&lc=US&item_name=Lexiconga&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)** to help keep it online if you want.

I hope you enjoy Lexiconga and that it helps you build some awesome languages.

–Robbie Antenesse

## Libraries Used
* [Marked.js](https://github.com/chjj/marked) by Christopher Jeffrey (JJ) (a.k.a. chjj)
* [Defiant.js](http://defiantjs.com) by Hakan Bilgin (a.k.a. hbi99)
* [removeDiacritics.js](http://stackoverflow.com/a/18391901/3508346) by [rdllopes](http://meta.stackoverflow.com/users/1879686/rdllopes)
