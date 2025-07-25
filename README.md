a rewrite of Unofficial Mini Jam Leaderboard.
[original version](https://github.com/triplecubes/uml_code)

**IMPORTANT:** this repo's history may be wiped at any time

# license
the code are MIT licensed, arts are CC0 licensed

# api usage
minijamofficial.com: I asked the Mini Jam's hosts for permissions to use the
minijamofficial.com private api and to publish the datas. before using the
scripts you should also ask for the permissions like I did

itch.io's entries.json: Leafo said it is fine to use the API.
https://itch.io/t/1487695/solved-any-api-to-fetch-jam-entries

# requirements
all you need is the deno runtime installed to use these scripts

# how to use
this how to use guide is for those who want to run their own Unofficial Mini
Jam Leaderboard. as for the unofficial leaderboard hosted at
https://triplecubes.github.io/uml, I will be the only one able update it

please read this how to use guide in full if you want to run your own
Unofficial Mini Jam Leaderboard

do note that these instructions are for firefox browser. I don't use chrome
nor any other browser and I don't know/remember how their debug console work

**DO NOT TRY TO AUTOMATE THE PROCESS DESCRIBED BELOW, BECAUSE IN THE SCRAP
PROCESS, IF A HTTP REQUEST FAIL, THE SCRIPTS WILL JUST WAIT 6 SECS AND THEN
RETRY THE REQUEST, INFINITELY. HUMAN ATTENTION IS REQUIRED TO STOP THE SCRAP
PROCESS WHEN THAT HAPPENS**

first, you need to `cd` into the root folder of the project, aka the folder
that contain the `src/` and `docs/` folders

there are 2 operations

## scrap
```
deno run --check -N -W -R src/scrap/main.ts
```

this will scrap the jams listed in `input/jam_list.txt` and put the data in the
`cache/` folder. these data will be used for the next operation

you will need to manually add new jam to scrap into `input/jam_list.txt`. the
format of the file should be self explain, except for that entries.json link

**IMPORTANT:** only jams that has finished their voting period, aka jams that
has their `Results` tab available, should be added to `input/jam_list.txt`

to get the entries.json link, you first go to the jam's itch.io page. click the
`Submissions` tab and then open your browser's debug console and choose the
`Network` tab. now refresh the page so that all the network requests appears.
there should be a request named `entries.json` of type `json` there, click it.
a box should appears with tabs like `Headers`, `Cookies`, `Request`, `Response`,
... in the `Headers` tab you should see a
`GET https://itch.io/jam/SOME_NUMBER/entries.json`, that is the entries.json
link

the data are also incrementally scraped. if a file for jam X is already existed
in the `cache/` folder, jam X won't get rescraped. but jam X's cache file may
still get updated to update game/jammer's changed link/name

the files in `cache/` folder are all generated. you should never edit them
yourself

## generate
```
deno run --check -W -R src/gen/main.ts
```

this will use the data from the `cache/` folder to generate the unofficial
leaderboard website. everything is written in the `docs/` folder

the files in the `docs/` folder is also all generated. you should never edit
them yourself

## hardcoded links
there are some links to the https://github.com/TripleCubes/uml repository or
https://triplecubes.github.io/uml page that is hardcoded into the source code.
these links are used for in various part of the generated website like the
`Source code` link at the top of the site, or the `graph_explains.md` link shown
in jammer pages, ... they are all listed in `src/gen/links.ts`, modify them to
your own links

## workflow
so if you are maintaining a Unofficial Mini Jam Leaderboard website, your
workflow would be, everytime a Mini Jam or Major Jam's voting period ended, let
call them jam A, you go to jam A's itch.io page, make sure their `Results` page
is available, and add jam A to `input/jam_list.txt`

you then run the **scrap** process, which will update the `cache/` folder

and then, you run the **generate** process, which will regenerate the `docs/`
folder entirely, from the data in the `cache/` folder

and there you go, the entire website should be contained inside the `docs/`
folder

## src/minijam_list/main.ts
if the `input/jam_list.txt` is very outdated, and is missing many Mini Jams, it
would be really tedious to have to add all the missing jams by hand. in that
case, you can use this command

```
deno run -N src/minijam_list/main.ts
```

this will get data from itch.io and minijamofficial.com and then print out
a list of Mini Jams in format that can be directly copy-ed to
`input/jam_list.txt`

you would still need to make sure every Mini Jams inside the list have their
voting period finished, aka their `Results` page is available

this command run really slow, so it is recommended that you add jams to
`input/jam_list.txt` by hand if there are not many jams missing from the file

this command only product a list for Mini Jams, not Major Jams
