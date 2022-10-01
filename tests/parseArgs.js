"use strict";

var test = require("tape");
var parseArgs = require("../lib/index").parseArgs;

test("parseArgs", function (t) {
  t.test("when short option used as flag then stored as flag", function (st) {
    var args = ["-f"];
    var expected = { values: { __proto__: null, f: true }, positionals: [] };
    var result = parseArgs({ strict: false, args });
    st.deepEqual(result, expected);
    st.end();
  });
  t.test(
    "when short option used as flag before positional then stored as flag and positional (and not value)",
    function (st) {
      var args = ["-f", "bar"];
      var expected = {
        values: { __proto__: null, f: true },
        positionals: ["bar"],
      };
      var result = parseArgs({ strict: false, args });
      st.deepEqual(result, expected);
      st.end();
    }
  );
  t.test(
    'when short option `type: "string"` used with value then stored as value',
    function (st) {
      var args = ["-f", "bar"];
      var options = { f: { type: "string" } };
      var expected = {
        values: { __proto__: null, f: "bar" },
        positionals: [],
      };
      var result = parseArgs({ args, options });
      st.deepEqual(result, expected);
      st.end();
    }
  );

  t.test(
    "when short option listed in short used as flag then long option stored as flag",
    function (st) {
      var args = ["-f"];
      var options = { foo: { short: "f", type: "boolean" } };
      var expected = {
        values: { __proto__: null, foo: true },
        positionals: [],
      };
      var result = parseArgs({ args, options });
      st.deepEqual(result, expected);
      st.end();
    }
  );

  t.test(
    'when short option listed in short and long listed in `type: "string"` and ' +
      "used with value then long option stored as value",
    function (st) {
      var args = ["-f", "bar"];
      var options = { foo: { short: "f", type: "string" } };
      var expected = {
        values: { __proto__: null, foo: "bar" },
        positionals: [],
      };
      var result = parseArgs({ args, options });
      st.deepEqual(result, expected);
      st.end();
    }
  );

  t.test(
    'when short option `type: "string"` used without value then stored as flag',
    function (st) {
      var args = ["-f"];
      var options = { f: { type: "string" } };
      var expected = {
        values: { __proto__: null, f: true },
        positionals: [],
      };
      var result = parseArgs({ strict: false, args, options });
      st.deepEqual(result, expected);
      st.end();
    }
  );

  t.test(
    "short option group behaves like multiple short options",
    function (st) {
      var args = ["-rf"];
      var options = {};
      var expected = {
        values: { __proto__: null, r: true, f: true },
        positionals: [],
      };
      var result = parseArgs({ strict: false, args, options });
      st.deepEqual(result, expected);
      st.end();
    }
  );

  t.test(
    "short option group does not consume subsequent positional",
    function (st) {
      var args = ["-rf", "foo"];
      var options = {};
      var expected = {
        values: { __proto__: null, r: true, f: true },
        positionals: ["foo"],
      };
      var result = parseArgs({ strict: false, args, options });
      st.deepEqual(result, expected);
      st.end();
    }
  );

  // See: Guideline 5 https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html
  t.test(
    'if terminal of short-option group configured `type: "string"`, subsequent positional is stored',
    function (st) {
      var args = ["-rvf", "foo"];
      var options = { f: { type: "string" } };
      var expected = {
        values: { __proto__: null, r: true, v: true, f: "foo" },
        positionals: [],
      };
      var result = parseArgs({ strict: false, args, options });
      st.deepEqual(result, expected);
      st.end();
    }
  );

  t.test(
    "handles short-option groups in conjunction with long-options",
    function (st) {
      var args = ["-rf", "--foo", "foo"];
      var options = { foo: { type: "string" } };
      var expected = {
        values: { __proto__: null, r: true, f: true, foo: "foo" },
        positionals: [],
      };
      var result = parseArgs({ strict: false, args, options });
      st.deepEqual(result, expected);
      st.end();
    }
  );

  t.test(
    'handles short-option groups with "short" alias configured',
    function (st) {
      var args = ["-rf"];
      var options = { remove: { short: "r", type: "boolean" } };
      var expected = {
        values: { __proto__: null, remove: true, f: true },
        positionals: [],
      };
      var result = parseArgs({ strict: false, args, options });
      st.deepEqual(result, expected);
      st.end();
    }
  );

  t.test(
    "Everything after a bare `--` is considered a positional argument",
    function (st) {
      var args = ["--", "barepositionals", "mopositionals"];
      var expected = {
        values: { __proto__: null },
        positionals: ["barepositionals", "mopositionals"],
      };
      var result = parseArgs({ allowPositionals: true, args });
      st.deepEqual(result, expected, Error("testing bare positionals"));
      st.end();
    }
  );

  t.test("args are true", function (st) {
    var args = ["--foo", "--bar"];
    var expected = {
      values: { __proto__: null, foo: true, bar: true },
      positionals: [],
    };
    var result = parseArgs({ strict: false, args });
    st.deepEqual(result, expected, Error("args are true"));
    st.end();
  });

  t.test("arg is true and positional is identified", function (st) {
    var args = ["--foo=a", "--foo", "b"];
    var expected = {
      values: { __proto__: null, foo: true },
      positionals: ["b"],
    };
    var result = parseArgs({ strict: false, args });
    st.deepEqual(
      result,
      expected,
      Error("arg is true and positional is identified")
    );
    st.end();
  });

  t.test('args equals are passed `type: "string"`', function (st) {
    var args = ["--so=wat"];
    var options = { so: { type: "string" } };
    var expected = {
      values: { __proto__: null, so: "wat" },
      positionals: [],
    };
    var result = parseArgs({ args, options });
    st.deepEqual(result, expected, Error("arg value is passed"));
    st.end();
  });

  t.test(
    "when args include single dash then result stores dash as positional",
    function (st) {
      var args = ["-"];
      var expected = { values: { __proto__: null }, positionals: ["-"] };
      var result = parseArgs({ allowPositionals: true, args });
      st.deepEqual(result, expected);
      st.end();
    }
  );

  t.test(
    'zero config args equals are parsed as if `type: "string"`',
    function (st) {
      var args = ["--so=wat"];
      var options = {};
      var expected = {
        values: { __proto__: null, so: "wat" },
        positionals: [],
      };
      var result = parseArgs({ strict: false, args, options });
      st.deepEqual(result, expected, Error("arg value is passed"));
      st.end();
    }
  );

  t.test(
    'same arg is passed twice `type: "string"` and last value is recorded',
    function (st) {
      var args = ["--foo=a", "--foo", "b"];
      var options = { foo: { type: "string" } };
      var expected = {
        values: { __proto__: null, foo: "b" },
        positionals: [],
      };
      var result = parseArgs({ args, options });
      st.deepEqual(result, expected, Error("last arg value is passed"));
      st.end();
    }
  );

  t.test("args equals pass string including more equals", function (st) {
    var args = ["--so=wat=bing"];
    var options = { so: { type: "string" } };
    var expected = {
      values: { __proto__: null, so: "wat=bing" },
      positionals: [],
    };
    var result = parseArgs({ args, options });
    st.deepEqual(result, expected, Error("arg value is passed"));
    st.end();
  });

  t.test(
    'first arg passed for `type: "string"` and "multiple" is in array',
    function (st) {
      var args = ["--foo=a"];
      var options = { foo: { type: "string", multiple: true } };
      var expected = {
        values: { __proto__: null, foo: ["a"] },
        positionals: [],
      };
      var result = parseArgs({ args, options });
      st.deepEqual(result, expected, Error("first multiple in array"));
      st.end();
    }
  );

  t.test('args are passed `type: "string"` and "multiple"', function (st) {
    var args = ["--foo=a", "--foo", "b"];
    var options = {
      foo: {
        type: "string",
        multiple: true,
      },
    };
    var expected = {
      values: { __proto__: null, foo: ["a", "b"] },
      positionals: [],
    };
    var result = parseArgs({ args, options });
    st.deepEqual(result, expected, Error("both arg values are passed"));
    st.end();
  });

  t.test(
    "when expecting `multiple:true` boolean option and option used multiple times then result includes array of " +
      "booleans matching usage",
    function (st) {
      var args = ["--foo", "--foo"];
      var options = {
        foo: {
          type: "boolean",
          multiple: true,
        },
      };
      var expected = {
        values: { __proto__: null, foo: [true, true] },
        positionals: [],
      };
      var result = parseArgs({ args, options });
      st.deepEqual(result, expected);
      st.end();
    }
  );

  t.test(
    "order of option and positional does not matter (per README)",
    function (st) {
      var args1 = ["--foo=bar", "baz"];
      var args2 = ["baz", "--foo=bar"];
      var options = { foo: { type: "string" } };
      var expected = {
        values: { __proto__: null, foo: "bar" },
        positionals: ["baz"],
      };
      st.deepEqual(
        parseArgs({ allowPositionals: true, args: args1, options }),
        expected,
        Error("option then positional")
      );
      st.deepEqual(
        parseArgs({ allowPositionals: true, args: args2, options }),
        expected,
        Error("positional then option")
      );
      st.end();
    }
  );

  t.test("correct default args when use node -p", function (st) {
    var holdArgv = process.argv;
    process.argv = [process.argv0, "--foo"];
    var holdExecArgv = process.execArgv;
    process.execArgv = ["-p", "0"];
    var result = parseArgs({ strict: false });

    var expected = {
      values: { __proto__: null, foo: true },
      positionals: [],
    };
    st.deepEqual(result, expected);
    process.argv = holdArgv;
    process.execArgv = holdExecArgv;
    st.end();
  });

  t.test("correct default args when use node --print", function (st) {
    var holdArgv = process.argv;
    process.argv = [process.argv0, "--foo"];
    var holdExecArgv = process.execArgv;
    process.execArgv = ["--print", "0"];
    var result = parseArgs({ strict: false });

    var expected = {
      values: { __proto__: null, foo: true },
      positionals: [],
    };
    st.deepEqual(result, expected);
    process.argv = holdArgv;
    process.execArgv = holdExecArgv;
    st.end();
  });

  t.test("correct default args when use node -e", function (st) {
    var holdArgv = process.argv;
    process.argv = [process.argv0, "--foo"];
    var holdExecArgv = process.execArgv;
    process.execArgv = ["-e", "0"];
    var result = parseArgs({ strict: false });

    var expected = {
      values: { __proto__: null, foo: true },
      positionals: [],
    };
    st.deepEqual(result, expected);
    process.argv = holdArgv;
    process.execArgv = holdExecArgv;
    st.end();
  });

  t.test("correct default args when use node --eval", function (st) {
    var holdArgv = process.argv;
    process.argv = [process.argv0, "--foo"];
    var holdExecArgv = process.execArgv;
    process.execArgv = ["--eval", "0"];
    var result = parseArgs({ strict: false });
    var expected = {
      values: { __proto__: null, foo: true },
      positionals: [],
    };
    st.deepEqual(result, expected);
    process.argv = holdArgv;
    process.execArgv = holdExecArgv;
    st.end();
  });

  t.test("correct default args when normal arguments", function (st) {
    var holdArgv = process.argv;
    process.argv = [process.argv0, "script.js", "--foo"];
    var holdExecArgv = process.execArgv;
    process.execArgv = [];
    var result = parseArgs({ strict: false });

    var expected = {
      values: { __proto__: null, foo: true },
      positionals: [],
    };
    st.deepEqual(result, expected);
    process.argv = holdArgv;
    process.execArgv = holdExecArgv;
    st.end();
  });

  t.test("excess leading dashes on options are retained", function (st) {
    // Enforce a design decision for an edge case.
    var args = ["---triple"];
    var options = {};
    var expected = {
      values: { __proto__: null, "-triple": true },
      positionals: [],
    };
    var result = parseArgs({ strict: false, args, options });
    st.deepEqual(result, expected, Error("excess option dashes are retained"));
    st.end();
  });

  t.test(
    "positional arguments are allowed by default in strict:false",
    function (st) {
      var args = ["foo"];
      var options = {};
      var expected = {
        values: { __proto__: null },
        positionals: ["foo"],
      };
      var result = parseArgs({ strict: false, args, options });
      st.deepEqual(result, expected);
      st.end();
    }
  );
  t.end();
});
