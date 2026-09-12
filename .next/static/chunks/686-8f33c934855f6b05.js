"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[686],{9688:function(t,e,r){r.d(e,{s:function(){return s}});var i=r(300);let n=()=>i.sk,s=()=>n()},9198:function(t,e,r){r.d(e,{j:function(){return n}});var i=r(2996);let n=new class extends i.l{#t;#e;#r;constructor(){super(),this.#r=t=>{if("undefined"!=typeof window&&window.addEventListener){let e=()=>t();return window.addEventListener("visibilitychange",e,!1),()=>{window.removeEventListener("visibilitychange",e)}}}}onSubscribe(){this.#e||this.setEventListener(this.#r)}onUnsubscribe(){this.hasListeners()||(this.#e?.(),this.#e=void 0)}setEventListener(t){this.#r=t,this.#e?.(),this.#e=t(t=>{"boolean"==typeof t?this.setFocused(t):this.onFocus()})}setFocused(t){this.#t!==t&&(this.#t=t,this.onFocus())}onFocus(){let t=this.isFocused();this.listeners.forEach(e=>{e(t)})}isFocused(){return"boolean"==typeof this.#t?this.#t:globalThis.document?.visibilityState!=="hidden"}}},7987:function(t,e,r){r.d(e,{Vr:function(){return n}});let i=r(3295).Hp,n=function(){let t=[],e=0,r=t=>{t()},n=t=>{t()},s=i,o=i=>{e?t.push(i):s(()=>{r(i)})},a=()=>{let e=t;t=[],e.length&&s(()=>{n(()=>{e.forEach(t=>{r(t)})})})};return{batch:t=>{let r;e++;try{r=t()}finally{--e||a()}return r},batchCalls:t=>(...e)=>{o(()=>{t(...e)})},schedule:o,setNotifyFunction:t=>{r=t},setBatchNotifyFunction:t=>{n=t},setScheduler:t=>{s=t}}}()},436:function(t,e,r){r.d(e,{N:function(){return n}});var i=r(2996);let n=new class extends i.l{#i=!0;#e;#r;constructor(){super(),this.#r=t=>{if("undefined"!=typeof window&&window.addEventListener){let e=()=>t(!0),r=()=>t(!1);return window.addEventListener("online",e,!1),window.addEventListener("offline",r,!1),()=>{window.removeEventListener("online",e),window.removeEventListener("offline",r)}}}}onSubscribe(){this.#e||this.setEventListener(this.#r)}onUnsubscribe(){this.hasListeners()||(this.#e?.(),this.#e=void 0)}setEventListener(t){this.#r=t,this.#e?.(),this.#e=t(this.setOnline.bind(this))}setOnline(t){this.#i!==t&&(this.#i=t,this.listeners.forEach(e=>{e(t)}))}isOnline(){return this.#i}}},7749:function(t,e,r){r.d(e,{A:function(){return c},z:function(){return l}});var i=r(300),n=r(7987),s=r(1640),o=r(9024);function a(t,{pages:e,pageParams:r}){let i=e.length-1;return e.length>0?t.getNextPageParam(e[i],e,r[i],r):void 0}function u(t,{pages:e,pageParams:r}){return e.length>0?t.getPreviousPageParam?.(e[0],e,r[0],r):void 0}var c=class extends o.F{#n;#s;#o;#a;#u;#c;#l;#d;constructor(t){super(),this.#d=!1,this.#l=t.defaultOptions,this.setOptions(t.options),this.observers=[],this.#u=t.client,this.#a=this.#u.getQueryCache(),this.queryKey=t.queryKey,this.queryHash=t.queryHash,this.#s=h(this.options),this.state=t.state??this.#s,this.scheduleGc()}get meta(){return this.options.meta}get queryType(){return this.#n}get promise(){return this.#c?.promise}setOptions(t){if(this.options={...this.#l,...t},t?._type&&(this.#n=t._type),this.updateGcTime(this.options.gcTime),this.state&&void 0===this.state.data){let t=h(this.options);void 0!==t.data&&(this.setState(d(t.data,t.dataUpdatedAt)),this.#s=t)}}optionalRemove(){this.observers.length||"idle"!==this.state.fetchStatus||this.#a.remove(this)}setData(t,e){let r=(0,i.oE)(this.state.data,t,this.options);return this.#h({data:r,type:"success",dataUpdatedAt:e?.updatedAt,manual:e?.manual}),r}setState(t){this.#h({type:"setState",state:t})}cancel(t){let e=this.#c?.promise;return this.#c?.cancel(t),e?e.then(i.ZT).catch(i.ZT):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}get resetState(){return this.#s}reset(){this.destroy(),this.setState(this.resetState)}isActive(){return this.observers.some(t=>!1!==(0,i.Wo)(t.options.enabled,this))}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===i.CN||!this.isFetched()}isFetched(){return this.state.dataUpdateCount+this.state.errorUpdateCount>0}isStatic(){return this.getObserversCount()>0&&this.observers.some(t=>"static"===(0,i.Wo)(t.options.staleTime,this))}isStale(){return this.getObserversCount()>0?this.observers.some(t=>t.getCurrentResult().isStale):void 0===this.state.data||this.state.isInvalidated}isStaleByTime(t=0){return void 0===this.state.data||"static"!==t&&(!!this.state.isInvalidated||!(0,i.Kp)(this.state.dataUpdatedAt,t))}onFocus(){this.observers.find(t=>t.shouldFetchOnWindowFocus())?.refetch({cancelRefetch:!1}),this.#c?.continue()}onOnline(){this.observers.find(t=>t.shouldFetchOnReconnect())?.refetch({cancelRefetch:!1}),this.#c?.continue()}addObserver(t){this.observers.includes(t)||(this.observers.push(t),this.clearGcTimeout(),this.#a.notify({type:"observerAdded",query:this,observer:t}))}removeObserver(t){let e=this.observers.indexOf(t);-1!==e&&(this.observers.splice(e,1),this.observers.length||(this.#c&&(this.#d||"paused"===this.state.fetchStatus&&"pending"===this.state.status?this.#c.cancel({revert:!0}):this.#c.cancelRetry()),this.scheduleGc()),this.#a.notify({type:"observerRemoved",query:this,observer:t}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||this.#h({type:"invalidate"})}async fetch(t,e){var r;if("idle"!==this.state.fetchStatus&&this.#c?.status()!=="rejected"){if(void 0!==this.state.data&&e?.cancelRefetch)this.cancel({silent:!0});else if(this.#c)return this.#c.continueRetry(),this.#c.promise}if(t&&this.setOptions(t),!this.options.queryFn){let t=this.observers.find(t=>t.options.queryFn);t&&this.setOptions(t.options)}let n=new AbortController,o=t=>{Object.defineProperty(t,"signal",{enumerable:!0,get:()=>(this.#d=!0,n.signal)})},c=()=>{let t=(0,i.cG)(this.options,e),r=(()=>{let t={client:this.#u,queryKey:this.queryKey,meta:this.meta};return o(t),t})();return(this.#d=!1,this.options.persister)?this.options.persister(t,r,this):t(r)},l=(()=>{let t={fetchOptions:e,options:this.options,queryKey:this.queryKey,client:this.#u,state:this.state,fetchFn:c};return o(t),t})();("infinite"===this.#n?(r=this.options.pages,{onFetch:(t,e)=>{let n=t.options,s=t.fetchOptions?.meta?.fetchMore?.direction,o=t.state.data?.pages||[],c=t.state.data?.pageParams||[],l={pages:[],pageParams:[]},d=0,h=async()=>{let e=!1,h=r=>{(0,i.I4)(r,()=>t.signal,()=>e=!0)},f=(0,i.cG)(t.options,t.fetchOptions),p=async(r,n,s)=>{if(e)return Promise.reject(t.signal.reason);if(null==n&&r.pages.length)return Promise.resolve(r);let o=(()=>{let e={client:t.client,queryKey:t.queryKey,pageParam:n,direction:s?"backward":"forward",meta:t.options.meta};return h(e),e})(),a=await f(o),{maxPages:u}=t.options,c=s?i.Ht:i.VX;return{pages:c(r.pages,a,u),pageParams:c(r.pageParams,n,u)}};if(s&&o.length){let t="backward"===s,e=t?u:a,r={pages:o,pageParams:c};l=await p(r,e(n,r),t)}else{let t=r??o.length;do{let t=0===d?c[0]??n.initialPageParam:a(n,l);if(d>0&&null==t)break;l=await p(l,t),d++}while(d<t)}return l};t.options.persister?t.fetchFn=()=>t.options.persister?.(h,{client:t.client,queryKey:t.queryKey,meta:t.options.meta,signal:t.signal},e):t.fetchFn=h}}):this.options.behavior)?.onFetch(l,this),this.#o=this.state,("idle"===this.state.fetchStatus||this.state.fetchMeta!==l.fetchOptions?.meta)&&this.#h({type:"fetch",meta:l.fetchOptions?.meta});let d=this.#c=(0,s.Mz)({initialPromise:e?.initialPromise,fn:l.fetchFn,onCancel:t=>{t instanceof s.p8&&t.revert&&this.setState({...this.#o,fetchStatus:"idle"}),n.abort()},onFail:(t,e)=>{this.#h({type:"failed",failureCount:t,error:e})},onPause:()=>{this.#h({type:"pause"})},onContinue:()=>{this.#h({type:"continue"})},retry:l.options.retry,retryDelay:l.options.retryDelay,networkMode:l.options.networkMode,canRun:()=>!0});try{let t=await d.start();if(void 0===t)throw Error(`${this.queryHash} data is undefined`);return this.setData(t),this.#a.config.onSuccess?.(t,this),this.#a.config.onSettled?.(t,this.state.error,this),t}catch(t){if(t instanceof s.p8){if(t.silent)return this.#c.promise;if(t.revert){if(void 0===this.state.data)throw t;return this.state.data}}throw this.#h({type:"error",error:t}),this.#a.config.onError?.(t,this),this.#a.config.onSettled?.(this.state.data,t,this),t}finally{this.#c===d&&(this.#c=void 0),this.scheduleGc()}}#h(t){this.state=(e=>{switch(t.type){case"failed":return{...e,fetchFailureCount:t.failureCount,fetchFailureReason:t.error};case"pause":return{...e,fetchStatus:"paused"};case"continue":return{...e,fetchStatus:"fetching"};case"fetch":return{...e,...l(e.data,this.options),fetchMeta:t.meta??null};case"success":let r={...e,...d(t.data,t.dataUpdatedAt),dataUpdateCount:e.dataUpdateCount+1,...!t.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return this.#o=t.manual?r:void 0,r;case"error":let i=t.error;return{...e,error:i,errorUpdateCount:e.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:e.fetchFailureCount+1,fetchFailureReason:i,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...e,isInvalidated:!0};case"setState":return{...e,...t.state}}})(this.state),n.Vr.batch(()=>{this.observers.slice().forEach(t=>{t.onQueryUpdate()}),this.#a.notify({query:this,type:"updated",action:t})})}};function l(t,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:(0,s.Kw)(e.networkMode)?"fetching":"paused",...void 0===t&&{error:null,status:"pending"}}}function d(t,e){return{data:t,dataUpdatedAt:e??Date.now(),error:null,isInvalidated:!1,status:"success"}}function h(t){let e="function"==typeof t.initialData?t.initialData():t.initialData,r=void 0!==e,i=r?"function"==typeof t.initialDataUpdatedAt?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:r?i??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:r?"success":"pending",fetchStatus:"idle"}}},9024:function(t,e,r){r.d(e,{F:function(){return o}});var i=r(3295),n=r(300),s=r(9688),o=class{#f;destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),(0,n.PN)(this.gcTime)&&(this.#f=i.mr.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(t){this.gcTime=Math.max(this.gcTime||0,t??((0,s.s)()?1/0:3e5))}clearGcTimeout(){void 0!==this.#f&&(i.mr.clearTimeout(this.#f),this.#f=void 0)}}},1640:function(t,e,r){r.d(e,{Kw:function(){return u},Mz:function(){return l},p8:function(){return c}});var i=r(300),n=r(9688),s=r(9198),o=r(436);function a(t){return Math.min(1e3*2**t,3e4)}function u(t){return(t??"online")!=="online"||o.N.isOnline()}var c=class extends Error{constructor(t){super("CancelledError"),this.revert=t?.revert,this.silent=t?.silent}};function l(t){let e,r,l,d=!1,h=0,f="pending",p=new Promise((t,e)=>{r=t,l=e});p.catch(i.ZT);let y=()=>"pending"!==f,m=()=>s.j.isFocused()&&("always"===t.networkMode||o.N.isOnline())&&t.canRun(),v=()=>u(t.networkMode)&&t.canRun(),g=t=>{y()||(e?.(),f="resolved",r(t))},b=t=>{y()||(e?.(),f="rejected",l(t))},w=()=>new Promise(r=>{e=t=>{(y()||m())&&r(t)},t.onPause?.()}).then(()=>{e=void 0,y()||t.onContinue?.()}),x=()=>{let e;if(y())return;let r=0===h?t.initialPromise:void 0;try{e=r??t.fn()}catch(t){e=Promise.reject(t)}Promise.resolve(e).then(g).catch(e=>{if(y())return;let r=t.retry??((0,n.s)()?0:3),s=t.retryDelay??a,o="function"==typeof s?s(h,e):s,u=!0===r||"number"==typeof r&&h<r||"function"==typeof r&&r(h,e);if(d||!u){b(e);return}h++,t.onFail?.(h,e),(0,i._v)(o).then(()=>m()?void 0:w()).then(()=>{d?b(e):x()})})};return{promise:p,status:()=>f,cancel:e=>{if(!y()){let r=new c(e);b(r),t.onCancel?.(r)}},continue:()=>(e?.(),p),cancelRetry:()=>{d=!0},continueRetry:()=>{d=!1},canStart:v,start:()=>(v()?x():w().then(x),p)}}},2996:function(t,e,r){r.d(e,{l:function(){return i}});var i=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(t){return this.listeners.add(t),this.onSubscribe(),()=>{this.listeners.delete(t),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}}},3295:function(t,e,r){r.d(e,{Hp:function(){return s},mr:function(){return n}});let i={setTimeout:(t,e)=>setTimeout(t,e),clearTimeout:t=>clearTimeout(t),setInterval:(t,e)=>setInterval(t,e),clearInterval:t=>clearInterval(t)},n=new class{#p=i;#y=!1;setTimeoutProvider(t){this.#p=t}setTimeout(t,e){return this.#p.setTimeout(t,e)}clearTimeout(t){this.#p.clearTimeout(t)}setInterval(t,e){return this.#p.setInterval(t,e)}clearInterval(t){this.#p.clearInterval(t)}};function s(t){setTimeout(t,0)}},300:function(t,e,r){r.d(e,{CN:function(){return C},Ht:function(){return O},I4:function(){return F},Kp:function(){return u},L3:function(){return T},PN:function(){return a},Rm:function(){return h},SE:function(){return o},VS:function(){return m},VX:function(){return S},Wo:function(){return c},X7:function(){return d},Ym:function(){return f},ZT:function(){return s},_v:function(){return w},_x:function(){return l},cG:function(){return E},oE:function(){return x},sk:function(){return n},to:function(){return p}});var i=r(3295);let n="undefined"==typeof window||"Deno"in globalThis;function s(){}function o(t,e){return"function"==typeof t?t(e):t}function a(t){return"number"==typeof t&&t>=0&&t!==1/0}function u(t,e){return Math.max(t+(e||0)-Date.now(),0)}function c(t,e){return"function"==typeof t?t(e):t}function l(t,e){let{type:r="all",exact:i,fetchStatus:n,predicate:s,queryKey:o,stale:a}=t;if(o){if(i){if(e.queryHash!==h(o,e.options))return!1}else if(!p(e.queryKey,o))return!1}if("all"!==r){let t=e.isActive();if("active"===r&&!t||"inactive"===r&&t)return!1}return("boolean"!=typeof a||e.isStale()===a)&&(!n||n===e.state.fetchStatus)&&(!s||!!s(e))}function d(t,e){let{exact:r,status:i,predicate:n,mutationKey:s}=t;if(s){if(!e.options.mutationKey)return!1;if(r){if(f(e.options.mutationKey)!==f(s))return!1}else if(!p(e.options.mutationKey,s))return!1}return(!i||e.state.status===i)&&(!n||!!n(e))}function h(t,e){return(e?.queryKeyHashFn||f)(t)}function f(t){return JSON.stringify(t,(t,e)=>g(e)?Object.keys(e).sort().reduce((t,r)=>(t[r]=e[r],t),{}):e)}function p(t,e){if(t===e)return!0;if(typeof t!=typeof e)return!1;if(t&&e&&"object"==typeof t&&"object"==typeof e){if(Array.isArray(t)&&Array.isArray(e)){for(let r=0;r<e.length;r++)if(!p(t[r],e[r]))return!1;return!0}for(let r of Object.keys(e))if(!p(t[r],e[r]))return!1;return!0}return!1}let y=Object.prototype.hasOwnProperty;function m(t,e){if(!e||Object.keys(t).length!==Object.keys(e).length)return!1;for(let r in t)if(t[r]!==e[r])return!1;return!0}function v(t){return Array.isArray(t)&&t.length===Object.keys(t).length}function g(t){if(!b(t))return!1;let e=t.constructor;if(void 0===e)return!0;let r=e.prototype;return!!(b(r)&&r.hasOwnProperty("isPrototypeOf"))&&Object.getPrototypeOf(t)===Object.prototype}function b(t){return"[object Object]"===Object.prototype.toString.call(t)}function w(t){return new Promise(e=>{i.mr.setTimeout(e,t)})}function x(t,e,r){return"function"==typeof r.structuralSharing?r.structuralSharing(t,e):!1!==r.structuralSharing?function t(e,r,i=0){if(e===r)return e;if(i>500)return r;let n=v(e)&&v(r);if(!n&&!(g(e)&&g(r)))return r;let s=(n?e:Object.keys(e)).length,o=n?r:Object.keys(r),a=o.length,u=n?Array(a):{},c=0;for(let l=0;l<a;l++){let a=n?l:o[l],d=e[a],h=r[a];if(d===h){u[a]=d,(n?l<s:y.call(e,a))&&c++;continue}if(null===d||null===h||"object"!=typeof d||"object"!=typeof h){u[a]=h;continue}let f=t(d,h,i+1);u[a]=f,f===d&&c++}return s===a&&c===s?e:u}(t,e):e}function S(t,e,r=0){let i=[...t,e];return r&&i.length>r?i.slice(1):i}function O(t,e,r=0){let i=[e,...t];return r&&i.length>r?i.slice(0,-1):i}let C=Symbol();function E(t,e){return!t.queryFn&&e?.initialPromise?()=>e.initialPromise:t.queryFn&&t.queryFn!==C?t.queryFn:()=>Promise.reject(Error(`Missing queryFn: '${t.queryHash}'`))}function T(t,e){return"function"==typeof t?t(...e):!!t}function F(t,e,r){let i,n=!1;return Object.defineProperty(t,"signal",{enumerable:!0,get:()=>(i??=e(),n||(n=!0,i.aborted?r():i.addEventListener("abort",r,{once:!0})),i)}),t}},8038:function(t,e,r){r.d(e,{NL:function(){return o},aH:function(){return a}});var i=r(2265),n=r(7437);let s=i.createContext(void 0),o=t=>{let e=i.useContext(s);if(t)return t;if(!e)throw Error("No QueryClient set, use QueryClientProvider to set one");return e},a=({client:t,children:e})=>(i.useEffect(()=>(t.mount(),()=>{t.unmount()}),[t]),(0,n.jsx)(s.Provider,{value:t,children:e}))},5925:function(t,e,r){let i,n;r.r(e),r.d(e,{CheckmarkIcon:function(){return X},ErrorIcon:function(){return V},LoaderIcon:function(){return B},ToastBar:function(){return tu},ToastIcon:function(){return tr},Toaster:function(){return th},default:function(){return tf},resolveValue:function(){return C},toast:function(){return $},useToaster:function(){return H},useToasterStore:function(){return L}});var s,o=r(2265);let a={data:""},u=t=>{if("object"==typeof window){let e=(t?t.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return e.nonce=window.__nonce__,e.parentNode||(t||document.head).appendChild(e),e.firstChild}return t||a},c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,h=(t,e)=>{let r="",i="",n="";for(let s in t){let o=t[s];"@"==s[0]?"i"==s[1]?r=s+" "+o+";":i+="f"==s[1]?h(o,s):s+"{"+h(o,"k"==s[1]?"":e)+"}":"object"==typeof o?i+=h(o,e?e.replace(/([^,])+/g,t=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,e=>/&/.test(e)?e.replace(/&/g,t):t?t+" "+e:e)):s):null!=o&&(s="-"==s[1]?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=h.p?h.p(s,o):s+":"+o+";")}return r+(e&&n?e+"{"+n+"}":n)+i},f={},p=t=>{if("object"==typeof t){let e="";for(let r in t)e+=r+p(t[r]);return e}return t},y=(t,e,r,i,n)=>{var s;let o=p(t),a=f[o]||(f[o]=(t=>{let e=0,r=11;for(;e<t.length;)r=101*r+t.charCodeAt(e++)>>>0;return"go"+r})(o));if(!f[a]){let e=o!==t?t:(t=>{let e,r,i=[{}];for(;e=c.exec(t.replace(l,""));)e[4]?i.shift():e[3]?(r=e[3].replace(d," ").trim(),i.unshift(i[0][r]=i[0][r]||{})):i[0][e[1]]=e[2].replace(d," ").trim();return i[0]})(t);f[a]=h(n?{["@keyframes "+a]:e}:e,r?"":"."+a)}let u=r&&f.g;return r&&(f.g=f[a]),s=f[a],u?e.data=e.data.replace(u,s):-1===e.data.indexOf(s)&&(e.data=i?s+e.data:e.data+s),a},m=(t,e,r)=>t.reduce((t,i,n)=>{let s=e[n];if(s&&s.call){let t=s(r),e=t&&t.props&&t.props.className||/^go/.test(t)&&t;s=e?"."+e:t&&"object"==typeof t?t.props?"":h(t,""):!1===t?"":t}return t+i+(null==s?"":s)},"");function v(t){let e=this||{},r=t.call?t(e.p):t;return y(r.unshift?r.raw?m(r,[].slice.call(arguments,1),e.p):r.reduce((t,r)=>Object.assign(t,r&&r.call?r(e.p):r),{}):r,u(e.target),e.g,e.o,e.k)}v.bind({g:1});let g,b,w,x=v.bind({k:1});function S(t,e){let r=this||{};return function(){let i=arguments;function n(s,o){let a=Object.assign({},s),u=a.className||n.className;r.p=Object.assign({theme:b&&b()},a),r.o=/go\d/.test(u),a.className=v.apply(r,i)+(u?" "+u:""),e&&(a.ref=o);let c=t;return t[0]&&(c=a.as||t,delete a.as),w&&c[0]&&w(a),g(c,a)}return e?e(n):n}}var O=t=>"function"==typeof t,C=(t,e)=>O(t)?t(e):t,E=(i=0,()=>(++i).toString()),T=()=>{if(void 0===n&&"u">typeof window){let t=matchMedia("(prefers-reduced-motion: reduce)");n=!t||t.matches}return n},F="default",P=(t,e)=>{let{toastLimit:r}=t.settings;switch(e.type){case 0:return{...t,toasts:[e.toast,...t.toasts].slice(0,r)};case 1:return{...t,toasts:t.toasts.map(t=>t.id===e.toast.id?{...t,...e.toast}:t)};case 2:let{toast:i}=e;return P(t,{type:t.toasts.find(t=>t.id===i.id)?1:0,toast:i});case 3:let{toastId:n}=e;return{...t,toasts:t.toasts.map(t=>t.id===n||void 0===n?{...t,dismissed:!0,visible:!1}:t)};case 4:return void 0===e.toastId?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(t=>t.id!==e.toastId)};case 5:return{...t,pausedAt:e.time};case 6:let s=e.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(t=>({...t,pauseDuration:t.pauseDuration+s}))}}},k=[],j={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},A={},q=(t,e=F)=>{A[e]=P(A[e]||j,t),k.forEach(([t,r])=>{t===e&&r(A[e])})},I=t=>Object.keys(A).forEach(e=>q(t,e)),D=t=>Object.keys(A).find(e=>A[e].toasts.some(e=>e.id===t)),N=(t=F)=>e=>{q(e,t)},U={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},L=(t={},e=F)=>{let[r,i]=(0,o.useState)(A[e]||j),n=(0,o.useRef)(A[e]);(0,o.useEffect)(()=>(n.current!==A[e]&&i(A[e]),k.push([e,i]),()=>{let t=k.findIndex(([t])=>t===e);t>-1&&k.splice(t,1)}),[e]);let s=r.toasts.map(e=>{var r,i,n;return{...t,...t[e.type],...e,removeDelay:e.removeDelay||(null==(r=t[e.type])?void 0:r.removeDelay)||(null==t?void 0:t.removeDelay),duration:e.duration||(null==(i=t[e.type])?void 0:i.duration)||(null==t?void 0:t.duration)||U[e.type],style:{...t.style,...null==(n=t[e.type])?void 0:n.style,...e.style}}});return{...r,toasts:s}},R=(t,e="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:e,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...r,id:(null==r?void 0:r.id)||E()}),M=t=>(e,r)=>{let i=R(e,t,r);return N(i.toasterId||D(i.id))({type:2,toast:i}),i.id},$=(t,e)=>M("blank")(t,e);$.error=M("error"),$.success=M("success"),$.loading=M("loading"),$.custom=M("custom"),$.dismiss=(t,e)=>{let r={type:3,toastId:t};e?N(e)(r):I(r)},$.dismissAll=t=>$.dismiss(void 0,t),$.remove=(t,e)=>{let r={type:4,toastId:t};e?N(e)(r):I(r)},$.removeAll=t=>$.remove(void 0,t),$.promise=(t,e,r)=>{let i=$.loading(e.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof t&&(t=t()),t.then(t=>{let n=e.success?C(e.success,t):void 0;return n?$.success(n,{id:i,...r,...null==r?void 0:r.success}):$.dismiss(i),t}).catch(t=>{let n=e.error?C(e.error,t):void 0;n?$.error(n,{id:i,...r,...null==r?void 0:r.error}):$.dismiss(i)}),t};var K=1e3,H=(t,e="default")=>{let{toasts:r,pausedAt:i}=L(t,e),n=(0,o.useRef)(new Map).current,s=(0,o.useCallback)((t,e=K)=>{if(n.has(t))return;let r=setTimeout(()=>{n.delete(t),a({type:4,toastId:t})},e);n.set(t,r)},[]);(0,o.useEffect)(()=>{if(i)return;let t=Date.now(),n=r.map(r=>{if(r.duration===1/0)return;let i=(r.duration||0)+r.pauseDuration-(t-r.createdAt);if(i<0){r.visible&&$.dismiss(r.id);return}return setTimeout(()=>$.dismiss(r.id,e),i)});return()=>{n.forEach(t=>t&&clearTimeout(t))}},[r,i,e]);let a=(0,o.useCallback)(N(e),[e]),u=(0,o.useCallback)(()=>{a({type:5,time:Date.now()})},[a]),c=(0,o.useCallback)((t,e)=>{a({type:1,toast:{id:t,height:e}})},[a]),l=(0,o.useCallback)(()=>{i&&a({type:6,time:Date.now()})},[i,a]),d=(0,o.useCallback)((t,e)=>{let{reverseOrder:i=!1,gutter:n=8,defaultPosition:s}=e||{},o=r.filter(e=>(e.position||s)===(t.position||s)&&e.height),a=o.findIndex(e=>e.id===t.id),u=o.filter((t,e)=>e<a&&t.visible).length;return o.filter(t=>t.visible).slice(...i?[u+1]:[0,u]).reduce((t,e)=>t+(e.height||0)+n,0)},[r]);return(0,o.useEffect)(()=>{r.forEach(t=>{if(t.dismissed)s(t.id,t.removeDelay);else{let e=n.get(t.id);e&&(clearTimeout(e),n.delete(t.id))}})},[r,s]),{toasts:r,handlers:{updateHeight:c,startPause:u,endPause:l,calculateOffset:d}}},_=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,z=x`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,G=x`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,V=S("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${_} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${z} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${G} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Z=x`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,B=S("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${Z} 1s linear infinite;
`,Q=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,W=x`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,X=S("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Q} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${W} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Y=S("div")`
  position: absolute;
`,J=S("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,tt=x`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,te=S("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${tt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,tr=({toast:t})=>{let{icon:e,type:r,iconTheme:i}=t;return void 0!==e?"string"==typeof e?o.createElement(te,null,e):e:"blank"===r?null:o.createElement(J,null,o.createElement(B,{...i}),"loading"!==r&&o.createElement(Y,null,"error"===r?o.createElement(V,{...i}):o.createElement(X,{...i})))},ti=t=>`
0% {transform: translate3d(0,${-200*t}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,tn=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*t}%,-1px) scale(.6); opacity:0;}
`,ts=S("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,to=S("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ta=(t,e)=>{let r=t.includes("top")?1:-1,[i,n]=T()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ti(r),tn(r)];return{animation:e?`${x(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${x(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},tu=o.memo(({toast:t,position:e,style:r,children:i})=>{let n=t.height?ta(t.position||e||"top-center",t.visible):{opacity:0},s=o.createElement(tr,{toast:t}),a=o.createElement(to,{...t.ariaProps},C(t.message,t));return o.createElement(ts,{className:t.className,style:{...n,...r,...t.style}},"function"==typeof i?i({icon:s,message:a}):o.createElement(o.Fragment,null,s,a))});s=o.createElement,h.p=void 0,g=s,b=void 0,w=void 0;var tc=({id:t,className:e,style:r,onHeightUpdate:i,children:n})=>{let s=o.useCallback(e=>{if(e){let r=()=>{i(t,e.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(e,{subtree:!0,childList:!0,characterData:!0})}},[t,i]);return o.createElement("div",{ref:s,className:e,style:r},n)},tl=(t,e)=>{let r=t.includes("top"),i=t.includes("center")?{justifyContent:"center"}:t.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:T()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${e*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...i}},td=v`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,th=({reverseOrder:t,position:e="top-center",toastOptions:r,gutter:i,children:n,toasterId:s,containerStyle:a,containerClassName:u})=>{let{toasts:c,handlers:l}=H(r,s);return o.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...a},className:u,onMouseEnter:l.startPause,onMouseLeave:l.endPause},c.map(r=>{let s=r.position||e,a=tl(s,l.calculateOffset(r,{reverseOrder:t,gutter:i,defaultPosition:e}));return o.createElement(tc,{id:r.id,key:r.id,onHeightUpdate:l.updateHeight,className:r.visible?td:"",style:a},"custom"===r.type?C(r.message,r):n?n(r):o.createElement(tu,{toast:r,position:s}))}))},tf=$}}]);