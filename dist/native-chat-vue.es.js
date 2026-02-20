import { ref as z, readonly as Se, openBlock as T, createElementBlock as D, createElementVNode as V, defineComponent as pe, inject as ue, computed as W, resolveComponent as oe, normalizeClass as Dt, createVNode as Z, withCtx as Be, unref as de, toDisplayString as Cn, onBeforeUnmount as Ln, Fragment as In, createBlock as ce, createCommentVNode as us, watch as ze, nextTick as Ke, onMounted as ps, renderList as hs, onUnmounted as fs, provide as gs } from "vue";
import { useDisplay as ds, useTheme as ms } from "vuetify";
const nt = /* @__PURE__ */ Symbol("native-chat-config"), Ae = /* @__PURE__ */ Symbol("native-chat-state");
function ks(s) {
  if (s && typeof s == "object" && "statusCode" in s) {
    const e = s.statusCode;
    if (e === 429)
      return "You're sending messages too quickly. Please wait a moment and try again.";
    if (e === 503 || e === 504)
      return "The service is temporarily unavailable. Please try again in a moment.";
  }
  return "Something went wrong. You can try sending your message again.";
}
function bs(s, e) {
  const n = z([]), r = z(!1), t = z(!1), i = z(!1), l = z(!1), c = z(null), o = z(null), p = z(0), h = e.batchSize ?? 20;
  async function d() {
    if (!(r.value || t.value)) {
      t.value = !0;
      try {
        if (e.conversationId)
          o.value = e.conversationId;
        else {
          const re = await s.getConversations(0, 1);
          if (re.conversations.length > 0)
            o.value = re.conversations[0].id;
          else {
            const R = await s.createConversation();
            o.value = R.id;
          }
        }
        const L = await s.getMessages(o.value, 0, h), H = [...L.messages].reverse();
        n.value = H, l.value = L.has_more, p.value = H.length;
      } catch {
      } finally {
        t.value = !1, r.value = !0;
      }
    }
  }
  function m() {
    r.value = !1;
  }
  async function w(L) {
    if (!L.trim() || i.value || !o.value) return;
    i.value = !0;
    const H = `temp-${Date.now()}`, re = {
      id: H,
      conversationId: o.value,
      role: "user",
      content: L,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sending"
    };
    n.value = [...n.value, re];
    try {
      const R = await s.sendMessage(o.value, L), v = {
        ...R.userMessage,
        status: "sent"
      }, Y = {
        ...R.assistantMessage
      };
      n.value = [
        ...n.value.filter((N) => N.id !== H && !N.id.startsWith("error-")),
        v,
        Y
      ], c.value = null;
    } catch (R) {
      n.value = n.value.filter((N) => N.id !== H && !N.id.startsWith("error-"));
      const v = ks(R), Y = {
        id: `error-${Date.now()}`,
        conversationId: o.value,
        role: "assistant",
        content: v,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      n.value = [...n.value, Y], c.value = L, e.onError && e.onError({
        message: v,
        statusCode: R && typeof R == "object" && "statusCode" in R ? R.statusCode : void 0,
        originalError: R
      });
    } finally {
      i.value = !1;
    }
  }
  async function _() {
    if (!(!l.value || t.value || !o.value)) {
      t.value = !0;
      try {
        const L = await s.getMessages(
          o.value,
          p.value,
          h
        ), H = [...L.messages].reverse();
        n.value = [...H, ...n.value], p.value += H.length, l.value = L.has_more;
      } catch {
      } finally {
        t.value = !1;
      }
    }
  }
  async function q() {
    if (!c.value) return;
    const L = c.value;
    c.value = null, await w(L);
  }
  return {
    messages: Se(n),
    isOpen: Se(r),
    isLoading: Se(t),
    isSending: Se(i),
    hasMore: Se(l),
    failedMessageText: Se(c),
    open: d,
    close: m,
    sendMessage: w,
    loadMore: _,
    retry: q
  };
}
const xt = {
  dark: !1,
  colors: {
    primary: "#002B38",
    secondary: "#C4105B",
    background: "#F8F8F8",
    surface: "#FFFFFF",
    error: "#DE3232",
    success: "#41A58D",
    info: "#002B38",
    "on-primary": "#FDFDFD",
    "on-secondary": "#FFFFFF",
    "on-surface": "#002B38",
    "welcome-text": "#B0BCC0"
  },
  variables: {}
}, j = (s, e) => {
  const n = s.__vccOpts || s;
  for (const [r, t] of e)
    n[r] = t;
  return n;
}, _s = {}, xs = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ws(s, e) {
  return T(), D("svg", xs, [...e[0] || (e[0] = [
    V("path", { d: "M12 1c.4 0 .7.3.9.7l2.2 5.8 5.8 2.2c.4.2.7.5.7.9s-.3.7-.7.9l-5.8 2.2-2.2 5.8c-.2.4-.5.7-.9.7s-.7-.3-.9-.7l-2.2-5.8-5.8-2.2c-.4-.2-.7-.5-.7-.9s.3-.7.7-.9l5.8-2.2 2.2-5.8c.2-.4.5-.7.9-.7Z" }, null, -1)
  ])]);
}
const Mt = /* @__PURE__ */ j(_s, [["render", ws]]), Ts = /* @__PURE__ */ pe({
  __name: "FloatingButton",
  setup(s, { expose: e }) {
    const n = ue(nt), r = ue(Ae), t = W(() => r.isOpen.value), i = W(() => n?.position ?? "bottom-right"), l = W(
      () => `nc-floating-button-wrapper--${i.value === "bottom-left" ? "left" : "right"}`
    );
    function c() {
      r.isOpen.value ? r.close() : r.open();
    }
    const o = z(null);
    function p() {
      o.value?.$el?.focus();
    }
    return e({ focus: p }), (h, d) => {
      const m = oe("v-icon"), w = oe("v-btn");
      return T(), D("div", {
        class: Dt(["nc-floating-button-wrapper", l.value])
      }, [
        Z(w, {
          ref_key: "triggerBtn",
          ref: o,
          icon: "",
          size: "56",
          color: "secondary",
          elevation: "4",
          "aria-label": t.value ? "Close chat" : "Open chat",
          "aria-expanded": t.value.toString(),
          onClick: c
        }, {
          default: Be(() => [
            Z(m, {
              icon: Mt,
              color: "white"
            })
          ]),
          _: 1
        }, 8, ["aria-label", "aria-expanded"])
      ], 2);
    };
  }
}), ys = /* @__PURE__ */ j(Ts, [["__scopeId", "data-v-368d25bf"]]), vs = {}, Ss = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function As(s, e) {
  return T(), D("svg", Ss, [...e[0] || (e[0] = [
    V("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, null, -1)
  ])]);
}
const Es = /* @__PURE__ */ j(vs, [["render", As]]), Rs = { class: "nc-chat-header" }, Cs = { class: "nc-chat-header__left" }, Ls = /* @__PURE__ */ pe({
  __name: "ChatHeader",
  setup(s) {
    const e = ue(Ae);
    return (n, r) => {
      const t = oe("v-icon"), i = oe("v-btn");
      return T(), D("div", Rs, [
        V("div", Cs, [
          Z(t, {
            icon: Mt,
            color: "secondary",
            size: "20"
          }),
          r[1] || (r[1] = V("span", { class: "nc-chat-header__title" }, "AI Assistant", -1))
        ]),
        Z(i, {
          icon: "",
          variant: "text",
          size: "small",
          "aria-label": "Close chat",
          onClick: r[0] || (r[0] = (l) => de(e).close())
        }, {
          default: Be(() => [
            Z(t, {
              icon: Es,
              size: "18"
            })
          ]),
          _: 1
        })
      ]);
    };
  }
}), Is = /* @__PURE__ */ j(Ls, [["__scopeId", "data-v-f89f9f15"]]), Os = { class: "nc-welcome-state" }, Ds = { class: "nc-welcome-state__text" }, Ms = /* @__PURE__ */ pe({
  __name: "WelcomeState",
  props: {
    message: {}
  },
  setup(s) {
    return (e, n) => (T(), D("div", Os, [
      V("p", Ds, Cn(s.message ?? "Hello! How can I help you?"), 1)
    ]));
  }
}), Ns = /* @__PURE__ */ j(Ms, [["__scopeId", "data-v-6d3eccea"]]);
function Nt() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ke = Nt();
function On(s) {
  ke = s;
}
var ge = { exec: () => null };
function b(s, e = "") {
  let n = typeof s == "string" ? s : s.source, r = { replace: (t, i) => {
    let l = typeof i == "string" ? i : i.source;
    return l = l.replace(B.caret, "$1"), n = n.replace(t, l), r;
  }, getRegex: () => new RegExp(n, e) };
  return r;
}
var $s = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), B = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}>`) }, Ps = /^(?:[ \t]*(?:\n|$))+/, zs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Bs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Fe = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Fs = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, $t = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Dn = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Mn = b(Dn).replace(/bull/g, $t).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Us = b(Dn).replace(/bull/g, $t).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Pt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Hs = /^[^\n]+/, zt = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Gs = b(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", zt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ws = b(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, $t).getRegex(), st = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Bt = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, qs = b("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Bt).replace("tag", st).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Nn = b(Pt).replace("hr", Fe).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", st).getRegex(), Ys = b(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Nn).getRegex(), Ft = { blockquote: Ys, code: zs, def: Gs, fences: Bs, heading: Fs, hr: Fe, html: qs, lheading: Mn, list: Ws, newline: Ps, paragraph: Nn, table: ge, text: Hs }, dn = b("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Fe).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", st).getRegex(), Zs = { ...Ft, lheading: Us, table: dn, paragraph: b(Pt).replace("hr", Fe).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", dn).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", st).getRegex() }, js = { ...Ft, html: b(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Bt).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ge, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: b(Pt).replace("hr", Fe).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Mn).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Vs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Xs = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, $n = /^( {2,}|\\)\n(?!\s*$)/, Qs = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, rt = /[\p{P}\p{S}]/u, Ut = /[\s\p{P}\p{S}]/u, Pn = /[^\s\p{P}\p{S}]/u, Ks = b(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Ut).getRegex(), zn = /(?!~)[\p{P}\p{S}]/u, Js = /(?!~)[\s\p{P}\p{S}]/u, er = /(?:[^\s\p{P}\p{S}]|~)/u, Bn = /(?![*_])[\p{P}\p{S}]/u, tr = /(?![*_])[\s\p{P}\p{S}]/u, nr = /(?:[^\s\p{P}\p{S}]|[*_])/u, sr = b(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", $s ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Fn = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, rr = b(Fn, "u").replace(/punct/g, rt).getRegex(), ar = b(Fn, "u").replace(/punct/g, zn).getRegex(), Un = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", ir = b(Un, "gu").replace(/notPunctSpace/g, Pn).replace(/punctSpace/g, Ut).replace(/punct/g, rt).getRegex(), lr = b(Un, "gu").replace(/notPunctSpace/g, er).replace(/punctSpace/g, Js).replace(/punct/g, zn).getRegex(), or = b("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Pn).replace(/punctSpace/g, Ut).replace(/punct/g, rt).getRegex(), cr = b(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Bn).getRegex(), ur = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", pr = b(ur, "gu").replace(/notPunctSpace/g, nr).replace(/punctSpace/g, tr).replace(/punct/g, Bn).getRegex(), hr = b(/\\(punct)/, "gu").replace(/punct/g, rt).getRegex(), fr = b(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), gr = b(Bt).replace("(?:-->|$)", "-->").getRegex(), dr = b("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", gr).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Je = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, mr = b(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Je).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Hn = b(/^!?\[(label)\]\[(ref)\]/).replace("label", Je).replace("ref", zt).getRegex(), Gn = b(/^!?\[(ref)\](?:\[\])?/).replace("ref", zt).getRegex(), kr = b("reflink|nolink(?!\\()", "g").replace("reflink", Hn).replace("nolink", Gn).getRegex(), mn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Ht = { _backpedal: ge, anyPunctuation: hr, autolink: fr, blockSkip: sr, br: $n, code: Xs, del: ge, delLDelim: ge, delRDelim: ge, emStrongLDelim: rr, emStrongRDelimAst: ir, emStrongRDelimUnd: or, escape: Vs, link: mr, nolink: Gn, punctuation: Ks, reflink: Hn, reflinkSearch: kr, tag: dr, text: Qs, url: ge }, br = { ...Ht, link: b(/^!?\[(label)\]\((.*?)\)/).replace("label", Je).getRegex(), reflink: b(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Je).getRegex() }, Et = { ...Ht, emStrongRDelimAst: lr, emStrongLDelim: ar, delLDelim: cr, delRDelim: pr, url: b(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", mn).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: b(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", mn).getRegex() }, _r = { ...Et, br: b($n).replace("{2,}", "*").getRegex(), text: b(Et.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, je = { normal: Ft, gfm: Zs, pedantic: js }, Le = { normal: Ht, gfm: Et, breaks: _r, pedantic: br }, xr = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, kn = (s) => xr[s];
function ne(s, e) {
  if (e) {
    if (B.escapeTest.test(s)) return s.replace(B.escapeReplace, kn);
  } else if (B.escapeTestNoEncode.test(s)) return s.replace(B.escapeReplaceNoEncode, kn);
  return s;
}
function bn(s) {
  try {
    s = encodeURI(s).replace(B.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function _n(s, e) {
  let n = s.replace(B.findPipe, (i, l, c) => {
    let o = !1, p = l;
    for (; --p >= 0 && c[p] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), r = n.split(B.splitPipe), t = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; t < r.length; t++) r[t] = r[t].trim().replace(B.slashPipe, "|");
  return r;
}
function Ie(s, e, n) {
  let r = s.length;
  if (r === 0) return "";
  let t = 0;
  for (; t < r && s.charAt(r - t - 1) === e; )
    t++;
  return s.slice(0, r - t);
}
function wr(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let r = 0; r < s.length; r++) if (s[r] === "\\") r++;
  else if (s[r] === e[0]) n++;
  else if (s[r] === e[1] && (n--, n < 0)) return r;
  return n > 0 ? -2 : -1;
}
function Tr(s, e = 0) {
  let n = e, r = "";
  for (let t of s) if (t === "	") {
    let i = 4 - n % 4;
    r += " ".repeat(i), n += i;
  } else r += t, n++;
  return r;
}
function xn(s, e, n, r, t) {
  let i = e.href, l = e.title || null, c = s[1].replace(t.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let o = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: n, href: i, title: l, text: c, tokens: r.inlineTokens(c) };
  return r.state.inLink = !1, o;
}
function yr(s, e, n) {
  let r = s.match(n.other.indentCodeCompensation);
  if (r === null) return e;
  let t = r[1];
  return e.split(`
`).map((i) => {
    let l = i.match(n.other.beginningSpace);
    if (l === null) return i;
    let [c] = l;
    return c.length >= t.length ? i.slice(t.length) : i;
  }).join(`
`);
}
var et = class {
  options;
  rules;
  lexer;
  constructor(s) {
    this.options = s || ke;
  }
  space(s) {
    let e = this.rules.block.newline.exec(s);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(s) {
    let e = this.rules.block.code.exec(s);
    if (e) {
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : Ie(n, `
`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let n = e[0], r = yr(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r = Ie(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: Ie(e[0], `
`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let n = Ie(e[0], `
`).split(`
`), r = "", t = "", i = [];
      for (; n.length > 0; ) {
        let l = !1, c = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) c.push(n[o]), l = !0;
        else if (!l) c.push(n[o]);
        else break;
        n = n.slice(o);
        let p = c.join(`
`), h = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${p}` : p, t = t ? `${t}
${h}` : h;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(h, i, !0), this.lexer.state.top = d, n.length === 0) break;
        let m = i.at(-1);
        if (m?.type === "code") break;
        if (m?.type === "blockquote") {
          let w = m, _ = w.raw + `
` + n.join(`
`), q = this.blockquote(_);
          i[i.length - 1] = q, r = r.substring(0, r.length - w.raw.length) + q.raw, t = t.substring(0, t.length - w.text.length) + q.text;
          break;
        } else if (m?.type === "list") {
          let w = m, _ = w.raw + `
` + n.join(`
`), q = this.list(_);
          i[i.length - 1] = q, r = r.substring(0, r.length - m.raw.length) + q.raw, t = t.substring(0, t.length - w.raw.length) + q.raw, n = _.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: i, text: t };
    }
  }
  list(s) {
    let e = this.rules.block.list.exec(s);
    if (e) {
      let n = e[1].trim(), r = n.length > 1, t = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: !1, items: [] };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      let i = this.rules.other.listItemRegex(n), l = !1;
      for (; s; ) {
        let o = !1, p = "", h = "";
        if (!(e = i.exec(s)) || this.rules.block.hr.test(s)) break;
        p = e[0], s = s.substring(p.length);
        let d = Tr(e[2].split(`
`, 1)[0], e[1].length), m = s.split(`
`, 1)[0], w = !d.trim(), _ = 0;
        if (this.options.pedantic ? (_ = 2, h = d.trimStart()) : w ? _ = e[1].length + 1 : (_ = d.search(this.rules.other.nonSpaceChar), _ = _ > 4 ? 1 : _, h = d.slice(_), _ += e[1].length), w && this.rules.other.blankLine.test(m) && (p += m + `
`, s = s.substring(m.length + 1), o = !0), !o) {
          let q = this.rules.other.nextBulletRegex(_), L = this.rules.other.hrRegex(_), H = this.rules.other.fencesBeginRegex(_), re = this.rules.other.headingBeginRegex(_), R = this.rules.other.htmlBeginRegex(_), v = this.rules.other.blockquoteBeginRegex(_);
          for (; s; ) {
            let Y = s.split(`
`, 1)[0], N;
            if (m = Y, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), N = m) : N = m.replace(this.rules.other.tabCharGlobal, "    "), H.test(m) || re.test(m) || R.test(m) || v.test(m) || q.test(m) || L.test(m)) break;
            if (N.search(this.rules.other.nonSpaceChar) >= _ || !m.trim()) h += `
` + N.slice(_);
            else {
              if (w || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || H.test(d) || re.test(d) || L.test(d)) break;
              h += `
` + m;
            }
            w = !m.trim(), p += Y + `
`, s = s.substring(Y.length + 1), d = N.slice(_);
          }
        }
        t.loose || (l ? t.loose = !0 : this.rules.other.doubleBlankLine.test(p) && (l = !0)), t.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(h), loose: !1, text: h, tokens: [] }), t.raw += p;
      }
      let c = t.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else return;
      t.raw = t.raw.trimEnd();
      for (let o of t.items) {
        if (this.lexer.state.top = !1, o.tokens = this.lexer.blockTokens(o.text, []), o.task) {
          if (o.text = o.text.replace(this.rules.other.listReplaceTask, ""), o.tokens[0]?.type === "text" || o.tokens[0]?.type === "paragraph") {
            o.tokens[0].raw = o.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), o.tokens[0].text = o.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let h = this.lexer.inlineQueue.length - 1; h >= 0; h--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)) {
              this.lexer.inlineQueue[h].src = this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let p = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (p) {
            let h = { type: "checkbox", raw: p[0] + " ", checked: p[0] !== "[ ]" };
            o.checked = h.checked, t.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = h.raw + o.tokens[0].raw, o.tokens[0].text = h.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(h)) : o.tokens.unshift({ type: "paragraph", raw: h.raw, text: h.raw, tokens: [h] }) : o.tokens.unshift(h);
          }
        }
        if (!t.loose) {
          let p = o.tokens.filter((d) => d.type === "space"), h = p.length > 0 && p.some((d) => this.rules.other.anyLine.test(d.raw));
          t.loose = h;
        }
      }
      if (t.loose) for (let o of t.items) {
        o.loose = !0;
        for (let p of o.tokens) p.type === "text" && (p.type = "paragraph");
      }
      return t;
    }
  }
  html(s) {
    let e = this.rules.block.html.exec(s);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(s) {
    let e = this.rules.block.def.exec(s);
    if (e) {
      let n = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", t = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: n, raw: e[0], href: r, title: t };
    }
  }
  table(s) {
    let e = this.rules.block.table.exec(s);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let n = _n(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let l of r) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < n.length; l++) i.header.push({ text: n[l], tokens: this.lexer.inline(n[l]), header: !0, align: i.align[l] });
      for (let l of t) i.rows.push(_n(l, i.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: i.align[o] })));
      return i;
    }
  }
  lheading(s) {
    let e = this.rules.block.lheading.exec(s);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(s) {
    let e = this.rules.block.paragraph.exec(s);
    if (e) {
      let n = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(s) {
    let e = this.rules.block.text.exec(s);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(s) {
    let e = this.rules.inline.escape.exec(s);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(s) {
    let e = this.rules.inline.tag.exec(s);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(s) {
    let e = this.rules.inline.link.exec(s);
    if (e) {
      let n = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let i = Ie(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = wr(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, l).trim(), e[3] = "";
        }
      }
      let r = e[2], t = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(r);
        i && (r = i[1], t = i[3]);
      } else t = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), xn(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(s, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(s)) || (n = this.rules.inline.nolink.exec(s))) {
      let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), t = e[r.toLowerCase()];
      if (!t) {
        let i = n[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return xn(n, t, n[0], this.lexer, this.rules);
    }
  }
  emStrong(s, e, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(s);
    if (!(!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let t = [...r[0]].length - 1, i, l, c = t, o = 0, p = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, e = e.slice(-1 * s.length + t); (r = p.exec(e)) != null; ) {
        if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i) continue;
        if (l = [...i].length, r[3] || r[4]) {
          c += l;
          continue;
        } else if ((r[5] || r[6]) && t % 3 && !((t + l) % 3)) {
          o += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c + o);
        let h = [...r[0]][0].length, d = s.slice(0, t + r.index + h + l);
        if (Math.min(t, l) % 2) {
          let w = d.slice(1, -1);
          return { type: "em", raw: d, text: w, tokens: this.lexer.inlineTokens(w) };
        }
        let m = d.slice(2, -2);
        return { type: "strong", raw: d, text: m, tokens: this.lexer.inlineTokens(m) };
      }
    }
  }
  codespan(s) {
    let e = this.rules.inline.code.exec(s);
    if (e) {
      let n = e[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), t = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return r && t && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: e[0], text: n };
    }
  }
  br(s) {
    let e = this.rules.inline.br.exec(s);
    if (e) return { type: "br", raw: e[0] };
  }
  del(s, e, n = "") {
    let r = this.rules.inline.delLDelim.exec(s);
    if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
      let t = [...r[0]].length - 1, i, l, c = t, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, e = e.slice(-1 * s.length + t); (r = o.exec(e)) != null; ) {
        if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (l = [...i].length, l !== t)) continue;
        if (r[3] || r[4]) {
          c += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c);
        let p = [...r[0]][0].length, h = s.slice(0, t + r.index + p + l), d = h.slice(t, -t);
        return { type: "del", raw: h, text: d, tokens: this.lexer.inlineTokens(d) };
      }
    }
  }
  autolink(s) {
    let e = this.rules.inline.autolink.exec(s);
    if (e) {
      let n, r;
      return e[2] === "@" ? (n = e[1], r = "mailto:" + n) : (n = e[1], r = n), { type: "link", raw: e[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(s) {
    let e;
    if (e = this.rules.inline.url.exec(s)) {
      let n, r;
      if (e[2] === "@") n = e[0], r = "mailto:" + n;
      else {
        let t;
        do
          t = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (t !== e[0]);
        n = e[0], e[1] === "www." ? r = "http://" + e[0] : r = e[0];
      }
      return { type: "link", raw: e[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(s) {
    let e = this.rules.inline.text.exec(s);
    if (e) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: n };
    }
  }
}, K = class Rt {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ke, this.options.tokenizer = this.options.tokenizer || new et(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: B, block: je.normal, inline: Le.normal };
    this.options.pedantic ? (n.block = je.pedantic, n.inline = Le.pedantic) : this.options.gfm && (n.block = je.gfm, this.options.breaks ? n.inline = Le.breaks : n.inline = Le.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: je, inline: Le };
  }
  static lex(e, n) {
    return new Rt(n).lex(e);
  }
  static lexInline(e, n) {
    return new Rt(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(B.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let r = this.inlineQueue[n];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], r = !1) {
    for (this.options.pedantic && (e = e.replace(B.tabCharGlobal, "    ").replace(B.spaceLine, "")); e; ) {
      let t;
      if (this.options.extensions?.block?.some((l) => (t = l.call({ lexer: this }, e, n)) ? (e = e.substring(t.raw.length), n.push(t), !0) : !1)) continue;
      if (t = this.tokenizer.space(e)) {
        e = e.substring(t.raw.length);
        let l = n.at(-1);
        t.raw.length === 1 && l !== void 0 ? l.raw += `
` : n.push(t);
        continue;
      }
      if (t = this.tokenizer.code(e)) {
        e = e.substring(t.raw.length);
        let l = n.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + t.raw, l.text += `
` + t.text, this.inlineQueue.at(-1).src = l.text) : n.push(t);
        continue;
      }
      if (t = this.tokenizer.fences(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.heading(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.hr(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.blockquote(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.list(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.html(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.def(e)) {
        e = e.substring(t.raw.length);
        let l = n.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + t.raw, l.text += `
` + t.raw, this.inlineQueue.at(-1).src = l.text) : this.tokens.links[t.tag] || (this.tokens.links[t.tag] = { href: t.href, title: t.title }, n.push(t));
        continue;
      }
      if (t = this.tokenizer.table(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.lheading(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let l = 1 / 0, c = e.slice(1), o;
        this.options.extensions.startBlock.forEach((p) => {
          o = p.call({ lexer: this }, c), typeof o == "number" && o >= 0 && (l = Math.min(l, o));
        }), l < 1 / 0 && l >= 0 && (i = e.substring(0, l + 1));
      }
      if (this.state.top && (t = this.tokenizer.paragraph(i))) {
        let l = n.at(-1);
        r && l?.type === "paragraph" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + t.raw, l.text += `
` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : n.push(t), r = i.length !== e.length, e = e.substring(t.raw.length);
        continue;
      }
      if (t = this.tokenizer.text(e)) {
        e = e.substring(t.raw.length);
        let l = n.at(-1);
        l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + t.raw, l.text += `
` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : n.push(t);
        continue;
      }
      if (e) {
        let l = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else throw new Error(l);
      }
    }
    return this.state.top = !0, n;
  }
  inline(e, n = []) {
    return this.inlineQueue.push({ src: e, tokens: n }), n;
  }
  inlineTokens(e, n = []) {
    let r = e, t = null;
    if (this.tokens.links) {
      let o = Object.keys(this.tokens.links);
      if (o.length > 0) for (; (t = this.tokenizer.rules.inline.reflinkSearch.exec(r)) != null; ) o.includes(t[0].slice(t[0].lastIndexOf("[") + 1, -1)) && (r = r.slice(0, t.index) + "[" + "a".repeat(t[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (t = this.tokenizer.rules.inline.anyPunctuation.exec(r)) != null; ) r = r.slice(0, t.index) + "++" + r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (t = this.tokenizer.rules.inline.blockSkip.exec(r)) != null; ) i = t[2] ? t[2].length : 0, r = r.slice(0, t.index + i) + "[" + "a".repeat(t[0].length - i - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
    let l = !1, c = "";
    for (; e; ) {
      l || (c = ""), l = !1;
      let o;
      if (this.options.extensions?.inline?.some((h) => (o = h.call({ lexer: this }, e, n)) ? (e = e.substring(o.raw.length), n.push(o), !0) : !1)) continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let h = n.at(-1);
        o.type === "text" && h?.type === "text" ? (h.raw += o.raw, h.text += o.text) : n.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, r, c)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e, r, c)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      let p = e;
      if (this.options.extensions?.startInline) {
        let h = 1 / 0, d = e.slice(1), m;
        this.options.extensions.startInline.forEach((w) => {
          m = w.call({ lexer: this }, d), typeof m == "number" && m >= 0 && (h = Math.min(h, m));
        }), h < 1 / 0 && h >= 0 && (p = e.substring(0, h + 1));
      }
      if (o = this.tokenizer.inlineText(p)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (c = o.raw.slice(-1)), l = !0;
        let h = n.at(-1);
        h?.type === "text" ? (h.raw += o.raw, h.text += o.text) : n.push(o);
        continue;
      }
      if (e) {
        let h = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(h);
          break;
        } else throw new Error(h);
      }
    }
    return n;
  }
}, tt = class {
  options;
  parser;
  constructor(s) {
    this.options = s || ke;
  }
  space(s) {
    return "";
  }
  code({ text: s, lang: e, escaped: n }) {
    let r = (e || "").match(B.notSpaceStart)?.[0], t = s.replace(B.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + ne(r) + '">' + (n ? t : ne(t, !0)) + `</code></pre>
` : "<pre><code>" + (n ? t : ne(t, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: s }) {
    return `<blockquote>
${this.parser.parse(s)}</blockquote>
`;
  }
  html({ text: s }) {
    return s;
  }
  def(s) {
    return "";
  }
  heading({ tokens: s, depth: e }) {
    return `<h${e}>${this.parser.parseInline(s)}</h${e}>
`;
  }
  hr(s) {
    return `<hr>
`;
  }
  list(s) {
    let e = s.ordered, n = s.start, r = "";
    for (let l = 0; l < s.items.length; l++) {
      let c = s.items[l];
      r += this.listitem(c);
    }
    let t = e ? "ol" : "ul", i = e && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + t + i + `>
` + r + "</" + t + `>
`;
  }
  listitem(s) {
    return `<li>${this.parser.parse(s.tokens)}</li>
`;
  }
  checkbox({ checked: s }) {
    return "<input " + (s ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: s }) {
    return `<p>${this.parser.parseInline(s)}</p>
`;
  }
  table(s) {
    let e = "", n = "";
    for (let t = 0; t < s.header.length; t++) n += this.tablecell(s.header[t]);
    e += this.tablerow({ text: n });
    let r = "";
    for (let t = 0; t < s.rows.length; t++) {
      let i = s.rows[t];
      n = "";
      for (let l = 0; l < i.length; l++) n += this.tablecell(i[l]);
      r += this.tablerow({ text: n });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: s }) {
    return `<tr>
${s}</tr>
`;
  }
  tablecell(s) {
    let e = this.parser.parseInline(s.tokens), n = s.header ? "th" : "td";
    return (s.align ? `<${n} align="${s.align}">` : `<${n}>`) + e + `</${n}>
`;
  }
  strong({ tokens: s }) {
    return `<strong>${this.parser.parseInline(s)}</strong>`;
  }
  em({ tokens: s }) {
    return `<em>${this.parser.parseInline(s)}</em>`;
  }
  codespan({ text: s }) {
    return `<code>${ne(s, !0)}</code>`;
  }
  br(s) {
    return "<br>";
  }
  del({ tokens: s }) {
    return `<del>${this.parser.parseInline(s)}</del>`;
  }
  link({ href: s, title: e, tokens: n }) {
    let r = this.parser.parseInline(n), t = bn(s);
    if (t === null) return r;
    s = t;
    let i = '<a href="' + s + '"';
    return e && (i += ' title="' + ne(e) + '"'), i += ">" + r + "</a>", i;
  }
  image({ href: s, title: e, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let t = bn(s);
    if (t === null) return ne(n);
    s = t;
    let i = `<img src="${s}" alt="${ne(n)}"`;
    return e && (i += ` title="${ne(e)}"`), i += ">", i;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : ne(s.text);
  }
}, Gt = class {
  strong({ text: s }) {
    return s;
  }
  em({ text: s }) {
    return s;
  }
  codespan({ text: s }) {
    return s;
  }
  del({ text: s }) {
    return s;
  }
  html({ text: s }) {
    return s;
  }
  text({ text: s }) {
    return s;
  }
  link({ text: s }) {
    return "" + s;
  }
  image({ text: s }) {
    return "" + s;
  }
  br() {
    return "";
  }
  checkbox({ raw: s }) {
    return s;
  }
}, J = class Ct {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || ke, this.options.renderer = this.options.renderer || new tt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Gt();
  }
  static parse(e, n) {
    return new Ct(n).parse(e);
  }
  static parseInline(e, n) {
    return new Ct(n).parseInline(e);
  }
  parse(e) {
    let n = "";
    for (let r = 0; r < e.length; r++) {
      let t = e[r];
      if (this.options.extensions?.renderers?.[t.type]) {
        let l = t, c = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(l.type)) {
          n += c || "";
          continue;
        }
      }
      let i = t;
      switch (i.type) {
        case "space": {
          n += this.renderer.space(i);
          break;
        }
        case "hr": {
          n += this.renderer.hr(i);
          break;
        }
        case "heading": {
          n += this.renderer.heading(i);
          break;
        }
        case "code": {
          n += this.renderer.code(i);
          break;
        }
        case "table": {
          n += this.renderer.table(i);
          break;
        }
        case "blockquote": {
          n += this.renderer.blockquote(i);
          break;
        }
        case "list": {
          n += this.renderer.list(i);
          break;
        }
        case "checkbox": {
          n += this.renderer.checkbox(i);
          break;
        }
        case "html": {
          n += this.renderer.html(i);
          break;
        }
        case "def": {
          n += this.renderer.def(i);
          break;
        }
        case "paragraph": {
          n += this.renderer.paragraph(i);
          break;
        }
        case "text": {
          n += this.renderer.text(i);
          break;
        }
        default: {
          let l = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return n;
  }
  parseInline(e, n = this.renderer) {
    let r = "";
    for (let t = 0; t < e.length; t++) {
      let i = e[t];
      if (this.options.extensions?.renderers?.[i.type]) {
        let c = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          r += c || "";
          continue;
        }
      }
      let l = i;
      switch (l.type) {
        case "escape": {
          r += n.text(l);
          break;
        }
        case "html": {
          r += n.html(l);
          break;
        }
        case "link": {
          r += n.link(l);
          break;
        }
        case "image": {
          r += n.image(l);
          break;
        }
        case "checkbox": {
          r += n.checkbox(l);
          break;
        }
        case "strong": {
          r += n.strong(l);
          break;
        }
        case "em": {
          r += n.em(l);
          break;
        }
        case "codespan": {
          r += n.codespan(l);
          break;
        }
        case "br": {
          r += n.br(l);
          break;
        }
        case "del": {
          r += n.del(l);
          break;
        }
        case "text": {
          r += n.text(l);
          break;
        }
        default: {
          let c = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return r;
  }
}, Pe = class {
  options;
  block;
  constructor(s) {
    this.options = s || ke;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(s) {
    return s;
  }
  postprocess(s) {
    return s;
  }
  processAllTokens(s) {
    return s;
  }
  emStrongMask(s) {
    return s;
  }
  provideLexer() {
    return this.block ? K.lex : K.lexInline;
  }
  provideParser() {
    return this.block ? J.parse : J.parseInline;
  }
}, vr = class {
  defaults = Nt();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = J;
  Renderer = tt;
  TextRenderer = Gt;
  Lexer = K;
  Tokenizer = et;
  Hooks = Pe;
  constructor(...s) {
    this.use(...s);
  }
  walkTokens(s, e) {
    let n = [];
    for (let r of s) switch (n = n.concat(e.call(this, r)), r.type) {
      case "table": {
        let t = r;
        for (let i of t.header) n = n.concat(this.walkTokens(i.tokens, e));
        for (let i of t.rows) for (let l of i) n = n.concat(this.walkTokens(l.tokens, e));
        break;
      }
      case "list": {
        let t = r;
        n = n.concat(this.walkTokens(t.items, e));
        break;
      }
      default: {
        let t = r;
        this.defaults.extensions?.childTokens?.[t.type] ? this.defaults.extensions.childTokens[t.type].forEach((i) => {
          let l = t[i].flat(1 / 0);
          n = n.concat(this.walkTokens(l, e));
        }) : t.tokens && (n = n.concat(this.walkTokens(t.tokens, e)));
      }
    }
    return n;
  }
  use(...s) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return s.forEach((n) => {
      let r = { ...n };
      if (r.async = this.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach((t) => {
        if (!t.name) throw new Error("extension name required");
        if ("renderer" in t) {
          let i = e.renderers[t.name];
          i ? e.renderers[t.name] = function(...l) {
            let c = t.renderer.apply(this, l);
            return c === !1 && (c = i.apply(this, l)), c;
          } : e.renderers[t.name] = t.renderer;
        }
        if ("tokenizer" in t) {
          if (!t.level || t.level !== "block" && t.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[t.level];
          i ? i.unshift(t.tokenizer) : e[t.level] = [t.tokenizer], t.start && (t.level === "block" ? e.startBlock ? e.startBlock.push(t.start) : e.startBlock = [t.start] : t.level === "inline" && (e.startInline ? e.startInline.push(t.start) : e.startInline = [t.start]));
        }
        "childTokens" in t && t.childTokens && (e.childTokens[t.name] = t.childTokens);
      }), r.extensions = e), n.renderer) {
        let t = this.defaults.renderer || new tt(this.defaults);
        for (let i in n.renderer) {
          if (!(i in t)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let l = i, c = n.renderer[l], o = t[l];
          t[l] = (...p) => {
            let h = c.apply(t, p);
            return h === !1 && (h = o.apply(t, p)), h || "";
          };
        }
        r.renderer = t;
      }
      if (n.tokenizer) {
        let t = this.defaults.tokenizer || new et(this.defaults);
        for (let i in n.tokenizer) {
          if (!(i in t)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let l = i, c = n.tokenizer[l], o = t[l];
          t[l] = (...p) => {
            let h = c.apply(t, p);
            return h === !1 && (h = o.apply(t, p)), h;
          };
        }
        r.tokenizer = t;
      }
      if (n.hooks) {
        let t = this.defaults.hooks || new Pe();
        for (let i in n.hooks) {
          if (!(i in t)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let l = i, c = n.hooks[l], o = t[l];
          Pe.passThroughHooks.has(i) ? t[l] = (p) => {
            if (this.defaults.async && Pe.passThroughHooksRespectAsync.has(i)) return (async () => {
              let d = await c.call(t, p);
              return o.call(t, d);
            })();
            let h = c.call(t, p);
            return o.call(t, h);
          } : t[l] = (...p) => {
            if (this.defaults.async) return (async () => {
              let d = await c.apply(t, p);
              return d === !1 && (d = await o.apply(t, p)), d;
            })();
            let h = c.apply(t, p);
            return h === !1 && (h = o.apply(t, p)), h;
          };
        }
        r.hooks = t;
      }
      if (n.walkTokens) {
        let t = this.defaults.walkTokens, i = n.walkTokens;
        r.walkTokens = function(l) {
          let c = [];
          return c.push(i.call(this, l)), t && (c = c.concat(t.call(this, l))), c;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(s) {
    return this.defaults = { ...this.defaults, ...s }, this;
  }
  lexer(s, e) {
    return K.lex(s, e ?? this.defaults);
  }
  parser(s, e) {
    return J.parse(s, e ?? this.defaults);
  }
  parseMarkdown(s) {
    return (e, n) => {
      let r = { ...n }, t = { ...this.defaults, ...r }, i = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && r.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let l = t.hooks ? await t.hooks.preprocess(e) : e, c = await (t.hooks ? await t.hooks.provideLexer() : s ? K.lex : K.lexInline)(l, t), o = t.hooks ? await t.hooks.processAllTokens(c) : c;
        t.walkTokens && await Promise.all(this.walkTokens(o, t.walkTokens));
        let p = await (t.hooks ? await t.hooks.provideParser() : s ? J.parse : J.parseInline)(o, t);
        return t.hooks ? await t.hooks.postprocess(p) : p;
      })().catch(i);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let l = (t.hooks ? t.hooks.provideLexer() : s ? K.lex : K.lexInline)(e, t);
        t.hooks && (l = t.hooks.processAllTokens(l)), t.walkTokens && this.walkTokens(l, t.walkTokens);
        let c = (t.hooks ? t.hooks.provideParser() : s ? J.parse : J.parseInline)(l, t);
        return t.hooks && (c = t.hooks.postprocess(c)), c;
      } catch (l) {
        return i(l);
      }
    };
  }
  onError(s, e) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, s) {
        let r = "<p>An error occurred:</p><pre>" + ne(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, me = new vr();
function x(s, e) {
  return me.parse(s, e);
}
x.options = x.setOptions = function(s) {
  return me.setOptions(s), x.defaults = me.defaults, On(x.defaults), x;
};
x.getDefaults = Nt;
x.defaults = ke;
x.use = function(...s) {
  return me.use(...s), x.defaults = me.defaults, On(x.defaults), x;
};
x.walkTokens = function(s, e) {
  return me.walkTokens(s, e);
};
x.parseInline = me.parseInline;
x.Parser = J;
x.parser = J.parse;
x.Renderer = tt;
x.TextRenderer = Gt;
x.Lexer = K;
x.lexer = K.lex;
x.Tokenizer = et;
x.Hooks = Pe;
x.parse = x;
x.options;
x.setOptions;
x.use;
x.walkTokens;
x.parseInline;
J.parse;
K.lex;
const {
  entries: Wn,
  setPrototypeOf: wn,
  isFrozen: Sr,
  getPrototypeOf: Ar,
  getOwnPropertyDescriptor: Er
} = Object;
let {
  freeze: F,
  seal: X,
  create: Lt
} = Object, {
  apply: It,
  construct: Ot
} = typeof Reflect < "u" && Reflect;
F || (F = function(e) {
  return e;
});
X || (X = function(e) {
  return e;
});
It || (It = function(e, n) {
  for (var r = arguments.length, t = new Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++)
    t[i - 2] = arguments[i];
  return e.apply(n, t);
});
Ot || (Ot = function(e) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
    r[t - 1] = arguments[t];
  return new e(...r);
});
const Ve = U(Array.prototype.forEach), Rr = U(Array.prototype.lastIndexOf), Tn = U(Array.prototype.pop), Oe = U(Array.prototype.push), Cr = U(Array.prototype.splice), Qe = U(String.prototype.toLowerCase), wt = U(String.prototype.toString), Tt = U(String.prototype.match), De = U(String.prototype.replace), Lr = U(String.prototype.indexOf), Ir = U(String.prototype.trim), Q = U(Object.prototype.hasOwnProperty), P = U(RegExp.prototype.test), Me = Or(TypeError);
function U(s) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
      r[t - 1] = arguments[t];
    return It(s, e, r);
  };
}
function Or(s) {
  return function() {
    for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
      n[r] = arguments[r];
    return Ot(s, n);
  };
}
function k(s, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Qe;
  wn && wn(s, null);
  let r = e.length;
  for (; r--; ) {
    let t = e[r];
    if (typeof t == "string") {
      const i = n(t);
      i !== t && (Sr(e) || (e[r] = i), t = i);
    }
    s[t] = !0;
  }
  return s;
}
function Dr(s) {
  for (let e = 0; e < s.length; e++)
    Q(s, e) || (s[e] = null);
  return s;
}
function se(s) {
  const e = Lt(null);
  for (const [n, r] of Wn(s))
    Q(s, n) && (Array.isArray(r) ? e[n] = Dr(r) : r && typeof r == "object" && r.constructor === Object ? e[n] = se(r) : e[n] = r);
  return e;
}
function Ne(s, e) {
  for (; s !== null; ) {
    const r = Er(s, e);
    if (r) {
      if (r.get)
        return U(r.get);
      if (typeof r.value == "function")
        return U(r.value);
    }
    s = Ar(s);
  }
  function n() {
    return null;
  }
  return n;
}
const yn = F(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), yt = F(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), vt = F(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Mr = F(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), St = F(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Nr = F(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), vn = F(["#text"]), Sn = F(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), At = F(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), An = F(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Xe = F(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), $r = X(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Pr = X(/<%[\w\W]*|[\w\W]*%>/gm), zr = X(/\$\{[\w\W]*/gm), Br = X(/^data-[\-\w.\u00B7-\uFFFF]+$/), Fr = X(/^aria-[\-\w]+$/), qn = X(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Ur = X(/^(?:\w+script|data):/i), Hr = X(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), Yn = X(/^html$/i), Gr = X(/^[a-z][.\w]*(-[.\w]+)+$/i);
var En = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Fr,
  ATTR_WHITESPACE: Hr,
  CUSTOM_ELEMENT: Gr,
  DATA_ATTR: Br,
  DOCTYPE_NAME: Yn,
  ERB_EXPR: Pr,
  IS_ALLOWED_URI: qn,
  IS_SCRIPT_OR_DATA: Ur,
  MUSTACHE_EXPR: $r,
  TMPLIT_EXPR: zr
});
const $e = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Wr = function() {
  return typeof window > "u" ? null : window;
}, qr = function(e, n) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let r = null;
  const t = "data-tt-policy-suffix";
  n && n.hasAttribute(t) && (r = n.getAttribute(t));
  const i = "dompurify" + (r ? "#" + r : "");
  try {
    return e.createPolicy(i, {
      createHTML(l) {
        return l;
      },
      createScriptURL(l) {
        return l;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + i + " could not be created."), null;
  }
}, Rn = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function Zn() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Wr();
  const e = (g) => Zn(g);
  if (e.version = "3.3.1", e.removed = [], !s || !s.document || s.document.nodeType !== $e.document || !s.Element)
    return e.isSupported = !1, e;
  let {
    document: n
  } = s;
  const r = n, t = r.currentScript, {
    DocumentFragment: i,
    HTMLTemplateElement: l,
    Node: c,
    Element: o,
    NodeFilter: p,
    NamedNodeMap: h = s.NamedNodeMap || s.MozNamedAttrMap,
    HTMLFormElement: d,
    DOMParser: m,
    trustedTypes: w
  } = s, _ = o.prototype, q = Ne(_, "cloneNode"), L = Ne(_, "remove"), H = Ne(_, "nextSibling"), re = Ne(_, "childNodes"), R = Ne(_, "parentNode");
  if (typeof l == "function") {
    const g = n.createElement("template");
    g.content && g.content.ownerDocument && (n = g.content.ownerDocument);
  }
  let v, Y = "";
  const {
    implementation: N,
    createNodeIterator: jn,
    createDocumentFragment: Vn,
    getElementsByTagName: Xn
  } = n, {
    importNode: Qn
  } = r;
  let $ = Rn();
  e.isSupported = typeof Wn == "function" && typeof R == "function" && N && N.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: at,
    ERB_EXPR: it,
    TMPLIT_EXPR: lt,
    DATA_ATTR: Kn,
    ARIA_ATTR: Jn,
    IS_SCRIPT_OR_DATA: es,
    ATTR_WHITESPACE: Wt,
    CUSTOM_ELEMENT: ts
  } = En;
  let {
    IS_ALLOWED_URI: qt
  } = En, C = null;
  const Yt = k({}, [...yn, ...yt, ...vt, ...St, ...vn]);
  let I = null;
  const Zt = k({}, [...Sn, ...At, ...An, ...Xe]);
  let S = Object.seal(Lt(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), Ee = null, ot = null;
  const be = Object.seal(Lt(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let jt = !0, ct = !0, Vt = !1, Xt = !0, _e = !1, Ue = !0, he = !1, ut = !1, pt = !1, xe = !1, He = !1, Ge = !1, Qt = !0, Kt = !1;
  const ns = "user-content-";
  let ht = !0, Re = !1, we = {}, ee = null;
  const ft = k({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Jt = null;
  const en = k({}, ["audio", "video", "img", "source", "image", "track"]);
  let gt = null;
  const tn = k({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), We = "http://www.w3.org/1998/Math/MathML", qe = "http://www.w3.org/2000/svg", ae = "http://www.w3.org/1999/xhtml";
  let Te = ae, dt = !1, mt = null;
  const ss = k({}, [We, qe, ae], wt);
  let Ye = k({}, ["mi", "mo", "mn", "ms", "mtext"]), Ze = k({}, ["annotation-xml"]);
  const rs = k({}, ["title", "style", "font", "a", "script"]);
  let Ce = null;
  const as = ["application/xhtml+xml", "text/html"], is = "text/html";
  let E = null, ye = null;
  const ls = n.createElement("form"), nn = function(a) {
    return a instanceof RegExp || a instanceof Function;
  }, kt = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(ye && ye === a)) {
      if ((!a || typeof a != "object") && (a = {}), a = se(a), Ce = // eslint-disable-next-line unicorn/prefer-includes
      as.indexOf(a.PARSER_MEDIA_TYPE) === -1 ? is : a.PARSER_MEDIA_TYPE, E = Ce === "application/xhtml+xml" ? wt : Qe, C = Q(a, "ALLOWED_TAGS") ? k({}, a.ALLOWED_TAGS, E) : Yt, I = Q(a, "ALLOWED_ATTR") ? k({}, a.ALLOWED_ATTR, E) : Zt, mt = Q(a, "ALLOWED_NAMESPACES") ? k({}, a.ALLOWED_NAMESPACES, wt) : ss, gt = Q(a, "ADD_URI_SAFE_ATTR") ? k(se(tn), a.ADD_URI_SAFE_ATTR, E) : tn, Jt = Q(a, "ADD_DATA_URI_TAGS") ? k(se(en), a.ADD_DATA_URI_TAGS, E) : en, ee = Q(a, "FORBID_CONTENTS") ? k({}, a.FORBID_CONTENTS, E) : ft, Ee = Q(a, "FORBID_TAGS") ? k({}, a.FORBID_TAGS, E) : se({}), ot = Q(a, "FORBID_ATTR") ? k({}, a.FORBID_ATTR, E) : se({}), we = Q(a, "USE_PROFILES") ? a.USE_PROFILES : !1, jt = a.ALLOW_ARIA_ATTR !== !1, ct = a.ALLOW_DATA_ATTR !== !1, Vt = a.ALLOW_UNKNOWN_PROTOCOLS || !1, Xt = a.ALLOW_SELF_CLOSE_IN_ATTR !== !1, _e = a.SAFE_FOR_TEMPLATES || !1, Ue = a.SAFE_FOR_XML !== !1, he = a.WHOLE_DOCUMENT || !1, xe = a.RETURN_DOM || !1, He = a.RETURN_DOM_FRAGMENT || !1, Ge = a.RETURN_TRUSTED_TYPE || !1, pt = a.FORCE_BODY || !1, Qt = a.SANITIZE_DOM !== !1, Kt = a.SANITIZE_NAMED_PROPS || !1, ht = a.KEEP_CONTENT !== !1, Re = a.IN_PLACE || !1, qt = a.ALLOWED_URI_REGEXP || qn, Te = a.NAMESPACE || ae, Ye = a.MATHML_TEXT_INTEGRATION_POINTS || Ye, Ze = a.HTML_INTEGRATION_POINTS || Ze, S = a.CUSTOM_ELEMENT_HANDLING || {}, a.CUSTOM_ELEMENT_HANDLING && nn(a.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (S.tagNameCheck = a.CUSTOM_ELEMENT_HANDLING.tagNameCheck), a.CUSTOM_ELEMENT_HANDLING && nn(a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (S.attributeNameCheck = a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), a.CUSTOM_ELEMENT_HANDLING && typeof a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (S.allowCustomizedBuiltInElements = a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), _e && (ct = !1), He && (xe = !0), we && (C = k({}, vn), I = [], we.html === !0 && (k(C, yn), k(I, Sn)), we.svg === !0 && (k(C, yt), k(I, At), k(I, Xe)), we.svgFilters === !0 && (k(C, vt), k(I, At), k(I, Xe)), we.mathMl === !0 && (k(C, St), k(I, An), k(I, Xe))), a.ADD_TAGS && (typeof a.ADD_TAGS == "function" ? be.tagCheck = a.ADD_TAGS : (C === Yt && (C = se(C)), k(C, a.ADD_TAGS, E))), a.ADD_ATTR && (typeof a.ADD_ATTR == "function" ? be.attributeCheck = a.ADD_ATTR : (I === Zt && (I = se(I)), k(I, a.ADD_ATTR, E))), a.ADD_URI_SAFE_ATTR && k(gt, a.ADD_URI_SAFE_ATTR, E), a.FORBID_CONTENTS && (ee === ft && (ee = se(ee)), k(ee, a.FORBID_CONTENTS, E)), a.ADD_FORBID_CONTENTS && (ee === ft && (ee = se(ee)), k(ee, a.ADD_FORBID_CONTENTS, E)), ht && (C["#text"] = !0), he && k(C, ["html", "head", "body"]), C.table && (k(C, ["tbody"]), delete Ee.tbody), a.TRUSTED_TYPES_POLICY) {
        if (typeof a.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Me('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof a.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Me('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        v = a.TRUSTED_TYPES_POLICY, Y = v.createHTML("");
      } else
        v === void 0 && (v = qr(w, t)), v !== null && typeof Y == "string" && (Y = v.createHTML(""));
      F && F(a), ye = a;
    }
  }, sn = k({}, [...yt, ...vt, ...Mr]), rn = k({}, [...St, ...Nr]), os = function(a) {
    let u = R(a);
    (!u || !u.tagName) && (u = {
      namespaceURI: Te,
      tagName: "template"
    });
    const f = Qe(a.tagName), y = Qe(u.tagName);
    return mt[a.namespaceURI] ? a.namespaceURI === qe ? u.namespaceURI === ae ? f === "svg" : u.namespaceURI === We ? f === "svg" && (y === "annotation-xml" || Ye[y]) : !!sn[f] : a.namespaceURI === We ? u.namespaceURI === ae ? f === "math" : u.namespaceURI === qe ? f === "math" && Ze[y] : !!rn[f] : a.namespaceURI === ae ? u.namespaceURI === qe && !Ze[y] || u.namespaceURI === We && !Ye[y] ? !1 : !rn[f] && (rs[f] || !sn[f]) : !!(Ce === "application/xhtml+xml" && mt[a.namespaceURI]) : !1;
  }, te = function(a) {
    Oe(e.removed, {
      element: a
    });
    try {
      R(a).removeChild(a);
    } catch {
      L(a);
    }
  }, fe = function(a, u) {
    try {
      Oe(e.removed, {
        attribute: u.getAttributeNode(a),
        from: u
      });
    } catch {
      Oe(e.removed, {
        attribute: null,
        from: u
      });
    }
    if (u.removeAttribute(a), a === "is")
      if (xe || He)
        try {
          te(u);
        } catch {
        }
      else
        try {
          u.setAttribute(a, "");
        } catch {
        }
  }, an = function(a) {
    let u = null, f = null;
    if (pt)
      a = "<remove></remove>" + a;
    else {
      const A = Tt(a, /^[\r\n\t ]+/);
      f = A && A[0];
    }
    Ce === "application/xhtml+xml" && Te === ae && (a = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + a + "</body></html>");
    const y = v ? v.createHTML(a) : a;
    if (Te === ae)
      try {
        u = new m().parseFromString(y, Ce);
      } catch {
      }
    if (!u || !u.documentElement) {
      u = N.createDocument(Te, "template", null);
      try {
        u.documentElement.innerHTML = dt ? Y : y;
      } catch {
      }
    }
    const M = u.body || u.documentElement;
    return a && f && M.insertBefore(n.createTextNode(f), M.childNodes[0] || null), Te === ae ? Xn.call(u, he ? "html" : "body")[0] : he ? u.documentElement : M;
  }, ln = function(a) {
    return jn.call(
      a.ownerDocument || a,
      a,
      // eslint-disable-next-line no-bitwise
      p.SHOW_ELEMENT | p.SHOW_COMMENT | p.SHOW_TEXT | p.SHOW_PROCESSING_INSTRUCTION | p.SHOW_CDATA_SECTION,
      null
    );
  }, bt = function(a) {
    return a instanceof d && (typeof a.nodeName != "string" || typeof a.textContent != "string" || typeof a.removeChild != "function" || !(a.attributes instanceof h) || typeof a.removeAttribute != "function" || typeof a.setAttribute != "function" || typeof a.namespaceURI != "string" || typeof a.insertBefore != "function" || typeof a.hasChildNodes != "function");
  }, on = function(a) {
    return typeof c == "function" && a instanceof c;
  };
  function ie(g, a, u) {
    Ve(g, (f) => {
      f.call(e, a, u, ye);
    });
  }
  const cn = function(a) {
    let u = null;
    if (ie($.beforeSanitizeElements, a, null), bt(a))
      return te(a), !0;
    const f = E(a.nodeName);
    if (ie($.uponSanitizeElement, a, {
      tagName: f,
      allowedTags: C
    }), Ue && a.hasChildNodes() && !on(a.firstElementChild) && P(/<[/\w!]/g, a.innerHTML) && P(/<[/\w!]/g, a.textContent) || a.nodeType === $e.progressingInstruction || Ue && a.nodeType === $e.comment && P(/<[/\w]/g, a.data))
      return te(a), !0;
    if (!(be.tagCheck instanceof Function && be.tagCheck(f)) && (!C[f] || Ee[f])) {
      if (!Ee[f] && pn(f) && (S.tagNameCheck instanceof RegExp && P(S.tagNameCheck, f) || S.tagNameCheck instanceof Function && S.tagNameCheck(f)))
        return !1;
      if (ht && !ee[f]) {
        const y = R(a) || a.parentNode, M = re(a) || a.childNodes;
        if (M && y) {
          const A = M.length;
          for (let G = A - 1; G >= 0; --G) {
            const le = q(M[G], !0);
            le.__removalCount = (a.__removalCount || 0) + 1, y.insertBefore(le, H(a));
          }
        }
      }
      return te(a), !0;
    }
    return a instanceof o && !os(a) || (f === "noscript" || f === "noembed" || f === "noframes") && P(/<\/no(script|embed|frames)/i, a.innerHTML) ? (te(a), !0) : (_e && a.nodeType === $e.text && (u = a.textContent, Ve([at, it, lt], (y) => {
      u = De(u, y, " ");
    }), a.textContent !== u && (Oe(e.removed, {
      element: a.cloneNode()
    }), a.textContent = u)), ie($.afterSanitizeElements, a, null), !1);
  }, un = function(a, u, f) {
    if (Qt && (u === "id" || u === "name") && (f in n || f in ls))
      return !1;
    if (!(ct && !ot[u] && P(Kn, u))) {
      if (!(jt && P(Jn, u))) {
        if (!(be.attributeCheck instanceof Function && be.attributeCheck(u, a))) {
          if (!I[u] || ot[u]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(pn(a) && (S.tagNameCheck instanceof RegExp && P(S.tagNameCheck, a) || S.tagNameCheck instanceof Function && S.tagNameCheck(a)) && (S.attributeNameCheck instanceof RegExp && P(S.attributeNameCheck, u) || S.attributeNameCheck instanceof Function && S.attributeNameCheck(u, a)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              u === "is" && S.allowCustomizedBuiltInElements && (S.tagNameCheck instanceof RegExp && P(S.tagNameCheck, f) || S.tagNameCheck instanceof Function && S.tagNameCheck(f)))
            ) return !1;
          } else if (!gt[u]) {
            if (!P(qt, De(f, Wt, ""))) {
              if (!((u === "src" || u === "xlink:href" || u === "href") && a !== "script" && Lr(f, "data:") === 0 && Jt[a])) {
                if (!(Vt && !P(es, De(f, Wt, "")))) {
                  if (f)
                    return !1;
                }
              }
            }
          }
        }
      }
    }
    return !0;
  }, pn = function(a) {
    return a !== "annotation-xml" && Tt(a, ts);
  }, hn = function(a) {
    ie($.beforeSanitizeAttributes, a, null);
    const {
      attributes: u
    } = a;
    if (!u || bt(a))
      return;
    const f = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: I,
      forceKeepAttr: void 0
    };
    let y = u.length;
    for (; y--; ) {
      const M = u[y], {
        name: A,
        namespaceURI: G,
        value: le
      } = M, ve = E(A), _t = le;
      let O = A === "value" ? _t : Ir(_t);
      if (f.attrName = ve, f.attrValue = O, f.keepAttr = !0, f.forceKeepAttr = void 0, ie($.uponSanitizeAttribute, a, f), O = f.attrValue, Kt && (ve === "id" || ve === "name") && (fe(A, a), O = ns + O), Ue && P(/((--!?|])>)|<\/(style|title|textarea)/i, O)) {
        fe(A, a);
        continue;
      }
      if (ve === "attributename" && Tt(O, "href")) {
        fe(A, a);
        continue;
      }
      if (f.forceKeepAttr)
        continue;
      if (!f.keepAttr) {
        fe(A, a);
        continue;
      }
      if (!Xt && P(/\/>/i, O)) {
        fe(A, a);
        continue;
      }
      _e && Ve([at, it, lt], (gn) => {
        O = De(O, gn, " ");
      });
      const fn = E(a.nodeName);
      if (!un(fn, ve, O)) {
        fe(A, a);
        continue;
      }
      if (v && typeof w == "object" && typeof w.getAttributeType == "function" && !G)
        switch (w.getAttributeType(fn, ve)) {
          case "TrustedHTML": {
            O = v.createHTML(O);
            break;
          }
          case "TrustedScriptURL": {
            O = v.createScriptURL(O);
            break;
          }
        }
      if (O !== _t)
        try {
          G ? a.setAttributeNS(G, A, O) : a.setAttribute(A, O), bt(a) ? te(a) : Tn(e.removed);
        } catch {
          fe(A, a);
        }
    }
    ie($.afterSanitizeAttributes, a, null);
  }, cs = function g(a) {
    let u = null;
    const f = ln(a);
    for (ie($.beforeSanitizeShadowDOM, a, null); u = f.nextNode(); )
      ie($.uponSanitizeShadowNode, u, null), cn(u), hn(u), u.content instanceof i && g(u.content);
    ie($.afterSanitizeShadowDOM, a, null);
  };
  return e.sanitize = function(g) {
    let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, f = null, y = null, M = null;
    if (dt = !g, dt && (g = "<!-->"), typeof g != "string" && !on(g))
      if (typeof g.toString == "function") {
        if (g = g.toString(), typeof g != "string")
          throw Me("dirty is not a string, aborting");
      } else
        throw Me("toString is not a function");
    if (!e.isSupported)
      return g;
    if (ut || kt(a), e.removed = [], typeof g == "string" && (Re = !1), Re) {
      if (g.nodeName) {
        const le = E(g.nodeName);
        if (!C[le] || Ee[le])
          throw Me("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (g instanceof c)
      u = an("<!---->"), f = u.ownerDocument.importNode(g, !0), f.nodeType === $e.element && f.nodeName === "BODY" || f.nodeName === "HTML" ? u = f : u.appendChild(f);
    else {
      if (!xe && !_e && !he && // eslint-disable-next-line unicorn/prefer-includes
      g.indexOf("<") === -1)
        return v && Ge ? v.createHTML(g) : g;
      if (u = an(g), !u)
        return xe ? null : Ge ? Y : "";
    }
    u && pt && te(u.firstChild);
    const A = ln(Re ? g : u);
    for (; y = A.nextNode(); )
      cn(y), hn(y), y.content instanceof i && cs(y.content);
    if (Re)
      return g;
    if (xe) {
      if (He)
        for (M = Vn.call(u.ownerDocument); u.firstChild; )
          M.appendChild(u.firstChild);
      else
        M = u;
      return (I.shadowroot || I.shadowrootmode) && (M = Qn.call(r, M, !0)), M;
    }
    let G = he ? u.outerHTML : u.innerHTML;
    return he && C["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && P(Yn, u.ownerDocument.doctype.name) && (G = "<!DOCTYPE " + u.ownerDocument.doctype.name + `>
` + G), _e && Ve([at, it, lt], (le) => {
      G = De(G, le, " ");
    }), v && Ge ? v.createHTML(G) : G;
  }, e.setConfig = function() {
    let g = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    kt(g), ut = !0;
  }, e.clearConfig = function() {
    ye = null, ut = !1;
  }, e.isValidAttribute = function(g, a, u) {
    ye || kt({});
    const f = E(g), y = E(a);
    return un(f, y, u);
  }, e.addHook = function(g, a) {
    typeof a == "function" && Oe($[g], a);
  }, e.removeHook = function(g, a) {
    if (a !== void 0) {
      const u = Rr($[g], a);
      return u === -1 ? void 0 : Cr($[g], u, 1)[0];
    }
    return Tn($[g]);
  }, e.removeHooks = function(g) {
    $[g] = [];
  }, e.removeAllHooks = function() {
    $ = Rn();
  }, e;
}
var Yr = Zn();
const Zr = {}, jr = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Vr(s, e) {
  return T(), D("svg", jr, [...e[0] || (e[0] = [
    V("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }, null, -1)
  ])]);
}
const Xr = /* @__PURE__ */ j(Zr, [["render", Vr]]), Qr = {}, Kr = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Jr(s, e) {
  return T(), D("svg", Kr, [...e[0] || (e[0] = [
    V("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" }, null, -1)
  ])]);
}
const ea = /* @__PURE__ */ j(Qr, [["render", Jr]]), ta = ["aria-label"], na = { class: "nc-message-bubble__header" }, sa = {
  key: 0,
  class: "nc-message-bubble__label"
}, ra = { class: "nc-message-bubble__bubble" }, aa = {
  key: 0,
  class: "nc-message-bubble__content"
}, ia = ["innerHTML"], la = ["aria-label"], oa = /* @__PURE__ */ pe({
  __name: "MessageBubble",
  props: {
    message: {}
  },
  setup(s) {
    const e = s, n = W(() => e.message.role === "user"), r = W(
      () => e.message.status === "failed" || e.message.id.startsWith("error-")
    ), t = W(() => e.message.status === "sending"), i = W(() => e.message.role === "assistant" && !r.value), l = W(() => {
      if (e.message.role !== "assistant" || r.value) return null;
      const d = x.parse(e.message.content);
      return Yr.sanitize(d);
    }), c = W(() => r.value ? "Error message" : n.value ? "Message from you" : "Message from AI Assistant"), o = z(!1);
    let p = null;
    async function h() {
      try {
        await navigator.clipboard.writeText(e.message.content), o.value = !0, p && clearTimeout(p), p = setTimeout(() => {
          o.value = !1;
        }, 1500);
      } catch {
      }
    }
    return Ln(() => {
      p && clearTimeout(p);
    }), (d, m) => (T(), D("li", {
      role: "listitem",
      "aria-label": c.value,
      class: Dt(["nc-message-bubble", {
        "nc-message-bubble--user": n.value,
        "nc-message-bubble--assistant": i.value,
        "nc-message-bubble--error": r.value,
        "nc-message-bubble--sending": t.value
      }])
    }, [
      V("div", na, [
        n.value ? (T(), D("span", sa, "You")) : (T(), D(In, { key: 1 }, [
          Z(Mt, { class: "nc-message-bubble__star" }),
          m[0] || (m[0] = V("span", { class: "nc-message-bubble__label" }, "AI Assistant", -1))
        ], 64))
      ]),
      V("div", ra, [
        n.value || r.value ? (T(), D("div", aa, Cn(s.message.content), 1)) : (T(), D("div", {
          key: 1,
          class: "nc-message-bubble__content",
          innerHTML: l.value
        }, null, 8, ia))
      ]),
      i.value ? (T(), D("button", {
        key: 0,
        class: "nc-message-bubble__copy",
        "aria-label": o.value ? "Message copied" : "Copy message",
        onClick: h
      }, [
        o.value ? (T(), ce(ea, { key: 0 })) : (T(), ce(Xr, { key: 1 }))
      ], 8, la)) : us("", !0)
    ], 10, ta));
  }
}), ca = /* @__PURE__ */ j(oa, [["__scopeId", "data-v-865393c4"]]), ua = 50, pa = /* @__PURE__ */ pe({
  __name: "MessageList",
  setup(s) {
    const e = ue(Ae), n = z(null), r = z(!0);
    function t() {
      const c = n.value;
      if (!c) return;
      const { scrollTop: o, scrollHeight: p, clientHeight: h } = c;
      r.value = p - o - h <= ua;
    }
    function i() {
      const c = n.value;
      c && (c.scrollTop = c.scrollHeight);
    }
    function l() {
      t();
    }
    return ze(
      () => e.messages.value,
      () => {
        r.value && Ke(i);
      }
    ), ps(() => {
      e.messages.value.length > 0 && Ke(i), n.value?.addEventListener("scroll", l, { passive: !0 });
    }), Ln(() => {
      n.value?.removeEventListener("scroll", l);
    }), (c, o) => (T(), D("ul", {
      ref_key: "listRef",
      ref: n,
      role: "list",
      "aria-live": "polite",
      class: "nc-message-list"
    }, [
      (T(!0), D(In, null, hs(de(e).messages.value, (p) => (T(), ce(ca, {
        key: p.id,
        message: p
      }, null, 8, ["message"]))), 128))
    ], 512));
  }
}), ha = /* @__PURE__ */ j(pa, [["__scopeId", "data-v-74b00022"]]), fa = {}, ga = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function da(s, e) {
  return T(), D("svg", ga, [...e[0] || (e[0] = [
    V("path", { d: "M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91Z" }, null, -1)
  ])]);
}
const ma = /* @__PURE__ */ j(fa, [["render", da]]), ka = { class: "nc-chat-input" }, ba = /* @__PURE__ */ pe({
  __name: "ChatInput",
  setup(s) {
    const e = ue(Ae), n = z(""), r = z(null), t = W(() => n.value.trim().length > 0 && !e.isSending.value);
    async function i() {
      const c = n.value.trim();
      if (!(!c || e.isSending.value)) {
        n.value = "";
        try {
          await e.sendMessage(c);
        } catch {
        }
      }
    }
    function l(c) {
      c.key === "Enter" && !c.shiftKey && (c.preventDefault(), i());
    }
    return ze(
      () => e.failedMessageText.value,
      (c) => {
        c && (n.value = c);
      }
    ), ze(
      () => e.isSending.value,
      (c, o) => {
        o && !c && Ke(() => {
          r.value?.focus();
        });
      }
    ), (c, o) => {
      const p = oe("v-textarea"), h = oe("v-btn");
      return T(), D("div", ka, [
        Z(p, {
          ref_key: "textareaRef",
          ref: r,
          modelValue: n.value,
          "onUpdate:modelValue": o[0] || (o[0] = (d) => n.value = d),
          "auto-grow": "",
          rows: 1,
          "max-rows": 6,
          "no-resize": "",
          "hide-details": "",
          variant: "outlined",
          density: "compact",
          placeholder: "Type a message",
          "aria-label": "Type a message",
          disabled: de(e).isSending.value,
          class: "nc-chat-input__textarea",
          onKeydown: l
        }, null, 8, ["modelValue", "disabled"]),
        Z(h, {
          icon: "",
          variant: "flat",
          color: "secondary",
          size: "small",
          disabled: !t.value,
          "aria-label": "Send message",
          class: "nc-chat-input__send-btn",
          onClick: i
        }, {
          default: Be(() => [
            Z(ma)
          ]),
          _: 1
        }, 8, ["disabled"])
      ]);
    };
  }
}), _a = /* @__PURE__ */ j(ba, [["__scopeId", "data-v-53781acb"]]), xa = { class: "nc-chat-panel__body" }, wa = /* @__PURE__ */ pe({
  __name: "ChatPanel",
  setup(s) {
    const e = ue(Ae), n = W({
      get: () => e.isOpen.value,
      set: () => {
      }
    }), r = ue(nt), t = W(() => r?.welcomeMessage), i = ds(), l = W(() => i.width.value < 768), c = W(() => l.value ? "100%" : 400), o = (p) => {
      p.key === "Escape" && e.isOpen.value && e.close();
    };
    return ze(
      () => e.isOpen.value,
      (p) => {
        p ? window.addEventListener("keydown", o) : window.removeEventListener("keydown", o);
      },
      { immediate: !0 }
    ), fs(() => {
      window.removeEventListener("keydown", o);
    }), (p, h) => {
      const d = oe("v-progress-circular"), m = oe("v-navigation-drawer");
      return T(), ce(m, {
        modelValue: n.value,
        "onUpdate:modelValue": h[0] || (h[0] = (w) => n.value = w),
        location: "right",
        temporary: "",
        scrim: !1,
        width: c.value,
        role: "complementary",
        "aria-label": "Chat with AI Assistant",
        class: Dt(["nc-chat-panel", { "nc-chat-panel--mobile": l.value }])
      }, {
        default: Be(() => [
          Z(Is),
          V("div", xa, [
            de(e).isLoading.value && de(e).messages.value.length === 0 ? (T(), ce(d, {
              key: 0,
              indeterminate: "",
              size: "24",
              class: "nc-chat-panel__loader"
            })) : de(e).messages.value.length === 0 && !de(e).isSending.value ? (T(), ce(Ns, {
              key: 1,
              message: t.value
            }, null, 8, ["message"])) : (T(), ce(ha, { key: 2 }))
          ]),
          Z(_a)
        ]),
        _: 1
      }, 8, ["modelValue", "width", "class"]);
    };
  }
}), Ta = /* @__PURE__ */ j(wa, [["__scopeId", "data-v-c922c155"]]), ya = /* @__PURE__ */ pe({
  __name: "NativeChatWidget",
  setup(s) {
    const e = ms();
    if (!e.themes.value.nativeChat) {
      const i = e.themes.value.light;
      e.themes.value.nativeChat = {
        ...i,
        ...xt,
        colors: {
          ...i.colors,
          ...xt.colors
        },
        variables: {
          ...i.variables,
          ...xt.variables
        }
      };
    }
    const n = ue(nt), r = bs(n.apiClient, n);
    gs(Ae, r);
    const t = z(null);
    return ze(
      () => r.isOpen.value,
      (i) => {
        i || Ke(() => {
          t.value?.focus();
        });
      }
    ), (i, l) => {
      const c = oe("v-theme-provider");
      return T(), ce(c, { theme: "nativeChat" }, {
        default: Be(() => [
          Z(ys, {
            ref_key: "floatingButtonRef",
            ref: t
          }, null, 512),
          Z(Ta)
        ]),
        _: 1
      });
    };
  }
}), va = /* @__PURE__ */ j(ya, [["__scopeId", "data-v-24f8c4a9"]]), Ea = {
  install(s, e) {
    if (!e?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    s.provide(nt, e), s.component("NativeChatWidget", va);
  }
};
function Ra(s) {
  const { baseUrl: e, getAccessToken: n } = s;
  async function r(t, i = {}) {
    const c = {
      Authorization: `Bearer ${await n()}`
    };
    i.body && (c["Content-Type"] = "application/json");
    const o = await fetch(t, { ...i, headers: c });
    if (!o.ok) {
      const p = new Error(`HTTP ${o.status}: ${o.statusText}`);
      throw p.statusCode = o.status, p;
    }
    return o.json();
  }
  return {
    createConversation() {
      return r(`${e}/conversations`, { method: "POST" });
    },
    getConversations(t, i) {
      return r(`${e}/conversations?offset=${t}&limit=${i}`);
    },
    getMessages(t, i, l) {
      return r(
        `${e}/conversations/${encodeURIComponent(t)}/messages?offset=${i}&limit=${l}`
      );
    },
    sendMessage(t, i) {
      return r(`${e}/conversations/${encodeURIComponent(t)}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: i })
      });
    }
  };
}
export {
  Ea as NativeChatPlugin,
  va as NativeChatWidget,
  Ra as createNativeChatApiClient,
  Ea as default
};
