# 4X4U - A Currency Arbitrageur

### Scan the foreign exchange market (forex) for arbitrage opportunities.

### _Created by_  
    Olha Hizhytska  
    Maxwell Meyer  
    Jo Miller  
    Scott O'Neil  
    Micah Olson  
    Jon Stump

## Technologies Used
* HTML
* CSS
* JavaScript
* Bootstrap 4.6
* jQuery 3.5.1
* Node.js 14.15.5
* npm 6.14.10
* webpack 4.39.3
* ESLint 6.3.1
* Markdown 1.0.1
* ExchangeRate-API

## Description
\[Description to come\].  

## Setup and Installation
* To use this application, you will need to **acquire your own API key** for the ExchangeRate-API.
  - Go to the [ExchangeRate-API](https://www.exchangerate-api.com) website
  - Input your email address and click "Get Free Key!"
  - Complete the "Create Account" form by adding your first name and a password
  - Read the terms of use and, to proceed further, check that you agree
  - Click "Create Account & API Key!"
  - You will be redirected to your account dashboard, where you'll find
    - your unique API key (please keep this private and secure)
    - the status of your monthly quota and usage information

* After acquiring an API key, **clone this repository** to a local directory using the command-line tool `git` ([how to install git](https://www.learnhowtoprogram.com/introduction-to-programming/getting-started-with-intro-to-programming/git-and-github)).  
  >`$ cd ~/[directory]/[path]/[of]/[choice]/`  
  >`$ git clone https://github.com/MicahOlson/4X4U.git`  

* **Navigate into the project** using `cd` to move to the top level of the project directory.  
  >`$ cd 4X4U/`   

* **Make your API key available to the application** without hardcoding it into any scripts 
  - Create a file called `.env` that holds your key. This can be done with the single command below, replacing the content in brackets with your API key and removing the brackets  
    >`$ echo "API_KEY=[your-API-key-without-brackets]" > .env`  
  
  - Note that the API calls in this project use an embedded expression in a *template literal* that references the value in `.env`. Along with `.gitignore` discussed in the next point, this helps **secure the API key** by keeping it out of the application's code. Here is the syntax
    >`https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/...`
  
  - The `.gitignore` file included in this project already lists `.env` as one of the files to exclude from `git` tracking, which keeps `.env` out of commits and helps ensure it never gets pushed to a public repository. You can double-check that it is indeed listed by running the following
    >`$ cat .gitignore`
  
  - If for some reason `.env` is not in `.gitignore`, you should add it by using the command below. Note the use of two angled brackets (`>>`) here to append the `.gitignore` file and not overwrite it  
    >`$ echo .env >> .gitignore`  

* **Install all packages and dependencies** listed in `package.json` using the `Node.js` package manager `npm`. Install `Node.js` to get `npm` ([how to install node and npm](https://www.learnhowtoprogram.com/intermediate-javascript/getting-started-with-javascript/installing-node-js)).  
  >`$ npm install`  

* Then **build a distribution bundle** by running the following. This will create the version of `index.html` you will access as discussed below.  
  >`$ npm run build`  

* To view the site locally, **start the preconfigured development server** to automatically launch the site in your default browser.  
  >`$ npm run start`  
  
  - You could also open the file called `index.html` in the project's `dist/` subdirectory to view a static version  
  >`$ cd dist/`  
  >`$ open index.html`  

  - Alternatively, you can navigate to these project directories through your system's GUI file manager, then double-click `index.html` to open it in your default browser  

* To edit the project, open the files in your preferred code editor. Here are some recommendations:  
  - [Visual Studio Code](https://code.visualstudio.com) - "Code editing. Redefined."  
  - [Atom](https://atom.io) - "A hackable text editor for the 21st Century"  
  - [SublimeText](https://www.sublimetext.com) - "A sophisticated text editor for code, markup and prose"  

## Known Bugs
* No known bugs.  
* If you find a bug, please report it to me at the email address below.  

## License
[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)  
Copyright &copy; 2021  
    Olha Hizhytska  
    Maxwell Meyer  
    Jo Miller  
    Scott O'Neil  
    Micah L. Olson  
    Jon Stump  

## Contact Information
Micah Olson micah.olson@protonmail.com  