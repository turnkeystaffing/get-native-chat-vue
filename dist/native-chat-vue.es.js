import { ref as Q, readonly as Ae, openBlock as T, createElementBlock as L, createElementVNode as Y, defineComponent as pe, inject as ue, computed as j, useTemplateRef as nt, resolveComponent as re, normalizeClass as $t, createVNode as H, withCtx as de, unref as oe, toDisplayString as Mn, onBeforeUnmount as On, Fragment as Dn, createCommentVNode as Ct, createBlock as ce, watch as Ee, nextTick as Re, onMounted as hs, renderList as fs, onUnmounted as gs, Teleport as ds, provide as ms } from "vue";
import { useDisplay as ks, useTheme as bs } from "vuetify";
const st = /* @__PURE__ */ Symbol("native-chat-config"), Ce = /* @__PURE__ */ Symbol("native-chat-state");
function _s(s) {
  if (s && typeof s == "object" && "statusCode" in s) {
    const e = s.statusCode;
    if (e === 429)
      return "You're sending messages too quickly. Please wait a moment and try again.";
    if (e === 503 || e === 504)
      return "The service is temporarily unavailable. Please try again in a moment.";
  }
  return "Something went wrong. You can try sending your message again.";
}
function xs(s, e) {
  const n = Q([]), r = Q(!1), t = Q(!1), i = Q(!1), l = Q(!1), c = Q(null), o = Q(null), p = Q(0), h = e.batchSize ?? 20;
  function d(v, I, W) {
    n.value = n.value.filter((F) => F.id !== W && !F.id.startsWith("error-"));
    const x = _s(v), q = {
      id: `error-${Date.now()}`,
      conversationId: o.value ?? "",
      role: "assistant",
      content: x,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "failed"
    };
    if (n.value = [...n.value, q], c.value = null, c.value = I, e.onError)
      try {
        Promise.resolve(
          e.onError({
            message: x,
            statusCode: v && typeof v == "object" && "statusCode" in v ? v.statusCode : void 0,
            originalError: v
          })
        ).catch(() => {
        });
      } catch {
      }
  }
  async function m() {
    if (!(r.value || t.value)) {
      t.value = !0;
      try {
        if (e.conversationId)
          o.value = e.conversationId;
        else {
          const W = await s.getConversations(0, 1);
          if (W.conversations.length > 0)
            o.value = W.conversations[0].id;
          else {
            const x = await s.createConversation();
            o.value = x.id;
          }
        }
        const v = await s.getMessages(o.value, 0, h), I = [...v.messages].reverse();
        n.value = I, l.value = v.has_more, p.value = I.length;
      } catch {
      } finally {
        t.value = !1, r.value = !0;
      }
    }
  }
  function y() {
    r.value = !1;
  }
  async function _(v) {
    if (!v.trim() || i.value) return;
    i.value = !0;
    const I = `temp-${Date.now()}`, W = {
      id: I,
      conversationId: o.value ?? "",
      role: "user",
      content: v,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sending"
    };
    if (n.value = [...n.value, W], !o.value)
      try {
        const x = await s.createConversation();
        o.value = x.id;
      } catch (x) {
        d(x, v, I), i.value = !1;
        return;
      }
    try {
      const x = await s.sendMessage(o.value, v), q = {
        ...x.userMessage,
        status: "sent"
      }, F = {
        ...x.assistantMessage
      };
      n.value = [
        ...n.value.filter((it) => it.id !== I),
        q,
        F
      ], c.value = null;
    } catch (x) {
      d(x, v, I);
    } finally {
      i.value = !1;
    }
  }
  async function G() {
    if (!(!l.value || t.value || !o.value)) {
      t.value = !0;
      try {
        const v = await s.getMessages(
          o.value,
          p.value,
          h
        ), I = [...v.messages].reverse();
        n.value = [...I, ...n.value], p.value += I.length, l.value = v.has_more;
      } catch {
      } finally {
        t.value = !1;
      }
    }
  }
  async function be() {
    if (!c.value) return;
    const v = c.value;
    c.value = null, await _(v);
  }
  return {
    messages: Ae(n),
    isOpen: Ae(r),
    isLoading: Ae(t),
    isSending: Ae(i),
    hasMore: Ae(l),
    failedMessageText: Ae(c),
    open: m,
    close: y,
    sendMessage: _,
    loadMore: G,
    retry: be
  };
}
const Tt = {
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
}, Z = (s, e) => {
  const n = s.__vccOpts || s;
  for (const [r, t] of e)
    n[r] = t;
  return n;
}, ws = {}, Ts = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ys(s, e) {
  return T(), L("svg", Ts, [...e[0] || (e[0] = [
    Y("path", { d: "M12 1c.4 0 .7.3.9.7l2.2 5.8 5.8 2.2c.4.2.7.5.7.9s-.3.7-.7.9l-5.8 2.2-2.2 5.8c-.2.4-.5.7-.9.7s-.7-.3-.9-.7l-2.2-5.8-5.8-2.2c-.4-.2-.7-.5-.7-.9s.3-.7.7-.9l5.8-2.2 2.2-5.8c.2-.4.5-.7.9-.7Z" }, null, -1)
  ])]);
}
const Pt = /* @__PURE__ */ Z(ws, [["render", ys]]), vs = /* @__PURE__ */ pe({
  __name: "FloatingButton",
  setup(s, { expose: e }) {
    const n = ue(st), r = ue(Ce), t = j(() => r.isOpen.value), i = j(() => n?.position ?? "bottom-right"), l = j(
      () => `nc-floating-button-wrapper--${i.value === "bottom-left" ? "left" : "right"}`
    );
    function c() {
      r.isOpen.value ? r.close() : r.open();
    }
    const o = nt("triggerBtn");
    function p() {
      o.value?.$el?.focus();
    }
    return e({ focus: p }), (h, d) => {
      const m = re("v-icon"), y = re("v-btn");
      return T(), L("div", {
        class: $t(["nc-floating-button-wrapper", l.value])
      }, [
        H(y, {
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
          default: de(() => [
            H(m, {
              icon: Pt,
              color: "white"
            })
          ]),
          _: 1
        }, 8, ["aria-label", "aria-expanded"])
      ], 2);
    };
  }
}), Ss = /* @__PURE__ */ Z(vs, [["__scopeId", "data-v-a57cf6f6"]]), As = {}, Es = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Rs(s, e) {
  return T(), L("svg", Es, [...e[0] || (e[0] = [
    Y("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, null, -1)
  ])]);
}
const Cs = /* @__PURE__ */ Z(As, [["render", Rs]]), Ls = { class: "nc-chat-header" }, Is = { class: "nc-chat-header__left" }, Ms = /* @__PURE__ */ pe({
  __name: "ChatHeader",
  setup(s) {
    const e = ue(Ce);
    return (n, r) => {
      const t = re("v-icon"), i = re("v-btn");
      return T(), L("div", Ls, [
        Y("div", Is, [
          H(t, {
            icon: Pt,
            color: "secondary",
            size: "20"
          }),
          r[1] || (r[1] = Y("span", { class: "nc-chat-header__title" }, "AI Assistant", -1))
        ]),
        H(i, {
          icon: "",
          variant: "text",
          size: "small",
          "aria-label": "Close chat",
          onClick: r[0] || (r[0] = (l) => oe(e).close())
        }, {
          default: de(() => [
            H(t, {
              icon: Cs,
              size: "18"
            })
          ]),
          _: 1
        })
      ]);
    };
  }
}), Os = /* @__PURE__ */ Z(Ms, [["__scopeId", "data-v-f89f9f15"]]), Ds = { class: "nc-welcome-state" }, Ns = { class: "nc-welcome-state__text" }, $s = /* @__PURE__ */ pe({
  __name: "WelcomeState",
  props: {
    message: {}
  },
  setup(s) {
    return (e, n) => (T(), L("div", Ds, [
      Y("p", Ns, Mn(s.message ?? "Hello! How can I help you?"), 1)
    ]));
  }
}), Ps = /* @__PURE__ */ Z($s, [["__scopeId", "data-v-6d3eccea"]]);
function zt() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ke = zt();
function Nn(s) {
  ke = s;
}
var ge = { exec: () => null };
function b(s, e = "") {
  let n = typeof s == "string" ? s : s.source, r = { replace: (t, i) => {
    let l = typeof i == "string" ? i : i.source;
    return l = l.replace(P.caret, "$1"), n = n.replace(t, l), r;
  }, getRegex: () => new RegExp(n, e) };
  return r;
}
var zs = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), P = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}>`) }, Bs = /^(?:[ \t]*(?:\n|$))+/, Fs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Us = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ue = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Hs = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Bt = / {0,3}(?:[*+-]|\d{1,9}[.)])/, $n = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Pn = b($n).replace(/bull/g, Bt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Gs = b($n).replace(/bull/g, Bt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Ft = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Ws = /^[^\n]+/, Ut = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, qs = b(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ut).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ys = b(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Bt).getRegex(), rt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ht = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Zs = b("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Ht).replace("tag", rt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), zn = b(Ft).replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex(), js = b(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", zn).getRegex(), Gt = { blockquote: js, code: Fs, def: qs, fences: Us, heading: Hs, hr: Ue, html: Zs, lheading: Pn, list: Ys, newline: Bs, paragraph: zn, table: ge, text: Ws }, bn = b("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex(), Vs = { ...Gt, lheading: Gs, table: bn, paragraph: b(Ft).replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", bn).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex() }, Xs = { ...Gt, html: b(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Ht).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ge, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: b(Ft).replace("hr", Ue).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Pn).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Qs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ks = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Bn = /^( {2,}|\\)\n(?!\s*$)/, Js = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, at = /[\p{P}\p{S}]/u, Wt = /[\s\p{P}\p{S}]/u, Fn = /[^\s\p{P}\p{S}]/u, er = b(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Wt).getRegex(), Un = /(?!~)[\p{P}\p{S}]/u, tr = /(?!~)[\s\p{P}\p{S}]/u, nr = /(?:[^\s\p{P}\p{S}]|~)/u, Hn = /(?![*_])[\p{P}\p{S}]/u, sr = /(?![*_])[\s\p{P}\p{S}]/u, rr = /(?:[^\s\p{P}\p{S}]|[*_])/u, ar = b(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", zs ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Gn = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ir = b(Gn, "u").replace(/punct/g, at).getRegex(), lr = b(Gn, "u").replace(/punct/g, Un).getRegex(), Wn = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", or = b(Wn, "gu").replace(/notPunctSpace/g, Fn).replace(/punctSpace/g, Wt).replace(/punct/g, at).getRegex(), cr = b(Wn, "gu").replace(/notPunctSpace/g, nr).replace(/punctSpace/g, tr).replace(/punct/g, Un).getRegex(), ur = b("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Fn).replace(/punctSpace/g, Wt).replace(/punct/g, at).getRegex(), pr = b(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Hn).getRegex(), hr = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", fr = b(hr, "gu").replace(/notPunctSpace/g, rr).replace(/punctSpace/g, sr).replace(/punct/g, Hn).getRegex(), gr = b(/\\(punct)/, "gu").replace(/punct/g, at).getRegex(), dr = b(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), mr = b(Ht).replace("(?:-->|$)", "-->").getRegex(), kr = b("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", mr).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Je = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, br = b(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Je).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), qn = b(/^!?\[(label)\]\[(ref)\]/).replace("label", Je).replace("ref", Ut).getRegex(), Yn = b(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ut).getRegex(), _r = b("reflink|nolink(?!\\()", "g").replace("reflink", qn).replace("nolink", Yn).getRegex(), _n = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, qt = { _backpedal: ge, anyPunctuation: gr, autolink: dr, blockSkip: ar, br: Bn, code: Ks, del: ge, delLDelim: ge, delRDelim: ge, emStrongLDelim: ir, emStrongRDelimAst: or, emStrongRDelimUnd: ur, escape: Qs, link: br, nolink: Yn, punctuation: er, reflink: qn, reflinkSearch: _r, tag: kr, text: Js, url: ge }, xr = { ...qt, link: b(/^!?\[(label)\]\((.*?)\)/).replace("label", Je).getRegex(), reflink: b(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Je).getRegex() }, Lt = { ...qt, emStrongRDelimAst: cr, emStrongLDelim: lr, delLDelim: pr, delRDelim: fr, url: b(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", _n).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: b(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", _n).getRegex() }, wr = { ...Lt, br: b(Bn).replace("{2,}", "*").getRegex(), text: b(Lt.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Ve = { normal: Gt, gfm: Vs, pedantic: Xs }, Oe = { normal: qt, gfm: Lt, breaks: wr, pedantic: xr }, Tr = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, xn = (s) => Tr[s];
function ne(s, e) {
  if (e) {
    if (P.escapeTest.test(s)) return s.replace(P.escapeReplace, xn);
  } else if (P.escapeTestNoEncode.test(s)) return s.replace(P.escapeReplaceNoEncode, xn);
  return s;
}
function wn(s) {
  try {
    s = encodeURI(s).replace(P.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function Tn(s, e) {
  let n = s.replace(P.findPipe, (i, l, c) => {
    let o = !1, p = l;
    for (; --p >= 0 && c[p] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), r = n.split(P.splitPipe), t = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; t < r.length; t++) r[t] = r[t].trim().replace(P.slashPipe, "|");
  return r;
}
function De(s, e, n) {
  let r = s.length;
  if (r === 0) return "";
  let t = 0;
  for (; t < r && s.charAt(r - t - 1) === e; )
    t++;
  return s.slice(0, r - t);
}
function yr(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let r = 0; r < s.length; r++) if (s[r] === "\\") r++;
  else if (s[r] === e[0]) n++;
  else if (s[r] === e[1] && (n--, n < 0)) return r;
  return n > 0 ? -2 : -1;
}
function vr(s, e = 0) {
  let n = e, r = "";
  for (let t of s) if (t === "	") {
    let i = 4 - n % 4;
    r += " ".repeat(i), n += i;
  } else r += t, n++;
  return r;
}
function yn(s, e, n, r, t) {
  let i = e.href, l = e.title || null, c = s[1].replace(t.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let o = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: n, href: i, title: l, text: c, tokens: r.inlineTokens(c) };
  return r.state.inLink = !1, o;
}
function Sr(s, e, n) {
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
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : De(n, `
`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let n = e[0], r = Sr(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r = De(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: De(e[0], `
`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let n = De(e[0], `
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
          let y = m, _ = y.raw + `
` + n.join(`
`), G = this.blockquote(_);
          i[i.length - 1] = G, r = r.substring(0, r.length - y.raw.length) + G.raw, t = t.substring(0, t.length - y.text.length) + G.text;
          break;
        } else if (m?.type === "list") {
          let y = m, _ = y.raw + `
` + n.join(`
`), G = this.list(_);
          i[i.length - 1] = G, r = r.substring(0, r.length - m.raw.length) + G.raw, t = t.substring(0, t.length - y.raw.length) + G.raw, n = _.substring(i.at(-1).raw.length).split(`
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
        let d = vr(e[2].split(`
`, 1)[0], e[1].length), m = s.split(`
`, 1)[0], y = !d.trim(), _ = 0;
        if (this.options.pedantic ? (_ = 2, h = d.trimStart()) : y ? _ = e[1].length + 1 : (_ = d.search(this.rules.other.nonSpaceChar), _ = _ > 4 ? 1 : _, h = d.slice(_), _ += e[1].length), y && this.rules.other.blankLine.test(m) && (p += m + `
`, s = s.substring(m.length + 1), o = !0), !o) {
          let G = this.rules.other.nextBulletRegex(_), be = this.rules.other.hrRegex(_), v = this.rules.other.fencesBeginRegex(_), I = this.rules.other.headingBeginRegex(_), W = this.rules.other.htmlBeginRegex(_), x = this.rules.other.blockquoteBeginRegex(_);
          for (; s; ) {
            let q = s.split(`
`, 1)[0], F;
            if (m = q, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), F = m) : F = m.replace(this.rules.other.tabCharGlobal, "    "), v.test(m) || I.test(m) || W.test(m) || x.test(m) || G.test(m) || be.test(m)) break;
            if (F.search(this.rules.other.nonSpaceChar) >= _ || !m.trim()) h += `
` + F.slice(_);
            else {
              if (y || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || v.test(d) || I.test(d) || be.test(d)) break;
              h += `
` + m;
            }
            y = !m.trim(), p += q + `
`, s = s.substring(q.length + 1), d = F.slice(_);
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
    let n = Tn(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let l of r) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < n.length; l++) i.header.push({ text: n[l], tokens: this.lexer.inline(n[l]), header: !0, align: i.align[l] });
      for (let l of t) i.rows.push(Tn(l, i.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: i.align[o] })));
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
        let i = De(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = yr(e[2], "()");
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
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), yn(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
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
      return yn(n, t, n[0], this.lexer, this.rules);
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
          let y = d.slice(1, -1);
          return { type: "em", raw: d, text: y, tokens: this.lexer.inlineTokens(y) };
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
}, K = class It {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ke, this.options.tokenizer = this.options.tokenizer || new et(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: P, block: Ve.normal, inline: Oe.normal };
    this.options.pedantic ? (n.block = Ve.pedantic, n.inline = Oe.pedantic) : this.options.gfm && (n.block = Ve.gfm, this.options.breaks ? n.inline = Oe.breaks : n.inline = Oe.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Ve, inline: Oe };
  }
  static lex(e, n) {
    return new It(n).lex(e);
  }
  static lexInline(e, n) {
    return new It(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(P.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let r = this.inlineQueue[n];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], r = !1) {
    for (this.options.pedantic && (e = e.replace(P.tabCharGlobal, "    ").replace(P.spaceLine, "")); e; ) {
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
        this.options.extensions.startInline.forEach((y) => {
          m = y.call({ lexer: this }, d), typeof m == "number" && m >= 0 && (h = Math.min(h, m));
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
    let r = (e || "").match(P.notSpaceStart)?.[0], t = s.replace(P.endingNewline, "") + `
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
    let r = this.parser.parseInline(n), t = wn(s);
    if (t === null) return r;
    s = t;
    let i = '<a href="' + s + '"';
    return e && (i += ' title="' + ne(e) + '"'), i += ">" + r + "</a>", i;
  }
  image({ href: s, title: e, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let t = wn(s);
    if (t === null) return ne(n);
    s = t;
    let i = `<img src="${s}" alt="${ne(n)}"`;
    return e && (i += ` title="${ne(e)}"`), i += ">", i;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : ne(s.text);
  }
}, Yt = class {
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
}, J = class Mt {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || ke, this.options.renderer = this.options.renderer || new tt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Yt();
  }
  static parse(e, n) {
    return new Mt(n).parse(e);
  }
  static parseInline(e, n) {
    return new Mt(n).parseInline(e);
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
}, Fe = class {
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
}, Ar = class {
  defaults = zt();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = J;
  Renderer = tt;
  TextRenderer = Yt;
  Lexer = K;
  Tokenizer = et;
  Hooks = Fe;
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
        let t = this.defaults.hooks || new Fe();
        for (let i in n.hooks) {
          if (!(i in t)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let l = i, c = n.hooks[l], o = t[l];
          Fe.passThroughHooks.has(i) ? t[l] = (p) => {
            if (this.defaults.async && Fe.passThroughHooksRespectAsync.has(i)) return (async () => {
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
}, me = new Ar();
function w(s, e) {
  return me.parse(s, e);
}
w.options = w.setOptions = function(s) {
  return me.setOptions(s), w.defaults = me.defaults, Nn(w.defaults), w;
};
w.getDefaults = zt;
w.defaults = ke;
w.use = function(...s) {
  return me.use(...s), w.defaults = me.defaults, Nn(w.defaults), w;
};
w.walkTokens = function(s, e) {
  return me.walkTokens(s, e);
};
w.parseInline = me.parseInline;
w.Parser = J;
w.parser = J.parse;
w.Renderer = tt;
w.TextRenderer = Yt;
w.Lexer = K;
w.lexer = K.lex;
w.Tokenizer = et;
w.Hooks = Fe;
w.parse = w;
w.options;
w.setOptions;
w.use;
w.walkTokens;
w.parseInline;
J.parse;
K.lex;
const {
  entries: Zn,
  setPrototypeOf: vn,
  isFrozen: Er,
  getPrototypeOf: Rr,
  getOwnPropertyDescriptor: Cr
} = Object;
let {
  freeze: z,
  seal: V,
  create: Ot
} = Object, {
  apply: Dt,
  construct: Nt
} = typeof Reflect < "u" && Reflect;
z || (z = function(e) {
  return e;
});
V || (V = function(e) {
  return e;
});
Dt || (Dt = function(e, n) {
  for (var r = arguments.length, t = new Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++)
    t[i - 2] = arguments[i];
  return e.apply(n, t);
});
Nt || (Nt = function(e) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
    r[t - 1] = arguments[t];
  return new e(...r);
});
const Xe = B(Array.prototype.forEach), Lr = B(Array.prototype.lastIndexOf), Sn = B(Array.prototype.pop), Ne = B(Array.prototype.push), Ir = B(Array.prototype.splice), Ke = B(String.prototype.toLowerCase), yt = B(String.prototype.toString), vt = B(String.prototype.match), $e = B(String.prototype.replace), Mr = B(String.prototype.indexOf), Or = B(String.prototype.trim), X = B(Object.prototype.hasOwnProperty), $ = B(RegExp.prototype.test), Pe = Dr(TypeError);
function B(s) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
      r[t - 1] = arguments[t];
    return Dt(s, e, r);
  };
}
function Dr(s) {
  return function() {
    for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
      n[r] = arguments[r];
    return Nt(s, n);
  };
}
function k(s, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ke;
  vn && vn(s, null);
  let r = e.length;
  for (; r--; ) {
    let t = e[r];
    if (typeof t == "string") {
      const i = n(t);
      i !== t && (Er(e) || (e[r] = i), t = i);
    }
    s[t] = !0;
  }
  return s;
}
function Nr(s) {
  for (let e = 0; e < s.length; e++)
    X(s, e) || (s[e] = null);
  return s;
}
function se(s) {
  const e = Ot(null);
  for (const [n, r] of Zn(s))
    X(s, n) && (Array.isArray(r) ? e[n] = Nr(r) : r && typeof r == "object" && r.constructor === Object ? e[n] = se(r) : e[n] = r);
  return e;
}
function ze(s, e) {
  for (; s !== null; ) {
    const r = Cr(s, e);
    if (r) {
      if (r.get)
        return B(r.get);
      if (typeof r.value == "function")
        return B(r.value);
    }
    s = Rr(s);
  }
  function n() {
    return null;
  }
  return n;
}
const An = z(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), St = z(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), At = z(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), $r = z(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Et = z(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Pr = z(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), En = z(["#text"]), Rn = z(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Rt = z(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Cn = z(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Qe = z(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), zr = V(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Br = V(/<%[\w\W]*|[\w\W]*%>/gm), Fr = V(/\$\{[\w\W]*/gm), Ur = V(/^data-[\-\w.\u00B7-\uFFFF]+$/), Hr = V(/^aria-[\-\w]+$/), jn = V(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Gr = V(/^(?:\w+script|data):/i), Wr = V(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), Vn = V(/^html$/i), qr = V(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Ln = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Hr,
  ATTR_WHITESPACE: Wr,
  CUSTOM_ELEMENT: qr,
  DATA_ATTR: Ur,
  DOCTYPE_NAME: Vn,
  ERB_EXPR: Br,
  IS_ALLOWED_URI: jn,
  IS_SCRIPT_OR_DATA: Gr,
  MUSTACHE_EXPR: zr,
  TMPLIT_EXPR: Fr
});
const Be = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Yr = function() {
  return typeof window > "u" ? null : window;
}, Zr = function(e, n) {
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
}, In = function() {
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
function Xn() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Yr();
  const e = (g) => Xn(g);
  if (e.version = "3.3.1", e.removed = [], !s || !s.document || s.document.nodeType !== Be.document || !s.Element)
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
    trustedTypes: y
  } = s, _ = o.prototype, G = ze(_, "cloneNode"), be = ze(_, "remove"), v = ze(_, "nextSibling"), I = ze(_, "childNodes"), W = ze(_, "parentNode");
  if (typeof l == "function") {
    const g = n.createElement("template");
    g.content && g.content.ownerDocument && (n = g.content.ownerDocument);
  }
  let x, q = "";
  const {
    implementation: F,
    createNodeIterator: it,
    createDocumentFragment: Qn,
    getElementsByTagName: Kn
  } = n, {
    importNode: Jn
  } = r;
  let N = In();
  e.isSupported = typeof Zn == "function" && typeof W == "function" && F && F.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: lt,
    ERB_EXPR: ot,
    TMPLIT_EXPR: ct,
    DATA_ATTR: es,
    ARIA_ATTR: ts,
    IS_SCRIPT_OR_DATA: ns,
    ATTR_WHITESPACE: Zt,
    CUSTOM_ELEMENT: ss
  } = Ln;
  let {
    IS_ALLOWED_URI: jt
  } = Ln, C = null;
  const Vt = k({}, [...An, ...St, ...At, ...Et, ...En]);
  let M = null;
  const Xt = k({}, [...Rn, ...Rt, ...Cn, ...Qe]);
  let A = Object.seal(Ot(null, {
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
  })), Le = null, ut = null;
  const _e = Object.seal(Ot(null, {
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
  let Qt = !0, pt = !0, Kt = !1, Jt = !0, xe = !1, He = !0, he = !1, ht = !1, ft = !1, we = !1, Ge = !1, We = !1, en = !0, tn = !1;
  const rs = "user-content-";
  let gt = !0, Ie = !1, Te = {}, ee = null;
  const dt = k({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let nn = null;
  const sn = k({}, ["audio", "video", "img", "source", "image", "track"]);
  let mt = null;
  const rn = k({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), qe = "http://www.w3.org/1998/Math/MathML", Ye = "http://www.w3.org/2000/svg", ae = "http://www.w3.org/1999/xhtml";
  let ye = ae, kt = !1, bt = null;
  const as = k({}, [qe, Ye, ae], yt);
  let Ze = k({}, ["mi", "mo", "mn", "ms", "mtext"]), je = k({}, ["annotation-xml"]);
  const is = k({}, ["title", "style", "font", "a", "script"]);
  let Me = null;
  const ls = ["application/xhtml+xml", "text/html"], os = "text/html";
  let R = null, ve = null;
  const cs = n.createElement("form"), an = function(a) {
    return a instanceof RegExp || a instanceof Function;
  }, _t = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(ve && ve === a)) {
      if ((!a || typeof a != "object") && (a = {}), a = se(a), Me = // eslint-disable-next-line unicorn/prefer-includes
      ls.indexOf(a.PARSER_MEDIA_TYPE) === -1 ? os : a.PARSER_MEDIA_TYPE, R = Me === "application/xhtml+xml" ? yt : Ke, C = X(a, "ALLOWED_TAGS") ? k({}, a.ALLOWED_TAGS, R) : Vt, M = X(a, "ALLOWED_ATTR") ? k({}, a.ALLOWED_ATTR, R) : Xt, bt = X(a, "ALLOWED_NAMESPACES") ? k({}, a.ALLOWED_NAMESPACES, yt) : as, mt = X(a, "ADD_URI_SAFE_ATTR") ? k(se(rn), a.ADD_URI_SAFE_ATTR, R) : rn, nn = X(a, "ADD_DATA_URI_TAGS") ? k(se(sn), a.ADD_DATA_URI_TAGS, R) : sn, ee = X(a, "FORBID_CONTENTS") ? k({}, a.FORBID_CONTENTS, R) : dt, Le = X(a, "FORBID_TAGS") ? k({}, a.FORBID_TAGS, R) : se({}), ut = X(a, "FORBID_ATTR") ? k({}, a.FORBID_ATTR, R) : se({}), Te = X(a, "USE_PROFILES") ? a.USE_PROFILES : !1, Qt = a.ALLOW_ARIA_ATTR !== !1, pt = a.ALLOW_DATA_ATTR !== !1, Kt = a.ALLOW_UNKNOWN_PROTOCOLS || !1, Jt = a.ALLOW_SELF_CLOSE_IN_ATTR !== !1, xe = a.SAFE_FOR_TEMPLATES || !1, He = a.SAFE_FOR_XML !== !1, he = a.WHOLE_DOCUMENT || !1, we = a.RETURN_DOM || !1, Ge = a.RETURN_DOM_FRAGMENT || !1, We = a.RETURN_TRUSTED_TYPE || !1, ft = a.FORCE_BODY || !1, en = a.SANITIZE_DOM !== !1, tn = a.SANITIZE_NAMED_PROPS || !1, gt = a.KEEP_CONTENT !== !1, Ie = a.IN_PLACE || !1, jt = a.ALLOWED_URI_REGEXP || jn, ye = a.NAMESPACE || ae, Ze = a.MATHML_TEXT_INTEGRATION_POINTS || Ze, je = a.HTML_INTEGRATION_POINTS || je, A = a.CUSTOM_ELEMENT_HANDLING || {}, a.CUSTOM_ELEMENT_HANDLING && an(a.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (A.tagNameCheck = a.CUSTOM_ELEMENT_HANDLING.tagNameCheck), a.CUSTOM_ELEMENT_HANDLING && an(a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (A.attributeNameCheck = a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), a.CUSTOM_ELEMENT_HANDLING && typeof a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (A.allowCustomizedBuiltInElements = a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), xe && (pt = !1), Ge && (we = !0), Te && (C = k({}, En), M = [], Te.html === !0 && (k(C, An), k(M, Rn)), Te.svg === !0 && (k(C, St), k(M, Rt), k(M, Qe)), Te.svgFilters === !0 && (k(C, At), k(M, Rt), k(M, Qe)), Te.mathMl === !0 && (k(C, Et), k(M, Cn), k(M, Qe))), a.ADD_TAGS && (typeof a.ADD_TAGS == "function" ? _e.tagCheck = a.ADD_TAGS : (C === Vt && (C = se(C)), k(C, a.ADD_TAGS, R))), a.ADD_ATTR && (typeof a.ADD_ATTR == "function" ? _e.attributeCheck = a.ADD_ATTR : (M === Xt && (M = se(M)), k(M, a.ADD_ATTR, R))), a.ADD_URI_SAFE_ATTR && k(mt, a.ADD_URI_SAFE_ATTR, R), a.FORBID_CONTENTS && (ee === dt && (ee = se(ee)), k(ee, a.FORBID_CONTENTS, R)), a.ADD_FORBID_CONTENTS && (ee === dt && (ee = se(ee)), k(ee, a.ADD_FORBID_CONTENTS, R)), gt && (C["#text"] = !0), he && k(C, ["html", "head", "body"]), C.table && (k(C, ["tbody"]), delete Le.tbody), a.TRUSTED_TYPES_POLICY) {
        if (typeof a.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof a.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        x = a.TRUSTED_TYPES_POLICY, q = x.createHTML("");
      } else
        x === void 0 && (x = Zr(y, t)), x !== null && typeof q == "string" && (q = x.createHTML(""));
      z && z(a), ve = a;
    }
  }, ln = k({}, [...St, ...At, ...$r]), on = k({}, [...Et, ...Pr]), us = function(a) {
    let u = W(a);
    (!u || !u.tagName) && (u = {
      namespaceURI: ye,
      tagName: "template"
    });
    const f = Ke(a.tagName), S = Ke(u.tagName);
    return bt[a.namespaceURI] ? a.namespaceURI === Ye ? u.namespaceURI === ae ? f === "svg" : u.namespaceURI === qe ? f === "svg" && (S === "annotation-xml" || Ze[S]) : !!ln[f] : a.namespaceURI === qe ? u.namespaceURI === ae ? f === "math" : u.namespaceURI === Ye ? f === "math" && je[S] : !!on[f] : a.namespaceURI === ae ? u.namespaceURI === Ye && !je[S] || u.namespaceURI === qe && !Ze[S] ? !1 : !on[f] && (is[f] || !ln[f]) : !!(Me === "application/xhtml+xml" && bt[a.namespaceURI]) : !1;
  }, te = function(a) {
    Ne(e.removed, {
      element: a
    });
    try {
      W(a).removeChild(a);
    } catch {
      be(a);
    }
  }, fe = function(a, u) {
    try {
      Ne(e.removed, {
        attribute: u.getAttributeNode(a),
        from: u
      });
    } catch {
      Ne(e.removed, {
        attribute: null,
        from: u
      });
    }
    if (u.removeAttribute(a), a === "is")
      if (we || Ge)
        try {
          te(u);
        } catch {
        }
      else
        try {
          u.setAttribute(a, "");
        } catch {
        }
  }, cn = function(a) {
    let u = null, f = null;
    if (ft)
      a = "<remove></remove>" + a;
    else {
      const E = vt(a, /^[\r\n\t ]+/);
      f = E && E[0];
    }
    Me === "application/xhtml+xml" && ye === ae && (a = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + a + "</body></html>");
    const S = x ? x.createHTML(a) : a;
    if (ye === ae)
      try {
        u = new m().parseFromString(S, Me);
      } catch {
      }
    if (!u || !u.documentElement) {
      u = F.createDocument(ye, "template", null);
      try {
        u.documentElement.innerHTML = kt ? q : S;
      } catch {
      }
    }
    const D = u.body || u.documentElement;
    return a && f && D.insertBefore(n.createTextNode(f), D.childNodes[0] || null), ye === ae ? Kn.call(u, he ? "html" : "body")[0] : he ? u.documentElement : D;
  }, un = function(a) {
    return it.call(
      a.ownerDocument || a,
      a,
      // eslint-disable-next-line no-bitwise
      p.SHOW_ELEMENT | p.SHOW_COMMENT | p.SHOW_TEXT | p.SHOW_PROCESSING_INSTRUCTION | p.SHOW_CDATA_SECTION,
      null
    );
  }, xt = function(a) {
    return a instanceof d && (typeof a.nodeName != "string" || typeof a.textContent != "string" || typeof a.removeChild != "function" || !(a.attributes instanceof h) || typeof a.removeAttribute != "function" || typeof a.setAttribute != "function" || typeof a.namespaceURI != "string" || typeof a.insertBefore != "function" || typeof a.hasChildNodes != "function");
  }, pn = function(a) {
    return typeof c == "function" && a instanceof c;
  };
  function ie(g, a, u) {
    Xe(g, (f) => {
      f.call(e, a, u, ve);
    });
  }
  const hn = function(a) {
    let u = null;
    if (ie(N.beforeSanitizeElements, a, null), xt(a))
      return te(a), !0;
    const f = R(a.nodeName);
    if (ie(N.uponSanitizeElement, a, {
      tagName: f,
      allowedTags: C
    }), He && a.hasChildNodes() && !pn(a.firstElementChild) && $(/<[/\w!]/g, a.innerHTML) && $(/<[/\w!]/g, a.textContent) || a.nodeType === Be.progressingInstruction || He && a.nodeType === Be.comment && $(/<[/\w]/g, a.data))
      return te(a), !0;
    if (!(_e.tagCheck instanceof Function && _e.tagCheck(f)) && (!C[f] || Le[f])) {
      if (!Le[f] && gn(f) && (A.tagNameCheck instanceof RegExp && $(A.tagNameCheck, f) || A.tagNameCheck instanceof Function && A.tagNameCheck(f)))
        return !1;
      if (gt && !ee[f]) {
        const S = W(a) || a.parentNode, D = I(a) || a.childNodes;
        if (D && S) {
          const E = D.length;
          for (let U = E - 1; U >= 0; --U) {
            const le = G(D[U], !0);
            le.__removalCount = (a.__removalCount || 0) + 1, S.insertBefore(le, v(a));
          }
        }
      }
      return te(a), !0;
    }
    return a instanceof o && !us(a) || (f === "noscript" || f === "noembed" || f === "noframes") && $(/<\/no(script|embed|frames)/i, a.innerHTML) ? (te(a), !0) : (xe && a.nodeType === Be.text && (u = a.textContent, Xe([lt, ot, ct], (S) => {
      u = $e(u, S, " ");
    }), a.textContent !== u && (Ne(e.removed, {
      element: a.cloneNode()
    }), a.textContent = u)), ie(N.afterSanitizeElements, a, null), !1);
  }, fn = function(a, u, f) {
    if (en && (u === "id" || u === "name") && (f in n || f in cs))
      return !1;
    if (!(pt && !ut[u] && $(es, u))) {
      if (!(Qt && $(ts, u))) {
        if (!(_e.attributeCheck instanceof Function && _e.attributeCheck(u, a))) {
          if (!M[u] || ut[u]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(gn(a) && (A.tagNameCheck instanceof RegExp && $(A.tagNameCheck, a) || A.tagNameCheck instanceof Function && A.tagNameCheck(a)) && (A.attributeNameCheck instanceof RegExp && $(A.attributeNameCheck, u) || A.attributeNameCheck instanceof Function && A.attributeNameCheck(u, a)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              u === "is" && A.allowCustomizedBuiltInElements && (A.tagNameCheck instanceof RegExp && $(A.tagNameCheck, f) || A.tagNameCheck instanceof Function && A.tagNameCheck(f)))
            ) return !1;
          } else if (!mt[u]) {
            if (!$(jt, $e(f, Zt, ""))) {
              if (!((u === "src" || u === "xlink:href" || u === "href") && a !== "script" && Mr(f, "data:") === 0 && nn[a])) {
                if (!(Kt && !$(ns, $e(f, Zt, "")))) {
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
  }, gn = function(a) {
    return a !== "annotation-xml" && vt(a, ss);
  }, dn = function(a) {
    ie(N.beforeSanitizeAttributes, a, null);
    const {
      attributes: u
    } = a;
    if (!u || xt(a))
      return;
    const f = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: M,
      forceKeepAttr: void 0
    };
    let S = u.length;
    for (; S--; ) {
      const D = u[S], {
        name: E,
        namespaceURI: U,
        value: le
      } = D, Se = R(E), wt = le;
      let O = E === "value" ? wt : Or(wt);
      if (f.attrName = Se, f.attrValue = O, f.keepAttr = !0, f.forceKeepAttr = void 0, ie(N.uponSanitizeAttribute, a, f), O = f.attrValue, tn && (Se === "id" || Se === "name") && (fe(E, a), O = rs + O), He && $(/((--!?|])>)|<\/(style|title|textarea)/i, O)) {
        fe(E, a);
        continue;
      }
      if (Se === "attributename" && vt(O, "href")) {
        fe(E, a);
        continue;
      }
      if (f.forceKeepAttr)
        continue;
      if (!f.keepAttr) {
        fe(E, a);
        continue;
      }
      if (!Jt && $(/\/>/i, O)) {
        fe(E, a);
        continue;
      }
      xe && Xe([lt, ot, ct], (kn) => {
        O = $e(O, kn, " ");
      });
      const mn = R(a.nodeName);
      if (!fn(mn, Se, O)) {
        fe(E, a);
        continue;
      }
      if (x && typeof y == "object" && typeof y.getAttributeType == "function" && !U)
        switch (y.getAttributeType(mn, Se)) {
          case "TrustedHTML": {
            O = x.createHTML(O);
            break;
          }
          case "TrustedScriptURL": {
            O = x.createScriptURL(O);
            break;
          }
        }
      if (O !== wt)
        try {
          U ? a.setAttributeNS(U, E, O) : a.setAttribute(E, O), xt(a) ? te(a) : Sn(e.removed);
        } catch {
          fe(E, a);
        }
    }
    ie(N.afterSanitizeAttributes, a, null);
  }, ps = function g(a) {
    let u = null;
    const f = un(a);
    for (ie(N.beforeSanitizeShadowDOM, a, null); u = f.nextNode(); )
      ie(N.uponSanitizeShadowNode, u, null), hn(u), dn(u), u.content instanceof i && g(u.content);
    ie(N.afterSanitizeShadowDOM, a, null);
  };
  return e.sanitize = function(g) {
    let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, f = null, S = null, D = null;
    if (kt = !g, kt && (g = "<!-->"), typeof g != "string" && !pn(g))
      if (typeof g.toString == "function") {
        if (g = g.toString(), typeof g != "string")
          throw Pe("dirty is not a string, aborting");
      } else
        throw Pe("toString is not a function");
    if (!e.isSupported)
      return g;
    if (ht || _t(a), e.removed = [], typeof g == "string" && (Ie = !1), Ie) {
      if (g.nodeName) {
        const le = R(g.nodeName);
        if (!C[le] || Le[le])
          throw Pe("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (g instanceof c)
      u = cn("<!---->"), f = u.ownerDocument.importNode(g, !0), f.nodeType === Be.element && f.nodeName === "BODY" || f.nodeName === "HTML" ? u = f : u.appendChild(f);
    else {
      if (!we && !xe && !he && // eslint-disable-next-line unicorn/prefer-includes
      g.indexOf("<") === -1)
        return x && We ? x.createHTML(g) : g;
      if (u = cn(g), !u)
        return we ? null : We ? q : "";
    }
    u && ft && te(u.firstChild);
    const E = un(Ie ? g : u);
    for (; S = E.nextNode(); )
      hn(S), dn(S), S.content instanceof i && ps(S.content);
    if (Ie)
      return g;
    if (we) {
      if (Ge)
        for (D = Qn.call(u.ownerDocument); u.firstChild; )
          D.appendChild(u.firstChild);
      else
        D = u;
      return (M.shadowroot || M.shadowrootmode) && (D = Jn.call(r, D, !0)), D;
    }
    let U = he ? u.outerHTML : u.innerHTML;
    return he && C["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && $(Vn, u.ownerDocument.doctype.name) && (U = "<!DOCTYPE " + u.ownerDocument.doctype.name + `>
` + U), xe && Xe([lt, ot, ct], (le) => {
      U = $e(U, le, " ");
    }), x && We ? x.createHTML(U) : U;
  }, e.setConfig = function() {
    let g = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _t(g), ht = !0;
  }, e.clearConfig = function() {
    ve = null, ht = !1;
  }, e.isValidAttribute = function(g, a, u) {
    ve || _t({});
    const f = R(g), S = R(a);
    return fn(f, S, u);
  }, e.addHook = function(g, a) {
    typeof a == "function" && Ne(N[g], a);
  }, e.removeHook = function(g, a) {
    if (a !== void 0) {
      const u = Lr(N[g], a);
      return u === -1 ? void 0 : Ir(N[g], u, 1)[0];
    }
    return Sn(N[g]);
  }, e.removeHooks = function(g) {
    N[g] = [];
  }, e.removeAllHooks = function() {
    N = In();
  }, e;
}
var jr = Xn();
const Vr = {}, Xr = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Qr(s, e) {
  return T(), L("svg", Xr, [...e[0] || (e[0] = [
    Y("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }, null, -1)
  ])]);
}
const Kr = /* @__PURE__ */ Z(Vr, [["render", Qr]]), Jr = {}, ea = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ta(s, e) {
  return T(), L("svg", ea, [...e[0] || (e[0] = [
    Y("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" }, null, -1)
  ])]);
}
const na = /* @__PURE__ */ Z(Jr, [["render", ta]]), sa = ["aria-label"], ra = {
  key: 0,
  class: "nc-message-bubble__header"
}, aa = {
  key: 0,
  class: "nc-message-bubble__label"
}, ia = { class: "nc-message-bubble__bubble" }, la = {
  key: 0,
  class: "nc-message-bubble__content"
}, oa = ["innerHTML"], ca = ["aria-label"], ua = /* @__PURE__ */ pe({
  __name: "MessageBubble",
  props: {
    message: {}
  },
  setup(s) {
    const e = s, n = j(() => e.message.role === "user"), r = j(
      () => e.message.status === "failed" || e.message.id.startsWith("error-")
    ), t = j(() => e.message.status === "sending"), i = j(() => e.message.role === "assistant" && !r.value), l = j(() => {
      if (e.message.role !== "assistant" || r.value) return null;
      const d = w.parse(e.message.content);
      return jr.sanitize(d);
    }), c = j(() => r.value ? "Error message" : n.value ? "Message from you" : "Message from AI Assistant"), o = Q(!1);
    let p = null;
    async function h() {
      try {
        await navigator.clipboard.writeText(e.message.content), o.value = !0, p && clearTimeout(p), p = setTimeout(() => {
          o.value = !1;
        }, 1500);
      } catch {
      }
    }
    return On(() => {
      p && clearTimeout(p);
    }), (d, m) => (T(), L("li", {
      role: "listitem",
      "aria-label": c.value,
      class: $t(["nc-message-bubble", {
        "nc-message-bubble--user": n.value,
        "nc-message-bubble--assistant": i.value,
        "nc-message-bubble--error": r.value,
        "nc-message-bubble--sending": t.value
      }])
    }, [
      r.value ? Ct("", !0) : (T(), L("div", ra, [
        n.value ? (T(), L("span", aa, "You")) : (T(), L(Dn, { key: 1 }, [
          H(Pt, { class: "nc-message-bubble__star" }),
          m[0] || (m[0] = Y("span", { class: "nc-message-bubble__label" }, "AI Assistant", -1))
        ], 64))
      ])),
      Y("div", ia, [
        n.value || r.value ? (T(), L("div", la, Mn(s.message.content), 1)) : (T(), L("div", {
          key: 1,
          class: "nc-message-bubble__content",
          innerHTML: l.value
        }, null, 8, oa))
      ]),
      i.value ? (T(), L("button", {
        key: 1,
        class: "nc-message-bubble__copy",
        "aria-label": o.value ? "Message copied" : "Copy message",
        onClick: h
      }, [
        o.value ? (T(), ce(na, { key: 0 })) : (T(), ce(Kr, { key: 1 }))
      ], 8, ca)) : Ct("", !0)
    ], 10, sa));
  }
}), pa = /* @__PURE__ */ Z(ua, [["__scopeId", "data-v-6af74610"]]), ha = {
  role: "list",
  "aria-live": "polite",
  class: "nc-message-list"
}, fa = { class: "nc-message-list__loader" }, ga = 50, da = /* @__PURE__ */ pe({
  __name: "MessageList",
  setup(s) {
    const e = ue(Ce), n = nt("scrollContainer"), r = Q(!0);
    function t() {
      const o = n.value?.$el;
      return o instanceof HTMLElement ? o : null;
    }
    function i() {
      const o = t();
      if (!o) return;
      const { scrollTop: p, scrollHeight: h, clientHeight: d } = o;
      r.value = h - p - d <= ga;
    }
    function l() {
      const o = t();
      o && (o.scrollTop = o.scrollHeight);
    }
    Ee(
      () => e.messages.value,
      () => {
        r.value && Re(l);
      }
    ), hs(() => {
      e.messages.value.length > 0 && Re(l), t()?.addEventListener("scroll", i, { passive: !0 });
    }), On(() => {
      t()?.removeEventListener("scroll", i);
    });
    async function c({ done: o }) {
      const p = t(), h = p?.scrollHeight ?? 0;
      try {
        await e.loadMore(), o(e.hasMore.value ? "ok" : "empty");
      } catch {
        o("error");
      }
      if (await Re(), p) {
        const d = p.scrollHeight;
        p.scrollTop = p.scrollTop + (d - h);
      }
    }
    return (o, p) => {
      const h = re("v-progress-circular"), d = re("v-infinite-scroll");
      return T(), ce(d, {
        ref: "scrollContainer",
        side: "start",
        disabled: !oe(e).hasMore.value,
        class: "nc-message-list-scroll",
        onLoad: c
      }, {
        loading: de(() => [
          Y("div", fa, [
            H(h, {
              indeterminate: "",
              size: "24",
              width: "2"
            })
          ])
        ]),
        empty: de(() => [...p[0] || (p[0] = [])]),
        default: de(() => [
          Y("ul", ha, [
            (T(!0), L(Dn, null, fs(oe(e).messages.value, (m) => (T(), ce(pa, {
              key: m.id,
              message: m
            }, null, 8, ["message"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["disabled"]);
    };
  }
}), ma = /* @__PURE__ */ Z(da, [["__scopeId", "data-v-b90d60e0"]]), ka = {}, ba = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function _a(s, e) {
  return T(), L("svg", ba, [...e[0] || (e[0] = [
    Y("path", { d: "M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91Z" }, null, -1)
  ])]);
}
const xa = /* @__PURE__ */ Z(ka, [["render", _a]]), wa = { class: "nc-chat-input" }, Ta = /* @__PURE__ */ pe({
  __name: "ChatInput",
  setup(s) {
    const e = ue(Ce), n = Q(""), r = nt("textareaRef"), t = j(() => n.value.trim().length > 0 && !e.isSending.value);
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
    return Ee(
      () => e.failedMessageText.value,
      (c) => {
        c && (n.value = c);
      }
    ), Ee(
      () => e.isOpen.value,
      (c) => {
        c && Re(() => {
          r.value?.focus();
        });
      },
      { immediate: !0 }
    ), Ee(
      () => e.isSending.value,
      (c, o) => {
        o && !c && Re(() => {
          r.value?.focus();
        });
      }
    ), (c, o) => {
      const p = re("v-textarea"), h = re("v-btn");
      return T(), L("div", wa, [
        H(p, {
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
          placeholder: "How can I help you? Ask me anything...",
          "aria-label": "Type a message",
          disabled: oe(e).isSending.value,
          class: "nc-chat-input__textarea",
          onKeydown: l
        }, null, 8, ["modelValue", "disabled"]),
        H(h, {
          icon: "",
          variant: "flat",
          color: "secondary",
          size: "small",
          disabled: !t.value,
          "aria-label": "Send message",
          class: "nc-chat-input__send-btn",
          onClick: i
        }, {
          default: de(() => [
            H(xa)
          ]),
          _: 1
        }, 8, ["disabled"])
      ]);
    };
  }
}), ya = /* @__PURE__ */ Z(Ta, [["__scopeId", "data-v-4a7e7d61"]]), va = { class: "nc-chat-panel__body" }, Sa = /* @__PURE__ */ pe({
  __name: "ChatPanel",
  setup(s) {
    const e = ue(Ce), n = ue(st), r = j(() => n?.welcomeMessage), t = ks(), i = j(() => t.width.value < 768), l = (c) => {
      c.key === "Escape" && e.isOpen.value && e.close();
    };
    return Ee(
      () => e.isOpen.value,
      (c) => {
        c ? window.addEventListener("keydown", l) : window.removeEventListener("keydown", l);
      },
      { immediate: !0 }
    ), gs(() => {
      window.removeEventListener("keydown", l);
    }), (c, o) => {
      const p = re("v-progress-circular");
      return T(), ce(ds, { to: "body" }, [
        oe(e).isOpen.value ? (T(), L("div", {
          key: 0,
          class: $t(["nc-chat-panel", { "nc-chat-panel--mobile": i.value }]),
          role: "complementary",
          "aria-label": "Chat with AI Assistant"
        }, [
          H(Os),
          Y("div", va, [
            oe(e).isLoading.value && oe(e).messages.value.length === 0 ? (T(), ce(p, {
              key: 0,
              indeterminate: "",
              size: "24",
              class: "nc-chat-panel__loader"
            })) : oe(e).messages.value.length === 0 && !oe(e).isSending.value ? (T(), ce(Ps, {
              key: 1,
              message: r.value
            }, null, 8, ["message"])) : (T(), ce(ma, { key: 2 }))
          ]),
          H(ya)
        ], 2)) : Ct("", !0)
      ]);
    };
  }
}), Aa = /* @__PURE__ */ Z(Sa, [["__scopeId", "data-v-4d8dd82a"]]), Ea = /* @__PURE__ */ pe({
  __name: "NativeChatWidget",
  setup(s) {
    const e = bs();
    if (!e.themes.value.nativeChat) {
      const i = e.themes.value.light;
      e.themes.value.nativeChat = {
        ...i,
        ...Tt,
        colors: {
          ...i.colors,
          ...Tt.colors
        },
        variables: {
          ...i.variables,
          ...Tt.variables
        }
      };
    }
    const n = ue(st), r = xs(n.apiClient, n);
    ms(Ce, r);
    const t = nt("floatingButtonRef");
    return Ee(
      () => r.isOpen.value,
      (i) => {
        i || Re(() => {
          t.value?.focus();
        });
      }
    ), (i, l) => {
      const c = re("v-theme-provider");
      return T(), ce(c, { theme: "nativeChat" }, {
        default: de(() => [
          H(Ss, {
            ref_key: "floatingButtonRef",
            ref: t
          }, null, 512),
          H(Aa)
        ]),
        _: 1
      });
    };
  }
}), Ra = /* @__PURE__ */ Z(Ea, [["__scopeId", "data-v-492f08ed"]]), Ia = {
  install(s, e) {
    if (!e?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    s.provide(st, e), s.component("NativeChatWidget", Ra);
  }
};
function Ma(s) {
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
  Ia as NativeChatPlugin,
  Ra as NativeChatWidget,
  Ma as createNativeChatApiClient,
  Ia as default
};
