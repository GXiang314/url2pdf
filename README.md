# Url2Pdf Node Project

## Prerequisites

* Node 18 LTS

## Quick Start

#### Prepare `data.json` to `input`
```bash
cp input/data.example.json input/data.json
```

schema:

```json
[
    {
        "url": "<fill>",
        "title": "pdf title"
    }, ...
]
```

#### Installation

```bash
npm ci
```

#### Run/Development Mode

```bash
npm run dev
```

will be output a directory to `outputs`

```shell
input/
├── data.json
outputs/
├── 171555555555
│   ├── 1.pdf
│   ├── 2.pdf
│   └── ...
```

#### Build

```bash
npm run build
```

#### Production Mode

```bash
npm start
```
> `npm run build` before run this command
> run this command will be output a directory to `outputs`