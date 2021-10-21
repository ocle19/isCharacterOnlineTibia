const axios = require("axios");
const cheerio = require("cheerio");
const url = "https://mudabraglobal.com/?subtopic=whoisonline#S";
var beep = require("beepbeep");
const SECONDS_TO_CHECK = 10;
const CHARACTERS_TO_CHECK = ["Session Destroy"];
setInterval(() => {
    axios(url)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const tableClassItems = $(".InnerTableContainer");
            const tableCharactersOnline = [];

            tableClassItems.each(function () {
                const tableCharactersName = $(this)
                    .find("table > tbody > tr > td > a")
                    .text();
                CHARACTERS_TO_CHECK.forEach((character) => {
                    if (tableCharactersName.includes(character)) {
                        tableCharactersOnline.push({
                            tableCharactersName,
                        });
                    }
                });
            });
            if (tableCharactersOnline.length == CHARACTERS_TO_CHECK.length) {
                console.log(
                    CHARACTERS_TO_CHECK.length == 1
                        ? "Character is ONLINE"
                        : "All characters are ONLINE"
                );
            } else {
                beep(2, 200);
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
                          } OFFLINE`
                );
            }
        })
        .catch(console.error);
}, 1000 * SECONDS_TO_CHECK);
