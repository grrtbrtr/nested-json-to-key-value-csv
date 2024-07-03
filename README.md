# nested-json-to-key-value-csv

A tool to quickly convert a nested JSON file into a dot-notation CSV file (semicolon-separated) with 2 columns: key and value.

### Prerequisites

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com/)

### Installation

```sh
git clone git@github.com:grrtbrtr/nested-json-to-key-value-csv.git

cd nested-json-to-key-value-csv/
yarn install
```

### Usage

Use via the command line:

```sh
node src/index.js -i <input-file> -o <output-file>
```

## Arguments

| Argument | Description |
| --- | --- |
| `--input` or `-i` | a reference to the JSON file relative to the working folder |
| `--output` or `-o` | a file name (and location) for the CSV file to be generated<br />(supports relative paths only) |
