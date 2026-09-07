# Sanskrit source dataset

The Day 5 importer uses the public `gita/gita` repository's `data/verse.json` as the source:

- Source: https://github.com/gita/gita
- Raw data: https://raw.githubusercontent.com/gita/gita/main/data/verse.json
- Repository license: Unlicense

The source dataset contains an optional Chapter 13 verse numbered 13.1 in addition to the standard 700-verse edition. The importer explicitly removes that optional verse and renumbers source 13.2–13.35 as standard 13.1–13.34.

No translations are imported.

The app does not silently invent or repair Sanskrit. Validation fails if the source does not match the expected 18-chapter/700-verse structure.
