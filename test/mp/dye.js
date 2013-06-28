"use strict";
var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("mp.dye");

var dyeString = "R:#ede5b2,fff7bf;G:#cccccc,ffffff";
var dyeData = {
    "R": [
        [0xed, 0xe5, 0xb2],
        [0xff, 0xf7, 0xbf]
    ],
    "G": [
        [0xcc, 0xcc, 0xcc],
        [0xff, 0xff, 0xff]
    ]
};


function testDyeParse(expected, input, mp) {
    assert.dyeDataEqual(mp.dye.parseDyeString(input), expected);
}

suite.addBatch({
    "The manaportal dye": {
        topic: load("mp/dye", "mp/resource").expression("mp").document(),
        "getChannel": {
            topic: function(mp) { return mp.dye.getChannel; },
            "returns null given pure black": function(f) {
                assert.equal(f([0,0,0]).channel, null);
            },
            "returns R given a pure red": function(f) {
                assert.equal(f([255,0,0]).channel, "R");
                assert.equal(f([12,0,0]).channel, "R");
            },
            "returns G given a pure green": function(f) {
                assert.equal(f([0,255,0]).channel, "G");
                assert.equal(f([0,50,0]).channel, "G");
            },
            "returns B given a pure blue": function (f) {
                assert.equal(f([0,0,255]).channel, "B");
                assert.equal(f([0,0,23]).channel, "B");
            },
            "returns C given a pure cyan": function (f) {
                assert.equal(f([0,255,255]).channel, "C");
                assert.equal(f([0,90,90]).channel, "C");
            },
            "returns M given a pure magenta": function (f) {
                assert.equal(f([255,0,255]).channel, "M");
                assert.equal(f([62,0,62]).channel, "M");
            },
            "returns Y given a pure yellow": function (f) {
                assert.equal(f([255,255,0]).channel, "Y");
                assert.equal(f([70,70,0]).channel, "Y");
            },
            "returns W given a pure white": function (f) {
                assert.equal(f([255,255,255]).channel, "W");
                assert.equal(f([100,100,100]).channel, "W");
            },
            "returns null given an impure color": function(f) {
                assert.equal(f([12,34,56]).channel, null);
                assert.equal(f([55,53,55]).channel, null);
                assert.equal(f([0,128,254]).channel, null);
            }
        },
        "parseDyeString": {
            "extracts the dye channel data from the dyestring": testDyeParse.bind(null, dyeData, dyeString)
        },
        "asDyeString": {
            "reconstructs the dyestring from the dye channel data": function(mp) {
                assert.equal(mp.dye.asDyeString(dyeData), dyeString);
            }
        },
    }
});

suite.export(module);
