const axios = require("axios");
const cheerio = require("cheerio");
const SITE_WHO_IS_ONLINE_URL =
    "https://mudabraglobal.com/?subtopic=whoisonline#S";
var beep = require("beepbeep");
const SECONDS_TO_CHECK = 2;
const fs = require("fs");

setInterval(() => {
    axios(SITE_WHO_IS_ONLINE_URL)
        .then((response) => {
            CHARACTERS_TO_CHECK = fs
                .readFileSync("./charactersList.txt", "utf8")
                .split("\n")
                .map((x) => x.trim());
            const html = response.data;
            const $ = cheerio.load(html);
            const tableCharactersName = $(
                ".InnerTableContainer > table > tbody > tr > td > a"
            ).text();
            var tableCharactersOnline = [];
            var tableCharactersOffline = [];

            CHARACTERS_TO_CHECK.forEach((character) => {
                if (tableCharactersName.includes(character)) {
                    tableCharactersOnline.push(character.trim());
                } else {
                    tableCharactersOffline.push(character.trim());
                }
            });
            if (tableCharactersOnline.length == CHARACTERS_TO_CHECK.length) {
                console.log(
                    CHARACTERS_TO_CHECK.length == 1
                        ? "Character is ONLINE"
                        : "All characters are ONLINE"
                );
            } else {
                beep(1, 500); /// duração do beep, tempo em milisegundos
                console.log(
                    CHARACTERS_TO_CHECK.length == 1
                        ? `Character is OFFLINE`
                        : `${
                              CHARACTERS_TO_CHECK.length -
                              tableCharactersOnline.length
                          } of ${CHARACTERS_TO_CHECK.length} characters ${
                              CHARACTERS_TO_CHECK.length -
                                  tableCharactersOnline.length ==
                              1
                                  ? "is"
                                  : "are"
                          } OFFLINE --> [ ${tableCharactersOffline} ]`
                );
            }
        })
        .catch(console.error);
}, 1000 * SECONDS_TO_CHECK);
