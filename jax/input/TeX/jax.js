/*
 *  /MathJax/jax/input/TeX/jax.js
 *  
 *  Copyright (c) 2010 Design Science, Inc.
 *
 *  Part of the MathJax library.
 *  See http://www.mathjax.org for details.
 * 
 *  Licensed under the Apache License, Version 2.0;
 *  you may not use this file except in compliance with the License.
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 */

(function(e,c,k){var d=true,h=false,j,i=String.fromCharCode(160);var f=MathJax.Object.Subclass({Init:function(n,m){this.global={isInner:m};this.data=[b.start(this.global)];if(n){this.data[0].env=n}this.env=this.data[0].env},Push:function(){var o,n,p,q;for(o=0,n=arguments.length;o<n;o++){p=arguments[o];if(p instanceof j.mbase){p=b.mml(p)}p.global=this.global;q=(this.data.length?this.Top().checkItem(p):d);if(q instanceof Array){this.Pop();this.Push.apply(this,q)}else{if(q instanceof b){this.Pop();this.Push(q)}else{if(q){this.data.push(p);if(p.env){for(var r in this.env){if(this.env.hasOwnProperty(r)){p.env[r]=this.env[r]}}this.env=p.env}else{p.env=this.env}}}}}},Pop:function(){var m=this.data.pop();if(!m.isOpen){delete m.env}this.env=(this.data.length?this.Top().env:{});return m},Top:function(m){if(m==null){m=1}if(this.data.length<m){return null}return this.data[this.data.length-m]},Prev:function(m){var n=this.Top();if(m){return n.data[n.data.length-1]}else{return n.Pop()}},toString:function(){return"stack[\n  "+this.data.join("\n  ")+"\n]"}});var b=f.Item=MathJax.Object.Subclass({type:"base",closeError:"Extra close brace or missing open brace",rightError:"Missing \\left or extra \\right",Init:function(){if(this.isOpen){this.env={}}this.data=[];this.Push.apply(this,arguments)},Push:function(){this.data.push.apply(this.data,arguments)},Pop:function(){return this.data.pop()},mmlData:function(m,n){if(m==null){m=d}if(this.data.length===1&&!n){return this.data[0]}return j.mrow.apply(j,this.data).With((m?{inferred:d}:{}))},checkItem:function(m){if(m.type==="over"&&this.isOpen){m.num=this.mmlData(h);this.data=[]}if(m.type==="cell"&&this.isOpen){e.Error("Misplaced "+m.name)}if(m.isClose&&this[m.type+"Error"]){e.Error(this[m.type+"Error"])}if(!m.isNotStack){return d}this.Push(m.data[0]);return h},With:function(m){for(var n in m){if(m.hasOwnProperty(n)){this[n]=m[n]}}return this},toString:function(){return this.type+"["+this.data.join("; ")+"]"}});b.start=b.Subclass({type:"start",isOpen:d,Init:function(m){this.SUPER(arguments).Init.call(this);this.global=m},checkItem:function(m){if(m.type==="stop"){return b.mml(this.mmlData())}return this.SUPER(arguments).checkItem.call(this,m)}});b.stop=b.Subclass({type:"stop",isClose:d});b.open=b.Subclass({type:"open",isOpen:d,stopError:"Extra open brace or missing close brace",checkItem:function(n){if(n.type==="close"){var m=this.mmlData();return b.mml(j.TeXAtom(m))}return this.SUPER(arguments).checkItem.call(this,n)}});b.close=b.Subclass({type:"close",isClose:d});b.subsup=b.Subclass({type:"subsup",stopError:"Missing superscript or subscript argument",checkItem:function(n){var m=["","subscript","superscript"][this.position];if(n.type==="open"||n.type==="left"){return d}if(n.type==="mml"){this.data[0].SetData(this.position,n.data[0]);return b.mml(this.data[0])}if(this.SUPER(arguments).checkItem.call(this,n)){e.Error("Missing open brace for "+m)}},Pop:function(){}});b.over=b.Subclass({type:"over",isClose:d,name:"\\over",checkItem:function(o,m){if(o.type==="over"){e.Error("Ambiguous use of "+o.name)}if(o.isClose){var n=j.mfrac(this.num,this.mmlData(h));if(this.thickness!=null){n.linethickness=this.thickness}if(this.open||this.close){n.texClass=j.TEXCLASS.INNER;n.texWithDelims=d;n=j.mfenced(n).With({open:this.open,close:this.close})}return[b.mml(n),o]}return this.SUPER(arguments).checkItem.call(this,o)},toString:function(){return"over["+this.num+" / "+this.data.join("; ")+"]"}});b.left=b.Subclass({type:"left",isOpen:d,delim:"(",stopError:"Extra \\left or missing \\right",checkItem:function(n){if(n.type==="right"){var m=j.mfenced(this.data.length===1?this.data[0]:j.mrow.apply(j,this.data));return b.mml(m.With({open:this.delim,close:n.delim}))}return this.SUPER(arguments).checkItem.call(this,n)}});b.right=b.Subclass({type:"right",isClose:d,delim:")"});b.begin=b.Subclass({type:"begin",isOpen:d,checkItem:function(m){if(m.type==="end"){if(m.name!==this.name){e.Error("\\begin{"+this.name+"} ended with \\end{"+m.name+"}")}if(!this.end){return b.mml(this.mmlData())}return this.parse[this.end].call(this.parse,this,this.data)}if(m.type==="stop"){e.Error("Missing \\end{"+this.name+"}")}return this.SUPER(arguments).checkItem.call(this,m)}});b.end=b.Subclass({type:"end",isClose:d});b.style=b.Subclass({type:"style",checkItem:function(n){if(!n.isClose){return this.SUPER(arguments).checkItem.call(this,n)}var m=j.mstyle.apply(j,this.data).With(this.styles);return[b.mml(m),n]}});b.position=b.Subclass({type:"position",checkItem:function(n){if(n.isClose){e.Error("Missing box for "+this.name)}if(n.isNotStack){var m=n.mmlData();switch(this.move){case"vertical":m=j.mpadded(m).With({height:this.dh,depth:this.dd,voffset:this.dh});return[b.mml(m)];case"horizontal":return[b.mml(this.left),n,b.mml(this.right)]}}return this.SUPER(arguments).checkItem.call(this,n)}});b.array=b.Subclass({type:"array",isOpen:d,arraydef:{},Init:function(){this.table=[];this.row=[];this.env={};this.SUPER(arguments).Init.apply(this,arguments)},checkItem:function(n){if(n.isClose&&n.type!=="over"){if(n.isEntry){this.EndEntry();this.clearEnv();return h}if(n.isCR){this.EndEntry();this.EndRow();this.clearEnv();return h}this.EndTable();this.clearEnv();var m=j.mtable.apply(j,this.table).With(this.arraydef);if(this.open||this.close){m=j.mfenced(m).With({open:this.open,close:this.close})}m=b.mml(m);if(this.requireClose){if(n.type==="close"){return m}e.Error("Missing close brace")}return[m,n]}return this.SUPER(arguments).checkItem.call(this,n)},EndEntry:function(){this.row.push(j.mtd.apply(j,this.data));this.data=[]},EndRow:function(){this.table.push(j.mtr.apply(j,this.row));this.row=[]},EndTable:function(){if(this.data.length||this.row.length){this.EndEntry();this.EndRow()}this.checkLines()},checkLines:function(){if(this.arraydef.rowlines){var m=this.arraydef.rowlines.split(/ /);if(m.length===this.table.length){this.arraydef.frame=m.pop();this.arraydef.rowlines=m.join(" ")}else{if(m.length<this.table.length-1){this.arraydef.rowlines+=" none"}}}},clearEnv:function(){for(var m in this.env){if(this.env.hasOwnProperty(m)){delete this.env[m]}}}});b.cell=b.Subclass({type:"cell",isClose:d});b.mml=b.Subclass({type:"mml",isNotStack:d,Push:function(){for(var o=0,n=arguments.length;o<n;o++){if(arguments[o].type!=="mo"&&arguments[o].isEmbellished()){arguments[o]=j.TeXAtom(arguments[o]).With({isEmbellishedWrapper:d})}}this.data.push.apply(this.data,arguments)},Add:function(){this.data.push.apply(this.data,arguments);return this}});var g={};var l=function(){j=MathJax.ElementJax.mml;c.Insert(g,{letter:/[a-z]/i,digit:/[0-9.]/,number:/^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/,special:{"\\":"ControlSequence","{":"Open","}":"Close","~":"Tilde","^":"Superscript",_:"Subscript"," ":"Space","\t":"Space","\r":"Space","\n":"Space","'":"Prime","%":"Comment","&":"Entry","#":"Hash","\u2019":"Prime"},remap:{"-":"2212","*":"2217"},mathchar0mi:{alpha:"03B1",beta:"03B2",gamma:"03B3",delta:"03B4",epsilon:"03F5",zeta:"03B6",eta:"03B7",theta:"03B8",iota:"03B9",kappa:"03BA",lambda:"03BB",mu:"03BC",nu:"03BD",xi:"03BE",omicron:"03BF",pi:"03C0",rho:"03C1",sigma:"03C3",tau:"03C4",upsilon:"03C5",phi:"03D5",chi:"03C7",psi:"03C8",omega:"03C9",varepsilon:"03B5",vartheta:"03D1",varpi:"03D6",varrho:"03F1",varsigma:"03C2",varphi:"03C6",S:"00A7",aleph:["2135",{mathvariant:j.VARIANT.NORMAL}],hbar:"210F",imath:"0131",jmath:"0237",ell:"2113",wp:["2118",{mathvariant:j.VARIANT.NORMAL}],Re:["211C",{mathvariant:j.VARIANT.NORMAL}],Im:["2111",{mathvariant:j.VARIANT.NORMAL}],partial:["2202",{mathvariant:j.VARIANT.NORMAL}],infty:["221E",{mathvariant:j.VARIANT.NORMAL}],prime:["2032",{mathvariant:j.VARIANT.NORMAL}],emptyset:["2205",{mathvariant:j.VARIANT.NORMAL}],nabla:["2207",{mathvariant:j.VARIANT.NORMAL}],top:["22A4",{mathvariant:j.VARIANT.NORMAL}],bot:["22A5",{mathvariant:j.VARIANT.NORMAL}],angle:["2220",{mathvariant:j.VARIANT.NORMAL}],triangle:["25B3",{mathvariant:j.VARIANT.NORMAL}],backslash:["2216",{mathvariant:j.VARIANT.NORMAL}],forall:["2200",{mathvariant:j.VARIANT.NORMAL}],exists:["2203",{mathvariant:j.VARIANT.NORMAL}],neg:["00AC",{mathvariant:j.VARIANT.NORMAL}],lnot:["00AC",{mathvariant:j.VARIANT.NORMAL}],flat:["266D",{mathvariant:j.VARIANT.NORMAL}],natural:["266E",{mathvariant:j.VARIANT.NORMAL}],sharp:["266F",{mathvariant:j.VARIANT.NORMAL}],clubsuit:["2663",{mathvariant:j.VARIANT.NORMAL}],diamondsuit:["2662",{mathvariant:j.VARIANT.NORMAL}],heartsuit:["2661",{mathvariant:j.VARIANT.NORMAL}],spadesuit:["2660",{mathvariant:j.VARIANT.NORMAL}]},mathchar0mo:{surd:"221A",coprod:["2210",{texClass:j.TEXCLASS.OP,movesupsub:d}],bigvee:["22C1",{texClass:j.TEXCLASS.OP,movesupsub:d}],bigwedge:["22C0",{texClass:j.TEXCLASS.OP,movesupsub:d}],biguplus:["2A04",{texClass:j.TEXCLASS.OP,movesupsub:d}],bigcap:["22C2",{texClass:j.TEXCLASS.OP,movesupsub:d}],bigcup:["22C3",{texClass:j.TEXCLASS.OP,movesupsub:d}],"int":["222B",{texClass:j.TEXCLASS.OP}],intop:["222B",{texClass:j.TEXCLASS.OP,movesupsub:d,movablelimits:d}],iint:["222C",{texClass:j.TEXCLASS.OP}],iiint:["222D",{texClass:j.TEXCLASS.OP}],prod:["220F",{texClass:j.TEXCLASS.OP,movesupsub:d}],sum:["2211",{texClass:j.TEXCLASS.OP,movesupsub:d}],bigotimes:["2A02",{texClass:j.TEXCLASS.OP,movesupsub:d}],bigoplus:["2A01",{texClass:j.TEXCLASS.OP,movesupsub:d}],bigodot:["2A00",{texClass:j.TEXCLASS.OP,movesupsub:d}],oint:["222E",{texClass:j.TEXCLASS.OP}],bigsqcup:["2A06",{texClass:j.TEXCLASS.OP,movesupsub:d}],smallint:["222B",{largeop:h}],triangleleft:"25C3",triangleright:"25B9",bigtriangleup:"25B3",bigtriangledown:"25BD",wedge:"2227",land:"2227",vee:"2228",lor:"2228",cap:"2229",cup:"222A",ddagger:"2021",dagger:"2020",sqcap:"2293",sqcup:"2294",uplus:"228E",amalg:"2A3F",diamond:"22C4",bullet:"2219",wr:"2240",div:"00F7",odot:["2299",{largeop:h}],oslash:["2298",{largeop:h}],otimes:["2297",{largeop:h}],ominus:["2296",{largeop:h}],oplus:["2295",{largeop:h}],mp:"2213",pm:"00B1",circ:"2218",bigcirc:"25EF",setminus:"2216",cdot:"22C5",ast:"2217",times:"00D7",star:"22C6",propto:"221D",sqsubseteq:"2291",sqsupseteq:"2292",parallel:"2225",mid:"2223",dashv:"22A3",vdash:"22A2",leq:"2264",le:"2264",geq:"2265",ge:"2265",lt:"003C",gt:"003E",succ:"227B",prec:"227A",approx:"2248",succeq:"2AB0",preceq:"2AAF",supset:"2283",subset:"2282",supseteq:"2287",subseteq:"2286","in":"2208",ni:"220B",notin:"2209",owns:"220B",gg:"226B",ll:"226A",sim:"223C",simeq:"2243",perp:"22A5",equiv:"2261",asymp:"224D",smile:"2323",frown:"2322",ne:"2260",neq:"2260",cong:"2245",doteq:"2250",bowtie:"22C8",models:"22A8",notChar:"0338",Leftrightarrow:"21D4",Leftarrow:"21D0",Rightarrow:"21D2",leftrightarrow:"2194",leftarrow:"2190",gets:"2190",rightarrow:"2192",to:"2192",mapsto:"21A6",leftharpoonup:"21BC",leftharpoondown:"21BD",rightharpoonup:"21C0",rightharpoondown:"21C1",nearrow:"2197",searrow:"2198",nwarrow:"2196",swarrow:"2199",rightleftharpoons:"21CC",hookrightarrow:"21AA",hookleftarrow:"21A9",longleftarrow:"27F5",Longleftarrow:"27F8",longrightarrow:"27F6",Longrightarrow:"27F9",Longleftrightarrow:"27FA",longleftrightarrow:"27F7",longmapsto:"27FC",ldots:"2026",cdots:"22EF",vdots:"22EE",ddots:"22F1",dots:"2026",dotsc:"2026",dotsb:"22EF",dotsm:"22EF",dotsi:"22EF",dotso:"2026",ldotp:["002E",{texClass:j.TEXCLASS.PUNCT}],cdotp:["22C5",{texClass:j.TEXCLASS.PUNCT}],colon:["003A",{texClass:j.TEXCLASS.PUNCT}]},mathchar7:{Gamma:"0393",Delta:"0394",Theta:"0398",Lambda:"039B",Xi:"039E",Pi:"03A0",Sigma:"03A3",Upsilon:"03A5",Phi:"03A6",Psi:"03A8",Omega:"03A9",_:"005F","#":"0023","$":"0024","%":"0025","&":"0026",And:"0026"},delimiter:{"(":"(",")":")","[":"[","]":"]","<":"27E8",">":"27E9","\\lt":"27E8","\\gt":"27E9","/":"/","|":["|",{texClass:j.TEXCLASS.ORD}],".":"","\\\\":"\\","\\lmoustache":"23B0","\\rmoustache":"23B1","\\lgroup":"27EE","\\rgroup":"27EF","\\arrowvert":"23D0","\\Arrowvert":"2016","\\bracevert":"23AA","\\Vert":["2225",{texClass:j.TEXCLASS.ORD}],"\\|":["2225",{texClass:j.TEXCLASS.ORD}],"\\vert":["|",{texClass:j.TEXCLASS.ORD}],"\\uparrow":"2191","\\downarrow":"2193","\\updownarrow":"2195","\\Uparrow":"21D1","\\Downarrow":"21D3","\\Updownarrow":"21D5","\\backslash":"\\","\\rangle":"27E9","\\langle":"27E8","\\rbrace":"}","\\lbrace":"{","\\}":"}","\\{":"{","\\rceil":"2309","\\lceil":"2308","\\rfloor":"230B","\\lfloor":"230A","\\lbrack":"[","\\rbrack":"]"},macros:{displaystyle:["SetStyle","D",d,0],textstyle:["SetStyle","T",h,0],scriptstyle:["SetStyle","S",h,1],scriptscriptstyle:["SetStyle","SS",h,2],rm:["SetFont",j.VARIANT.NORMAL],mit:["SetFont",j.VARIANT.ITALIC],oldstyle:["SetFont",j.VARIANT.OLDSTYLE],cal:["SetFont",j.VARIANT.CALIGRAPHIC],it:["SetFont",j.VARIANT.ITALIC],bf:["SetFont",j.VARIANT.BOLD],bbFont:["SetFont",j.VARIANT.DOUBLESTRUCK],scr:["SetFont",j.VARIANT.SCRIPT],frak:["SetFont",j.VARIANT.FRAKTUR],sf:["SetFont",j.VARIANT.SANSSERIF],tt:["SetFont",j.VARIANT.MONOSPACE],tiny:["SetSize",0.5],Tiny:["SetSize",0.6],scriptsize:["SetSize",0.7],small:["SetSize",0.85],normalsize:["SetSize",1],large:["SetSize",1.2],Large:["SetSize",1.44],LARGE:["SetSize",1.73],huge:["SetSize",2.07],Huge:["SetSize",2.49],arcsin:["NamedOp",0],arccos:["NamedOp",0],arctan:["NamedOp",0],arg:["NamedOp",0],cos:["NamedOp",0],cosh:["NamedOp",0],cot:["NamedOp",0],coth:["NamedOp",0],csc:["NamedOp",0],deg:["NamedOp",0],det:"NamedOp",dim:["NamedOp",0],exp:["NamedOp",0],gcd:"NamedOp",hom:["NamedOp",0],inf:"NamedOp",ker:["NamedOp",0],lg:["NamedOp",0],lim:"NamedOp",liminf:["NamedOp",null,"lim&thinsp;inf"],limsup:["NamedOp",null,"lim&thinsp;sup"],ln:["NamedOp",0],log:["NamedOp",0],max:"NamedOp",min:"NamedOp",Pr:"NamedOp",sec:["NamedOp",0],sin:["NamedOp",0],sinh:["NamedOp",0],sup:"NamedOp",tan:["NamedOp",0],tanh:["NamedOp",0],limits:["Limits",1],nolimits:["Limits",0],overline:["UnderOver","203E"],underline:["UnderOver","005F"],overbrace:["UnderOver","23DE",1],underbrace:["UnderOver","23DF",1],overrightarrow:["UnderOver","2192"],underrightarrow:["UnderOver","2192"],overleftarrow:["UnderOver","2190"],underleftarrow:["UnderOver","2190"],overleftrightarrow:["UnderOver","2194"],underleftrightarrow:["UnderOver","2194"],overset:"Overset",underset:"Underset",stackrel:["Macro","\\mathrel{\\mathop{#2}\\limits^{#1}}",2],over:"Over",overwithdelims:"Over",atop:"Over",atopwithdelims:"Over",above:"Over",abovewithdelims:"Over",brace:["Over","{","}"],brack:["Over","[","]"],choose:["Over","(",")"],frac:"Frac",sqrt:"Sqrt",root:"Root",uproot:["MoveRoot","upRoot"],leftroot:["MoveRoot","leftRoot"],left:"LeftRight",right:"LeftRight",llap:"Lap",rlap:"Lap",raise:"RaiseLower",lower:"RaiseLower",moveleft:"MoveLeftRight",moveright:"MoveLeftRight",",":["Spacer",j.LENGTH.THINMATHSPACE],":":["Spacer",j.LENGTH.THINMATHSPACE],">":["Spacer",j.LENGTH.MEDIUMMATHSPACE],";":["Spacer",j.LENGTH.THICKMATHSPACE],"!":["Spacer",j.LENGTH.NEGATIVETHINMATHSPACE],enspace:["Spacer",".5em"],quad:["Spacer","1em"],qquad:["Spacer","2em"],thinspace:["Spacer",j.LENGTH.THINMATHSPACE],negthinspace:["Spacer",j.LENGTH.NEGATIVETHINMATHSPACE],hskip:"Hskip",hspace:"Hskip",kern:"Hskip",mskip:"Hskip",mspace:"Hskip",mkern:"Hskip",Rule:["Rule"],Space:["Rule","blank"],big:["MakeBig",j.TEXCLASS.ORD,0.85],Big:["MakeBig",j.TEXCLASS.ORD,1.15],bigg:["MakeBig",j.TEXCLASS.ORD,1.45],Bigg:["MakeBig",j.TEXCLASS.ORD,1.75],bigl:["MakeBig",j.TEXCLASS.OPEN,0.85],Bigl:["MakeBig",j.TEXCLASS.OPEN,1.15],biggl:["MakeBig",j.TEXCLASS.OPEN,1.45],Biggl:["MakeBig",j.TEXCLASS.OPEN,1.75],bigr:["MakeBig",j.TEXCLASS.CLOSE,0.85],Bigr:["MakeBig",j.TEXCLASS.CLOSE,1.15],biggr:["MakeBig",j.TEXCLASS.CLOSE,1.45],Biggr:["MakeBig",j.TEXCLASS.CLOSE,1.75],bigm:["MakeBig",j.TEXCLASS.REL,0.85],Bigm:["MakeBig",j.TEXCLASS.REL,1.15],biggm:["MakeBig",j.TEXCLASS.REL,1.45],Biggm:["MakeBig",j.TEXCLASS.REL,1.75],mathord:["TeXAtom",j.TEXCLASS.ORD],mathop:["TeXAtom",j.TEXCLASS.OP],mathopen:["TeXAtom",j.TEXCLASS.OPEN],mathclose:["TeXAtom",j.TEXCLASS.CLOSE],mathbin:["TeXAtom",j.TEXCLASS.BIN],mathrel:["TeXAtom",j.TEXCLASS.REL],mathpunct:["TeXAtom",j.TEXCLASS.PUNCT],mathinner:["TeXAtom",j.TEXCLASS.INNER],vcenter:["TeXAtom",j.TEXCLASS.VCENTER],mathchoice:["Extension","mathchoice"],buildrel:"BuildRel",hbox:["HBox",0],text:"HBox",mbox:["HBox",0],fbox:"FBox",strut:"Strut",mathstrut:["Macro","\\vphantom{(}"],phantom:"Phantom",vphantom:["Phantom",1,0],hphantom:["Phantom",0,1],smash:"Smash",acute:["Accent","02CA"],grave:["Accent","02CB"],ddot:["Accent","00A8"],tilde:["Accent","02DC"],bar:["Accent","02C9"],breve:["Accent","02D8"],check:["Accent","02C7"],hat:["Accent","02C6"],vec:["Accent","20D7"],dot:["Accent","02D9"],widetilde:["Accent","02DC",1],widehat:["Accent","02C6",1],matrix:"Matrix",array:"Matrix",pmatrix:["Matrix","(",")"],cases:["Matrix","{","","left left",null,".1em",null,true],eqalign:["Matrix",null,null,"right left",j.LENGTH.THICKMATHSPACE,".5em","D"],displaylines:["Matrix",null,null,"center",null,".5em","D"],cr:"Cr","\\":"Cr",newline:"Cr",hline:["HLine","solid"],hdashline:["HLine","dashed"],eqalignno:["Matrix",null,null,"right left right",j.LENGTH.THICKMATHSPACE+" 3em",".5em","D"],leqalignno:["Matrix",null,null,"right left right",j.LENGTH.THICKMATHSPACE+" 3em",".5em","D"],bmod:["Macro","\\mathbin{\\rm mod}"],pmod:["Macro","\\pod{{\\rm mod}\\kern 6mu #1}",1],mod:["Macro","\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}{\\rm mod}\\,\\,#1",1],pod:["Macro","\\mathchoice{\\kern18mu}{\\kern8mu}{\\kern8mu}{\\kern8mu}(#1)",1],iff:["Macro","\\;\\Longleftrightarrow\\;"],skew:["Macro","{{#2{#3\\mkern#1mu}\\mkern-#1mu}{}}",3],mathcal:["Macro","{\\cal #1}",1],mathscr:["Macro","{\\scr #1}",1],mathrm:["Macro","{\\rm #1}",1],mathbf:["Macro","{\\bf #1}",1],mathbb:["Macro","{\\bbFont #1}",1],Bbb:["Macro","{\\bbFont #1}",1],mathit:["Macro","{\\it #1}",1],mathfrak:["Macro","{\\frak #1}",1],mathsf:["Macro","{\\sf #1}",1],mathtt:["Macro","{\\tt #1}",1],textrm:["Macro","\\mathord{\\rm\\text{#1}}",1],textit:["Macro","\\mathord{\\it{\\text{#1}}}",1],textbf:["Macro","\\mathord{\\bf{\\text{#1}}}",1],pmb:["Macro","\\rlap{#1}\\kern1px{#1}",1],TeX:["Macro","T\\kern-.14em\\lower.5ex{E}\\kern-.115em X"],LaTeX:["Macro","L\\kern-.325em\\raise.21em{\\scriptstyle{A}}\\kern-.17em\\TeX"],not:["Macro","\\mathrel{\\rlap{\\kern.5em\\notChar}}"]," ":["Macro","\\text{ }"],space:"Tilde",begin:"Begin",end:"End",newcommand:["Extension","newcommand"],renewcommand:["Extension","newcommand"],newenvironment:["Extension","newcommand"],def:["Extension","newcommand"],verb:["Extension","verb"],boldsymbol:["Extension","boldsymbol"],tag:["Extension","AMSmath"],notag:["Extension","AMSmath"],label:["Extension","AMSmath"],ref:["Extension","AMSmath"],eqref:["Extension","AMSmath"],nonumber:["Macro","\\notag"],unicode:["Extension","unicode"],color:"Color",href:["Extension","HTML"],"class":["Extension","HTML"],style:["Extension","HTML"],cssId:["Extension","HTML"],bbox:["Extension","bbox"],require:"Require"},environment:{array:["Array"],matrix:["Array",null,null,null,"c"],pmatrix:["Array",null,"(",")","c"],bmatrix:["Array",null,"[","]","c"],Bmatrix:["Array",null,"\\{","\\}","c"],vmatrix:["Array",null,"\\vert","\\vert","c"],Vmatrix:["Array",null,"\\Vert","\\Vert","c"],cases:["Array",null,"\\{",".","ll",null,".1em"],eqnarray:["Array",null,null,null,"rcl",j.LENGTH.THICKMATHSPACE,".5em","D"],"eqnarray*":["Array",null,null,null,"rcl",j.LENGTH.THICKMATHSPACE,".5em","D"],equation:[null,"Equation"],"equation*":[null,"Equation"],align:["ExtensionEnv",null,"AMSmath"],"align*":["ExtensionEnv",null,"AMSmath"],aligned:["ExtensionEnv",null,"AMSmath"],multline:["ExtensionEnv",null,"AMSmath"],"multline*":["ExtensionEnv",null,"AMSmath"],split:["ExtensionEnv",null,"AMSmath"],gather:["ExtensionEnv",null,"AMSmath"],"gather*":["ExtensionEnv",null,"AMSmath"],gathered:["ExtensionEnv",null,"AMSmath"],alignat:["ExtensionEnv",null,"AMSmath"],"alignat*":["ExtensionEnv",null,"AMSmath"],alignedat:["ExtensionEnv",null,"AMSmath"]},p_height:1.2/0.85});if(this.config.Macros){var m=this.config.Macros;for(var n in m){if(m.hasOwnProperty(n)){if(typeof(m[n])==="string"){g.macros[n]=["Macro",m[n]]}else{g.macros[n]=["Macro"].concat(m[n])}}}}};var a=MathJax.Object.Subclass({Init:function(n,o){this.string=n;this.i=0;this.macroCount=0;var m;if(o){m={};for(var p in o){if(o.hasOwnProperty(p)){m[p]=o[p]}}}this.stack=e.Stack(m,!!o);this.Parse();this.Push(b.stop())},Parse:function(){var m;while(this.i<this.string.length){m=this.string.charAt(this.i++);if(g.special[m]){this[g.special[m]](m)}else{if(g.letter.test(m)){this.Variable(m)}else{if(g.digit.test(m)){this.Number(m)}else{this.Other(m)}}}}},Push:function(){this.stack.Push.apply(this.stack,arguments)},mml:function(){if(this.stack.Top().type!=="mml"){return null}return this.stack.Top().data[0]},mmlToken:function(m){return m},ControlSequence:function(s){var m=this.GetCS(),r,p;if(g.macros[m]){var o=g.macros[m];if(!(o instanceof Array)){o=[o]}var n=o[0];if(!(n instanceof Function)){n=this[n]}n.apply(this,["\\"+m].concat(o.slice(1)))}else{if(g.mathchar0mi[m]){r=g.mathchar0mi[m];p={mathvariant:j.VARIANT.ITALIC};if(r instanceof Array){p=r[1];r=r[0]}this.Push(this.mmlToken(j.mi(j.entity("#x"+r)).With(p)))}else{if(g.mathchar0mo[m]){r=g.mathchar0mo[m];p={stretchy:h};if(r instanceof Array){p=r[1];p.stretchy=h;r=r[0]}this.Push(this.mmlToken(j.mo(j.entity("#x"+r)).With(p)))}else{if(g.mathchar7[m]){r=g.mathchar7[m];p={mathvariant:j.VARIANT.NORMAL};if(r instanceof Array){p=r[1];r=r[0]}if(this.stack.env.font){p.mathvariant=this.stack.env.font}this.Push(this.mmlToken(j.mi(j.entity("#x"+r)).With(p)))}else{if(g.delimiter["\\"+m]!=null){var q=g.delimiter["\\"+m];p={};if(q instanceof Array){p=q[1];q=q[0]}if(q.length===4){q=j.entity("#x"+q)}else{q=j.chars(q)}this.Push(this.mmlToken(j.mo(q).With({fence:h,stretchy:h}).With(p)))}else{this.csUndefined("\\"+m)}}}}}},csUndefined:function(m){e.Error("Undefined control sequence "+m)},Variable:function(n){var m={};if(this.stack.env.font){m.mathvariant=this.stack.env.font}this.Push(this.mmlToken(j.mi(j.chars(n)).With(m)))},Number:function(p){var m,o=this.string.slice(this.i-1).match(g.number);if(o){m=j.mn(o[0].replace(/[{}]/g,""));this.i+=o[0].length-1}else{m=j.mo(j.chars(p))}if(this.stack.env.font){m.mathvariant=this.stack.env.font}this.Push(this.mmlToken(m))},Open:function(m){this.Push(b.open())},Close:function(m){this.Push(b.close())},Tilde:function(m){this.Push(j.mtext(j.chars(i)))},Space:function(m){},Superscript:function(o){var m,n=this.stack.Prev();if(!n){n=j.mi("")}if(n.isEmbellishedWrapper){n=n.data[0].data[0]}if(n.type==="msubsup"){if(n.data[n.sup]){if(!n.data[n.sup].isPrime){e.Error("Double exponent: use braces to clarify")}n=j.msubsup(n,null,null)}m=n.sup}else{if(n.movesupsub){if(n.type!=="munderover"||n.data[n.over]){n=j.munderover(n,null,null).With({movesupsub:d})}m=n.over}else{n=j.msubsup(n,null,null);m=n.sup}}this.Push(b.subsup(n).With({position:m}))},Subscript:function(o){var m,n=this.stack.Prev();if(!n){n=j.mi("")}if(n.isEmbellishedWrapper){n=n.data[0].data[0]}if(n.type==="msubsup"){if(n.data[n.sub]){e.Error("Double subscripts: use braces to clarify")}m=n.sub}else{if(n.movesupsub){if(n.type!=="munderover"||n.data[n.under]){n=j.munderover(n,null,null).With({movesupsub:d})}m=n.under}else{n=j.msubsup(n,null,null);m=n.sub}}this.Push(b.subsup(n).With({position:m}))},PRIME:String.fromCharCode(8242),SMARTQUOTE:String.fromCharCode(8217),Prime:function(o){var n=this.stack.Prev();if(!n){n=j.mi()}if(n.type==="msubsup"&&n.data[n.sup]){e.Error("Prime causes double exponent: use braces to clarify")}var m="";this.i--;do{m+=this.PRIME;this.i++,o=this.GetNext()}while(o==="'"||o===this.SMARTQUOTE);m=this.mmlToken(j.mo(j.chars(m)).With({isPrime:d,variantForm:e.isSTIX}));this.Push(j.msubsup(n,null,m))},Comment:function(m){while(this.i<this.string.length&&this.string.charAt(this.i)!="\n"){this.i++}},Hash:function(m){e.Error("You can't use 'macro parameter character #' in math mode")},Other:function(o){var n={stretchy:false},m;if(this.stack.env.font){n.mathvariant=this.stack.env.font}if(g.remap[o]){o=g.remap[o];if(o instanceof Array){n=o[1];o=o[0]}m=j.mo(j.entity("#x"+o))}else{m=j.mo(o)}if(m.autoDefault("texClass",true)==""){m=j.TeXAtom(m)}this.Push(this.mmlToken(m.With(n)))},SetFont:function(n,m){this.stack.env.font=m},SetStyle:function(n,m,o,p){this.stack.env.style=m;this.stack.env.level=p;this.Push(b.style().With({styles:{displaystyle:o,scriptlevel:p}}))},SetSize:function(m,n){this.stack.env.size=n;this.Push(b.style().With({styles:{mathsize:n+"em"}}))},Color:function(o){var n=this.GetArgument(o);var m=this.stack.env.color;this.stack.env.color=n;var p=this.ParseArg(o);if(m){this.stack.env.color}else{delete this.stack.env.color}this.Push(j.mstyle(p).With({mathcolor:n}))},Spacer:function(m,n){this.Push(j.mspace().With({width:n,mathsize:j.SIZE.NORMAL,scriptlevel:1}))},LeftRight:function(m){this.Push(b[m.substr(1)]().With({delim:this.GetDelimiter(m)}))},NamedOp:function(o,n,q){var p=(n!=null&&n===0?h:d);if(!q){q=o.substr(1)}n=((n||n==null)?d:h);q=q.replace(/&thinsp;/,String.fromCharCode(8198));var m=j.mo(q).With({movablelimits:n,movesupsub:p,form:j.FORM.PREFIX,texClass:j.TEXCLASS.OP});m.useMMLspacing&=~m.SPACE_ATTR.form;this.Push(this.mmlToken(m))},Limits:function(n,m){var o=this.stack.Prev("nopop");if(o.texClass!==j.TEXCLASS.OP){e.Error(n+" is allowed only on operators")}o.movesupsub=(m?d:h);o.movablelimits=h},Over:function(o,n,p){var m=b.over().With({name:o});if(n||p){m.open=n;m.close=p}else{if(o.match(/withdelims$/)){m.open=this.GetDelimiter(o);m.close=this.GetDelimiter(o)}}if(o.match(/^\\above/)){m.thickness=this.GetDimen(o)}else{if(o.match(/^\\atop/)||n||p){m.thickness=0}}this.Push(m)},Frac:function(n){var m=this.ParseArg(n);var o=this.ParseArg(n);this.Push(j.mfrac(m,o))},Sqrt:function(o){var p=this.GetBrackets(o),m=this.ParseArg(o);if(p==""){m=j.msqrt.apply(j,m.array())}else{m=j.mroot(m,this.parseRoot(p))}this.Push(m)},Root:function(o){var p=this.GetUpTo(o,"\\of");var m=this.ParseArg(o);this.Push(j.mroot(m,this.parseRoot(p)))},parseRoot:function(r){var o=this.stack.env,m=o.inRoot;o.inRoot=true;var q=e.Parse(r,o);r=q.mml();var p=q.stack.global;if(p.leftRoot||p.upRoot){r=j.mpadded(r);if(p.leftRoot){r.width=p.leftRoot}if(p.upRoot){r.voffset=p.upRoot;r.height=p.upRoot}}o.inRoot=m;return r},MoveRoot:function(m,p){if(!this.stack.env.inRoot){e.Error(m+" can appear only within a root")}if(this.stack.global[p]){e.Error("Multiple use of "+m)}var o=this.GetArgument(m);if(!o.match(/-?[0-9]+/)){e.Error("The argument to "+m+" must be an integer")}o=(o/15)+"em";if(o.substr(0,1)!=="-"){o="+"+o}this.stack.global[p]=o},Accent:function(o,m,r){var q=this.ParseArg(o);var p={accent:true};if(this.stack.env.font){p.mathvariant=this.stack.env.font}var n=this.mmlToken(j.mo(j.entity("#x"+m)).With(p));n.stretchy=(r?d:h);this.Push(j.munderover(q,null,n).With({accent:d}))},UnderOver:function(o,r,m){var q={o:"over",u:"under"}[o.charAt(1)];var p=this.ParseArg(o);if(p.Get("movablelimits")){p.movablelimits=false}var n=j.munderover(p,null,null);if(m){n.movesupsub=d}n.data[n[q]]=this.mmlToken(j.mo(j.entity("#x"+r)).With({stretchy:d,accent:(q=="under")}));this.Push(n)},Overset:function(m){var o=this.ParseArg(m),n=this.ParseArg(m);this.Push(j.munderover(n,null,o))},Underset:function(m){var o=this.ParseArg(m),n=this.ParseArg(m);this.Push(j.munderover(n,o,null))},TeXAtom:function(p,r){var q={texClass:r},o;if(r==j.TEXCLASS.OP){q.movesupsub=q.movablelimits=d;var m=this.GetArgument(p);var n=m.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);if(n){o=this.mmlToken(j.mo(n[1]).With({movablelimits:d,movesupsub:d,mathvariant:j.VARIANT.NORMAL,form:j.FORM.PREFIX,texClass:j.TEXCLASS.OP}));o.useMMLspacing&=~o.SPACE_ATTR.form}else{o=j.TeXAtom(e.Parse(m,this.stack.env).mml()).With(q)}}else{o=j.TeXAtom(this.ParseArg(p)).With(q)}this.Push(o)},Strut:function(m){this.Push(j.mpadded(j.mrow()).With({height:"8.6pt",depth:"3pt",width:0}))},Phantom:function(n,m,o){var p=j.mphantom(this.ParseArg(n));if(m||o){p=j.mpadded(p);if(o){p.height=p.depth=0}if(m){p.width=0}}this.Push(p)},Smash:function(o){var n=this.trimSpaces(this.GetBrackets(o));var m=j.mpadded(this.ParseArg(o));switch(n){case"b":m.depth=0;break;case"t":m.height=0;break;default:m.height=m.depth=0}this.Push(m)},Lap:function(n){var m=j.mpadded(this.ParseArg(n)).With({width:0});if(n==="\\llap"){m.lspace="-1 width"}this.Push(m)},RaiseLower:function(m){var n=this.GetDimen(m);var o=b.position().With({name:m,move:"vertical"});if(n.charAt(0)==="-"){n=n.slice(1);m={raise:"\\lower",lower:"\\raise"}[m.substr(1)]}if(m==="\\lower"){o.dh="-"+n;o.dd="+"+n}else{o.dh="+"+n;o.dd="-"+n}this.Push(o)},MoveLeftRight:function(m){var p=this.GetDimen(m);var o=(p.charAt(0)==="-"?p.slice(1):"-"+p);if(m==="\\moveleft"){var n=p;p=o;o=n}this.Push(b.position().With({name:m,move:"horizontal",left:j.mspace().With({width:p,mathsize:j.SIZE.NORMAL,scriptlevel:1}),right:j.mspace().With({width:o,mathsize:j.SIZE.NORMAL,scriptlevel:1})}))},Hskip:function(m){this.Push(j.mspace().With({width:this.GetDimen(m),mathsize:j.SIZE.NORMAL,scriptlevel:0}))},Rule:function(o,q){var m=this.GetDimen(o),p=this.GetDimen(o),s=this.GetDimen(o);var n,r={width:m,height:p,depth:s};if(q!=="blank"){n=j.mpadded(j.mrow()).With(r);if(parseFloat(m)&&parseFloat(p)+parseFloat(s)){n=j.mstyle(n).With({mathbackground:(this.stack.env.color||"black")})}}else{n=j.mspace().With(r)}this.Push(n)},MakeBig:function(m,p,n){n*=g.p_height;n=String(n).replace(/(\.\d\d\d).+/,"$1")+"em";var o=this.GetDelimiter(m);this.Push(j.TeXAtom(j.mo(o).With({minsize:n,maxsize:n,scriptlevel:0,fence:d,stretchy:d,symmetric:d})).With({texClass:p}))},BuildRel:function(m){var n=this.ParseUpTo(m,"\\over");var o=this.ParseArg(m);this.Push(j.TeXAtom(j.munderover(o,null,n)).With({mclass:j.TEXCLASS.REL}))},HBox:function(m,n){this.Push.apply(this,this.InternalMath(this.GetArgument(m),n))},FBox:function(m){this.Push(j.menclose.apply(j,this.InternalMath(this.GetArgument(m))).With({notation:"box"}))},Require:function(m){var n=this.GetArgument(m);this.Extension(null,n)},Extension:function(m,n,o){if(m&&!typeof(m)==="string"){m=m.name}n=e.extensionDir+"/"+n;if(!n.match(/\.js$/)){n+=".js"}if(!k.loaded[k.fileURL(n)]){if(m!=null){delete g[o||"macros"][m.replace(/^\\/,"")]}c.RestartAfter(k.Require(n))}},Macro:function(n,q,p){if(p){var m=[];for(var o=0;o<p;o++){m.push(this.GetArgument(n))}q=this.SubstituteArgs(m,q)}this.string=this.AddArgs(q,this.string.slice(this.i));this.i=0;if(++this.macroCount>e.config.MAXMACROS){e.Error("MathJax maximum macro substitution count exceeded; is there a recursive macro call?")}},Matrix:function(n,p,u,r,t,o,m,v){var s=this.GetNext();if(s===""){e.Error("Missing argument for "+n)}if(s==="{"){this.i++}else{this.string=s+"}"+this.string.slice(this.i+1);this.i=0}var q=b.array().With({requireClose:d,arraydef:{rowspacing:(o||"4pt"),columnspacing:(t||"1em")}});if(v){q.isCases=d}if(p||u){q.open=p;q.close=u}if(m==="D"){q.arraydef.displaystyle=d}if(r!=null){q.arraydef.columnalign=r}this.Push(q)},Entry:function(p){this.Push(b.cell().With({isEntry:d,name:p}));if(this.stack.Top().isCases){var o=this.string;var s=0,q=this.i,n=o.length;while(q<n){var t=o.charAt(q);if(t==="{"){s++;q++}else{if(t==="}"){if(s===0){n=0}else{s--;q++}}else{if(t==="&"&&s===0){e.Error("Extra alignment tab in \\cases text")}else{if(t==="\\"){if(o.substr(q).match(/^((\\cr)[^a-zA-Z]|\\\\)/)){n=0}else{q+=2}}else{q++}}}}}var r=o.substr(this.i,q-this.i);if(!r.match(/^\s*\\text[^a-zA-Z]/)){this.Push.apply(this,this.InternalMath(r));this.i=q}}},Cr:function(m){this.Push(b.cell().With({isCR:d,name:m}))},HLine:function(n,o){if(o==null){o="solid"}var p=this.stack.Top();if(p.type!=="array"||p.data.length){e.Error("Misplaced "+n)}if(p.table.length==0){p.arraydef.frame=o}else{var m=(p.arraydef.rowlines?p.arraydef.rowlines.split(/ /):[]);while(m.length<p.table.length){m.push("none")}m[p.table.length-1]=o;p.arraydef.rowlines=m.join(" ")}},Begin:function(n){var o=this.GetArgument(n);if(o.match(/[^a-z*]/i)){e.Error('Invalid environment name "'+o+'"')}if(!g.environment[o]){e.Error('Unknown environment "'+o+'"')}if(++this.macroCount>e.config.MAXMACROS){e.Error("MathJax maximum substitution count exceeded; is there a recursive latex environment?")}var p=g.environment[o];if(!(p instanceof Array)){p=[p]}var m=b.begin().With({name:o,end:p[1],parse:this});if(p[0]&&this[p[0]]){m=this[p[0]].apply(this,[m].concat(p.slice(2)))}this.Push(m)},End:function(m){this.Push(b.end().With({name:this.GetArgument(m)}))},Equation:function(m,n){return n},ExtensionEnv:function(n,m){this.Extension(n.name,m,"environment")},Array:function(o,q,v,t,u,p,m,r){if(!t){t=this.GetArgument("\\begin{"+o.name+"}")}var w=("c"+t).replace(/[^clr|:]/g,"").replace(/[^|:]([|:])+/g,"$1");t=t.replace(/[^clr]/g,"").split("").join(" ");t=t.replace(/l/g,"left").replace(/r/g,"right").replace(/c/g,"center");var s=b.array().With({arraydef:{columnalign:t,columnspacing:(u||"1em"),rowspacing:(p||"4pt")}});if(w.match(/[|:]/)){var n=(w.charAt(0)+w.charAt(w.length-1)).replace(/[^|:]/g,"");if(n!==""){s.arraydef.frame={"|":"solid",":":"dashed"}[n.charAt(0)];s.arraydef.framespacing=".5em .5ex"}w=w.substr(1,w.length-2);s.arraydef.columnlines=w.split("").join(" ").replace(/[^|: ]/g,"none").replace(/\|/g,"solid").replace(/:/g,"dashed")}if(q){s.open=this.convertDelimiter(q)}if(v){s.close=this.convertDelimiter(v)}if(m==="D"){s.arraydef.displaystyle=d}if(m==="S"){s.arraydef.scriptlevel=1}if(r){s.arraydef.useHeight=h}this.Push(o);return s},convertDelimiter:function(m){if(m){m=g.delimiter[m]}if(m==null){return null}if(m instanceof Array){m=m[0]}if(m.length===4){m=String.fromCharCode(parseInt(m,16))}return m},trimSpaces:function(m){if(typeof(m)!="string"){return m}return m.replace(/^\s+|\s+$/g,"")},nextIsSpace:function(){return this.string.charAt(this.i).match(/[ \n\r\t]/)},GetNext:function(){while(this.nextIsSpace()){this.i++}return this.string.charAt(this.i)},GetCS:function(){var m=this.string.slice(this.i).match(/^([a-z]+|.) ?/i);if(m){this.i+=m[1].length;return m[1]}else{this.i++;return" "}},GetArgument:function(n,o){switch(this.GetNext()){case"":if(!o){e.Error("Missing argument for "+n)}return null;case"}":if(!o){e.Error("Extra close brace or missing open brace")}return null;case"\\":this.i++;return"\\"+this.GetCS();case"{":var m=++this.i,p=1;while(this.i<this.string.length){switch(this.string.charAt(this.i++)){case"\\":this.i++;break;case"{":p++;break;case"}":if(p==0){e.Error("Extra close brace")}if(--p==0){return this.string.slice(m,this.i-1)}break}}e.Error("Missing close brace");break}return this.string.charAt(this.i++)},GetBrackets:function(n){if(this.GetNext()!="["){return""}var m=++this.i,o=0;while(this.i<this.string.length){switch(this.string.charAt(this.i++)){case"{":o++;break;case"\\":this.i++;break;case"}":if(o--<=0){e.Error("Extra close brace while looking for ']'")}break;case"]":if(o==0){return this.string.slice(m,this.i-1)}break}}e.Error("Couldn't find closing ']' for argument to "+n)},GetDelimiter:function(m){while(this.nextIsSpace()){this.i++}var n=this.string.charAt(this.i);if(this.i<this.string.length){this.i++;if(n=="\\"){n+=this.GetCS(m)}if(g.delimiter[n]!=null){return this.convertDelimiter(n)}}e.Error("Missing or unrecognized delimiter for "+m)},GetDimen:function(n){var o;if(this.nextIsSpace()){this.i++}if(this.string.charAt(this.i)=="{"){o=this.GetArgument(n);if(o.match(/^\s*([-+]?(\.\d+|\d+(\.\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)\s*$/)){return o.replace(/ /g,"")}}else{o=this.string.slice(this.i);var m=o.match(/^\s*(([-+]?(\.\d+|\d+(\.\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)) ?/);if(m){this.i+=m[0].length;return m[1].replace(/ /g,"")}}e.Error("Missing dimension or its units for "+n)},GetUpTo:function(o,p){while(this.nextIsSpace()){this.i++}var n=this.i,m,r,q=0;while(this.i<this.string.length){m=this.i;r=this.string.charAt(this.i++);switch(r){case"\\":r+=this.GetCS();break;case"{":q++;break;case"}":if(q==0){e.Error("Extra close brace while looking for "+p)}q--;break}if(q==0&&r==p){return this.string.slice(n,m)}}e.Error("Couldn't find "+p+" for "+o)},ParseArg:function(m){return e.Parse(this.GetArgument(m),this.stack.env).mml()},ParseUpTo:function(m,n){return e.Parse(this.GetUpTo(m,n),this.stack.env).mml()},InternalMath:function(r,t){var q={displaystyle:h};if(t!=null){q.scriptlevel=t}if(this.stack.env.font){q.mathvariant=this.stack.env.font}if(!r.match(/\$|\\\(|\\(eq)?ref\s*\{/)){return[this.InternalText(r,q)]}var p=0,m=0,s,o="";var n=[];while(p<r.length){s=r.charAt(p++);if(s==="$"){if(o==="$"){n.push(j.TeXAtom(e.Parse(r.slice(m,p-1),{}).mml().With(q)));o="";m=p}else{if(o===""){if(m<p-1){n.push(this.InternalText(r.slice(m,p-1),q))}o="$";m=p}}}else{if(s==="}"&&o==="}"){n.push(j.TeXAtom(e.Parse(r.slice(m,p),{}).mml().With(q)));o="";m=p}else{if(s==="\\"){if(o===""&&r.substr(p).match(/^(eq)?ref\s*\{/)){if(m<p-1){n.push(this.InternalText(r.slice(m,p-1),q))}o="}";m=p-1}else{s=r.charAt(p++);if(s==="("&&o===""){if(m<p-2){n.push(this.InternalText(r.slice(m,p-2),q))}o=")";m=p}else{if(s===")"&&o===")"){n.push(j.TeXAtom(e.Parse(r.slice(m,p-2),{}).mml().With(q)));o="";m=p}}}}}}}if(o!==""){e.Error("Math not terminated in text box")}if(m<r.length){n.push(this.InternalText(r.slice(m),q))}return n},InternalText:function(n,m){n=n.replace(/^\s+/,i).replace(/\s+$/,i);return j.mtext(j.chars(n)).With(m)},SubstituteArgs:function(n,m){var q="";var p="";var r;var o=0;while(o<m.length){r=m.charAt(o++);if(r==="\\"){q+=r+m.charAt(o++)}else{if(r==="#"){r=m.charAt(o++);if(r==="#"){q+=r}else{if(!r.match(/[1-9]/)||r>n.length){e.Error("Illegal macro parameter reference")}p=this.AddArgs(this.AddArgs(p,q),n[r-1]);q=""}}else{q+=r}}}return this.AddArgs(p,q)},AddArgs:function(n,m){if(m.match(/^[a-z]/i)&&n.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)){n+=" "}if(n.length+m.length>e.config.MAXBUFFER){e.Error("MathJax internal buffer size exceeded; is there a recursive macro call?")}return n+m}});e.Augment({Stack:f,Parse:a,Definitions:g,Startup:l,config:{MAXMACROS:10000,MAXBUFFER:5*1024},prefilterHooks:MathJax.Callback.Hooks(true),postfilterHooks:MathJax.Callback.Hooks(true),Config:function(){this.SUPER(arguments).Config.apply(this,arguments);if(this.config.equationNumbers.autoNumber!=="none"){if(!this.config.extensions){this.config.extensions=[]}this.config.extensions.push("AMSmath.js")}},Translate:function(m){var n,o=false,q=m.innerHTML.replace(/^\s+/,"").replace(/\s+$/,"");var s=(m.type.replace(/\n/g," ").match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/)!=null);var r={math:q,display:s,script:m};this.prefilterHooks.Execute(r);q=r.math;try{n=e.Parse(q).mml()}catch(p){if(!p.texError){throw p}n=this.formatError(p,q,s,m);o=true}if(n.inferred){n=j.apply(MathJax.ElementJax,n.data)}else{n=j(n)}if(s){n.root.display="block"}if(o){n.texError=true}r.math=n;this.postfilterHooks.Execute(r);return r.math},prefilterMath:function(m){if(c.Browser.isKonqueror){m.math=m.math.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")}m.math=m.math.replace(/([_^]\s*\d)([0-9.,])/g,"$1 $2")},postfilterMath:function(m){this.combineRelations(m.math.root)},formatError:function(o,n,p,m){return j.merror(o.message.replace(/\n.*/,""))},Error:function(m){throw c.Insert(Error(m),{texError:d})},Macro:function(m,n,o){g.macros[m]=["Macro"].concat([].slice.call(arguments,1))},combineRelations:function(o){for(var p=0,n=o.data.length;p<n;p++){if(o.data[p]){if(o.isa(j.mrow)){while(p+1<n&&o.data[p+1]&&o.data[p].isa(j.mo)&&o.data[p+1].isa(j.mo)&&o.data[p].Get("texClass")===j.TEXCLASS.REL&&o.data[p+1].Get("texClass")===j.TEXCLASS.REL){o.data[p].Append.apply(o.data[p],o.data[p+1].data);o.data.splice(p+1,1);n--}}if(!o.data[p].isToken){this.combineRelations(o.data[p])}}}}});e.prefilterHooks.Add(["prefilterMath",e]);e.postfilterHooks.Add(["postfilterMath",e]);e.loadComplete("jax.js")})(MathJax.InputJax.TeX,MathJax.Hub,MathJax.Ajax);

