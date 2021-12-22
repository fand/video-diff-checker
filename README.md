# video-diff-checker

![test status](https://github.com/fand/video-diff-checker/actions/workflows/test.yml/badge.svg)

A CLI tool to compare diffs in 2 videos which have same length.

## Install

```
$ npm i -g @fand/video-diff-checker
```

## Usage

```
$ video-diff-checker --help

  video-diff-checker - Check diffs of frames in 2 videos

  Usage:
    $ video-diff-checker <fileA> <fileB>

  Options:
    --threshod, -t  Set threshold for diffs (default: 0.1)

  Examples:
    $ pixelmatcher foo.mp4 bar.mp4
    $ pixelmatcher foo.mp4 bar.mp4 -t 0.3

```

`video-diff-checker` shows the total count of different pixels in the videos.
The output will be like this:

```
❯ video-diff-checker foo.mp4 bar.mp4
>> Input: foo.mp4, bar.mp4 (threshold: 0.1)
>> Extracting frames from foo.mp4...
>> Extracting frames from bar.mp4...
>> Comparing frames... 100%

Diff: 0.047% (887835 in 1870387200 pixels)

```

You can also set the threshold with `-t` option (default: `0.1`).
For more details about the threshold, see Pixelmatch library:

https://github.com/mapbox/pixelmatch/blob/b9261a447515f5aff37a15cfab9f4a491868f720/index.js#L43-L45

## LICENSE

MIT
