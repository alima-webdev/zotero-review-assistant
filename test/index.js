"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/pizzip/js/base64.js
  var require_base64 = __commonJS({
    "node_modules/pizzip/js/base64.js"(exports) {
      "use strict";
      var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      exports.encode = function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = (chr1 & 3) << 4 | chr2 >> 4;
          enc3 = (chr2 & 15) << 2 | chr3 >> 6;
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
          output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
      };
      exports.decode = function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
          enc1 = _keyStr.indexOf(input.charAt(i++));
          enc2 = _keyStr.indexOf(input.charAt(i++));
          enc3 = _keyStr.indexOf(input.charAt(i++));
          enc4 = _keyStr.indexOf(input.charAt(i++));
          chr1 = enc1 << 2 | enc2 >> 4;
          chr2 = (enc2 & 15) << 4 | enc3 >> 2;
          chr3 = (enc3 & 3) << 6 | enc4;
          output += String.fromCharCode(chr1);
          if (enc3 !== 64) {
            output += String.fromCharCode(chr2);
          }
          if (enc4 !== 64) {
            output += String.fromCharCode(chr3);
          }
        }
        return output;
      };
    }
  });

  // node_modules/pizzip/js/support.js
  var require_support = __commonJS({
    "node_modules/pizzip/js/support.js"(exports) {
      "use strict";
      exports.base64 = true;
      exports.array = true;
      exports.string = true;
      exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
      exports.nodebuffer = typeof Buffer !== "undefined";
      exports.uint8array = typeof Uint8Array !== "undefined";
      if (typeof ArrayBuffer === "undefined") {
        exports.blob = false;
      } else {
        buffer = new ArrayBuffer(0);
        try {
          exports.blob = new Blob([buffer], {
            type: "application/zip"
          }).size === 0;
        } catch (e) {
          try {
            Builder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
            builder = new Builder();
            builder.append(buffer);
            exports.blob = builder.getBlob("application/zip").size === 0;
          } catch (e2) {
            exports.blob = false;
          }
        }
      }
      var buffer;
      var Builder;
      var builder;
    }
  });

  // node_modules/pizzip/node_modules/pako/dist/pako.es5.min.js
  var require_pako_es5_min = __commonJS({
    "node_modules/pizzip/node_modules/pako/dist/pako.es5.min.js"(exports, module) {
      !function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).pako = {});
      }(exports, function(t) {
        "use strict";
        function e(t2) {
          for (var e2 = t2.length; --e2 >= 0; )
            t2[e2] = 0;
        }
        var a = 256, n = 286, i = 30, r = 15, s = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]), o = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]), l = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]), h = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), d = new Array(576);
        e(d);
        var _ = new Array(60);
        e(_);
        var f = new Array(512);
        e(f);
        var u = new Array(256);
        e(u);
        var c = new Array(29);
        e(c);
        var w, m, b, g = new Array(i);
        function p(t2, e2, a2, n2, i2) {
          this.static_tree = t2, this.extra_bits = e2, this.extra_base = a2, this.elems = n2, this.max_length = i2, this.has_stree = t2 && t2.length;
        }
        function v(t2, e2) {
          this.dyn_tree = t2, this.max_code = 0, this.stat_desc = e2;
        }
        e(g);
        var k = function(t2) {
          return t2 < 256 ? f[t2] : f[256 + (t2 >>> 7)];
        }, y = function(t2, e2) {
          t2.pending_buf[t2.pending++] = 255 & e2, t2.pending_buf[t2.pending++] = e2 >>> 8 & 255;
        }, x = function(t2, e2, a2) {
          t2.bi_valid > 16 - a2 ? (t2.bi_buf |= e2 << t2.bi_valid & 65535, y(t2, t2.bi_buf), t2.bi_buf = e2 >> 16 - t2.bi_valid, t2.bi_valid += a2 - 16) : (t2.bi_buf |= e2 << t2.bi_valid & 65535, t2.bi_valid += a2);
        }, z = function(t2, e2, a2) {
          x(t2, a2[2 * e2], a2[2 * e2 + 1]);
        }, A = function(t2, e2) {
          var a2 = 0;
          do {
            a2 |= 1 & t2, t2 >>>= 1, a2 <<= 1;
          } while (--e2 > 0);
          return a2 >>> 1;
        }, E = function(t2, e2, a2) {
          var n2, i2, s2 = new Array(16), o2 = 0;
          for (n2 = 1; n2 <= r; n2++)
            o2 = o2 + a2[n2 - 1] << 1, s2[n2] = o2;
          for (i2 = 0; i2 <= e2; i2++) {
            var l2 = t2[2 * i2 + 1];
            0 !== l2 && (t2[2 * i2] = A(s2[l2]++, l2));
          }
        }, R = function(t2) {
          var e2;
          for (e2 = 0; e2 < n; e2++)
            t2.dyn_ltree[2 * e2] = 0;
          for (e2 = 0; e2 < i; e2++)
            t2.dyn_dtree[2 * e2] = 0;
          for (e2 = 0; e2 < 19; e2++)
            t2.bl_tree[2 * e2] = 0;
          t2.dyn_ltree[512] = 1, t2.opt_len = t2.static_len = 0, t2.sym_next = t2.matches = 0;
        }, Z = function(t2) {
          t2.bi_valid > 8 ? y(t2, t2.bi_buf) : t2.bi_valid > 0 && (t2.pending_buf[t2.pending++] = t2.bi_buf), t2.bi_buf = 0, t2.bi_valid = 0;
        }, S = function(t2, e2, a2, n2) {
          var i2 = 2 * e2, r2 = 2 * a2;
          return t2[i2] < t2[r2] || t2[i2] === t2[r2] && n2[e2] <= n2[a2];
        }, U = function(t2, e2, a2) {
          for (var n2 = t2.heap[a2], i2 = a2 << 1; i2 <= t2.heap_len && (i2 < t2.heap_len && S(e2, t2.heap[i2 + 1], t2.heap[i2], t2.depth) && i2++, !S(e2, n2, t2.heap[i2], t2.depth)); )
            t2.heap[a2] = t2.heap[i2], a2 = i2, i2 <<= 1;
          t2.heap[a2] = n2;
        }, D = function(t2, e2, n2) {
          var i2, r2, l2, h2, d2 = 0;
          if (0 !== t2.sym_next)
            do {
              i2 = 255 & t2.pending_buf[t2.sym_buf + d2++], i2 += (255 & t2.pending_buf[t2.sym_buf + d2++]) << 8, r2 = t2.pending_buf[t2.sym_buf + d2++], 0 === i2 ? z(t2, r2, e2) : (l2 = u[r2], z(t2, l2 + a + 1, e2), 0 !== (h2 = s[l2]) && (r2 -= c[l2], x(t2, r2, h2)), i2--, l2 = k(i2), z(t2, l2, n2), 0 !== (h2 = o[l2]) && (i2 -= g[l2], x(t2, i2, h2)));
            } while (d2 < t2.sym_next);
          z(t2, 256, e2);
        }, T = function(t2, e2) {
          var a2, n2, i2, s2 = e2.dyn_tree, o2 = e2.stat_desc.static_tree, l2 = e2.stat_desc.has_stree, h2 = e2.stat_desc.elems, d2 = -1;
          for (t2.heap_len = 0, t2.heap_max = 573, a2 = 0; a2 < h2; a2++)
            0 !== s2[2 * a2] ? (t2.heap[++t2.heap_len] = d2 = a2, t2.depth[a2] = 0) : s2[2 * a2 + 1] = 0;
          for (; t2.heap_len < 2; )
            s2[2 * (i2 = t2.heap[++t2.heap_len] = d2 < 2 ? ++d2 : 0)] = 1, t2.depth[i2] = 0, t2.opt_len--, l2 && (t2.static_len -= o2[2 * i2 + 1]);
          for (e2.max_code = d2, a2 = t2.heap_len >> 1; a2 >= 1; a2--)
            U(t2, s2, a2);
          i2 = h2;
          do {
            a2 = t2.heap[1], t2.heap[1] = t2.heap[t2.heap_len--], U(t2, s2, 1), n2 = t2.heap[1], t2.heap[--t2.heap_max] = a2, t2.heap[--t2.heap_max] = n2, s2[2 * i2] = s2[2 * a2] + s2[2 * n2], t2.depth[i2] = (t2.depth[a2] >= t2.depth[n2] ? t2.depth[a2] : t2.depth[n2]) + 1, s2[2 * a2 + 1] = s2[2 * n2 + 1] = i2, t2.heap[1] = i2++, U(t2, s2, 1);
          } while (t2.heap_len >= 2);
          t2.heap[--t2.heap_max] = t2.heap[1], function(t3, e3) {
            var a3, n3, i3, s3, o3, l3, h3 = e3.dyn_tree, d3 = e3.max_code, _2 = e3.stat_desc.static_tree, f2 = e3.stat_desc.has_stree, u2 = e3.stat_desc.extra_bits, c2 = e3.stat_desc.extra_base, w2 = e3.stat_desc.max_length, m2 = 0;
            for (s3 = 0; s3 <= r; s3++)
              t3.bl_count[s3] = 0;
            for (h3[2 * t3.heap[t3.heap_max] + 1] = 0, a3 = t3.heap_max + 1; a3 < 573; a3++)
              (s3 = h3[2 * h3[2 * (n3 = t3.heap[a3]) + 1] + 1] + 1) > w2 && (s3 = w2, m2++), h3[2 * n3 + 1] = s3, n3 > d3 || (t3.bl_count[s3]++, o3 = 0, n3 >= c2 && (o3 = u2[n3 - c2]), l3 = h3[2 * n3], t3.opt_len += l3 * (s3 + o3), f2 && (t3.static_len += l3 * (_2[2 * n3 + 1] + o3)));
            if (0 !== m2) {
              do {
                for (s3 = w2 - 1; 0 === t3.bl_count[s3]; )
                  s3--;
                t3.bl_count[s3]--, t3.bl_count[s3 + 1] += 2, t3.bl_count[w2]--, m2 -= 2;
              } while (m2 > 0);
              for (s3 = w2; 0 !== s3; s3--)
                for (n3 = t3.bl_count[s3]; 0 !== n3; )
                  (i3 = t3.heap[--a3]) > d3 || (h3[2 * i3 + 1] !== s3 && (t3.opt_len += (s3 - h3[2 * i3 + 1]) * h3[2 * i3], h3[2 * i3 + 1] = s3), n3--);
            }
          }(t2, e2), E(s2, d2, t2.bl_count);
        }, O = function(t2, e2, a2) {
          var n2, i2, r2 = -1, s2 = e2[1], o2 = 0, l2 = 7, h2 = 4;
          for (0 === s2 && (l2 = 138, h2 = 3), e2[2 * (a2 + 1) + 1] = 65535, n2 = 0; n2 <= a2; n2++)
            i2 = s2, s2 = e2[2 * (n2 + 1) + 1], ++o2 < l2 && i2 === s2 || (o2 < h2 ? t2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== r2 && t2.bl_tree[2 * i2]++, t2.bl_tree[32]++) : o2 <= 10 ? t2.bl_tree[34]++ : t2.bl_tree[36]++, o2 = 0, r2 = i2, 0 === s2 ? (l2 = 138, h2 = 3) : i2 === s2 ? (l2 = 6, h2 = 3) : (l2 = 7, h2 = 4));
        }, I = function(t2, e2, a2) {
          var n2, i2, r2 = -1, s2 = e2[1], o2 = 0, l2 = 7, h2 = 4;
          for (0 === s2 && (l2 = 138, h2 = 3), n2 = 0; n2 <= a2; n2++)
            if (i2 = s2, s2 = e2[2 * (n2 + 1) + 1], !(++o2 < l2 && i2 === s2)) {
              if (o2 < h2)
                do {
                  z(t2, i2, t2.bl_tree);
                } while (0 != --o2);
              else
                0 !== i2 ? (i2 !== r2 && (z(t2, i2, t2.bl_tree), o2--), z(t2, 16, t2.bl_tree), x(t2, o2 - 3, 2)) : o2 <= 10 ? (z(t2, 17, t2.bl_tree), x(t2, o2 - 3, 3)) : (z(t2, 18, t2.bl_tree), x(t2, o2 - 11, 7));
              o2 = 0, r2 = i2, 0 === s2 ? (l2 = 138, h2 = 3) : i2 === s2 ? (l2 = 6, h2 = 3) : (l2 = 7, h2 = 4);
            }
        }, F = false, L = function(t2, e2, a2, n2) {
          x(t2, 0 + (n2 ? 1 : 0), 3), Z(t2), y(t2, a2), y(t2, ~a2), a2 && t2.pending_buf.set(t2.window.subarray(e2, e2 + a2), t2.pending), t2.pending += a2;
        }, N = function(t2, e2, n2, i2) {
          var r2, s2, o2 = 0;
          t2.level > 0 ? (2 === t2.strm.data_type && (t2.strm.data_type = function(t3) {
            var e3, n3 = 4093624447;
            for (e3 = 0; e3 <= 31; e3++, n3 >>>= 1)
              if (1 & n3 && 0 !== t3.dyn_ltree[2 * e3])
                return 0;
            if (0 !== t3.dyn_ltree[18] || 0 !== t3.dyn_ltree[20] || 0 !== t3.dyn_ltree[26])
              return 1;
            for (e3 = 32; e3 < a; e3++)
              if (0 !== t3.dyn_ltree[2 * e3])
                return 1;
            return 0;
          }(t2)), T(t2, t2.l_desc), T(t2, t2.d_desc), o2 = function(t3) {
            var e3;
            for (O(t3, t3.dyn_ltree, t3.l_desc.max_code), O(t3, t3.dyn_dtree, t3.d_desc.max_code), T(t3, t3.bl_desc), e3 = 18; e3 >= 3 && 0 === t3.bl_tree[2 * h[e3] + 1]; e3--)
              ;
            return t3.opt_len += 3 * (e3 + 1) + 5 + 5 + 4, e3;
          }(t2), r2 = t2.opt_len + 3 + 7 >>> 3, (s2 = t2.static_len + 3 + 7 >>> 3) <= r2 && (r2 = s2)) : r2 = s2 = n2 + 5, n2 + 4 <= r2 && -1 !== e2 ? L(t2, e2, n2, i2) : 4 === t2.strategy || s2 === r2 ? (x(t2, 2 + (i2 ? 1 : 0), 3), D(t2, d, _)) : (x(t2, 4 + (i2 ? 1 : 0), 3), function(t3, e3, a2, n3) {
            var i3;
            for (x(t3, e3 - 257, 5), x(t3, a2 - 1, 5), x(t3, n3 - 4, 4), i3 = 0; i3 < n3; i3++)
              x(t3, t3.bl_tree[2 * h[i3] + 1], 3);
            I(t3, t3.dyn_ltree, e3 - 1), I(t3, t3.dyn_dtree, a2 - 1);
          }(t2, t2.l_desc.max_code + 1, t2.d_desc.max_code + 1, o2 + 1), D(t2, t2.dyn_ltree, t2.dyn_dtree)), R(t2), i2 && Z(t2);
        }, B = { _tr_init: function(t2) {
          F || (!function() {
            var t3, e2, a2, h2, v2, k2 = new Array(16);
            for (a2 = 0, h2 = 0; h2 < 28; h2++)
              for (c[h2] = a2, t3 = 0; t3 < 1 << s[h2]; t3++)
                u[a2++] = h2;
            for (u[a2 - 1] = h2, v2 = 0, h2 = 0; h2 < 16; h2++)
              for (g[h2] = v2, t3 = 0; t3 < 1 << o[h2]; t3++)
                f[v2++] = h2;
            for (v2 >>= 7; h2 < i; h2++)
              for (g[h2] = v2 << 7, t3 = 0; t3 < 1 << o[h2] - 7; t3++)
                f[256 + v2++] = h2;
            for (e2 = 0; e2 <= r; e2++)
              k2[e2] = 0;
            for (t3 = 0; t3 <= 143; )
              d[2 * t3 + 1] = 8, t3++, k2[8]++;
            for (; t3 <= 255; )
              d[2 * t3 + 1] = 9, t3++, k2[9]++;
            for (; t3 <= 279; )
              d[2 * t3 + 1] = 7, t3++, k2[7]++;
            for (; t3 <= 287; )
              d[2 * t3 + 1] = 8, t3++, k2[8]++;
            for (E(d, 287, k2), t3 = 0; t3 < i; t3++)
              _[2 * t3 + 1] = 5, _[2 * t3] = A(t3, 5);
            w = new p(d, s, 257, n, r), m = new p(_, o, 0, i, r), b = new p(new Array(0), l, 0, 19, 7);
          }(), F = true), t2.l_desc = new v(t2.dyn_ltree, w), t2.d_desc = new v(t2.dyn_dtree, m), t2.bl_desc = new v(t2.bl_tree, b), t2.bi_buf = 0, t2.bi_valid = 0, R(t2);
        }, _tr_stored_block: L, _tr_flush_block: N, _tr_tally: function(t2, e2, n2) {
          return t2.pending_buf[t2.sym_buf + t2.sym_next++] = e2, t2.pending_buf[t2.sym_buf + t2.sym_next++] = e2 >> 8, t2.pending_buf[t2.sym_buf + t2.sym_next++] = n2, 0 === e2 ? t2.dyn_ltree[2 * n2]++ : (t2.matches++, e2--, t2.dyn_ltree[2 * (u[n2] + a + 1)]++, t2.dyn_dtree[2 * k(e2)]++), t2.sym_next === t2.sym_end;
        }, _tr_align: function(t2) {
          x(t2, 2, 3), z(t2, 256, d), function(t3) {
            16 === t3.bi_valid ? (y(t3, t3.bi_buf), t3.bi_buf = 0, t3.bi_valid = 0) : t3.bi_valid >= 8 && (t3.pending_buf[t3.pending++] = 255 & t3.bi_buf, t3.bi_buf >>= 8, t3.bi_valid -= 8);
          }(t2);
        } }, C = function(t2, e2, a2, n2) {
          for (var i2 = 65535 & t2 | 0, r2 = t2 >>> 16 & 65535 | 0, s2 = 0; 0 !== a2; ) {
            a2 -= s2 = a2 > 2e3 ? 2e3 : a2;
            do {
              r2 = r2 + (i2 = i2 + e2[n2++] | 0) | 0;
            } while (--s2);
            i2 %= 65521, r2 %= 65521;
          }
          return i2 | r2 << 16 | 0;
        }, M = new Uint32Array(function() {
          for (var t2, e2 = [], a2 = 0; a2 < 256; a2++) {
            t2 = a2;
            for (var n2 = 0; n2 < 8; n2++)
              t2 = 1 & t2 ? 3988292384 ^ t2 >>> 1 : t2 >>> 1;
            e2[a2] = t2;
          }
          return e2;
        }()), H = function(t2, e2, a2, n2) {
          var i2 = M, r2 = n2 + a2;
          t2 ^= -1;
          for (var s2 = n2; s2 < r2; s2++)
            t2 = t2 >>> 8 ^ i2[255 & (t2 ^ e2[s2])];
          return -1 ^ t2;
        }, j = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" }, K = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_MEM_ERROR: -4, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 }, P = B._tr_init, Y = B._tr_stored_block, G = B._tr_flush_block, X = B._tr_tally, W = B._tr_align, q = K.Z_NO_FLUSH, J = K.Z_PARTIAL_FLUSH, Q = K.Z_FULL_FLUSH, V = K.Z_FINISH, $ = K.Z_BLOCK, tt = K.Z_OK, et = K.Z_STREAM_END, at = K.Z_STREAM_ERROR, nt = K.Z_DATA_ERROR, it = K.Z_BUF_ERROR, rt = K.Z_DEFAULT_COMPRESSION, st = K.Z_FILTERED, ot = K.Z_HUFFMAN_ONLY, lt = K.Z_RLE, ht = K.Z_FIXED, dt = K.Z_DEFAULT_STRATEGY, _t = K.Z_UNKNOWN, ft = K.Z_DEFLATED, ut = 258, ct = 262, wt = 42, mt = 113, bt = 666, gt = function(t2, e2) {
          return t2.msg = j[e2], e2;
        }, pt = function(t2) {
          return 2 * t2 - (t2 > 4 ? 9 : 0);
        }, vt = function(t2) {
          for (var e2 = t2.length; --e2 >= 0; )
            t2[e2] = 0;
        }, kt = function(t2) {
          var e2, a2, n2, i2 = t2.w_size;
          n2 = e2 = t2.hash_size;
          do {
            a2 = t2.head[--n2], t2.head[n2] = a2 >= i2 ? a2 - i2 : 0;
          } while (--e2);
          n2 = e2 = i2;
          do {
            a2 = t2.prev[--n2], t2.prev[n2] = a2 >= i2 ? a2 - i2 : 0;
          } while (--e2);
        }, yt = function(t2, e2, a2) {
          return (e2 << t2.hash_shift ^ a2) & t2.hash_mask;
        }, xt = function(t2) {
          var e2 = t2.state, a2 = e2.pending;
          a2 > t2.avail_out && (a2 = t2.avail_out), 0 !== a2 && (t2.output.set(e2.pending_buf.subarray(e2.pending_out, e2.pending_out + a2), t2.next_out), t2.next_out += a2, e2.pending_out += a2, t2.total_out += a2, t2.avail_out -= a2, e2.pending -= a2, 0 === e2.pending && (e2.pending_out = 0));
        }, zt = function(t2, e2) {
          G(t2, t2.block_start >= 0 ? t2.block_start : -1, t2.strstart - t2.block_start, e2), t2.block_start = t2.strstart, xt(t2.strm);
        }, At = function(t2, e2) {
          t2.pending_buf[t2.pending++] = e2;
        }, Et = function(t2, e2) {
          t2.pending_buf[t2.pending++] = e2 >>> 8 & 255, t2.pending_buf[t2.pending++] = 255 & e2;
        }, Rt = function(t2, e2, a2, n2) {
          var i2 = t2.avail_in;
          return i2 > n2 && (i2 = n2), 0 === i2 ? 0 : (t2.avail_in -= i2, e2.set(t2.input.subarray(t2.next_in, t2.next_in + i2), a2), 1 === t2.state.wrap ? t2.adler = C(t2.adler, e2, i2, a2) : 2 === t2.state.wrap && (t2.adler = H(t2.adler, e2, i2, a2)), t2.next_in += i2, t2.total_in += i2, i2);
        }, Zt = function(t2, e2) {
          var a2, n2, i2 = t2.max_chain_length, r2 = t2.strstart, s2 = t2.prev_length, o2 = t2.nice_match, l2 = t2.strstart > t2.w_size - ct ? t2.strstart - (t2.w_size - ct) : 0, h2 = t2.window, d2 = t2.w_mask, _2 = t2.prev, f2 = t2.strstart + ut, u2 = h2[r2 + s2 - 1], c2 = h2[r2 + s2];
          t2.prev_length >= t2.good_match && (i2 >>= 2), o2 > t2.lookahead && (o2 = t2.lookahead);
          do {
            if (h2[(a2 = e2) + s2] === c2 && h2[a2 + s2 - 1] === u2 && h2[a2] === h2[r2] && h2[++a2] === h2[r2 + 1]) {
              r2 += 2, a2++;
              do {
              } while (h2[++r2] === h2[++a2] && h2[++r2] === h2[++a2] && h2[++r2] === h2[++a2] && h2[++r2] === h2[++a2] && h2[++r2] === h2[++a2] && h2[++r2] === h2[++a2] && h2[++r2] === h2[++a2] && h2[++r2] === h2[++a2] && r2 < f2);
              if (n2 = ut - (f2 - r2), r2 = f2 - ut, n2 > s2) {
                if (t2.match_start = e2, s2 = n2, n2 >= o2)
                  break;
                u2 = h2[r2 + s2 - 1], c2 = h2[r2 + s2];
              }
            }
          } while ((e2 = _2[e2 & d2]) > l2 && 0 != --i2);
          return s2 <= t2.lookahead ? s2 : t2.lookahead;
        }, St = function(t2) {
          var e2, a2, n2, i2 = t2.w_size;
          do {
            if (a2 = t2.window_size - t2.lookahead - t2.strstart, t2.strstart >= i2 + (i2 - ct) && (t2.window.set(t2.window.subarray(i2, i2 + i2 - a2), 0), t2.match_start -= i2, t2.strstart -= i2, t2.block_start -= i2, t2.insert > t2.strstart && (t2.insert = t2.strstart), kt(t2), a2 += i2), 0 === t2.strm.avail_in)
              break;
            if (e2 = Rt(t2.strm, t2.window, t2.strstart + t2.lookahead, a2), t2.lookahead += e2, t2.lookahead + t2.insert >= 3)
              for (n2 = t2.strstart - t2.insert, t2.ins_h = t2.window[n2], t2.ins_h = yt(t2, t2.ins_h, t2.window[n2 + 1]); t2.insert && (t2.ins_h = yt(t2, t2.ins_h, t2.window[n2 + 3 - 1]), t2.prev[n2 & t2.w_mask] = t2.head[t2.ins_h], t2.head[t2.ins_h] = n2, n2++, t2.insert--, !(t2.lookahead + t2.insert < 3)); )
                ;
          } while (t2.lookahead < ct && 0 !== t2.strm.avail_in);
        }, Ut = function(t2, e2) {
          var a2, n2, i2, r2 = t2.pending_buf_size - 5 > t2.w_size ? t2.w_size : t2.pending_buf_size - 5, s2 = 0, o2 = t2.strm.avail_in;
          do {
            if (a2 = 65535, i2 = t2.bi_valid + 42 >> 3, t2.strm.avail_out < i2)
              break;
            if (i2 = t2.strm.avail_out - i2, a2 > (n2 = t2.strstart - t2.block_start) + t2.strm.avail_in && (a2 = n2 + t2.strm.avail_in), a2 > i2 && (a2 = i2), a2 < r2 && (0 === a2 && e2 !== V || e2 === q || a2 !== n2 + t2.strm.avail_in))
              break;
            s2 = e2 === V && a2 === n2 + t2.strm.avail_in ? 1 : 0, Y(t2, 0, 0, s2), t2.pending_buf[t2.pending - 4] = a2, t2.pending_buf[t2.pending - 3] = a2 >> 8, t2.pending_buf[t2.pending - 2] = ~a2, t2.pending_buf[t2.pending - 1] = ~a2 >> 8, xt(t2.strm), n2 && (n2 > a2 && (n2 = a2), t2.strm.output.set(t2.window.subarray(t2.block_start, t2.block_start + n2), t2.strm.next_out), t2.strm.next_out += n2, t2.strm.avail_out -= n2, t2.strm.total_out += n2, t2.block_start += n2, a2 -= n2), a2 && (Rt(t2.strm, t2.strm.output, t2.strm.next_out, a2), t2.strm.next_out += a2, t2.strm.avail_out -= a2, t2.strm.total_out += a2);
          } while (0 === s2);
          return (o2 -= t2.strm.avail_in) && (o2 >= t2.w_size ? (t2.matches = 2, t2.window.set(t2.strm.input.subarray(t2.strm.next_in - t2.w_size, t2.strm.next_in), 0), t2.strstart = t2.w_size, t2.insert = t2.strstart) : (t2.window_size - t2.strstart <= o2 && (t2.strstart -= t2.w_size, t2.window.set(t2.window.subarray(t2.w_size, t2.w_size + t2.strstart), 0), t2.matches < 2 && t2.matches++, t2.insert > t2.strstart && (t2.insert = t2.strstart)), t2.window.set(t2.strm.input.subarray(t2.strm.next_in - o2, t2.strm.next_in), t2.strstart), t2.strstart += o2, t2.insert += o2 > t2.w_size - t2.insert ? t2.w_size - t2.insert : o2), t2.block_start = t2.strstart), t2.high_water < t2.strstart && (t2.high_water = t2.strstart), s2 ? 4 : e2 !== q && e2 !== V && 0 === t2.strm.avail_in && t2.strstart === t2.block_start ? 2 : (i2 = t2.window_size - t2.strstart, t2.strm.avail_in > i2 && t2.block_start >= t2.w_size && (t2.block_start -= t2.w_size, t2.strstart -= t2.w_size, t2.window.set(t2.window.subarray(t2.w_size, t2.w_size + t2.strstart), 0), t2.matches < 2 && t2.matches++, i2 += t2.w_size, t2.insert > t2.strstart && (t2.insert = t2.strstart)), i2 > t2.strm.avail_in && (i2 = t2.strm.avail_in), i2 && (Rt(t2.strm, t2.window, t2.strstart, i2), t2.strstart += i2, t2.insert += i2 > t2.w_size - t2.insert ? t2.w_size - t2.insert : i2), t2.high_water < t2.strstart && (t2.high_water = t2.strstart), i2 = t2.bi_valid + 42 >> 3, r2 = (i2 = t2.pending_buf_size - i2 > 65535 ? 65535 : t2.pending_buf_size - i2) > t2.w_size ? t2.w_size : i2, ((n2 = t2.strstart - t2.block_start) >= r2 || (n2 || e2 === V) && e2 !== q && 0 === t2.strm.avail_in && n2 <= i2) && (a2 = n2 > i2 ? i2 : n2, s2 = e2 === V && 0 === t2.strm.avail_in && a2 === n2 ? 1 : 0, Y(t2, t2.block_start, a2, s2), t2.block_start += a2, xt(t2.strm)), s2 ? 3 : 1);
        }, Dt = function(t2, e2) {
          for (var a2, n2; ; ) {
            if (t2.lookahead < ct) {
              if (St(t2), t2.lookahead < ct && e2 === q)
                return 1;
              if (0 === t2.lookahead)
                break;
            }
            if (a2 = 0, t2.lookahead >= 3 && (t2.ins_h = yt(t2, t2.ins_h, t2.window[t2.strstart + 3 - 1]), a2 = t2.prev[t2.strstart & t2.w_mask] = t2.head[t2.ins_h], t2.head[t2.ins_h] = t2.strstart), 0 !== a2 && t2.strstart - a2 <= t2.w_size - ct && (t2.match_length = Zt(t2, a2)), t2.match_length >= 3)
              if (n2 = X(t2, t2.strstart - t2.match_start, t2.match_length - 3), t2.lookahead -= t2.match_length, t2.match_length <= t2.max_lazy_match && t2.lookahead >= 3) {
                t2.match_length--;
                do {
                  t2.strstart++, t2.ins_h = yt(t2, t2.ins_h, t2.window[t2.strstart + 3 - 1]), a2 = t2.prev[t2.strstart & t2.w_mask] = t2.head[t2.ins_h], t2.head[t2.ins_h] = t2.strstart;
                } while (0 != --t2.match_length);
                t2.strstart++;
              } else
                t2.strstart += t2.match_length, t2.match_length = 0, t2.ins_h = t2.window[t2.strstart], t2.ins_h = yt(t2, t2.ins_h, t2.window[t2.strstart + 1]);
            else
              n2 = X(t2, 0, t2.window[t2.strstart]), t2.lookahead--, t2.strstart++;
            if (n2 && (zt(t2, false), 0 === t2.strm.avail_out))
              return 1;
          }
          return t2.insert = t2.strstart < 2 ? t2.strstart : 2, e2 === V ? (zt(t2, true), 0 === t2.strm.avail_out ? 3 : 4) : t2.sym_next && (zt(t2, false), 0 === t2.strm.avail_out) ? 1 : 2;
        }, Tt = function(t2, e2) {
          for (var a2, n2, i2; ; ) {
            if (t2.lookahead < ct) {
              if (St(t2), t2.lookahead < ct && e2 === q)
                return 1;
              if (0 === t2.lookahead)
                break;
            }
            if (a2 = 0, t2.lookahead >= 3 && (t2.ins_h = yt(t2, t2.ins_h, t2.window[t2.strstart + 3 - 1]), a2 = t2.prev[t2.strstart & t2.w_mask] = t2.head[t2.ins_h], t2.head[t2.ins_h] = t2.strstart), t2.prev_length = t2.match_length, t2.prev_match = t2.match_start, t2.match_length = 2, 0 !== a2 && t2.prev_length < t2.max_lazy_match && t2.strstart - a2 <= t2.w_size - ct && (t2.match_length = Zt(t2, a2), t2.match_length <= 5 && (t2.strategy === st || 3 === t2.match_length && t2.strstart - t2.match_start > 4096) && (t2.match_length = 2)), t2.prev_length >= 3 && t2.match_length <= t2.prev_length) {
              i2 = t2.strstart + t2.lookahead - 3, n2 = X(t2, t2.strstart - 1 - t2.prev_match, t2.prev_length - 3), t2.lookahead -= t2.prev_length - 1, t2.prev_length -= 2;
              do {
                ++t2.strstart <= i2 && (t2.ins_h = yt(t2, t2.ins_h, t2.window[t2.strstart + 3 - 1]), a2 = t2.prev[t2.strstart & t2.w_mask] = t2.head[t2.ins_h], t2.head[t2.ins_h] = t2.strstart);
              } while (0 != --t2.prev_length);
              if (t2.match_available = 0, t2.match_length = 2, t2.strstart++, n2 && (zt(t2, false), 0 === t2.strm.avail_out))
                return 1;
            } else if (t2.match_available) {
              if ((n2 = X(t2, 0, t2.window[t2.strstart - 1])) && zt(t2, false), t2.strstart++, t2.lookahead--, 0 === t2.strm.avail_out)
                return 1;
            } else
              t2.match_available = 1, t2.strstart++, t2.lookahead--;
          }
          return t2.match_available && (n2 = X(t2, 0, t2.window[t2.strstart - 1]), t2.match_available = 0), t2.insert = t2.strstart < 2 ? t2.strstart : 2, e2 === V ? (zt(t2, true), 0 === t2.strm.avail_out ? 3 : 4) : t2.sym_next && (zt(t2, false), 0 === t2.strm.avail_out) ? 1 : 2;
        };
        function Ot(t2, e2, a2, n2, i2) {
          this.good_length = t2, this.max_lazy = e2, this.nice_length = a2, this.max_chain = n2, this.func = i2;
        }
        var It = [new Ot(0, 0, 0, 0, Ut), new Ot(4, 4, 8, 4, Dt), new Ot(4, 5, 16, 8, Dt), new Ot(4, 6, 32, 32, Dt), new Ot(4, 4, 16, 16, Tt), new Ot(8, 16, 32, 32, Tt), new Ot(8, 16, 128, 128, Tt), new Ot(8, 32, 128, 256, Tt), new Ot(32, 128, 258, 1024, Tt), new Ot(32, 258, 258, 4096, Tt)];
        function Ft() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = ft, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(1146), this.dyn_dtree = new Uint16Array(122), this.bl_tree = new Uint16Array(78), vt(this.dyn_ltree), vt(this.dyn_dtree), vt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(16), this.heap = new Uint16Array(573), vt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(573), vt(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        var Lt = function(t2) {
          if (!t2)
            return 1;
          var e2 = t2.state;
          return !e2 || e2.strm !== t2 || e2.status !== wt && 57 !== e2.status && 69 !== e2.status && 73 !== e2.status && 91 !== e2.status && 103 !== e2.status && e2.status !== mt && e2.status !== bt ? 1 : 0;
        }, Nt = function(t2) {
          if (Lt(t2))
            return gt(t2, at);
          t2.total_in = t2.total_out = 0, t2.data_type = _t;
          var e2 = t2.state;
          return e2.pending = 0, e2.pending_out = 0, e2.wrap < 0 && (e2.wrap = -e2.wrap), e2.status = 2 === e2.wrap ? 57 : e2.wrap ? wt : mt, t2.adler = 2 === e2.wrap ? 0 : 1, e2.last_flush = -2, P(e2), tt;
        }, Bt = function(t2) {
          var e2, a2 = Nt(t2);
          return a2 === tt && ((e2 = t2.state).window_size = 2 * e2.w_size, vt(e2.head), e2.max_lazy_match = It[e2.level].max_lazy, e2.good_match = It[e2.level].good_length, e2.nice_match = It[e2.level].nice_length, e2.max_chain_length = It[e2.level].max_chain, e2.strstart = 0, e2.block_start = 0, e2.lookahead = 0, e2.insert = 0, e2.match_length = e2.prev_length = 2, e2.match_available = 0, e2.ins_h = 0), a2;
        }, Ct = function(t2, e2, a2, n2, i2, r2) {
          if (!t2)
            return at;
          var s2 = 1;
          if (e2 === rt && (e2 = 6), n2 < 0 ? (s2 = 0, n2 = -n2) : n2 > 15 && (s2 = 2, n2 -= 16), i2 < 1 || i2 > 9 || a2 !== ft || n2 < 8 || n2 > 15 || e2 < 0 || e2 > 9 || r2 < 0 || r2 > ht || 8 === n2 && 1 !== s2)
            return gt(t2, at);
          8 === n2 && (n2 = 9);
          var o2 = new Ft();
          return t2.state = o2, o2.strm = t2, o2.status = wt, o2.wrap = s2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + 3 - 1) / 3), o2.window = new Uint8Array(2 * o2.w_size), o2.head = new Uint16Array(o2.hash_size), o2.prev = new Uint16Array(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new Uint8Array(o2.pending_buf_size), o2.sym_buf = o2.lit_bufsize, o2.sym_end = 3 * (o2.lit_bufsize - 1), o2.level = e2, o2.strategy = r2, o2.method = a2, Bt(t2);
        }, Mt = { deflateInit: function(t2, e2) {
          return Ct(t2, e2, ft, 15, 8, dt);
        }, deflateInit2: Ct, deflateReset: Bt, deflateResetKeep: Nt, deflateSetHeader: function(t2, e2) {
          return Lt(t2) || 2 !== t2.state.wrap ? at : (t2.state.gzhead = e2, tt);
        }, deflate: function(t2, e2) {
          if (Lt(t2) || e2 > $ || e2 < 0)
            return t2 ? gt(t2, at) : at;
          var a2 = t2.state;
          if (!t2.output || 0 !== t2.avail_in && !t2.input || a2.status === bt && e2 !== V)
            return gt(t2, 0 === t2.avail_out ? it : at);
          var n2 = a2.last_flush;
          if (a2.last_flush = e2, 0 !== a2.pending) {
            if (xt(t2), 0 === t2.avail_out)
              return a2.last_flush = -1, tt;
          } else if (0 === t2.avail_in && pt(e2) <= pt(n2) && e2 !== V)
            return gt(t2, it);
          if (a2.status === bt && 0 !== t2.avail_in)
            return gt(t2, it);
          if (a2.status === wt && 0 === a2.wrap && (a2.status = mt), a2.status === wt) {
            var i2 = ft + (a2.w_bits - 8 << 4) << 8;
            if (i2 |= (a2.strategy >= ot || a2.level < 2 ? 0 : a2.level < 6 ? 1 : 6 === a2.level ? 2 : 3) << 6, 0 !== a2.strstart && (i2 |= 32), Et(a2, i2 += 31 - i2 % 31), 0 !== a2.strstart && (Et(a2, t2.adler >>> 16), Et(a2, 65535 & t2.adler)), t2.adler = 1, a2.status = mt, xt(t2), 0 !== a2.pending)
              return a2.last_flush = -1, tt;
          }
          if (57 === a2.status) {
            if (t2.adler = 0, At(a2, 31), At(a2, 139), At(a2, 8), a2.gzhead)
              At(a2, (a2.gzhead.text ? 1 : 0) + (a2.gzhead.hcrc ? 2 : 0) + (a2.gzhead.extra ? 4 : 0) + (a2.gzhead.name ? 8 : 0) + (a2.gzhead.comment ? 16 : 0)), At(a2, 255 & a2.gzhead.time), At(a2, a2.gzhead.time >> 8 & 255), At(a2, a2.gzhead.time >> 16 & 255), At(a2, a2.gzhead.time >> 24 & 255), At(a2, 9 === a2.level ? 2 : a2.strategy >= ot || a2.level < 2 ? 4 : 0), At(a2, 255 & a2.gzhead.os), a2.gzhead.extra && a2.gzhead.extra.length && (At(a2, 255 & a2.gzhead.extra.length), At(a2, a2.gzhead.extra.length >> 8 & 255)), a2.gzhead.hcrc && (t2.adler = H(t2.adler, a2.pending_buf, a2.pending, 0)), a2.gzindex = 0, a2.status = 69;
            else if (At(a2, 0), At(a2, 0), At(a2, 0), At(a2, 0), At(a2, 0), At(a2, 9 === a2.level ? 2 : a2.strategy >= ot || a2.level < 2 ? 4 : 0), At(a2, 3), a2.status = mt, xt(t2), 0 !== a2.pending)
              return a2.last_flush = -1, tt;
          }
          if (69 === a2.status) {
            if (a2.gzhead.extra) {
              for (var r2 = a2.pending, s2 = (65535 & a2.gzhead.extra.length) - a2.gzindex; a2.pending + s2 > a2.pending_buf_size; ) {
                var o2 = a2.pending_buf_size - a2.pending;
                if (a2.pending_buf.set(a2.gzhead.extra.subarray(a2.gzindex, a2.gzindex + o2), a2.pending), a2.pending = a2.pending_buf_size, a2.gzhead.hcrc && a2.pending > r2 && (t2.adler = H(t2.adler, a2.pending_buf, a2.pending - r2, r2)), a2.gzindex += o2, xt(t2), 0 !== a2.pending)
                  return a2.last_flush = -1, tt;
                r2 = 0, s2 -= o2;
              }
              var l2 = new Uint8Array(a2.gzhead.extra);
              a2.pending_buf.set(l2.subarray(a2.gzindex, a2.gzindex + s2), a2.pending), a2.pending += s2, a2.gzhead.hcrc && a2.pending > r2 && (t2.adler = H(t2.adler, a2.pending_buf, a2.pending - r2, r2)), a2.gzindex = 0;
            }
            a2.status = 73;
          }
          if (73 === a2.status) {
            if (a2.gzhead.name) {
              var h2, d2 = a2.pending;
              do {
                if (a2.pending === a2.pending_buf_size) {
                  if (a2.gzhead.hcrc && a2.pending > d2 && (t2.adler = H(t2.adler, a2.pending_buf, a2.pending - d2, d2)), xt(t2), 0 !== a2.pending)
                    return a2.last_flush = -1, tt;
                  d2 = 0;
                }
                h2 = a2.gzindex < a2.gzhead.name.length ? 255 & a2.gzhead.name.charCodeAt(a2.gzindex++) : 0, At(a2, h2);
              } while (0 !== h2);
              a2.gzhead.hcrc && a2.pending > d2 && (t2.adler = H(t2.adler, a2.pending_buf, a2.pending - d2, d2)), a2.gzindex = 0;
            }
            a2.status = 91;
          }
          if (91 === a2.status) {
            if (a2.gzhead.comment) {
              var _2, f2 = a2.pending;
              do {
                if (a2.pending === a2.pending_buf_size) {
                  if (a2.gzhead.hcrc && a2.pending > f2 && (t2.adler = H(t2.adler, a2.pending_buf, a2.pending - f2, f2)), xt(t2), 0 !== a2.pending)
                    return a2.last_flush = -1, tt;
                  f2 = 0;
                }
                _2 = a2.gzindex < a2.gzhead.comment.length ? 255 & a2.gzhead.comment.charCodeAt(a2.gzindex++) : 0, At(a2, _2);
              } while (0 !== _2);
              a2.gzhead.hcrc && a2.pending > f2 && (t2.adler = H(t2.adler, a2.pending_buf, a2.pending - f2, f2));
            }
            a2.status = 103;
          }
          if (103 === a2.status) {
            if (a2.gzhead.hcrc) {
              if (a2.pending + 2 > a2.pending_buf_size && (xt(t2), 0 !== a2.pending))
                return a2.last_flush = -1, tt;
              At(a2, 255 & t2.adler), At(a2, t2.adler >> 8 & 255), t2.adler = 0;
            }
            if (a2.status = mt, xt(t2), 0 !== a2.pending)
              return a2.last_flush = -1, tt;
          }
          if (0 !== t2.avail_in || 0 !== a2.lookahead || e2 !== q && a2.status !== bt) {
            var u2 = 0 === a2.level ? Ut(a2, e2) : a2.strategy === ot ? function(t3, e3) {
              for (var a3; ; ) {
                if (0 === t3.lookahead && (St(t3), 0 === t3.lookahead)) {
                  if (e3 === q)
                    return 1;
                  break;
                }
                if (t3.match_length = 0, a3 = X(t3, 0, t3.window[t3.strstart]), t3.lookahead--, t3.strstart++, a3 && (zt(t3, false), 0 === t3.strm.avail_out))
                  return 1;
              }
              return t3.insert = 0, e3 === V ? (zt(t3, true), 0 === t3.strm.avail_out ? 3 : 4) : t3.sym_next && (zt(t3, false), 0 === t3.strm.avail_out) ? 1 : 2;
            }(a2, e2) : a2.strategy === lt ? function(t3, e3) {
              for (var a3, n3, i3, r3, s3 = t3.window; ; ) {
                if (t3.lookahead <= ut) {
                  if (St(t3), t3.lookahead <= ut && e3 === q)
                    return 1;
                  if (0 === t3.lookahead)
                    break;
                }
                if (t3.match_length = 0, t3.lookahead >= 3 && t3.strstart > 0 && (n3 = s3[i3 = t3.strstart - 1]) === s3[++i3] && n3 === s3[++i3] && n3 === s3[++i3]) {
                  r3 = t3.strstart + ut;
                  do {
                  } while (n3 === s3[++i3] && n3 === s3[++i3] && n3 === s3[++i3] && n3 === s3[++i3] && n3 === s3[++i3] && n3 === s3[++i3] && n3 === s3[++i3] && n3 === s3[++i3] && i3 < r3);
                  t3.match_length = ut - (r3 - i3), t3.match_length > t3.lookahead && (t3.match_length = t3.lookahead);
                }
                if (t3.match_length >= 3 ? (a3 = X(t3, 1, t3.match_length - 3), t3.lookahead -= t3.match_length, t3.strstart += t3.match_length, t3.match_length = 0) : (a3 = X(t3, 0, t3.window[t3.strstart]), t3.lookahead--, t3.strstart++), a3 && (zt(t3, false), 0 === t3.strm.avail_out))
                  return 1;
              }
              return t3.insert = 0, e3 === V ? (zt(t3, true), 0 === t3.strm.avail_out ? 3 : 4) : t3.sym_next && (zt(t3, false), 0 === t3.strm.avail_out) ? 1 : 2;
            }(a2, e2) : It[a2.level].func(a2, e2);
            if (3 !== u2 && 4 !== u2 || (a2.status = bt), 1 === u2 || 3 === u2)
              return 0 === t2.avail_out && (a2.last_flush = -1), tt;
            if (2 === u2 && (e2 === J ? W(a2) : e2 !== $ && (Y(a2, 0, 0, false), e2 === Q && (vt(a2.head), 0 === a2.lookahead && (a2.strstart = 0, a2.block_start = 0, a2.insert = 0))), xt(t2), 0 === t2.avail_out))
              return a2.last_flush = -1, tt;
          }
          return e2 !== V ? tt : a2.wrap <= 0 ? et : (2 === a2.wrap ? (At(a2, 255 & t2.adler), At(a2, t2.adler >> 8 & 255), At(a2, t2.adler >> 16 & 255), At(a2, t2.adler >> 24 & 255), At(a2, 255 & t2.total_in), At(a2, t2.total_in >> 8 & 255), At(a2, t2.total_in >> 16 & 255), At(a2, t2.total_in >> 24 & 255)) : (Et(a2, t2.adler >>> 16), Et(a2, 65535 & t2.adler)), xt(t2), a2.wrap > 0 && (a2.wrap = -a2.wrap), 0 !== a2.pending ? tt : et);
        }, deflateEnd: function(t2) {
          if (Lt(t2))
            return at;
          var e2 = t2.state.status;
          return t2.state = null, e2 === mt ? gt(t2, nt) : tt;
        }, deflateSetDictionary: function(t2, e2) {
          var a2 = e2.length;
          if (Lt(t2))
            return at;
          var n2 = t2.state, i2 = n2.wrap;
          if (2 === i2 || 1 === i2 && n2.status !== wt || n2.lookahead)
            return at;
          if (1 === i2 && (t2.adler = C(t2.adler, e2, a2, 0)), n2.wrap = 0, a2 >= n2.w_size) {
            0 === i2 && (vt(n2.head), n2.strstart = 0, n2.block_start = 0, n2.insert = 0);
            var r2 = new Uint8Array(n2.w_size);
            r2.set(e2.subarray(a2 - n2.w_size, a2), 0), e2 = r2, a2 = n2.w_size;
          }
          var s2 = t2.avail_in, o2 = t2.next_in, l2 = t2.input;
          for (t2.avail_in = a2, t2.next_in = 0, t2.input = e2, St(n2); n2.lookahead >= 3; ) {
            var h2 = n2.strstart, d2 = n2.lookahead - 2;
            do {
              n2.ins_h = yt(n2, n2.ins_h, n2.window[h2 + 3 - 1]), n2.prev[h2 & n2.w_mask] = n2.head[n2.ins_h], n2.head[n2.ins_h] = h2, h2++;
            } while (--d2);
            n2.strstart = h2, n2.lookahead = 2, St(n2);
          }
          return n2.strstart += n2.lookahead, n2.block_start = n2.strstart, n2.insert = n2.lookahead, n2.lookahead = 0, n2.match_length = n2.prev_length = 2, n2.match_available = 0, t2.next_in = o2, t2.input = l2, t2.avail_in = s2, n2.wrap = i2, tt;
        }, deflateInfo: "pako deflate (from Nodeca project)" };
        function Ht(t2) {
          return Ht = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t3) {
            return typeof t3;
          } : function(t3) {
            return t3 && "function" == typeof Symbol && t3.constructor === Symbol && t3 !== Symbol.prototype ? "symbol" : typeof t3;
          }, Ht(t2);
        }
        var jt = function(t2, e2) {
          return Object.prototype.hasOwnProperty.call(t2, e2);
        }, Kt = function(t2) {
          for (var e2 = Array.prototype.slice.call(arguments, 1); e2.length; ) {
            var a2 = e2.shift();
            if (a2) {
              if ("object" !== Ht(a2))
                throw new TypeError(a2 + "must be non-object");
              for (var n2 in a2)
                jt(a2, n2) && (t2[n2] = a2[n2]);
            }
          }
          return t2;
        }, Pt = function(t2) {
          for (var e2 = 0, a2 = 0, n2 = t2.length; a2 < n2; a2++)
            e2 += t2[a2].length;
          for (var i2 = new Uint8Array(e2), r2 = 0, s2 = 0, o2 = t2.length; r2 < o2; r2++) {
            var l2 = t2[r2];
            i2.set(l2, s2), s2 += l2.length;
          }
          return i2;
        }, Yt = true;
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch (t2) {
          Yt = false;
        }
        for (var Gt = new Uint8Array(256), Xt = 0; Xt < 256; Xt++)
          Gt[Xt] = Xt >= 252 ? 6 : Xt >= 248 ? 5 : Xt >= 240 ? 4 : Xt >= 224 ? 3 : Xt >= 192 ? 2 : 1;
        Gt[254] = Gt[254] = 1;
        var Wt = function(t2) {
          if ("function" == typeof TextEncoder && TextEncoder.prototype.encode)
            return new TextEncoder().encode(t2);
          var e2, a2, n2, i2, r2, s2 = t2.length, o2 = 0;
          for (i2 = 0; i2 < s2; i2++)
            55296 == (64512 & (a2 = t2.charCodeAt(i2))) && i2 + 1 < s2 && 56320 == (64512 & (n2 = t2.charCodeAt(i2 + 1))) && (a2 = 65536 + (a2 - 55296 << 10) + (n2 - 56320), i2++), o2 += a2 < 128 ? 1 : a2 < 2048 ? 2 : a2 < 65536 ? 3 : 4;
          for (e2 = new Uint8Array(o2), r2 = 0, i2 = 0; r2 < o2; i2++)
            55296 == (64512 & (a2 = t2.charCodeAt(i2))) && i2 + 1 < s2 && 56320 == (64512 & (n2 = t2.charCodeAt(i2 + 1))) && (a2 = 65536 + (a2 - 55296 << 10) + (n2 - 56320), i2++), a2 < 128 ? e2[r2++] = a2 : a2 < 2048 ? (e2[r2++] = 192 | a2 >>> 6, e2[r2++] = 128 | 63 & a2) : a2 < 65536 ? (e2[r2++] = 224 | a2 >>> 12, e2[r2++] = 128 | a2 >>> 6 & 63, e2[r2++] = 128 | 63 & a2) : (e2[r2++] = 240 | a2 >>> 18, e2[r2++] = 128 | a2 >>> 12 & 63, e2[r2++] = 128 | a2 >>> 6 & 63, e2[r2++] = 128 | 63 & a2);
          return e2;
        }, qt = function(t2, e2) {
          var a2, n2, i2 = e2 || t2.length;
          if ("function" == typeof TextDecoder && TextDecoder.prototype.decode)
            return new TextDecoder().decode(t2.subarray(0, e2));
          var r2 = new Array(2 * i2);
          for (n2 = 0, a2 = 0; a2 < i2; ) {
            var s2 = t2[a2++];
            if (s2 < 128)
              r2[n2++] = s2;
            else {
              var o2 = Gt[s2];
              if (o2 > 4)
                r2[n2++] = 65533, a2 += o2 - 1;
              else {
                for (s2 &= 2 === o2 ? 31 : 3 === o2 ? 15 : 7; o2 > 1 && a2 < i2; )
                  s2 = s2 << 6 | 63 & t2[a2++], o2--;
                o2 > 1 ? r2[n2++] = 65533 : s2 < 65536 ? r2[n2++] = s2 : (s2 -= 65536, r2[n2++] = 55296 | s2 >> 10 & 1023, r2[n2++] = 56320 | 1023 & s2);
              }
            }
          }
          return function(t3, e3) {
            if (e3 < 65534 && t3.subarray && Yt)
              return String.fromCharCode.apply(null, t3.length === e3 ? t3 : t3.subarray(0, e3));
            for (var a3 = "", n3 = 0; n3 < e3; n3++)
              a3 += String.fromCharCode(t3[n3]);
            return a3;
          }(r2, n2);
        }, Jt = function(t2, e2) {
          (e2 = e2 || t2.length) > t2.length && (e2 = t2.length);
          for (var a2 = e2 - 1; a2 >= 0 && 128 == (192 & t2[a2]); )
            a2--;
          return a2 < 0 || 0 === a2 ? e2 : a2 + Gt[t2[a2]] > e2 ? a2 : e2;
        };
        var Qt = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        }, Vt = Object.prototype.toString, $t = K.Z_NO_FLUSH, te = K.Z_SYNC_FLUSH, ee = K.Z_FULL_FLUSH, ae = K.Z_FINISH, ne = K.Z_OK, ie = K.Z_STREAM_END, re = K.Z_DEFAULT_COMPRESSION, se = K.Z_DEFAULT_STRATEGY, oe = K.Z_DEFLATED;
        function le(t2) {
          this.options = Kt({ level: re, method: oe, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: se }, t2 || {});
          var e2 = this.options;
          e2.raw && e2.windowBits > 0 ? e2.windowBits = -e2.windowBits : e2.gzip && e2.windowBits > 0 && e2.windowBits < 16 && (e2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new Qt(), this.strm.avail_out = 0;
          var a2 = Mt.deflateInit2(this.strm, e2.level, e2.method, e2.windowBits, e2.memLevel, e2.strategy);
          if (a2 !== ne)
            throw new Error(j[a2]);
          if (e2.header && Mt.deflateSetHeader(this.strm, e2.header), e2.dictionary) {
            var n2;
            if (n2 = "string" == typeof e2.dictionary ? Wt(e2.dictionary) : "[object ArrayBuffer]" === Vt.call(e2.dictionary) ? new Uint8Array(e2.dictionary) : e2.dictionary, (a2 = Mt.deflateSetDictionary(this.strm, n2)) !== ne)
              throw new Error(j[a2]);
            this._dict_set = true;
          }
        }
        function he(t2, e2) {
          var a2 = new le(e2);
          if (a2.push(t2, true), a2.err)
            throw a2.msg || j[a2.err];
          return a2.result;
        }
        le.prototype.push = function(t2, e2) {
          var a2, n2, i2 = this.strm, r2 = this.options.chunkSize;
          if (this.ended)
            return false;
          for (n2 = e2 === ~~e2 ? e2 : true === e2 ? ae : $t, "string" == typeof t2 ? i2.input = Wt(t2) : "[object ArrayBuffer]" === Vt.call(t2) ? i2.input = new Uint8Array(t2) : i2.input = t2, i2.next_in = 0, i2.avail_in = i2.input.length; ; )
            if (0 === i2.avail_out && (i2.output = new Uint8Array(r2), i2.next_out = 0, i2.avail_out = r2), (n2 === te || n2 === ee) && i2.avail_out <= 6)
              this.onData(i2.output.subarray(0, i2.next_out)), i2.avail_out = 0;
            else {
              if ((a2 = Mt.deflate(i2, n2)) === ie)
                return i2.next_out > 0 && this.onData(i2.output.subarray(0, i2.next_out)), a2 = Mt.deflateEnd(this.strm), this.onEnd(a2), this.ended = true, a2 === ne;
              if (0 !== i2.avail_out) {
                if (n2 > 0 && i2.next_out > 0)
                  this.onData(i2.output.subarray(0, i2.next_out)), i2.avail_out = 0;
                else if (0 === i2.avail_in)
                  break;
              } else
                this.onData(i2.output);
            }
          return true;
        }, le.prototype.onData = function(t2) {
          this.chunks.push(t2);
        }, le.prototype.onEnd = function(t2) {
          t2 === ne && (this.result = Pt(this.chunks)), this.chunks = [], this.err = t2, this.msg = this.strm.msg;
        };
        var de = { Deflate: le, deflate: he, deflateRaw: function(t2, e2) {
          return (e2 = e2 || {}).raw = true, he(t2, e2);
        }, gzip: function(t2, e2) {
          return (e2 = e2 || {}).gzip = true, he(t2, e2);
        }, constants: K }, _e = 16209, fe = function(t2, e2) {
          var a2, n2, i2, r2, s2, o2, l2, h2, d2, _2, f2, u2, c2, w2, m2, b2, g2, p2, v2, k2, y2, x2, z2, A2, E2 = t2.state;
          a2 = t2.next_in, z2 = t2.input, n2 = a2 + (t2.avail_in - 5), i2 = t2.next_out, A2 = t2.output, r2 = i2 - (e2 - t2.avail_out), s2 = i2 + (t2.avail_out - 257), o2 = E2.dmax, l2 = E2.wsize, h2 = E2.whave, d2 = E2.wnext, _2 = E2.window, f2 = E2.hold, u2 = E2.bits, c2 = E2.lencode, w2 = E2.distcode, m2 = (1 << E2.lenbits) - 1, b2 = (1 << E2.distbits) - 1;
          t:
            do {
              u2 < 15 && (f2 += z2[a2++] << u2, u2 += 8, f2 += z2[a2++] << u2, u2 += 8), g2 = c2[f2 & m2];
              e:
                for (; ; ) {
                  if (f2 >>>= p2 = g2 >>> 24, u2 -= p2, 0 === (p2 = g2 >>> 16 & 255))
                    A2[i2++] = 65535 & g2;
                  else {
                    if (!(16 & p2)) {
                      if (0 == (64 & p2)) {
                        g2 = c2[(65535 & g2) + (f2 & (1 << p2) - 1)];
                        continue e;
                      }
                      if (32 & p2) {
                        E2.mode = 16191;
                        break t;
                      }
                      t2.msg = "invalid literal/length code", E2.mode = _e;
                      break t;
                    }
                    v2 = 65535 & g2, (p2 &= 15) && (u2 < p2 && (f2 += z2[a2++] << u2, u2 += 8), v2 += f2 & (1 << p2) - 1, f2 >>>= p2, u2 -= p2), u2 < 15 && (f2 += z2[a2++] << u2, u2 += 8, f2 += z2[a2++] << u2, u2 += 8), g2 = w2[f2 & b2];
                    a:
                      for (; ; ) {
                        if (f2 >>>= p2 = g2 >>> 24, u2 -= p2, !(16 & (p2 = g2 >>> 16 & 255))) {
                          if (0 == (64 & p2)) {
                            g2 = w2[(65535 & g2) + (f2 & (1 << p2) - 1)];
                            continue a;
                          }
                          t2.msg = "invalid distance code", E2.mode = _e;
                          break t;
                        }
                        if (k2 = 65535 & g2, u2 < (p2 &= 15) && (f2 += z2[a2++] << u2, (u2 += 8) < p2 && (f2 += z2[a2++] << u2, u2 += 8)), (k2 += f2 & (1 << p2) - 1) > o2) {
                          t2.msg = "invalid distance too far back", E2.mode = _e;
                          break t;
                        }
                        if (f2 >>>= p2, u2 -= p2, k2 > (p2 = i2 - r2)) {
                          if ((p2 = k2 - p2) > h2 && E2.sane) {
                            t2.msg = "invalid distance too far back", E2.mode = _e;
                            break t;
                          }
                          if (y2 = 0, x2 = _2, 0 === d2) {
                            if (y2 += l2 - p2, p2 < v2) {
                              v2 -= p2;
                              do {
                                A2[i2++] = _2[y2++];
                              } while (--p2);
                              y2 = i2 - k2, x2 = A2;
                            }
                          } else if (d2 < p2) {
                            if (y2 += l2 + d2 - p2, (p2 -= d2) < v2) {
                              v2 -= p2;
                              do {
                                A2[i2++] = _2[y2++];
                              } while (--p2);
                              if (y2 = 0, d2 < v2) {
                                v2 -= p2 = d2;
                                do {
                                  A2[i2++] = _2[y2++];
                                } while (--p2);
                                y2 = i2 - k2, x2 = A2;
                              }
                            }
                          } else if (y2 += d2 - p2, p2 < v2) {
                            v2 -= p2;
                            do {
                              A2[i2++] = _2[y2++];
                            } while (--p2);
                            y2 = i2 - k2, x2 = A2;
                          }
                          for (; v2 > 2; )
                            A2[i2++] = x2[y2++], A2[i2++] = x2[y2++], A2[i2++] = x2[y2++], v2 -= 3;
                          v2 && (A2[i2++] = x2[y2++], v2 > 1 && (A2[i2++] = x2[y2++]));
                        } else {
                          y2 = i2 - k2;
                          do {
                            A2[i2++] = A2[y2++], A2[i2++] = A2[y2++], A2[i2++] = A2[y2++], v2 -= 3;
                          } while (v2 > 2);
                          v2 && (A2[i2++] = A2[y2++], v2 > 1 && (A2[i2++] = A2[y2++]));
                        }
                        break;
                      }
                  }
                  break;
                }
            } while (a2 < n2 && i2 < s2);
          a2 -= v2 = u2 >> 3, f2 &= (1 << (u2 -= v2 << 3)) - 1, t2.next_in = a2, t2.next_out = i2, t2.avail_in = a2 < n2 ? n2 - a2 + 5 : 5 - (a2 - n2), t2.avail_out = i2 < s2 ? s2 - i2 + 257 : 257 - (i2 - s2), E2.hold = f2, E2.bits = u2;
        }, ue = 15, ce = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]), we = new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]), me = new Uint16Array([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]), be = new Uint8Array([16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]), ge = function(t2, e2, a2, n2, i2, r2, s2, o2) {
          var l2, h2, d2, _2, f2, u2, c2, w2, m2, b2 = o2.bits, g2 = 0, p2 = 0, v2 = 0, k2 = 0, y2 = 0, x2 = 0, z2 = 0, A2 = 0, E2 = 0, R2 = 0, Z2 = null, S2 = new Uint16Array(16), U2 = new Uint16Array(16), D2 = null;
          for (g2 = 0; g2 <= ue; g2++)
            S2[g2] = 0;
          for (p2 = 0; p2 < n2; p2++)
            S2[e2[a2 + p2]]++;
          for (y2 = b2, k2 = ue; k2 >= 1 && 0 === S2[k2]; k2--)
            ;
          if (y2 > k2 && (y2 = k2), 0 === k2)
            return i2[r2++] = 20971520, i2[r2++] = 20971520, o2.bits = 1, 0;
          for (v2 = 1; v2 < k2 && 0 === S2[v2]; v2++)
            ;
          for (y2 < v2 && (y2 = v2), A2 = 1, g2 = 1; g2 <= ue; g2++)
            if (A2 <<= 1, (A2 -= S2[g2]) < 0)
              return -1;
          if (A2 > 0 && (0 === t2 || 1 !== k2))
            return -1;
          for (U2[1] = 0, g2 = 1; g2 < ue; g2++)
            U2[g2 + 1] = U2[g2] + S2[g2];
          for (p2 = 0; p2 < n2; p2++)
            0 !== e2[a2 + p2] && (s2[U2[e2[a2 + p2]]++] = p2);
          if (0 === t2 ? (Z2 = D2 = s2, u2 = 20) : 1 === t2 ? (Z2 = ce, D2 = we, u2 = 257) : (Z2 = me, D2 = be, u2 = 0), R2 = 0, p2 = 0, g2 = v2, f2 = r2, x2 = y2, z2 = 0, d2 = -1, _2 = (E2 = 1 << y2) - 1, 1 === t2 && E2 > 852 || 2 === t2 && E2 > 592)
            return 1;
          for (; ; ) {
            c2 = g2 - z2, s2[p2] + 1 < u2 ? (w2 = 0, m2 = s2[p2]) : s2[p2] >= u2 ? (w2 = D2[s2[p2] - u2], m2 = Z2[s2[p2] - u2]) : (w2 = 96, m2 = 0), l2 = 1 << g2 - z2, v2 = h2 = 1 << x2;
            do {
              i2[f2 + (R2 >> z2) + (h2 -= l2)] = c2 << 24 | w2 << 16 | m2 | 0;
            } while (0 !== h2);
            for (l2 = 1 << g2 - 1; R2 & l2; )
              l2 >>= 1;
            if (0 !== l2 ? (R2 &= l2 - 1, R2 += l2) : R2 = 0, p2++, 0 == --S2[g2]) {
              if (g2 === k2)
                break;
              g2 = e2[a2 + s2[p2]];
            }
            if (g2 > y2 && (R2 & _2) !== d2) {
              for (0 === z2 && (z2 = y2), f2 += v2, A2 = 1 << (x2 = g2 - z2); x2 + z2 < k2 && !((A2 -= S2[x2 + z2]) <= 0); )
                x2++, A2 <<= 1;
              if (E2 += 1 << x2, 1 === t2 && E2 > 852 || 2 === t2 && E2 > 592)
                return 1;
              i2[d2 = R2 & _2] = y2 << 24 | x2 << 16 | f2 - r2 | 0;
            }
          }
          return 0 !== R2 && (i2[f2 + R2] = g2 - z2 << 24 | 64 << 16 | 0), o2.bits = y2, 0;
        }, pe = K.Z_FINISH, ve = K.Z_BLOCK, ke = K.Z_TREES, ye = K.Z_OK, xe = K.Z_STREAM_END, ze = K.Z_NEED_DICT, Ae = K.Z_STREAM_ERROR, Ee = K.Z_DATA_ERROR, Re = K.Z_MEM_ERROR, Ze = K.Z_BUF_ERROR, Se = K.Z_DEFLATED, Ue = 16180, De = 16190, Te = 16191, Oe = 16192, Ie = 16194, Fe = 16199, Le = 16200, Ne = 16206, Be = 16209, Ce = function(t2) {
          return (t2 >>> 24 & 255) + (t2 >>> 8 & 65280) + ((65280 & t2) << 8) + ((255 & t2) << 24);
        };
        function Me() {
          this.strm = null, this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        var He, je, Ke = function(t2) {
          if (!t2)
            return 1;
          var e2 = t2.state;
          return !e2 || e2.strm !== t2 || e2.mode < Ue || e2.mode > 16211 ? 1 : 0;
        }, Pe = function(t2) {
          if (Ke(t2))
            return Ae;
          var e2 = t2.state;
          return t2.total_in = t2.total_out = e2.total = 0, t2.msg = "", e2.wrap && (t2.adler = 1 & e2.wrap), e2.mode = Ue, e2.last = 0, e2.havedict = 0, e2.flags = -1, e2.dmax = 32768, e2.head = null, e2.hold = 0, e2.bits = 0, e2.lencode = e2.lendyn = new Int32Array(852), e2.distcode = e2.distdyn = new Int32Array(592), e2.sane = 1, e2.back = -1, ye;
        }, Ye = function(t2) {
          if (Ke(t2))
            return Ae;
          var e2 = t2.state;
          return e2.wsize = 0, e2.whave = 0, e2.wnext = 0, Pe(t2);
        }, Ge = function(t2, e2) {
          var a2;
          if (Ke(t2))
            return Ae;
          var n2 = t2.state;
          return e2 < 0 ? (a2 = 0, e2 = -e2) : (a2 = 5 + (e2 >> 4), e2 < 48 && (e2 &= 15)), e2 && (e2 < 8 || e2 > 15) ? Ae : (null !== n2.window && n2.wbits !== e2 && (n2.window = null), n2.wrap = a2, n2.wbits = e2, Ye(t2));
        }, Xe = function(t2, e2) {
          if (!t2)
            return Ae;
          var a2 = new Me();
          t2.state = a2, a2.strm = t2, a2.window = null, a2.mode = Ue;
          var n2 = Ge(t2, e2);
          return n2 !== ye && (t2.state = null), n2;
        }, We = true, qe = function(t2) {
          if (We) {
            He = new Int32Array(512), je = new Int32Array(32);
            for (var e2 = 0; e2 < 144; )
              t2.lens[e2++] = 8;
            for (; e2 < 256; )
              t2.lens[e2++] = 9;
            for (; e2 < 280; )
              t2.lens[e2++] = 7;
            for (; e2 < 288; )
              t2.lens[e2++] = 8;
            for (ge(1, t2.lens, 0, 288, He, 0, t2.work, { bits: 9 }), e2 = 0; e2 < 32; )
              t2.lens[e2++] = 5;
            ge(2, t2.lens, 0, 32, je, 0, t2.work, { bits: 5 }), We = false;
          }
          t2.lencode = He, t2.lenbits = 9, t2.distcode = je, t2.distbits = 5;
        }, Je = function(t2, e2, a2, n2) {
          var i2, r2 = t2.state;
          return null === r2.window && (r2.wsize = 1 << r2.wbits, r2.wnext = 0, r2.whave = 0, r2.window = new Uint8Array(r2.wsize)), n2 >= r2.wsize ? (r2.window.set(e2.subarray(a2 - r2.wsize, a2), 0), r2.wnext = 0, r2.whave = r2.wsize) : ((i2 = r2.wsize - r2.wnext) > n2 && (i2 = n2), r2.window.set(e2.subarray(a2 - n2, a2 - n2 + i2), r2.wnext), (n2 -= i2) ? (r2.window.set(e2.subarray(a2 - n2, a2), 0), r2.wnext = n2, r2.whave = r2.wsize) : (r2.wnext += i2, r2.wnext === r2.wsize && (r2.wnext = 0), r2.whave < r2.wsize && (r2.whave += i2))), 0;
        }, Qe = { inflateReset: Ye, inflateReset2: Ge, inflateResetKeep: Pe, inflateInit: function(t2) {
          return Xe(t2, 15);
        }, inflateInit2: Xe, inflate: function(t2, e2) {
          var a2, n2, i2, r2, s2, o2, l2, h2, d2, _2, f2, u2, c2, w2, m2, b2, g2, p2, v2, k2, y2, x2, z2, A2, E2 = 0, R2 = new Uint8Array(4), Z2 = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
          if (Ke(t2) || !t2.output || !t2.input && 0 !== t2.avail_in)
            return Ae;
          (a2 = t2.state).mode === Te && (a2.mode = Oe), s2 = t2.next_out, i2 = t2.output, l2 = t2.avail_out, r2 = t2.next_in, n2 = t2.input, o2 = t2.avail_in, h2 = a2.hold, d2 = a2.bits, _2 = o2, f2 = l2, x2 = ye;
          t:
            for (; ; )
              switch (a2.mode) {
                case Ue:
                  if (0 === a2.wrap) {
                    a2.mode = Oe;
                    break;
                  }
                  for (; d2 < 16; ) {
                    if (0 === o2)
                      break t;
                    o2--, h2 += n2[r2++] << d2, d2 += 8;
                  }
                  if (2 & a2.wrap && 35615 === h2) {
                    0 === a2.wbits && (a2.wbits = 15), a2.check = 0, R2[0] = 255 & h2, R2[1] = h2 >>> 8 & 255, a2.check = H(a2.check, R2, 2, 0), h2 = 0, d2 = 0, a2.mode = 16181;
                    break;
                  }
                  if (a2.head && (a2.head.done = false), !(1 & a2.wrap) || (((255 & h2) << 8) + (h2 >> 8)) % 31) {
                    t2.msg = "incorrect header check", a2.mode = Be;
                    break;
                  }
                  if ((15 & h2) !== Se) {
                    t2.msg = "unknown compression method", a2.mode = Be;
                    break;
                  }
                  if (d2 -= 4, y2 = 8 + (15 & (h2 >>>= 4)), 0 === a2.wbits && (a2.wbits = y2), y2 > 15 || y2 > a2.wbits) {
                    t2.msg = "invalid window size", a2.mode = Be;
                    break;
                  }
                  a2.dmax = 1 << a2.wbits, a2.flags = 0, t2.adler = a2.check = 1, a2.mode = 512 & h2 ? 16189 : Te, h2 = 0, d2 = 0;
                  break;
                case 16181:
                  for (; d2 < 16; ) {
                    if (0 === o2)
                      break t;
                    o2--, h2 += n2[r2++] << d2, d2 += 8;
                  }
                  if (a2.flags = h2, (255 & a2.flags) !== Se) {
                    t2.msg = "unknown compression method", a2.mode = Be;
                    break;
                  }
                  if (57344 & a2.flags) {
                    t2.msg = "unknown header flags set", a2.mode = Be;
                    break;
                  }
                  a2.head && (a2.head.text = h2 >> 8 & 1), 512 & a2.flags && 4 & a2.wrap && (R2[0] = 255 & h2, R2[1] = h2 >>> 8 & 255, a2.check = H(a2.check, R2, 2, 0)), h2 = 0, d2 = 0, a2.mode = 16182;
                case 16182:
                  for (; d2 < 32; ) {
                    if (0 === o2)
                      break t;
                    o2--, h2 += n2[r2++] << d2, d2 += 8;
                  }
                  a2.head && (a2.head.time = h2), 512 & a2.flags && 4 & a2.wrap && (R2[0] = 255 & h2, R2[1] = h2 >>> 8 & 255, R2[2] = h2 >>> 16 & 255, R2[3] = h2 >>> 24 & 255, a2.check = H(a2.check, R2, 4, 0)), h2 = 0, d2 = 0, a2.mode = 16183;
                case 16183:
                  for (; d2 < 16; ) {
                    if (0 === o2)
                      break t;
                    o2--, h2 += n2[r2++] << d2, d2 += 8;
                  }
                  a2.head && (a2.head.xflags = 255 & h2, a2.head.os = h2 >> 8), 512 & a2.flags && 4 & a2.wrap && (R2[0] = 255 & h2, R2[1] = h2 >>> 8 & 255, a2.check = H(a2.check, R2, 2, 0)), h2 = 0, d2 = 0, a2.mode = 16184;
                case 16184:
                  if (1024 & a2.flags) {
                    for (; d2 < 16; ) {
                      if (0 === o2)
                        break t;
                      o2--, h2 += n2[r2++] << d2, d2 += 8;
                    }
                    a2.length = h2, a2.head && (a2.head.extra_len = h2), 512 & a2.flags && 4 & a2.wrap && (R2[0] = 255 & h2, R2[1] = h2 >>> 8 & 255, a2.check = H(a2.check, R2, 2, 0)), h2 = 0, d2 = 0;
                  } else
                    a2.head && (a2.head.extra = null);
                  a2.mode = 16185;
                case 16185:
                  if (1024 & a2.flags && ((u2 = a2.length) > o2 && (u2 = o2), u2 && (a2.head && (y2 = a2.head.extra_len - a2.length, a2.head.extra || (a2.head.extra = new Uint8Array(a2.head.extra_len)), a2.head.extra.set(n2.subarray(r2, r2 + u2), y2)), 512 & a2.flags && 4 & a2.wrap && (a2.check = H(a2.check, n2, u2, r2)), o2 -= u2, r2 += u2, a2.length -= u2), a2.length))
                    break t;
                  a2.length = 0, a2.mode = 16186;
                case 16186:
                  if (2048 & a2.flags) {
                    if (0 === o2)
                      break t;
                    u2 = 0;
                    do {
                      y2 = n2[r2 + u2++], a2.head && y2 && a2.length < 65536 && (a2.head.name += String.fromCharCode(y2));
                    } while (y2 && u2 < o2);
                    if (512 & a2.flags && 4 & a2.wrap && (a2.check = H(a2.check, n2, u2, r2)), o2 -= u2, r2 += u2, y2)
                      break t;
                  } else
                    a2.head && (a2.head.name = null);
                  a2.length = 0, a2.mode = 16187;
                case 16187:
                  if (4096 & a2.flags) {
                    if (0 === o2)
                      break t;
                    u2 = 0;
                    do {
                      y2 = n2[r2 + u2++], a2.head && y2 && a2.length < 65536 && (a2.head.comment += String.fromCharCode(y2));
                    } while (y2 && u2 < o2);
                    if (512 & a2.flags && 4 & a2.wrap && (a2.check = H(a2.check, n2, u2, r2)), o2 -= u2, r2 += u2, y2)
                      break t;
                  } else
                    a2.head && (a2.head.comment = null);
                  a2.mode = 16188;
                case 16188:
                  if (512 & a2.flags) {
                    for (; d2 < 16; ) {
                      if (0 === o2)
                        break t;
                      o2--, h2 += n2[r2++] << d2, d2 += 8;
                    }
                    if (4 & a2.wrap && h2 !== (65535 & a2.check)) {
                      t2.msg = "header crc mismatch", a2.mode = Be;
                      break;
                    }
                    h2 = 0, d2 = 0;
                  }
                  a2.head && (a2.head.hcrc = a2.flags >> 9 & 1, a2.head.done = true), t2.adler = a2.check = 0, a2.mode = Te;
                  break;
                case 16189:
                  for (; d2 < 32; ) {
                    if (0 === o2)
                      break t;
                    o2--, h2 += n2[r2++] << d2, d2 += 8;
                  }
                  t2.adler = a2.check = Ce(h2), h2 = 0, d2 = 0, a2.mode = De;
                case De:
                  if (0 === a2.havedict)
                    return t2.next_out = s2, t2.avail_out = l2, t2.next_in = r2, t2.avail_in = o2, a2.hold = h2, a2.bits = d2, ze;
                  t2.adler = a2.check = 1, a2.mode = Te;
                case Te:
                  if (e2 === ve || e2 === ke)
                    break t;
                case Oe:
                  if (a2.last) {
                    h2 >>>= 7 & d2, d2 -= 7 & d2, a2.mode = Ne;
                    break;
                  }
                  for (; d2 < 3; ) {
                    if (0 === o2)
                      break t;
                    o2--, h2 += n2[r2++] << d2, d2 += 8;
                  }
                  switch (a2.last = 1 & h2, d2 -= 1, 3 & (h2 >>>= 1)) {
                    case 0:
                      a2.mode = 16193;
                      break;
                    case 1:
                      if (qe(a2), a2.mode = Fe, e2 === ke) {
                        h2 >>>= 2, d2 -= 2;
                        break t;
                      }
                      break;
                    case 2:
                      a2.mode = 16196;
                      break;
                    case 3:
                      t2.msg = "invalid block type", a2.mode = Be;
                  }
                  h2 >>>= 2, d2 -= 2;
                  break;
                case 16193:
                  for (h2 >>>= 7 & d2, d2 -= 7 & d2; d2 < 32; ) {
                    if (0 === o2)
                      break t;
                    o2--, h2 += n2[r2++] << d2, d2 += 8;
                  }
                  if ((65535 & h2) != (h2 >>> 16 ^ 65535)) {
                    t2.msg = "invalid stored block lengths", a2.mode = Be;
                    break;
                  }
                  if (a2.length = 65535 & h2, h2 = 0, d2 = 0, a2.mode = Ie, e2 === ke)
                    break t;
                case Ie:
                  a2.mode = 16195;
                case 16195:
                  if (u2 = a2.length) {
                    if (u2 > o2 && (u2 = o2), u2 > l2 && (u2 = l2), 0 === u2)
                      break t;
                    i2.set(n2.subarray(r2, r2 + u2), s2), o2 -= u2, r2 += u2, l2 -= u2, s2 += u2, a2.length -= u2;
                    break;
                  }
                  a2.mode = Te;
                  break;
                case 16196:
                  for (; d2 < 14; ) {
                    if (0 === o2)
                      break t;
                    o2--, h2 += n2[r2++] << d2, d2 += 8;
                  }
                  if (a2.nlen = 257 + (31 & h2), h2 >>>= 5, d2 -= 5, a2.ndist = 1 + (31 & h2), h2 >>>= 5, d2 -= 5, a2.ncode = 4 + (15 & h2), h2 >>>= 4, d2 -= 4, a2.nlen > 286 || a2.ndist > 30) {
                    t2.msg = "too many length or distance symbols", a2.mode = Be;
                    break;
                  }
                  a2.have = 0, a2.mode = 16197;
                case 16197:
                  for (; a2.have < a2.ncode; ) {
                    for (; d2 < 3; ) {
                      if (0 === o2)
                        break t;
                      o2--, h2 += n2[r2++] << d2, d2 += 8;
                    }
                    a2.lens[Z2[a2.have++]] = 7 & h2, h2 >>>= 3, d2 -= 3;
                  }
                  for (; a2.have < 19; )
                    a2.lens[Z2[a2.have++]] = 0;
                  if (a2.lencode = a2.lendyn, a2.lenbits = 7, z2 = { bits: a2.lenbits }, x2 = ge(0, a2.lens, 0, 19, a2.lencode, 0, a2.work, z2), a2.lenbits = z2.bits, x2) {
                    t2.msg = "invalid code lengths set", a2.mode = Be;
                    break;
                  }
                  a2.have = 0, a2.mode = 16198;
                case 16198:
                  for (; a2.have < a2.nlen + a2.ndist; ) {
                    for (; b2 = (E2 = a2.lencode[h2 & (1 << a2.lenbits) - 1]) >>> 16 & 255, g2 = 65535 & E2, !((m2 = E2 >>> 24) <= d2); ) {
                      if (0 === o2)
                        break t;
                      o2--, h2 += n2[r2++] << d2, d2 += 8;
                    }
                    if (g2 < 16)
                      h2 >>>= m2, d2 -= m2, a2.lens[a2.have++] = g2;
                    else {
                      if (16 === g2) {
                        for (A2 = m2 + 2; d2 < A2; ) {
                          if (0 === o2)
                            break t;
                          o2--, h2 += n2[r2++] << d2, d2 += 8;
                        }
                        if (h2 >>>= m2, d2 -= m2, 0 === a2.have) {
                          t2.msg = "invalid bit length repeat", a2.mode = Be;
                          break;
                        }
                        y2 = a2.lens[a2.have - 1], u2 = 3 + (3 & h2), h2 >>>= 2, d2 -= 2;
                      } else if (17 === g2) {
                        for (A2 = m2 + 3; d2 < A2; ) {
                          if (0 === o2)
                            break t;
                          o2--, h2 += n2[r2++] << d2, d2 += 8;
                        }
                        d2 -= m2, y2 = 0, u2 = 3 + (7 & (h2 >>>= m2)), h2 >>>= 3, d2 -= 3;
                      } else {
                        for (A2 = m2 + 7; d2 < A2; ) {
                          if (0 === o2)
                            break t;
                          o2--, h2 += n2[r2++] << d2, d2 += 8;
                        }
                        d2 -= m2, y2 = 0, u2 = 11 + (127 & (h2 >>>= m2)), h2 >>>= 7, d2 -= 7;
                      }
                      if (a2.have + u2 > a2.nlen + a2.ndist) {
                        t2.msg = "invalid bit length repeat", a2.mode = Be;
                        break;
                      }
                      for (; u2--; )
                        a2.lens[a2.have++] = y2;
                    }
                  }
                  if (a2.mode === Be)
                    break;
                  if (0 === a2.lens[256]) {
                    t2.msg = "invalid code -- missing end-of-block", a2.mode = Be;
                    break;
                  }
                  if (a2.lenbits = 9, z2 = { bits: a2.lenbits }, x2 = ge(1, a2.lens, 0, a2.nlen, a2.lencode, 0, a2.work, z2), a2.lenbits = z2.bits, x2) {
                    t2.msg = "invalid literal/lengths set", a2.mode = Be;
                    break;
                  }
                  if (a2.distbits = 6, a2.distcode = a2.distdyn, z2 = { bits: a2.distbits }, x2 = ge(2, a2.lens, a2.nlen, a2.ndist, a2.distcode, 0, a2.work, z2), a2.distbits = z2.bits, x2) {
                    t2.msg = "invalid distances set", a2.mode = Be;
                    break;
                  }
                  if (a2.mode = Fe, e2 === ke)
                    break t;
                case Fe:
                  a2.mode = Le;
                case Le:
                  if (o2 >= 6 && l2 >= 258) {
                    t2.next_out = s2, t2.avail_out = l2, t2.next_in = r2, t2.avail_in = o2, a2.hold = h2, a2.bits = d2, fe(t2, f2), s2 = t2.next_out, i2 = t2.output, l2 = t2.avail_out, r2 = t2.next_in, n2 = t2.input, o2 = t2.avail_in, h2 = a2.hold, d2 = a2.bits, a2.mode === Te && (a2.back = -1);
                    break;
                  }
                  for (a2.back = 0; b2 = (E2 = a2.lencode[h2 & (1 << a2.lenbits) - 1]) >>> 16 & 255, g2 = 65535 & E2, !((m2 = E2 >>> 24) <= d2); ) {
                    if (0 === o2)
                      break t;
                    o2--, h2 += n2[r2++] << d2, d2 += 8;
                  }
                  if (b2 && 0 == (240 & b2)) {
                    for (p2 = m2, v2 = b2, k2 = g2; b2 = (E2 = a2.lencode[k2 + ((h2 & (1 << p2 + v2) - 1) >> p2)]) >>> 16 & 255, g2 = 65535 & E2, !(p2 + (m2 = E2 >>> 24) <= d2); ) {
                      if (0 === o2)
                        break t;
                      o2--, h2 += n2[r2++] << d2, d2 += 8;
                    }
                    h2 >>>= p2, d2 -= p2, a2.back += p2;
                  }
                  if (h2 >>>= m2, d2 -= m2, a2.back += m2, a2.length = g2, 0 === b2) {
                    a2.mode = 16205;
                    break;
                  }
                  if (32 & b2) {
                    a2.back = -1, a2.mode = Te;
                    break;
                  }
                  if (64 & b2) {
                    t2.msg = "invalid literal/length code", a2.mode = Be;
                    break;
                  }
                  a2.extra = 15 & b2, a2.mode = 16201;
                case 16201:
                  if (a2.extra) {
                    for (A2 = a2.extra; d2 < A2; ) {
                      if (0 === o2)
                        break t;
                      o2--, h2 += n2[r2++] << d2, d2 += 8;
                    }
                    a2.length += h2 & (1 << a2.extra) - 1, h2 >>>= a2.extra, d2 -= a2.extra, a2.back += a2.extra;
                  }
                  a2.was = a2.length, a2.mode = 16202;
                case 16202:
                  for (; b2 = (E2 = a2.distcode[h2 & (1 << a2.distbits) - 1]) >>> 16 & 255, g2 = 65535 & E2, !((m2 = E2 >>> 24) <= d2); ) {
                    if (0 === o2)
                      break t;
                    o2--, h2 += n2[r2++] << d2, d2 += 8;
                  }
                  if (0 == (240 & b2)) {
                    for (p2 = m2, v2 = b2, k2 = g2; b2 = (E2 = a2.distcode[k2 + ((h2 & (1 << p2 + v2) - 1) >> p2)]) >>> 16 & 255, g2 = 65535 & E2, !(p2 + (m2 = E2 >>> 24) <= d2); ) {
                      if (0 === o2)
                        break t;
                      o2--, h2 += n2[r2++] << d2, d2 += 8;
                    }
                    h2 >>>= p2, d2 -= p2, a2.back += p2;
                  }
                  if (h2 >>>= m2, d2 -= m2, a2.back += m2, 64 & b2) {
                    t2.msg = "invalid distance code", a2.mode = Be;
                    break;
                  }
                  a2.offset = g2, a2.extra = 15 & b2, a2.mode = 16203;
                case 16203:
                  if (a2.extra) {
                    for (A2 = a2.extra; d2 < A2; ) {
                      if (0 === o2)
                        break t;
                      o2--, h2 += n2[r2++] << d2, d2 += 8;
                    }
                    a2.offset += h2 & (1 << a2.extra) - 1, h2 >>>= a2.extra, d2 -= a2.extra, a2.back += a2.extra;
                  }
                  if (a2.offset > a2.dmax) {
                    t2.msg = "invalid distance too far back", a2.mode = Be;
                    break;
                  }
                  a2.mode = 16204;
                case 16204:
                  if (0 === l2)
                    break t;
                  if (u2 = f2 - l2, a2.offset > u2) {
                    if ((u2 = a2.offset - u2) > a2.whave && a2.sane) {
                      t2.msg = "invalid distance too far back", a2.mode = Be;
                      break;
                    }
                    u2 > a2.wnext ? (u2 -= a2.wnext, c2 = a2.wsize - u2) : c2 = a2.wnext - u2, u2 > a2.length && (u2 = a2.length), w2 = a2.window;
                  } else
                    w2 = i2, c2 = s2 - a2.offset, u2 = a2.length;
                  u2 > l2 && (u2 = l2), l2 -= u2, a2.length -= u2;
                  do {
                    i2[s2++] = w2[c2++];
                  } while (--u2);
                  0 === a2.length && (a2.mode = Le);
                  break;
                case 16205:
                  if (0 === l2)
                    break t;
                  i2[s2++] = a2.length, l2--, a2.mode = Le;
                  break;
                case Ne:
                  if (a2.wrap) {
                    for (; d2 < 32; ) {
                      if (0 === o2)
                        break t;
                      o2--, h2 |= n2[r2++] << d2, d2 += 8;
                    }
                    if (f2 -= l2, t2.total_out += f2, a2.total += f2, 4 & a2.wrap && f2 && (t2.adler = a2.check = a2.flags ? H(a2.check, i2, f2, s2 - f2) : C(a2.check, i2, f2, s2 - f2)), f2 = l2, 4 & a2.wrap && (a2.flags ? h2 : Ce(h2)) !== a2.check) {
                      t2.msg = "incorrect data check", a2.mode = Be;
                      break;
                    }
                    h2 = 0, d2 = 0;
                  }
                  a2.mode = 16207;
                case 16207:
                  if (a2.wrap && a2.flags) {
                    for (; d2 < 32; ) {
                      if (0 === o2)
                        break t;
                      o2--, h2 += n2[r2++] << d2, d2 += 8;
                    }
                    if (4 & a2.wrap && h2 !== (4294967295 & a2.total)) {
                      t2.msg = "incorrect length check", a2.mode = Be;
                      break;
                    }
                    h2 = 0, d2 = 0;
                  }
                  a2.mode = 16208;
                case 16208:
                  x2 = xe;
                  break t;
                case Be:
                  x2 = Ee;
                  break t;
                case 16210:
                  return Re;
                default:
                  return Ae;
              }
          return t2.next_out = s2, t2.avail_out = l2, t2.next_in = r2, t2.avail_in = o2, a2.hold = h2, a2.bits = d2, (a2.wsize || f2 !== t2.avail_out && a2.mode < Be && (a2.mode < Ne || e2 !== pe)) && Je(t2, t2.output, t2.next_out, f2 - t2.avail_out), _2 -= t2.avail_in, f2 -= t2.avail_out, t2.total_in += _2, t2.total_out += f2, a2.total += f2, 4 & a2.wrap && f2 && (t2.adler = a2.check = a2.flags ? H(a2.check, i2, f2, t2.next_out - f2) : C(a2.check, i2, f2, t2.next_out - f2)), t2.data_type = a2.bits + (a2.last ? 64 : 0) + (a2.mode === Te ? 128 : 0) + (a2.mode === Fe || a2.mode === Ie ? 256 : 0), (0 === _2 && 0 === f2 || e2 === pe) && x2 === ye && (x2 = Ze), x2;
        }, inflateEnd: function(t2) {
          if (Ke(t2))
            return Ae;
          var e2 = t2.state;
          return e2.window && (e2.window = null), t2.state = null, ye;
        }, inflateGetHeader: function(t2, e2) {
          if (Ke(t2))
            return Ae;
          var a2 = t2.state;
          return 0 == (2 & a2.wrap) ? Ae : (a2.head = e2, e2.done = false, ye);
        }, inflateSetDictionary: function(t2, e2) {
          var a2, n2 = e2.length;
          return Ke(t2) || 0 !== (a2 = t2.state).wrap && a2.mode !== De ? Ae : a2.mode === De && C(1, e2, n2, 0) !== a2.check ? Ee : Je(t2, e2, n2, n2) ? (a2.mode = 16210, Re) : (a2.havedict = 1, ye);
        }, inflateInfo: "pako inflate (from Nodeca project)" };
        var Ve = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
        }, $e = Object.prototype.toString, ta = K.Z_NO_FLUSH, ea = K.Z_FINISH, aa = K.Z_OK, na = K.Z_STREAM_END, ia = K.Z_NEED_DICT, ra = K.Z_STREAM_ERROR, sa = K.Z_DATA_ERROR, oa = K.Z_MEM_ERROR;
        function la(t2) {
          this.options = Kt({ chunkSize: 65536, windowBits: 15, to: "" }, t2 || {});
          var e2 = this.options;
          e2.raw && e2.windowBits >= 0 && e2.windowBits < 16 && (e2.windowBits = -e2.windowBits, 0 === e2.windowBits && (e2.windowBits = -15)), !(e2.windowBits >= 0 && e2.windowBits < 16) || t2 && t2.windowBits || (e2.windowBits += 32), e2.windowBits > 15 && e2.windowBits < 48 && 0 == (15 & e2.windowBits) && (e2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new Qt(), this.strm.avail_out = 0;
          var a2 = Qe.inflateInit2(this.strm, e2.windowBits);
          if (a2 !== aa)
            throw new Error(j[a2]);
          if (this.header = new Ve(), Qe.inflateGetHeader(this.strm, this.header), e2.dictionary && ("string" == typeof e2.dictionary ? e2.dictionary = Wt(e2.dictionary) : "[object ArrayBuffer]" === $e.call(e2.dictionary) && (e2.dictionary = new Uint8Array(e2.dictionary)), e2.raw && (a2 = Qe.inflateSetDictionary(this.strm, e2.dictionary)) !== aa))
            throw new Error(j[a2]);
        }
        function ha(t2, e2) {
          var a2 = new la(e2);
          if (a2.push(t2), a2.err)
            throw a2.msg || j[a2.err];
          return a2.result;
        }
        la.prototype.push = function(t2, e2) {
          var a2, n2, i2, r2 = this.strm, s2 = this.options.chunkSize, o2 = this.options.dictionary;
          if (this.ended)
            return false;
          for (n2 = e2 === ~~e2 ? e2 : true === e2 ? ea : ta, "[object ArrayBuffer]" === $e.call(t2) ? r2.input = new Uint8Array(t2) : r2.input = t2, r2.next_in = 0, r2.avail_in = r2.input.length; ; ) {
            for (0 === r2.avail_out && (r2.output = new Uint8Array(s2), r2.next_out = 0, r2.avail_out = s2), (a2 = Qe.inflate(r2, n2)) === ia && o2 && ((a2 = Qe.inflateSetDictionary(r2, o2)) === aa ? a2 = Qe.inflate(r2, n2) : a2 === sa && (a2 = ia)); r2.avail_in > 0 && a2 === na && r2.state.wrap > 0 && 0 !== t2[r2.next_in]; )
              Qe.inflateReset(r2), a2 = Qe.inflate(r2, n2);
            switch (a2) {
              case ra:
              case sa:
              case ia:
              case oa:
                return this.onEnd(a2), this.ended = true, false;
            }
            if (i2 = r2.avail_out, r2.next_out && (0 === r2.avail_out || a2 === na))
              if ("string" === this.options.to) {
                var l2 = Jt(r2.output, r2.next_out), h2 = r2.next_out - l2, d2 = qt(r2.output, l2);
                r2.next_out = h2, r2.avail_out = s2 - h2, h2 && r2.output.set(r2.output.subarray(l2, l2 + h2), 0), this.onData(d2);
              } else
                this.onData(r2.output.length === r2.next_out ? r2.output : r2.output.subarray(0, r2.next_out));
            if (a2 !== aa || 0 !== i2) {
              if (a2 === na)
                return a2 = Qe.inflateEnd(this.strm), this.onEnd(a2), this.ended = true, true;
              if (0 === r2.avail_in)
                break;
            }
          }
          return true;
        }, la.prototype.onData = function(t2) {
          this.chunks.push(t2);
        }, la.prototype.onEnd = function(t2) {
          t2 === aa && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = Pt(this.chunks)), this.chunks = [], this.err = t2, this.msg = this.strm.msg;
        };
        var da = { Inflate: la, inflate: ha, inflateRaw: function(t2, e2) {
          return (e2 = e2 || {}).raw = true, ha(t2, e2);
        }, ungzip: ha, constants: K }, _a = de.Deflate, fa = de.deflate, ua = de.deflateRaw, ca = de.gzip, wa = da.Inflate, ma = da.inflate, ba = da.inflateRaw, ga = da.ungzip, pa = K, va = { Deflate: _a, deflate: fa, deflateRaw: ua, gzip: ca, Inflate: wa, inflate: ma, inflateRaw: ba, ungzip: ga, constants: pa };
        t.Deflate = _a, t.Inflate = wa, t.constants = pa, t.default = va, t.deflate = fa, t.deflateRaw = ua, t.gzip = ca, t.inflate = ma, t.inflateRaw = ba, t.ungzip = ga, Object.defineProperty(t, "__esModule", { value: true });
      });
    }
  });

  // node_modules/pizzip/js/flate.js
  var require_flate = __commonJS({
    "node_modules/pizzip/js/flate.js"(exports) {
      "use strict";
      var USE_TYPEDARRAY = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Uint32Array !== "undefined";
      var pako = require_pako_es5_min();
      exports.uncompressInputType = USE_TYPEDARRAY ? "uint8array" : "array";
      exports.compressInputType = USE_TYPEDARRAY ? "uint8array" : "array";
      exports.magic = "\b\0";
      exports.compress = function(input, compressionOptions) {
        return pako.deflateRaw(input, {
          level: compressionOptions.level || -1
          // default compression
        });
      };
      exports.uncompress = function(input) {
        return pako.inflateRaw(input);
      };
    }
  });

  // node_modules/pizzip/js/compressions.js
  var require_compressions = __commonJS({
    "node_modules/pizzip/js/compressions.js"(exports) {
      "use strict";
      exports.STORE = {
        magic: "\0\0",
        compress: function compress(content) {
          return content;
        },
        uncompress: function uncompress(content) {
          return content;
        },
        compressInputType: null,
        uncompressInputType: null
      };
      exports.DEFLATE = require_flate();
    }
  });

  // node_modules/pizzip/js/nodeBuffer.js
  var require_nodeBuffer = __commonJS({
    "node_modules/pizzip/js/nodeBuffer.js"(exports, module) {
      "use strict";
      module.exports = function(data, encoding) {
        if (typeof data === "number") {
          return Buffer.alloc(data);
        }
        return Buffer.from(data, encoding);
      };
      module.exports.test = function(b) {
        return Buffer.isBuffer(b);
      };
    }
  });

  // node_modules/pizzip/js/utils.js
  var require_utils = __commonJS({
    "node_modules/pizzip/js/utils.js"(exports) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      var support = require_support();
      var compressions = require_compressions();
      var nodeBuffer = require_nodeBuffer();
      exports.string2binary = function(str) {
        var result = "";
        for (var i = 0; i < str.length; i++) {
          result += String.fromCharCode(str.charCodeAt(i) & 255);
        }
        return result;
      };
      exports.arrayBuffer2Blob = function(buffer, mimeType) {
        exports.checkSupport("blob");
        mimeType = mimeType || "application/zip";
        try {
          return new Blob([buffer], {
            type: mimeType
          });
        } catch (e) {
          try {
            var Builder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
            var builder = new Builder();
            builder.append(buffer);
            return builder.getBlob(mimeType);
          } catch (e2) {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      };
      function identity(input) {
        return input;
      }
      function stringToArrayLike(str, array) {
        for (var i = 0; i < str.length; ++i) {
          array[i] = str.charCodeAt(i) & 255;
        }
        return array;
      }
      function arrayLikeToString(array) {
        var chunk = 65536;
        var result = [], len = array.length, type = exports.getTypeOf(array);
        var k = 0, canUseApply = true;
        try {
          switch (type) {
            case "uint8array":
              String.fromCharCode.apply(null, new Uint8Array(0));
              break;
            case "nodebuffer":
              String.fromCharCode.apply(null, nodeBuffer(0));
              break;
          }
        } catch (e) {
          canUseApply = false;
        }
        if (!canUseApply) {
          var resultStr = "";
          for (var i = 0; i < array.length; i++) {
            resultStr += String.fromCharCode(array[i]);
          }
          return resultStr;
        }
        while (k < len && chunk > 1) {
          try {
            if (type === "array" || type === "nodebuffer") {
              result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
            } else {
              result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
            }
            k += chunk;
          } catch (e) {
            chunk = Math.floor(chunk / 2);
          }
        }
        return result.join("");
      }
      exports.applyFromCharCode = arrayLikeToString;
      function arrayLikeToArrayLike(arrayFrom, arrayTo) {
        for (var i = 0; i < arrayFrom.length; i++) {
          arrayTo[i] = arrayFrom[i];
        }
        return arrayTo;
      }
      var transform = {};
      transform.string = {
        string: identity,
        array: function array(input) {
          return stringToArrayLike(input, new Array(input.length));
        },
        arraybuffer: function arraybuffer(input) {
          return transform.string.uint8array(input).buffer;
        },
        uint8array: function uint8array(input) {
          return stringToArrayLike(input, new Uint8Array(input.length));
        },
        nodebuffer: function nodebuffer(input) {
          return stringToArrayLike(input, nodeBuffer(input.length));
        }
      };
      transform.array = {
        string: arrayLikeToString,
        array: identity,
        arraybuffer: function arraybuffer(input) {
          return new Uint8Array(input).buffer;
        },
        uint8array: function uint8array(input) {
          return new Uint8Array(input);
        },
        nodebuffer: function nodebuffer(input) {
          return nodeBuffer(input);
        }
      };
      transform.arraybuffer = {
        string: function string(input) {
          return arrayLikeToString(new Uint8Array(input));
        },
        array: function array(input) {
          return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
        },
        arraybuffer: identity,
        uint8array: function uint8array(input) {
          return new Uint8Array(input);
        },
        nodebuffer: function nodebuffer(input) {
          return nodeBuffer(new Uint8Array(input));
        }
      };
      transform.uint8array = {
        string: arrayLikeToString,
        array: function array(input) {
          return arrayLikeToArrayLike(input, new Array(input.length));
        },
        arraybuffer: function arraybuffer(input) {
          return input.buffer;
        },
        uint8array: identity,
        nodebuffer: function nodebuffer(input) {
          return nodeBuffer(input);
        }
      };
      transform.nodebuffer = {
        string: arrayLikeToString,
        array: function array(input) {
          return arrayLikeToArrayLike(input, new Array(input.length));
        },
        arraybuffer: function arraybuffer(input) {
          return transform.nodebuffer.uint8array(input).buffer;
        },
        uint8array: function uint8array(input) {
          return arrayLikeToArrayLike(input, new Uint8Array(input.length));
        },
        nodebuffer: identity
      };
      exports.transformTo = function(outputType, input) {
        if (!input) {
          input = "";
        }
        if (!outputType) {
          return input;
        }
        exports.checkSupport(outputType);
        var inputType = exports.getTypeOf(input);
        var result = transform[inputType][outputType](input);
        return result;
      };
      exports.getTypeOf = function(input) {
        if (input == null) {
          return;
        }
        if (typeof input === "string") {
          return "string";
        }
        var protoResult = Object.prototype.toString.call(input);
        if (protoResult === "[object Array]") {
          return "array";
        }
        if (support.nodebuffer && nodeBuffer.test(input)) {
          return "nodebuffer";
        }
        if (support.uint8array && protoResult === "[object Uint8Array]") {
          return "uint8array";
        }
        if (support.arraybuffer && protoResult === "[object ArrayBuffer]") {
          return "arraybuffer";
        }
        if (protoResult === "[object Promise]") {
          throw new Error("Cannot read data from a promise, you probably are running new PizZip(data) with a promise");
        }
        if (_typeof(input) === "object" && typeof input.file === "function") {
          throw new Error("Cannot read data from a pizzip instance, you probably are running new PizZip(zip) with a zipinstance");
        }
        if (protoResult === "[object Date]") {
          throw new Error("Cannot read data from a Date, you probably are running new PizZip(data) with a date");
        }
        if (_typeof(input) === "object" && input.crc32 == null) {
          throw new Error("Unsupported data given to new PizZip(data) (object given)");
        }
      };
      exports.checkSupport = function(type) {
        var supported = support[type.toLowerCase()];
        if (!supported) {
          throw new Error(type + " is not supported by this browser");
        }
      };
      exports.MAX_VALUE_16BITS = 65535;
      exports.MAX_VALUE_32BITS = -1;
      exports.pretty = function(str) {
        var res = "", code, i;
        for (i = 0; i < (str || "").length; i++) {
          code = str.charCodeAt(i);
          res += "\\x" + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
        }
        return res;
      };
      exports.findCompression = function(compressionMethod) {
        for (var method in compressions) {
          if (!compressions.hasOwnProperty(method)) {
            continue;
          }
          if (compressions[method].magic === compressionMethod) {
            return compressions[method];
          }
        }
        return null;
      };
      exports.isRegExp = function(object) {
        return Object.prototype.toString.call(object) === "[object RegExp]";
      };
      exports.extend = function() {
        var result = {};
        var i, attr;
        for (i = 0; i < arguments.length; i++) {
          for (attr in arguments[i]) {
            if (arguments[i].hasOwnProperty(attr) && typeof result[attr] === "undefined") {
              result[attr] = arguments[i][attr];
            }
          }
        }
        return result;
      };
    }
  });

  // node_modules/pizzip/js/crc32.js
  var require_crc32 = __commonJS({
    "node_modules/pizzip/js/crc32.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var table = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
      module.exports = function crc32(input, crc) {
        if (typeof input === "undefined" || !input.length) {
          return 0;
        }
        var isArray = utils.getTypeOf(input) !== "string";
        if (typeof crc == "undefined") {
          crc = 0;
        }
        var x = 0;
        var y = 0;
        var b = 0;
        crc ^= -1;
        for (var i = 0, iTop = input.length; i < iTop; i++) {
          b = isArray ? input[i] : input.charCodeAt(i);
          y = (crc ^ b) & 255;
          x = table[y];
          crc = crc >>> 8 ^ x;
        }
        return crc ^ -1;
      };
    }
  });

  // node_modules/pizzip/js/signature.js
  var require_signature = __commonJS({
    "node_modules/pizzip/js/signature.js"(exports) {
      "use strict";
      exports.LOCAL_FILE_HEADER = "PK";
      exports.CENTRAL_FILE_HEADER = "PK";
      exports.CENTRAL_DIRECTORY_END = "PK";
      exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07";
      exports.ZIP64_CENTRAL_DIRECTORY_END = "PK";
      exports.DATA_DESCRIPTOR = "PK\x07\b";
    }
  });

  // node_modules/pizzip/js/defaults.js
  var require_defaults = __commonJS({
    "node_modules/pizzip/js/defaults.js"(exports) {
      "use strict";
      exports.base64 = false;
      exports.binary = false;
      exports.dir = false;
      exports.createFolders = false;
      exports.date = null;
      exports.compression = null;
      exports.compressionOptions = null;
      exports.comment = null;
      exports.unixPermissions = null;
      exports.dosPermissions = null;
    }
  });

  // node_modules/pizzip/js/compressedObject.js
  var require_compressedObject = __commonJS({
    "node_modules/pizzip/js/compressedObject.js"(exports, module) {
      "use strict";
      function CompressedObject() {
        this.compressedSize = 0;
        this.uncompressedSize = 0;
        this.crc32 = 0;
        this.compressionMethod = null;
        this.compressedContent = null;
      }
      CompressedObject.prototype = {
        /**
         * Return the decompressed content in an unspecified format.
         * The format will depend on the decompressor.
         * @return {Object} the decompressed content.
         */
        getContent: function getContent() {
          return null;
        },
        /**
         * Return the compressed content in an unspecified format.
         * The format will depend on the compressed conten source.
         * @return {Object} the compressed content.
         */
        getCompressedContent: function getCompressedContent() {
          return null;
        }
      };
      module.exports = CompressedObject;
    }
  });

  // node_modules/pizzip/js/utf8.js
  var require_utf8 = __commonJS({
    "node_modules/pizzip/js/utf8.js"(exports) {
      "use strict";
      var utils = require_utils();
      var support = require_support();
      var nodeBuffer = require_nodeBuffer();
      var _utf8len = new Array(256);
      for (i = 0; i < 256; i++) {
        _utf8len[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
      }
      var i;
      _utf8len[254] = _utf8len[254] = 1;
      function string2buf(str) {
        var buf, c, c2, mPos, i2, bufLen = 0;
        var strLen = str.length;
        for (mPos = 0; mPos < strLen; mPos++) {
          c = str.charCodeAt(mPos);
          if ((c & 64512) === 55296 && mPos + 1 < strLen) {
            c2 = str.charCodeAt(mPos + 1);
            if ((c2 & 64512) === 56320) {
              c = 65536 + (c - 55296 << 10) + (c2 - 56320);
              mPos++;
            }
          }
          bufLen += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
        }
        if (support.uint8array) {
          buf = new Uint8Array(bufLen);
        } else {
          buf = new Array(bufLen);
        }
        for (i2 = 0, mPos = 0; i2 < bufLen; mPos++) {
          c = str.charCodeAt(mPos);
          if ((c & 64512) === 55296 && mPos + 1 < strLen) {
            c2 = str.charCodeAt(mPos + 1);
            if ((c2 & 64512) === 56320) {
              c = 65536 + (c - 55296 << 10) + (c2 - 56320);
              mPos++;
            }
          }
          if (c < 128) {
            buf[i2++] = c;
          } else if (c < 2048) {
            buf[i2++] = 192 | c >>> 6;
            buf[i2++] = 128 | c & 63;
          } else if (c < 65536) {
            buf[i2++] = 224 | c >>> 12;
            buf[i2++] = 128 | c >>> 6 & 63;
            buf[i2++] = 128 | c & 63;
          } else {
            buf[i2++] = 240 | c >>> 18;
            buf[i2++] = 128 | c >>> 12 & 63;
            buf[i2++] = 128 | c >>> 6 & 63;
            buf[i2++] = 128 | c & 63;
          }
        }
        return buf;
      }
      function utf8border(buf, max) {
        var pos;
        max = max || buf.length;
        if (max > buf.length) {
          max = buf.length;
        }
        pos = max - 1;
        while (pos >= 0 && (buf[pos] & 192) === 128) {
          pos--;
        }
        if (pos < 0) {
          return max;
        }
        if (pos === 0) {
          return max;
        }
        return pos + _utf8len[buf[pos]] > max ? pos : max;
      }
      function buf2string(buf) {
        var i2, out, c, cLen;
        var len = buf.length;
        var utf16buf = new Array(len * 2);
        for (out = 0, i2 = 0; i2 < len; ) {
          c = buf[i2++];
          if (c < 128) {
            utf16buf[out++] = c;
            continue;
          }
          cLen = _utf8len[c];
          if (cLen > 4) {
            utf16buf[out++] = 65533;
            i2 += cLen - 1;
            continue;
          }
          c &= cLen === 2 ? 31 : cLen === 3 ? 15 : 7;
          while (cLen > 1 && i2 < len) {
            c = c << 6 | buf[i2++] & 63;
            cLen--;
          }
          if (cLen > 1) {
            utf16buf[out++] = 65533;
            continue;
          }
          if (c < 65536) {
            utf16buf[out++] = c;
          } else {
            c -= 65536;
            utf16buf[out++] = 55296 | c >> 10 & 1023;
            utf16buf[out++] = 56320 | c & 1023;
          }
        }
        if (utf16buf.length !== out) {
          if (utf16buf.subarray) {
            utf16buf = utf16buf.subarray(0, out);
          } else {
            utf16buf.length = out;
          }
        }
        return utils.applyFromCharCode(utf16buf);
      }
      exports.utf8encode = function utf8encode(str) {
        if (support.nodebuffer) {
          return nodeBuffer(str, "utf-8");
        }
        return string2buf(str);
      };
      exports.utf8decode = function utf8decode(buf) {
        if (support.nodebuffer) {
          return utils.transformTo("nodebuffer", buf).toString("utf-8");
        }
        buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);
        var result = [], len = buf.length, chunk = 65536;
        var k = 0;
        while (k < len) {
          var nextBoundary = utf8border(buf, Math.min(k + chunk, len));
          if (support.uint8array) {
            result.push(buf2string(buf.subarray(k, nextBoundary)));
          } else {
            result.push(buf2string(buf.slice(k, nextBoundary)));
          }
          k = nextBoundary;
        }
        return result.join("");
      };
    }
  });

  // node_modules/pizzip/js/stringWriter.js
  var require_stringWriter = __commonJS({
    "node_modules/pizzip/js/stringWriter.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      function StringWriter() {
        this.data = [];
      }
      StringWriter.prototype = {
        /**
         * Append any content to the current string.
         * @param {Object} input the content to add.
         */
        append: function append(input) {
          input = utils.transformTo("string", input);
          this.data.push(input);
        },
        /**
         * Finalize the construction an return the result.
         * @return {string} the generated string.
         */
        finalize: function finalize() {
          return this.data.join("");
        }
      };
      module.exports = StringWriter;
    }
  });

  // node_modules/pizzip/js/uint8ArrayWriter.js
  var require_uint8ArrayWriter = __commonJS({
    "node_modules/pizzip/js/uint8ArrayWriter.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      function Uint8ArrayWriter(length) {
        this.data = new Uint8Array(length);
        this.index = 0;
      }
      Uint8ArrayWriter.prototype = {
        /**
         * Append any content to the current array.
         * @param {Object} input the content to add.
         */
        append: function append(input) {
          if (input.length !== 0) {
            input = utils.transformTo("uint8array", input);
            this.data.set(input, this.index);
            this.index += input.length;
          }
        },
        /**
         * Finalize the construction an return the result.
         * @return {Uint8Array} the generated array.
         */
        finalize: function finalize() {
          return this.data;
        }
      };
      module.exports = Uint8ArrayWriter;
    }
  });

  // node_modules/pizzip/js/object.js
  var require_object = __commonJS({
    "node_modules/pizzip/js/object.js"(exports, module) {
      "use strict";
      var support = require_support();
      var utils = require_utils();
      var _crc = require_crc32();
      var signature = require_signature();
      var defaults = require_defaults();
      var base64 = require_base64();
      var compressions = require_compressions();
      var CompressedObject = require_compressedObject();
      var nodeBuffer = require_nodeBuffer();
      var utf8 = require_utf8();
      var StringWriter = require_stringWriter();
      var Uint8ArrayWriter = require_uint8ArrayWriter();
      function getRawData(file) {
        if (file._data instanceof CompressedObject) {
          file._data = file._data.getContent();
          file.options.binary = true;
          file.options.base64 = false;
          if (utils.getTypeOf(file._data) === "uint8array") {
            var copy = file._data;
            file._data = new Uint8Array(copy.length);
            if (copy.length !== 0) {
              file._data.set(copy, 0);
            }
          }
        }
        return file._data;
      }
      function getBinaryData(file) {
        var result = getRawData(file), type = utils.getTypeOf(result);
        if (type === "string") {
          if (!file.options.binary) {
            if (support.nodebuffer) {
              return nodeBuffer(result, "utf-8");
            }
          }
          return file.asBinary();
        }
        return result;
      }
      var out = {
        /**
         * Read an existing zip and merge the data in the current PizZip object.
         * The implementation is in pizzip-load.js, don't forget to include it.
         * @param {String|ArrayBuffer|Uint8Array|Buffer} stream  The stream to load
         * @param {Object} options Options for loading the stream.
         *  options.base64 : is the stream in base64 ? default : false
         * @return {PizZip} the current PizZip object
         */
        load: function load() {
          throw new Error("Load method is not defined. Is the file pizzip-load.js included ?");
        },
        /**
         * Filter nested files/folders with the specified function.
         * @param {Function} search the predicate to use :
         * function (relativePath, file) {...}
         * It takes 2 arguments : the relative path and the file.
         * @return {Array} An array of matching elements.
         */
        filter: function filter(search) {
          var result = [];
          var filename, relativePath, file, fileClone;
          for (filename in this.files) {
            if (!this.files.hasOwnProperty(filename)) {
              continue;
            }
            file = this.files[filename];
            fileClone = new ZipObject(file.name, file._data, utils.extend(file.options));
            relativePath = filename.slice(this.root.length, filename.length);
            if (filename.slice(0, this.root.length) === this.root && // the file is in the current root
            search(relativePath, fileClone)) {
              result.push(fileClone);
            }
          }
          return result;
        },
        /**
         * Add a file to the zip file, or search a file.
         * @param   {string|RegExp} name The name of the file to add (if data is defined),
         * the name of the file to find (if no data) or a regex to match files.
         * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
         * @param   {Object} o     File options
         * @return  {PizZip|Object|Array} this PizZip object (when adding a file),
         * a file (when searching by string) or an array of files (when searching by regex).
         */
        file: function file(name, data, o) {
          if (arguments.length === 1) {
            if (utils.isRegExp(name)) {
              var regexp = name;
              return this.filter(function(relativePath, file2) {
                return !file2.dir && regexp.test(relativePath);
              });
            }
            return this.filter(function(relativePath, file2) {
              return !file2.dir && relativePath === name;
            })[0] || null;
          }
          name = this.root + name;
          fileAdd.call(this, name, data, o);
          return this;
        },
        /**
         * Add a directory to the zip file, or search.
         * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
         * @return  {PizZip} an object with the new directory as the root, or an array containing matching folders.
         */
        folder: function folder(arg) {
          if (!arg) {
            return this;
          }
          if (utils.isRegExp(arg)) {
            return this.filter(function(relativePath, file) {
              return file.dir && arg.test(relativePath);
            });
          }
          var name = this.root + arg;
          var newFolder = folderAdd.call(this, name);
          var ret = this.shallowClone();
          ret.root = newFolder.name;
          return ret;
        },
        /**
         * Delete a file, or a directory and all sub-files, from the zip
         * @param {string} name the name of the file to delete
         * @return {PizZip} this PizZip object
         */
        remove: function remove(name) {
          name = this.root + name;
          var file = this.files[name];
          if (!file) {
            if (name.slice(-1) !== "/") {
              name += "/";
            }
            file = this.files[name];
          }
          if (file && !file.dir) {
            delete this.files[name];
          } else {
            var kids = this.filter(function(relativePath, file2) {
              return file2.name.slice(0, name.length) === name;
            });
            for (var i = 0; i < kids.length; i++) {
              delete this.files[kids[i].name];
            }
          }
          return this;
        },
        /**
         * Generate the complete zip file
         * @param {Object} options the options to generate the zip file :
         * - base64, (deprecated, use type instead) true to generate base64.
         * - compression, "STORE" by default.
         * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
         * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the zip file
         */
        generate: function generate(options) {
          options = utils.extend(options || {}, {
            base64: true,
            compression: "STORE",
            compressionOptions: null,
            type: "base64",
            platform: "DOS",
            comment: null,
            mimeType: "application/zip",
            encodeFileName: utf8.utf8encode
          });
          utils.checkSupport(options.type);
          if (options.platform === "darwin" || options.platform === "freebsd" || options.platform === "linux" || options.platform === "sunos") {
            options.platform = "UNIX";
          }
          if (options.platform === "win32") {
            options.platform = "DOS";
          }
          var zipData = [], encodedComment = utils.transformTo("string", options.encodeFileName(options.comment || this.comment || ""));
          var localDirLength = 0, centralDirLength = 0, writer, i;
          for (var name in this.files) {
            if (!this.files.hasOwnProperty(name)) {
              continue;
            }
            var file = this.files[name];
            var compressionName = file.options.compression || options.compression.toUpperCase();
            var compression = compressions[compressionName];
            if (!compression) {
              throw new Error(compressionName + " is not a valid compression method !");
            }
            var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
            var compressedObject = generateCompressedObjectFrom.call(this, file, compression, compressionOptions);
            var zipPart = generateZipParts.call(this, name, file, compressedObject, localDirLength, options.platform, options.encodeFileName);
            localDirLength += zipPart.fileRecord.length + compressedObject.compressedSize;
            centralDirLength += zipPart.dirRecord.length;
            zipData.push(zipPart);
          }
          var dirEnd = "";
          dirEnd = signature.CENTRAL_DIRECTORY_END + // number of this disk
          "\0\0\0\0" + // total number of entries in the central directory on this disk
          decToHex(zipData.length, 2) + // total number of entries in the central directory
          decToHex(zipData.length, 2) + // size of the central directory   4 bytes
          decToHex(centralDirLength, 4) + // offset of start of central directory with respect to the starting disk number
          decToHex(localDirLength, 4) + // .ZIP file comment length
          decToHex(encodedComment.length, 2) + // .ZIP file comment
          encodedComment;
          var typeName = options.type.toLowerCase();
          if (typeName === "uint8array" || typeName === "arraybuffer" || typeName === "blob" || typeName === "nodebuffer") {
            writer = new Uint8ArrayWriter(localDirLength + centralDirLength + dirEnd.length);
          } else {
            writer = new StringWriter(localDirLength + centralDirLength + dirEnd.length);
          }
          for (i = 0; i < zipData.length; i++) {
            writer.append(zipData[i].fileRecord);
            writer.append(zipData[i].compressedObject.compressedContent);
          }
          for (i = 0; i < zipData.length; i++) {
            writer.append(zipData[i].dirRecord);
          }
          writer.append(dirEnd);
          var zip = writer.finalize();
          switch (options.type.toLowerCase()) {
            case "uint8array":
            case "arraybuffer":
            case "nodebuffer":
              return utils.transformTo(options.type.toLowerCase(), zip);
            case "blob":
              return utils.arrayBuffer2Blob(utils.transformTo("arraybuffer", zip), options.mimeType);
            case "base64":
              return options.base64 ? base64.encode(zip) : zip;
            default:
              return zip;
          }
        },
        /**
         * @deprecated
         * This method will be removed in a future version without replacement.
         */
        crc32: function crc32(input, crc) {
          return _crc(input, crc);
        },
        /**
         * @deprecated
         * This method will be removed in a future version without replacement.
         */
        utf8encode: function utf8encode(string) {
          return utils.transformTo("string", utf8.utf8encode(string));
        },
        /**
         * @deprecated
         * This method will be removed in a future version without replacement.
         */
        utf8decode: function utf8decode(input) {
          return utf8.utf8decode(input);
        }
      };
      function dataToString(asUTF8) {
        var result = getRawData(this);
        if (result === null || typeof result === "undefined") {
          return "";
        }
        if (this.options.base64) {
          result = base64.decode(result);
        }
        if (asUTF8 && this.options.binary) {
          result = out.utf8decode(result);
        } else {
          result = utils.transformTo("string", result);
        }
        if (!asUTF8 && !this.options.binary) {
          result = utils.transformTo("string", out.utf8encode(result));
        }
        return result;
      }
      function ZipObject(name, data, options) {
        this.name = name;
        this.dir = options.dir;
        this.date = options.date;
        this.comment = options.comment;
        this.unixPermissions = options.unixPermissions;
        this.dosPermissions = options.dosPermissions;
        this._data = data;
        this.options = options;
        this._initialMetadata = {
          dir: options.dir,
          date: options.date
        };
      }
      ZipObject.prototype = {
        /**
         * Return the content as UTF8 string.
         * @return {string} the UTF8 string.
         */
        asText: function asText() {
          return dataToString.call(this, true);
        },
        /**
         * Returns the binary content.
         * @return {string} the content as binary.
         */
        asBinary: function asBinary() {
          return dataToString.call(this, false);
        },
        /**
         * Returns the content as a nodejs Buffer.
         * @return {Buffer} the content as a Buffer.
         */
        asNodeBuffer: function asNodeBuffer() {
          var result = getBinaryData(this);
          return utils.transformTo("nodebuffer", result);
        },
        /**
         * Returns the content as an Uint8Array.
         * @return {Uint8Array} the content as an Uint8Array.
         */
        asUint8Array: function asUint8Array() {
          var result = getBinaryData(this);
          return utils.transformTo("uint8array", result);
        },
        /**
         * Returns the content as an ArrayBuffer.
         * @return {ArrayBuffer} the content as an ArrayBufer.
         */
        asArrayBuffer: function asArrayBuffer() {
          return this.asUint8Array().buffer;
        }
      };
      function decToHex(dec, bytes) {
        var hex = "", i;
        for (i = 0; i < bytes; i++) {
          hex += String.fromCharCode(dec & 255);
          dec >>>= 8;
        }
        return hex;
      }
      function prepareFileAttrs(o) {
        o = o || {};
        if (o.base64 === true && (o.binary === null || o.binary === void 0)) {
          o.binary = true;
        }
        o = utils.extend(o, defaults);
        o.date = o.date || /* @__PURE__ */ new Date();
        if (o.compression !== null) {
          o.compression = o.compression.toUpperCase();
        }
        return o;
      }
      function fileAdd(name, data, o) {
        var dataType = utils.getTypeOf(data), parent;
        o = prepareFileAttrs(o);
        if (typeof o.unixPermissions === "string") {
          o.unixPermissions = parseInt(o.unixPermissions, 8);
        }
        if (o.unixPermissions && o.unixPermissions & 16384) {
          o.dir = true;
        }
        if (o.dosPermissions && o.dosPermissions & 16) {
          o.dir = true;
        }
        if (o.dir) {
          name = forceTrailingSlash(name);
        }
        if (o.createFolders && (parent = parentFolder(name))) {
          folderAdd.call(this, parent, true);
        }
        if (o.dir || data === null || typeof data === "undefined") {
          o.base64 = false;
          o.binary = false;
          data = null;
          dataType = null;
        } else if (dataType === "string") {
          if (o.binary && !o.base64) {
            if (o.optimizedBinaryString !== true) {
              data = utils.string2binary(data);
            }
          }
        } else {
          o.base64 = false;
          o.binary = true;
          if (!dataType && !(data instanceof CompressedObject)) {
            throw new Error("The data of '" + name + "' is in an unsupported format !");
          }
          if (dataType === "arraybuffer") {
            data = utils.transformTo("uint8array", data);
          }
        }
        var object = new ZipObject(name, data, o);
        this.files[name] = object;
        return object;
      }
      function parentFolder(path) {
        if (path.slice(-1) === "/") {
          path = path.substring(0, path.length - 1);
        }
        var lastSlash = path.lastIndexOf("/");
        return lastSlash > 0 ? path.substring(0, lastSlash) : "";
      }
      function forceTrailingSlash(path) {
        if (path.slice(-1) !== "/") {
          path += "/";
        }
        return path;
      }
      function folderAdd(name, createFolders) {
        createFolders = typeof createFolders !== "undefined" ? createFolders : false;
        name = forceTrailingSlash(name);
        if (!this.files[name]) {
          fileAdd.call(this, name, null, {
            dir: true,
            createFolders
          });
        }
        return this.files[name];
      }
      function generateCompressedObjectFrom(file, compression, compressionOptions) {
        var result = new CompressedObject();
        var content;
        if (file._data instanceof CompressedObject) {
          result.uncompressedSize = file._data.uncompressedSize;
          result.crc32 = file._data.crc32;
          if (result.uncompressedSize === 0 || file.dir) {
            compression = compressions.STORE;
            result.compressedContent = "";
            result.crc32 = 0;
          } else if (file._data.compressionMethod === compression.magic) {
            result.compressedContent = file._data.getCompressedContent();
          } else {
            content = file._data.getContent();
            result.compressedContent = compression.compress(utils.transformTo(compression.compressInputType, content), compressionOptions);
          }
        } else {
          content = getBinaryData(file);
          if (!content || content.length === 0 || file.dir) {
            compression = compressions.STORE;
            content = "";
          }
          result.uncompressedSize = content.length;
          result.crc32 = _crc(content);
          result.compressedContent = compression.compress(utils.transformTo(compression.compressInputType, content), compressionOptions);
        }
        result.compressedSize = result.compressedContent.length;
        result.compressionMethod = compression.magic;
        return result;
      }
      function generateUnixExternalFileAttr(unixPermissions, isDir) {
        var result = unixPermissions;
        if (!unixPermissions) {
          result = isDir ? 16893 : 33204;
        }
        return (result & 65535) << 16;
      }
      function generateDosExternalFileAttr(dosPermissions) {
        return (dosPermissions || 0) & 63;
      }
      function generateZipParts(name, file, compressedObject, offset, platform, encodeFileName) {
        var useCustomEncoding = encodeFileName !== utf8.utf8encode, encodedFileName = utils.transformTo("string", encodeFileName(file.name)), utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)), comment = file.comment || "", encodedComment = utils.transformTo("string", encodeFileName(comment)), utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)), useUTF8ForFileName = utfEncodedFileName.length !== file.name.length, useUTF8ForComment = utfEncodedComment.length !== comment.length, o = file.options;
        var dosTime, dosDate, extraFields = "", unicodePathExtraField = "", unicodeCommentExtraField = "", dir, date;
        if (file._initialMetadata.dir !== file.dir) {
          dir = file.dir;
        } else {
          dir = o.dir;
        }
        if (file._initialMetadata.date !== file.date) {
          date = file.date;
        } else {
          date = o.date;
        }
        var extFileAttr = 0;
        var versionMadeBy = 0;
        if (dir) {
          extFileAttr |= 16;
        }
        if (platform === "UNIX") {
          versionMadeBy = 798;
          extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
        } else {
          versionMadeBy = 20;
          extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
        }
        dosTime = date.getHours();
        dosTime <<= 6;
        dosTime |= date.getMinutes();
        dosTime <<= 5;
        dosTime |= date.getSeconds() / 2;
        dosDate = date.getFullYear() - 1980;
        dosDate <<= 4;
        dosDate |= date.getMonth() + 1;
        dosDate <<= 5;
        dosDate |= date.getDate();
        if (useUTF8ForFileName) {
          unicodePathExtraField = // Version
          decToHex(1, 1) + // NameCRC32
          decToHex(_crc(encodedFileName), 4) + // UnicodeName
          utfEncodedFileName;
          extraFields += // Info-ZIP Unicode Path Extra Field
          "up" + // size
          decToHex(unicodePathExtraField.length, 2) + // content
          unicodePathExtraField;
        }
        if (useUTF8ForComment) {
          unicodeCommentExtraField = // Version
          decToHex(1, 1) + // CommentCRC32
          decToHex(this.crc32(encodedComment), 4) + // UnicodeName
          utfEncodedComment;
          extraFields += // Info-ZIP Unicode Path Extra Field
          "uc" + // size
          decToHex(unicodeCommentExtraField.length, 2) + // content
          unicodeCommentExtraField;
        }
        var header = "";
        header += "\n\0";
        header += !useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment) ? "\0\b" : "\0\0";
        header += compressedObject.compressionMethod;
        header += decToHex(dosTime, 2);
        header += decToHex(dosDate, 2);
        header += decToHex(compressedObject.crc32, 4);
        header += decToHex(compressedObject.compressedSize, 4);
        header += decToHex(compressedObject.uncompressedSize, 4);
        header += decToHex(encodedFileName.length, 2);
        header += decToHex(extraFields.length, 2);
        var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;
        var dirRecord = signature.CENTRAL_FILE_HEADER + // version made by (00: DOS)
        decToHex(versionMadeBy, 2) + // file header (common to file and central directory)
        header + // file comment length
        decToHex(encodedComment.length, 2) + // disk number start
        "\0\0\0\0" + // external file attributes
        decToHex(extFileAttr, 4) + // relative offset of local header
        decToHex(offset, 4) + // file name
        encodedFileName + // extra field
        extraFields + // file comment
        encodedComment;
        return {
          fileRecord,
          dirRecord,
          compressedObject
        };
      }
      module.exports = out;
    }
  });

  // node_modules/pizzip/js/dataReader.js
  var require_dataReader = __commonJS({
    "node_modules/pizzip/js/dataReader.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      function DataReader() {
        this.data = null;
        this.length = 0;
        this.index = 0;
        this.zero = 0;
      }
      DataReader.prototype = {
        /**
         * Check that the offset will not go too far.
         * @param {string} offset the additional offset to check.
         * @throws {Error} an Error if the offset is out of bounds.
         */
        checkOffset: function checkOffset(offset) {
          this.checkIndex(this.index + offset);
        },
        /**
         * Check that the specifed index will not be too far.
         * @param {string} newIndex the index to check.
         * @throws {Error} an Error if the index is out of bounds.
         */
        checkIndex: function checkIndex(newIndex) {
          if (this.length < this.zero + newIndex || newIndex < 0) {
            throw new Error("End of data reached (data length = " + this.length + ", asked index = " + newIndex + "). Corrupted zip ?");
          }
        },
        /**
         * Change the index.
         * @param {number} newIndex The new index.
         * @throws {Error} if the new index is out of the data.
         */
        setIndex: function setIndex(newIndex) {
          this.checkIndex(newIndex);
          this.index = newIndex;
        },
        /**
         * Skip the next n bytes.
         * @param {number} n the number of bytes to skip.
         * @throws {Error} if the new index is out of the data.
         */
        skip: function skip(n) {
          this.setIndex(this.index + n);
        },
        /**
         * Get the byte at the specified index.
         * @param {number} i the index to use.
         * @return {number} a byte.
         */
        byteAt: function byteAt() {
        },
        /**
         * Get the next number with a given byte size.
         * @param {number} size the number of bytes to read.
         * @return {number} the corresponding number.
         */
        readInt: function readInt(size) {
          var result = 0, i;
          this.checkOffset(size);
          for (i = this.index + size - 1; i >= this.index; i--) {
            result = (result << 8) + this.byteAt(i);
          }
          this.index += size;
          return result;
        },
        /**
         * Get the next string with a given byte size.
         * @param {number} size the number of bytes to read.
         * @return {string} the corresponding string.
         */
        readString: function readString(size) {
          return utils.transformTo("string", this.readData(size));
        },
        /**
         * Get raw data without conversion, <size> bytes.
         * @param {number} size the number of bytes to read.
         * @return {Object} the raw data, implementation specific.
         */
        readData: function readData() {
        },
        /**
         * Find the last occurence of a zip signature (4 bytes).
         * @param {string} sig the signature to find.
         * @return {number} the index of the last occurence, -1 if not found.
         */
        lastIndexOfSignature: function lastIndexOfSignature() {
        },
        /**
         * Get the next date.
         * @return {Date} the date.
         */
        readDate: function readDate() {
          var dostime = this.readInt(4);
          return new Date(
            (dostime >> 25 & 127) + 1980,
            // year
            (dostime >> 21 & 15) - 1,
            // month
            dostime >> 16 & 31,
            // day
            dostime >> 11 & 31,
            // hour
            dostime >> 5 & 63,
            // minute
            (dostime & 31) << 1
          );
        }
      };
      module.exports = DataReader;
    }
  });

  // node_modules/pizzip/js/stringReader.js
  var require_stringReader = __commonJS({
    "node_modules/pizzip/js/stringReader.js"(exports, module) {
      "use strict";
      var DataReader = require_dataReader();
      var utils = require_utils();
      function StringReader(data, optimizedBinaryString) {
        this.data = data;
        if (!optimizedBinaryString) {
          this.data = utils.string2binary(this.data);
        }
        this.length = this.data.length;
        this.index = 0;
        this.zero = 0;
      }
      StringReader.prototype = new DataReader();
      StringReader.prototype.byteAt = function(i) {
        return this.data.charCodeAt(this.zero + i);
      };
      StringReader.prototype.lastIndexOfSignature = function(sig) {
        return this.data.lastIndexOf(sig) - this.zero;
      };
      StringReader.prototype.readData = function(size) {
        this.checkOffset(size);
        var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
        this.index += size;
        return result;
      };
      module.exports = StringReader;
    }
  });

  // node_modules/pizzip/js/arrayReader.js
  var require_arrayReader = __commonJS({
    "node_modules/pizzip/js/arrayReader.js"(exports, module) {
      "use strict";
      var DataReader = require_dataReader();
      function ArrayReader(data) {
        if (data) {
          this.data = data;
          this.length = this.data.length;
          this.index = 0;
          this.zero = 0;
          for (var i = 0; i < this.data.length; i++) {
            data[i] &= data[i];
          }
        }
      }
      ArrayReader.prototype = new DataReader();
      ArrayReader.prototype.byteAt = function(i) {
        return this.data[this.zero + i];
      };
      ArrayReader.prototype.lastIndexOfSignature = function(sig) {
        var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3);
        for (var i = this.length - 4; i >= 0; --i) {
          if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
            return i - this.zero;
          }
        }
        return -1;
      };
      ArrayReader.prototype.readData = function(size) {
        this.checkOffset(size);
        if (size === 0) {
          return [];
        }
        var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
        this.index += size;
        return result;
      };
      module.exports = ArrayReader;
    }
  });

  // node_modules/pizzip/js/uint8ArrayReader.js
  var require_uint8ArrayReader = __commonJS({
    "node_modules/pizzip/js/uint8ArrayReader.js"(exports, module) {
      "use strict";
      var ArrayReader = require_arrayReader();
      function Uint8ArrayReader(data) {
        if (data) {
          this.data = data;
          this.length = this.data.length;
          this.index = 0;
          this.zero = 0;
        }
      }
      Uint8ArrayReader.prototype = new ArrayReader();
      Uint8ArrayReader.prototype.readData = function(size) {
        this.checkOffset(size);
        if (size === 0) {
          return new Uint8Array(0);
        }
        var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
        this.index += size;
        return result;
      };
      module.exports = Uint8ArrayReader;
    }
  });

  // node_modules/pizzip/js/nodeBufferReader.js
  var require_nodeBufferReader = __commonJS({
    "node_modules/pizzip/js/nodeBufferReader.js"(exports, module) {
      "use strict";
      var Uint8ArrayReader = require_uint8ArrayReader();
      function NodeBufferReader(data) {
        this.data = data;
        this.length = this.data.length;
        this.index = 0;
        this.zero = 0;
      }
      NodeBufferReader.prototype = new Uint8ArrayReader();
      NodeBufferReader.prototype.readData = function(size) {
        this.checkOffset(size);
        var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
        this.index += size;
        return result;
      };
      module.exports = NodeBufferReader;
    }
  });

  // node_modules/pizzip/js/zipEntry.js
  var require_zipEntry = __commonJS({
    "node_modules/pizzip/js/zipEntry.js"(exports, module) {
      "use strict";
      var StringReader = require_stringReader();
      var utils = require_utils();
      var CompressedObject = require_compressedObject();
      var pizzipProto = require_object();
      var support = require_support();
      var MADE_BY_DOS = 0;
      var MADE_BY_UNIX = 3;
      function ZipEntry(options, loadOptions) {
        this.options = options;
        this.loadOptions = loadOptions;
      }
      ZipEntry.prototype = {
        /**
         * say if the file is encrypted.
         * @return {boolean} true if the file is encrypted, false otherwise.
         */
        isEncrypted: function isEncrypted() {
          return (this.bitFlag & 1) === 1;
        },
        /**
         * say if the file has utf-8 filename/comment.
         * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
         */
        useUTF8: function useUTF8() {
          return (this.bitFlag & 2048) === 2048;
        },
        /**
         * Prepare the function used to generate the compressed content from this ZipFile.
         * @param {DataReader} reader the reader to use.
         * @param {number} from the offset from where we should read the data.
         * @param {number} length the length of the data to read.
         * @return {Function} the callback to get the compressed content (the type depends of the DataReader class).
         */
        prepareCompressedContent: function prepareCompressedContent(reader, from, length) {
          return function() {
            var previousIndex = reader.index;
            reader.setIndex(from);
            var compressedFileData = reader.readData(length);
            reader.setIndex(previousIndex);
            return compressedFileData;
          };
        },
        /**
         * Prepare the function used to generate the uncompressed content from this ZipFile.
         * @param {DataReader} reader the reader to use.
         * @param {number} from the offset from where we should read the data.
         * @param {number} length the length of the data to read.
         * @param {PizZip.compression} compression the compression used on this file.
         * @param {number} uncompressedSize the uncompressed size to expect.
         * @return {Function} the callback to get the uncompressed content (the type depends of the DataReader class).
         */
        prepareContent: function prepareContent(reader, from, length, compression, uncompressedSize) {
          return function() {
            var compressedFileData = utils.transformTo(compression.uncompressInputType, this.getCompressedContent());
            var uncompressedFileData = compression.uncompress(compressedFileData);
            if (uncompressedFileData.length !== uncompressedSize) {
              throw new Error("Bug : uncompressed data size mismatch");
            }
            return uncompressedFileData;
          };
        },
        /**
         * Read the local part of a zip file and add the info in this object.
         * @param {DataReader} reader the reader to use.
         */
        readLocalPart: function readLocalPart(reader) {
          reader.skip(22);
          this.fileNameLength = reader.readInt(2);
          var localExtraFieldsLength = reader.readInt(2);
          this.fileName = reader.readData(this.fileNameLength);
          reader.skip(localExtraFieldsLength);
          if (this.compressedSize === -1 || this.uncompressedSize === -1) {
            throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");
          }
          var compression = utils.findCompression(this.compressionMethod);
          if (compression === null) {
            throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
          }
          this.decompressed = new CompressedObject();
          this.decompressed.compressedSize = this.compressedSize;
          this.decompressed.uncompressedSize = this.uncompressedSize;
          this.decompressed.crc32 = this.crc32;
          this.decompressed.compressionMethod = this.compressionMethod;
          this.decompressed.getCompressedContent = this.prepareCompressedContent(reader, reader.index, this.compressedSize, compression);
          this.decompressed.getContent = this.prepareContent(reader, reader.index, this.compressedSize, compression, this.uncompressedSize);
          if (this.loadOptions.checkCRC32) {
            this.decompressed = utils.transformTo("string", this.decompressed.getContent());
            if (pizzipProto.crc32(this.decompressed) !== this.crc32) {
              throw new Error("Corrupted zip : CRC32 mismatch");
            }
          }
        },
        /**
         * Read the central part of a zip file and add the info in this object.
         * @param {DataReader} reader the reader to use.
         */
        readCentralPart: function readCentralPart(reader) {
          this.versionMadeBy = reader.readInt(2);
          this.versionNeeded = reader.readInt(2);
          this.bitFlag = reader.readInt(2);
          this.compressionMethod = reader.readString(2);
          this.date = reader.readDate();
          this.crc32 = reader.readInt(4);
          this.compressedSize = reader.readInt(4);
          this.uncompressedSize = reader.readInt(4);
          this.fileNameLength = reader.readInt(2);
          this.extraFieldsLength = reader.readInt(2);
          this.fileCommentLength = reader.readInt(2);
          this.diskNumberStart = reader.readInt(2);
          this.internalFileAttributes = reader.readInt(2);
          this.externalFileAttributes = reader.readInt(4);
          this.localHeaderOffset = reader.readInt(4);
          if (this.isEncrypted()) {
            throw new Error("Encrypted zip are not supported");
          }
          this.fileName = reader.readData(this.fileNameLength);
          this.readExtraFields(reader);
          this.parseZIP64ExtraField(reader);
          this.fileComment = reader.readData(this.fileCommentLength);
        },
        /**
         * Parse the external file attributes and get the unix/dos permissions.
         */
        processAttributes: function processAttributes() {
          this.unixPermissions = null;
          this.dosPermissions = null;
          var madeBy = this.versionMadeBy >> 8;
          this.dir = !!(this.externalFileAttributes & 16);
          if (madeBy === MADE_BY_DOS) {
            this.dosPermissions = this.externalFileAttributes & 63;
          }
          if (madeBy === MADE_BY_UNIX) {
            this.unixPermissions = this.externalFileAttributes >> 16 & 65535;
          }
          if (!this.dir && this.fileNameStr.slice(-1) === "/") {
            this.dir = true;
          }
        },
        /**
         * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
         */
        parseZIP64ExtraField: function parseZIP64ExtraField() {
          if (!this.extraFields[1]) {
            return;
          }
          var extraReader = new StringReader(this.extraFields[1].value);
          if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {
            this.uncompressedSize = extraReader.readInt(8);
          }
          if (this.compressedSize === utils.MAX_VALUE_32BITS) {
            this.compressedSize = extraReader.readInt(8);
          }
          if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {
            this.localHeaderOffset = extraReader.readInt(8);
          }
          if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {
            this.diskNumberStart = extraReader.readInt(4);
          }
        },
        /**
         * Read the central part of a zip file and add the info in this object.
         * @param {DataReader} reader the reader to use.
         */
        readExtraFields: function readExtraFields(reader) {
          var start = reader.index;
          var extraFieldId, extraFieldLength, extraFieldValue;
          this.extraFields = this.extraFields || {};
          while (reader.index < start + this.extraFieldsLength) {
            extraFieldId = reader.readInt(2);
            extraFieldLength = reader.readInt(2);
            extraFieldValue = reader.readString(extraFieldLength);
            this.extraFields[extraFieldId] = {
              id: extraFieldId,
              length: extraFieldLength,
              value: extraFieldValue
            };
          }
        },
        /**
         * Apply an UTF8 transformation if needed.
         */
        handleUTF8: function handleUTF8() {
          var decodeParamType = support.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) {
            this.fileNameStr = pizzipProto.utf8decode(this.fileName);
            this.fileCommentStr = pizzipProto.utf8decode(this.fileComment);
          } else {
            var upath = this.findExtraFieldUnicodePath();
            if (upath !== null) {
              this.fileNameStr = upath;
            } else {
              var fileNameByteArray = utils.transformTo(decodeParamType, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
            }
            var ucomment = this.findExtraFieldUnicodeComment();
            if (ucomment !== null) {
              this.fileCommentStr = ucomment;
            } else {
              var commentByteArray = utils.transformTo(decodeParamType, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
            }
          }
        },
        /**
         * Find the unicode path declared in the extra field, if any.
         * @return {String} the unicode path, null otherwise.
         */
        findExtraFieldUnicodePath: function findExtraFieldUnicodePath() {
          var upathField = this.extraFields[28789];
          if (upathField) {
            var extraReader = new StringReader(upathField.value);
            if (extraReader.readInt(1) !== 1) {
              return null;
            }
            if (pizzipProto.crc32(this.fileName) !== extraReader.readInt(4)) {
              return null;
            }
            return pizzipProto.utf8decode(extraReader.readString(upathField.length - 5));
          }
          return null;
        },
        /**
         * Find the unicode comment declared in the extra field, if any.
         * @return {String} the unicode comment, null otherwise.
         */
        findExtraFieldUnicodeComment: function findExtraFieldUnicodeComment() {
          var ucommentField = this.extraFields[25461];
          if (ucommentField) {
            var extraReader = new StringReader(ucommentField.value);
            if (extraReader.readInt(1) !== 1) {
              return null;
            }
            if (pizzipProto.crc32(this.fileComment) !== extraReader.readInt(4)) {
              return null;
            }
            return pizzipProto.utf8decode(extraReader.readString(ucommentField.length - 5));
          }
          return null;
        }
      };
      module.exports = ZipEntry;
    }
  });

  // node_modules/pizzip/js/zipEntries.js
  var require_zipEntries = __commonJS({
    "node_modules/pizzip/js/zipEntries.js"(exports, module) {
      "use strict";
      var StringReader = require_stringReader();
      var NodeBufferReader = require_nodeBufferReader();
      var Uint8ArrayReader = require_uint8ArrayReader();
      var ArrayReader = require_arrayReader();
      var utils = require_utils();
      var sig = require_signature();
      var ZipEntry = require_zipEntry();
      var support = require_support();
      function ZipEntries(data, loadOptions) {
        this.files = [];
        this.loadOptions = loadOptions;
        if (data) {
          this.load(data);
        }
      }
      ZipEntries.prototype = {
        /**
         * Check that the reader is on the speficied signature.
         * @param {string} expectedSignature the expected signature.
         * @throws {Error} if it is an other signature.
         */
        checkSignature: function checkSignature(expectedSignature) {
          var signature = this.reader.readString(4);
          if (signature !== expectedSignature) {
            throw new Error("Corrupted zip or bug : unexpected signature (" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
          }
        },
        /**
         * Check if the given signature is at the given index.
         * @param {number} askedIndex the index to check.
         * @param {string} expectedSignature the signature to expect.
         * @return {boolean} true if the signature is here, false otherwise.
         */
        isSignature: function isSignature(askedIndex, expectedSignature) {
          var currentIndex = this.reader.index;
          this.reader.setIndex(askedIndex);
          var signature = this.reader.readString(4);
          var result = signature === expectedSignature;
          this.reader.setIndex(currentIndex);
          return result;
        },
        /**
         * Read the end of the central directory.
         */
        readBlockEndOfCentral: function readBlockEndOfCentral() {
          this.diskNumber = this.reader.readInt(2);
          this.diskWithCentralDirStart = this.reader.readInt(2);
          this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
          this.centralDirRecords = this.reader.readInt(2);
          this.centralDirSize = this.reader.readInt(4);
          this.centralDirOffset = this.reader.readInt(4);
          this.zipCommentLength = this.reader.readInt(2);
          var zipComment = this.reader.readData(this.zipCommentLength);
          var decodeParamType = support.uint8array ? "uint8array" : "array";
          var decodeContent = utils.transformTo(decodeParamType, zipComment);
          this.zipComment = this.loadOptions.decodeFileName(decodeContent);
        },
        /**
         * Read the end of the Zip 64 central directory.
         * Not merged with the method readEndOfCentral :
         * The end of central can coexist with its Zip64 brother,
         * I don't want to read the wrong number of bytes !
         */
        readBlockZip64EndOfCentral: function readBlockZip64EndOfCentral() {
          this.zip64EndOfCentralSize = this.reader.readInt(8);
          this.versionMadeBy = this.reader.readString(2);
          this.versionNeeded = this.reader.readInt(2);
          this.diskNumber = this.reader.readInt(4);
          this.diskWithCentralDirStart = this.reader.readInt(4);
          this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
          this.centralDirRecords = this.reader.readInt(8);
          this.centralDirSize = this.reader.readInt(8);
          this.centralDirOffset = this.reader.readInt(8);
          this.zip64ExtensibleData = {};
          var extraDataSize = this.zip64EndOfCentralSize - 44;
          var index = 0;
          var extraFieldId, extraFieldLength, extraFieldValue;
          while (index < extraDataSize) {
            extraFieldId = this.reader.readInt(2);
            extraFieldLength = this.reader.readInt(4);
            extraFieldValue = this.reader.readString(extraFieldLength);
            this.zip64ExtensibleData[extraFieldId] = {
              id: extraFieldId,
              length: extraFieldLength,
              value: extraFieldValue
            };
          }
        },
        /**
         * Read the end of the Zip 64 central directory locator.
         */
        readBlockZip64EndOfCentralLocator: function readBlockZip64EndOfCentralLocator() {
          this.diskWithZip64CentralDirStart = this.reader.readInt(4);
          this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
          this.disksCount = this.reader.readInt(4);
          if (this.disksCount > 1) {
            throw new Error("Multi-volumes zip are not supported");
          }
        },
        /**
         * Read the local files, based on the offset read in the central part.
         */
        readLocalFiles: function readLocalFiles() {
          var i, file;
          for (i = 0; i < this.files.length; i++) {
            file = this.files[i];
            this.reader.setIndex(file.localHeaderOffset);
            this.checkSignature(sig.LOCAL_FILE_HEADER);
            file.readLocalPart(this.reader);
            file.handleUTF8();
            file.processAttributes();
          }
        },
        /**
         * Read the central directory.
         */
        readCentralDir: function readCentralDir() {
          var file;
          this.reader.setIndex(this.centralDirOffset);
          while (this.reader.readString(4) === sig.CENTRAL_FILE_HEADER) {
            file = new ZipEntry({
              zip64: this.zip64
            }, this.loadOptions);
            file.readCentralPart(this.reader);
            this.files.push(file);
          }
          if (this.centralDirRecords !== this.files.length) {
            if (this.centralDirRecords !== 0 && this.files.length === 0) {
              throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
            } else {
            }
          }
        },
        /**
         * Read the end of central directory.
         */
        readEndOfCentral: function readEndOfCentral() {
          var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
          if (offset < 0) {
            var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);
            if (isGarbage) {
              throw new Error("Can't find end of central directory : is this a zip file ?");
            } else {
              throw new Error("Corrupted zip : can't find end of central directory");
            }
          }
          this.reader.setIndex(offset);
          var endOfCentralDirOffset = offset;
          this.checkSignature(sig.CENTRAL_DIRECTORY_END);
          this.readBlockEndOfCentral();
          if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
            this.zip64 = true;
            offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
            if (offset < 0) {
              throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");
            }
            this.reader.setIndex(offset);
            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
            this.readBlockZip64EndOfCentralLocator();
            if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
              this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
              if (this.relativeOffsetEndOfZip64CentralDir < 0) {
                throw new Error("Corrupted zip : can't find the ZIP64 end of central directory");
              }
            }
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
            this.readBlockZip64EndOfCentral();
          }
          var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
          if (this.zip64) {
            expectedEndOfCentralDirOffset += 20;
            expectedEndOfCentralDirOffset += 12 + this.zip64EndOfCentralSize;
          }
          var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;
          if (extraBytes > 0) {
            if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {
            } else {
              this.reader.zero = extraBytes;
            }
          } else if (extraBytes < 0) {
            throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
          }
        },
        prepareReader: function prepareReader(data) {
          var type = utils.getTypeOf(data);
          utils.checkSupport(type);
          if (type === "string" && !support.uint8array) {
            this.reader = new StringReader(data, this.loadOptions.optimizedBinaryString);
          } else if (type === "nodebuffer") {
            this.reader = new NodeBufferReader(data);
          } else if (support.uint8array) {
            this.reader = new Uint8ArrayReader(utils.transformTo("uint8array", data));
          } else if (support.array) {
            this.reader = new ArrayReader(utils.transformTo("array", data));
          } else {
            throw new Error("Unexpected error: unsupported type '" + type + "'");
          }
        },
        /**
         * Read a zip file and create ZipEntries.
         * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
         */
        load: function load(data) {
          this.prepareReader(data);
          this.readEndOfCentral();
          this.readCentralDir();
          this.readLocalFiles();
        }
      };
      module.exports = ZipEntries;
    }
  });

  // node_modules/pizzip/js/load.js
  var require_load = __commonJS({
    "node_modules/pizzip/js/load.js"(exports, module) {
      "use strict";
      var base64 = require_base64();
      var utf8 = require_utf8();
      var utils = require_utils();
      var ZipEntries = require_zipEntries();
      module.exports = function(data, options) {
        var i, input;
        options = utils.extend(options || {}, {
          base64: false,
          checkCRC32: false,
          optimizedBinaryString: false,
          createFolders: false,
          decodeFileName: utf8.utf8decode
        });
        if (options.base64) {
          data = base64.decode(data);
        }
        var zipEntries = new ZipEntries(data, options);
        var files = zipEntries.files;
        for (i = 0; i < files.length; i++) {
          input = files[i];
          this.file(input.fileNameStr, input.decompressed, {
            binary: true,
            optimizedBinaryString: true,
            date: input.date,
            dir: input.dir,
            comment: input.fileCommentStr.length ? input.fileCommentStr : null,
            unixPermissions: input.unixPermissions,
            dosPermissions: input.dosPermissions,
            createFolders: options.createFolders
          });
        }
        if (zipEntries.zipComment.length) {
          this.comment = zipEntries.zipComment;
        }
        return this;
      };
    }
  });

  // node_modules/pizzip/js/deprecatedPublicUtils.js
  var require_deprecatedPublicUtils = __commonJS({
    "node_modules/pizzip/js/deprecatedPublicUtils.js"(exports) {
      "use strict";
      var utils = require_utils();
      exports.string2binary = function(str) {
        return utils.string2binary(str);
      };
      exports.string2Uint8Array = function(str) {
        return utils.transformTo("uint8array", str);
      };
      exports.uint8Array2String = function(array) {
        return utils.transformTo("string", array);
      };
      exports.string2Blob = function(str) {
        var buffer = utils.transformTo("arraybuffer", str);
        return utils.arrayBuffer2Blob(buffer);
      };
      exports.arrayBuffer2Blob = function(buffer) {
        return utils.arrayBuffer2Blob(buffer);
      };
      exports.transformTo = function(outputType, input) {
        return utils.transformTo(outputType, input);
      };
      exports.getTypeOf = function(input) {
        return utils.getTypeOf(input);
      };
      exports.checkSupport = function(type) {
        return utils.checkSupport(type);
      };
      exports.MAX_VALUE_16BITS = utils.MAX_VALUE_16BITS;
      exports.MAX_VALUE_32BITS = utils.MAX_VALUE_32BITS;
      exports.pretty = function(str) {
        return utils.pretty(str);
      };
      exports.findCompression = function(compressionMethod) {
        return utils.findCompression(compressionMethod);
      };
      exports.isRegExp = function(object) {
        return utils.isRegExp(object);
      };
    }
  });

  // node_modules/pizzip/js/index.js
  var require_js = __commonJS({
    "node_modules/pizzip/js/index.js"(exports, module) {
      "use strict";
      var base64 = require_base64();
      function PizZip(data, options) {
        if (!(this instanceof PizZip)) {
          return new PizZip(data, options);
        }
        this.files = {};
        this.comment = null;
        this.root = "";
        if (data) {
          this.load(data, options);
        }
        this.clone = function() {
          var _this = this;
          var newObj = new PizZip();
          Object.keys(this.files).forEach(function(file) {
            newObj.file(file, _this.files[file].asUint8Array());
          });
          return newObj;
        };
        this.shallowClone = function() {
          var newObj = new PizZip();
          for (var i in this) {
            if (typeof this[i] !== "function") {
              newObj[i] = this[i];
            }
          }
          return newObj;
        };
      }
      PizZip.prototype = require_object();
      PizZip.prototype.load = require_load();
      PizZip.support = require_support();
      PizZip.defaults = require_defaults();
      PizZip.utils = require_deprecatedPublicUtils();
      PizZip.base64 = {
        /**
         * @deprecated
         * This method will be removed in a future version without replacement.
         */
        encode: function encode(input) {
          return base64.encode(input);
        },
        /**
         * @deprecated
         * This method will be removed in a future version without replacement.
         */
        decode: function decode(input) {
          return base64.decode(input);
        }
      };
      PizZip.compressions = require_compressions();
      module.exports = PizZip;
      module.exports["default"] = PizZip;
    }
  });

  // node_modules/pizzip/utils/es6/index.js
  var require_es6 = __commonJS({
    "node_modules/pizzip/utils/es6/index.js"(exports, module) {
      "use strict";
      var PizZipUtils = {};
      PizZipUtils._getBinaryFromXHR = function(xhr) {
        return xhr.response || xhr.responseText;
      };
      function createStandardXHR() {
        try {
          return new window.XMLHttpRequest();
        } catch (e) {
        }
      }
      function createActiveXHR() {
        try {
          return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
        }
      }
      var createXHR = window.ActiveXObject ? (
        /* Microsoft failed to properly
        * implement the XMLHttpRequest in IE7 (can't request local files),
        * so we use the ActiveXObject when it is available
        * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
        * we need a fallback.
        */
        function() {
          return createStandardXHR() || createActiveXHR();
        }
      ) : (
        // For all other browsers, use the standard XMLHttpRequest object
        createStandardXHR
      );
      PizZipUtils.getBinaryContent = function(path, callback) {
        try {
          const xhr = createXHR();
          xhr.open("GET", path, true);
          if ("responseType" in xhr) {
            xhr.responseType = "arraybuffer";
          }
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }
          xhr.onreadystatechange = function(evt) {
            let file, err;
            if (xhr.readyState === 4) {
              if (xhr.status === 200 || xhr.status === 0) {
                file = null;
                err = null;
                try {
                  file = PizZipUtils._getBinaryFromXHR(xhr);
                } catch (e) {
                  err = new Error(e);
                }
                callback(err, file);
              } else {
                callback(
                  new Error(
                    "Ajax error for " + path + " : " + this.status + " " + this.statusText
                  ),
                  null
                );
              }
            }
          };
          xhr.send();
        } catch (e) {
          callback(new Error(e), null);
        }
      };
      module.exports = PizZipUtils;
    }
  });

  // node_modules/pizzip/utils/index.js
  var require_utils2 = __commonJS({
    "node_modules/pizzip/utils/index.js"(exports, module) {
      module.exports = require_es6();
    }
  });

  // node_modules/@xmldom/xmldom/lib/conventions.js
  var require_conventions = __commonJS({
    "node_modules/@xmldom/xmldom/lib/conventions.js"(exports) {
      "use strict";
      function find(list, predicate, ac) {
        if (ac === void 0) {
          ac = Array.prototype;
        }
        if (list && typeof ac.find === "function") {
          return ac.find.call(list, predicate);
        }
        for (var i = 0; i < list.length; i++) {
          if (Object.prototype.hasOwnProperty.call(list, i)) {
            var item = list[i];
            if (predicate.call(void 0, item, i, list)) {
              return item;
            }
          }
        }
      }
      function freeze(object, oc) {
        if (oc === void 0) {
          oc = Object;
        }
        return oc && typeof oc.freeze === "function" ? oc.freeze(object) : object;
      }
      function assign(target, source) {
        if (target === null || typeof target !== "object") {
          throw new TypeError("target is not an object");
        }
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
        return target;
      }
      var MIME_TYPE = freeze({
        /**
         * `text/html`, the only mime type that triggers treating an XML document as HTML.
         *
         * @see DOMParser.SupportedType.isHTML
         * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
         * @see https://en.wikipedia.org/wiki/HTML Wikipedia
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
         * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
         */
        HTML: "text/html",
        /**
         * Helper method to check a mime type if it indicates an HTML document
         *
         * @param {string} [value]
         * @returns {boolean}
         *
         * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
         * @see https://en.wikipedia.org/wiki/HTML Wikipedia
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
         * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
        isHTML: function(value) {
          return value === MIME_TYPE.HTML;
        },
        /**
         * `application/xml`, the standard mime type for XML documents.
         *
         * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
         * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
         * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
         */
        XML_APPLICATION: "application/xml",
        /**
         * `text/html`, an alias for `application/xml`.
         *
         * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
         * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
         * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
         */
        XML_TEXT: "text/xml",
        /**
         * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
         * but is parsed as an XML document.
         *
         * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
         * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
         */
        XML_XHTML_APPLICATION: "application/xhtml+xml",
        /**
         * `image/svg+xml`,
         *
         * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
         * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
         * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
         */
        XML_SVG_IMAGE: "image/svg+xml"
      });
      var NAMESPACE = freeze({
        /**
         * The XHTML namespace.
         *
         * @see http://www.w3.org/1999/xhtml
         */
        HTML: "http://www.w3.org/1999/xhtml",
        /**
         * Checks if `uri` equals `NAMESPACE.HTML`.
         *
         * @param {string} [uri]
         *
         * @see NAMESPACE.HTML
         */
        isHTML: function(uri) {
          return uri === NAMESPACE.HTML;
        },
        /**
         * The SVG namespace.
         *
         * @see http://www.w3.org/2000/svg
         */
        SVG: "http://www.w3.org/2000/svg",
        /**
         * The `xml:` namespace.
         *
         * @see http://www.w3.org/XML/1998/namespace
         */
        XML: "http://www.w3.org/XML/1998/namespace",
        /**
         * The `xmlns:` namespace
         *
         * @see https://www.w3.org/2000/xmlns/
         */
        XMLNS: "http://www.w3.org/2000/xmlns/"
      });
      exports.assign = assign;
      exports.find = find;
      exports.freeze = freeze;
      exports.MIME_TYPE = MIME_TYPE;
      exports.NAMESPACE = NAMESPACE;
    }
  });

  // node_modules/@xmldom/xmldom/lib/dom.js
  var require_dom = __commonJS({
    "node_modules/@xmldom/xmldom/lib/dom.js"(exports) {
      var conventions = require_conventions();
      var find = conventions.find;
      var NAMESPACE = conventions.NAMESPACE;
      function notEmptyString(input) {
        return input !== "";
      }
      function splitOnASCIIWhitespace(input) {
        return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : [];
      }
      function orderedSetReducer(current, element) {
        if (!current.hasOwnProperty(element)) {
          current[element] = true;
        }
        return current;
      }
      function toOrderedSet(input) {
        if (!input)
          return [];
        var list = splitOnASCIIWhitespace(input);
        return Object.keys(list.reduce(orderedSetReducer, {}));
      }
      function arrayIncludes(list) {
        return function(element) {
          return list && list.indexOf(element) !== -1;
        };
      }
      function copy(src, dest) {
        for (var p in src) {
          if (Object.prototype.hasOwnProperty.call(src, p)) {
            dest[p] = src[p];
          }
        }
      }
      function _extends(Class, Super) {
        var pt = Class.prototype;
        if (!(pt instanceof Super)) {
          let t2 = function() {
          };
          var t = t2;
          ;
          t2.prototype = Super.prototype;
          t2 = new t2();
          copy(pt, t2);
          Class.prototype = pt = t2;
        }
        if (pt.constructor != Class) {
          if (typeof Class != "function") {
            console.error("unknown Class:" + Class);
          }
          pt.constructor = Class;
        }
      }
      var NodeType = {};
      var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
      var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
      var TEXT_NODE = NodeType.TEXT_NODE = 3;
      var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
      var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
      var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
      var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
      var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
      var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
      var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
      var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
      var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
      var ExceptionCode = {};
      var ExceptionMessage = {};
      var INDEX_SIZE_ERR = ExceptionCode.INDEX_SIZE_ERR = (ExceptionMessage[1] = "Index size error", 1);
      var DOMSTRING_SIZE_ERR = ExceptionCode.DOMSTRING_SIZE_ERR = (ExceptionMessage[2] = "DOMString size error", 2);
      var HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR = (ExceptionMessage[3] = "Hierarchy request error", 3);
      var WRONG_DOCUMENT_ERR = ExceptionCode.WRONG_DOCUMENT_ERR = (ExceptionMessage[4] = "Wrong document", 4);
      var INVALID_CHARACTER_ERR = ExceptionCode.INVALID_CHARACTER_ERR = (ExceptionMessage[5] = "Invalid character", 5);
      var NO_DATA_ALLOWED_ERR = ExceptionCode.NO_DATA_ALLOWED_ERR = (ExceptionMessage[6] = "No data allowed", 6);
      var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = (ExceptionMessage[7] = "No modification allowed", 7);
      var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = (ExceptionMessage[8] = "Not found", 8);
      var NOT_SUPPORTED_ERR = ExceptionCode.NOT_SUPPORTED_ERR = (ExceptionMessage[9] = "Not supported", 9);
      var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = (ExceptionMessage[10] = "Attribute in use", 10);
      var INVALID_STATE_ERR = ExceptionCode.INVALID_STATE_ERR = (ExceptionMessage[11] = "Invalid state", 11);
      var SYNTAX_ERR = ExceptionCode.SYNTAX_ERR = (ExceptionMessage[12] = "Syntax error", 12);
      var INVALID_MODIFICATION_ERR = ExceptionCode.INVALID_MODIFICATION_ERR = (ExceptionMessage[13] = "Invalid modification", 13);
      var NAMESPACE_ERR = ExceptionCode.NAMESPACE_ERR = (ExceptionMessage[14] = "Invalid namespace", 14);
      var INVALID_ACCESS_ERR = ExceptionCode.INVALID_ACCESS_ERR = (ExceptionMessage[15] = "Invalid access", 15);
      function DOMException(code, message) {
        if (message instanceof Error) {
          var error = message;
        } else {
          error = this;
          Error.call(this, ExceptionMessage[code]);
          this.message = ExceptionMessage[code];
          if (Error.captureStackTrace)
            Error.captureStackTrace(this, DOMException);
        }
        error.code = code;
        if (message)
          this.message = this.message + ": " + message;
        return error;
      }
      DOMException.prototype = Error.prototype;
      copy(ExceptionCode, DOMException);
      function NodeList() {
      }
      NodeList.prototype = {
        /**
         * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
         * @standard level1
         */
        length: 0,
        /**
         * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
         * @standard level1
         * @param index  unsigned long
         *   Index into the collection.
         * @return Node
         * 	The node at the indexth position in the NodeList, or null if that is not a valid index.
         */
        item: function(index) {
          return index >= 0 && index < this.length ? this[index] : null;
        },
        toString: function(isHTML, nodeFilter) {
          for (var buf = [], i = 0; i < this.length; i++) {
            serializeToString(this[i], buf, isHTML, nodeFilter);
          }
          return buf.join("");
        },
        /**
         * @private
         * @param {function (Node):boolean} predicate
         * @returns {Node[]}
         */
        filter: function(predicate) {
          return Array.prototype.filter.call(this, predicate);
        },
        /**
         * @private
         * @param {Node} item
         * @returns {number}
         */
        indexOf: function(item) {
          return Array.prototype.indexOf.call(this, item);
        }
      };
      function LiveNodeList(node, refresh) {
        this._node = node;
        this._refresh = refresh;
        _updateLiveList(this);
      }
      function _updateLiveList(list) {
        var inc = list._node._inc || list._node.ownerDocument._inc;
        if (list._inc !== inc) {
          var ls = list._refresh(list._node);
          __set__(list, "length", ls.length);
          if (!list.$$length || ls.length < list.$$length) {
            for (var i = ls.length; i in list; i++) {
              if (Object.prototype.hasOwnProperty.call(list, i)) {
                delete list[i];
              }
            }
          }
          copy(ls, list);
          list._inc = inc;
        }
      }
      LiveNodeList.prototype.item = function(i) {
        _updateLiveList(this);
        return this[i] || null;
      };
      _extends(LiveNodeList, NodeList);
      function NamedNodeMap() {
      }
      function _findNodeIndex(list, node) {
        var i = list.length;
        while (i--) {
          if (list[i] === node) {
            return i;
          }
        }
      }
      function _addNamedNode(el, list, newAttr, oldAttr) {
        if (oldAttr) {
          list[_findNodeIndex(list, oldAttr)] = newAttr;
        } else {
          list[list.length++] = newAttr;
        }
        if (el) {
          newAttr.ownerElement = el;
          var doc = el.ownerDocument;
          if (doc) {
            oldAttr && _onRemoveAttribute(doc, el, oldAttr);
            _onAddAttribute(doc, el, newAttr);
          }
        }
      }
      function _removeNamedNode(el, list, attr) {
        var i = _findNodeIndex(list, attr);
        if (i >= 0) {
          var lastIndex = list.length - 1;
          while (i < lastIndex) {
            list[i] = list[++i];
          }
          list.length = lastIndex;
          if (el) {
            var doc = el.ownerDocument;
            if (doc) {
              _onRemoveAttribute(doc, el, attr);
              attr.ownerElement = null;
            }
          }
        } else {
          throw new DOMException(NOT_FOUND_ERR, new Error(el.tagName + "@" + attr));
        }
      }
      NamedNodeMap.prototype = {
        length: 0,
        item: NodeList.prototype.item,
        getNamedItem: function(key) {
          var i = this.length;
          while (i--) {
            var attr = this[i];
            if (attr.nodeName == key) {
              return attr;
            }
          }
        },
        setNamedItem: function(attr) {
          var el = attr.ownerElement;
          if (el && el != this._ownerElement) {
            throw new DOMException(INUSE_ATTRIBUTE_ERR);
          }
          var oldAttr = this.getNamedItem(attr.nodeName);
          _addNamedNode(this._ownerElement, this, attr, oldAttr);
          return oldAttr;
        },
        /* returns Node */
        setNamedItemNS: function(attr) {
          var el = attr.ownerElement, oldAttr;
          if (el && el != this._ownerElement) {
            throw new DOMException(INUSE_ATTRIBUTE_ERR);
          }
          oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
          _addNamedNode(this._ownerElement, this, attr, oldAttr);
          return oldAttr;
        },
        /* returns Node */
        removeNamedItem: function(key) {
          var attr = this.getNamedItem(key);
          _removeNamedNode(this._ownerElement, this, attr);
          return attr;
        },
        // raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
        //for level2
        removeNamedItemNS: function(namespaceURI, localName) {
          var attr = this.getNamedItemNS(namespaceURI, localName);
          _removeNamedNode(this._ownerElement, this, attr);
          return attr;
        },
        getNamedItemNS: function(namespaceURI, localName) {
          var i = this.length;
          while (i--) {
            var node = this[i];
            if (node.localName == localName && node.namespaceURI == namespaceURI) {
              return node;
            }
          }
          return null;
        }
      };
      function DOMImplementation() {
      }
      DOMImplementation.prototype = {
        /**
         * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
         * The different implementations fairly diverged in what kind of features were reported.
         * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
         *
         * @deprecated It is deprecated and modern browsers return true in all cases.
         *
         * @param {string} feature
         * @param {string} [version]
         * @returns {boolean} always true
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
         * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
         */
        hasFeature: function(feature, version) {
          return true;
        },
        /**
         * Creates an XML Document object of the specified type with its document element.
         *
         * __It behaves slightly different from the description in the living standard__:
         * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
         * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
         * - this implementation is not validating names or qualified names
         *   (when parsing XML strings, the SAX parser takes care of that)
         *
         * @param {string|null} namespaceURI
         * @param {string} qualifiedName
         * @param {DocumentType=null} doctype
         * @returns {Document}
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
         * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
         *
         * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
         * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
         * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
         */
        createDocument: function(namespaceURI, qualifiedName, doctype) {
          var doc = new Document();
          doc.implementation = this;
          doc.childNodes = new NodeList();
          doc.doctype = doctype || null;
          if (doctype) {
            doc.appendChild(doctype);
          }
          if (qualifiedName) {
            var root = doc.createElementNS(namespaceURI, qualifiedName);
            doc.appendChild(root);
          }
          return doc;
        },
        /**
         * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
         *
         * __This behavior is slightly different from the in the specs__:
         * - this implementation is not validating names or qualified names
         *   (when parsing XML strings, the SAX parser takes care of that)
         *
         * @param {string} qualifiedName
         * @param {string} [publicId]
         * @param {string} [systemId]
         * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
         * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
         * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
         * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
         *
         * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
         * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
         * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
         */
        createDocumentType: function(qualifiedName, publicId, systemId) {
          var node = new DocumentType();
          node.name = qualifiedName;
          node.nodeName = qualifiedName;
          node.publicId = publicId || "";
          node.systemId = systemId || "";
          return node;
        }
      };
      function Node() {
      }
      Node.prototype = {
        firstChild: null,
        lastChild: null,
        previousSibling: null,
        nextSibling: null,
        attributes: null,
        parentNode: null,
        childNodes: null,
        ownerDocument: null,
        nodeValue: null,
        namespaceURI: null,
        prefix: null,
        localName: null,
        // Modified in DOM Level 2:
        insertBefore: function(newChild, refChild) {
          return _insertBefore(this, newChild, refChild);
        },
        replaceChild: function(newChild, oldChild) {
          _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
          if (oldChild) {
            this.removeChild(oldChild);
          }
        },
        removeChild: function(oldChild) {
          return _removeChild(this, oldChild);
        },
        appendChild: function(newChild) {
          return this.insertBefore(newChild, null);
        },
        hasChildNodes: function() {
          return this.firstChild != null;
        },
        cloneNode: function(deep) {
          return cloneNode(this.ownerDocument || this, this, deep);
        },
        // Modified in DOM Level 2:
        normalize: function() {
          var child = this.firstChild;
          while (child) {
            var next = child.nextSibling;
            if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
              this.removeChild(next);
              child.appendData(next.data);
            } else {
              child.normalize();
              child = next;
            }
          }
        },
        // Introduced in DOM Level 2:
        isSupported: function(feature, version) {
          return this.ownerDocument.implementation.hasFeature(feature, version);
        },
        // Introduced in DOM Level 2:
        hasAttributes: function() {
          return this.attributes.length > 0;
        },
        /**
         * Look up the prefix associated to the given namespace URI, starting from this node.
         * **The default namespace declarations are ignored by this method.**
         * See Namespace Prefix Lookup for details on the algorithm used by this method.
         *
         * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
         *
         * @param {string | null} namespaceURI
         * @returns {string | null}
         * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
         * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
         * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
         * @see https://github.com/xmldom/xmldom/issues/322
         */
        lookupPrefix: function(namespaceURI) {
          var el = this;
          while (el) {
            var map = el._nsMap;
            if (map) {
              for (var n in map) {
                if (Object.prototype.hasOwnProperty.call(map, n) && map[n] === namespaceURI) {
                  return n;
                }
              }
            }
            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
          }
          return null;
        },
        // Introduced in DOM Level 3:
        lookupNamespaceURI: function(prefix) {
          var el = this;
          while (el) {
            var map = el._nsMap;
            if (map) {
              if (Object.prototype.hasOwnProperty.call(map, prefix)) {
                return map[prefix];
              }
            }
            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
          }
          return null;
        },
        // Introduced in DOM Level 3:
        isDefaultNamespace: function(namespaceURI) {
          var prefix = this.lookupPrefix(namespaceURI);
          return prefix == null;
        }
      };
      function _xmlEncoder(c) {
        return c == "<" && "&lt;" || c == ">" && "&gt;" || c == "&" && "&amp;" || c == '"' && "&quot;" || "&#" + c.charCodeAt() + ";";
      }
      copy(NodeType, Node);
      copy(NodeType, Node.prototype);
      function _visitNode(node, callback) {
        if (callback(node)) {
          return true;
        }
        if (node = node.firstChild) {
          do {
            if (_visitNode(node, callback)) {
              return true;
            }
          } while (node = node.nextSibling);
        }
      }
      function Document() {
        this.ownerDocument = this;
      }
      function _onAddAttribute(doc, el, newAttr) {
        doc && doc._inc++;
        var ns = newAttr.namespaceURI;
        if (ns === NAMESPACE.XMLNS) {
          el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value;
        }
      }
      function _onRemoveAttribute(doc, el, newAttr, remove) {
        doc && doc._inc++;
        var ns = newAttr.namespaceURI;
        if (ns === NAMESPACE.XMLNS) {
          delete el._nsMap[newAttr.prefix ? newAttr.localName : ""];
        }
      }
      function _onUpdateChild(doc, el, newChild) {
        if (doc && doc._inc) {
          doc._inc++;
          var cs = el.childNodes;
          if (newChild) {
            cs[cs.length++] = newChild;
          } else {
            var child = el.firstChild;
            var i = 0;
            while (child) {
              cs[i++] = child;
              child = child.nextSibling;
            }
            cs.length = i;
            delete cs[cs.length];
          }
        }
      }
      function _removeChild(parentNode, child) {
        var previous = child.previousSibling;
        var next = child.nextSibling;
        if (previous) {
          previous.nextSibling = next;
        } else {
          parentNode.firstChild = next;
        }
        if (next) {
          next.previousSibling = previous;
        } else {
          parentNode.lastChild = previous;
        }
        child.parentNode = null;
        child.previousSibling = null;
        child.nextSibling = null;
        _onUpdateChild(parentNode.ownerDocument, parentNode);
        return child;
      }
      function hasValidParentNodeType(node) {
        return node && (node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE);
      }
      function hasInsertableNodeType(node) {
        return node && (isElementNode(node) || isTextNode(node) || isDocTypeNode(node) || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.PROCESSING_INSTRUCTION_NODE);
      }
      function isDocTypeNode(node) {
        return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
      }
      function isElementNode(node) {
        return node && node.nodeType === Node.ELEMENT_NODE;
      }
      function isTextNode(node) {
        return node && node.nodeType === Node.TEXT_NODE;
      }
      function isElementInsertionPossible(doc, child) {
        var parentChildNodes = doc.childNodes || [];
        if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
          return false;
        }
        var docTypeNode = find(parentChildNodes, isDocTypeNode);
        return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
      }
      function isElementReplacementPossible(doc, child) {
        var parentChildNodes = doc.childNodes || [];
        function hasElementChildThatIsNotChild(node) {
          return isElementNode(node) && node !== child;
        }
        if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
          return false;
        }
        var docTypeNode = find(parentChildNodes, isDocTypeNode);
        return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
      }
      function assertPreInsertionValidity1to5(parent, node, child) {
        if (!hasValidParentNodeType(parent)) {
          throw new DOMException(HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + parent.nodeType);
        }
        if (child && child.parentNode !== parent) {
          throw new DOMException(NOT_FOUND_ERR, "child not in parent");
        }
        if (
          // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
          !hasInsertableNodeType(node) || // 5. If either `node` is a Text node and `parent` is a document,
          // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
          // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
          // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
          isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE
        ) {
          throw new DOMException(
            HIERARCHY_REQUEST_ERR,
            "Unexpected node type " + node.nodeType + " for parent node type " + parent.nodeType
          );
        }
      }
      function assertPreInsertionValidityInDocument(parent, node, child) {
        var parentChildNodes = parent.childNodes || [];
        var nodeChildNodes = node.childNodes || [];
        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          var nodeChildElements = nodeChildNodes.filter(isElementNode);
          if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
          }
          if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
          }
        }
        if (isElementNode(node)) {
          if (!isElementInsertionPossible(parent, child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
          }
        }
        if (isDocTypeNode(node)) {
          if (find(parentChildNodes, isDocTypeNode)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
          }
          var parentElementChild = find(parentChildNodes, isElementNode);
          if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
          }
          if (!child && parentElementChild) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
          }
        }
      }
      function assertPreReplacementValidityInDocument(parent, node, child) {
        var parentChildNodes = parent.childNodes || [];
        var nodeChildNodes = node.childNodes || [];
        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          var nodeChildElements = nodeChildNodes.filter(isElementNode);
          if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
          }
          if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
          }
        }
        if (isElementNode(node)) {
          if (!isElementReplacementPossible(parent, child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
          }
        }
        if (isDocTypeNode(node)) {
          let hasDoctypeChildThatIsNotChild2 = function(node2) {
            return isDocTypeNode(node2) && node2 !== child;
          };
          var hasDoctypeChildThatIsNotChild = hasDoctypeChildThatIsNotChild2;
          if (find(parentChildNodes, hasDoctypeChildThatIsNotChild2)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
          }
          var parentElementChild = find(parentChildNodes, isElementNode);
          if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
            throw new DOMException(HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
          }
        }
      }
      function _insertBefore(parent, node, child, _inDocumentAssertion) {
        assertPreInsertionValidity1to5(parent, node, child);
        if (parent.nodeType === Node.DOCUMENT_NODE) {
          (_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node, child);
        }
        var cp = node.parentNode;
        if (cp) {
          cp.removeChild(node);
        }
        if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
          var newFirst = node.firstChild;
          if (newFirst == null) {
            return node;
          }
          var newLast = node.lastChild;
        } else {
          newFirst = newLast = node;
        }
        var pre = child ? child.previousSibling : parent.lastChild;
        newFirst.previousSibling = pre;
        newLast.nextSibling = child;
        if (pre) {
          pre.nextSibling = newFirst;
        } else {
          parent.firstChild = newFirst;
        }
        if (child == null) {
          parent.lastChild = newLast;
        } else {
          child.previousSibling = newLast;
        }
        do {
          newFirst.parentNode = parent;
        } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
        _onUpdateChild(parent.ownerDocument || parent, parent);
        if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
          node.firstChild = node.lastChild = null;
        }
        return node;
      }
      function _appendSingleChild(parentNode, newChild) {
        if (newChild.parentNode) {
          newChild.parentNode.removeChild(newChild);
        }
        newChild.parentNode = parentNode;
        newChild.previousSibling = parentNode.lastChild;
        newChild.nextSibling = null;
        if (newChild.previousSibling) {
          newChild.previousSibling.nextSibling = newChild;
        } else {
          parentNode.firstChild = newChild;
        }
        parentNode.lastChild = newChild;
        _onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
        return newChild;
      }
      Document.prototype = {
        //implementation : null,
        nodeName: "#document",
        nodeType: DOCUMENT_NODE,
        /**
         * The DocumentType node of the document.
         *
         * @readonly
         * @type DocumentType
         */
        doctype: null,
        documentElement: null,
        _inc: 1,
        insertBefore: function(newChild, refChild) {
          if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
            var child = newChild.firstChild;
            while (child) {
              var next = child.nextSibling;
              this.insertBefore(child, refChild);
              child = next;
            }
            return newChild;
          }
          _insertBefore(this, newChild, refChild);
          newChild.ownerDocument = this;
          if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
            this.documentElement = newChild;
          }
          return newChild;
        },
        removeChild: function(oldChild) {
          if (this.documentElement == oldChild) {
            this.documentElement = null;
          }
          return _removeChild(this, oldChild);
        },
        replaceChild: function(newChild, oldChild) {
          _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
          newChild.ownerDocument = this;
          if (oldChild) {
            this.removeChild(oldChild);
          }
          if (isElementNode(newChild)) {
            this.documentElement = newChild;
          }
        },
        // Introduced in DOM Level 2:
        importNode: function(importedNode, deep) {
          return importNode(this, importedNode, deep);
        },
        // Introduced in DOM Level 2:
        getElementById: function(id) {
          var rtv = null;
          _visitNode(this.documentElement, function(node) {
            if (node.nodeType == ELEMENT_NODE) {
              if (node.getAttribute("id") == id) {
                rtv = node;
                return true;
              }
            }
          });
          return rtv;
        },
        /**
         * The `getElementsByClassName` method of `Document` interface returns an array-like object
         * of all child elements which have **all** of the given class name(s).
         *
         * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
         *
         *
         * Warning: This is a live LiveNodeList.
         * Changes in the DOM will reflect in the array as the changes occur.
         * If an element selected by this array no longer qualifies for the selector,
         * it will automatically be removed. Be aware of this for iteration purposes.
         *
         * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
         * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
         */
        getElementsByClassName: function(classNames) {
          var classNamesSet = toOrderedSet(classNames);
          return new LiveNodeList(this, function(base) {
            var ls = [];
            if (classNamesSet.length > 0) {
              _visitNode(base.documentElement, function(node) {
                if (node !== base && node.nodeType === ELEMENT_NODE) {
                  var nodeClassNames = node.getAttribute("class");
                  if (nodeClassNames) {
                    var matches = classNames === nodeClassNames;
                    if (!matches) {
                      var nodeClassNamesSet = toOrderedSet(nodeClassNames);
                      matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
                    }
                    if (matches) {
                      ls.push(node);
                    }
                  }
                }
              });
            }
            return ls;
          });
        },
        //document factory method:
        createElement: function(tagName) {
          var node = new Element();
          node.ownerDocument = this;
          node.nodeName = tagName;
          node.tagName = tagName;
          node.localName = tagName;
          node.childNodes = new NodeList();
          var attrs = node.attributes = new NamedNodeMap();
          attrs._ownerElement = node;
          return node;
        },
        createDocumentFragment: function() {
          var node = new DocumentFragment();
          node.ownerDocument = this;
          node.childNodes = new NodeList();
          return node;
        },
        createTextNode: function(data) {
          var node = new Text();
          node.ownerDocument = this;
          node.appendData(data);
          return node;
        },
        createComment: function(data) {
          var node = new Comment();
          node.ownerDocument = this;
          node.appendData(data);
          return node;
        },
        createCDATASection: function(data) {
          var node = new CDATASection();
          node.ownerDocument = this;
          node.appendData(data);
          return node;
        },
        createProcessingInstruction: function(target, data) {
          var node = new ProcessingInstruction();
          node.ownerDocument = this;
          node.tagName = node.nodeName = node.target = target;
          node.nodeValue = node.data = data;
          return node;
        },
        createAttribute: function(name) {
          var node = new Attr();
          node.ownerDocument = this;
          node.name = name;
          node.nodeName = name;
          node.localName = name;
          node.specified = true;
          return node;
        },
        createEntityReference: function(name) {
          var node = new EntityReference();
          node.ownerDocument = this;
          node.nodeName = name;
          return node;
        },
        // Introduced in DOM Level 2:
        createElementNS: function(namespaceURI, qualifiedName) {
          var node = new Element();
          var pl = qualifiedName.split(":");
          var attrs = node.attributes = new NamedNodeMap();
          node.childNodes = new NodeList();
          node.ownerDocument = this;
          node.nodeName = qualifiedName;
          node.tagName = qualifiedName;
          node.namespaceURI = namespaceURI;
          if (pl.length == 2) {
            node.prefix = pl[0];
            node.localName = pl[1];
          } else {
            node.localName = qualifiedName;
          }
          attrs._ownerElement = node;
          return node;
        },
        // Introduced in DOM Level 2:
        createAttributeNS: function(namespaceURI, qualifiedName) {
          var node = new Attr();
          var pl = qualifiedName.split(":");
          node.ownerDocument = this;
          node.nodeName = qualifiedName;
          node.name = qualifiedName;
          node.namespaceURI = namespaceURI;
          node.specified = true;
          if (pl.length == 2) {
            node.prefix = pl[0];
            node.localName = pl[1];
          } else {
            node.localName = qualifiedName;
          }
          return node;
        }
      };
      _extends(Document, Node);
      function Element() {
        this._nsMap = {};
      }
      Element.prototype = {
        nodeType: ELEMENT_NODE,
        hasAttribute: function(name) {
          return this.getAttributeNode(name) != null;
        },
        getAttribute: function(name) {
          var attr = this.getAttributeNode(name);
          return attr && attr.value || "";
        },
        getAttributeNode: function(name) {
          return this.attributes.getNamedItem(name);
        },
        setAttribute: function(name, value) {
          var attr = this.ownerDocument.createAttribute(name);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        },
        removeAttribute: function(name) {
          var attr = this.getAttributeNode(name);
          attr && this.removeAttributeNode(attr);
        },
        //four real opeartion method
        appendChild: function(newChild) {
          if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
            return this.insertBefore(newChild, null);
          } else {
            return _appendSingleChild(this, newChild);
          }
        },
        setAttributeNode: function(newAttr) {
          return this.attributes.setNamedItem(newAttr);
        },
        setAttributeNodeNS: function(newAttr) {
          return this.attributes.setNamedItemNS(newAttr);
        },
        removeAttributeNode: function(oldAttr) {
          return this.attributes.removeNamedItem(oldAttr.nodeName);
        },
        //get real attribute name,and remove it by removeAttributeNode
        removeAttributeNS: function(namespaceURI, localName) {
          var old = this.getAttributeNodeNS(namespaceURI, localName);
          old && this.removeAttributeNode(old);
        },
        hasAttributeNS: function(namespaceURI, localName) {
          return this.getAttributeNodeNS(namespaceURI, localName) != null;
        },
        getAttributeNS: function(namespaceURI, localName) {
          var attr = this.getAttributeNodeNS(namespaceURI, localName);
          return attr && attr.value || "";
        },
        setAttributeNS: function(namespaceURI, qualifiedName, value) {
          var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        },
        getAttributeNodeNS: function(namespaceURI, localName) {
          return this.attributes.getNamedItemNS(namespaceURI, localName);
        },
        getElementsByTagName: function(tagName) {
          return new LiveNodeList(this, function(base) {
            var ls = [];
            _visitNode(base, function(node) {
              if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === "*" || node.tagName == tagName)) {
                ls.push(node);
              }
            });
            return ls;
          });
        },
        getElementsByTagNameNS: function(namespaceURI, localName) {
          return new LiveNodeList(this, function(base) {
            var ls = [];
            _visitNode(base, function(node) {
              if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === "*" || node.namespaceURI === namespaceURI) && (localName === "*" || node.localName == localName)) {
                ls.push(node);
              }
            });
            return ls;
          });
        }
      };
      Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
      Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;
      _extends(Element, Node);
      function Attr() {
      }
      Attr.prototype.nodeType = ATTRIBUTE_NODE;
      _extends(Attr, Node);
      function CharacterData() {
      }
      CharacterData.prototype = {
        data: "",
        substringData: function(offset, count) {
          return this.data.substring(offset, offset + count);
        },
        appendData: function(text) {
          text = this.data + text;
          this.nodeValue = this.data = text;
          this.length = text.length;
        },
        insertData: function(offset, text) {
          this.replaceData(offset, 0, text);
        },
        appendChild: function(newChild) {
          throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]);
        },
        deleteData: function(offset, count) {
          this.replaceData(offset, count, "");
        },
        replaceData: function(offset, count, text) {
          var start = this.data.substring(0, offset);
          var end = this.data.substring(offset + count);
          text = start + text + end;
          this.nodeValue = this.data = text;
          this.length = text.length;
        }
      };
      _extends(CharacterData, Node);
      function Text() {
      }
      Text.prototype = {
        nodeName: "#text",
        nodeType: TEXT_NODE,
        splitText: function(offset) {
          var text = this.data;
          var newText = text.substring(offset);
          text = text.substring(0, offset);
          this.data = this.nodeValue = text;
          this.length = text.length;
          var newNode = this.ownerDocument.createTextNode(newText);
          if (this.parentNode) {
            this.parentNode.insertBefore(newNode, this.nextSibling);
          }
          return newNode;
        }
      };
      _extends(Text, CharacterData);
      function Comment() {
      }
      Comment.prototype = {
        nodeName: "#comment",
        nodeType: COMMENT_NODE
      };
      _extends(Comment, CharacterData);
      function CDATASection() {
      }
      CDATASection.prototype = {
        nodeName: "#cdata-section",
        nodeType: CDATA_SECTION_NODE
      };
      _extends(CDATASection, CharacterData);
      function DocumentType() {
      }
      DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
      _extends(DocumentType, Node);
      function Notation() {
      }
      Notation.prototype.nodeType = NOTATION_NODE;
      _extends(Notation, Node);
      function Entity() {
      }
      Entity.prototype.nodeType = ENTITY_NODE;
      _extends(Entity, Node);
      function EntityReference() {
      }
      EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
      _extends(EntityReference, Node);
      function DocumentFragment() {
      }
      DocumentFragment.prototype.nodeName = "#document-fragment";
      DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
      _extends(DocumentFragment, Node);
      function ProcessingInstruction() {
      }
      ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
      _extends(ProcessingInstruction, Node);
      function XMLSerializer() {
      }
      XMLSerializer.prototype.serializeToString = function(node, isHtml, nodeFilter) {
        return nodeSerializeToString.call(node, isHtml, nodeFilter);
      };
      Node.prototype.toString = nodeSerializeToString;
      function nodeSerializeToString(isHtml, nodeFilter) {
        var buf = [];
        var refNode = this.nodeType == 9 && this.documentElement || this;
        var prefix = refNode.prefix;
        var uri = refNode.namespaceURI;
        if (uri && prefix == null) {
          var prefix = refNode.lookupPrefix(uri);
          if (prefix == null) {
            var visibleNamespaces = [
              { namespace: uri, prefix: null }
              //{namespace:uri,prefix:''}
            ];
          }
        }
        serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces);
        return buf.join("");
      }
      function needNamespaceDefine(node, isHTML, visibleNamespaces) {
        var prefix = node.prefix || "";
        var uri = node.namespaceURI;
        if (!uri) {
          return false;
        }
        if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
          return false;
        }
        var i = visibleNamespaces.length;
        while (i--) {
          var ns = visibleNamespaces[i];
          if (ns.prefix === prefix) {
            return ns.namespace !== uri;
          }
        }
        return true;
      }
      function addSerializedAttribute(buf, qualifiedName, value) {
        buf.push(" ", qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"');
      }
      function serializeToString(node, buf, isHTML, nodeFilter, visibleNamespaces) {
        if (!visibleNamespaces) {
          visibleNamespaces = [];
        }
        if (nodeFilter) {
          node = nodeFilter(node);
          if (node) {
            if (typeof node == "string") {
              buf.push(node);
              return;
            }
          } else {
            return;
          }
        }
        switch (node.nodeType) {
          case ELEMENT_NODE:
            var attrs = node.attributes;
            var len = attrs.length;
            var child = node.firstChild;
            var nodeName = node.tagName;
            isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML;
            var prefixedNodeName = nodeName;
            if (!isHTML && !node.prefix && node.namespaceURI) {
              var defaultNS;
              for (var ai = 0; ai < attrs.length; ai++) {
                if (attrs.item(ai).name === "xmlns") {
                  defaultNS = attrs.item(ai).value;
                  break;
                }
              }
              if (!defaultNS) {
                for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
                  var namespace = visibleNamespaces[nsi];
                  if (namespace.prefix === "" && namespace.namespace === node.namespaceURI) {
                    defaultNS = namespace.namespace;
                    break;
                  }
                }
              }
              if (defaultNS !== node.namespaceURI) {
                for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
                  var namespace = visibleNamespaces[nsi];
                  if (namespace.namespace === node.namespaceURI) {
                    if (namespace.prefix) {
                      prefixedNodeName = namespace.prefix + ":" + nodeName;
                    }
                    break;
                  }
                }
              }
            }
            buf.push("<", prefixedNodeName);
            for (var i = 0; i < len; i++) {
              var attr = attrs.item(i);
              if (attr.prefix == "xmlns") {
                visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
              } else if (attr.nodeName == "xmlns") {
                visibleNamespaces.push({ prefix: "", namespace: attr.value });
              }
            }
            for (var i = 0; i < len; i++) {
              var attr = attrs.item(i);
              if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
                var prefix = attr.prefix || "";
                var uri = attr.namespaceURI;
                addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
                visibleNamespaces.push({ prefix, namespace: uri });
              }
              serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces);
            }
            if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
              var prefix = node.prefix || "";
              var uri = node.namespaceURI;
              addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
              visibleNamespaces.push({ prefix, namespace: uri });
            }
            if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
              buf.push(">");
              if (isHTML && /^script$/i.test(nodeName)) {
                while (child) {
                  if (child.data) {
                    buf.push(child.data);
                  } else {
                    serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
                  }
                  child = child.nextSibling;
                }
              } else {
                while (child) {
                  serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
                  child = child.nextSibling;
                }
              }
              buf.push("</", prefixedNodeName, ">");
            } else {
              buf.push("/>");
            }
            return;
          case DOCUMENT_NODE:
          case DOCUMENT_FRAGMENT_NODE:
            var child = node.firstChild;
            while (child) {
              serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
              child = child.nextSibling;
            }
            return;
          case ATTRIBUTE_NODE:
            return addSerializedAttribute(buf, node.name, node.value);
          case TEXT_NODE:
            return buf.push(
              node.data.replace(/[<&>]/g, _xmlEncoder)
            );
          case CDATA_SECTION_NODE:
            return buf.push("<![CDATA[", node.data, "]]>");
          case COMMENT_NODE:
            return buf.push("<!--", node.data, "-->");
          case DOCUMENT_TYPE_NODE:
            var pubid = node.publicId;
            var sysid = node.systemId;
            buf.push("<!DOCTYPE ", node.name);
            if (pubid) {
              buf.push(" PUBLIC ", pubid);
              if (sysid && sysid != ".") {
                buf.push(" ", sysid);
              }
              buf.push(">");
            } else if (sysid && sysid != ".") {
              buf.push(" SYSTEM ", sysid, ">");
            } else {
              var sub = node.internalSubset;
              if (sub) {
                buf.push(" [", sub, "]");
              }
              buf.push(">");
            }
            return;
          case PROCESSING_INSTRUCTION_NODE:
            return buf.push("<?", node.target, " ", node.data, "?>");
          case ENTITY_REFERENCE_NODE:
            return buf.push("&", node.nodeName, ";");
          default:
            buf.push("??", node.nodeName);
        }
      }
      function importNode(doc, node, deep) {
        var node2;
        switch (node.nodeType) {
          case ELEMENT_NODE:
            node2 = node.cloneNode(false);
            node2.ownerDocument = doc;
          case DOCUMENT_FRAGMENT_NODE:
            break;
          case ATTRIBUTE_NODE:
            deep = true;
            break;
        }
        if (!node2) {
          node2 = node.cloneNode(false);
        }
        node2.ownerDocument = doc;
        node2.parentNode = null;
        if (deep) {
          var child = node.firstChild;
          while (child) {
            node2.appendChild(importNode(doc, child, deep));
            child = child.nextSibling;
          }
        }
        return node2;
      }
      function cloneNode(doc, node, deep) {
        var node2 = new node.constructor();
        for (var n in node) {
          if (Object.prototype.hasOwnProperty.call(node, n)) {
            var v = node[n];
            if (typeof v != "object") {
              if (v != node2[n]) {
                node2[n] = v;
              }
            }
          }
        }
        if (node.childNodes) {
          node2.childNodes = new NodeList();
        }
        node2.ownerDocument = doc;
        switch (node2.nodeType) {
          case ELEMENT_NODE:
            var attrs = node.attributes;
            var attrs2 = node2.attributes = new NamedNodeMap();
            var len = attrs.length;
            attrs2._ownerElement = node2;
            for (var i = 0; i < len; i++) {
              node2.setAttributeNode(cloneNode(doc, attrs.item(i), true));
            }
            break;
            ;
          case ATTRIBUTE_NODE:
            deep = true;
        }
        if (deep) {
          var child = node.firstChild;
          while (child) {
            node2.appendChild(cloneNode(doc, child, deep));
            child = child.nextSibling;
          }
        }
        return node2;
      }
      function __set__(object, key, value) {
        object[key] = value;
      }
      try {
        if (Object.defineProperty) {
          let getTextContent2 = function(node) {
            switch (node.nodeType) {
              case ELEMENT_NODE:
              case DOCUMENT_FRAGMENT_NODE:
                var buf = [];
                node = node.firstChild;
                while (node) {
                  if (node.nodeType !== 7 && node.nodeType !== 8) {
                    buf.push(getTextContent2(node));
                  }
                  node = node.nextSibling;
                }
                return buf.join("");
              default:
                return node.nodeValue;
            }
          };
          getTextContent = getTextContent2;
          Object.defineProperty(LiveNodeList.prototype, "length", {
            get: function() {
              _updateLiveList(this);
              return this.$$length;
            }
          });
          Object.defineProperty(Node.prototype, "textContent", {
            get: function() {
              return getTextContent2(this);
            },
            set: function(data) {
              switch (this.nodeType) {
                case ELEMENT_NODE:
                case DOCUMENT_FRAGMENT_NODE:
                  while (this.firstChild) {
                    this.removeChild(this.firstChild);
                  }
                  if (data || String(data)) {
                    this.appendChild(this.ownerDocument.createTextNode(data));
                  }
                  break;
                default:
                  this.data = data;
                  this.value = data;
                  this.nodeValue = data;
              }
            }
          });
          __set__ = function(object, key, value) {
            object["$$" + key] = value;
          };
        }
      } catch (e) {
      }
      var getTextContent;
      exports.DocumentType = DocumentType;
      exports.DOMException = DOMException;
      exports.DOMImplementation = DOMImplementation;
      exports.Element = Element;
      exports.Node = Node;
      exports.NodeList = NodeList;
      exports.XMLSerializer = XMLSerializer;
    }
  });

  // node_modules/@xmldom/xmldom/lib/entities.js
  var require_entities = __commonJS({
    "node_modules/@xmldom/xmldom/lib/entities.js"(exports) {
      "use strict";
      var freeze = require_conventions().freeze;
      exports.XML_ENTITIES = freeze({
        amp: "&",
        apos: "'",
        gt: ">",
        lt: "<",
        quot: '"'
      });
      exports.HTML_ENTITIES = freeze({
        Aacute: "\xC1",
        aacute: "\xE1",
        Abreve: "\u0102",
        abreve: "\u0103",
        ac: "\u223E",
        acd: "\u223F",
        acE: "\u223E\u0333",
        Acirc: "\xC2",
        acirc: "\xE2",
        acute: "\xB4",
        Acy: "\u0410",
        acy: "\u0430",
        AElig: "\xC6",
        aelig: "\xE6",
        af: "\u2061",
        Afr: "\u{1D504}",
        afr: "\u{1D51E}",
        Agrave: "\xC0",
        agrave: "\xE0",
        alefsym: "\u2135",
        aleph: "\u2135",
        Alpha: "\u0391",
        alpha: "\u03B1",
        Amacr: "\u0100",
        amacr: "\u0101",
        amalg: "\u2A3F",
        AMP: "&",
        amp: "&",
        And: "\u2A53",
        and: "\u2227",
        andand: "\u2A55",
        andd: "\u2A5C",
        andslope: "\u2A58",
        andv: "\u2A5A",
        ang: "\u2220",
        ange: "\u29A4",
        angle: "\u2220",
        angmsd: "\u2221",
        angmsdaa: "\u29A8",
        angmsdab: "\u29A9",
        angmsdac: "\u29AA",
        angmsdad: "\u29AB",
        angmsdae: "\u29AC",
        angmsdaf: "\u29AD",
        angmsdag: "\u29AE",
        angmsdah: "\u29AF",
        angrt: "\u221F",
        angrtvb: "\u22BE",
        angrtvbd: "\u299D",
        angsph: "\u2222",
        angst: "\xC5",
        angzarr: "\u237C",
        Aogon: "\u0104",
        aogon: "\u0105",
        Aopf: "\u{1D538}",
        aopf: "\u{1D552}",
        ap: "\u2248",
        apacir: "\u2A6F",
        apE: "\u2A70",
        ape: "\u224A",
        apid: "\u224B",
        apos: "'",
        ApplyFunction: "\u2061",
        approx: "\u2248",
        approxeq: "\u224A",
        Aring: "\xC5",
        aring: "\xE5",
        Ascr: "\u{1D49C}",
        ascr: "\u{1D4B6}",
        Assign: "\u2254",
        ast: "*",
        asymp: "\u2248",
        asympeq: "\u224D",
        Atilde: "\xC3",
        atilde: "\xE3",
        Auml: "\xC4",
        auml: "\xE4",
        awconint: "\u2233",
        awint: "\u2A11",
        backcong: "\u224C",
        backepsilon: "\u03F6",
        backprime: "\u2035",
        backsim: "\u223D",
        backsimeq: "\u22CD",
        Backslash: "\u2216",
        Barv: "\u2AE7",
        barvee: "\u22BD",
        Barwed: "\u2306",
        barwed: "\u2305",
        barwedge: "\u2305",
        bbrk: "\u23B5",
        bbrktbrk: "\u23B6",
        bcong: "\u224C",
        Bcy: "\u0411",
        bcy: "\u0431",
        bdquo: "\u201E",
        becaus: "\u2235",
        Because: "\u2235",
        because: "\u2235",
        bemptyv: "\u29B0",
        bepsi: "\u03F6",
        bernou: "\u212C",
        Bernoullis: "\u212C",
        Beta: "\u0392",
        beta: "\u03B2",
        beth: "\u2136",
        between: "\u226C",
        Bfr: "\u{1D505}",
        bfr: "\u{1D51F}",
        bigcap: "\u22C2",
        bigcirc: "\u25EF",
        bigcup: "\u22C3",
        bigodot: "\u2A00",
        bigoplus: "\u2A01",
        bigotimes: "\u2A02",
        bigsqcup: "\u2A06",
        bigstar: "\u2605",
        bigtriangledown: "\u25BD",
        bigtriangleup: "\u25B3",
        biguplus: "\u2A04",
        bigvee: "\u22C1",
        bigwedge: "\u22C0",
        bkarow: "\u290D",
        blacklozenge: "\u29EB",
        blacksquare: "\u25AA",
        blacktriangle: "\u25B4",
        blacktriangledown: "\u25BE",
        blacktriangleleft: "\u25C2",
        blacktriangleright: "\u25B8",
        blank: "\u2423",
        blk12: "\u2592",
        blk14: "\u2591",
        blk34: "\u2593",
        block: "\u2588",
        bne: "=\u20E5",
        bnequiv: "\u2261\u20E5",
        bNot: "\u2AED",
        bnot: "\u2310",
        Bopf: "\u{1D539}",
        bopf: "\u{1D553}",
        bot: "\u22A5",
        bottom: "\u22A5",
        bowtie: "\u22C8",
        boxbox: "\u29C9",
        boxDL: "\u2557",
        boxDl: "\u2556",
        boxdL: "\u2555",
        boxdl: "\u2510",
        boxDR: "\u2554",
        boxDr: "\u2553",
        boxdR: "\u2552",
        boxdr: "\u250C",
        boxH: "\u2550",
        boxh: "\u2500",
        boxHD: "\u2566",
        boxHd: "\u2564",
        boxhD: "\u2565",
        boxhd: "\u252C",
        boxHU: "\u2569",
        boxHu: "\u2567",
        boxhU: "\u2568",
        boxhu: "\u2534",
        boxminus: "\u229F",
        boxplus: "\u229E",
        boxtimes: "\u22A0",
        boxUL: "\u255D",
        boxUl: "\u255C",
        boxuL: "\u255B",
        boxul: "\u2518",
        boxUR: "\u255A",
        boxUr: "\u2559",
        boxuR: "\u2558",
        boxur: "\u2514",
        boxV: "\u2551",
        boxv: "\u2502",
        boxVH: "\u256C",
        boxVh: "\u256B",
        boxvH: "\u256A",
        boxvh: "\u253C",
        boxVL: "\u2563",
        boxVl: "\u2562",
        boxvL: "\u2561",
        boxvl: "\u2524",
        boxVR: "\u2560",
        boxVr: "\u255F",
        boxvR: "\u255E",
        boxvr: "\u251C",
        bprime: "\u2035",
        Breve: "\u02D8",
        breve: "\u02D8",
        brvbar: "\xA6",
        Bscr: "\u212C",
        bscr: "\u{1D4B7}",
        bsemi: "\u204F",
        bsim: "\u223D",
        bsime: "\u22CD",
        bsol: "\\",
        bsolb: "\u29C5",
        bsolhsub: "\u27C8",
        bull: "\u2022",
        bullet: "\u2022",
        bump: "\u224E",
        bumpE: "\u2AAE",
        bumpe: "\u224F",
        Bumpeq: "\u224E",
        bumpeq: "\u224F",
        Cacute: "\u0106",
        cacute: "\u0107",
        Cap: "\u22D2",
        cap: "\u2229",
        capand: "\u2A44",
        capbrcup: "\u2A49",
        capcap: "\u2A4B",
        capcup: "\u2A47",
        capdot: "\u2A40",
        CapitalDifferentialD: "\u2145",
        caps: "\u2229\uFE00",
        caret: "\u2041",
        caron: "\u02C7",
        Cayleys: "\u212D",
        ccaps: "\u2A4D",
        Ccaron: "\u010C",
        ccaron: "\u010D",
        Ccedil: "\xC7",
        ccedil: "\xE7",
        Ccirc: "\u0108",
        ccirc: "\u0109",
        Cconint: "\u2230",
        ccups: "\u2A4C",
        ccupssm: "\u2A50",
        Cdot: "\u010A",
        cdot: "\u010B",
        cedil: "\xB8",
        Cedilla: "\xB8",
        cemptyv: "\u29B2",
        cent: "\xA2",
        CenterDot: "\xB7",
        centerdot: "\xB7",
        Cfr: "\u212D",
        cfr: "\u{1D520}",
        CHcy: "\u0427",
        chcy: "\u0447",
        check: "\u2713",
        checkmark: "\u2713",
        Chi: "\u03A7",
        chi: "\u03C7",
        cir: "\u25CB",
        circ: "\u02C6",
        circeq: "\u2257",
        circlearrowleft: "\u21BA",
        circlearrowright: "\u21BB",
        circledast: "\u229B",
        circledcirc: "\u229A",
        circleddash: "\u229D",
        CircleDot: "\u2299",
        circledR: "\xAE",
        circledS: "\u24C8",
        CircleMinus: "\u2296",
        CirclePlus: "\u2295",
        CircleTimes: "\u2297",
        cirE: "\u29C3",
        cire: "\u2257",
        cirfnint: "\u2A10",
        cirmid: "\u2AEF",
        cirscir: "\u29C2",
        ClockwiseContourIntegral: "\u2232",
        CloseCurlyDoubleQuote: "\u201D",
        CloseCurlyQuote: "\u2019",
        clubs: "\u2663",
        clubsuit: "\u2663",
        Colon: "\u2237",
        colon: ":",
        Colone: "\u2A74",
        colone: "\u2254",
        coloneq: "\u2254",
        comma: ",",
        commat: "@",
        comp: "\u2201",
        compfn: "\u2218",
        complement: "\u2201",
        complexes: "\u2102",
        cong: "\u2245",
        congdot: "\u2A6D",
        Congruent: "\u2261",
        Conint: "\u222F",
        conint: "\u222E",
        ContourIntegral: "\u222E",
        Copf: "\u2102",
        copf: "\u{1D554}",
        coprod: "\u2210",
        Coproduct: "\u2210",
        COPY: "\xA9",
        copy: "\xA9",
        copysr: "\u2117",
        CounterClockwiseContourIntegral: "\u2233",
        crarr: "\u21B5",
        Cross: "\u2A2F",
        cross: "\u2717",
        Cscr: "\u{1D49E}",
        cscr: "\u{1D4B8}",
        csub: "\u2ACF",
        csube: "\u2AD1",
        csup: "\u2AD0",
        csupe: "\u2AD2",
        ctdot: "\u22EF",
        cudarrl: "\u2938",
        cudarrr: "\u2935",
        cuepr: "\u22DE",
        cuesc: "\u22DF",
        cularr: "\u21B6",
        cularrp: "\u293D",
        Cup: "\u22D3",
        cup: "\u222A",
        cupbrcap: "\u2A48",
        CupCap: "\u224D",
        cupcap: "\u2A46",
        cupcup: "\u2A4A",
        cupdot: "\u228D",
        cupor: "\u2A45",
        cups: "\u222A\uFE00",
        curarr: "\u21B7",
        curarrm: "\u293C",
        curlyeqprec: "\u22DE",
        curlyeqsucc: "\u22DF",
        curlyvee: "\u22CE",
        curlywedge: "\u22CF",
        curren: "\xA4",
        curvearrowleft: "\u21B6",
        curvearrowright: "\u21B7",
        cuvee: "\u22CE",
        cuwed: "\u22CF",
        cwconint: "\u2232",
        cwint: "\u2231",
        cylcty: "\u232D",
        Dagger: "\u2021",
        dagger: "\u2020",
        daleth: "\u2138",
        Darr: "\u21A1",
        dArr: "\u21D3",
        darr: "\u2193",
        dash: "\u2010",
        Dashv: "\u2AE4",
        dashv: "\u22A3",
        dbkarow: "\u290F",
        dblac: "\u02DD",
        Dcaron: "\u010E",
        dcaron: "\u010F",
        Dcy: "\u0414",
        dcy: "\u0434",
        DD: "\u2145",
        dd: "\u2146",
        ddagger: "\u2021",
        ddarr: "\u21CA",
        DDotrahd: "\u2911",
        ddotseq: "\u2A77",
        deg: "\xB0",
        Del: "\u2207",
        Delta: "\u0394",
        delta: "\u03B4",
        demptyv: "\u29B1",
        dfisht: "\u297F",
        Dfr: "\u{1D507}",
        dfr: "\u{1D521}",
        dHar: "\u2965",
        dharl: "\u21C3",
        dharr: "\u21C2",
        DiacriticalAcute: "\xB4",
        DiacriticalDot: "\u02D9",
        DiacriticalDoubleAcute: "\u02DD",
        DiacriticalGrave: "`",
        DiacriticalTilde: "\u02DC",
        diam: "\u22C4",
        Diamond: "\u22C4",
        diamond: "\u22C4",
        diamondsuit: "\u2666",
        diams: "\u2666",
        die: "\xA8",
        DifferentialD: "\u2146",
        digamma: "\u03DD",
        disin: "\u22F2",
        div: "\xF7",
        divide: "\xF7",
        divideontimes: "\u22C7",
        divonx: "\u22C7",
        DJcy: "\u0402",
        djcy: "\u0452",
        dlcorn: "\u231E",
        dlcrop: "\u230D",
        dollar: "$",
        Dopf: "\u{1D53B}",
        dopf: "\u{1D555}",
        Dot: "\xA8",
        dot: "\u02D9",
        DotDot: "\u20DC",
        doteq: "\u2250",
        doteqdot: "\u2251",
        DotEqual: "\u2250",
        dotminus: "\u2238",
        dotplus: "\u2214",
        dotsquare: "\u22A1",
        doublebarwedge: "\u2306",
        DoubleContourIntegral: "\u222F",
        DoubleDot: "\xA8",
        DoubleDownArrow: "\u21D3",
        DoubleLeftArrow: "\u21D0",
        DoubleLeftRightArrow: "\u21D4",
        DoubleLeftTee: "\u2AE4",
        DoubleLongLeftArrow: "\u27F8",
        DoubleLongLeftRightArrow: "\u27FA",
        DoubleLongRightArrow: "\u27F9",
        DoubleRightArrow: "\u21D2",
        DoubleRightTee: "\u22A8",
        DoubleUpArrow: "\u21D1",
        DoubleUpDownArrow: "\u21D5",
        DoubleVerticalBar: "\u2225",
        DownArrow: "\u2193",
        Downarrow: "\u21D3",
        downarrow: "\u2193",
        DownArrowBar: "\u2913",
        DownArrowUpArrow: "\u21F5",
        DownBreve: "\u0311",
        downdownarrows: "\u21CA",
        downharpoonleft: "\u21C3",
        downharpoonright: "\u21C2",
        DownLeftRightVector: "\u2950",
        DownLeftTeeVector: "\u295E",
        DownLeftVector: "\u21BD",
        DownLeftVectorBar: "\u2956",
        DownRightTeeVector: "\u295F",
        DownRightVector: "\u21C1",
        DownRightVectorBar: "\u2957",
        DownTee: "\u22A4",
        DownTeeArrow: "\u21A7",
        drbkarow: "\u2910",
        drcorn: "\u231F",
        drcrop: "\u230C",
        Dscr: "\u{1D49F}",
        dscr: "\u{1D4B9}",
        DScy: "\u0405",
        dscy: "\u0455",
        dsol: "\u29F6",
        Dstrok: "\u0110",
        dstrok: "\u0111",
        dtdot: "\u22F1",
        dtri: "\u25BF",
        dtrif: "\u25BE",
        duarr: "\u21F5",
        duhar: "\u296F",
        dwangle: "\u29A6",
        DZcy: "\u040F",
        dzcy: "\u045F",
        dzigrarr: "\u27FF",
        Eacute: "\xC9",
        eacute: "\xE9",
        easter: "\u2A6E",
        Ecaron: "\u011A",
        ecaron: "\u011B",
        ecir: "\u2256",
        Ecirc: "\xCA",
        ecirc: "\xEA",
        ecolon: "\u2255",
        Ecy: "\u042D",
        ecy: "\u044D",
        eDDot: "\u2A77",
        Edot: "\u0116",
        eDot: "\u2251",
        edot: "\u0117",
        ee: "\u2147",
        efDot: "\u2252",
        Efr: "\u{1D508}",
        efr: "\u{1D522}",
        eg: "\u2A9A",
        Egrave: "\xC8",
        egrave: "\xE8",
        egs: "\u2A96",
        egsdot: "\u2A98",
        el: "\u2A99",
        Element: "\u2208",
        elinters: "\u23E7",
        ell: "\u2113",
        els: "\u2A95",
        elsdot: "\u2A97",
        Emacr: "\u0112",
        emacr: "\u0113",
        empty: "\u2205",
        emptyset: "\u2205",
        EmptySmallSquare: "\u25FB",
        emptyv: "\u2205",
        EmptyVerySmallSquare: "\u25AB",
        emsp: "\u2003",
        emsp13: "\u2004",
        emsp14: "\u2005",
        ENG: "\u014A",
        eng: "\u014B",
        ensp: "\u2002",
        Eogon: "\u0118",
        eogon: "\u0119",
        Eopf: "\u{1D53C}",
        eopf: "\u{1D556}",
        epar: "\u22D5",
        eparsl: "\u29E3",
        eplus: "\u2A71",
        epsi: "\u03B5",
        Epsilon: "\u0395",
        epsilon: "\u03B5",
        epsiv: "\u03F5",
        eqcirc: "\u2256",
        eqcolon: "\u2255",
        eqsim: "\u2242",
        eqslantgtr: "\u2A96",
        eqslantless: "\u2A95",
        Equal: "\u2A75",
        equals: "=",
        EqualTilde: "\u2242",
        equest: "\u225F",
        Equilibrium: "\u21CC",
        equiv: "\u2261",
        equivDD: "\u2A78",
        eqvparsl: "\u29E5",
        erarr: "\u2971",
        erDot: "\u2253",
        Escr: "\u2130",
        escr: "\u212F",
        esdot: "\u2250",
        Esim: "\u2A73",
        esim: "\u2242",
        Eta: "\u0397",
        eta: "\u03B7",
        ETH: "\xD0",
        eth: "\xF0",
        Euml: "\xCB",
        euml: "\xEB",
        euro: "\u20AC",
        excl: "!",
        exist: "\u2203",
        Exists: "\u2203",
        expectation: "\u2130",
        ExponentialE: "\u2147",
        exponentiale: "\u2147",
        fallingdotseq: "\u2252",
        Fcy: "\u0424",
        fcy: "\u0444",
        female: "\u2640",
        ffilig: "\uFB03",
        fflig: "\uFB00",
        ffllig: "\uFB04",
        Ffr: "\u{1D509}",
        ffr: "\u{1D523}",
        filig: "\uFB01",
        FilledSmallSquare: "\u25FC",
        FilledVerySmallSquare: "\u25AA",
        fjlig: "fj",
        flat: "\u266D",
        fllig: "\uFB02",
        fltns: "\u25B1",
        fnof: "\u0192",
        Fopf: "\u{1D53D}",
        fopf: "\u{1D557}",
        ForAll: "\u2200",
        forall: "\u2200",
        fork: "\u22D4",
        forkv: "\u2AD9",
        Fouriertrf: "\u2131",
        fpartint: "\u2A0D",
        frac12: "\xBD",
        frac13: "\u2153",
        frac14: "\xBC",
        frac15: "\u2155",
        frac16: "\u2159",
        frac18: "\u215B",
        frac23: "\u2154",
        frac25: "\u2156",
        frac34: "\xBE",
        frac35: "\u2157",
        frac38: "\u215C",
        frac45: "\u2158",
        frac56: "\u215A",
        frac58: "\u215D",
        frac78: "\u215E",
        frasl: "\u2044",
        frown: "\u2322",
        Fscr: "\u2131",
        fscr: "\u{1D4BB}",
        gacute: "\u01F5",
        Gamma: "\u0393",
        gamma: "\u03B3",
        Gammad: "\u03DC",
        gammad: "\u03DD",
        gap: "\u2A86",
        Gbreve: "\u011E",
        gbreve: "\u011F",
        Gcedil: "\u0122",
        Gcirc: "\u011C",
        gcirc: "\u011D",
        Gcy: "\u0413",
        gcy: "\u0433",
        Gdot: "\u0120",
        gdot: "\u0121",
        gE: "\u2267",
        ge: "\u2265",
        gEl: "\u2A8C",
        gel: "\u22DB",
        geq: "\u2265",
        geqq: "\u2267",
        geqslant: "\u2A7E",
        ges: "\u2A7E",
        gescc: "\u2AA9",
        gesdot: "\u2A80",
        gesdoto: "\u2A82",
        gesdotol: "\u2A84",
        gesl: "\u22DB\uFE00",
        gesles: "\u2A94",
        Gfr: "\u{1D50A}",
        gfr: "\u{1D524}",
        Gg: "\u22D9",
        gg: "\u226B",
        ggg: "\u22D9",
        gimel: "\u2137",
        GJcy: "\u0403",
        gjcy: "\u0453",
        gl: "\u2277",
        gla: "\u2AA5",
        glE: "\u2A92",
        glj: "\u2AA4",
        gnap: "\u2A8A",
        gnapprox: "\u2A8A",
        gnE: "\u2269",
        gne: "\u2A88",
        gneq: "\u2A88",
        gneqq: "\u2269",
        gnsim: "\u22E7",
        Gopf: "\u{1D53E}",
        gopf: "\u{1D558}",
        grave: "`",
        GreaterEqual: "\u2265",
        GreaterEqualLess: "\u22DB",
        GreaterFullEqual: "\u2267",
        GreaterGreater: "\u2AA2",
        GreaterLess: "\u2277",
        GreaterSlantEqual: "\u2A7E",
        GreaterTilde: "\u2273",
        Gscr: "\u{1D4A2}",
        gscr: "\u210A",
        gsim: "\u2273",
        gsime: "\u2A8E",
        gsiml: "\u2A90",
        Gt: "\u226B",
        GT: ">",
        gt: ">",
        gtcc: "\u2AA7",
        gtcir: "\u2A7A",
        gtdot: "\u22D7",
        gtlPar: "\u2995",
        gtquest: "\u2A7C",
        gtrapprox: "\u2A86",
        gtrarr: "\u2978",
        gtrdot: "\u22D7",
        gtreqless: "\u22DB",
        gtreqqless: "\u2A8C",
        gtrless: "\u2277",
        gtrsim: "\u2273",
        gvertneqq: "\u2269\uFE00",
        gvnE: "\u2269\uFE00",
        Hacek: "\u02C7",
        hairsp: "\u200A",
        half: "\xBD",
        hamilt: "\u210B",
        HARDcy: "\u042A",
        hardcy: "\u044A",
        hArr: "\u21D4",
        harr: "\u2194",
        harrcir: "\u2948",
        harrw: "\u21AD",
        Hat: "^",
        hbar: "\u210F",
        Hcirc: "\u0124",
        hcirc: "\u0125",
        hearts: "\u2665",
        heartsuit: "\u2665",
        hellip: "\u2026",
        hercon: "\u22B9",
        Hfr: "\u210C",
        hfr: "\u{1D525}",
        HilbertSpace: "\u210B",
        hksearow: "\u2925",
        hkswarow: "\u2926",
        hoarr: "\u21FF",
        homtht: "\u223B",
        hookleftarrow: "\u21A9",
        hookrightarrow: "\u21AA",
        Hopf: "\u210D",
        hopf: "\u{1D559}",
        horbar: "\u2015",
        HorizontalLine: "\u2500",
        Hscr: "\u210B",
        hscr: "\u{1D4BD}",
        hslash: "\u210F",
        Hstrok: "\u0126",
        hstrok: "\u0127",
        HumpDownHump: "\u224E",
        HumpEqual: "\u224F",
        hybull: "\u2043",
        hyphen: "\u2010",
        Iacute: "\xCD",
        iacute: "\xED",
        ic: "\u2063",
        Icirc: "\xCE",
        icirc: "\xEE",
        Icy: "\u0418",
        icy: "\u0438",
        Idot: "\u0130",
        IEcy: "\u0415",
        iecy: "\u0435",
        iexcl: "\xA1",
        iff: "\u21D4",
        Ifr: "\u2111",
        ifr: "\u{1D526}",
        Igrave: "\xCC",
        igrave: "\xEC",
        ii: "\u2148",
        iiiint: "\u2A0C",
        iiint: "\u222D",
        iinfin: "\u29DC",
        iiota: "\u2129",
        IJlig: "\u0132",
        ijlig: "\u0133",
        Im: "\u2111",
        Imacr: "\u012A",
        imacr: "\u012B",
        image: "\u2111",
        ImaginaryI: "\u2148",
        imagline: "\u2110",
        imagpart: "\u2111",
        imath: "\u0131",
        imof: "\u22B7",
        imped: "\u01B5",
        Implies: "\u21D2",
        in: "\u2208",
        incare: "\u2105",
        infin: "\u221E",
        infintie: "\u29DD",
        inodot: "\u0131",
        Int: "\u222C",
        int: "\u222B",
        intcal: "\u22BA",
        integers: "\u2124",
        Integral: "\u222B",
        intercal: "\u22BA",
        Intersection: "\u22C2",
        intlarhk: "\u2A17",
        intprod: "\u2A3C",
        InvisibleComma: "\u2063",
        InvisibleTimes: "\u2062",
        IOcy: "\u0401",
        iocy: "\u0451",
        Iogon: "\u012E",
        iogon: "\u012F",
        Iopf: "\u{1D540}",
        iopf: "\u{1D55A}",
        Iota: "\u0399",
        iota: "\u03B9",
        iprod: "\u2A3C",
        iquest: "\xBF",
        Iscr: "\u2110",
        iscr: "\u{1D4BE}",
        isin: "\u2208",
        isindot: "\u22F5",
        isinE: "\u22F9",
        isins: "\u22F4",
        isinsv: "\u22F3",
        isinv: "\u2208",
        it: "\u2062",
        Itilde: "\u0128",
        itilde: "\u0129",
        Iukcy: "\u0406",
        iukcy: "\u0456",
        Iuml: "\xCF",
        iuml: "\xEF",
        Jcirc: "\u0134",
        jcirc: "\u0135",
        Jcy: "\u0419",
        jcy: "\u0439",
        Jfr: "\u{1D50D}",
        jfr: "\u{1D527}",
        jmath: "\u0237",
        Jopf: "\u{1D541}",
        jopf: "\u{1D55B}",
        Jscr: "\u{1D4A5}",
        jscr: "\u{1D4BF}",
        Jsercy: "\u0408",
        jsercy: "\u0458",
        Jukcy: "\u0404",
        jukcy: "\u0454",
        Kappa: "\u039A",
        kappa: "\u03BA",
        kappav: "\u03F0",
        Kcedil: "\u0136",
        kcedil: "\u0137",
        Kcy: "\u041A",
        kcy: "\u043A",
        Kfr: "\u{1D50E}",
        kfr: "\u{1D528}",
        kgreen: "\u0138",
        KHcy: "\u0425",
        khcy: "\u0445",
        KJcy: "\u040C",
        kjcy: "\u045C",
        Kopf: "\u{1D542}",
        kopf: "\u{1D55C}",
        Kscr: "\u{1D4A6}",
        kscr: "\u{1D4C0}",
        lAarr: "\u21DA",
        Lacute: "\u0139",
        lacute: "\u013A",
        laemptyv: "\u29B4",
        lagran: "\u2112",
        Lambda: "\u039B",
        lambda: "\u03BB",
        Lang: "\u27EA",
        lang: "\u27E8",
        langd: "\u2991",
        langle: "\u27E8",
        lap: "\u2A85",
        Laplacetrf: "\u2112",
        laquo: "\xAB",
        Larr: "\u219E",
        lArr: "\u21D0",
        larr: "\u2190",
        larrb: "\u21E4",
        larrbfs: "\u291F",
        larrfs: "\u291D",
        larrhk: "\u21A9",
        larrlp: "\u21AB",
        larrpl: "\u2939",
        larrsim: "\u2973",
        larrtl: "\u21A2",
        lat: "\u2AAB",
        lAtail: "\u291B",
        latail: "\u2919",
        late: "\u2AAD",
        lates: "\u2AAD\uFE00",
        lBarr: "\u290E",
        lbarr: "\u290C",
        lbbrk: "\u2772",
        lbrace: "{",
        lbrack: "[",
        lbrke: "\u298B",
        lbrksld: "\u298F",
        lbrkslu: "\u298D",
        Lcaron: "\u013D",
        lcaron: "\u013E",
        Lcedil: "\u013B",
        lcedil: "\u013C",
        lceil: "\u2308",
        lcub: "{",
        Lcy: "\u041B",
        lcy: "\u043B",
        ldca: "\u2936",
        ldquo: "\u201C",
        ldquor: "\u201E",
        ldrdhar: "\u2967",
        ldrushar: "\u294B",
        ldsh: "\u21B2",
        lE: "\u2266",
        le: "\u2264",
        LeftAngleBracket: "\u27E8",
        LeftArrow: "\u2190",
        Leftarrow: "\u21D0",
        leftarrow: "\u2190",
        LeftArrowBar: "\u21E4",
        LeftArrowRightArrow: "\u21C6",
        leftarrowtail: "\u21A2",
        LeftCeiling: "\u2308",
        LeftDoubleBracket: "\u27E6",
        LeftDownTeeVector: "\u2961",
        LeftDownVector: "\u21C3",
        LeftDownVectorBar: "\u2959",
        LeftFloor: "\u230A",
        leftharpoondown: "\u21BD",
        leftharpoonup: "\u21BC",
        leftleftarrows: "\u21C7",
        LeftRightArrow: "\u2194",
        Leftrightarrow: "\u21D4",
        leftrightarrow: "\u2194",
        leftrightarrows: "\u21C6",
        leftrightharpoons: "\u21CB",
        leftrightsquigarrow: "\u21AD",
        LeftRightVector: "\u294E",
        LeftTee: "\u22A3",
        LeftTeeArrow: "\u21A4",
        LeftTeeVector: "\u295A",
        leftthreetimes: "\u22CB",
        LeftTriangle: "\u22B2",
        LeftTriangleBar: "\u29CF",
        LeftTriangleEqual: "\u22B4",
        LeftUpDownVector: "\u2951",
        LeftUpTeeVector: "\u2960",
        LeftUpVector: "\u21BF",
        LeftUpVectorBar: "\u2958",
        LeftVector: "\u21BC",
        LeftVectorBar: "\u2952",
        lEg: "\u2A8B",
        leg: "\u22DA",
        leq: "\u2264",
        leqq: "\u2266",
        leqslant: "\u2A7D",
        les: "\u2A7D",
        lescc: "\u2AA8",
        lesdot: "\u2A7F",
        lesdoto: "\u2A81",
        lesdotor: "\u2A83",
        lesg: "\u22DA\uFE00",
        lesges: "\u2A93",
        lessapprox: "\u2A85",
        lessdot: "\u22D6",
        lesseqgtr: "\u22DA",
        lesseqqgtr: "\u2A8B",
        LessEqualGreater: "\u22DA",
        LessFullEqual: "\u2266",
        LessGreater: "\u2276",
        lessgtr: "\u2276",
        LessLess: "\u2AA1",
        lesssim: "\u2272",
        LessSlantEqual: "\u2A7D",
        LessTilde: "\u2272",
        lfisht: "\u297C",
        lfloor: "\u230A",
        Lfr: "\u{1D50F}",
        lfr: "\u{1D529}",
        lg: "\u2276",
        lgE: "\u2A91",
        lHar: "\u2962",
        lhard: "\u21BD",
        lharu: "\u21BC",
        lharul: "\u296A",
        lhblk: "\u2584",
        LJcy: "\u0409",
        ljcy: "\u0459",
        Ll: "\u22D8",
        ll: "\u226A",
        llarr: "\u21C7",
        llcorner: "\u231E",
        Lleftarrow: "\u21DA",
        llhard: "\u296B",
        lltri: "\u25FA",
        Lmidot: "\u013F",
        lmidot: "\u0140",
        lmoust: "\u23B0",
        lmoustache: "\u23B0",
        lnap: "\u2A89",
        lnapprox: "\u2A89",
        lnE: "\u2268",
        lne: "\u2A87",
        lneq: "\u2A87",
        lneqq: "\u2268",
        lnsim: "\u22E6",
        loang: "\u27EC",
        loarr: "\u21FD",
        lobrk: "\u27E6",
        LongLeftArrow: "\u27F5",
        Longleftarrow: "\u27F8",
        longleftarrow: "\u27F5",
        LongLeftRightArrow: "\u27F7",
        Longleftrightarrow: "\u27FA",
        longleftrightarrow: "\u27F7",
        longmapsto: "\u27FC",
        LongRightArrow: "\u27F6",
        Longrightarrow: "\u27F9",
        longrightarrow: "\u27F6",
        looparrowleft: "\u21AB",
        looparrowright: "\u21AC",
        lopar: "\u2985",
        Lopf: "\u{1D543}",
        lopf: "\u{1D55D}",
        loplus: "\u2A2D",
        lotimes: "\u2A34",
        lowast: "\u2217",
        lowbar: "_",
        LowerLeftArrow: "\u2199",
        LowerRightArrow: "\u2198",
        loz: "\u25CA",
        lozenge: "\u25CA",
        lozf: "\u29EB",
        lpar: "(",
        lparlt: "\u2993",
        lrarr: "\u21C6",
        lrcorner: "\u231F",
        lrhar: "\u21CB",
        lrhard: "\u296D",
        lrm: "\u200E",
        lrtri: "\u22BF",
        lsaquo: "\u2039",
        Lscr: "\u2112",
        lscr: "\u{1D4C1}",
        Lsh: "\u21B0",
        lsh: "\u21B0",
        lsim: "\u2272",
        lsime: "\u2A8D",
        lsimg: "\u2A8F",
        lsqb: "[",
        lsquo: "\u2018",
        lsquor: "\u201A",
        Lstrok: "\u0141",
        lstrok: "\u0142",
        Lt: "\u226A",
        LT: "<",
        lt: "<",
        ltcc: "\u2AA6",
        ltcir: "\u2A79",
        ltdot: "\u22D6",
        lthree: "\u22CB",
        ltimes: "\u22C9",
        ltlarr: "\u2976",
        ltquest: "\u2A7B",
        ltri: "\u25C3",
        ltrie: "\u22B4",
        ltrif: "\u25C2",
        ltrPar: "\u2996",
        lurdshar: "\u294A",
        luruhar: "\u2966",
        lvertneqq: "\u2268\uFE00",
        lvnE: "\u2268\uFE00",
        macr: "\xAF",
        male: "\u2642",
        malt: "\u2720",
        maltese: "\u2720",
        Map: "\u2905",
        map: "\u21A6",
        mapsto: "\u21A6",
        mapstodown: "\u21A7",
        mapstoleft: "\u21A4",
        mapstoup: "\u21A5",
        marker: "\u25AE",
        mcomma: "\u2A29",
        Mcy: "\u041C",
        mcy: "\u043C",
        mdash: "\u2014",
        mDDot: "\u223A",
        measuredangle: "\u2221",
        MediumSpace: "\u205F",
        Mellintrf: "\u2133",
        Mfr: "\u{1D510}",
        mfr: "\u{1D52A}",
        mho: "\u2127",
        micro: "\xB5",
        mid: "\u2223",
        midast: "*",
        midcir: "\u2AF0",
        middot: "\xB7",
        minus: "\u2212",
        minusb: "\u229F",
        minusd: "\u2238",
        minusdu: "\u2A2A",
        MinusPlus: "\u2213",
        mlcp: "\u2ADB",
        mldr: "\u2026",
        mnplus: "\u2213",
        models: "\u22A7",
        Mopf: "\u{1D544}",
        mopf: "\u{1D55E}",
        mp: "\u2213",
        Mscr: "\u2133",
        mscr: "\u{1D4C2}",
        mstpos: "\u223E",
        Mu: "\u039C",
        mu: "\u03BC",
        multimap: "\u22B8",
        mumap: "\u22B8",
        nabla: "\u2207",
        Nacute: "\u0143",
        nacute: "\u0144",
        nang: "\u2220\u20D2",
        nap: "\u2249",
        napE: "\u2A70\u0338",
        napid: "\u224B\u0338",
        napos: "\u0149",
        napprox: "\u2249",
        natur: "\u266E",
        natural: "\u266E",
        naturals: "\u2115",
        nbsp: "\xA0",
        nbump: "\u224E\u0338",
        nbumpe: "\u224F\u0338",
        ncap: "\u2A43",
        Ncaron: "\u0147",
        ncaron: "\u0148",
        Ncedil: "\u0145",
        ncedil: "\u0146",
        ncong: "\u2247",
        ncongdot: "\u2A6D\u0338",
        ncup: "\u2A42",
        Ncy: "\u041D",
        ncy: "\u043D",
        ndash: "\u2013",
        ne: "\u2260",
        nearhk: "\u2924",
        neArr: "\u21D7",
        nearr: "\u2197",
        nearrow: "\u2197",
        nedot: "\u2250\u0338",
        NegativeMediumSpace: "\u200B",
        NegativeThickSpace: "\u200B",
        NegativeThinSpace: "\u200B",
        NegativeVeryThinSpace: "\u200B",
        nequiv: "\u2262",
        nesear: "\u2928",
        nesim: "\u2242\u0338",
        NestedGreaterGreater: "\u226B",
        NestedLessLess: "\u226A",
        NewLine: "\n",
        nexist: "\u2204",
        nexists: "\u2204",
        Nfr: "\u{1D511}",
        nfr: "\u{1D52B}",
        ngE: "\u2267\u0338",
        nge: "\u2271",
        ngeq: "\u2271",
        ngeqq: "\u2267\u0338",
        ngeqslant: "\u2A7E\u0338",
        nges: "\u2A7E\u0338",
        nGg: "\u22D9\u0338",
        ngsim: "\u2275",
        nGt: "\u226B\u20D2",
        ngt: "\u226F",
        ngtr: "\u226F",
        nGtv: "\u226B\u0338",
        nhArr: "\u21CE",
        nharr: "\u21AE",
        nhpar: "\u2AF2",
        ni: "\u220B",
        nis: "\u22FC",
        nisd: "\u22FA",
        niv: "\u220B",
        NJcy: "\u040A",
        njcy: "\u045A",
        nlArr: "\u21CD",
        nlarr: "\u219A",
        nldr: "\u2025",
        nlE: "\u2266\u0338",
        nle: "\u2270",
        nLeftarrow: "\u21CD",
        nleftarrow: "\u219A",
        nLeftrightarrow: "\u21CE",
        nleftrightarrow: "\u21AE",
        nleq: "\u2270",
        nleqq: "\u2266\u0338",
        nleqslant: "\u2A7D\u0338",
        nles: "\u2A7D\u0338",
        nless: "\u226E",
        nLl: "\u22D8\u0338",
        nlsim: "\u2274",
        nLt: "\u226A\u20D2",
        nlt: "\u226E",
        nltri: "\u22EA",
        nltrie: "\u22EC",
        nLtv: "\u226A\u0338",
        nmid: "\u2224",
        NoBreak: "\u2060",
        NonBreakingSpace: "\xA0",
        Nopf: "\u2115",
        nopf: "\u{1D55F}",
        Not: "\u2AEC",
        not: "\xAC",
        NotCongruent: "\u2262",
        NotCupCap: "\u226D",
        NotDoubleVerticalBar: "\u2226",
        NotElement: "\u2209",
        NotEqual: "\u2260",
        NotEqualTilde: "\u2242\u0338",
        NotExists: "\u2204",
        NotGreater: "\u226F",
        NotGreaterEqual: "\u2271",
        NotGreaterFullEqual: "\u2267\u0338",
        NotGreaterGreater: "\u226B\u0338",
        NotGreaterLess: "\u2279",
        NotGreaterSlantEqual: "\u2A7E\u0338",
        NotGreaterTilde: "\u2275",
        NotHumpDownHump: "\u224E\u0338",
        NotHumpEqual: "\u224F\u0338",
        notin: "\u2209",
        notindot: "\u22F5\u0338",
        notinE: "\u22F9\u0338",
        notinva: "\u2209",
        notinvb: "\u22F7",
        notinvc: "\u22F6",
        NotLeftTriangle: "\u22EA",
        NotLeftTriangleBar: "\u29CF\u0338",
        NotLeftTriangleEqual: "\u22EC",
        NotLess: "\u226E",
        NotLessEqual: "\u2270",
        NotLessGreater: "\u2278",
        NotLessLess: "\u226A\u0338",
        NotLessSlantEqual: "\u2A7D\u0338",
        NotLessTilde: "\u2274",
        NotNestedGreaterGreater: "\u2AA2\u0338",
        NotNestedLessLess: "\u2AA1\u0338",
        notni: "\u220C",
        notniva: "\u220C",
        notnivb: "\u22FE",
        notnivc: "\u22FD",
        NotPrecedes: "\u2280",
        NotPrecedesEqual: "\u2AAF\u0338",
        NotPrecedesSlantEqual: "\u22E0",
        NotReverseElement: "\u220C",
        NotRightTriangle: "\u22EB",
        NotRightTriangleBar: "\u29D0\u0338",
        NotRightTriangleEqual: "\u22ED",
        NotSquareSubset: "\u228F\u0338",
        NotSquareSubsetEqual: "\u22E2",
        NotSquareSuperset: "\u2290\u0338",
        NotSquareSupersetEqual: "\u22E3",
        NotSubset: "\u2282\u20D2",
        NotSubsetEqual: "\u2288",
        NotSucceeds: "\u2281",
        NotSucceedsEqual: "\u2AB0\u0338",
        NotSucceedsSlantEqual: "\u22E1",
        NotSucceedsTilde: "\u227F\u0338",
        NotSuperset: "\u2283\u20D2",
        NotSupersetEqual: "\u2289",
        NotTilde: "\u2241",
        NotTildeEqual: "\u2244",
        NotTildeFullEqual: "\u2247",
        NotTildeTilde: "\u2249",
        NotVerticalBar: "\u2224",
        npar: "\u2226",
        nparallel: "\u2226",
        nparsl: "\u2AFD\u20E5",
        npart: "\u2202\u0338",
        npolint: "\u2A14",
        npr: "\u2280",
        nprcue: "\u22E0",
        npre: "\u2AAF\u0338",
        nprec: "\u2280",
        npreceq: "\u2AAF\u0338",
        nrArr: "\u21CF",
        nrarr: "\u219B",
        nrarrc: "\u2933\u0338",
        nrarrw: "\u219D\u0338",
        nRightarrow: "\u21CF",
        nrightarrow: "\u219B",
        nrtri: "\u22EB",
        nrtrie: "\u22ED",
        nsc: "\u2281",
        nsccue: "\u22E1",
        nsce: "\u2AB0\u0338",
        Nscr: "\u{1D4A9}",
        nscr: "\u{1D4C3}",
        nshortmid: "\u2224",
        nshortparallel: "\u2226",
        nsim: "\u2241",
        nsime: "\u2244",
        nsimeq: "\u2244",
        nsmid: "\u2224",
        nspar: "\u2226",
        nsqsube: "\u22E2",
        nsqsupe: "\u22E3",
        nsub: "\u2284",
        nsubE: "\u2AC5\u0338",
        nsube: "\u2288",
        nsubset: "\u2282\u20D2",
        nsubseteq: "\u2288",
        nsubseteqq: "\u2AC5\u0338",
        nsucc: "\u2281",
        nsucceq: "\u2AB0\u0338",
        nsup: "\u2285",
        nsupE: "\u2AC6\u0338",
        nsupe: "\u2289",
        nsupset: "\u2283\u20D2",
        nsupseteq: "\u2289",
        nsupseteqq: "\u2AC6\u0338",
        ntgl: "\u2279",
        Ntilde: "\xD1",
        ntilde: "\xF1",
        ntlg: "\u2278",
        ntriangleleft: "\u22EA",
        ntrianglelefteq: "\u22EC",
        ntriangleright: "\u22EB",
        ntrianglerighteq: "\u22ED",
        Nu: "\u039D",
        nu: "\u03BD",
        num: "#",
        numero: "\u2116",
        numsp: "\u2007",
        nvap: "\u224D\u20D2",
        nVDash: "\u22AF",
        nVdash: "\u22AE",
        nvDash: "\u22AD",
        nvdash: "\u22AC",
        nvge: "\u2265\u20D2",
        nvgt: ">\u20D2",
        nvHarr: "\u2904",
        nvinfin: "\u29DE",
        nvlArr: "\u2902",
        nvle: "\u2264\u20D2",
        nvlt: "<\u20D2",
        nvltrie: "\u22B4\u20D2",
        nvrArr: "\u2903",
        nvrtrie: "\u22B5\u20D2",
        nvsim: "\u223C\u20D2",
        nwarhk: "\u2923",
        nwArr: "\u21D6",
        nwarr: "\u2196",
        nwarrow: "\u2196",
        nwnear: "\u2927",
        Oacute: "\xD3",
        oacute: "\xF3",
        oast: "\u229B",
        ocir: "\u229A",
        Ocirc: "\xD4",
        ocirc: "\xF4",
        Ocy: "\u041E",
        ocy: "\u043E",
        odash: "\u229D",
        Odblac: "\u0150",
        odblac: "\u0151",
        odiv: "\u2A38",
        odot: "\u2299",
        odsold: "\u29BC",
        OElig: "\u0152",
        oelig: "\u0153",
        ofcir: "\u29BF",
        Ofr: "\u{1D512}",
        ofr: "\u{1D52C}",
        ogon: "\u02DB",
        Ograve: "\xD2",
        ograve: "\xF2",
        ogt: "\u29C1",
        ohbar: "\u29B5",
        ohm: "\u03A9",
        oint: "\u222E",
        olarr: "\u21BA",
        olcir: "\u29BE",
        olcross: "\u29BB",
        oline: "\u203E",
        olt: "\u29C0",
        Omacr: "\u014C",
        omacr: "\u014D",
        Omega: "\u03A9",
        omega: "\u03C9",
        Omicron: "\u039F",
        omicron: "\u03BF",
        omid: "\u29B6",
        ominus: "\u2296",
        Oopf: "\u{1D546}",
        oopf: "\u{1D560}",
        opar: "\u29B7",
        OpenCurlyDoubleQuote: "\u201C",
        OpenCurlyQuote: "\u2018",
        operp: "\u29B9",
        oplus: "\u2295",
        Or: "\u2A54",
        or: "\u2228",
        orarr: "\u21BB",
        ord: "\u2A5D",
        order: "\u2134",
        orderof: "\u2134",
        ordf: "\xAA",
        ordm: "\xBA",
        origof: "\u22B6",
        oror: "\u2A56",
        orslope: "\u2A57",
        orv: "\u2A5B",
        oS: "\u24C8",
        Oscr: "\u{1D4AA}",
        oscr: "\u2134",
        Oslash: "\xD8",
        oslash: "\xF8",
        osol: "\u2298",
        Otilde: "\xD5",
        otilde: "\xF5",
        Otimes: "\u2A37",
        otimes: "\u2297",
        otimesas: "\u2A36",
        Ouml: "\xD6",
        ouml: "\xF6",
        ovbar: "\u233D",
        OverBar: "\u203E",
        OverBrace: "\u23DE",
        OverBracket: "\u23B4",
        OverParenthesis: "\u23DC",
        par: "\u2225",
        para: "\xB6",
        parallel: "\u2225",
        parsim: "\u2AF3",
        parsl: "\u2AFD",
        part: "\u2202",
        PartialD: "\u2202",
        Pcy: "\u041F",
        pcy: "\u043F",
        percnt: "%",
        period: ".",
        permil: "\u2030",
        perp: "\u22A5",
        pertenk: "\u2031",
        Pfr: "\u{1D513}",
        pfr: "\u{1D52D}",
        Phi: "\u03A6",
        phi: "\u03C6",
        phiv: "\u03D5",
        phmmat: "\u2133",
        phone: "\u260E",
        Pi: "\u03A0",
        pi: "\u03C0",
        pitchfork: "\u22D4",
        piv: "\u03D6",
        planck: "\u210F",
        planckh: "\u210E",
        plankv: "\u210F",
        plus: "+",
        plusacir: "\u2A23",
        plusb: "\u229E",
        pluscir: "\u2A22",
        plusdo: "\u2214",
        plusdu: "\u2A25",
        pluse: "\u2A72",
        PlusMinus: "\xB1",
        plusmn: "\xB1",
        plussim: "\u2A26",
        plustwo: "\u2A27",
        pm: "\xB1",
        Poincareplane: "\u210C",
        pointint: "\u2A15",
        Popf: "\u2119",
        popf: "\u{1D561}",
        pound: "\xA3",
        Pr: "\u2ABB",
        pr: "\u227A",
        prap: "\u2AB7",
        prcue: "\u227C",
        prE: "\u2AB3",
        pre: "\u2AAF",
        prec: "\u227A",
        precapprox: "\u2AB7",
        preccurlyeq: "\u227C",
        Precedes: "\u227A",
        PrecedesEqual: "\u2AAF",
        PrecedesSlantEqual: "\u227C",
        PrecedesTilde: "\u227E",
        preceq: "\u2AAF",
        precnapprox: "\u2AB9",
        precneqq: "\u2AB5",
        precnsim: "\u22E8",
        precsim: "\u227E",
        Prime: "\u2033",
        prime: "\u2032",
        primes: "\u2119",
        prnap: "\u2AB9",
        prnE: "\u2AB5",
        prnsim: "\u22E8",
        prod: "\u220F",
        Product: "\u220F",
        profalar: "\u232E",
        profline: "\u2312",
        profsurf: "\u2313",
        prop: "\u221D",
        Proportion: "\u2237",
        Proportional: "\u221D",
        propto: "\u221D",
        prsim: "\u227E",
        prurel: "\u22B0",
        Pscr: "\u{1D4AB}",
        pscr: "\u{1D4C5}",
        Psi: "\u03A8",
        psi: "\u03C8",
        puncsp: "\u2008",
        Qfr: "\u{1D514}",
        qfr: "\u{1D52E}",
        qint: "\u2A0C",
        Qopf: "\u211A",
        qopf: "\u{1D562}",
        qprime: "\u2057",
        Qscr: "\u{1D4AC}",
        qscr: "\u{1D4C6}",
        quaternions: "\u210D",
        quatint: "\u2A16",
        quest: "?",
        questeq: "\u225F",
        QUOT: '"',
        quot: '"',
        rAarr: "\u21DB",
        race: "\u223D\u0331",
        Racute: "\u0154",
        racute: "\u0155",
        radic: "\u221A",
        raemptyv: "\u29B3",
        Rang: "\u27EB",
        rang: "\u27E9",
        rangd: "\u2992",
        range: "\u29A5",
        rangle: "\u27E9",
        raquo: "\xBB",
        Rarr: "\u21A0",
        rArr: "\u21D2",
        rarr: "\u2192",
        rarrap: "\u2975",
        rarrb: "\u21E5",
        rarrbfs: "\u2920",
        rarrc: "\u2933",
        rarrfs: "\u291E",
        rarrhk: "\u21AA",
        rarrlp: "\u21AC",
        rarrpl: "\u2945",
        rarrsim: "\u2974",
        Rarrtl: "\u2916",
        rarrtl: "\u21A3",
        rarrw: "\u219D",
        rAtail: "\u291C",
        ratail: "\u291A",
        ratio: "\u2236",
        rationals: "\u211A",
        RBarr: "\u2910",
        rBarr: "\u290F",
        rbarr: "\u290D",
        rbbrk: "\u2773",
        rbrace: "}",
        rbrack: "]",
        rbrke: "\u298C",
        rbrksld: "\u298E",
        rbrkslu: "\u2990",
        Rcaron: "\u0158",
        rcaron: "\u0159",
        Rcedil: "\u0156",
        rcedil: "\u0157",
        rceil: "\u2309",
        rcub: "}",
        Rcy: "\u0420",
        rcy: "\u0440",
        rdca: "\u2937",
        rdldhar: "\u2969",
        rdquo: "\u201D",
        rdquor: "\u201D",
        rdsh: "\u21B3",
        Re: "\u211C",
        real: "\u211C",
        realine: "\u211B",
        realpart: "\u211C",
        reals: "\u211D",
        rect: "\u25AD",
        REG: "\xAE",
        reg: "\xAE",
        ReverseElement: "\u220B",
        ReverseEquilibrium: "\u21CB",
        ReverseUpEquilibrium: "\u296F",
        rfisht: "\u297D",
        rfloor: "\u230B",
        Rfr: "\u211C",
        rfr: "\u{1D52F}",
        rHar: "\u2964",
        rhard: "\u21C1",
        rharu: "\u21C0",
        rharul: "\u296C",
        Rho: "\u03A1",
        rho: "\u03C1",
        rhov: "\u03F1",
        RightAngleBracket: "\u27E9",
        RightArrow: "\u2192",
        Rightarrow: "\u21D2",
        rightarrow: "\u2192",
        RightArrowBar: "\u21E5",
        RightArrowLeftArrow: "\u21C4",
        rightarrowtail: "\u21A3",
        RightCeiling: "\u2309",
        RightDoubleBracket: "\u27E7",
        RightDownTeeVector: "\u295D",
        RightDownVector: "\u21C2",
        RightDownVectorBar: "\u2955",
        RightFloor: "\u230B",
        rightharpoondown: "\u21C1",
        rightharpoonup: "\u21C0",
        rightleftarrows: "\u21C4",
        rightleftharpoons: "\u21CC",
        rightrightarrows: "\u21C9",
        rightsquigarrow: "\u219D",
        RightTee: "\u22A2",
        RightTeeArrow: "\u21A6",
        RightTeeVector: "\u295B",
        rightthreetimes: "\u22CC",
        RightTriangle: "\u22B3",
        RightTriangleBar: "\u29D0",
        RightTriangleEqual: "\u22B5",
        RightUpDownVector: "\u294F",
        RightUpTeeVector: "\u295C",
        RightUpVector: "\u21BE",
        RightUpVectorBar: "\u2954",
        RightVector: "\u21C0",
        RightVectorBar: "\u2953",
        ring: "\u02DA",
        risingdotseq: "\u2253",
        rlarr: "\u21C4",
        rlhar: "\u21CC",
        rlm: "\u200F",
        rmoust: "\u23B1",
        rmoustache: "\u23B1",
        rnmid: "\u2AEE",
        roang: "\u27ED",
        roarr: "\u21FE",
        robrk: "\u27E7",
        ropar: "\u2986",
        Ropf: "\u211D",
        ropf: "\u{1D563}",
        roplus: "\u2A2E",
        rotimes: "\u2A35",
        RoundImplies: "\u2970",
        rpar: ")",
        rpargt: "\u2994",
        rppolint: "\u2A12",
        rrarr: "\u21C9",
        Rrightarrow: "\u21DB",
        rsaquo: "\u203A",
        Rscr: "\u211B",
        rscr: "\u{1D4C7}",
        Rsh: "\u21B1",
        rsh: "\u21B1",
        rsqb: "]",
        rsquo: "\u2019",
        rsquor: "\u2019",
        rthree: "\u22CC",
        rtimes: "\u22CA",
        rtri: "\u25B9",
        rtrie: "\u22B5",
        rtrif: "\u25B8",
        rtriltri: "\u29CE",
        RuleDelayed: "\u29F4",
        ruluhar: "\u2968",
        rx: "\u211E",
        Sacute: "\u015A",
        sacute: "\u015B",
        sbquo: "\u201A",
        Sc: "\u2ABC",
        sc: "\u227B",
        scap: "\u2AB8",
        Scaron: "\u0160",
        scaron: "\u0161",
        sccue: "\u227D",
        scE: "\u2AB4",
        sce: "\u2AB0",
        Scedil: "\u015E",
        scedil: "\u015F",
        Scirc: "\u015C",
        scirc: "\u015D",
        scnap: "\u2ABA",
        scnE: "\u2AB6",
        scnsim: "\u22E9",
        scpolint: "\u2A13",
        scsim: "\u227F",
        Scy: "\u0421",
        scy: "\u0441",
        sdot: "\u22C5",
        sdotb: "\u22A1",
        sdote: "\u2A66",
        searhk: "\u2925",
        seArr: "\u21D8",
        searr: "\u2198",
        searrow: "\u2198",
        sect: "\xA7",
        semi: ";",
        seswar: "\u2929",
        setminus: "\u2216",
        setmn: "\u2216",
        sext: "\u2736",
        Sfr: "\u{1D516}",
        sfr: "\u{1D530}",
        sfrown: "\u2322",
        sharp: "\u266F",
        SHCHcy: "\u0429",
        shchcy: "\u0449",
        SHcy: "\u0428",
        shcy: "\u0448",
        ShortDownArrow: "\u2193",
        ShortLeftArrow: "\u2190",
        shortmid: "\u2223",
        shortparallel: "\u2225",
        ShortRightArrow: "\u2192",
        ShortUpArrow: "\u2191",
        shy: "\xAD",
        Sigma: "\u03A3",
        sigma: "\u03C3",
        sigmaf: "\u03C2",
        sigmav: "\u03C2",
        sim: "\u223C",
        simdot: "\u2A6A",
        sime: "\u2243",
        simeq: "\u2243",
        simg: "\u2A9E",
        simgE: "\u2AA0",
        siml: "\u2A9D",
        simlE: "\u2A9F",
        simne: "\u2246",
        simplus: "\u2A24",
        simrarr: "\u2972",
        slarr: "\u2190",
        SmallCircle: "\u2218",
        smallsetminus: "\u2216",
        smashp: "\u2A33",
        smeparsl: "\u29E4",
        smid: "\u2223",
        smile: "\u2323",
        smt: "\u2AAA",
        smte: "\u2AAC",
        smtes: "\u2AAC\uFE00",
        SOFTcy: "\u042C",
        softcy: "\u044C",
        sol: "/",
        solb: "\u29C4",
        solbar: "\u233F",
        Sopf: "\u{1D54A}",
        sopf: "\u{1D564}",
        spades: "\u2660",
        spadesuit: "\u2660",
        spar: "\u2225",
        sqcap: "\u2293",
        sqcaps: "\u2293\uFE00",
        sqcup: "\u2294",
        sqcups: "\u2294\uFE00",
        Sqrt: "\u221A",
        sqsub: "\u228F",
        sqsube: "\u2291",
        sqsubset: "\u228F",
        sqsubseteq: "\u2291",
        sqsup: "\u2290",
        sqsupe: "\u2292",
        sqsupset: "\u2290",
        sqsupseteq: "\u2292",
        squ: "\u25A1",
        Square: "\u25A1",
        square: "\u25A1",
        SquareIntersection: "\u2293",
        SquareSubset: "\u228F",
        SquareSubsetEqual: "\u2291",
        SquareSuperset: "\u2290",
        SquareSupersetEqual: "\u2292",
        SquareUnion: "\u2294",
        squarf: "\u25AA",
        squf: "\u25AA",
        srarr: "\u2192",
        Sscr: "\u{1D4AE}",
        sscr: "\u{1D4C8}",
        ssetmn: "\u2216",
        ssmile: "\u2323",
        sstarf: "\u22C6",
        Star: "\u22C6",
        star: "\u2606",
        starf: "\u2605",
        straightepsilon: "\u03F5",
        straightphi: "\u03D5",
        strns: "\xAF",
        Sub: "\u22D0",
        sub: "\u2282",
        subdot: "\u2ABD",
        subE: "\u2AC5",
        sube: "\u2286",
        subedot: "\u2AC3",
        submult: "\u2AC1",
        subnE: "\u2ACB",
        subne: "\u228A",
        subplus: "\u2ABF",
        subrarr: "\u2979",
        Subset: "\u22D0",
        subset: "\u2282",
        subseteq: "\u2286",
        subseteqq: "\u2AC5",
        SubsetEqual: "\u2286",
        subsetneq: "\u228A",
        subsetneqq: "\u2ACB",
        subsim: "\u2AC7",
        subsub: "\u2AD5",
        subsup: "\u2AD3",
        succ: "\u227B",
        succapprox: "\u2AB8",
        succcurlyeq: "\u227D",
        Succeeds: "\u227B",
        SucceedsEqual: "\u2AB0",
        SucceedsSlantEqual: "\u227D",
        SucceedsTilde: "\u227F",
        succeq: "\u2AB0",
        succnapprox: "\u2ABA",
        succneqq: "\u2AB6",
        succnsim: "\u22E9",
        succsim: "\u227F",
        SuchThat: "\u220B",
        Sum: "\u2211",
        sum: "\u2211",
        sung: "\u266A",
        Sup: "\u22D1",
        sup: "\u2283",
        sup1: "\xB9",
        sup2: "\xB2",
        sup3: "\xB3",
        supdot: "\u2ABE",
        supdsub: "\u2AD8",
        supE: "\u2AC6",
        supe: "\u2287",
        supedot: "\u2AC4",
        Superset: "\u2283",
        SupersetEqual: "\u2287",
        suphsol: "\u27C9",
        suphsub: "\u2AD7",
        suplarr: "\u297B",
        supmult: "\u2AC2",
        supnE: "\u2ACC",
        supne: "\u228B",
        supplus: "\u2AC0",
        Supset: "\u22D1",
        supset: "\u2283",
        supseteq: "\u2287",
        supseteqq: "\u2AC6",
        supsetneq: "\u228B",
        supsetneqq: "\u2ACC",
        supsim: "\u2AC8",
        supsub: "\u2AD4",
        supsup: "\u2AD6",
        swarhk: "\u2926",
        swArr: "\u21D9",
        swarr: "\u2199",
        swarrow: "\u2199",
        swnwar: "\u292A",
        szlig: "\xDF",
        Tab: "	",
        target: "\u2316",
        Tau: "\u03A4",
        tau: "\u03C4",
        tbrk: "\u23B4",
        Tcaron: "\u0164",
        tcaron: "\u0165",
        Tcedil: "\u0162",
        tcedil: "\u0163",
        Tcy: "\u0422",
        tcy: "\u0442",
        tdot: "\u20DB",
        telrec: "\u2315",
        Tfr: "\u{1D517}",
        tfr: "\u{1D531}",
        there4: "\u2234",
        Therefore: "\u2234",
        therefore: "\u2234",
        Theta: "\u0398",
        theta: "\u03B8",
        thetasym: "\u03D1",
        thetav: "\u03D1",
        thickapprox: "\u2248",
        thicksim: "\u223C",
        ThickSpace: "\u205F\u200A",
        thinsp: "\u2009",
        ThinSpace: "\u2009",
        thkap: "\u2248",
        thksim: "\u223C",
        THORN: "\xDE",
        thorn: "\xFE",
        Tilde: "\u223C",
        tilde: "\u02DC",
        TildeEqual: "\u2243",
        TildeFullEqual: "\u2245",
        TildeTilde: "\u2248",
        times: "\xD7",
        timesb: "\u22A0",
        timesbar: "\u2A31",
        timesd: "\u2A30",
        tint: "\u222D",
        toea: "\u2928",
        top: "\u22A4",
        topbot: "\u2336",
        topcir: "\u2AF1",
        Topf: "\u{1D54B}",
        topf: "\u{1D565}",
        topfork: "\u2ADA",
        tosa: "\u2929",
        tprime: "\u2034",
        TRADE: "\u2122",
        trade: "\u2122",
        triangle: "\u25B5",
        triangledown: "\u25BF",
        triangleleft: "\u25C3",
        trianglelefteq: "\u22B4",
        triangleq: "\u225C",
        triangleright: "\u25B9",
        trianglerighteq: "\u22B5",
        tridot: "\u25EC",
        trie: "\u225C",
        triminus: "\u2A3A",
        TripleDot: "\u20DB",
        triplus: "\u2A39",
        trisb: "\u29CD",
        tritime: "\u2A3B",
        trpezium: "\u23E2",
        Tscr: "\u{1D4AF}",
        tscr: "\u{1D4C9}",
        TScy: "\u0426",
        tscy: "\u0446",
        TSHcy: "\u040B",
        tshcy: "\u045B",
        Tstrok: "\u0166",
        tstrok: "\u0167",
        twixt: "\u226C",
        twoheadleftarrow: "\u219E",
        twoheadrightarrow: "\u21A0",
        Uacute: "\xDA",
        uacute: "\xFA",
        Uarr: "\u219F",
        uArr: "\u21D1",
        uarr: "\u2191",
        Uarrocir: "\u2949",
        Ubrcy: "\u040E",
        ubrcy: "\u045E",
        Ubreve: "\u016C",
        ubreve: "\u016D",
        Ucirc: "\xDB",
        ucirc: "\xFB",
        Ucy: "\u0423",
        ucy: "\u0443",
        udarr: "\u21C5",
        Udblac: "\u0170",
        udblac: "\u0171",
        udhar: "\u296E",
        ufisht: "\u297E",
        Ufr: "\u{1D518}",
        ufr: "\u{1D532}",
        Ugrave: "\xD9",
        ugrave: "\xF9",
        uHar: "\u2963",
        uharl: "\u21BF",
        uharr: "\u21BE",
        uhblk: "\u2580",
        ulcorn: "\u231C",
        ulcorner: "\u231C",
        ulcrop: "\u230F",
        ultri: "\u25F8",
        Umacr: "\u016A",
        umacr: "\u016B",
        uml: "\xA8",
        UnderBar: "_",
        UnderBrace: "\u23DF",
        UnderBracket: "\u23B5",
        UnderParenthesis: "\u23DD",
        Union: "\u22C3",
        UnionPlus: "\u228E",
        Uogon: "\u0172",
        uogon: "\u0173",
        Uopf: "\u{1D54C}",
        uopf: "\u{1D566}",
        UpArrow: "\u2191",
        Uparrow: "\u21D1",
        uparrow: "\u2191",
        UpArrowBar: "\u2912",
        UpArrowDownArrow: "\u21C5",
        UpDownArrow: "\u2195",
        Updownarrow: "\u21D5",
        updownarrow: "\u2195",
        UpEquilibrium: "\u296E",
        upharpoonleft: "\u21BF",
        upharpoonright: "\u21BE",
        uplus: "\u228E",
        UpperLeftArrow: "\u2196",
        UpperRightArrow: "\u2197",
        Upsi: "\u03D2",
        upsi: "\u03C5",
        upsih: "\u03D2",
        Upsilon: "\u03A5",
        upsilon: "\u03C5",
        UpTee: "\u22A5",
        UpTeeArrow: "\u21A5",
        upuparrows: "\u21C8",
        urcorn: "\u231D",
        urcorner: "\u231D",
        urcrop: "\u230E",
        Uring: "\u016E",
        uring: "\u016F",
        urtri: "\u25F9",
        Uscr: "\u{1D4B0}",
        uscr: "\u{1D4CA}",
        utdot: "\u22F0",
        Utilde: "\u0168",
        utilde: "\u0169",
        utri: "\u25B5",
        utrif: "\u25B4",
        uuarr: "\u21C8",
        Uuml: "\xDC",
        uuml: "\xFC",
        uwangle: "\u29A7",
        vangrt: "\u299C",
        varepsilon: "\u03F5",
        varkappa: "\u03F0",
        varnothing: "\u2205",
        varphi: "\u03D5",
        varpi: "\u03D6",
        varpropto: "\u221D",
        vArr: "\u21D5",
        varr: "\u2195",
        varrho: "\u03F1",
        varsigma: "\u03C2",
        varsubsetneq: "\u228A\uFE00",
        varsubsetneqq: "\u2ACB\uFE00",
        varsupsetneq: "\u228B\uFE00",
        varsupsetneqq: "\u2ACC\uFE00",
        vartheta: "\u03D1",
        vartriangleleft: "\u22B2",
        vartriangleright: "\u22B3",
        Vbar: "\u2AEB",
        vBar: "\u2AE8",
        vBarv: "\u2AE9",
        Vcy: "\u0412",
        vcy: "\u0432",
        VDash: "\u22AB",
        Vdash: "\u22A9",
        vDash: "\u22A8",
        vdash: "\u22A2",
        Vdashl: "\u2AE6",
        Vee: "\u22C1",
        vee: "\u2228",
        veebar: "\u22BB",
        veeeq: "\u225A",
        vellip: "\u22EE",
        Verbar: "\u2016",
        verbar: "|",
        Vert: "\u2016",
        vert: "|",
        VerticalBar: "\u2223",
        VerticalLine: "|",
        VerticalSeparator: "\u2758",
        VerticalTilde: "\u2240",
        VeryThinSpace: "\u200A",
        Vfr: "\u{1D519}",
        vfr: "\u{1D533}",
        vltri: "\u22B2",
        vnsub: "\u2282\u20D2",
        vnsup: "\u2283\u20D2",
        Vopf: "\u{1D54D}",
        vopf: "\u{1D567}",
        vprop: "\u221D",
        vrtri: "\u22B3",
        Vscr: "\u{1D4B1}",
        vscr: "\u{1D4CB}",
        vsubnE: "\u2ACB\uFE00",
        vsubne: "\u228A\uFE00",
        vsupnE: "\u2ACC\uFE00",
        vsupne: "\u228B\uFE00",
        Vvdash: "\u22AA",
        vzigzag: "\u299A",
        Wcirc: "\u0174",
        wcirc: "\u0175",
        wedbar: "\u2A5F",
        Wedge: "\u22C0",
        wedge: "\u2227",
        wedgeq: "\u2259",
        weierp: "\u2118",
        Wfr: "\u{1D51A}",
        wfr: "\u{1D534}",
        Wopf: "\u{1D54E}",
        wopf: "\u{1D568}",
        wp: "\u2118",
        wr: "\u2240",
        wreath: "\u2240",
        Wscr: "\u{1D4B2}",
        wscr: "\u{1D4CC}",
        xcap: "\u22C2",
        xcirc: "\u25EF",
        xcup: "\u22C3",
        xdtri: "\u25BD",
        Xfr: "\u{1D51B}",
        xfr: "\u{1D535}",
        xhArr: "\u27FA",
        xharr: "\u27F7",
        Xi: "\u039E",
        xi: "\u03BE",
        xlArr: "\u27F8",
        xlarr: "\u27F5",
        xmap: "\u27FC",
        xnis: "\u22FB",
        xodot: "\u2A00",
        Xopf: "\u{1D54F}",
        xopf: "\u{1D569}",
        xoplus: "\u2A01",
        xotime: "\u2A02",
        xrArr: "\u27F9",
        xrarr: "\u27F6",
        Xscr: "\u{1D4B3}",
        xscr: "\u{1D4CD}",
        xsqcup: "\u2A06",
        xuplus: "\u2A04",
        xutri: "\u25B3",
        xvee: "\u22C1",
        xwedge: "\u22C0",
        Yacute: "\xDD",
        yacute: "\xFD",
        YAcy: "\u042F",
        yacy: "\u044F",
        Ycirc: "\u0176",
        ycirc: "\u0177",
        Ycy: "\u042B",
        ycy: "\u044B",
        yen: "\xA5",
        Yfr: "\u{1D51C}",
        yfr: "\u{1D536}",
        YIcy: "\u0407",
        yicy: "\u0457",
        Yopf: "\u{1D550}",
        yopf: "\u{1D56A}",
        Yscr: "\u{1D4B4}",
        yscr: "\u{1D4CE}",
        YUcy: "\u042E",
        yucy: "\u044E",
        Yuml: "\u0178",
        yuml: "\xFF",
        Zacute: "\u0179",
        zacute: "\u017A",
        Zcaron: "\u017D",
        zcaron: "\u017E",
        Zcy: "\u0417",
        zcy: "\u0437",
        Zdot: "\u017B",
        zdot: "\u017C",
        zeetrf: "\u2128",
        ZeroWidthSpace: "\u200B",
        Zeta: "\u0396",
        zeta: "\u03B6",
        Zfr: "\u2128",
        zfr: "\u{1D537}",
        ZHcy: "\u0416",
        zhcy: "\u0436",
        zigrarr: "\u21DD",
        Zopf: "\u2124",
        zopf: "\u{1D56B}",
        Zscr: "\u{1D4B5}",
        zscr: "\u{1D4CF}",
        zwj: "\u200D",
        zwnj: "\u200C"
      });
      exports.entityMap = exports.HTML_ENTITIES;
    }
  });

  // node_modules/@xmldom/xmldom/lib/sax.js
  var require_sax = __commonJS({
    "node_modules/@xmldom/xmldom/lib/sax.js"(exports) {
      var NAMESPACE = require_conventions().NAMESPACE;
      var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
      var tagNamePattern = new RegExp("^" + nameStartChar.source + nameChar.source + "*(?::" + nameStartChar.source + nameChar.source + "*)?$");
      var S_TAG = 0;
      var S_ATTR = 1;
      var S_ATTR_SPACE = 2;
      var S_EQ = 3;
      var S_ATTR_NOQUOT_VALUE = 4;
      var S_ATTR_END = 5;
      var S_TAG_SPACE = 6;
      var S_TAG_CLOSE = 7;
      function ParseError(message, locator) {
        this.message = message;
        this.locator = locator;
        if (Error.captureStackTrace)
          Error.captureStackTrace(this, ParseError);
      }
      ParseError.prototype = new Error();
      ParseError.prototype.name = ParseError.name;
      function XMLReader() {
      }
      XMLReader.prototype = {
        parse: function(source, defaultNSMap, entityMap) {
          var domBuilder = this.domBuilder;
          domBuilder.startDocument();
          _copy(defaultNSMap, defaultNSMap = {});
          parse(
            source,
            defaultNSMap,
            entityMap,
            domBuilder,
            this.errorHandler
          );
          domBuilder.endDocument();
        }
      };
      function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
        function fixedFromCharCode(code) {
          if (code > 65535) {
            code -= 65536;
            var surrogate1 = 55296 + (code >> 10), surrogate2 = 56320 + (code & 1023);
            return String.fromCharCode(surrogate1, surrogate2);
          } else {
            return String.fromCharCode(code);
          }
        }
        function entityReplacer(a2) {
          var k = a2.slice(1, -1);
          if (Object.hasOwnProperty.call(entityMap, k)) {
            return entityMap[k];
          } else if (k.charAt(0) === "#") {
            return fixedFromCharCode(parseInt(k.substr(1).replace("x", "0x")));
          } else {
            errorHandler.error("entity not found:" + a2);
            return a2;
          }
        }
        function appendText(end2) {
          if (end2 > start) {
            var xt = source.substring(start, end2).replace(/&#?\w+;/g, entityReplacer);
            locator && position(start);
            domBuilder.characters(xt, 0, end2 - start);
            start = end2;
          }
        }
        function position(p, m) {
          while (p >= lineEnd && (m = linePattern.exec(source))) {
            lineStart = m.index;
            lineEnd = lineStart + m[0].length;
            locator.lineNumber++;
          }
          locator.columnNumber = p - lineStart + 1;
        }
        var lineStart = 0;
        var lineEnd = 0;
        var linePattern = /.*(?:\r\n?|\n)|.*$/g;
        var locator = domBuilder.locator;
        var parseStack = [{ currentNSMap: defaultNSMapCopy }];
        var closeMap = {};
        var start = 0;
        while (true) {
          try {
            var tagStart = source.indexOf("<", start);
            if (tagStart < 0) {
              if (!source.substr(start).match(/^\s*$/)) {
                var doc = domBuilder.doc;
                var text = doc.createTextNode(source.substr(start));
                doc.appendChild(text);
                domBuilder.currentElement = text;
              }
              return;
            }
            if (tagStart > start) {
              appendText(tagStart);
            }
            switch (source.charAt(tagStart + 1)) {
              case "/":
                var end = source.indexOf(">", tagStart + 3);
                var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, "");
                var config = parseStack.pop();
                if (end < 0) {
                  tagName = source.substring(tagStart + 2).replace(/[\s<].*/, "");
                  errorHandler.error("end tag name: " + tagName + " is not complete:" + config.tagName);
                  end = tagStart + 1 + tagName.length;
                } else if (tagName.match(/\s</)) {
                  tagName = tagName.replace(/[\s<].*/, "");
                  errorHandler.error("end tag name: " + tagName + " maybe not complete");
                  end = tagStart + 1 + tagName.length;
                }
                var localNSMap = config.localNSMap;
                var endMatch = config.tagName == tagName;
                var endIgnoreCaseMach = endMatch || config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase();
                if (endIgnoreCaseMach) {
                  domBuilder.endElement(config.uri, config.localName, tagName);
                  if (localNSMap) {
                    for (var prefix in localNSMap) {
                      if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
                        domBuilder.endPrefixMapping(prefix);
                      }
                    }
                  }
                  if (!endMatch) {
                    errorHandler.fatalError("end tag name: " + tagName + " is not match the current start tagName:" + config.tagName);
                  }
                } else {
                  parseStack.push(config);
                }
                end++;
                break;
              case "?":
                locator && position(tagStart);
                end = parseInstruction(source, tagStart, domBuilder);
                break;
              case "!":
                locator && position(tagStart);
                end = parseDCC(source, tagStart, domBuilder, errorHandler);
                break;
              default:
                locator && position(tagStart);
                var el = new ElementAttributes();
                var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
                var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler);
                var len = el.length;
                if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
                  el.closed = true;
                  if (!entityMap.nbsp) {
                    errorHandler.warning("unclosed xml attribute");
                  }
                }
                if (locator && len) {
                  var locator2 = copyLocator(locator, {});
                  for (var i = 0; i < len; i++) {
                    var a = el[i];
                    position(a.offset);
                    a.locator = copyLocator(locator, {});
                  }
                  domBuilder.locator = locator2;
                  if (appendElement(el, domBuilder, currentNSMap)) {
                    parseStack.push(el);
                  }
                  domBuilder.locator = locator;
                } else {
                  if (appendElement(el, domBuilder, currentNSMap)) {
                    parseStack.push(el);
                  }
                }
                if (NAMESPACE.isHTML(el.uri) && !el.closed) {
                  end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
                } else {
                  end++;
                }
            }
          } catch (e) {
            if (e instanceof ParseError) {
              throw e;
            }
            errorHandler.error("element parse error: " + e);
            end = -1;
          }
          if (end > start) {
            start = end;
          } else {
            appendText(Math.max(tagStart, start) + 1);
          }
        }
      }
      function copyLocator(f, t) {
        t.lineNumber = f.lineNumber;
        t.columnNumber = f.columnNumber;
        return t;
      }
      function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
        function addAttribute(qname, value2, startIndex) {
          if (el.attributeNames.hasOwnProperty(qname)) {
            errorHandler.fatalError("Attribute " + qname + " redefined");
          }
          el.addValue(
            qname,
            // @see https://www.w3.org/TR/xml/#AVNormalize
            // since the xmldom sax parser does not "interpret" DTD the following is not implemented:
            // - recursive replacement of (DTD) entity references
            // - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
            value2.replace(/[\t\n\r]/g, " ").replace(/&#?\w+;/g, entityReplacer),
            startIndex
          );
        }
        var attrName;
        var value;
        var p = ++start;
        var s = S_TAG;
        while (true) {
          var c = source.charAt(p);
          switch (c) {
            case "=":
              if (s === S_ATTR) {
                attrName = source.slice(start, p);
                s = S_EQ;
              } else if (s === S_ATTR_SPACE) {
                s = S_EQ;
              } else {
                throw new Error("attribute equal must after attrName");
              }
              break;
            case "'":
            case '"':
              if (s === S_EQ || s === S_ATTR) {
                if (s === S_ATTR) {
                  errorHandler.warning('attribute value must after "="');
                  attrName = source.slice(start, p);
                }
                start = p + 1;
                p = source.indexOf(c, start);
                if (p > 0) {
                  value = source.slice(start, p);
                  addAttribute(attrName, value, start - 1);
                  s = S_ATTR_END;
                } else {
                  throw new Error("attribute value no end '" + c + "' match");
                }
              } else if (s == S_ATTR_NOQUOT_VALUE) {
                value = source.slice(start, p);
                addAttribute(attrName, value, start);
                errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ")!!");
                start = p + 1;
                s = S_ATTR_END;
              } else {
                throw new Error('attribute value must after "="');
              }
              break;
            case "/":
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                case S_ATTR_END:
                case S_TAG_SPACE:
                case S_TAG_CLOSE:
                  s = S_TAG_CLOSE;
                  el.closed = true;
                case S_ATTR_NOQUOT_VALUE:
                case S_ATTR:
                  break;
                case S_ATTR_SPACE:
                  el.closed = true;
                  break;
                default:
                  throw new Error("attribute invalid close char('/')");
              }
              break;
            case "":
              errorHandler.error("unexpected end of input");
              if (s == S_TAG) {
                el.setTagName(source.slice(start, p));
              }
              return p;
            case ">":
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                case S_ATTR_END:
                case S_TAG_SPACE:
                case S_TAG_CLOSE:
                  break;
                case S_ATTR_NOQUOT_VALUE:
                case S_ATTR:
                  value = source.slice(start, p);
                  if (value.slice(-1) === "/") {
                    el.closed = true;
                    value = value.slice(0, -1);
                  }
                case S_ATTR_SPACE:
                  if (s === S_ATTR_SPACE) {
                    value = attrName;
                  }
                  if (s == S_ATTR_NOQUOT_VALUE) {
                    errorHandler.warning('attribute "' + value + '" missed quot(")!');
                    addAttribute(attrName, value, start);
                  } else {
                    if (!NAMESPACE.isHTML(currentNSMap[""]) || !value.match(/^(?:disabled|checked|selected)$/i)) {
                      errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
                    }
                    addAttribute(value, value, start);
                  }
                  break;
                case S_EQ:
                  throw new Error("attribute value missed!!");
              }
              return p;
            case "\x80":
              c = " ";
            default:
              if (c <= " ") {
                switch (s) {
                  case S_TAG:
                    el.setTagName(source.slice(start, p));
                    s = S_TAG_SPACE;
                    break;
                  case S_ATTR:
                    attrName = source.slice(start, p);
                    s = S_ATTR_SPACE;
                    break;
                  case S_ATTR_NOQUOT_VALUE:
                    var value = source.slice(start, p);
                    errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                    addAttribute(attrName, value, start);
                  case S_ATTR_END:
                    s = S_TAG_SPACE;
                    break;
                }
              } else {
                switch (s) {
                  case S_ATTR_SPACE:
                    var tagName = el.tagName;
                    if (!NAMESPACE.isHTML(currentNSMap[""]) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
                      errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
                    }
                    addAttribute(attrName, attrName, start);
                    start = p;
                    s = S_ATTR;
                    break;
                  case S_ATTR_END:
                    errorHandler.warning('attribute space is required"' + attrName + '"!!');
                  case S_TAG_SPACE:
                    s = S_ATTR;
                    start = p;
                    break;
                  case S_EQ:
                    s = S_ATTR_NOQUOT_VALUE;
                    start = p;
                    break;
                  case S_TAG_CLOSE:
                    throw new Error("elements closed character '/' and '>' must be connected to");
                }
              }
          }
          p++;
        }
      }
      function appendElement(el, domBuilder, currentNSMap) {
        var tagName = el.tagName;
        var localNSMap = null;
        var i = el.length;
        while (i--) {
          var a = el[i];
          var qName = a.qName;
          var value = a.value;
          var nsp = qName.indexOf(":");
          if (nsp > 0) {
            var prefix = a.prefix = qName.slice(0, nsp);
            var localName = qName.slice(nsp + 1);
            var nsPrefix = prefix === "xmlns" && localName;
          } else {
            localName = qName;
            prefix = null;
            nsPrefix = qName === "xmlns" && "";
          }
          a.localName = localName;
          if (nsPrefix !== false) {
            if (localNSMap == null) {
              localNSMap = {};
              _copy(currentNSMap, currentNSMap = {});
            }
            currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
            a.uri = NAMESPACE.XMLNS;
            domBuilder.startPrefixMapping(nsPrefix, value);
          }
        }
        var i = el.length;
        while (i--) {
          a = el[i];
          var prefix = a.prefix;
          if (prefix) {
            if (prefix === "xml") {
              a.uri = NAMESPACE.XML;
            }
            if (prefix !== "xmlns") {
              a.uri = currentNSMap[prefix || ""];
            }
          }
        }
        var nsp = tagName.indexOf(":");
        if (nsp > 0) {
          prefix = el.prefix = tagName.slice(0, nsp);
          localName = el.localName = tagName.slice(nsp + 1);
        } else {
          prefix = null;
          localName = el.localName = tagName;
        }
        var ns = el.uri = currentNSMap[prefix || ""];
        domBuilder.startElement(ns, localName, tagName, el);
        if (el.closed) {
          domBuilder.endElement(ns, localName, tagName);
          if (localNSMap) {
            for (prefix in localNSMap) {
              if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
                domBuilder.endPrefixMapping(prefix);
              }
            }
          }
        } else {
          el.currentNSMap = currentNSMap;
          el.localNSMap = localNSMap;
          return true;
        }
      }
      function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
        if (/^(?:script|textarea)$/i.test(tagName)) {
          var elEndStart = source.indexOf("</" + tagName + ">", elStartEnd);
          var text = source.substring(elStartEnd + 1, elEndStart);
          if (/[&<]/.test(text)) {
            if (/^script$/i.test(tagName)) {
              domBuilder.characters(text, 0, text.length);
              return elEndStart;
            }
            text = text.replace(/&#?\w+;/g, entityReplacer);
            domBuilder.characters(text, 0, text.length);
            return elEndStart;
          }
        }
        return elStartEnd + 1;
      }
      function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
        var pos = closeMap[tagName];
        if (pos == null) {
          pos = source.lastIndexOf("</" + tagName + ">");
          if (pos < elStartEnd) {
            pos = source.lastIndexOf("</" + tagName);
          }
          closeMap[tagName] = pos;
        }
        return pos < elStartEnd;
      }
      function _copy(source, target) {
        for (var n in source) {
          if (Object.prototype.hasOwnProperty.call(source, n)) {
            target[n] = source[n];
          }
        }
      }
      function parseDCC(source, start, domBuilder, errorHandler) {
        var next = source.charAt(start + 2);
        switch (next) {
          case "-":
            if (source.charAt(start + 3) === "-") {
              var end = source.indexOf("-->", start + 4);
              if (end > start) {
                domBuilder.comment(source, start + 4, end - start - 4);
                return end + 3;
              } else {
                errorHandler.error("Unclosed comment");
                return -1;
              }
            } else {
              return -1;
            }
          default:
            if (source.substr(start + 3, 6) == "CDATA[") {
              var end = source.indexOf("]]>", start + 9);
              domBuilder.startCDATA();
              domBuilder.characters(source, start + 9, end - start - 9);
              domBuilder.endCDATA();
              return end + 3;
            }
            var matchs = split(source, start);
            var len = matchs.length;
            if (len > 1 && /!doctype/i.test(matchs[0][0])) {
              var name = matchs[1][0];
              var pubid = false;
              var sysid = false;
              if (len > 3) {
                if (/^public$/i.test(matchs[2][0])) {
                  pubid = matchs[3][0];
                  sysid = len > 4 && matchs[4][0];
                } else if (/^system$/i.test(matchs[2][0])) {
                  sysid = matchs[3][0];
                }
              }
              var lastMatch = matchs[len - 1];
              domBuilder.startDTD(name, pubid, sysid);
              domBuilder.endDTD();
              return lastMatch.index + lastMatch[0].length;
            }
        }
        return -1;
      }
      function parseInstruction(source, start, domBuilder) {
        var end = source.indexOf("?>", start);
        if (end) {
          var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
          if (match) {
            var len = match[0].length;
            domBuilder.processingInstruction(match[1], match[2]);
            return end + 2;
          } else {
            return -1;
          }
        }
        return -1;
      }
      function ElementAttributes() {
        this.attributeNames = {};
      }
      ElementAttributes.prototype = {
        setTagName: function(tagName) {
          if (!tagNamePattern.test(tagName)) {
            throw new Error("invalid tagName:" + tagName);
          }
          this.tagName = tagName;
        },
        addValue: function(qName, value, offset) {
          if (!tagNamePattern.test(qName)) {
            throw new Error("invalid attribute:" + qName);
          }
          this.attributeNames[qName] = this.length;
          this[this.length++] = { qName, value, offset };
        },
        length: 0,
        getLocalName: function(i) {
          return this[i].localName;
        },
        getLocator: function(i) {
          return this[i].locator;
        },
        getQName: function(i) {
          return this[i].qName;
        },
        getURI: function(i) {
          return this[i].uri;
        },
        getValue: function(i) {
          return this[i].value;
        }
        //	,getIndex:function(uri, localName)){
        //		if(localName){
        //
        //		}else{
        //			var qName = uri
        //		}
        //	},
        //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
        //	getType:function(uri,localName){}
        //	getType:function(i){},
      };
      function split(source, start) {
        var match;
        var buf = [];
        var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
        reg.lastIndex = start;
        reg.exec(source);
        while (match = reg.exec(source)) {
          buf.push(match);
          if (match[1])
            return buf;
        }
      }
      exports.XMLReader = XMLReader;
      exports.ParseError = ParseError;
    }
  });

  // node_modules/@xmldom/xmldom/lib/dom-parser.js
  var require_dom_parser = __commonJS({
    "node_modules/@xmldom/xmldom/lib/dom-parser.js"(exports) {
      var conventions = require_conventions();
      var dom = require_dom();
      var entities = require_entities();
      var sax = require_sax();
      var DOMImplementation = dom.DOMImplementation;
      var NAMESPACE = conventions.NAMESPACE;
      var ParseError = sax.ParseError;
      var XMLReader = sax.XMLReader;
      function normalizeLineEndings(input) {
        return input.replace(/\r[\n\u0085]/g, "\n").replace(/[\r\u0085\u2028]/g, "\n");
      }
      function DOMParser(options) {
        this.options = options || { locator: {} };
      }
      DOMParser.prototype.parseFromString = function(source, mimeType) {
        var options = this.options;
        var sax2 = new XMLReader();
        var domBuilder = options.domBuilder || new DOMHandler();
        var errorHandler = options.errorHandler;
        var locator = options.locator;
        var defaultNSMap = options.xmlns || {};
        var isHTML = /\/x?html?$/.test(mimeType);
        var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
        if (locator) {
          domBuilder.setDocumentLocator(locator);
        }
        sax2.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator);
        sax2.domBuilder = options.domBuilder || domBuilder;
        if (isHTML) {
          defaultNSMap[""] = NAMESPACE.HTML;
        }
        defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
        var normalize = options.normalizeLineEndings || normalizeLineEndings;
        if (source && typeof source === "string") {
          sax2.parse(
            normalize(source),
            defaultNSMap,
            entityMap
          );
        } else {
          sax2.errorHandler.error("invalid doc source");
        }
        return domBuilder.doc;
      };
      function buildErrorHandler(errorImpl, domBuilder, locator) {
        if (!errorImpl) {
          if (domBuilder instanceof DOMHandler) {
            return domBuilder;
          }
          errorImpl = domBuilder;
        }
        var errorHandler = {};
        var isCallback = errorImpl instanceof Function;
        locator = locator || {};
        function build(key) {
          var fn = errorImpl[key];
          if (!fn && isCallback) {
            fn = errorImpl.length == 2 ? function(msg) {
              errorImpl(key, msg);
            } : errorImpl;
          }
          errorHandler[key] = fn && function(msg) {
            fn("[xmldom " + key + "]	" + msg + _locator(locator));
          } || function() {
          };
        }
        build("warning");
        build("error");
        build("fatalError");
        return errorHandler;
      }
      function DOMHandler() {
        this.cdata = false;
      }
      function position(locator, node) {
        node.lineNumber = locator.lineNumber;
        node.columnNumber = locator.columnNumber;
      }
      DOMHandler.prototype = {
        startDocument: function() {
          this.doc = new DOMImplementation().createDocument(null, null, null);
          if (this.locator) {
            this.doc.documentURI = this.locator.systemId;
          }
        },
        startElement: function(namespaceURI, localName, qName, attrs) {
          var doc = this.doc;
          var el = doc.createElementNS(namespaceURI, qName || localName);
          var len = attrs.length;
          appendElement(this, el);
          this.currentElement = el;
          this.locator && position(this.locator, el);
          for (var i = 0; i < len; i++) {
            var namespaceURI = attrs.getURI(i);
            var value = attrs.getValue(i);
            var qName = attrs.getQName(i);
            var attr = doc.createAttributeNS(namespaceURI, qName);
            this.locator && position(attrs.getLocator(i), attr);
            attr.value = attr.nodeValue = value;
            el.setAttributeNode(attr);
          }
        },
        endElement: function(namespaceURI, localName, qName) {
          var current = this.currentElement;
          var tagName = current.tagName;
          this.currentElement = current.parentNode;
        },
        startPrefixMapping: function(prefix, uri) {
        },
        endPrefixMapping: function(prefix) {
        },
        processingInstruction: function(target, data) {
          var ins = this.doc.createProcessingInstruction(target, data);
          this.locator && position(this.locator, ins);
          appendElement(this, ins);
        },
        ignorableWhitespace: function(ch, start, length) {
        },
        characters: function(chars, start, length) {
          chars = _toString.apply(this, arguments);
          if (chars) {
            if (this.cdata) {
              var charNode = this.doc.createCDATASection(chars);
            } else {
              var charNode = this.doc.createTextNode(chars);
            }
            if (this.currentElement) {
              this.currentElement.appendChild(charNode);
            } else if (/^\s*$/.test(chars)) {
              this.doc.appendChild(charNode);
            }
            this.locator && position(this.locator, charNode);
          }
        },
        skippedEntity: function(name) {
        },
        endDocument: function() {
          this.doc.normalize();
        },
        setDocumentLocator: function(locator) {
          if (this.locator = locator) {
            locator.lineNumber = 0;
          }
        },
        //LexicalHandler
        comment: function(chars, start, length) {
          chars = _toString.apply(this, arguments);
          var comm = this.doc.createComment(chars);
          this.locator && position(this.locator, comm);
          appendElement(this, comm);
        },
        startCDATA: function() {
          this.cdata = true;
        },
        endCDATA: function() {
          this.cdata = false;
        },
        startDTD: function(name, publicId, systemId) {
          var impl = this.doc.implementation;
          if (impl && impl.createDocumentType) {
            var dt = impl.createDocumentType(name, publicId, systemId);
            this.locator && position(this.locator, dt);
            appendElement(this, dt);
            this.doc.doctype = dt;
          }
        },
        /**
         * @see org.xml.sax.ErrorHandler
         * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
         */
        warning: function(error) {
          console.warn("[xmldom warning]	" + error, _locator(this.locator));
        },
        error: function(error) {
          console.error("[xmldom error]	" + error, _locator(this.locator));
        },
        fatalError: function(error) {
          throw new ParseError(error, this.locator);
        }
      };
      function _locator(l) {
        if (l) {
          return "\n@" + (l.systemId || "") + "#[line:" + l.lineNumber + ",col:" + l.columnNumber + "]";
        }
      }
      function _toString(chars, start, length) {
        if (typeof chars == "string") {
          return chars.substr(start, length);
        } else {
          if (chars.length >= start + length || start) {
            return new java.lang.String(chars, start, length) + "";
          }
          return chars;
        }
      }
      "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function(key) {
        DOMHandler.prototype[key] = function() {
          return null;
        };
      });
      function appendElement(hander, node) {
        if (!hander.currentElement) {
          hander.doc.appendChild(node);
        } else {
          hander.currentElement.appendChild(node);
        }
      }
      exports.__DOMHandler = DOMHandler;
      exports.normalizeLineEndings = normalizeLineEndings;
      exports.DOMParser = DOMParser;
    }
  });

  // node_modules/@xmldom/xmldom/lib/index.js
  var require_lib = __commonJS({
    "node_modules/@xmldom/xmldom/lib/index.js"(exports) {
      var dom = require_dom();
      exports.DOMImplementation = dom.DOMImplementation;
      exports.XMLSerializer = dom.XMLSerializer;
      exports.DOMParser = require_dom_parser().DOMParser;
    }
  });

  // node_modules/docxtemplater/js/utils.js
  var require_utils3 = __commonJS({
    "node_modules/docxtemplater/js/utils.js"(exports, module) {
      "use strict";
      function last(a) {
        return a[a.length - 1];
      }
      function first(a) {
        return a[0];
      }
      module.exports = {
        last,
        first
      };
    }
  });

  // node_modules/docxtemplater/js/errors.js
  var require_errors = __commonJS({
    "node_modules/docxtemplater/js/errors.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t.push.apply(t, o);
        }
        return t;
      }
      function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
            _defineProperty(e, r2, t[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
          });
        }
        return e;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var _require = require_utils3();
      var last = _require.last;
      var first = _require.first;
      function XTError(message) {
        this.name = "GenericError";
        this.message = message;
        this.stack = new Error(message).stack;
      }
      XTError.prototype = Error.prototype;
      function XTTemplateError(message) {
        this.name = "TemplateError";
        this.message = message;
        this.stack = new Error(message).stack;
      }
      XTTemplateError.prototype = new XTError();
      function XTRenderingError(message) {
        this.name = "RenderingError";
        this.message = message;
        this.stack = new Error(message).stack;
      }
      XTRenderingError.prototype = new XTError();
      function XTScopeParserError(message) {
        this.name = "ScopeParserError";
        this.message = message;
        this.stack = new Error(message).stack;
      }
      XTScopeParserError.prototype = new XTError();
      function XTInternalError(message) {
        this.name = "InternalError";
        this.properties = {
          explanation: "InternalError"
        };
        this.message = message;
        this.stack = new Error(message).stack;
      }
      XTInternalError.prototype = new XTError();
      function XTAPIVersionError(message) {
        this.name = "APIVersionError";
        this.properties = {
          explanation: "APIVersionError"
        };
        this.message = message;
        this.stack = new Error(message).stack;
      }
      XTAPIVersionError.prototype = new XTError();
      function throwApiVersionError(msg, properties) {
        var err = new XTAPIVersionError(msg);
        err.properties = _objectSpread({
          id: "api_version_error"
        }, properties);
        throw err;
      }
      function throwMultiError(errors) {
        var err = new XTTemplateError("Multi error");
        err.properties = {
          errors,
          id: "multi_error",
          explanation: "The template has multiple errors"
        };
        throw err;
      }
      function getUnopenedTagException(options) {
        var err = new XTTemplateError("Unopened tag");
        err.properties = {
          xtag: last(options.xtag.split(" ")),
          id: "unopened_tag",
          context: options.xtag,
          offset: options.offset,
          lIndex: options.lIndex,
          explanation: 'The tag beginning with "'.concat(options.xtag.substr(0, 10), '" is unopened')
        };
        return err;
      }
      function getDuplicateOpenTagException(options) {
        var err = new XTTemplateError("Duplicate open tag, expected one open tag");
        err.properties = {
          xtag: first(options.xtag.split(" ")),
          id: "duplicate_open_tag",
          context: options.xtag,
          offset: options.offset,
          lIndex: options.lIndex,
          explanation: 'The tag beginning with "'.concat(options.xtag.substr(0, 10), '" has duplicate open tags')
        };
        return err;
      }
      function getDuplicateCloseTagException(options) {
        var err = new XTTemplateError("Duplicate close tag, expected one close tag");
        err.properties = {
          xtag: first(options.xtag.split(" ")),
          id: "duplicate_close_tag",
          context: options.xtag,
          offset: options.offset,
          lIndex: options.lIndex,
          explanation: 'The tag ending with "'.concat(options.xtag.substr(0, 10), '" has duplicate close tags')
        };
        return err;
      }
      function getUnclosedTagException(options) {
        var err = new XTTemplateError("Unclosed tag");
        err.properties = {
          xtag: first(options.xtag.split(" ")).substr(1),
          id: "unclosed_tag",
          context: options.xtag,
          offset: options.offset,
          lIndex: options.lIndex,
          explanation: 'The tag beginning with "'.concat(options.xtag.substr(0, 10), '" is unclosed')
        };
        return err;
      }
      function throwXmlTagNotFound(options) {
        var err = new XTTemplateError('No tag "'.concat(options.element, '" was found at the ').concat(options.position));
        var part = options.parsed[options.index];
        err.properties = {
          id: "no_xml_tag_found_at_".concat(options.position),
          explanation: 'No tag "'.concat(options.element, '" was found at the ').concat(options.position),
          offset: part.offset,
          part,
          parsed: options.parsed,
          index: options.index,
          element: options.element
        };
        throw err;
      }
      function getCorruptCharactersException(_ref) {
        var tag = _ref.tag, value = _ref.value, offset = _ref.offset;
        var err = new XTRenderingError("There are some XML corrupt characters");
        err.properties = {
          id: "invalid_xml_characters",
          xtag: tag,
          value,
          offset,
          explanation: "There are some corrupt characters for the field ".concat(tag)
        };
        return err;
      }
      function getInvalidRawXMLValueException(_ref2) {
        var tag = _ref2.tag, value = _ref2.value, offset = _ref2.offset;
        var err = new XTRenderingError("Non string values are not allowed for rawXML tags");
        err.properties = {
          id: "invalid_raw_xml_value",
          xtag: tag,
          value,
          offset,
          explanation: "The value of the raw tag : '".concat(tag, "' is not a string")
        };
        return err;
      }
      function throwExpandNotFound(options) {
        var _options$part = options.part, value = _options$part.value, offset = _options$part.offset, _options$id = options.id, id = _options$id === void 0 ? "raw_tag_outerxml_invalid" : _options$id, _options$message = options.message, message = _options$message === void 0 ? "Raw tag not in paragraph" : _options$message;
        var part = options.part;
        var _options$explanation = options.explanation, explanation = _options$explanation === void 0 ? 'The tag "'.concat(value, '" is not inside a paragraph') : _options$explanation;
        if (typeof explanation === "function") {
          explanation = explanation(part);
        }
        var err = new XTTemplateError(message);
        err.properties = {
          id,
          explanation,
          rootError: options.rootError,
          xtag: value,
          offset,
          postparsed: options.postparsed,
          expandTo: options.expandTo,
          index: options.index
        };
        throw err;
      }
      function throwRawTagShouldBeOnlyTextInParagraph(options) {
        var err = new XTTemplateError("Raw tag should be the only text in paragraph");
        var tag = options.part.value;
        err.properties = {
          id: "raw_xml_tag_should_be_only_text_in_paragraph",
          explanation: 'The raw tag "'.concat(tag, '" should be the only text in this paragraph. This means that this tag should not be surrounded by any text or spaces.'),
          xtag: tag,
          offset: options.part.offset,
          paragraphParts: options.paragraphParts
        };
        throw err;
      }
      function getUnmatchedLoopException(part) {
        var location = part.location, offset = part.offset, square = part.square;
        var t = location === "start" ? "unclosed" : "unopened";
        var T = location === "start" ? "Unclosed" : "Unopened";
        var err = new XTTemplateError("".concat(T, " loop"));
        var tag = part.value;
        err.properties = {
          id: "".concat(t, "_loop"),
          explanation: 'The loop with tag "'.concat(tag, '" is ').concat(t),
          xtag: tag,
          offset
        };
        if (square) {
          err.properties.square = square;
        }
        return err;
      }
      function getUnbalancedLoopException(pair, lastPair) {
        var err = new XTTemplateError("Unbalanced loop tag");
        var lastL = lastPair[0].part.value;
        var lastR = lastPair[1].part.value;
        var l = pair[0].part.value;
        var r = pair[1].part.value;
        err.properties = {
          id: "unbalanced_loop_tags",
          explanation: "Unbalanced loop tags {#".concat(lastL, "}{/").concat(lastR, "}{#").concat(l, "}{/").concat(r, "}"),
          offset: [lastPair[0].part.offset, pair[1].part.offset],
          lastPair: {
            left: lastPair[0].part.value,
            right: lastPair[1].part.value
          },
          pair: {
            left: pair[0].part.value,
            right: pair[1].part.value
          }
        };
        return err;
      }
      function getClosingTagNotMatchOpeningTag(_ref3) {
        var tags = _ref3.tags;
        var err = new XTTemplateError("Closing tag does not match opening tag");
        err.properties = {
          id: "closing_tag_does_not_match_opening_tag",
          explanation: 'The tag "'.concat(tags[0].value, '" is closed by the tag "').concat(tags[1].value, '"'),
          openingtag: first(tags).value,
          offset: [first(tags).offset, last(tags).offset],
          closingtag: last(tags).value
        };
        return err;
      }
      function getScopeCompilationError(_ref4) {
        var tag = _ref4.tag, rootError = _ref4.rootError, offset = _ref4.offset;
        var err = new XTScopeParserError("Scope parser compilation failed");
        err.properties = {
          id: "scopeparser_compilation_failed",
          offset,
          xtag: tag,
          explanation: 'The scope parser for the tag "'.concat(tag, '" failed to compile'),
          rootError
        };
        return err;
      }
      function getScopeParserExecutionError(_ref5) {
        var tag = _ref5.tag, scope = _ref5.scope, error = _ref5.error, offset = _ref5.offset;
        var err = new XTScopeParserError("Scope parser execution failed");
        err.properties = {
          id: "scopeparser_execution_failed",
          explanation: "The scope parser for the tag ".concat(tag, " failed to execute"),
          scope,
          offset,
          xtag: tag,
          rootError: error
        };
        return err;
      }
      function getLoopPositionProducesInvalidXMLError(_ref6) {
        var tag = _ref6.tag, offset = _ref6.offset;
        var err = new XTTemplateError('The position of the loop tags "'.concat(tag, '" would produce invalid XML'));
        err.properties = {
          xtag: tag,
          id: "loop_position_invalid",
          explanation: 'The tags "'.concat(tag, '" are misplaced in the document, for example one of them is in a table and the other one outside the table'),
          offset
        };
        return err;
      }
      function throwUnimplementedTagType(part, index) {
        var errorMsg = 'Unimplemented tag type "'.concat(part.type, '"');
        if (part.module) {
          errorMsg += ' "'.concat(part.module, '"');
        }
        var err = new XTTemplateError(errorMsg);
        err.properties = {
          part,
          index,
          id: "unimplemented_tag_type"
        };
        throw err;
      }
      function throwMalformedXml() {
        var err = new XTInternalError("Malformed xml");
        err.properties = {
          explanation: "The template contains malformed xml",
          id: "malformed_xml"
        };
        throw err;
      }
      function throwResolveBeforeCompile() {
        var err = new XTInternalError("You must run `.compile()` before running `.resolveData()`");
        err.properties = {
          id: "resolve_before_compile",
          explanation: "You must run `.compile()` before running `.resolveData()`"
        };
        throw err;
      }
      function throwRenderInvalidTemplate() {
        var err = new XTInternalError("You should not call .render on a document that had compilation errors");
        err.properties = {
          id: "render_on_invalid_template",
          explanation: "You should not call .render on a document that had compilation errors"
        };
        throw err;
      }
      function throwRenderTwice() {
        var err = new XTInternalError("You should not call .render twice on the same docxtemplater instance");
        err.properties = {
          id: "render_twice",
          explanation: "You should not call .render twice on the same docxtemplater instance"
        };
        throw err;
      }
      function throwFileTypeNotIdentified(zip) {
        var files = Object.keys(zip.files).slice(0, 10);
        var msg = "";
        if (files.length === 0) {
          msg = "Empty zip file";
        } else {
          msg = "Zip file contains : ".concat(files.join(","));
        }
        var err = new XTInternalError("The filetype for this file could not be identified, is this file corrupted ? ".concat(msg));
        err.properties = {
          id: "filetype_not_identified",
          explanation: "The filetype for this file could not be identified, is this file corrupted ? ".concat(msg)
        };
        throw err;
      }
      function throwXmlInvalid(content, offset) {
        var err = new XTTemplateError("An XML file has invalid xml");
        err.properties = {
          id: "file_has_invalid_xml",
          content,
          offset,
          explanation: "The docx contains invalid XML, it is most likely corrupt"
        };
        throw err;
      }
      function throwFileTypeNotHandled(fileType) {
        var err = new XTInternalError('The filetype "'.concat(fileType, '" is not handled by docxtemplater'));
        err.properties = {
          id: "filetype_not_handled",
          explanation: 'The file you are trying to generate is of type "'.concat(fileType, '", but only docx and pptx formats are handled'),
          fileType
        };
        throw err;
      }
      module.exports = {
        XTError,
        XTTemplateError,
        XTInternalError,
        XTScopeParserError,
        XTAPIVersionError,
        // Remove this alias in v4
        RenderingError: XTRenderingError,
        XTRenderingError,
        getClosingTagNotMatchOpeningTag,
        getLoopPositionProducesInvalidXMLError,
        getScopeCompilationError,
        getScopeParserExecutionError,
        getUnclosedTagException,
        getUnopenedTagException,
        getUnmatchedLoopException,
        getDuplicateCloseTagException,
        getDuplicateOpenTagException,
        getCorruptCharactersException,
        getInvalidRawXMLValueException,
        getUnbalancedLoopException,
        throwApiVersionError,
        throwFileTypeNotHandled,
        throwFileTypeNotIdentified,
        throwMalformedXml,
        throwMultiError,
        throwExpandNotFound,
        throwRawTagShouldBeOnlyTextInParagraph,
        throwUnimplementedTagType,
        throwXmlTagNotFound,
        throwXmlInvalid,
        throwResolveBeforeCompile,
        throwRenderInvalidTemplate,
        throwRenderTwice
      };
    }
  });

  // node_modules/docxtemplater/js/doc-utils.js
  var require_doc_utils = __commonJS({
    "node_modules/docxtemplater/js/doc-utils.js"(exports, module) {
      "use strict";
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return;
        if (typeof o === "string")
          return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor)
          n = o.constructor.name;
        if (n === "Map" || n === "Set")
          return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++)
          arr2[i] = arr[i];
        return arr2;
      }
      function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
          var e, n, i, u, a = [], f = true, o = false;
          try {
            if (i = (t = t.call(r)).next, 0 === l) {
              if (Object(t) !== t)
                return;
              f = false;
            } else
              for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
                ;
          } catch (r2) {
            o = true, n = r2;
          } finally {
            try {
              if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
                return;
            } finally {
              if (o)
                throw n;
            }
          }
          return a;
        }
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr;
      }
      var _require = require_lib();
      var DOMParser = _require.DOMParser;
      var XMLSerializer = _require.XMLSerializer;
      var _require2 = require_errors();
      var throwXmlTagNotFound = _require2.throwXmlTagNotFound;
      var _require3 = require_utils3();
      var last = _require3.last;
      var first = _require3.first;
      function isWhiteSpace(value) {
        return /^[ \n\r\t]+$/.test(value);
      }
      function parser(tag) {
        return {
          get: function get(scope) {
            if (tag === ".") {
              return scope;
            }
            if (scope) {
              return scope[tag];
            }
            return scope;
          }
        };
      }
      var attrToRegex = {};
      function setSingleAttribute(partValue, attr, attrValue) {
        var regex;
        if (attrToRegex[attr]) {
          regex = attrToRegex[attr];
        } else {
          regex = new RegExp("(<.* ".concat(attr, '=")([^"]*)(".*)$'));
          attrToRegex[attr] = regex;
        }
        if (regex.test(partValue)) {
          return partValue.replace(regex, "$1".concat(attrValue, "$3"));
        }
        var end = partValue.lastIndexOf("/>");
        if (end === -1) {
          end = partValue.lastIndexOf(">");
        }
        return partValue.substr(0, end) + " ".concat(attr, '="').concat(attrValue, '"') + partValue.substr(end);
      }
      function getSingleAttribute(value, attributeName) {
        var index = value.indexOf(" ".concat(attributeName, '="'));
        if (index === -1) {
          return null;
        }
        var startIndex = value.substr(index).search(/["']/) + index;
        var endIndex = value.substr(startIndex + 1).search(/["']/) + startIndex;
        return value.substr(startIndex + 1, endIndex - startIndex);
      }
      function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
      }
      function startsWith(str, prefix) {
        return str.substring(0, prefix.length) === prefix;
      }
      function getDuplicates(arr) {
        var duplicates = [];
        var hash = {}, result = [];
        for (var i = 0, l = arr.length; i < l; ++i) {
          if (!hash[arr[i]]) {
            hash[arr[i]] = true;
            result.push(arr[i]);
          } else {
            duplicates.push(arr[i]);
          }
        }
        return duplicates;
      }
      function uniq(arr) {
        var hash = {}, result = [];
        for (var i = 0, l = arr.length; i < l; ++i) {
          if (!hash[arr[i]]) {
            hash[arr[i]] = true;
            result.push(arr[i]);
          }
        }
        return result;
      }
      function chunkBy(parsed, f) {
        return parsed.reduce(function(chunks, p) {
          var currentChunk = last(chunks);
          var res = f(p);
          if (res === "start") {
            chunks.push([p]);
          } else if (res === "end") {
            currentChunk.push(p);
            chunks.push([]);
          } else {
            currentChunk.push(p);
          }
          return chunks;
        }, [[]]).filter(function(p) {
          return p.length > 0;
        });
      }
      var defaults = {
        errorLogging: "json",
        paragraphLoop: false,
        nullGetter: function nullGetter(part) {
          return part.module ? "" : "undefined";
        },
        xmlFileNames: ["[Content_Types].xml"],
        parser,
        linebreaks: false,
        fileTypeConfig: null,
        delimiters: {
          start: "{",
          end: "}"
        },
        syntax: {}
      };
      function xml2str(xmlNode) {
        var a = new XMLSerializer();
        return a.serializeToString(xmlNode).replace(/xmlns(:[a-z0-9]+)?="" ?/g, "");
      }
      function str2xml(str) {
        if (str.charCodeAt(0) === 65279) {
          str = str.substr(1);
        }
        return new DOMParser().parseFromString(str, "text/xml");
      }
      var charMap = [["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ['"', "&quot;"], ["'", "&apos;"]];
      var charMapRegexes = charMap.map(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 2), endChar = _ref2[0], startChar = _ref2[1];
        return {
          rstart: new RegExp(startChar, "g"),
          rend: new RegExp(endChar, "g"),
          start: startChar,
          end: endChar
        };
      });
      function wordToUtf8(string) {
        var r;
        for (var i = charMapRegexes.length - 1; i >= 0; i--) {
          r = charMapRegexes[i];
          string = string.replace(r.rstart, r.end);
        }
        return string;
      }
      function utf8ToWord(string) {
        string = string.toString();
        var r;
        for (var i = 0, l = charMapRegexes.length; i < l; i++) {
          r = charMapRegexes[i];
          string = string.replace(r.rend, r.start);
        }
        return string;
      }
      function concatArrays(arrays) {
        var result = [];
        for (var i = 0; i < arrays.length; i++) {
          var array = arrays[i];
          for (var j = 0, len = array.length; j < len; j++) {
            result.push(array[j]);
          }
        }
        return result;
      }
      var spaceRegexp = new RegExp(String.fromCharCode(160), "g");
      function convertSpaces(s) {
        return s.replace(spaceRegexp, " ");
      }
      function pregMatchAll(regex, content) {
        var matchArray = [];
        var match;
        while ((match = regex.exec(content)) != null) {
          matchArray.push({
            array: match,
            offset: match.index
          });
        }
        return matchArray;
      }
      function isEnding(value, element) {
        return value === "</" + element + ">";
      }
      function isStarting(value, element) {
        return value.indexOf("<" + element) === 0 && [">", " ", "/"].indexOf(value[element.length + 1]) !== -1;
      }
      function getRight(parsed, element, index) {
        var val = getRightOrNull(parsed, element, index);
        if (val !== null) {
          return val;
        }
        throwXmlTagNotFound({
          position: "right",
          element,
          parsed,
          index
        });
      }
      function getRightOrNull(parsed, elements, index) {
        if (typeof elements === "string") {
          elements = [elements];
        }
        var level = 1;
        for (var i = index, l = parsed.length; i < l; i++) {
          var part = parsed[i];
          for (var j = 0, len = elements.length; j < len; j++) {
            var element = elements[j];
            if (isEnding(part.value, element)) {
              level--;
            }
            if (isStarting(part.value, element)) {
              level++;
            }
            if (level === 0) {
              return i;
            }
          }
        }
        return null;
      }
      function getLeft(parsed, element, index) {
        var val = getLeftOrNull(parsed, element, index);
        if (val !== null) {
          return val;
        }
        throwXmlTagNotFound({
          position: "left",
          element,
          parsed,
          index
        });
      }
      function getLeftOrNull(parsed, elements, index) {
        if (typeof elements === "string") {
          elements = [elements];
        }
        var level = 1;
        for (var i = index; i >= 0; i--) {
          var part = parsed[i];
          for (var j = 0, len = elements.length; j < len; j++) {
            var element = elements[j];
            if (isStarting(part.value, element)) {
              level--;
            }
            if (isEnding(part.value, element)) {
              level++;
            }
            if (level === 0) {
              return i;
            }
          }
        }
        return null;
      }
      function isTagStart(tagType, _ref3) {
        var type = _ref3.type, tag = _ref3.tag, position = _ref3.position;
        return type === "tag" && tag === tagType && (position === "start" || position === "selfclosing");
      }
      function isTagStartStrict(tagType, _ref4) {
        var type = _ref4.type, tag = _ref4.tag, position = _ref4.position;
        return type === "tag" && tag === tagType && position === "start";
      }
      function isTagEnd(tagType, _ref5) {
        var type = _ref5.type, tag = _ref5.tag, position = _ref5.position;
        return type === "tag" && tag === tagType && position === "end";
      }
      function isParagraphStart(part) {
        return isTagStartStrict("w:p", part) || isTagStartStrict("a:p", part);
      }
      function isParagraphEnd(part) {
        return isTagEnd("w:p", part) || isTagEnd("a:p", part);
      }
      function isTextStart(_ref6) {
        var type = _ref6.type, position = _ref6.position, text = _ref6.text;
        return type === "tag" && position === "start" && text;
      }
      function isTextEnd(_ref7) {
        var type = _ref7.type, position = _ref7.position, text = _ref7.text;
        return type === "tag" && position === "end" && text;
      }
      function isContent(_ref8) {
        var type = _ref8.type, position = _ref8.position;
        return type === "placeholder" || type === "content" && position === "insidetag";
      }
      function isModule(_ref9, modules) {
        var module2 = _ref9.module, type = _ref9.type;
        if (!(modules instanceof Array)) {
          modules = [modules];
        }
        return type === "placeholder" && modules.indexOf(module2) !== -1;
      }
      var corruptCharacters = /[\x00-\x08\x0B\x0C\x0E-\x1F]/;
      function hasCorruptCharacters(string) {
        return corruptCharacters.test(string);
      }
      function invertMap(map) {
        return Object.keys(map).reduce(function(invertedMap, key) {
          var value = map[key];
          invertedMap[value] = invertedMap[value] || [];
          invertedMap[value].push(key);
          return invertedMap;
        }, {});
      }
      function stableSort(arr, compare) {
        return arr.map(function(item, index) {
          return {
            item,
            index
          };
        }).sort(function(a, b) {
          return compare(a.item, b.item) || a.index - b.index;
        }).map(function(_ref10) {
          var item = _ref10.item;
          return item;
        });
      }
      module.exports = {
        endsWith,
        startsWith,
        isContent,
        isParagraphStart,
        isParagraphEnd,
        isTagStart,
        isTagEnd,
        isTextStart,
        isTextEnd,
        isStarting,
        isEnding,
        isModule,
        uniq,
        getDuplicates,
        chunkBy,
        last,
        first,
        xml2str,
        str2xml,
        getRightOrNull,
        getRight,
        getLeftOrNull,
        getLeft,
        pregMatchAll,
        convertSpaces,
        charMapRegexes,
        hasCorruptCharacters,
        defaults,
        wordToUtf8,
        utf8ToWord,
        concatArrays,
        invertMap,
        charMap,
        getSingleAttribute,
        setSingleAttribute,
        isWhiteSpace,
        stableSort
      };
    }
  });

  // node_modules/docxtemplater/js/traits.js
  var require_traits = __commonJS({
    "node_modules/docxtemplater/js/traits.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
      }
      function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _iterableToArray(iter) {
        if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
          return Array.from(iter);
      }
      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr))
          return _arrayLikeToArray(arr);
      }
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return;
        if (typeof o === "string")
          return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor)
          n = o.constructor.name;
        if (n === "Map" || n === "Set")
          return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++)
          arr2[i] = arr[i];
        return arr2;
      }
      function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
          var e, n, i, u, a = [], f = true, o = false;
          try {
            if (i = (t = t.call(r)).next, 0 === l) {
              if (Object(t) !== t)
                return;
              f = false;
            } else
              for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
                ;
          } catch (r2) {
            o = true, n = r2;
          } finally {
            try {
              if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
                return;
            } finally {
              if (o)
                throw n;
            }
          }
          return a;
        }
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr;
      }
      function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t.push.apply(t, o);
        }
        return t;
      }
      function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
            _defineProperty(e, r2, t[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
          });
        }
        return e;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var _require = require_doc_utils();
      var getRightOrNull = _require.getRightOrNull;
      var getRight = _require.getRight;
      var getLeft = _require.getLeft;
      var getLeftOrNull = _require.getLeftOrNull;
      var chunkBy = _require.chunkBy;
      var isTagStart = _require.isTagStart;
      var isTagEnd = _require.isTagEnd;
      var isContent = _require.isContent;
      var last = _require.last;
      var first = _require.first;
      var _require2 = require_errors();
      var XTTemplateError = _require2.XTTemplateError;
      var throwExpandNotFound = _require2.throwExpandNotFound;
      var getLoopPositionProducesInvalidXMLError = _require2.getLoopPositionProducesInvalidXMLError;
      function lastTagIsOpenTag(tags, tag) {
        if (tags.length === 0) {
          return false;
        }
        var innerLastTag = last(tags).substr(1);
        return innerLastTag.indexOf(tag) === 0;
      }
      function getListXmlElements(parts) {
        var result = [];
        for (var i = 0; i < parts.length; i++) {
          var _parts$i = parts[i], position = _parts$i.position, value = _parts$i.value, tag = _parts$i.tag;
          if (!tag) {
            continue;
          }
          if (position === "end") {
            if (lastTagIsOpenTag(result, tag)) {
              result.pop();
            } else {
              result.push(value);
            }
          } else if (position === "start") {
            result.push(value);
          }
        }
        return result;
      }
      function has(name, xmlElements) {
        for (var i = 0; i < xmlElements.length; i++) {
          var xmlElement = xmlElements[i];
          if (xmlElement.indexOf("<".concat(name)) === 0) {
            return true;
          }
        }
        return false;
      }
      function getExpandToDefault(postparsed, pair, expandTags) {
        var parts = postparsed.slice(pair[0].offset, pair[1].offset);
        var xmlElements = getListXmlElements(parts);
        var closingTagCount = xmlElements.filter(function(tag) {
          return tag[1] === "/";
        }).length;
        var startingTagCount = xmlElements.filter(function(tag) {
          return tag[1] !== "/" && tag[tag.length - 2] !== "/";
        }).length;
        if (closingTagCount !== startingTagCount) {
          return {
            error: getLoopPositionProducesInvalidXMLError({
              tag: first(pair).part.value,
              offset: [first(pair).part.offset, last(pair).part.offset]
            })
          };
        }
        var _loop = function _loop2() {
          var _expandTags$i = expandTags[i], contains = _expandTags$i.contains, expand = _expandTags$i.expand, onlyTextInTag = _expandTags$i.onlyTextInTag;
          if (has(contains, xmlElements)) {
            if (onlyTextInTag) {
              var left = getLeftOrNull(postparsed, contains, pair[0].offset);
              var right = getRightOrNull(postparsed, contains, pair[1].offset);
              if (left === null || right === null) {
                return 0;
              }
              var chunks = chunkBy(postparsed.slice(left, right), function(p) {
                return isTagStart(contains, p) ? "start" : isTagEnd(contains, p) ? "end" : null;
              });
              var firstChunk = first(chunks);
              var lastChunk = last(chunks);
              var firstContent = firstChunk.filter(isContent);
              var lastContent = lastChunk.filter(isContent);
              if (firstContent.length !== 1 || lastContent.length !== 1) {
                return 0;
              }
            }
            return {
              v: {
                value: expand
              }
            };
          }
        }, _ret;
        for (var i = 0, len = expandTags.length; i < len; i++) {
          _ret = _loop();
          if (_ret === 0)
            continue;
          if (_ret)
            return _ret.v;
        }
        return {};
      }
      function getExpandLimit(part, index, postparsed, options) {
        var expandTo = part.expandTo || options.expandTo;
        if (!expandTo) {
          return;
        }
        var right, left;
        try {
          left = getLeft(postparsed, expandTo, index);
          right = getRight(postparsed, expandTo, index);
        } catch (rootError) {
          if (rootError instanceof XTTemplateError) {
            throwExpandNotFound(_objectSpread({
              part,
              rootError,
              postparsed,
              expandTo,
              index
            }, options.error));
          }
          throw rootError;
        }
        return [left, right];
      }
      function expandOne(_ref, part, postparsed, options) {
        var _ref2 = _slicedToArray(_ref, 2), left = _ref2[0], right = _ref2[1];
        var index = postparsed.indexOf(part);
        var leftParts = postparsed.slice(left, index);
        var rightParts = postparsed.slice(index + 1, right + 1);
        var inner = options.getInner({
          postparse: options.postparse,
          index,
          part,
          leftParts,
          rightParts,
          left,
          right,
          postparsed
        });
        if (!inner.length) {
          inner.expanded = [leftParts, rightParts];
          inner = [inner];
        }
        return {
          left,
          right,
          inner
        };
      }
      function expandToOne(postparsed, options) {
        var errors = [];
        if (postparsed.errors) {
          errors = postparsed.errors;
          postparsed = postparsed.postparsed;
        }
        var limits = [];
        for (var i = 0, len = postparsed.length; i < len; i++) {
          var part = postparsed[i];
          if (part.type === "placeholder" && part.module === options.moduleName && // The part.subparsed check is used to fix this github issue :
          // https://github.com/open-xml-templating/docxtemplater/issues/671
          !part.subparsed) {
            try {
              var limit = getExpandLimit(part, i, postparsed, options);
              if (!limit) {
                continue;
              }
              var _limit = _slicedToArray(limit, 2), left = _limit[0], right = _limit[1];
              limits.push({
                left,
                right,
                part,
                i,
                leftPart: postparsed[left],
                rightPart: postparsed[right]
              });
            } catch (error) {
              if (error instanceof XTTemplateError) {
                errors.push(error);
              } else {
                throw error;
              }
            }
          }
        }
        limits.sort(function(l1, l2) {
          if (l1.left === l2.left) {
            return l2.part.lIndex < l1.part.lIndex ? 1 : -1;
          }
          return l2.left < l1.left ? 1 : -1;
        });
        var maxRight = -1;
        var offset = 0;
        limits.forEach(function(limit2, i2) {
          var _postparsed;
          maxRight = Math.max(maxRight, i2 > 0 ? limits[i2 - 1].right : 0);
          if (limit2.left < maxRight) {
            return;
          }
          var result;
          try {
            result = expandOne([limit2.left + offset, limit2.right + offset], limit2.part, postparsed, options);
          } catch (error) {
            if (error instanceof XTTemplateError) {
              errors.push(error);
            } else {
              throw error;
            }
          }
          if (!result) {
            return;
          }
          offset += result.inner.length - (result.right + 1 - result.left);
          (_postparsed = postparsed).splice.apply(_postparsed, [result.left, result.right + 1 - result.left].concat(_toConsumableArray(result.inner)));
        });
        return {
          postparsed,
          errors
        };
      }
      module.exports = {
        expandToOne,
        getExpandToDefault
      };
    }
  });

  // node_modules/docxtemplater/js/module-wrapper.js
  var require_module_wrapper = __commonJS({
    "node_modules/docxtemplater/js/module-wrapper.js"(exports, module) {
      "use strict";
      var _require = require_errors();
      var XTInternalError = _require.XTInternalError;
      function emptyFun() {
      }
      function identity(i) {
        return i;
      }
      module.exports = function(module2) {
        var defaults = {
          set: emptyFun,
          matchers: function matchers() {
            return [];
          },
          parse: emptyFun,
          render: emptyFun,
          getTraits: emptyFun,
          getFileType: emptyFun,
          nullGetter: emptyFun,
          optionsTransformer: identity,
          postrender: identity,
          errorsTransformer: identity,
          getRenderedMap: identity,
          preparse: identity,
          postparse: identity,
          on: emptyFun,
          resolve: emptyFun,
          preResolve: emptyFun
        };
        if (Object.keys(defaults).every(function(key) {
          return !module2[key];
        })) {
          var err = new XTInternalError("This module cannot be wrapped, because it doesn't define any of the necessary functions");
          err.properties = {
            id: "module_cannot_be_wrapped",
            explanation: "This module cannot be wrapped, because it doesn't define any of the necessary functions"
          };
          throw err;
        }
        Object.keys(defaults).forEach(function(key) {
          module2[key] = module2[key] || defaults[key];
        });
        return module2;
      };
    }
  });

  // node_modules/docxtemplater/js/scope-manager.js
  var require_scope_manager = __commonJS({
    "node_modules/docxtemplater/js/scope-manager.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var _require = require_errors();
      var getScopeParserExecutionError = _require.getScopeParserExecutionError;
      var _require2 = require_utils3();
      var last = _require2.last;
      var _require3 = require_doc_utils();
      var concatArrays = _require3.concatArrays;
      function find(list, fn) {
        var length = list.length >>> 0;
        var value;
        for (var i = 0; i < length; i++) {
          value = list[i];
          if (fn.call(this, value, i, list)) {
            return value;
          }
        }
        return void 0;
      }
      function _getValue(tag, meta, num) {
        var _this = this;
        var scope = this.scopeList[num];
        if (this.root.finishedResolving) {
          var w = this.resolved;
          var _loop = function _loop2() {
            var lIndex = _this.scopeLindex[i];
            w = find(w, function(r) {
              return r.lIndex === lIndex;
            });
            w = w.value[_this.scopePathItem[i]];
          };
          for (var i = this.resolveOffset, len = this.scopePath.length; i < len; i++) {
            _loop();
          }
          return find(w, function(r) {
            return meta.part.lIndex === r.lIndex;
          }).value;
        }
        var result;
        var parser;
        if (!this.cachedParsers || !meta.part) {
          parser = this.parser(tag, {
            tag: meta.part,
            scopePath: this.scopePath
          });
        } else if (this.cachedParsers[meta.part.lIndex]) {
          parser = this.cachedParsers[meta.part.lIndex];
        } else {
          parser = this.cachedParsers[meta.part.lIndex] = this.parser(tag, {
            tag: meta.part,
            scopePath: this.scopePath
          });
        }
        try {
          result = parser.get(scope, this.getContext(meta, num));
        } catch (error) {
          throw getScopeParserExecutionError({
            tag,
            scope,
            error,
            offset: meta.part.offset
          });
        }
        if (result == null && num > 0) {
          return _getValue.call(this, tag, meta, num - 1);
        }
        return result;
      }
      function _getValueAsync(tag, meta, num) {
        var _this2 = this;
        var scope = this.scopeList[num];
        var parser;
        if (!this.cachedParsers || !meta.part) {
          parser = this.parser(tag, {
            tag: meta.part,
            scopePath: this.scopePath
          });
        } else if (this.cachedParsers[meta.part.lIndex]) {
          parser = this.cachedParsers[meta.part.lIndex];
        } else {
          parser = this.cachedParsers[meta.part.lIndex] = this.parser(tag, {
            tag: meta.part,
            scopePath: this.scopePath
          });
        }
        return Promise.resolve().then(function() {
          return parser.get(scope, _this2.getContext(meta, num));
        })["catch"](function(error) {
          throw getScopeParserExecutionError({
            tag,
            scope,
            error,
            offset: meta.part.offset
          });
        }).then(function(result) {
          if (result == null && num > 0) {
            return _getValueAsync.call(_this2, tag, meta, num - 1);
          }
          return result;
        });
      }
      var ScopeManager = /* @__PURE__ */ function() {
        function ScopeManager2(options) {
          _classCallCheck(this, ScopeManager2);
          this.root = options.root || this;
          this.resolveOffset = options.resolveOffset || 0;
          this.scopePath = options.scopePath;
          this.scopePathItem = options.scopePathItem;
          this.scopePathLength = options.scopePathLength;
          this.scopeList = options.scopeList;
          this.scopeType = "";
          this.scopeTypes = options.scopeTypes;
          this.scopeLindex = options.scopeLindex;
          this.parser = options.parser;
          this.resolved = options.resolved;
          this.cachedParsers = options.cachedParsers;
        }
        return _createClass(ScopeManager2, [{
          key: "loopOver",
          value: function loopOver(tag, functor, inverted, meta) {
            return this.loopOverValue(this.getValue(tag, meta), functor, inverted);
          }
        }, {
          key: "functorIfInverted",
          value: function functorIfInverted(inverted, functor, value, i, length) {
            if (inverted) {
              functor(value, i, length);
            }
            return inverted;
          }
        }, {
          key: "isValueFalsy",
          value: function isValueFalsy(value, type) {
            return value == null || !value || type === "[object Array]" && value.length === 0;
          }
        }, {
          key: "loopOverValue",
          value: function loopOverValue(value, functor, inverted) {
            if (this.root.finishedResolving) {
              inverted = false;
            }
            var type = Object.prototype.toString.call(value);
            if (this.isValueFalsy(value, type)) {
              this.scopeType = false;
              return this.functorIfInverted(inverted, functor, last(this.scopeList), 0, 1);
            }
            if (type === "[object Array]") {
              this.scopeType = "array";
              for (var i = 0; i < value.length; i++) {
                this.functorIfInverted(!inverted, functor, value[i], i, value.length);
              }
              return true;
            }
            if (type === "[object Object]") {
              this.scopeType = "object";
              return this.functorIfInverted(!inverted, functor, value, 0, 1);
            }
            return this.functorIfInverted(!inverted, functor, last(this.scopeList), 0, 1);
          }
        }, {
          key: "getValue",
          value: function getValue(tag, meta) {
            var result = _getValue.call(this, tag, meta, this.scopeList.length - 1);
            if (typeof result === "function") {
              return result(this.scopeList[this.scopeList.length - 1], this);
            }
            return result;
          }
        }, {
          key: "getValueAsync",
          value: function getValueAsync(tag, meta) {
            var _this3 = this;
            return _getValueAsync.call(this, tag, meta, this.scopeList.length - 1).then(function(result) {
              if (typeof result === "function") {
                return result(_this3.scopeList[_this3.scopeList.length - 1], _this3);
              }
              return result;
            });
          }
        }, {
          key: "getContext",
          value: function getContext(meta, num) {
            return {
              num,
              meta,
              scopeList: this.scopeList,
              resolved: this.resolved,
              scopePath: this.scopePath,
              scopeTypes: this.scopeTypes,
              scopePathItem: this.scopePathItem,
              scopePathLength: this.scopePathLength
            };
          }
        }, {
          key: "createSubScopeManager",
          value: function createSubScopeManager(scope, tag, i, part, length) {
            return new ScopeManager2({
              root: this.root,
              resolveOffset: this.resolveOffset,
              resolved: this.resolved,
              parser: this.parser,
              cachedParsers: this.cachedParsers,
              scopeTypes: concatArrays([this.scopeTypes, [this.scopeType]]),
              scopeList: concatArrays([this.scopeList, [scope]]),
              scopePath: concatArrays([this.scopePath, [tag]]),
              scopePathItem: concatArrays([this.scopePathItem, [i]]),
              scopePathLength: concatArrays([this.scopePathLength, [length]]),
              scopeLindex: concatArrays([this.scopeLindex, [part.lIndex]])
            });
          }
        }]);
      }();
      module.exports = function(options) {
        options.scopePath = [];
        options.scopePathItem = [];
        options.scopePathLength = [];
        options.scopeTypes = [];
        options.scopeLindex = [];
        options.scopeList = [options.tags];
        return new ScopeManager(options);
      };
    }
  });

  // node_modules/docxtemplater/js/error-logger.js
  var require_error_logger = __commonJS({
    "node_modules/docxtemplater/js/error-logger.js"(exports, module) {
      "use strict";
      function replaceErrors(key, value) {
        if (value instanceof Error) {
          return Object.getOwnPropertyNames(value).concat("stack").reduce(function(error, key2) {
            error[key2] = value[key2];
            if (key2 === "stack") {
              error[key2] = value[key2].toString();
            }
            return error;
          }, {});
        }
        return value;
      }
      function logger(error, logging) {
        console.log(JSON.stringify({
          error
        }, replaceErrors, logging === "json" ? 2 : null));
        if (error.properties && error.properties.errors instanceof Array) {
          var errorMessages = error.properties.errors.map(function(error2) {
            return error2.properties.explanation;
          }).join("\n");
          console.log("errorMessages", errorMessages);
        }
      }
      module.exports = logger;
    }
  });

  // node_modules/docxtemplater/js/collect-content-types.js
  var require_collect_content_types = __commonJS({
    "node_modules/docxtemplater/js/collect-content-types.js"(exports, module) {
      "use strict";
      var ctXML = "[Content_Types].xml";
      function collectContentTypes(overrides, defaults, zip) {
        var partNames = {};
        for (var i = 0, len = overrides.length; i < len; i++) {
          var override = overrides[i];
          var contentType = override.getAttribute("ContentType");
          var partName = override.getAttribute("PartName").substr(1);
          partNames[partName] = contentType;
        }
        var _loop = function _loop2() {
          var def = defaults[_i];
          var contentType2 = def.getAttribute("ContentType");
          var extension = def.getAttribute("Extension");
          zip.file(/./).map(function(_ref) {
            var name = _ref.name;
            if (name.slice(name.length - extension.length) === extension && !partNames[name] && name !== ctXML) {
              partNames[name] = contentType2;
            }
          });
        };
        for (var _i = 0, _len = defaults.length; _i < _len; _i++) {
          _loop();
        }
        return partNames;
      }
      module.exports = collectContentTypes;
    }
  });

  // node_modules/docxtemplater/js/filetypes.js
  var require_filetypes = __commonJS({
    "node_modules/docxtemplater/js/filetypes.js"(exports, module) {
      "use strict";
      var docxContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml";
      var docxmContentType = "application/vnd.ms-word.document.macroEnabled.main+xml";
      var dotxContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml";
      var dotmContentType = "application/vnd.ms-word.template.macroEnabledTemplate.main+xml";
      var headerContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml";
      var footnotesContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml";
      var commentsContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml";
      var footerContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml";
      var pptxContentType = "application/vnd.openxmlformats-officedocument.presentationml.slide+xml";
      var pptxSlideMaster = "application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml";
      var pptxSlideLayout = "application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml";
      var pptxPresentationContentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml";
      var main = [docxContentType, docxmContentType, dotxContentType, dotmContentType];
      var filetypes = {
        main,
        docx: [headerContentType].concat(main, [footerContentType, footnotesContentType, commentsContentType]),
        pptx: [pptxContentType, pptxSlideMaster, pptxSlideLayout, pptxPresentationContentType]
      };
      module.exports = filetypes;
    }
  });

  // node_modules/docxtemplater/js/content-types.js
  var require_content_types = __commonJS({
    "node_modules/docxtemplater/js/content-types.js"(exports, module) {
      "use strict";
      var coreContentType = "application/vnd.openxmlformats-package.core-properties+xml";
      var appContentType = "application/vnd.openxmlformats-officedocument.extended-properties+xml";
      var customContentType = "application/vnd.openxmlformats-officedocument.custom-properties+xml";
      var settingsContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml";
      module.exports = {
        settingsContentType,
        coreContentType,
        appContentType,
        customContentType
      };
    }
  });

  // node_modules/docxtemplater/js/modules/common.js
  var require_common = __commonJS({
    "node_modules/docxtemplater/js/modules/common.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var wrapper = require_module_wrapper();
      var filetypes = require_filetypes();
      var _require = require_content_types();
      var settingsContentType = _require.settingsContentType;
      var coreContentType = _require.coreContentType;
      var appContentType = _require.appContentType;
      var customContentType = _require.customContentType;
      var commonContentTypes = [settingsContentType, coreContentType, appContentType, customContentType];
      var Common = /* @__PURE__ */ function() {
        function Common2() {
          _classCallCheck(this, Common2);
          this.name = "Common";
        }
        return _createClass(Common2, [{
          key: "getFileType",
          value: function getFileType(_ref) {
            var doc = _ref.doc;
            var invertedContentTypes = doc.invertedContentTypes;
            if (!invertedContentTypes) {
              return;
            }
            for (var j = 0, len2 = commonContentTypes.length; j < len2; j++) {
              var ct = commonContentTypes[j];
              if (invertedContentTypes[ct]) {
                Array.prototype.push.apply(doc.targets, invertedContentTypes[ct]);
              }
            }
            var keys = ["docx", "pptx"];
            var ftCandidate;
            for (var i = 0, len = keys.length; i < len; i++) {
              var contentTypes = filetypes[keys[i]];
              for (var _j = 0, _len = contentTypes.length; _j < _len; _j++) {
                var _ct = contentTypes[_j];
                if (invertedContentTypes[_ct]) {
                  for (var k = 0, _len2 = invertedContentTypes[_ct].length; k < _len2; k++) {
                    var target = invertedContentTypes[_ct][k];
                    if (doc.relsTypes[target] && ["http://purl.oclc.org/ooxml/officeDocument/relationships/officeDocument", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"].indexOf(doc.relsTypes[target]) === -1) {
                      continue;
                    }
                    ftCandidate = keys[i];
                    if (filetypes.main.indexOf(_ct) !== -1 || _ct === filetypes.pptx[0]) {
                      doc.textTarget || (doc.textTarget = target);
                    }
                    doc.targets.push(target);
                  }
                }
              }
              if (ftCandidate) {
                return ftCandidate;
              }
            }
            return ftCandidate;
          }
        }]);
      }();
      module.exports = function() {
        return wrapper(new Common());
      };
    }
  });

  // node_modules/docxtemplater/js/lexer.js
  var require_lexer = __commonJS({
    "node_modules/docxtemplater/js/lexer.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return;
        if (typeof o === "string")
          return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor)
          n = o.constructor.name;
        if (n === "Map" || n === "Set")
          return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++)
          arr2[i] = arr[i];
        return arr2;
      }
      function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
          var e, n, i, u, a = [], f = true, o = false;
          try {
            if (i = (t = t.call(r)).next, 0 === l) {
              if (Object(t) !== t)
                return;
              f = false;
            } else
              for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
                ;
          } catch (r2) {
            o = true, n = r2;
          } finally {
            try {
              if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
                return;
            } finally {
              if (o)
                throw n;
            }
          }
          return a;
        }
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr;
      }
      function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t.push.apply(t, o);
        }
        return t;
      }
      function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
            _defineProperty(e, r2, t[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
          });
        }
        return e;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var _require = require_errors();
      var getUnclosedTagException = _require.getUnclosedTagException;
      var getUnopenedTagException = _require.getUnopenedTagException;
      var getDuplicateOpenTagException = _require.getDuplicateOpenTagException;
      var getDuplicateCloseTagException = _require.getDuplicateCloseTagException;
      var throwMalformedXml = _require.throwMalformedXml;
      var throwXmlInvalid = _require.throwXmlInvalid;
      var XTTemplateError = _require.XTTemplateError;
      var _require2 = require_doc_utils();
      var isTextStart = _require2.isTextStart;
      var isTextEnd = _require2.isTextEnd;
      var wordToUtf8 = _require2.wordToUtf8;
      var DELIMITER_NONE = 0;
      var DELIMITER_EQUAL = 1;
      var DELIMITER_START = 2;
      var DELIMITER_END = 3;
      function inRange(range, match) {
        return range[0] <= match.offset && match.offset < range[1];
      }
      function updateInTextTag(part, inTextTag) {
        if (isTextStart(part)) {
          if (inTextTag) {
            throwMalformedXml();
          }
          return true;
        }
        if (isTextEnd(part)) {
          if (!inTextTag) {
            throwMalformedXml();
          }
          return false;
        }
        return inTextTag;
      }
      function getTag(tag) {
        var position = "";
        var start = 1;
        var end = tag.indexOf(" ");
        if (tag[tag.length - 2] === "/") {
          position = "selfclosing";
          if (end === -1) {
            end = tag.length - 2;
          }
        } else if (tag[1] === "/") {
          start = 2;
          position = "end";
          if (end === -1) {
            end = tag.length - 1;
          }
        } else {
          position = "start";
          if (end === -1) {
            end = tag.length - 1;
          }
        }
        return {
          tag: tag.slice(start, end),
          position
        };
      }
      function tagMatcher(content, textMatchArray, othersMatchArray) {
        var cursor = 0;
        var contentLength = content.length;
        var allMatches = {};
        for (var i = 0, len = textMatchArray.length; i < len; i++) {
          allMatches[textMatchArray[i]] = true;
        }
        for (var _i = 0, _len = othersMatchArray.length; _i < _len; _i++) {
          allMatches[othersMatchArray[_i]] = false;
        }
        var totalMatches = [];
        while (cursor < contentLength) {
          cursor = content.indexOf("<", cursor);
          if (cursor === -1) {
            break;
          }
          var offset = cursor;
          var nextOpening = content.indexOf("<", cursor + 1);
          cursor = content.indexOf(">", cursor);
          if (cursor === -1 || nextOpening !== -1 && cursor > nextOpening) {
            throwXmlInvalid(content, offset);
          }
          var tagText = content.slice(offset, cursor + 1);
          var _getTag = getTag(tagText), tag = _getTag.tag, position = _getTag.position;
          var text = allMatches[tag];
          if (text == null) {
            continue;
          }
          totalMatches.push({
            type: "tag",
            position,
            text,
            offset,
            value: tagText,
            tag
          });
        }
        return totalMatches;
      }
      function getDelimiterErrors(delimiterMatches, fullText, syntaxOptions) {
        var errors = [];
        var inDelimiter = false;
        var lastDelimiterMatch = {
          offset: 0
        };
        var xtag;
        var delimiterWithErrors = delimiterMatches.reduce(function(delimiterAcc, currDelimiterMatch) {
          var position = currDelimiterMatch.position;
          var delimiterOffset = currDelimiterMatch.offset;
          var lastDelimiterOffset2 = lastDelimiterMatch.offset;
          var lastDelimiterLength = lastDelimiterMatch.length;
          xtag = fullText.substr(lastDelimiterOffset2, delimiterOffset - lastDelimiterOffset2);
          if (inDelimiter && position === "start") {
            if (lastDelimiterOffset2 + lastDelimiterLength === delimiterOffset) {
              xtag = fullText.substr(lastDelimiterOffset2, delimiterOffset - lastDelimiterOffset2 + lastDelimiterLength + 4);
              errors.push(getDuplicateOpenTagException({
                xtag,
                offset: lastDelimiterOffset2
              }));
              lastDelimiterMatch = currDelimiterMatch;
              delimiterAcc.push(_objectSpread(_objectSpread({}, currDelimiterMatch), {}, {
                error: true
              }));
              return delimiterAcc;
            }
            errors.push(getUnclosedTagException({
              xtag: wordToUtf8(xtag),
              offset: lastDelimiterOffset2
            }));
            lastDelimiterMatch = currDelimiterMatch;
            delimiterAcc.push(_objectSpread(_objectSpread({}, currDelimiterMatch), {}, {
              error: true
            }));
            return delimiterAcc;
          }
          if (!inDelimiter && position === "end") {
            if (syntaxOptions.allowUnopenedTag) {
              return delimiterAcc;
            }
            if (lastDelimiterOffset2 + lastDelimiterLength === delimiterOffset) {
              xtag = fullText.substr(lastDelimiterOffset2 - 4, delimiterOffset - lastDelimiterOffset2 + lastDelimiterLength + 4);
              errors.push(getDuplicateCloseTagException({
                xtag,
                offset: lastDelimiterOffset2
              }));
              lastDelimiterMatch = currDelimiterMatch;
              delimiterAcc.push(_objectSpread(_objectSpread({}, currDelimiterMatch), {}, {
                error: true
              }));
              return delimiterAcc;
            }
            errors.push(getUnopenedTagException({
              xtag,
              offset: delimiterOffset
            }));
            lastDelimiterMatch = currDelimiterMatch;
            delimiterAcc.push(_objectSpread(_objectSpread({}, currDelimiterMatch), {}, {
              error: true
            }));
            return delimiterAcc;
          }
          inDelimiter = !inDelimiter;
          lastDelimiterMatch = currDelimiterMatch;
          delimiterAcc.push(currDelimiterMatch);
          return delimiterAcc;
        }, []);
        if (inDelimiter) {
          var lastDelimiterOffset = lastDelimiterMatch.offset;
          xtag = fullText.substr(lastDelimiterOffset, fullText.length - lastDelimiterOffset);
          errors.push(getUnclosedTagException({
            xtag: wordToUtf8(xtag),
            offset: lastDelimiterOffset
          }));
        }
        return {
          delimiterWithErrors,
          errors
        };
      }
      function compareOffsets(startOffset, endOffset) {
        if (startOffset === -1 && endOffset === -1) {
          return DELIMITER_NONE;
        }
        if (startOffset === endOffset) {
          return DELIMITER_EQUAL;
        }
        if (startOffset === -1 || endOffset === -1) {
          return endOffset < startOffset ? DELIMITER_START : DELIMITER_END;
        }
        return startOffset < endOffset ? DELIMITER_START : DELIMITER_END;
      }
      function splitDelimiters(inside) {
        var newDelimiters = inside.split(" ");
        if (newDelimiters.length !== 2) {
          var err = new XTTemplateError("New Delimiters cannot be parsed");
          err.properties = {
            id: "change_delimiters_invalid",
            explanation: "Cannot parser delimiters"
          };
          throw err;
        }
        var _newDelimiters = _slicedToArray(newDelimiters, 2), start = _newDelimiters[0], end = _newDelimiters[1];
        if (start.length === 0 || end.length === 0) {
          var _err = new XTTemplateError("New Delimiters cannot be parsed");
          _err.properties = {
            id: "change_delimiters_invalid",
            explanation: "Cannot parser delimiters"
          };
          throw _err;
        }
        return [start, end];
      }
      function getAllDelimiterIndexes(fullText, delimiters) {
        var indexes = [];
        var start = delimiters.start, end = delimiters.end;
        var offset = -1;
        var insideTag = false;
        while (true) {
          var startOffset = fullText.indexOf(start, offset + 1);
          var endOffset = fullText.indexOf(end, offset + 1);
          var position = null;
          var len = void 0;
          var compareResult = compareOffsets(startOffset, endOffset);
          if (compareResult === DELIMITER_EQUAL) {
            compareResult = insideTag ? DELIMITER_END : DELIMITER_START;
          }
          switch (compareResult) {
            case DELIMITER_NONE:
              return indexes;
            case DELIMITER_END:
              insideTag = false;
              offset = endOffset;
              position = "end";
              len = end.length;
              break;
            case DELIMITER_START:
              insideTag = true;
              offset = startOffset;
              position = "start";
              len = start.length;
              break;
          }
          if (compareResult === DELIMITER_START && fullText[offset + start.length] === "=") {
            indexes.push({
              offset: startOffset,
              position: "start",
              length: start.length,
              changedelimiter: true
            });
            var nextEqual = fullText.indexOf("=", offset + start.length + 1);
            var nextEndOffset = fullText.indexOf(end, nextEqual + 1);
            indexes.push({
              offset: nextEndOffset,
              position: "end",
              length: end.length,
              changedelimiter: true
            });
            var _insideTag = fullText.substr(offset + start.length + 1, nextEqual - offset - start.length - 1);
            var _splitDelimiters = splitDelimiters(_insideTag);
            var _splitDelimiters2 = _slicedToArray(_splitDelimiters, 2);
            start = _splitDelimiters2[0];
            end = _splitDelimiters2[1];
            offset = nextEndOffset;
            continue;
          }
          indexes.push({
            offset,
            position,
            length: len
          });
        }
      }
      function parseDelimiters(innerContentParts, delimiters, syntaxOptions) {
        var full = innerContentParts.map(function(p) {
          return p.value;
        }).join("");
        var delimiterMatches = getAllDelimiterIndexes(full, delimiters);
        var offset = 0;
        var ranges = innerContentParts.map(function(part) {
          offset += part.value.length;
          return {
            offset: offset - part.value.length,
            lIndex: part.lIndex
          };
        });
        var _getDelimiterErrors = getDelimiterErrors(delimiterMatches, full, syntaxOptions), delimiterWithErrors = _getDelimiterErrors.delimiterWithErrors, errors = _getDelimiterErrors.errors;
        var cutNext = 0;
        var delimiterIndex = 0;
        var parsed = ranges.map(function(p, i) {
          var offset2 = p.offset;
          var range = [offset2, offset2 + innerContentParts[i].value.length];
          var partContent = innerContentParts[i].value;
          var delimitersInOffset = [];
          while (delimiterIndex < delimiterWithErrors.length && inRange(range, delimiterWithErrors[delimiterIndex])) {
            delimitersInOffset.push(delimiterWithErrors[delimiterIndex]);
            delimiterIndex++;
          }
          var parts = [];
          var cursor = 0;
          if (cutNext > 0) {
            cursor = cutNext;
            cutNext = 0;
          }
          delimitersInOffset.forEach(function(delimiterInOffset) {
            var value2 = partContent.substr(cursor, delimiterInOffset.offset - offset2 - cursor);
            if (delimiterInOffset.changedelimiter) {
              if (delimiterInOffset.position === "start") {
                if (value2.length > 0) {
                  parts.push({
                    type: "content",
                    value: value2
                  });
                }
              } else {
                cursor = delimiterInOffset.offset - offset2 + delimiterInOffset.length;
              }
              return;
            }
            if (value2.length > 0) {
              parts.push({
                type: "content",
                value: value2
              });
              cursor += value2.length;
            }
            var delimiterPart = {
              type: "delimiter",
              position: delimiterInOffset.position,
              offset: cursor + offset2
            };
            parts.push(delimiterPart);
            cursor = delimiterInOffset.offset - offset2 + delimiterInOffset.length;
          });
          cutNext = cursor - partContent.length;
          var value = partContent.substr(cursor);
          if (value.length > 0) {
            parts.push({
              type: "content",
              value
            });
          }
          return parts;
        }, this);
        return {
          parsed,
          errors
        };
      }
      function isInsideContent(part) {
        return part.type === "content" && part.position === "insidetag";
      }
      function getContentParts(xmlparsed) {
        return xmlparsed.filter(isInsideContent);
      }
      function decodeContentParts(xmlparsed, fileType) {
        var inTextTag = false;
        xmlparsed.forEach(function(part) {
          inTextTag = updateInTextTag(part, inTextTag);
          if (part.type === "content") {
            part.position = inTextTag ? "insidetag" : "outsidetag";
          }
          if (fileType !== "text" && isInsideContent(part)) {
            part.value = part.value.replace(/>/g, "&gt;");
          }
        });
      }
      module.exports = {
        parseDelimiters,
        parse: function parse(xmllexed, delimiters, syntax, fileType) {
          decodeContentParts(xmllexed, fileType);
          var _parseDelimiters = parseDelimiters(getContentParts(xmllexed), delimiters, syntax), delimiterParsed = _parseDelimiters.parsed, errors = _parseDelimiters.errors;
          var lexed = [];
          var index = 0;
          var lIndex = 0;
          xmllexed.forEach(function(part) {
            if (isInsideContent(part)) {
              Array.prototype.push.apply(lexed, delimiterParsed[index].map(function(p) {
                if (p.type === "content") {
                  p.position = "insidetag";
                }
                p.lIndex = lIndex++;
                return p;
              }));
              index++;
            } else {
              part.lIndex = lIndex++;
              lexed.push(part);
            }
          });
          return {
            errors,
            lexed
          };
        },
        xmlparse: function xmlparse(content, xmltags) {
          var matches = tagMatcher(content, xmltags.text, xmltags.other);
          var cursor = 0;
          var parsed = matches.reduce(function(parsed2, match) {
            var value2 = content.substr(cursor, match.offset - cursor);
            if (value2.length > 0) {
              parsed2.push({
                type: "content",
                value: value2
              });
            }
            cursor = match.offset + match.value.length;
            delete match.offset;
            parsed2.push(match);
            return parsed2;
          }, []);
          var value = content.substr(cursor);
          if (value.length > 0) {
            parsed.push({
              type: "content",
              value
            });
          }
          return parsed;
        }
      };
    }
  });

  // node_modules/docxtemplater/js/xml-matcher.js
  var require_xml_matcher = __commonJS({
    "node_modules/docxtemplater/js/xml-matcher.js"(exports, module) {
      "use strict";
      var _require = require_doc_utils();
      var pregMatchAll = _require.pregMatchAll;
      module.exports = function xmlMatcher(content, tagsXmlArray) {
        var res = {
          content
        };
        var taj = tagsXmlArray.join("|");
        var regexp = new RegExp("(?:(<(?:".concat(taj, ")[^>]*>)([^<>]*)</(?:").concat(taj, ")>)|(<(?:").concat(taj, ")[^>]*/>)"), "g");
        res.matches = pregMatchAll(regexp, res.content);
        return res;
      };
    }
  });

  // node_modules/docxtemplater/js/prefix-matcher.js
  var require_prefix_matcher = __commonJS({
    "node_modules/docxtemplater/js/prefix-matcher.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      var nbspRegex = new RegExp(String.fromCharCode(160), "g");
      function replaceNbsps(str) {
        return str.replace(nbspRegex, " ");
      }
      function match(condition, placeHolderContent) {
        var type = _typeof(condition);
        if (type === "string") {
          return replaceNbsps(placeHolderContent.substr(0, condition.length)) === condition;
        }
        if (condition instanceof RegExp) {
          return condition.test(replaceNbsps(placeHolderContent));
        }
        if (type === "function") {
          return !!condition(placeHolderContent);
        }
      }
      function getValue(condition, placeHolderContent) {
        var type = _typeof(condition);
        if (type === "string") {
          return replaceNbsps(placeHolderContent).substr(condition.length);
        }
        if (condition instanceof RegExp) {
          return replaceNbsps(placeHolderContent).match(condition)[1];
        }
        if (type === "function") {
          return condition(placeHolderContent);
        }
      }
      function getValues(condition, placeHolderContent) {
        var type = _typeof(condition);
        if (type === "string") {
          return [placeHolderContent, replaceNbsps(placeHolderContent).substr(condition.length)];
        }
        if (condition instanceof RegExp) {
          return replaceNbsps(placeHolderContent).match(condition);
        }
        if (type === "function") {
          return [placeHolderContent, condition(placeHolderContent)];
        }
      }
      module.exports = {
        match,
        getValue,
        getValues
      };
    }
  });

  // node_modules/docxtemplater/js/parser.js
  var require_parser = __commonJS({
    "node_modules/docxtemplater/js/parser.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t.push.apply(t, o);
        }
        return t;
      }
      function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
            _defineProperty(e, r2, t[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
          });
        }
        return e;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
          var e, n, i, u, a = [], f = true, o = false;
          try {
            if (i = (t = t.call(r)).next, 0 === l) {
              if (Object(t) !== t)
                return;
              f = false;
            } else
              for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
                ;
          } catch (r2) {
            o = true, n = r2;
          } finally {
            try {
              if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
                return;
            } finally {
              if (o)
                throw n;
            }
          }
          return a;
        }
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr;
      }
      function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
      }
      function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return;
        if (typeof o === "string")
          return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor)
          n = o.constructor.name;
        if (n === "Map" || n === "Set")
          return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
      }
      function _iterableToArray(iter) {
        if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
          return Array.from(iter);
      }
      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr))
          return _arrayLikeToArray(arr);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++)
          arr2[i] = arr[i];
        return arr2;
      }
      var _require = require_doc_utils();
      var wordToUtf8 = _require.wordToUtf8;
      var _require2 = require_prefix_matcher();
      var match = _require2.match;
      var getValue = _require2.getValue;
      var getValues = _require2.getValues;
      function getMatchers(modules, options) {
        var matchers = [];
        for (var i = 0, l = modules.length; i < l; i++) {
          var _module = modules[i];
          if (_module.matchers) {
            var mmm = _module.matchers(options);
            if (!(mmm instanceof Array)) {
              throw new Error("module matcher returns a non array");
            }
            matchers.push.apply(matchers, _toConsumableArray(mmm));
          }
        }
        return matchers;
      }
      function getMatches(matchers, placeHolderContent, options) {
        var matches = [];
        for (var i = 0, len = matchers.length; i < len; i++) {
          var matcher = matchers[i];
          var _matcher = _slicedToArray(matcher, 2), prefix = _matcher[0], _module2 = _matcher[1];
          var properties = matcher[2] || {};
          if (options.match(prefix, placeHolderContent)) {
            var values = options.getValues(prefix, placeHolderContent);
            if (typeof properties === "function") {
              properties = properties(values);
            }
            if (!properties.value) {
              var _values = _slicedToArray(values, 2);
              properties.value = _values[1];
            }
            matches.push(_objectSpread({
              type: "placeholder",
              prefix,
              module: _module2,
              onMatch: properties.onMatch,
              priority: properties.priority
            }, properties));
          }
        }
        return matches;
      }
      function moduleParse(placeHolderContent, options) {
        var modules = options.modules;
        var startOffset = options.startOffset;
        var endLindex = options.lIndex;
        var moduleParsed;
        options.offset = startOffset;
        options.match = match;
        options.getValue = getValue;
        options.getValues = getValues;
        var matchers = getMatchers(modules, options);
        var matches = getMatches(matchers, placeHolderContent, options);
        if (matches.length > 0) {
          var bestMatch = null;
          matches.forEach(function(match2) {
            match2.priority = match2.priority || -match2.value.length;
            if (!bestMatch || match2.priority > bestMatch.priority) {
              bestMatch = match2;
            }
          });
          bestMatch.offset = startOffset;
          delete bestMatch.priority;
          bestMatch.endLindex = endLindex;
          bestMatch.lIndex = endLindex;
          bestMatch.raw = placeHolderContent;
          if (bestMatch.onMatch) {
            bestMatch.onMatch(bestMatch);
          }
          delete bestMatch.onMatch;
          delete bestMatch.prefix;
          return bestMatch;
        }
        for (var i = 0, l = modules.length; i < l; i++) {
          var _module3 = modules[i];
          moduleParsed = _module3.parse(placeHolderContent, options);
          if (moduleParsed) {
            moduleParsed.offset = startOffset;
            moduleParsed.endLindex = endLindex;
            moduleParsed.lIndex = endLindex;
            moduleParsed.raw = placeHolderContent;
            return moduleParsed;
          }
        }
        return {
          type: "placeholder",
          value: placeHolderContent,
          offset: startOffset,
          endLindex,
          lIndex: endLindex
        };
      }
      var parser = {
        preparse: function preparse(parsed, modules, options) {
          function preparse2(parsed2, options2) {
            return modules.forEach(function(module2) {
              module2.preparse(parsed2, options2);
            });
          }
          return {
            preparsed: preparse2(parsed, options)
          };
        },
        parse: function parse(lexed, modules, options) {
          var inPlaceHolder = false;
          var placeHolderContent = "";
          var startOffset;
          var tailParts = [];
          var droppedTags = options.fileTypeConfig.droppedTagsInsidePlaceholder || [];
          return lexed.reduce(function lexedToParsed(parsed, token) {
            if (token.type === "delimiter") {
              inPlaceHolder = token.position === "start";
              if (token.position === "end") {
                options.parse = function(placeHolderContent2) {
                  return moduleParse(placeHolderContent2, _objectSpread(_objectSpread(_objectSpread({}, options), token), {}, {
                    startOffset,
                    modules
                  }));
                };
                parsed.push(options.parse(wordToUtf8(placeHolderContent)));
                Array.prototype.push.apply(parsed, tailParts);
                tailParts = [];
              }
              if (token.position === "start") {
                tailParts = [];
                startOffset = token.offset;
              }
              placeHolderContent = "";
              return parsed;
            }
            if (!inPlaceHolder) {
              parsed.push(token);
              return parsed;
            }
            if (token.type !== "content" || token.position !== "insidetag") {
              if (droppedTags.indexOf(token.tag) !== -1) {
                return parsed;
              }
              tailParts.push(token);
              return parsed;
            }
            placeHolderContent += token.value;
            return parsed;
          }, []);
        },
        postparse: function postparse(postparsed, modules, options) {
          function getTraits(traitName, postparsed2) {
            return modules.map(function(module2) {
              return module2.getTraits(traitName, postparsed2);
            });
          }
          var errors = [];
          function _postparse(postparsed2, options2) {
            return modules.reduce(function(postparsed3, module2) {
              var r = module2.postparse(postparsed3, _objectSpread(_objectSpread({}, options2), {}, {
                postparse: function postparse2(parsed, opts) {
                  return _postparse(parsed, _objectSpread(_objectSpread({}, options2), opts));
                },
                getTraits
              }));
              if (r == null) {
                return postparsed3;
              }
              if (r.errors) {
                Array.prototype.push.apply(errors, r.errors);
                return r.postparsed;
              }
              return r;
            }, postparsed2);
          }
          return {
            postparsed: _postparse(postparsed, options),
            errors
          };
        }
      };
      module.exports = parser;
    }
  });

  // node_modules/docxtemplater/js/get-resolved-id.js
  var require_get_resolved_id = __commonJS({
    "node_modules/docxtemplater/js/get-resolved-id.js"(exports, module) {
      "use strict";
      function getResolvedId(part, options) {
        if (part.lIndex == null) {
          return null;
        }
        var path = options.scopeManager.scopePathItem;
        if (part.parentPart) {
          path = path.slice(0, path.length - 1);
        }
        var res = options.filePath + "@" + part.lIndex.toString() + "-" + path.join("-");
        return res;
      }
      module.exports = getResolvedId;
    }
  });

  // node_modules/docxtemplater/js/render.js
  var require_render = __commonJS({
    "node_modules/docxtemplater/js/render.js"(exports, module) {
      "use strict";
      var _require = require_errors();
      var throwUnimplementedTagType = _require.throwUnimplementedTagType;
      var XTScopeParserError = _require.XTScopeParserError;
      var getResolvedId = require_get_resolved_id();
      function moduleRender(part, options) {
        var moduleRendered;
        for (var i = 0, l = options.modules.length; i < l; i++) {
          var _module = options.modules[i];
          moduleRendered = _module.render(part, options);
          if (moduleRendered) {
            return moduleRendered;
          }
        }
        return false;
      }
      function render(options) {
        var baseNullGetter = options.baseNullGetter;
        var compiled = options.compiled, scopeManager = options.scopeManager;
        options.nullGetter = function(part, sm) {
          return baseNullGetter(part, sm || scopeManager);
        };
        var errors = [];
        var parts = compiled.map(function(part, i) {
          options.index = i;
          options.resolvedId = getResolvedId(part, options);
          var moduleRendered;
          try {
            moduleRendered = moduleRender(part, options);
          } catch (e) {
            if (e instanceof XTScopeParserError) {
              errors.push(e);
              return part;
            }
            throw e;
          }
          if (moduleRendered) {
            if (moduleRendered.errors) {
              Array.prototype.push.apply(errors, moduleRendered.errors);
            }
            return moduleRendered;
          }
          if (part.type === "content" || part.type === "tag") {
            return part;
          }
          throwUnimplementedTagType(part, i);
        }).reduce(function(parts2, _ref) {
          var value = _ref.value;
          if (value instanceof Array) {
            for (var i = 0, len = value.length; i < len; i++) {
              parts2.push(value[i]);
            }
          } else if (value) {
            parts2.push(value);
          }
          return parts2;
        }, []);
        return {
          errors,
          parts
        };
      }
      module.exports = render;
    }
  });

  // node_modules/docxtemplater/js/postrender.js
  var require_postrender = __commonJS({
    "node_modules/docxtemplater/js/postrender.js"(exports, module) {
      "use strict";
      function string2buf(str) {
        var c, c2, mPos, i, bufLen = 0;
        var strLen = str.length;
        for (mPos = 0; mPos < strLen; mPos++) {
          c = str.charCodeAt(mPos);
          if ((c & 64512) === 55296 && mPos + 1 < strLen) {
            c2 = str.charCodeAt(mPos + 1);
            if ((c2 & 64512) === 56320) {
              c = 65536 + (c - 55296 << 10) + (c2 - 56320);
              mPos++;
            }
          }
          bufLen += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
        }
        var buf = new Uint8Array(bufLen);
        for (i = 0, mPos = 0; i < bufLen; mPos++) {
          c = str.charCodeAt(mPos);
          if ((c & 64512) === 55296 && mPos + 1 < strLen) {
            c2 = str.charCodeAt(mPos + 1);
            if ((c2 & 64512) === 56320) {
              c = 65536 + (c - 55296 << 10) + (c2 - 56320);
              mPos++;
            }
          }
          if (c < 128) {
            buf[i++] = c;
          } else if (c < 2048) {
            buf[i++] = 192 | c >>> 6;
            buf[i++] = 128 | c & 63;
          } else if (c < 65536) {
            buf[i++] = 224 | c >>> 12;
            buf[i++] = 128 | c >>> 6 & 63;
            buf[i++] = 128 | c & 63;
          } else {
            buf[i++] = 240 | c >>> 18;
            buf[i++] = 128 | c >>> 12 & 63;
            buf[i++] = 128 | c >>> 6 & 63;
            buf[i++] = 128 | c & 63;
          }
        }
        return buf;
      }
      function postrender(parts, options) {
        for (var i = 0, l = options.modules.length; i < l; i++) {
          var _module = options.modules[i];
          parts = _module.postrender(parts, options);
        }
        var fullLength = 0;
        var newParts = options.joinUncorrupt(parts, options);
        var longStr = "";
        var lenStr = 0;
        var maxCompact = 65536;
        var uintArrays = [];
        for (var _i = 0, len = newParts.length; _i < len; _i++) {
          var part = newParts[_i];
          if (part.length + lenStr > maxCompact) {
            var _arr = string2buf(longStr);
            fullLength += _arr.length;
            uintArrays.push(_arr);
            longStr = "";
          }
          longStr += part;
          lenStr += part.length;
          delete newParts[_i];
        }
        var arr = string2buf(longStr);
        fullLength += arr.length;
        uintArrays.push(arr);
        var array = new Uint8Array(fullLength);
        var j = 0;
        uintArrays.forEach(function(buf) {
          for (var _i2 = 0; _i2 < buf.length; ++_i2) {
            array[_i2 + j] = buf[_i2];
          }
          j += buf.length;
        });
        return array;
      }
      module.exports = postrender;
    }
  });

  // node_modules/docxtemplater/js/resolve.js
  var require_resolve = __commonJS({
    "node_modules/docxtemplater/js/resolve.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
      }
      function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return;
        if (typeof o === "string")
          return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor)
          n = o.constructor.name;
        if (n === "Map" || n === "Set")
          return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
      }
      function _iterableToArray(iter) {
        if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
          return Array.from(iter);
      }
      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr))
          return _arrayLikeToArray(arr);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++)
          arr2[i] = arr[i];
        return arr2;
      }
      function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t.push.apply(t, o);
        }
        return t;
      }
      function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
            _defineProperty(e, r2, t[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
          });
        }
        return e;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var getResolvedId = require_get_resolved_id();
      function moduleResolve(part, options) {
        var moduleResolved;
        for (var i = 0, l = options.modules.length; i < l; i++) {
          var _module = options.modules[i];
          moduleResolved = _module.resolve(part, options);
          if (moduleResolved) {
            return moduleResolved;
          }
        }
        return false;
      }
      function resolve(options) {
        var resolved = [];
        var baseNullGetter = options.baseNullGetter;
        var compiled = options.compiled, scopeManager = options.scopeManager;
        options.nullGetter = function(part, sm) {
          return baseNullGetter(part, sm || scopeManager);
        };
        options.resolved = resolved;
        var errors = [];
        return Promise.all(compiled.filter(function(part) {
          return ["content", "tag"].indexOf(part.type) === -1;
        }).reduce(function(promises, part) {
          var moduleResolved = moduleResolve(part, _objectSpread(_objectSpread({}, options), {}, {
            resolvedId: getResolvedId(part, options)
          }));
          var result;
          if (moduleResolved) {
            result = moduleResolved.then(function(value) {
              resolved.push({
                tag: part.value,
                lIndex: part.lIndex,
                value
              });
            });
          } else if (part.type === "placeholder") {
            result = scopeManager.getValueAsync(part.value, {
              part
            }).then(function(value) {
              return value == null ? options.nullGetter(part) : value;
            }).then(function(value) {
              resolved.push({
                tag: part.value,
                lIndex: part.lIndex,
                value
              });
              return value;
            });
          } else {
            return;
          }
          promises.push(result["catch"](function(e) {
            if (e instanceof Array) {
              errors.push.apply(errors, _toConsumableArray(e));
            } else {
              errors.push(e);
            }
          }));
          return promises;
        }, [])).then(function() {
          return {
            errors,
            resolved
          };
        });
      }
      module.exports = resolve;
    }
  });

  // node_modules/docxtemplater/js/join-uncorrupt.js
  var require_join_uncorrupt = __commonJS({
    "node_modules/docxtemplater/js/join-uncorrupt.js"(exports, module) {
      "use strict";
      var _require = require_doc_utils();
      var startsWith = _require.startsWith;
      var endsWith = _require.endsWith;
      var isStarting = _require.isStarting;
      var isEnding = _require.isEnding;
      var isWhiteSpace = _require.isWhiteSpace;
      var filetypes = require_filetypes();
      function addEmptyParagraphAfterTable(parts) {
        var lastNonEmpty = "";
        for (var i = 0, len = parts.length; i < len; i++) {
          var p = parts[i];
          if (isWhiteSpace(p)) {
            continue;
          }
          if (endsWith(lastNonEmpty, "</w:tbl>")) {
            if (!startsWith(p, "<w:p") && !startsWith(p, "<w:tbl") && !startsWith(p, "<w:sectPr")) {
              p = "<w:p/>".concat(p);
            }
          }
          lastNonEmpty = p;
          parts[i] = p;
        }
        return parts;
      }
      function joinUncorrupt(parts, options) {
        var contains = options.fileTypeConfig.tagShouldContain || [];
        var collecting = "";
        var currentlyCollecting = -1;
        if (filetypes.docx.indexOf(options.contentType) !== -1) {
          parts = addEmptyParagraphAfterTable(parts);
        }
        var startIndex = -1;
        for (var i = 0, len = parts.length; i < len; i++) {
          var part = parts[i];
          for (var j = 0, len2 = contains.length; j < len2; j++) {
            var _contains$j = contains[j], tag = _contains$j.tag, shouldContain = _contains$j.shouldContain, value = _contains$j.value, drop = _contains$j.drop, dropParent = _contains$j.dropParent;
            if (currentlyCollecting === j) {
              if (isEnding(part, tag)) {
                currentlyCollecting = -1;
                if (dropParent) {
                  var start = void 0, end = void 0;
                  for (var k = startIndex; k > 0; k--) {
                    if (isStarting(parts[k], dropParent)) {
                      start = k;
                      break;
                    }
                  }
                  for (var _k = i; _k < parts.length; _k++) {
                    if (isEnding(parts[_k], dropParent)) {
                      end = _k;
                      break;
                    }
                  }
                  for (var _k2 = start; _k2 <= end; _k2++) {
                    parts[_k2] = "";
                  }
                } else if (drop) {
                  for (var _k3 = startIndex; _k3 <= i; _k3++) {
                    parts[_k3] = "";
                  }
                } else {
                  for (var _k4 = startIndex; _k4 < i; _k4++) {
                    parts[_k4] = "";
                  }
                  parts[i] = collecting + value + part;
                }
                break;
              }
              collecting += part;
              for (var _k5 = 0, len3 = shouldContain.length; _k5 < len3; _k5++) {
                var sc = shouldContain[_k5];
                if (isStarting(part, sc)) {
                  currentlyCollecting = -1;
                  break;
                }
              }
              if (currentlyCollecting > -1) {
              }
              break;
            }
            if (currentlyCollecting === -1 && isStarting(part, tag) && // to verify that the part doesn't have multiple tags, such as <w:tc><w:p>
            part.substr(1).indexOf("<") === -1) {
              if (part[part.length - 2] === "/") {
                parts[i] = "";
                break;
              } else {
                startIndex = i;
                currentlyCollecting = j;
                collecting = part;
                break;
              }
            }
          }
        }
        return parts;
      }
      module.exports = joinUncorrupt;
    }
  });

  // node_modules/docxtemplater/js/xml-templater.js
  var require_xml_templater = __commonJS({
    "node_modules/docxtemplater/js/xml-templater.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var _require = require_doc_utils();
      var wordToUtf8 = _require.wordToUtf8;
      var convertSpaces = _require.convertSpaces;
      var xmlMatcher = require_xml_matcher();
      var Lexer = require_lexer();
      var Parser = require_parser();
      var _render = require_render();
      var postrender = require_postrender();
      var resolve = require_resolve();
      var joinUncorrupt = require_join_uncorrupt();
      function _getFullText(content, tagsXmlArray) {
        var matcher = xmlMatcher(content, tagsXmlArray);
        var result = matcher.matches.map(function(match) {
          return match.array[2];
        });
        return wordToUtf8(convertSpaces(result.join("")));
      }
      module.exports = /* @__PURE__ */ function() {
        function XmlTemplater(content, options) {
          var _this = this;
          _classCallCheck(this, XmlTemplater);
          this.cachedParsers = {};
          this.content = content;
          Object.keys(options).forEach(function(key) {
            _this[key] = options[key];
          });
          this.setModules({
            inspect: {
              filePath: options.filePath
            }
          });
        }
        return _createClass(XmlTemplater, [{
          key: "resolveTags",
          value: function resolveTags(tags) {
            var _this2 = this;
            this.tags = tags;
            var options = this.getOptions();
            var filePath = this.filePath;
            options.scopeManager = this.scopeManager;
            options.resolve = resolve;
            var errors = [];
            return Promise.all(this.modules.map(function(module2) {
              return Promise.resolve(module2.preResolve(options))["catch"](function(e) {
                errors.push(e);
              });
            })).then(function() {
              if (errors.length !== 0) {
                throw errors;
              }
              return resolve(options).then(function(_ref) {
                var resolved = _ref.resolved, errors2 = _ref.errors;
                errors2 = errors2.map(function(error) {
                  if (!(error instanceof Error)) {
                    error = new Error(error);
                  }
                  error.properties = error.properties || {};
                  error.properties.file = filePath;
                  return error;
                });
                if (errors2.length !== 0) {
                  throw errors2;
                }
                return Promise.all(resolved).then(function(resolved2) {
                  options.scopeManager.root.finishedResolving = true;
                  options.scopeManager.resolved = resolved2;
                  _this2.setModules({
                    inspect: {
                      resolved: resolved2,
                      filePath
                    }
                  });
                  return resolved2;
                });
              });
            });
          }
        }, {
          key: "getFullText",
          value: function getFullText() {
            return _getFullText(this.content, this.fileTypeConfig.tagsXmlTextArray);
          }
        }, {
          key: "setModules",
          value: function setModules(obj) {
            this.modules.forEach(function(module2) {
              module2.set(obj);
            });
          }
        }, {
          key: "preparse",
          value: function preparse() {
            this.allErrors = [];
            this.xmllexed = Lexer.xmlparse(this.content, {
              text: this.fileTypeConfig.tagsXmlTextArray,
              other: this.fileTypeConfig.tagsXmlLexedArray
            });
            this.setModules({
              inspect: {
                filePath: this.filePath,
                xmllexed: this.xmllexed
              }
            });
            var _Lexer$parse = Lexer.parse(this.xmllexed, this.delimiters, this.syntax, this.fileType), lexed = _Lexer$parse.lexed, lexerErrors = _Lexer$parse.errors;
            this.allErrors = this.allErrors.concat(lexerErrors);
            this.lexed = lexed;
            this.setModules({
              inspect: {
                filePath: this.filePath,
                lexed: this.lexed
              }
            });
            var options = this.getOptions();
            Parser.preparse(this.lexed, this.modules, options);
          }
        }, {
          key: "parse",
          value: function parse() {
            this.setModules({
              inspect: {
                filePath: this.filePath
              }
            });
            var options = this.getOptions();
            this.parsed = Parser.parse(this.lexed, this.modules, options);
            this.setModules({
              inspect: {
                filePath: this.filePath,
                parsed: this.parsed
              }
            });
            var _Parser$postparse = Parser.postparse(this.parsed, this.modules, options), postparsed = _Parser$postparse.postparsed, postparsedErrors = _Parser$postparse.errors;
            this.postparsed = postparsed;
            this.setModules({
              inspect: {
                filePath: this.filePath,
                postparsed: this.postparsed
              }
            });
            this.allErrors = this.allErrors.concat(postparsedErrors);
            this.errorChecker(this.allErrors);
            return this;
          }
        }, {
          key: "errorChecker",
          value: function errorChecker(errors) {
            var _this3 = this;
            errors.forEach(function(error) {
              error.properties = error.properties || {};
              error.properties.file = _this3.filePath;
            });
            this.modules.forEach(function(module2) {
              errors = module2.errorsTransformer(errors);
            });
          }
        }, {
          key: "baseNullGetter",
          value: function baseNullGetter(part, sm) {
            var _this4 = this;
            var value = this.modules.reduce(function(value2, module2) {
              if (value2 != null) {
                return value2;
              }
              return module2.nullGetter(part, sm, _this4);
            }, null);
            if (value != null) {
              return value;
            }
            return this.nullGetter(part, sm);
          }
        }, {
          key: "getOptions",
          value: function getOptions() {
            return {
              compiled: this.postparsed,
              cachedParsers: this.cachedParsers,
              tags: this.tags,
              modules: this.modules,
              parser: this.parser,
              contentType: this.contentType,
              relsType: this.relsType,
              baseNullGetter: this.baseNullGetter.bind(this),
              filePath: this.filePath,
              fileTypeConfig: this.fileTypeConfig,
              fileType: this.fileType,
              linebreaks: this.linebreaks
            };
          }
        }, {
          key: "render",
          value: function render(to) {
            this.filePath = to;
            var options = this.getOptions();
            options.resolved = this.scopeManager.resolved;
            options.scopeManager = this.scopeManager;
            options.render = _render;
            options.joinUncorrupt = joinUncorrupt;
            var _render2 = _render(options), errors = _render2.errors, parts = _render2.parts;
            if (errors.length > 0) {
              this.allErrors = errors;
              this.errorChecker(errors);
              return this;
            }
            this.content = postrender(parts, options);
            this.setModules({
              inspect: {
                filePath: this.filePath,
                content: this.content
              }
            });
            return this;
          }
        }]);
      }();
    }
  });

  // node_modules/docxtemplater/js/modules/loop.js
  var require_loop = __commonJS({
    "node_modules/docxtemplater/js/modules/loop.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
      }
      function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _iterableToArray(iter) {
        if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
          return Array.from(iter);
      }
      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr))
          return _arrayLikeToArray(arr);
      }
      function ownKeys(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t.push.apply(t, o);
        }
        return t;
      }
      function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
            _defineProperty(e, r2, t[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
          });
        }
        return e;
      }
      function _defineProperty(obj, key, value) {
        key = _toPropertyKey(key);
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o, minLen) {
        if (!o)
          return;
        if (typeof o === "string")
          return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor)
          n = o.constructor.name;
        if (n === "Map" || n === "Set")
          return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return _arrayLikeToArray(o, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++)
          arr2[i] = arr[i];
        return arr2;
      }
      function _iterableToArrayLimit(r, l) {
        var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t) {
          var e, n, i, u, a = [], f = true, o = false;
          try {
            if (i = (t = t.call(r)).next, 0 === l) {
              if (Object(t) !== t)
                return;
              f = false;
            } else
              for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true)
                ;
          } catch (r2) {
            o = true, n = r2;
          } finally {
            try {
              if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u))
                return;
            } finally {
              if (o)
                throw n;
            }
          }
          return a;
        }
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr;
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var _require = require_doc_utils();
      var chunkBy = _require.chunkBy;
      var last = _require.last;
      var isParagraphStart = _require.isParagraphStart;
      var isModule = _require.isModule;
      var isParagraphEnd = _require.isParagraphEnd;
      var isContent = _require.isContent;
      var startsWith = _require.startsWith;
      var isTagEnd = _require.isTagEnd;
      var isTagStart = _require.isTagStart;
      var getSingleAttribute = _require.getSingleAttribute;
      var setSingleAttribute = _require.setSingleAttribute;
      var filetypes = require_filetypes();
      var wrapper = require_module_wrapper();
      var moduleName = "loop";
      function hasContent(parts) {
        return parts.some(function(part) {
          return isContent(part);
        });
      }
      function getFirstMeaningFulPart(parsed) {
        for (var i = 0, len = parsed.length; i < len; i++) {
          if (parsed[i].type !== "content") {
            return parsed[i];
          }
        }
        return null;
      }
      function isInsideParagraphLoop(part) {
        var firstMeaningfulPart = getFirstMeaningFulPart(part.subparsed);
        return firstMeaningfulPart != null && firstMeaningfulPart.tag !== "w:t";
      }
      function getPageBreakIfApplies(part) {
        return part.hasPageBreak && isInsideParagraphLoop(part) ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' : "";
      }
      function isEnclosedByParagraphs(parsed) {
        return parsed.length && isParagraphStart(parsed[0]) && isParagraphEnd(last(parsed));
      }
      function getOffset(chunk) {
        return hasContent(chunk) ? 0 : chunk.length;
      }
      function addPageBreakAtEnd(subRendered) {
        var j = subRendered.parts.length - 1;
        if (subRendered.parts[j] === "</w:p>") {
          subRendered.parts.splice(j, 0, '<w:r><w:br w:type="page"/></w:r>');
        } else {
          subRendered.parts.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
        }
      }
      function addPageBreakAtBeginning(subRendered) {
        subRendered.parts.unshift('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
      }
      function isContinuous(parts) {
        return parts.some(function(part) {
          return isTagStart("w:type", part) && part.value.indexOf("continuous") !== -1;
        });
      }
      function isNextPage(parts) {
        return parts.some(function(part) {
          return isTagStart("w:type", part) && part.value.indexOf('w:val="nextPage"') !== -1;
        });
      }
      function addSectionBefore(parts, sect) {
        return ["<w:p><w:pPr>".concat(sect.map(function(_ref) {
          var value = _ref.value;
          return value;
        }).join(""), "</w:pPr></w:p>")].concat(parts);
      }
      function addContinuousType(parts) {
        var stop = false;
        var inSectPr = false;
        return parts.reduce(function(result, part) {
          if (stop === false && startsWith(part, "<w:sectPr")) {
            inSectPr = true;
          }
          if (inSectPr) {
            if (startsWith(part, "<w:type")) {
              stop = true;
            }
            if (stop === false && startsWith(part, "</w:sectPr")) {
              result.push('<w:type w:val="continuous"/>');
            }
          }
          result.push(part);
          return result;
        }, []);
      }
      function dropHeaderFooterRefs(parts) {
        return parts.filter(function(text) {
          return !startsWith(text, "<w:headerReference") && !startsWith(text, "<w:footerReference");
        });
      }
      function hasPageBreak(chunk) {
        return chunk.some(function(part) {
          return part.tag === "w:br" && part.value.indexOf('w:type="page"') !== -1;
        });
      }
      function hasImage(chunk) {
        return chunk.some(function(_ref2) {
          var tag = _ref2.tag;
          return tag === "w:drawing";
        });
      }
      function getSectPr(chunks) {
        var collectSectPr = false;
        var sectPrs = [];
        chunks.forEach(function(part) {
          if (isTagStart("w:sectPr", part)) {
            sectPrs.push([]);
            collectSectPr = true;
          }
          if (collectSectPr) {
            sectPrs[sectPrs.length - 1].push(part);
          }
          if (isTagEnd("w:sectPr", part)) {
            collectSectPr = false;
          }
        });
        return sectPrs;
      }
      function getSectPrHeaderFooterChangeCount(chunks) {
        var collectSectPr = false;
        var sectPrCount = 0;
        chunks.forEach(function(part) {
          if (isTagStart("w:sectPr", part)) {
            collectSectPr = true;
          }
          if (collectSectPr) {
            if (part.tag === "w:headerReference" || part.tag === "w:footerReference") {
              sectPrCount++;
              collectSectPr = false;
            }
          }
          if (isTagEnd("w:sectPr", part)) {
            collectSectPr = false;
          }
        });
        return sectPrCount;
      }
      function getLastSectPr(parsed) {
        var sectPr = [];
        var inSectPr = false;
        for (var i = parsed.length - 1; i >= 0; i--) {
          var part = parsed[i];
          if (isTagEnd("w:sectPr", part)) {
            inSectPr = true;
          }
          if (isTagStart("w:sectPr", part)) {
            sectPr.unshift(part.value);
            inSectPr = false;
          }
          if (inSectPr) {
            sectPr.unshift(part.value);
          }
          if (isParagraphStart(part)) {
            if (sectPr.length > 0) {
              return sectPr.join("");
            }
            break;
          }
        }
        return "";
      }
      var LoopModule = /* @__PURE__ */ function() {
        function LoopModule2() {
          _classCallCheck(this, LoopModule2);
          this.name = "LoopModule";
          this.inXfrm = false;
          this.totalSectPr = 0;
          this.prefix = {
            start: "#",
            end: "/",
            dash: /^-([^\s]+)\s(.+)/,
            inverted: "^"
          };
        }
        return _createClass(LoopModule2, [{
          key: "optionsTransformer",
          value: function optionsTransformer(opts, docxtemplater) {
            this.docxtemplater = docxtemplater;
            return opts;
          }
        }, {
          key: "preparse",
          value: function preparse(parsed, _ref3) {
            var contentType = _ref3.contentType;
            if (filetypes.main.indexOf(contentType) !== -1) {
              this.sects = getSectPr(parsed);
            }
          }
        }, {
          key: "matchers",
          value: function matchers() {
            var module2 = moduleName;
            return [[this.prefix.start, module2, {
              expandTo: "auto",
              location: "start",
              inverted: false
            }], [this.prefix.inverted, module2, {
              expandTo: "auto",
              location: "start",
              inverted: true
            }], [this.prefix.end, module2, {
              location: "end"
            }], [this.prefix.dash, module2, function(_ref4) {
              var _ref5 = _slicedToArray(_ref4, 3), expandTo = _ref5[1], value = _ref5[2];
              return {
                location: "start",
                inverted: false,
                expandTo,
                value
              };
            }]];
          }
        }, {
          key: "getTraits",
          value: function getTraits(traitName, parsed) {
            if (traitName !== "expandPair") {
              return;
            }
            return parsed.reduce(function(tags, part, offset) {
              if (isModule(part, moduleName) && part.subparsed == null) {
                tags.push({
                  part,
                  offset
                });
              }
              return tags;
            }, []);
          }
        }, {
          key: "postparse",
          value: function postparse(parsed, _ref6) {
            var basePart = _ref6.basePart;
            if (basePart && this.docxtemplater.fileType === "docx" && parsed.length > 0) {
              basePart.sectPrCount = getSectPrHeaderFooterChangeCount(parsed);
              this.totalSectPr += basePart.sectPrCount;
              var sects = this.sects;
              sects.some(function(sect, index) {
                if (basePart.lIndex < sect[0].lIndex) {
                  if (index + 1 < sects.length && isContinuous(sects[index + 1])) {
                    basePart.addContinuousType = true;
                  }
                  return true;
                }
                if (parsed[0].lIndex < sect[0].lIndex && sect[0].lIndex < basePart.lIndex) {
                  if (isNextPage(sects[index])) {
                    basePart.addNextPage = {
                      index
                    };
                  }
                  return true;
                }
              });
              basePart.lastParagrapSectPr = getLastSectPr(parsed);
            }
            if (!basePart || basePart.expandTo !== "auto" || basePart.module !== moduleName || !isEnclosedByParagraphs(parsed)) {
              return parsed;
            }
            basePart.paragraphLoop = true;
            var level = 0;
            var chunks = chunkBy(parsed, function(p) {
              if (isParagraphStart(p)) {
                level++;
                if (level === 1) {
                  return "start";
                }
              }
              if (isParagraphEnd(p)) {
                level--;
                if (level === 0) {
                  return "end";
                }
              }
              return null;
            });
            var firstChunk = chunks[0];
            var lastChunk = last(chunks);
            var firstOffset = getOffset(firstChunk);
            var lastOffset = getOffset(lastChunk);
            basePart.hasPageBreakBeginning = hasPageBreak(firstChunk);
            basePart.hasPageBreak = hasPageBreak(lastChunk);
            if (hasImage(firstChunk)) {
              firstOffset = 0;
            }
            if (hasImage(lastChunk)) {
              lastOffset = 0;
            }
            return parsed.slice(firstOffset, parsed.length - lastOffset);
          }
        }, {
          key: "resolve",
          value: function resolve(part, options) {
            if (!isModule(part, moduleName)) {
              return null;
            }
            var sm = options.scopeManager;
            var promisedValue = sm.getValueAsync(part.value, {
              part
            });
            var promises = [];
            function loopOver(scope, i, length) {
              var scopeManager = sm.createSubScopeManager(scope, part.value, i, part, length);
              promises.push(options.resolve(_objectSpread(_objectSpread({}, options), {}, {
                compiled: part.subparsed,
                tags: {},
                scopeManager
              })));
            }
            var errorList = [];
            return promisedValue.then(function(values) {
              return new Promise(function(resolve2) {
                if (values instanceof Array) {
                  Promise.all(values).then(resolve2);
                } else {
                  resolve2(values);
                }
              }).then(function(values2) {
                sm.loopOverValue(values2, loopOver, part.inverted);
                return Promise.all(promises).then(function(r) {
                  return r.map(function(_ref7) {
                    var resolved = _ref7.resolved, errors = _ref7.errors;
                    errorList.push.apply(errorList, _toConsumableArray(errors));
                    return resolved;
                  });
                }).then(function(value) {
                  if (errorList.length > 0) {
                    throw errorList;
                  }
                  return value;
                });
              });
            });
          }
          // eslint-disable-next-line complexity
        }, {
          key: "render",
          value: function render(part, options) {
            if (part.tag === "p:xfrm") {
              this.inXfrm = part.position === "start";
            }
            if (part.tag === "a:ext" && this.inXfrm) {
              this.lastExt = part;
              return part;
            }
            if (!isModule(part, moduleName)) {
              return null;
            }
            var totalValue = [];
            var errors = [];
            var heightOffset = 0;
            var self2 = this;
            var firstTag = part.subparsed[0];
            var tagHeight = 0;
            if ((firstTag === null || firstTag === void 0 ? void 0 : firstTag.tag) === "a:tr") {
              tagHeight = +getSingleAttribute(firstTag.value, "h");
            }
            heightOffset -= tagHeight;
            var a16RowIdOffset = 0;
            var insideParagraphLoop = isInsideParagraphLoop(part);
            function loopOver(scope, i, length) {
              heightOffset += tagHeight;
              var scopeManager = options.scopeManager.createSubScopeManager(scope, part.value, i, part, length);
              part.subparsed.forEach(function(pp) {
                if (isTagStart("a16:rowId", pp)) {
                  var val = +getSingleAttribute(pp.value, "val") + a16RowIdOffset;
                  a16RowIdOffset = 1;
                  pp.value = setSingleAttribute(pp.value, "val", val);
                }
              });
              var subRendered = options.render(_objectSpread(_objectSpread({}, options), {}, {
                compiled: part.subparsed,
                tags: {},
                scopeManager
              }));
              if (part.hasPageBreak && i === length - 1 && insideParagraphLoop) {
                addPageBreakAtEnd(subRendered);
              }
              var isNotFirst = scopeManager.scopePathItem.some(function(i2) {
                return i2 !== 0;
              });
              if (isNotFirst) {
                if (part.sectPrCount === 1) {
                  subRendered.parts = dropHeaderFooterRefs(subRendered.parts);
                }
                if (part.addContinuousType) {
                  subRendered.parts = addContinuousType(subRendered.parts);
                }
              } else if (part.addNextPage) {
                subRendered.parts = addSectionBefore(subRendered.parts, self2.sects[part.addNextPage.index]);
              }
              if (part.addNextPage) {
                addPageBreakAtEnd(subRendered);
              }
              if (part.hasPageBreakBeginning && insideParagraphLoop) {
                addPageBreakAtBeginning(subRendered);
              }
              for (var _i = 0, len = subRendered.parts.length; _i < len; _i++) {
                totalValue.push(subRendered.parts[_i]);
              }
              Array.prototype.push.apply(errors, subRendered.errors);
            }
            var result = options.scopeManager.loopOver(part.value, loopOver, part.inverted, {
              part
            });
            if (result === false) {
              if (part.lastParagrapSectPr) {
                if (part.paragraphLoop) {
                  return {
                    value: "<w:p><w:pPr>".concat(part.lastParagrapSectPr, "</w:pPr></w:p>")
                  };
                }
                return {
                  value: "</w:t></w:r></w:p><w:p><w:pPr>".concat(part.lastParagrapSectPr, "</w:pPr><w:r><w:t>")
                };
              }
              return {
                value: getPageBreakIfApplies(part) || "",
                errors
              };
            }
            if (heightOffset !== 0) {
              var cy = +getSingleAttribute(this.lastExt.value, "cy");
              this.lastExt.value = setSingleAttribute(this.lastExt.value, "cy", cy + heightOffset);
            }
            return {
              value: options.joinUncorrupt(totalValue, _objectSpread(_objectSpread({}, options), {}, {
                basePart: part
              })),
              errors
            };
          }
        }]);
      }();
      module.exports = function() {
        return wrapper(new LoopModule());
      };
    }
  });

  // node_modules/docxtemplater/js/modules/space-preserve.js
  var require_space_preserve = __commonJS({
    "node_modules/docxtemplater/js/modules/space-preserve.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var wrapper = require_module_wrapper();
      var _require = require_doc_utils();
      var isTextStart = _require.isTextStart;
      var isTextEnd = _require.isTextEnd;
      var endsWith = _require.endsWith;
      var startsWith = _require.startsWith;
      var wTpreserve = '<w:t xml:space="preserve">';
      var wTpreservelen = wTpreserve.length;
      var wtEnd = "</w:t>";
      var wtEndlen = wtEnd.length;
      function isWtStart(part) {
        return isTextStart(part) && part.tag === "w:t";
      }
      function addXMLPreserve(chunk, index) {
        var tag = chunk[index].value;
        if (chunk[index + 1].value === "</w:t>") {
          return tag;
        }
        if (tag.indexOf('xml:space="preserve"') !== -1) {
          return tag;
        }
        return tag.substr(0, tag.length - 1) + ' xml:space="preserve">';
      }
      function isInsideLoop(meta, chunk) {
        return meta && meta.basePart && chunk.length > 1;
      }
      var SpacePreserve = /* @__PURE__ */ function() {
        function SpacePreserve2() {
          _classCallCheck(this, SpacePreserve2);
          this.name = "SpacePreserveModule";
        }
        return _createClass(SpacePreserve2, [{
          key: "postparse",
          value: function postparse(postparsed, meta) {
            var chunk = [], inTextTag = false, endLindex = 0, lastTextTag = 0;
            function isStartingPlaceHolder(part, chunk2) {
              return part.type === "placeholder" && chunk2.length > 1;
            }
            var result = postparsed.reduce(function(postparsed2, part) {
              if (isWtStart(part)) {
                inTextTag = true;
                lastTextTag = chunk.length;
              }
              if (!inTextTag) {
                postparsed2.push(part);
                return postparsed2;
              }
              chunk.push(part);
              if (isInsideLoop(meta, chunk)) {
                endLindex = meta.basePart.endLindex;
                chunk[0].value = addXMLPreserve(chunk, 0);
              }
              if (isStartingPlaceHolder(part, chunk)) {
                chunk[lastTextTag].value = addXMLPreserve(chunk, lastTextTag);
                endLindex = part.endLindex;
              }
              if (isTextEnd(part) && part.lIndex > endLindex) {
                if (endLindex !== 0) {
                  chunk[lastTextTag].value = addXMLPreserve(chunk, lastTextTag);
                }
                Array.prototype.push.apply(postparsed2, chunk);
                chunk = [];
                inTextTag = false;
                endLindex = 0;
                lastTextTag = 0;
              }
              return postparsed2;
            }, []);
            Array.prototype.push.apply(result, chunk);
            return result;
          }
        }, {
          key: "postrender",
          value: function postrender(parts) {
            var lastNonEmpty = "";
            var lastNonEmptyIndex = 0;
            for (var i = 0, len = parts.length; i < len; i++) {
              var index = i;
              var p = parts[i];
              if (p === "") {
                continue;
              }
              if (endsWith(lastNonEmpty, wTpreserve) && startsWith(p, wtEnd)) {
                parts[lastNonEmptyIndex] = lastNonEmpty.substr(0, lastNonEmpty.length - wTpreservelen) + "<w:t/>";
                p = p.substr(wtEndlen);
              }
              lastNonEmpty = p;
              lastNonEmptyIndex = index;
              parts[i] = p;
            }
            return parts;
          }
        }]);
      }();
      module.exports = function() {
        return wrapper(new SpacePreserve());
      };
    }
  });

  // node_modules/docxtemplater/js/modules/rawxml.js
  var require_rawxml = __commonJS({
    "node_modules/docxtemplater/js/modules/rawxml.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var traits = require_traits();
      var _require = require_doc_utils();
      var isContent = _require.isContent;
      var _require2 = require_errors();
      var throwRawTagShouldBeOnlyTextInParagraph = _require2.throwRawTagShouldBeOnlyTextInParagraph;
      var getInvalidRawXMLValueException = _require2.getInvalidRawXMLValueException;
      var moduleName = "rawxml";
      var wrapper = require_module_wrapper();
      function getInner(_ref) {
        var part = _ref.part, left = _ref.left, right = _ref.right, postparsed = _ref.postparsed, index = _ref.index;
        var paragraphParts = postparsed.slice(left + 1, right);
        paragraphParts.forEach(function(p, i) {
          if (i === index - left - 1) {
            return;
          }
          if (isContent(p)) {
            throwRawTagShouldBeOnlyTextInParagraph({
              paragraphParts,
              part
            });
          }
        });
        return part;
      }
      var RawXmlModule = /* @__PURE__ */ function() {
        function RawXmlModule2() {
          _classCallCheck(this, RawXmlModule2);
          this.name = "RawXmlModule";
          this.prefix = "@";
        }
        return _createClass(RawXmlModule2, [{
          key: "optionsTransformer",
          value: function optionsTransformer(options, docxtemplater) {
            this.fileTypeConfig = docxtemplater.fileTypeConfig;
            return options;
          }
        }, {
          key: "matchers",
          value: function matchers() {
            return [[this.prefix, moduleName]];
          }
        }, {
          key: "postparse",
          value: function postparse(postparsed) {
            return traits.expandToOne(postparsed, {
              moduleName,
              getInner,
              expandTo: this.fileTypeConfig.tagRawXml,
              error: {
                message: "Raw tag not in paragraph",
                id: "raw_tag_outerxml_invalid",
                explanation: function explanation(part) {
                  return 'The tag "'.concat(part.value, '" is not inside a paragraph, putting raw tags inside an inline loop is disallowed.');
                }
              }
            });
          }
        }, {
          key: "render",
          value: function render(part, options) {
            if (part.module !== moduleName) {
              return null;
            }
            var value;
            var errors = [];
            try {
              value = options.scopeManager.getValue(part.value, {
                part
              });
              if (value == null) {
                value = options.nullGetter(part);
              }
            } catch (e) {
              errors.push(e);
              return {
                errors
              };
            }
            value = value ? value : "";
            if (typeof value === "string") {
              return {
                value
              };
            }
            return {
              errors: [getInvalidRawXMLValueException({
                tag: part.value,
                value,
                offset: part.offset
              })]
            };
          }
        }]);
      }();
      module.exports = function() {
        return wrapper(new RawXmlModule());
      };
    }
  });

  // node_modules/docxtemplater/js/merge-sort.js
  var require_merge_sort = __commonJS({
    "node_modules/docxtemplater/js/merge-sort.js"(exports, module) {
      "use strict";
      function getMinFromArrays(arrays, state) {
        var minIndex = -1;
        for (var i = 0, l = arrays.length; i < l; i++) {
          if (state[i] >= arrays[i].length) {
            continue;
          }
          if (minIndex === -1 || arrays[i][state[i]].offset < arrays[minIndex][state[minIndex]].offset) {
            minIndex = i;
          }
        }
        return minIndex;
      }
      module.exports = function(arrays) {
        var totalLength = arrays.reduce(function(sum, array) {
          return sum + array.length;
        }, 0);
        arrays = arrays.filter(function(array) {
          return array.length > 0;
        });
        var resultArray = new Array(totalLength);
        var state = arrays.map(function() {
          return 0;
        });
        for (var i = 0; i < totalLength; i++) {
          var arrayIndex = getMinFromArrays(arrays, state);
          resultArray[i] = arrays[arrayIndex][state[arrayIndex]];
          state[arrayIndex]++;
        }
        return resultArray;
      };
    }
  });

  // node_modules/docxtemplater/js/modules/expand-pair-trait.js
  var require_expand_pair_trait = __commonJS({
    "node_modules/docxtemplater/js/modules/expand-pair-trait.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var traitName = "expandPair";
      var mergeSort = require_merge_sort();
      var _require = require_doc_utils();
      var getLeft = _require.getLeft;
      var getRight = _require.getRight;
      var wrapper = require_module_wrapper();
      var _require2 = require_traits();
      var getExpandToDefault = _require2.getExpandToDefault;
      var _require3 = require_errors();
      var getUnmatchedLoopException = _require3.getUnmatchedLoopException;
      var getClosingTagNotMatchOpeningTag = _require3.getClosingTagNotMatchOpeningTag;
      var getUnbalancedLoopException = _require3.getUnbalancedLoopException;
      function getOpenCountChange(part) {
        switch (part.location) {
          case "start":
            return 1;
          case "end":
            return -1;
        }
      }
      function match(start, end) {
        return start != null && end != null && (start.part.location === "start" && end.part.location === "end" && start.part.value === end.part.value || end.part.value === "");
      }
      function transformer(traits) {
        var i = 0;
        var errors = [];
        while (i < traits.length) {
          var part = traits[i].part;
          if (part.location === "end") {
            if (i === 0) {
              traits.splice(0, 1);
              errors.push(getUnmatchedLoopException(part));
              return {
                traits,
                errors
              };
            }
            var endIndex = i;
            var startIndex = i - 1;
            var offseter = 1;
            if (match(traits[startIndex], traits[endIndex])) {
              traits.splice(endIndex, 1);
              traits.splice(startIndex, 1);
              return {
                errors,
                traits
              };
            }
            while (offseter < 50) {
              var startCandidate = traits[startIndex - offseter];
              var endCandidate = traits[endIndex + offseter];
              if (match(startCandidate, traits[endIndex])) {
                traits.splice(endIndex, 1);
                traits.splice(startIndex - offseter, 1);
                return {
                  errors,
                  traits
                };
              }
              if (match(traits[startIndex], endCandidate)) {
                traits.splice(endIndex + offseter, 1);
                traits.splice(startIndex, 1);
                return {
                  errors,
                  traits
                };
              }
              offseter++;
            }
            errors.push(getClosingTagNotMatchOpeningTag({
              tags: [traits[startIndex].part, traits[endIndex].part]
            }));
            traits.splice(endIndex, 1);
            traits.splice(startIndex, 1);
            return {
              traits,
              errors
            };
          }
          i++;
        }
        traits.forEach(function(_ref) {
          var part2 = _ref.part;
          errors.push(getUnmatchedLoopException(part2));
        });
        return {
          traits: [],
          errors
        };
      }
      function getPairs(traits) {
        var levelTraits = {};
        var errors = [];
        var pairs = [];
        var transformedTraits = [];
        for (var i = 0; i < traits.length; i++) {
          transformedTraits.push(traits[i]);
        }
        while (transformedTraits.length > 0) {
          var result = transformer(transformedTraits);
          errors = errors.concat(result.errors);
          transformedTraits = result.traits;
        }
        if (errors.length > 0) {
          return {
            pairs,
            errors
          };
        }
        var countOpen = 0;
        for (var _i = 0; _i < traits.length; _i++) {
          var currentTrait = traits[_i];
          var part = currentTrait.part;
          var change = getOpenCountChange(part);
          countOpen += change;
          if (change === 1) {
            levelTraits[countOpen] = currentTrait;
          } else {
            var startTrait = levelTraits[countOpen + 1];
            if (countOpen === 0) {
              pairs = pairs.concat([[startTrait, currentTrait]]);
            }
          }
          countOpen = countOpen >= 0 ? countOpen : 0;
        }
        return {
          pairs,
          errors
        };
      }
      var ExpandPairTrait = /* @__PURE__ */ function() {
        function ExpandPairTrait2() {
          _classCallCheck(this, ExpandPairTrait2);
          this.name = "ExpandPairTrait";
        }
        return _createClass(ExpandPairTrait2, [{
          key: "optionsTransformer",
          value: function optionsTransformer(options, docxtemplater) {
            this.expandTags = docxtemplater.fileTypeConfig.expandTags.concat(docxtemplater.options.paragraphLoop ? docxtemplater.fileTypeConfig.onParagraphLoop : []);
            return options;
          }
        }, {
          key: "postparse",
          value: function postparse(postparsed, _ref2) {
            var _this = this;
            var getTraits = _ref2.getTraits, _postparse = _ref2.postparse, fileType = _ref2.fileType;
            var traits = getTraits(traitName, postparsed);
            traits = traits.map(function(trait) {
              return trait || [];
            });
            traits = mergeSort(traits);
            var _getPairs = getPairs(traits), pairs = _getPairs.pairs, errors = _getPairs.errors;
            var lastRight = 0;
            var lastPair = null;
            var expandedPairs = pairs.map(function(pair) {
              var expandTo = pair[0].part.expandTo;
              if (expandTo === "auto" && fileType !== "text") {
                var result = getExpandToDefault(postparsed, pair, _this.expandTags);
                if (result.error) {
                  errors.push(result.error);
                }
                expandTo = result.value;
              }
              if (!expandTo || fileType === "text") {
                var _left = pair[0].offset;
                var _right = pair[1].offset;
                if (_left < lastRight) {
                  errors.push(getUnbalancedLoopException(pair, lastPair));
                }
                lastPair = pair;
                lastRight = _right;
                return [_left, _right];
              }
              var left, right;
              try {
                left = getLeft(postparsed, expandTo, pair[0].offset);
              } catch (e) {
                errors.push(e);
              }
              try {
                right = getRight(postparsed, expandTo, pair[1].offset);
              } catch (e) {
                errors.push(e);
              }
              if (left < lastRight) {
                errors.push(getUnbalancedLoopException(pair, lastPair));
              }
              lastRight = right;
              lastPair = pair;
              return [left, right];
            });
            if (errors.length > 0) {
              return {
                postparsed,
                errors
              };
            }
            var currentPairIndex = 0;
            var innerParts;
            var newParsed = postparsed.reduce(function(newParsed2, part, i) {
              var inPair = currentPairIndex < pairs.length && expandedPairs[currentPairIndex][0] <= i && i <= expandedPairs[currentPairIndex][1];
              var pair = pairs[currentPairIndex];
              var expandedPair = expandedPairs[currentPairIndex];
              if (!inPair) {
                newParsed2.push(part);
                return newParsed2;
              }
              if (expandedPair[0] === i) {
                innerParts = [];
              }
              if (pair[0].offset !== i && pair[1].offset !== i) {
                innerParts.push(part);
              }
              if (expandedPair[1] === i) {
                var basePart = postparsed[pair[0].offset];
                basePart.subparsed = _postparse(innerParts, {
                  basePart
                });
                basePart.endLindex = pair[1].part.lIndex;
                delete basePart.location;
                delete basePart.expandTo;
                newParsed2.push(basePart);
                currentPairIndex++;
              }
              return newParsed2;
            }, []);
            return {
              postparsed: newParsed,
              errors
            };
          }
        }]);
      }();
      module.exports = function() {
        return wrapper(new ExpandPairTrait());
      };
    }
  });

  // node_modules/docxtemplater/js/modules/render.js
  var require_render2 = __commonJS({
    "node_modules/docxtemplater/js/modules/render.js"(exports, module) {
      "use strict";
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var wrapper = require_module_wrapper();
      var _require = require_errors();
      var getScopeCompilationError = _require.getScopeCompilationError;
      var _require2 = require_doc_utils();
      var utf8ToWord = _require2.utf8ToWord;
      var hasCorruptCharacters = _require2.hasCorruptCharacters;
      var _require3 = require_errors();
      var getCorruptCharactersException = _require3.getCorruptCharactersException;
      var _require4 = require_content_types();
      var settingsContentType = _require4.settingsContentType;
      var coreContentType = _require4.coreContentType;
      var appContentType = _require4.appContentType;
      var customContentType = _require4.customContentType;
      var ftprefix = {
        docx: "w",
        pptx: "a"
      };
      var Render = /* @__PURE__ */ function() {
        function Render2() {
          _classCallCheck(this, Render2);
          this.name = "Render";
          this.recordRun = false;
          this.recordedRun = [];
        }
        return _createClass(Render2, [{
          key: "optionsTransformer",
          value: function optionsTransformer(options, docxtemplater) {
            this.parser = docxtemplater.parser;
            this.fileType = docxtemplater.fileType;
            return options;
          }
        }, {
          key: "set",
          value: function set(obj) {
            if (obj.compiled) {
              this.compiled = obj.compiled;
            }
            if (obj.data != null) {
              this.data = obj.data;
            }
          }
        }, {
          key: "getRenderedMap",
          value: function getRenderedMap(mapper) {
            var _this = this;
            return Object.keys(this.compiled).reduce(function(mapper2, from) {
              mapper2[from] = {
                from,
                data: _this.data
              };
              return mapper2;
            }, mapper);
          }
        }, {
          key: "postparse",
          value: function postparse(postparsed, options) {
            var _this2 = this;
            var errors = [];
            postparsed.forEach(function(p) {
              if (p.type === "placeholder") {
                var tag = p.value;
                try {
                  options.cachedParsers[p.lIndex] = _this2.parser(tag, {
                    tag: p
                  });
                } catch (rootError) {
                  errors.push(getScopeCompilationError({
                    tag,
                    rootError,
                    offset: p.offset
                  }));
                }
              }
            });
            return {
              postparsed,
              errors
            };
          }
        }, {
          key: "render",
          value: function render(part, _ref) {
            var contentType = _ref.contentType, scopeManager = _ref.scopeManager, linebreaks = _ref.linebreaks, nullGetter = _ref.nullGetter, fileType = _ref.fileType;
            if (linebreaks && [settingsContentType, coreContentType, appContentType, customContentType].indexOf(contentType) !== -1) {
              linebreaks = false;
            }
            if (linebreaks) {
              this.recordRuns(part);
            }
            if (part.type !== "placeholder" || part.module) {
              return;
            }
            var value;
            try {
              value = scopeManager.getValue(part.value, {
                part
              });
            } catch (e) {
              return {
                errors: [e]
              };
            }
            if (value == null) {
              value = nullGetter(part);
            }
            if (hasCorruptCharacters(value)) {
              return {
                errors: [getCorruptCharactersException({
                  tag: part.value,
                  value,
                  offset: part.offset
                })]
              };
            }
            if (fileType === "text") {
              return {
                value
              };
            }
            return {
              value: linebreaks && typeof value === "string" ? this.renderLineBreaks(value) : utf8ToWord(value)
            };
          }
        }, {
          key: "recordRuns",
          value: function recordRuns(part) {
            if (part.tag === "".concat(ftprefix[this.fileType], ":r")) {
              this.recordedRun = [];
            } else if (part.tag === "".concat(ftprefix[this.fileType], ":rPr")) {
              if (part.position === "start") {
                this.recordRun = true;
                this.recordedRun = [part.value];
              }
              if (part.position === "end" || part.position === "selfclosing") {
                this.recordedRun.push(part.value);
                this.recordRun = false;
              }
            } else if (this.recordRun) {
              this.recordedRun.push(part.value);
            }
          }
        }, {
          key: "renderLineBreaks",
          value: function renderLineBreaks(value) {
            var _this3 = this;
            var p = ftprefix[this.fileType];
            var br = this.fileType === "docx" ? "<w:r><w:br/></w:r>" : "<a:br/>";
            var lines = value.split("\n");
            var runprops = this.recordedRun.join("");
            return lines.map(function(line) {
              return utf8ToWord(line);
            }).reduce(function(result, line, i) {
              result.push(line);
              if (i < lines.length - 1) {
                result.push("</".concat(p, ":t></").concat(p, ":r>").concat(br, "<").concat(p, ":r>").concat(runprops, "<").concat(p, ":t").concat(_this3.fileType === "docx" ? ' xml:space="preserve"' : "", ">"));
              }
              return result;
            }, []);
          }
        }]);
      }();
      module.exports = function() {
        return wrapper(new Render());
      };
    }
  });

  // node_modules/docxtemplater/js/file-type-config.js
  var require_file_type_config = __commonJS({
    "node_modules/docxtemplater/js/file-type-config.js"(exports, module) {
      "use strict";
      var loopModule = require_loop();
      var spacePreserveModule = require_space_preserve();
      var rawXmlModule = require_rawxml();
      var expandPairTrait = require_expand_pair_trait();
      var render = require_render2();
      function DocXFileTypeConfig() {
        return {
          getTemplatedFiles: function getTemplatedFiles() {
            return [];
          },
          textPath: function textPath(doc) {
            return doc.textTarget;
          },
          tagsXmlTextArray: ["Company", "HyperlinkBase", "Manager", "cp:category", "cp:keywords", "dc:creator", "dc:description", "dc:subject", "dc:title", "cp:contentStatus", "w:t", "m:t", "vt:lpstr", "vt:lpwstr"],
          tagsXmlLexedArray: ["w:proofState", "w:tc", "w:tr", "w:tbl", "w:body", "w:document", "w:p", "w:r", "w:br", "w:rPr", "w:pPr", "w:spacing", "w:sdtContent", "w:sdt", "w:drawing", "w:sectPr", "w:type", "w:headerReference", "w:footerReference", "w:bookmarkStart", "w:bookmarkEnd", "w:commentRangeStart", "w:commentRangeEnd", "w:commentReference"],
          droppedTagsInsidePlaceholder: ["w:p", "w:br", "w:bookmarkStart", "w:bookmarkEnd"],
          expandTags: [{
            contains: "w:tc",
            expand: "w:tr"
          }],
          onParagraphLoop: [{
            contains: "w:p",
            expand: "w:p",
            onlyTextInTag: true
          }],
          tagRawXml: "w:p",
          baseModules: [loopModule, spacePreserveModule, expandPairTrait, rawXmlModule, render],
          tagShouldContain: [{
            tag: "w:tbl",
            shouldContain: ["w:tr"],
            drop: true
          }, {
            tag: "w:tc",
            shouldContain: ["w:p"],
            value: "<w:p></w:p>"
          }, {
            tag: "w:sdtContent",
            shouldContain: ["w:p", "w:r", "w:commentRangeStart", "w:sdt"],
            value: "<w:p></w:p>"
          }]
        };
      }
      function PptXFileTypeConfig() {
        return {
          getTemplatedFiles: function getTemplatedFiles() {
            return [];
          },
          textPath: function textPath(doc) {
            return doc.textTarget;
          },
          tagsXmlTextArray: ["Company", "HyperlinkBase", "Manager", "cp:category", "cp:keywords", "dc:creator", "dc:description", "dc:subject", "dc:title", "a:t", "m:t", "vt:lpstr", "vt:lpwstr"],
          tagsXmlLexedArray: ["p:sp", "a:tc", "a:tr", "a:tbl", "a:graphicData", "a:p", "a:r", "a:rPr", "p:txBody", "a:txBody", "a:off", "a:ext", "p:graphicFrame", "p:xfrm", "a16:rowId", "a:endParaRPr"],
          droppedTagsInsidePlaceholder: ["a:p", "a:endParaRPr"],
          expandTags: [{
            contains: "a:tc",
            expand: "a:tr"
          }],
          onParagraphLoop: [{
            contains: "a:p",
            expand: "a:p",
            onlyTextInTag: true
          }],
          tagRawXml: "p:sp",
          baseModules: [loopModule, expandPairTrait, rawXmlModule, render],
          tagShouldContain: [{
            tag: "a:tbl",
            shouldContain: ["a:tr"],
            dropParent: "p:graphicFrame"
          }, {
            tag: "p:txBody",
            shouldContain: ["a:p"],
            value: "<a:p></a:p>"
          }, {
            tag: "a:txBody",
            shouldContain: ["a:p"],
            value: "<a:p></a:p>"
          }]
        };
      }
      module.exports = {
        docx: DocXFileTypeConfig,
        pptx: PptXFileTypeConfig
      };
    }
  });

  // node_modules/docxtemplater/js/docxtemplater.js
  var require_docxtemplater = __commonJS({
    "node_modules/docxtemplater/js/docxtemplater.js"(exports, module) {
      "use strict";
      var _excluded = ["modules"];
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      function _objectWithoutProperties(source, excluded) {
        if (source == null)
          return {};
        var target = _objectWithoutPropertiesLoose(source, excluded);
        var key, i;
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0)
              continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
              continue;
            target[key] = source[key];
          }
        }
        return target;
      }
      function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null)
          return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for (i = 0; i < sourceKeys.length; i++) {
          key = sourceKeys[i];
          if (excluded.indexOf(key) >= 0)
            continue;
          target[key] = source[key];
        }
        return target;
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", { writable: false });
        return Constructor;
      }
      function _toPropertyKey(t) {
        var i = _toPrimitive(t, "string");
        return "symbol" == _typeof(i) ? i : i + "";
      }
      function _toPrimitive(t, r) {
        if ("object" != _typeof(t) || !t)
          return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i = e.call(t, r || "default");
          if ("object" != _typeof(i))
            return i;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t);
      }
      var DocUtils = require_doc_utils();
      DocUtils.traits = require_traits();
      DocUtils.moduleWrapper = require_module_wrapper();
      var createScope = require_scope_manager();
      var _require = require_errors();
      var throwMultiError = _require.throwMultiError;
      var throwResolveBeforeCompile = _require.throwResolveBeforeCompile;
      var throwRenderInvalidTemplate = _require.throwRenderInvalidTemplate;
      var throwRenderTwice = _require.throwRenderTwice;
      var logErrors = require_error_logger();
      var collectContentTypes = require_collect_content_types();
      var ctXML = "[Content_Types].xml";
      var relsFile = "_rels/.rels";
      var commonModule = require_common();
      var Lexer = require_lexer();
      var defaults = DocUtils.defaults;
      var str2xml = DocUtils.str2xml;
      var xml2str = DocUtils.xml2str;
      var moduleWrapper = DocUtils.moduleWrapper;
      var concatArrays = DocUtils.concatArrays;
      var uniq = DocUtils.uniq;
      var getDuplicates = DocUtils.getDuplicates;
      var stableSort = DocUtils.stableSort;
      var _require2 = require_errors();
      var XTInternalError = _require2.XTInternalError;
      var throwFileTypeNotIdentified = _require2.throwFileTypeNotIdentified;
      var throwFileTypeNotHandled = _require2.throwFileTypeNotHandled;
      var throwApiVersionError = _require2.throwApiVersionError;
      var currentModuleApiVersion = [3, 39, 0];
      function dropUnsupportedFileTypesModules(dx) {
        dx.modules = dx.modules.filter(function(module2) {
          if (module2.supportedFileTypes) {
            if (!Array.isArray(module2.supportedFileTypes)) {
              throw new Error("The supportedFileTypes field of the module must be an array");
            }
            var isSupportedModule = module2.supportedFileTypes.indexOf(dx.fileType) !== -1;
            if (!isSupportedModule) {
              module2.on("detached");
            }
            return isSupportedModule;
          }
          return true;
        });
      }
      var Docxtemplater = /* @__PURE__ */ function() {
        function Docxtemplater2(zip) {
          var _this = this;
          var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$modules = _ref.modules, modules = _ref$modules === void 0 ? [] : _ref$modules, options = _objectWithoutProperties(_ref, _excluded);
          _classCallCheck(this, Docxtemplater2);
          if (!Array.isArray(modules)) {
            throw new Error("The modules argument of docxtemplater's constructor must be an array");
          }
          this.targets = [];
          this.rendered = false;
          this.scopeManagers = {};
          this.compiled = {};
          this.modules = [commonModule()];
          this.setOptions(options);
          modules.forEach(function(module2) {
            _this.attachModule(module2);
          });
          if (arguments.length > 0) {
            if (!zip || !zip.files || typeof zip.file !== "function") {
              throw new Error("The first argument of docxtemplater's constructor must be a valid zip file (jszip v2 or pizzip v3)");
            }
            this.loadZip(zip);
            this.compile();
            this.v4Constructor = true;
          }
        }
        return _createClass(Docxtemplater2, [{
          key: "verifyApiVersion",
          value: function verifyApiVersion(neededVersion) {
            neededVersion = neededVersion.split(".").map(function(i) {
              return parseInt(i, 10);
            });
            if (neededVersion.length !== 3) {
              throwApiVersionError("neededVersion is not a valid version", {
                neededVersion,
                explanation: "the neededVersion must be an array of length 3"
              });
            }
            if (neededVersion[0] !== currentModuleApiVersion[0]) {
              throwApiVersionError("The major api version do not match, you probably have to update docxtemplater with npm install --save docxtemplater", {
                neededVersion,
                currentModuleApiVersion,
                explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
              });
            }
            if (neededVersion[1] > currentModuleApiVersion[1]) {
              throwApiVersionError("The minor api version is not uptodate, you probably have to update docxtemplater with npm install --save docxtemplater", {
                neededVersion,
                currentModuleApiVersion,
                explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
              });
            }
            if (neededVersion[1] === currentModuleApiVersion[1] && neededVersion[2] > currentModuleApiVersion[2]) {
              throwApiVersionError("The patch api version is not uptodate, you probably have to update docxtemplater with npm install --save docxtemplater", {
                neededVersion,
                currentModuleApiVersion,
                explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
              });
            }
            return true;
          }
        }, {
          key: "setModules",
          value: function setModules(obj) {
            this.modules.forEach(function(module2) {
              module2.set(obj);
            });
          }
        }, {
          key: "sendEvent",
          value: function sendEvent(eventName) {
            this.modules.forEach(function(module2) {
              module2.on(eventName);
            });
          }
        }, {
          key: "attachModule",
          value: function attachModule(module2) {
            if (this.v4Constructor) {
              throw new XTInternalError("attachModule() should not be called manually when using the v4 constructor");
            }
            var moduleType = _typeof(module2);
            if (moduleType === "function") {
              throw new XTInternalError("Cannot attach a class/function as a module. Most probably you forgot to instantiate the module by using `new` on the module.");
            }
            if (!module2 || moduleType !== "object") {
              throw new XTInternalError("Cannot attachModule with a falsy value");
            }
            if (module2.requiredAPIVersion) {
              this.verifyApiVersion(module2.requiredAPIVersion);
            }
            if (module2.attached === true) {
              if (typeof module2.clone === "function") {
                module2 = module2.clone();
              } else {
                throw new Error('Cannot attach a module that was already attached : "'.concat(module2.name, '". The most likely cause is that you are instantiating the module at the root level, and using it for multiple instances of Docxtemplater'));
              }
            }
            module2.attached = true;
            var wrappedModule = moduleWrapper(module2);
            this.modules.push(wrappedModule);
            wrappedModule.on("attached");
            if (this.fileType) {
              dropUnsupportedFileTypesModules(this);
            }
            return this;
          }
        }, {
          key: "setOptions",
          value: function setOptions(options) {
            var _this2 = this;
            if (this.v4Constructor) {
              throw new Error("setOptions() should not be called manually when using the v4 constructor");
            }
            if (!options) {
              throw new Error("setOptions should be called with an object as first parameter");
            }
            this.options = {};
            Object.keys(defaults).forEach(function(key) {
              var defaultValue = defaults[key];
              _this2.options[key] = options[key] != null ? options[key] : _this2[key] || defaultValue;
              _this2[key] = _this2.options[key];
            });
            this.delimiters.start = DocUtils.utf8ToWord(this.delimiters.start);
            this.delimiters.end = DocUtils.utf8ToWord(this.delimiters.end);
            return this;
          }
        }, {
          key: "loadZip",
          value: function loadZip(zip) {
            if (this.v4Constructor) {
              throw new Error("loadZip() should not be called manually when using the v4 constructor");
            }
            if (zip.loadAsync) {
              throw new XTInternalError("Docxtemplater doesn't handle JSZip version >=3, please use pizzip");
            }
            this.zip = zip;
            this.updateFileTypeConfig();
            this.modules = concatArrays([this.fileTypeConfig.baseModules.map(function(moduleFunction) {
              return moduleFunction();
            }), this.modules]);
            dropUnsupportedFileTypesModules(this);
            return this;
          }
        }, {
          key: "precompileFile",
          value: function precompileFile(fileName) {
            var currentFile = this.createTemplateClass(fileName);
            currentFile.preparse();
            this.compiled[fileName] = currentFile;
          }
        }, {
          key: "compileFile",
          value: function compileFile(fileName) {
            this.compiled[fileName].parse();
          }
        }, {
          key: "getScopeManager",
          value: function getScopeManager(to, currentFile, tags) {
            if (!this.scopeManagers[to]) {
              this.scopeManagers[to] = createScope({
                tags,
                parser: this.parser,
                cachedParsers: currentFile.cachedParsers
              });
            }
            return this.scopeManagers[to];
          }
        }, {
          key: "resolveData",
          value: function resolveData(data) {
            var _this3 = this;
            var errors = [];
            if (!Object.keys(this.compiled).length) {
              throwResolveBeforeCompile();
            }
            return Promise.resolve(data).then(function(data2) {
              _this3.setData(data2);
              _this3.setModules({
                data: _this3.data,
                Lexer
              });
              _this3.mapper = _this3.modules.reduce(function(value, module2) {
                return module2.getRenderedMap(value);
              }, {});
              return Promise.all(Object.keys(_this3.mapper).map(function(to) {
                var _this3$mapper$to = _this3.mapper[to], from = _this3$mapper$to.from, data3 = _this3$mapper$to.data;
                return Promise.resolve(data3).then(function(data4) {
                  var currentFile = _this3.compiled[from];
                  currentFile.filePath = to;
                  currentFile.scopeManager = _this3.getScopeManager(to, currentFile, data4);
                  return currentFile.resolveTags(data4).then(function(result) {
                    currentFile.scopeManager.finishedResolving = true;
                    return result;
                  }, function(errs) {
                    Array.prototype.push.apply(errors, errs);
                  });
                });
              })).then(function(resolved) {
                if (errors.length !== 0) {
                  if (_this3.options.errorLogging) {
                    logErrors(errors, _this3.options.errorLogging);
                  }
                  throwMultiError(errors);
                }
                return concatArrays(resolved);
              });
            });
          }
        }, {
          key: "reorderModules",
          value: function reorderModules() {
            this.modules = stableSort(this.modules, function(m1, m2) {
              return (m2.priority || 0) - (m1.priority || 0);
            });
          }
        }, {
          key: "throwIfDuplicateModules",
          value: function throwIfDuplicateModules() {
            var duplicates = getDuplicates(this.modules.map(function(_ref2) {
              var name = _ref2.name;
              return name;
            }));
            if (duplicates.length > 0) {
              throw new XTInternalError('Detected duplicate module "'.concat(duplicates[0], '"'));
            }
          }
        }, {
          key: "compile",
          value: function compile() {
            var _this4 = this;
            this.updateFileTypeConfig();
            this.throwIfDuplicateModules();
            this.reorderModules();
            if (Object.keys(this.compiled).length) {
              return this;
            }
            this.options = this.modules.reduce(function(options, module2) {
              return module2.optionsTransformer(options, _this4);
            }, this.options);
            this.options.xmlFileNames = uniq(this.options.xmlFileNames);
            this.xmlDocuments = this.options.xmlFileNames.reduce(function(xmlDocuments, fileName) {
              var content = _this4.zip.files[fileName].asText();
              xmlDocuments[fileName] = str2xml(content);
              return xmlDocuments;
            }, {});
            this.setModules({
              zip: this.zip,
              xmlDocuments: this.xmlDocuments
            });
            this.getTemplatedFiles();
            this.templatedFiles.forEach(function(fileName) {
              if (_this4.zip.files[fileName] != null) {
                _this4.precompileFile(fileName);
              }
            });
            this.templatedFiles.forEach(function(fileName) {
              if (_this4.zip.files[fileName] != null) {
                _this4.compileFile(fileName);
              }
            });
            this.setModules({
              compiled: this.compiled
            });
            verifyErrors(this);
            return this;
          }
        }, {
          key: "getRelsTypes",
          value: function getRelsTypes() {
            var rootRels = this.zip.files[relsFile];
            var rootRelsXml = rootRels ? str2xml(rootRels.asText()) : null;
            var rootRelationships = rootRelsXml ? rootRelsXml.getElementsByTagName("Relationship") : [];
            var relsTypes = {};
            for (var i = 0, len = rootRelationships.length; i < len; i++) {
              var r = rootRelationships[i];
              relsTypes[r.getAttribute("Target")] = r.getAttribute("Type");
            }
            return relsTypes;
          }
        }, {
          key: "getContentTypes",
          value: function getContentTypes() {
            var contentTypes = this.zip.files[ctXML];
            var contentTypeXml = contentTypes ? str2xml(contentTypes.asText()) : null;
            var overrides = contentTypeXml ? contentTypeXml.getElementsByTagName("Override") : null;
            var defaults2 = contentTypeXml ? contentTypeXml.getElementsByTagName("Default") : null;
            return {
              overrides,
              defaults: defaults2,
              contentTypes,
              contentTypeXml
            };
          }
        }, {
          key: "updateFileTypeConfig",
          value: function updateFileTypeConfig() {
            var _this5 = this;
            var fileType;
            if (this.zip.files.mimetype) {
              fileType = "odt";
            }
            this.relsTypes = this.getRelsTypes();
            var _this$getContentTypes = this.getContentTypes(), overrides = _this$getContentTypes.overrides, defaults2 = _this$getContentTypes.defaults, contentTypes = _this$getContentTypes.contentTypes, contentTypeXml = _this$getContentTypes.contentTypeXml;
            if (contentTypeXml) {
              this.filesContentTypes = collectContentTypes(overrides, defaults2, this.zip);
              this.invertedContentTypes = DocUtils.invertMap(this.filesContentTypes);
              this.setModules({
                contentTypes: this.contentTypes,
                invertedContentTypes: this.invertedContentTypes
              });
            }
            this.modules.forEach(function(module2) {
              fileType = module2.getFileType({
                zip: _this5.zip,
                contentTypes,
                contentTypeXml,
                overrides,
                defaults: defaults2,
                doc: _this5
              }) || fileType;
            });
            if (fileType === "odt") {
              throwFileTypeNotHandled(fileType);
            }
            if (!fileType) {
              throwFileTypeNotIdentified(this.zip);
            }
            this.fileType = fileType;
            dropUnsupportedFileTypesModules(this);
            this.fileTypeConfig = this.options.fileTypeConfig || this.fileTypeConfig || Docxtemplater2.FileTypeConfig[this.fileType]();
            return this;
          }
        }, {
          key: "renderAsync",
          value: function renderAsync(data) {
            var _this6 = this;
            return this.resolveData(data).then(function() {
              return _this6.render();
            });
          }
        }, {
          key: "render",
          value: function render(data) {
            var _this7 = this;
            if (this.rendered) {
              throwRenderTwice();
            }
            this.rendered = true;
            this.compile();
            if (this.errors.length > 0) {
              throwRenderInvalidTemplate();
            }
            if (data) {
              this.setData(data);
            }
            this.setModules({
              data: this.data,
              Lexer
            });
            this.mapper = this.mapper || this.modules.reduce(function(value, module2) {
              return module2.getRenderedMap(value);
            }, {});
            Object.keys(this.mapper).forEach(function(to) {
              var _this7$mapper$to = _this7.mapper[to], from = _this7$mapper$to.from, data2 = _this7$mapper$to.data;
              var currentFile = _this7.compiled[from];
              currentFile.scopeManager = _this7.getScopeManager(to, currentFile, data2);
              currentFile.render(to);
              _this7.zip.file(to, currentFile.content, {
                createFolders: true
              });
            });
            verifyErrors(this);
            this.sendEvent("syncing-zip");
            this.syncZip();
            this.sendEvent("synced-zip");
            return this;
          }
        }, {
          key: "syncZip",
          value: function syncZip() {
            var _this8 = this;
            Object.keys(this.xmlDocuments).forEach(function(fileName) {
              _this8.zip.remove(fileName);
              var content = xml2str(_this8.xmlDocuments[fileName]);
              return _this8.zip.file(fileName, content, {
                createFolders: true
              });
            });
          }
        }, {
          key: "setData",
          value: function setData(data) {
            this.data = data;
            return this;
          }
        }, {
          key: "getZip",
          value: function getZip() {
            return this.zip;
          }
        }, {
          key: "createTemplateClass",
          value: function createTemplateClass(path) {
            var content = this.zip.files[path].asText();
            return this.createTemplateClassFromContent(content, path);
          }
        }, {
          key: "createTemplateClassFromContent",
          value: function createTemplateClassFromContent(content, filePath) {
            var _this9 = this;
            var xmltOptions = {
              filePath,
              contentType: this.filesContentTypes[filePath],
              relsType: this.relsTypes[filePath]
            };
            Object.keys(defaults).concat(["filesContentTypes", "fileTypeConfig", "fileType", "modules"]).forEach(function(key) {
              xmltOptions[key] = _this9[key];
            });
            return new Docxtemplater2.XmlTemplater(content, xmltOptions);
          }
        }, {
          key: "getFullText",
          value: function getFullText(path) {
            return this.createTemplateClass(path || this.fileTypeConfig.textPath(this)).getFullText();
          }
        }, {
          key: "getTemplatedFiles",
          value: function getTemplatedFiles() {
            var _this10 = this;
            this.templatedFiles = this.fileTypeConfig.getTemplatedFiles(this.zip);
            this.targets.forEach(function(target) {
              _this10.templatedFiles.push(target);
            });
            this.templatedFiles = uniq(this.templatedFiles);
            return this.templatedFiles;
          }
        }]);
      }();
      function verifyErrors(doc) {
        var compiled = doc.compiled;
        doc.errors = concatArrays(Object.keys(compiled).map(function(name) {
          return compiled[name].allErrors;
        }));
        if (doc.errors.length !== 0) {
          if (doc.options.errorLogging) {
            logErrors(doc.errors, doc.options.errorLogging);
          }
          throwMultiError(doc.errors);
        }
      }
      Docxtemplater.DocUtils = DocUtils;
      Docxtemplater.Errors = require_errors();
      Docxtemplater.XmlTemplater = require_xml_templater();
      Docxtemplater.FileTypeConfig = require_file_type_config();
      Docxtemplater.XmlMatcher = require_xml_matcher();
      module.exports = Docxtemplater;
      module.exports["default"] = Docxtemplater;
    }
  });

  // node_modules/filesaver.js/FileSaver.js
  var require_FileSaver = __commonJS({
    "node_modules/filesaver.js/FileSaver.js"(exports, module) {
      var saveAs = saveAs || function(view) {
        "use strict";
        if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
          return;
        }
        var doc = view.document, get_URL = function() {
          return view.URL || view.webkitURL || view;
        }, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"), can_use_save_link = "download" in save_link, click = function(node) {
          var event = new MouseEvent("click");
          node.dispatchEvent(event);
        }, is_safari = /constructor/i.test(view.HTMLElement) || view.safari, is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent), throw_outside = function(ex) {
          (view.setImmediate || view.setTimeout)(function() {
            throw ex;
          }, 0);
        }, force_saveable_type = "application/octet-stream", arbitrary_revoke_timeout = 1e3 * 40, revoke = function(file) {
          var revoker = function() {
            if (typeof file === "string") {
              get_URL().revokeObjectURL(file);
            } else {
              file.remove();
            }
          };
          setTimeout(revoker, arbitrary_revoke_timeout);
        }, dispatch = function(filesaver, event_types, event) {
          event_types = [].concat(event_types);
          var i = event_types.length;
          while (i--) {
            var listener = filesaver["on" + event_types[i]];
            if (typeof listener === "function") {
              try {
                listener.call(filesaver, event || filesaver);
              } catch (ex) {
                throw_outside(ex);
              }
            }
          }
        }, auto_bom = function(blob) {
          if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
            return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
          }
          return blob;
        }, FileSaver = function(blob, name, no_auto_bom) {
          if (!no_auto_bom) {
            blob = auto_bom(blob);
          }
          var filesaver = this, type = blob.type, force = type === force_saveable_type, object_url, dispatch_all = function() {
            dispatch(filesaver, "writestart progress write writeend".split(" "));
          }, fs_error = function() {
            if ((is_chrome_ios || force && is_safari) && view.FileReader) {
              var reader = new FileReader();
              reader.onloadend = function() {
                var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, "data:attachment/file;");
                var popup = view.open(url, "_blank");
                if (!popup)
                  view.location.href = url;
                url = void 0;
                filesaver.readyState = filesaver.DONE;
                dispatch_all();
              };
              reader.readAsDataURL(blob);
              filesaver.readyState = filesaver.INIT;
              return;
            }
            if (!object_url) {
              object_url = get_URL().createObjectURL(blob);
            }
            if (force) {
              view.location.href = object_url;
            } else {
              var opened = view.open(object_url, "_blank");
              if (!opened) {
                view.location.href = object_url;
              }
            }
            filesaver.readyState = filesaver.DONE;
            dispatch_all();
            revoke(object_url);
          };
          filesaver.readyState = filesaver.INIT;
          if (can_use_save_link) {
            object_url = get_URL().createObjectURL(blob);
            setTimeout(function() {
              save_link.href = object_url;
              save_link.download = name;
              click(save_link);
              dispatch_all();
              revoke(object_url);
              filesaver.readyState = filesaver.DONE;
            });
            return;
          }
          fs_error();
        }, FS_proto = FileSaver.prototype, saveAs2 = function(blob, name, no_auto_bom) {
          return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
        };
        if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
          return function(blob, name, no_auto_bom) {
            name = name || blob.name || "download";
            if (!no_auto_bom) {
              blob = auto_bom(blob);
            }
            return navigator.msSaveOrOpenBlob(blob, name);
          };
        }
        FS_proto.abort = function() {
        };
        FS_proto.readyState = FS_proto.INIT = 0;
        FS_proto.WRITING = 1;
        FS_proto.DONE = 2;
        FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;
        return saveAs2;
      }(
        typeof self !== "undefined" && self || typeof window !== "undefined" && window || exports
      );
      if (typeof module !== "undefined" && module.exports) {
        module.exports.saveAs = saveAs;
      } else if (typeof define !== "undefined" && define !== null && define.amd !== null) {
        define("FileSaver.js", function() {
          return saveAs;
        });
      }
    }
  });

  // index.ts
  async function testDocx() {
    const PizZip = await require_js();
    const PizZipUtils = await require_utils2();
    const Docxtemplater = await require_docxtemplater();
    const FileSaver = await require_FileSaver();
    PizZipUtils.getBinaryContent("template.docx", (error, content) => {
      console.log(content);
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
      });
      console.log(doc);
      doc.render({
        databases: 2
      });
      console.log(doc);
      const blob = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: "DEFLATE"
      });
      console.log(blob);
      FileSaver.saveAs(blob, "output.docx");
    });
  }
  testDocx();
})();
/*! Bundled license information:

pako/dist/pako.es5.min.js:
  (*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) *)

filesaver.js/FileSaver.js:
  (*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js *)
*/
