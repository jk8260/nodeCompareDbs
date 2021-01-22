# Guaranteed Rate Homework

Homework is a Node.js console app. 
This app was developed on WSL2 but should run on any node platform.

## Assumptions

- both supplied docker images are running and their ports on localhost are 5432 & 5433
- counts will display in the console
- missing, mismatch and added datasets are stored in output/ as json files

## Installation
The instructions below reference the WSL2 bash prommt,
this app will run on any platform that runs node.js and npm will.
Please feel free to joyride

Use WSL2 bash prompt and npm to restore the packages

```bash
npm install
```

## Usage

Use WSL2 bash prompt and node cli to run the app

```bash
node nodeCompareDbs.js
```
if you wish I have also setup an npm script named start
```bash
npm start
```

## Contributing

## License
[MIT](https://choosealicense.com/licenses/mit/)
