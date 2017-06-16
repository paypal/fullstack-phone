for(var aa="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(c.get||c.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},k="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this,m=["String","prototype","repeat"],n=0;n<m.length-1;n++){var ba=m[n];ba in k||(k[ba]={});k=k[ba]}
var ca=m[m.length-1],da=k[ca],ea=da?da:function(a){var b;if(null==this)throw new TypeError("The 'this' value for String.prototype.repeat must not be null or undefined");b=this+"";if(0>a||1342177279<a)throw new RangeError("Invalid count value");a|=0;for(var c="";a;)if(a&1&&(c+=b),a>>>=1)b+=b;return c};ea!=da&&null!=ea&&aa(k,ca,{configurable:!0,writable:!0,value:ea});var fa=this;function p(a){return"string"==typeof a}
function q(a,b){var c=a.split("."),d=fa;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d[e]?d=d[e]:d=d[e]={}:d[e]=b}function r(a,b){function c(){}c.prototype=b.prototype;a.pa=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.oa=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)}};function u(a,b){null!=a&&this.a.apply(this,arguments)}u.prototype.b="";u.prototype.set=function(a){this.b=""+a};u.prototype.a=function(a,b,c){this.b+=String(a);if(null!=b)for(var d=1;d<arguments.length;d++)this.b+=arguments[d];return this};function v(a){a.b=""}u.prototype.toString=function(){return this.b};var ga=Array.prototype.indexOf?function(a,b,c){return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(p(a))return p(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},ha=Array.prototype.filter?function(a,b,c){return Array.prototype.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=p(a)?a.split(""):a,h=0;h<d;h++)if(h in g){var l=g[h];b.call(c,l,h,a)&&(e[f++]=l)}return e};
function ia(a,b){a.sort(b||ja)}function ja(a,b){return a>b?1:a<b?-1:0};function ka(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b};function la(a,b){this.b=a;this.a={};for(var c=0;c<b.length;c++){var d=b[c];this.a[d.a]=d}}function ma(a){a=ka(a.a);ia(a,function(a,c){return a.a-c.a});return a};function na(a,b){this.a=a;this.h=!!b.w;this.b=b.c;this.l=b.type;this.j=!1;switch(this.b){case oa:case pa:case qa:case ra:case sa:case ta:case ua:this.j=!0}this.g=b.defaultValue}var ua=1,ta=2,oa=3,pa=4,qa=6,ra=16,sa=18;function w(){this.f={};this.b=this.i().a;this.a=this.g=null}w.prototype.has=function(a){return null!=this.f[a.a]};w.prototype.get=function(a,b){return x(this,a.a,b)};w.prototype.set=function(a,b){y(this,a.a,b)};
function va(a,b){for(var c=ma(a.i()),d=0;d<c.length;d++){var e=c[d],f=e.a;if(null!=b.f[f]){a.a&&delete a.a[e.a];var g=11==e.b||10==e.b;if(e.h)for(var e=z(b,f),h=0;h<e.length;h++){var l=a,t=f,jb=g?e[h].clone():e[h];l.f[t]||(l.f[t]=[]);l.f[t].push(jb);l.a&&delete l.a[t]}else e=A(b,f),g?(g=A(a,f))?va(g,e):y(a,f,e.clone()):y(a,f,e)}}}w.prototype.clone=function(){var a=new this.constructor;a!=this&&(a.f={},a.a&&(a.a={}),va(a,this));return a};
function A(a,b){var c=a.f[b];if(null==c)return null;if(a.g){if(!(b in a.a)){var d=a.g,e=a.b[b];if(null!=c)if(e.h){for(var f=[],g=0;g<c.length;g++)f[g]=d.a(e,c[g]);c=f}else c=d.a(e,c);return a.a[b]=c}return a.a[b]}return c}function x(a,b,c){var d=A(a,b);return a.b[b].h?d[c||0]:d}function B(a,b){var c;if(null!=a.f[b])c=x(a,b,void 0);else a:{c=a.b[b];if(void 0===c.g){var d=c.l;if(d===Boolean)c.g=!1;else if(d===Number)c.g=0;else if(d===String)c.g=c.j?"0":"";else{c=new d;break a}}c=c.g}return c}
function z(a,b){return A(a,b)||[]}function C(a,b){return a.b[b].h?null!=a.f[b]?a.f[b].length:0:null!=a.f[b]?1:0}function y(a,b,c){a.f[b]=c;a.a&&(a.a[b]=c)}function D(a,b){var c=[],d;for(d in b)0!=d&&c.push(new na(d,b[d]));return new la(a,c)};/*

 Protocol Buffer 2 Copyright 2008 Google Inc.
 All other code copyright its respective owners.
 Copyright (C) 2010 The Libphonenumber Authors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
function E(){w.call(this)}r(E,w);var wa=null;function F(){w.call(this)}r(F,w);var xa=null;function G(){w.call(this)}r(G,w);var ya=null;
E.prototype.i=function(){var a=wa;a||(wa=a=D(E,{0:{name:"NumberFormat",ga:"i18n.phonenumbers.NumberFormat"},1:{name:"pattern",required:!0,c:9,type:String},2:{name:"format",required:!0,c:9,type:String},3:{name:"leading_digits_pattern",w:!0,c:9,type:String},4:{name:"national_prefix_formatting_rule",c:9,type:String},6:{name:"national_prefix_optional_when_formatting",c:8,defaultValue:!1,type:Boolean},5:{name:"domestic_carrier_code_formatting_rule",c:9,type:String}}));return a};E.i=E.prototype.i;
F.prototype.i=function(){var a=xa;a||(xa=a=D(F,{0:{name:"PhoneNumberDesc",ga:"i18n.phonenumbers.PhoneNumberDesc"},2:{name:"national_number_pattern",c:9,type:String},3:{name:"possible_number_pattern",c:9,type:String},9:{name:"possible_length",w:!0,c:5,type:Number},10:{name:"possible_length_local_only",w:!0,c:5,type:Number},6:{name:"example_number",c:9,type:String},7:{name:"national_number_matcher_data",c:12,type:String}}));return a};F.i=F.prototype.i;
G.prototype.i=function(){var a=ya;a||(ya=a=D(G,{0:{name:"PhoneMetadata",ga:"i18n.phonenumbers.PhoneMetadata"},1:{name:"general_desc",c:11,type:F},2:{name:"fixed_line",c:11,type:F},3:{name:"mobile",c:11,type:F},4:{name:"toll_free",c:11,type:F},5:{name:"premium_rate",c:11,type:F},6:{name:"shared_cost",c:11,type:F},7:{name:"personal_number",c:11,type:F},8:{name:"voip",c:11,type:F},21:{name:"pager",c:11,type:F},25:{name:"uan",c:11,type:F},27:{name:"emergency",c:11,type:F},28:{name:"voicemail",c:11,type:F},
24:{name:"no_international_dialling",c:11,type:F},9:{name:"id",required:!0,c:9,type:String},10:{name:"country_code",c:5,type:Number},11:{name:"international_prefix",c:9,type:String},17:{name:"preferred_international_prefix",c:9,type:String},12:{name:"national_prefix",c:9,type:String},13:{name:"preferred_extn_prefix",c:9,type:String},15:{name:"national_prefix_for_parsing",c:9,type:String},16:{name:"national_prefix_transform_rule",c:9,type:String},18:{name:"same_mobile_and_fixed_line_pattern",c:8,defaultValue:!1,
type:Boolean},19:{name:"number_format",w:!0,c:11,type:E},20:{name:"intl_number_format",w:!0,c:11,type:E},22:{name:"main_country_for_code",c:8,defaultValue:!1,type:Boolean},23:{name:"leading_digits",c:9,type:String},26:{name:"leading_zero_possible",c:8,defaultValue:!1,type:Boolean}}));return a};G.i=G.prototype.i;function H(){}H.prototype.b=function(a){new a.b;throw Error("Unimplemented");};H.prototype.a=function(a,b){if(11==a.b||10==a.b)return b instanceof w?b:this.b(a.l.prototype.i(),b);if(14==a.b){if(p(b)&&za.test(b)){var c=Number(b);if(0<c)return c}return b}if(!a.j)return b;c=a.l;if(c===String){if("number"==typeof b)return String(b)}else if(c===Number&&p(b)&&("Infinity"===b||"-Infinity"===b||"NaN"===b||za.test(b)))return Number(b);return b};var za=/^-?[0-9]+$/;function Aa(){}r(Aa,H);Aa.prototype.b=function(a,b){var c=new a.b;c.g=this;c.f=b;c.a={};return c};function Ba(){}r(Ba,Aa);Ba.prototype.a=function(a,b){return 8==a.b?!!b:H.prototype.a.apply(this,arguments)};function I(){w.call(this)}var Ca;r(I,w);var Da={na:1,ma:5,la:10,ka:20};
I.prototype.i=function(){Ca||(Ca=D(I,{0:{name:"PhoneNumber",ga:"i18n.phonenumbers.PhoneNumber"},1:{name:"country_code",required:!0,c:5,type:Number},2:{name:"national_number",required:!0,c:4,type:Number},3:{name:"extension",c:9,type:String},4:{name:"italian_leading_zero",c:8,type:Boolean},8:{name:"number_of_leading_zeros",c:5,defaultValue:1,type:Number},5:{name:"raw_input",c:9,type:String},6:{name:"country_code_source",c:14,defaultValue:1,type:Da},7:{name:"preferred_domestic_carrier_code",c:9,type:String}}));
return Ca};I.ctor=I;I.ctor.i=I.prototype.i;var J,K;function Ea(a){return!!a&&"[object Object]"===""+a&&a.constructor===Object};/*

 Copyright (C) 2010 The Libphonenumber Authors.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
function L(){this.a={}}L.a=function(){return L.b?L.b:L.b=new L};
var Fa={0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9","\uff10":"0","\uff11":"1","\uff12":"2","\uff13":"3","\uff14":"4","\uff15":"5","\uff16":"6","\uff17":"7","\uff18":"8","\uff19":"9","\u0660":"0","\u0661":"1","\u0662":"2","\u0663":"3","\u0664":"4","\u0665":"5","\u0666":"6","\u0667":"7","\u0668":"8","\u0669":"9","\u06f0":"0","\u06f1":"1","\u06f2":"2","\u06f3":"3","\u06f4":"4","\u06f5":"5","\u06f6":"6","\u06f7":"7","\u06f8":"8","\u06f9":"9"},Ga={0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",
7:"7",8:"8",9:"9","\uff10":"0","\uff11":"1","\uff12":"2","\uff13":"3","\uff14":"4","\uff15":"5","\uff16":"6","\uff17":"7","\uff18":"8","\uff19":"9","\u0660":"0","\u0661":"1","\u0662":"2","\u0663":"3","\u0664":"4","\u0665":"5","\u0666":"6","\u0667":"7","\u0668":"8","\u0669":"9","\u06f0":"0","\u06f1":"1","\u06f2":"2","\u06f3":"3","\u06f4":"4","\u06f5":"5","\u06f6":"6","\u06f7":"7","\u06f8":"8","\u06f9":"9",A:"2",B:"2",C:"2",D:"3",E:"3",F:"3",G:"4",H:"4",I:"4",J:"5",K:"5",L:"5",M:"6",N:"6",O:"6",P:"7",
Q:"7",R:"7",S:"7",T:"8",U:"8",V:"8",W:"9",X:"9",Y:"9",Z:"9"},Ha=RegExp("[+\uff0b]+"),M=RegExp("^[+\uff0b]+"),Ia=RegExp("([0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9])"),Ja=RegExp("[+\uff0b0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9]"),Ka=/[\\\/] *x/,La=RegExp("[^0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9A-Za-z#]+$"),Ma=/(?:.*?[A-Za-z]){3}.*/,Na=RegExp("(?:;ext=([0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9]{1,7})|[ \u00a0\\t,]*(?:e?xt(?:ensi(?:o\u0301?|\u00f3))?n?|\uff45?\uff58\uff54\uff4e?|[;,x\uff58#\uff03~\uff5e]|int|anexo|\uff49\uff4e\uff54)[:\\.\uff0e]?[ \u00a0\\t,-]*([0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9]{1,7})#?|[- ]+([0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9]{1,5})#)$",
"i"),Oa=RegExp("^[0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9]{2}$|^[+\uff0b]*(?:[-x\u2010-\u2015\u2212\u30fc\uff0d-\uff0f \u00a0\u00ad\u200b\u2060\u3000()\uff08\uff09\uff3b\uff3d.\\[\\]/~\u2053\u223c\uff5e*]*[0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9]){3,}[-x\u2010-\u2015\u2212\u30fc\uff0d-\uff0f \u00a0\u00ad\u200b\u2060\u3000()\uff08\uff09\uff3b\uff3d.\\[\\]/~\u2053\u223c\uff5e*A-Za-z0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9]*(?:;ext=([0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9]{1,7})|[ \u00a0\\t,]*(?:e?xt(?:ensi(?:o\u0301?|\u00f3))?n?|\uff45?\uff58\uff54\uff4e?|[;,x\uff58#\uff03~\uff5e]|int|anexo|\uff49\uff4e\uff54)[:\\.\uff0e]?[ \u00a0\\t,-]*([0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9]{1,7})#?|[- ]+([0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9]{1,5})#)?$",
"i"),Pa=/(\$\d)/,Qa=/^\(?\$1\)?$/;function Ra(a){var b=a.search(Ja);0<=b?(a=a.substring(b),a=a.replace(La,""),b=a.search(Ka),0<=b&&(a=a.substring(0,b))):a="";return a}function Sa(a){return 2>a.length?!1:N(Oa,a)}function Ta(a){return N(Ma,a)?Ua(a,Ga):Ua(a,Fa)}function Va(a){var b=Ta(a.toString());v(a);a.a(b)}function Wa(){return ha(Object.keys(K),function(a){return isNaN(a)})}function Xa(a){return!!a&&(1!=C(a,9)||-1!=z(a,9)[0])}
function Ua(a,b){for(var c=new u,d,e=a.length,f=0;f<e;++f)d=a.charAt(f),d=b[d.toUpperCase()],null!=d&&c.a(d);return c.toString()}function O(a){return null!=a&&isNaN(a)&&a.toUpperCase()in K}
function Ya(a,b){var c=P;if(0==x(a,2)&&null!=a.f[5]){var d=B(a,5);if(0<d.length)return d}var d=B(a,1),e=Za(a);if(0==b)return $a(d,0,e,"");if(!(d in J))return e;var f=Q(c,d,R(d)),c=null!=a.f[3]&&x(a,3).length?3==b?";ext="+x(a,3):null!=f.f[13]?x(f,13)+B(a,3):" ext. "+B(a,3):"";a:{for(var f=z(f,20).length&&2!=b?z(f,20):z(f,19),g,h=f.length,l=0;l<h;++l){g=f[l];var t=C(g,3);if(!t||!e.search(x(g,3,t-1)))if(t=new RegExp(x(g,1)),N(t,e)){f=g;break a}}f=null}f&&(h=f,f=B(h,2),g=new RegExp(x(h,1)),B(h,5),h=B(h,
4),e=2==b&&null!=h&&0<h.length?e.replace(g,f.replace(Pa,h)):e.replace(g,f),3==b&&(e=e.replace(RegExp("^[-x\u2010-\u2015\u2212\u30fc\uff0d-\uff0f \u00a0\u00ad\u200b\u2060\u3000()\uff08\uff09\uff3b\uff3d.\\[\\]/~\u2053\u223c\uff5e]+"),""),e=e.replace(RegExp("[-x\u2010-\u2015\u2212\u30fc\uff0d-\uff0f \u00a0\u00ad\u200b\u2060\u3000()\uff08\uff09\uff3b\uff3d.\\[\\]/~\u2053\u223c\uff5e]+","g"),"-")));return $a(d,b,e,c)}function Q(a,b,c){return"001"==c?S(a,""+b):S(a,c)}
function Za(a){var b=""+x(a,2);return null!=a.f[4]&&x(a,4)&&0<B(a,8)?Array(B(a,8)+1).join("0")+b:b}function $a(a,b,c,d){switch(b){case 0:return"+"+a+c+d;case 1:return"+"+a+" "+c+d;case 3:return"tel:+"+a+"-"+c+d;default:return c+d}}
function T(a,b){switch(b){case 4:return x(a,5);case 3:return x(a,4);case 1:return x(a,3);case 0:case 2:return x(a,2);case 5:return x(a,6);case 6:return x(a,8);case 7:return x(a,7);case 8:return x(a,21);case 9:return x(a,25);case 10:return x(a,28);default:return x(a,1)}}function S(a,b){if(null==b)return null;b=b.toUpperCase();var c=a.a[b];if(!c){c=K[b];if(!c)return null;c=(new Ba).b(G.i(),c);a.a[b]=c}return c}function U(a,b){var c=a.length;return 0<C(b,9)&&-1==ga(z(b,9),c)?!1:N(B(b,2),a)}
function R(a){return(a=J[a])?a[0]:"ZZ"}function ab(a,b){var c=S(a,b);if(!c)throw Error("Invalid region code: "+b);return B(c,10)}function bb(a){a=Q(P,a,R(a));return!!a&&B(a,26)}
function V(a,b,c,d){var e=T(c,d),f=C(e,9)?z(e,9):z(x(c,1),9),e=z(e,10);if(2==d)if(Xa(T(c,0)))a=T(c,1),Xa(a)&&(f=f.concat(C(a,9)?z(a,9):z(x(c,1),9)),ia(f),e.length?(e=e.concat(z(a,10)),ia(e)):e=z(a,10));else return V(a,b,c,1);if(-1==f[0])return 5;b=b.length;if(-1<ga(e,b))return 4;c=f[0];return c==b?0:c>b?2:f[f.length-1]<b?3:-1<ga(f,b,1)?0:5}
function cb(a,b){var c=a.toString();if(!c.length||"0"==c.charAt(0))return 0;for(var d,e=c.length,f=1;3>=f&&f<=e;++f)if(d=parseInt(c.substring(0,f),10),d in J)return b.a(c.substring(f)),d;return 0}
function db(a,b,c,d,e){if(!b.length)return 0;b=new u(b);var f;c&&(f=x(c,11));null==f&&(f="NonMatch");var g=b.toString();if(g.length)if(M.test(g))g=g.replace(M,""),v(b),b.a(Ta(g)),f=1;else{g=new RegExp(f);Va(b);f=b.toString();if(f.search(g))f=!1;else{var g=f.match(g)[0].length,h=f.substring(g).match(Ia);h&&null!=h[1]&&0<h[1].length&&"0"==Ua(h[1],Fa)?f=!1:(v(b),b.a(f.substring(g)),f=!0)}f=f?5:20}else f=20;if(20!=f){if(2>=b.b.length)throw Error("Phone number too short after IDD");if(a=cb(b,d))return y(e,
1,a),a;throw Error("Invalid country calling code");}if(c&&(f=B(c,10),g=""+f,h=b.toString(),!h.lastIndexOf(g,0)&&(g=new u(h.substring(g.length)),h=x(c,1),h=new RegExp(B(h,2)),eb(g,c,null),g=g.toString(),!N(h,b.toString())&&N(h,g)||3==V(a,b.toString(),c,-1))))return d.a(g),y(e,1,f),f;y(e,1,0);return 0}
function eb(a,b,c){var d=a.toString(),e=d.length,f=x(b,15);if(e&&null!=f&&f.length){var g=new RegExp("^(?:"+f+")");if(e=g.exec(d)){var f=new RegExp(B(x(b,1),2)),h=N(f,d),l=e.length-1;b=x(b,16);if(null!=b&&b.length&&null!=e[l]&&e[l].length){if(d=d.replace(g,b),!h||N(f,d))c&&0<l&&c.a(e[1]),a.set(d)}else if(!h||N(f,d.substring(e[0].length)))c&&0<l&&null!=e[l]&&c.a(e[1]),a.set(d.substring(e[0].length))}}}
function fb(a,b,c){if(null==b)throw Error("The string supplied did not seem to be a phone number");if(250<b.length)throw Error("The string supplied is too long to be a phone number");var d=new u,e=b.indexOf(";phone-context=");if(0<=e){var f=e+15;if("+"==b.charAt(f)){var g=b.indexOf(";",f);0<g?d.a(b.substring(f,g)):d.a(b.substring(f))}f=b.indexOf("tel:");d.a(b.substring(0<=f?f+4:0,e))}else d.a(Ra(b));b=d.toString();e=b.indexOf(";isub=");0<e&&(v(d),d.a(b.substring(0,e)));if(!Sa(d.toString()))throw Error("The string supplied did not seem to be a phone number");
b=d.toString();if(!(O(c)||null!=b&&0<b.length&&M.test(b)))throw Error("Invalid country calling code");b=new I;a:{e=d.toString();f=e.search(Na);if(0<=f&&Sa(e.substring(0,f)))for(var g=e.match(Na),h=g.length,l=1;l<h;++l)if(null!=g[l]&&0<g[l].length){v(d);d.a(e.substring(0,f));e=g[l];break a}e=""}0<e.length&&y(b,3,e);e=S(a,c);f=new u;g=0;h=d.toString();try{g=db(a,h,e,f,b)}catch(t){if("Invalid country calling code"==t.message&&M.test(h)){if(h=h.replace(M,""),g=db(a,h,e,f,b),!g)throw t;}else throw t;}g?
(d=R(g),d!=c&&(e=Q(a,g,d))):(Va(d),f.a(d.toString()),null!=c&&(g=B(e,10),y(b,1,g)));if(2>f.b.length)throw Error("The string supplied is too short to be a phone number");e&&(c=new u(f.toString()),eb(c,e,new u),2!=V(a,c.toString(),e,-1)&&(f=c));a=f.toString();c=a.length;if(2>c)throw Error("The string supplied is too short to be a phone number");if(17<c)throw Error("The string supplied is too long to be a phone number");if(1<a.length&&"0"==a.charAt(0)){y(b,4,!0);for(c=1;c<a.length-1&&"0"==a.charAt(c);)c++;
1!=c&&y(b,8,c)}y(b,2,parseInt(a,10));return b}function N(a,b){var c="string"==typeof a?b.match("^(?:"+a+")$"):b.match(a);return c&&c[0].length==b.length?!0:!1};function gb(a){this.ha=RegExp("\u2008");this.ca="";this.o=new u;this.$="";this.j=new u;this.v=new u;this.l=!0;this.aa=this.s=this.ea=!1;this.fa=L.a();this.u=0;this.b=new u;this.ba=!1;this.m="";this.a=new u;this.g=[];this.da=a;this.ia=this.h=hb(this,this.da)}var ib=new G;y(ib,11,"NA");
var kb=/\[([^\[\]])*\]/g,lb=/\d(?=[^,}][^,}])/g,mb=RegExp("^[-x\u2010-\u2015\u2212\u30fc\uff0d-\uff0f \u00a0\u00ad\u200b\u2060\u3000()\uff08\uff09\uff3b\uff3d.\\[\\]/~\u2053\u223c\uff5e]*(\\$\\d[-x\u2010-\u2015\u2212\u30fc\uff0d-\uff0f \u00a0\u00ad\u200b\u2060\u3000()\uff08\uff09\uff3b\uff3d.\\[\\]/~\u2053\u223c\uff5e]*)+$"),nb=/[- ]/;function hb(a,b){var c=O(b)?ab(a.fa,b):0;return(c=S(a.fa,R(c)))?c:ib}
function ob(a){for(var b=a.g.length,c=0;c<b;++c){var d=a.g[c],e=B(d,1);if(a.$==e)return!1;var f;f=a;var g=d,h=B(g,1);if(-1!=h.indexOf("|"))f=!1;else{h=h.replace(kb,"\\d");h=h.replace(lb,"\\d");v(f.o);var l;l=f;var g=B(g,2),t="999999999999999".match(h)[0];t.length<l.a.b.length?l="":(l=t.replace(new RegExp(h,"g"),g),l=l.replace(RegExp("9","g"),"\u2008"));0<l.length?(f.o.a(l),f=!0):f=!1}if(f)return a.$=e,a.ba=nb.test(x(d,4)),a.u=0,!0}return a.l=!1}
function pb(a,b){for(var c=[],d=b.length-3,e=a.g.length,f=0;f<e;++f){var g=a.g[f];C(g,3)?(g=x(g,3,Math.min(d,C(g,3)-1)),b.search(g)||c.push(a.g[f])):c.push(a.g[f])}a.g=c}gb.prototype.ja=function(a){return this.ca=qb(this,a)};
function qb(a,b){a.j.a(b);var c=b;if(Ia.test(c)||1==a.j.b.length&&Ha.test(c)){var c=b,d;"+"==c?(d=c,a.v.a(c)):(d=Fa[c],a.v.a(d),a.a.a(d));b=d}else a.l=!1,a.ea=!0;if(!a.l){if(!a.ea)if(rb(a)){if(sb(a))return tb(a)}else if(0<a.m.length&&(c=a.a.toString(),v(a.a),a.a.a(a.m),a.a.a(c),c=a.b.toString(),d=c.lastIndexOf(a.m),v(a.b),a.b.a(c.substring(0,d))),a.m!=ub(a))return a.b.a(" "),tb(a);return a.j.toString()}switch(a.v.b.length){case 0:case 1:case 2:return a.j.toString();case 3:if(rb(a))a.aa=!0;else return a.m=
ub(a),vb(a);default:if(a.aa)return sb(a)&&(a.aa=!1),a.b.toString()+a.a.toString();if(0<a.g.length){c=wb(a,b);d=xb(a);if(0<d.length)return d;pb(a,a.a.toString());return ob(a)?yb(a):a.l?W(a,c):a.j.toString()}return vb(a)}}function tb(a){a.l=!0;a.aa=!1;a.g=[];a.u=0;v(a.o);a.$="";return vb(a)}function xb(a){for(var b=a.a.toString(),c=a.g.length,d=0;d<c;++d){var e=a.g[d],f=B(e,1);if((new RegExp("^(?:"+f+")$")).test(b))return a.ba=nb.test(x(e,4)),b=b.replace(new RegExp(f,"g"),x(e,2)),W(a,b)}return""}
function W(a,b){var c=a.b.b.length;return a.ba&&0<c&&" "!=a.b.toString().charAt(c-1)?a.b+" "+b:a.b+b}function vb(a){var b=a.a.toString();if(3<=b.length){for(var c=a.s&&0<C(a.h,20)?z(a.h,20):z(a.h,19),d=c.length,e=0;e<d;++e){var f=c[e],g;(g=null==a.h.f[12]||a.s||x(f,6))||(g=B(f,4),g=!g.length||Qa.test(g));g&&mb.test(B(f,2))&&a.g.push(f)}pb(a,b);b=xb(a);return 0<b.length?b:ob(a)?yb(a):a.j.toString()}return W(a,b)}
function yb(a){var b=a.a.toString(),c=b.length;if(0<c){for(var d="",e=0;e<c;e++)d=wb(a,b.charAt(e));return a.l?W(a,d):a.j.toString()}return a.b.toString()}
function ub(a){var b=a.a.toString(),c=0,d;1!=x(a.h,10)?d=!1:(d=a.a.toString(),d="1"==d.charAt(0)&&"0"!=d.charAt(1)&&"1"!=d.charAt(1));d?(c=1,a.b.a("1").a(" "),a.s=!0):null!=a.h.f[15]&&(d=new RegExp("^(?:"+x(a.h,15)+")"),(d=b.match(d))&&null!=d[0]&&0<d[0].length&&(a.s=!0,c=d[0].length,a.b.a(b.substring(0,c))));v(a.a);a.a.a(b.substring(c));return b.substring(0,c)}
function rb(a){var b=a.v.toString(),c=new RegExp("^(?:\\+|"+x(a.h,11)+")");return(c=b.match(c))&&null!=c[0]&&0<c[0].length?(a.s=!0,c=c[0].length,v(a.a),a.a.a(b.substring(c)),v(a.b),a.b.a(b.substring(0,c)),"+"!=b.charAt(0)&&a.b.a(" "),!0):!1}function sb(a){if(!a.a.b.length)return!1;var b=new u,c=cb(a.a,b);if(!c)return!1;v(a.a);a.a.a(b.toString());b=R(c);"001"==b?a.h=S(a.fa,""+c):b!=a.da&&(a.h=hb(a,b));a.b.a(""+c).a(" ");a.m="";return!0}
function wb(a,b){var c=a.o.toString();if(0<=c.substring(a.u).search(a.ha)){var d=c.search(a.ha),c=c.replace(a.ha,b);v(a.o);a.o.a(c);a.u=d;return c.substring(0,a.u+1)}1==a.g.length&&(a.l=!1);a.$="";return a.j.toString()};var P=L.a(),X,zb={e164:0,international:1,national:2,rfc3966:3},Ab={FIXED_LINE:0,MOBILE:1,FIXED_LINE_OR_MOBILE:2,TOLL_FREE:3,PREMIUM_RATE:4,SHARED_COST:5,VOIP:6,PERSONAL_NUMBER:7,PAGER:8,UAN:9,VOICEMAIL:10},Bb={"Invalid country calling code":"PHONE_INVALID_COUNTRY_CODE","The string supplied is too short to be a phone number":"PHONE_NUMBER_TOO_SHORT","The string supplied is too long to be a phone number":"PHONE_NUMBER_TOO_LONG","The string supplied did not seem to be a phone number":"PHONE_NOT_A_NUMBER",
"Phone number too short after IDD":"PHONE_TOO_SHORT_AFTER_IDD"};function Y(){if(!X||!X.length)throw Error("No metadata loaded");}function Z(a){if(-1===X.indexOf(a))throw Error("Metadata not loaded for region: "+a);}function Cb(a){if(!a)return null;var b={countryCode:a.f[1].toString(),nationalNumber:a.f[2].toString()};a.f[4]&&bb(a.f[1])&&(b.nationalNumber="0"+b.nationalNumber);void 0!==a.f[3]&&(b.extension=a.f[3]);return b}
function Db(a){var b=new I,c,d;c=Number(a.countryCode);y(b,1,c);d=a.nationalNumber;"string"===typeof d&&(c="0"===d.charAt(0)&&bb(c),y(b,4,c),d=Number(d));y(b,2,d);void 0!==a.extension&&null!==a.extension&&(a=a.extension.toString(),y(b,3,a));return b}q("countryCodeToRegionCodeMap",function(){Y();return J});q("getCountryCodeForRegion",function(a){Y();Z(a);return O(a)?ab(P,a):0});q("getSupportedRegions",function(){Y();return Wa()});
q("formatPhoneNumber",function(a,b){Y();var c;try{c=Db(a)}catch(e){throw Error("Phone object conversion failed: "+e.message);}b=b||{};var d=zb[b.style];if(void 0===d)throw Error("Invalid style property: "+b.style);return Ya(c,d).toString()});
q("validatePhoneNumber",function(a,b){Y();Z(b);var c;try{c=Db(a)}catch(h){throw Error("Phone object conversion failed: "+h.message);}var d;var e=c,f=P,g=B(e,1);d=Q(f,g,b);!d||"001"!=b&&g!=ab(f,b)?d=!1:(e=Za(e),d=-1!=(U(e,x(d,1))?U(e,x(d,5))?4:U(e,x(d,4))?3:U(e,x(d,6))?5:U(e,x(d,8))?6:U(e,x(d,7))?7:U(e,x(d,21))?8:U(e,x(d,25))?9:U(e,x(d,28))?10:U(e,x(d,2))?x(d,18)||U(e,x(d,3))?2:0:!x(d,18)&&U(e,x(d,3))?1:-1:-1));if(d)return!0;d=P;e=c;c=Za(e);e=B(e,1);e in J?(e=Q(d,e,R(e)),c=V(d,c,e,-1)):c=1;switch(c){case 1:c=
"PHONE_INVALID_COUNTRY_CODE";break;case 2:c="PHONE_NUMBER_TOO_SHORT";break;case 3:c="PHONE_NUMBER_TOO_LONG";break;case 5:c="PHONE_NUMBER_INVALID_LENGTH";break;default:c="PHONE_INVALID_FOR_COUNTRY"}return Error(c)});q("parsePhoneNumber",function(a,b){Y();Z(b);var c;try{c=fb(P,a,b)}catch(d){return Error(Bb[d.message])}return Cb(c)});
q("getExampleNumberForType",function(a,b){Y();Z(a);var c=Ab[b];void 0===c&&(c=-1);var d;a:{var e=c,c=P;if(O(a)){e=T(S(c,a),e);try{if(null!=e.f[6]){var f=x(e,6);d=fb(c,f,a);break a}}catch(g){}}d=null}return Cb(d)});q("useMeta",function(a){if(!(a&&a.regionCodes&&Array.isArray(a.regionCodes)&&a.regionCodes.length))throw Error("Invalid metadata");X=a.regionCodes;var b=a.countryCodeToRegionCodeMap;a=a.countryToMetadata;if(!(b&&a&&Ea(b)&&Ea(a)))throw Error("Invalid metadata");J=b;K=a});
q("getAsYouTypeFormatter",function(a){Y();Z(a);var b=new gb(a);return{inputDigit:function(a){return b.ja(a)},clear:function(){b.ca="";v(b.j);v(b.v);v(b.o);b.u=0;b.$="";v(b.b);b.m="";v(b.a);b.l=!0;b.ea=!1;b.s=!1;b.aa=!1;b.g=[];b.ba=!1;b.h!=b.ia&&(b.h=hb(b,b.da))}}});