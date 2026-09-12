(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[11],{2898:function(e,t,r){"use strict";r.d(t,{Z:function(){return n}});var o=r(2265),s={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),n=(e,t)=>{let r=(0,o.forwardRef)(({color:r="currentColor",size:n=24,strokeWidth:i=2,absoluteStrokeWidth:l,className:c="",children:d,...u},m)=>(0,o.createElement)("svg",{ref:m,...s,width:n,height:n,stroke:r,strokeWidth:l?24*Number(i)/Number(n):i,className:["lucide",`lucide-${a(e)}`,c].join(" "),...u},[...t.map(([e,t])=>(0,o.createElement)(e,t)),...Array.isArray(d)?d:[d]]));return r.displayName=`${e}`,r}},9967:function(e,t,r){Promise.resolve().then(r.bind(r,8643))},8643:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return p}});var o=r(7437),s=r(2265),a=r(4033),n=r(8418),i=r(5925),l=r(1396),c=r.n(l),d=r(2898);/**
 * @license lucide-react v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let u=(0,d.Z)("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]),m=(0,d.Z)("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);function p(){let e=(0,a.useRouter)(),[t,r]=(0,s.useState)(!1),[l,d]=(0,s.useState)(!1),[p,f]=(0,s.useState)({username:"",email:"",password:"",confirmPassword:"",role:"user"}),g=async t=>{if(t.preventDefault(),p.password!==p.confirmPassword){i.default.error("Passwords do not match");return}if(p.password.length<6){i.default.error("Password must be at least 6 characters");return}r(!0);try{let{username:t,email:r,password:o,role:s}=p;await n.O.register({username:t,email:r,password:o,role:s}),i.default.success("Account created successfully!"),e.push("/dashboard")}catch(e){}finally{r(!1)}};return(0,o.jsx)("div",{className:"min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4",children:(0,o.jsxs)("div",{className:"bg-white rounded-2xl shadow-xl w-full max-w-md p-8",children:[(0,o.jsxs)("div",{className:"text-center mb-8",children:[(0,o.jsx)("h1",{className:"text-3xl font-bold text-gray-900",children:"Create Account"}),(0,o.jsx)("p",{className:"text-gray-500 mt-2",children:"Join the Inventory System"})]}),(0,o.jsxs)("form",{onSubmit:g,className:"space-y-5",children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Username *"}),(0,o.jsx)("input",{type:"text",value:p.username,onChange:e=>f({...p,username:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",placeholder:"Choose a username",required:!0,minLength:3})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Email *"}),(0,o.jsx)("input",{type:"email",value:p.email,onChange:e=>f({...p,email:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",placeholder:"Enter your email",required:!0})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Password *"}),(0,o.jsxs)("div",{className:"relative",children:[(0,o.jsx)("input",{type:l?"text":"password",value:p.password,onChange:e=>f({...p,password:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10",placeholder:"Min 6 characters",required:!0,minLength:6}),(0,o.jsx)("button",{type:"button",onClick:()=>d(!l),className:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700",children:l?(0,o.jsx)(u,{className:"w-5 h-5"}):(0,o.jsx)(m,{className:"w-5 h-5"})})]})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Confirm Password *"}),(0,o.jsx)("input",{type:"password",value:p.confirmPassword,onChange:e=>f({...p,confirmPassword:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",placeholder:"Confirm your password",required:!0})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Role"}),(0,o.jsxs)("select",{value:p.role,onChange:e=>f({...p,role:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",children:[(0,o.jsx)("option",{value:"user",children:"User"}),(0,o.jsx)("option",{value:"admin",children:"Admin"})]}),(0,o.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Admin has full access to all features"})]}),(0,o.jsx)("button",{type:"submit",disabled:t,className:"w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:t?"Creating Account...":"Create Account"})]}),(0,o.jsxs)("p",{className:"text-center text-sm text-gray-500 mt-6",children:["Already have an account?"," ",(0,o.jsx)(c(),{href:"/login",className:"text-indigo-600 hover:text-indigo-700 font-medium",children:"Sign in"})]})]})})}},1633:function(e,t,r){"use strict";var o=r(8747);let s="https://misterfyberinventorybackend.onrender.com/api";console.log("\uD83D\uDD17 API URL: ".concat(s)),console.log("\uD83C\uDF0D NODE_ENV: production");let a=o.Z.create({baseURL:s,headers:{"Content-Type":"application/json"},timeout:6e4});a.interceptors.request.use(e=>{var t;{let t=localStorage.getItem("token");t&&(e.headers.Authorization="Bearer ".concat(t))}return console.log("\uD83D\uDCE4 API Request: ".concat(null===(t=e.method)||void 0===t?void 0:t.toUpperCase()," ").concat(e.url)),e},e=>Promise.reject(e)),a.interceptors.response.use(e=>(console.log("\uD83D\uDCE5 API Response: ".concat(e.status," ").concat(e.config.url)),e),e=>{var t,r,o;return console.error("❌ API Error:",(null===(t=e.response)||void 0===t?void 0:t.data)||e.message),(null===(r=e.response)||void 0===r?void 0:r.status)!==401||(localStorage.removeItem("token"),localStorage.removeItem("user"),window.location.pathname.includes("/login")||(window.location.href="/login")),("ECONNABORTED"===e.code||(null===(o=e.message)||void 0===o?void 0:o.includes("timeout"))||!e.response)&&console.warn("⏳ Backend may be cold-starting (Render free tier). Please retry in 30–60 seconds."),Promise.reject(e)}),t.Z=a},8418:function(e,t,r){"use strict";r.d(t,{O:function(){return a}});var o=r(1633);let s=()=>window.localStorage,a={async login(e){try{console.log("Attempting login with:",e.username);let t=await o.Z.post("/auth/login",e);console.log("Login response:",t.data);let{token:r,user:a}=t.data,n=s();return n&&(n.setItem("token",r),n.setItem("user",JSON.stringify(a)),console.log("User saved to localStorage:",a)),{token:r,user:a}}catch(e){var t;throw console.error("Login error:",(null===(t=e.response)||void 0===t?void 0:t.data)||e.message),e}},async register(e){try{let{token:t,user:r}=(await o.Z.post("/auth/register",e)).data,a=s();return a&&(a.setItem("token",t),a.setItem("user",JSON.stringify(r))),{token:t,user:r}}catch(e){var t;throw console.error("Registration error:",(null===(t=e.response)||void 0===t?void 0:t.data)||e.message),e}},logout(){let e=s();e&&(e.removeItem("token"),e.removeItem("user"),console.log("User logged out"))},getCurrentUser(){let e=s();if(!e)return console.log("No localStorage available"),null;let t=e.getItem("user");if(!t)return console.log("No user found in localStorage"),null;try{let e=JSON.parse(t);return console.log("Parsed user:",e),e}catch(e){return console.error("Error parsing user:",e),null}},getToken(){let e=s();return e?e.getItem("token"):null},isAuthenticated(){let e=s();return!!e&&!!e.getItem("token")},isAdmin(){let e=this.getCurrentUser();return(null==e?void 0:e.role)==="admin"}}},5925:function(e,t,r){"use strict";let o,s;r.r(t),r.d(t,{CheckmarkIcon:function(){return K},ErrorIcon:function(){return J},LoaderIcon:function(){return W},ToastBar:function(){return el},ToastIcon:function(){return er},Toaster:function(){return em},default:function(){return ep},resolveValue:function(){return N},toast:function(){return U},useToaster:function(){return q},useToasterStore:function(){return _}});var a,n=r(2265);let i={data:""},l=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i},c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,m=(e,t)=>{let r="",o="",s="";for(let a in e){let n=e[a];"@"==a[0]?"i"==a[1]?r=a+" "+n+";":o+="f"==a[1]?m(n,a):a+"{"+m(n,"k"==a[1]?"":t)+"}":"object"==typeof n?o+=m(n,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):a):null!=n&&(a="-"==a[1]?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=m.p?m.p(a,n):a+":"+n+";")}return r+(t&&s?t+"{"+s+"}":s)+o},p={},f=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+f(e[r]);return t}return e},g=(e,t,r,o,s)=>{var a;let n=f(e),i=p[n]||(p[n]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(n));if(!p[i]){let t=n!==e?e:(e=>{let t,r,o=[{}];for(;t=c.exec(e.replace(d,""));)t[4]?o.shift():t[3]?(r=t[3].replace(u," ").trim(),o.unshift(o[0][r]=o[0][r]||{})):o[0][t[1]]=t[2].replace(u," ").trim();return o[0]})(e);p[i]=m(s?{["@keyframes "+i]:t}:t,r?"":"."+i)}let l=r&&p.g;return r&&(p.g=p[i]),a=p[i],l?t.data=t.data.replace(l,a):-1===t.data.indexOf(a)&&(t.data=o?a+t.data:t.data+a),i},h=(e,t,r)=>e.reduce((e,o,s)=>{let a=t[s];if(a&&a.call){let e=a(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?"."+t:e&&"object"==typeof e?e.props?"":m(e,""):!1===e?"":e}return e+o+(null==a?"":a)},"");function y(e){let t=this||{},r=e.call?e(t.p):e;return g(r.unshift?r.raw?h(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,l(t.target),t.g,t.o,t.k)}y.bind({g:1});let b,x,v,w=y.bind({k:1});function k(e,t){let r=this||{};return function(){let o=arguments;function s(a,n){let i=Object.assign({},a),l=i.className||s.className;r.p=Object.assign({theme:x&&x()},i),r.o=/go\d/.test(l),i.className=y.apply(r,o)+(l?" "+l:""),t&&(i.ref=n);let c=e;return e[0]&&(c=i.as||e,delete i.as),v&&c[0]&&v(i),b(c,i)}return t?t(s):s}}var j=e=>"function"==typeof e,N=(e,t)=>j(e)?e(t):e,E=(o=0,()=>(++o).toString()),C=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},A="default",I=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:o}=t;return I(e,{type:e.toasts.find(e=>e.id===o.id)?1:0,toast:o});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},D=[],O={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},P={},$=(e,t=A)=>{P[t]=I(P[t]||O,e),D.forEach(([e,r])=>{e===t&&r(P[t])})},S=e=>Object.keys(P).forEach(t=>$(e,t)),L=e=>Object.keys(P).find(t=>P[t].toasts.some(t=>t.id===e)),z=(e=A)=>t=>{$(t,e)},T={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},_=(e={},t=A)=>{let[r,o]=(0,n.useState)(P[t]||O),s=(0,n.useRef)(P[t]);(0,n.useEffect)(()=>(s.current!==P[t]&&o(P[t]),D.push([t,o]),()=>{let e=D.findIndex(([e])=>e===t);e>-1&&D.splice(e,1)}),[t]);let a=r.toasts.map(t=>{var r,o,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(o=e[t.type])?void 0:o.duration)||(null==e?void 0:e.duration)||T[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...r,toasts:a}},R=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||E()}),M=e=>(t,r)=>{let o=R(t,e,r);return z(o.toasterId||L(o.id))({type:2,toast:o}),o.id},U=(e,t)=>M("blank")(e,t);U.error=M("error"),U.success=M("success"),U.loading=M("loading"),U.custom=M("custom"),U.dismiss=(e,t)=>{let r={type:3,toastId:e};t?z(t)(r):S(r)},U.dismissAll=e=>U.dismiss(void 0,e),U.remove=(e,t)=>{let r={type:4,toastId:e};t?z(t)(r):S(r)},U.removeAll=e=>U.remove(void 0,e),U.promise=(e,t,r)=>{let o=U.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?N(t.success,e):void 0;return s?U.success(s,{id:o,...r,...null==r?void 0:r.success}):U.dismiss(o),e}).catch(e=>{let s=t.error?N(t.error,e):void 0;s?U.error(s,{id:o,...r,...null==r?void 0:r.error}):U.dismiss(o)}),e};var Z=1e3,q=(e,t="default")=>{let{toasts:r,pausedAt:o}=_(e,t),s=(0,n.useRef)(new Map).current,a=(0,n.useCallback)((e,t=Z)=>{if(s.has(e))return;let r=setTimeout(()=>{s.delete(e),i({type:4,toastId:e})},t);s.set(e,r)},[]);(0,n.useEffect)(()=>{if(o)return;let e=Date.now(),s=r.map(r=>{if(r.duration===1/0)return;let o=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(o<0){r.visible&&U.dismiss(r.id);return}return setTimeout(()=>U.dismiss(r.id,t),o)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[r,o,t]);let i=(0,n.useCallback)(z(t),[t]),l=(0,n.useCallback)(()=>{i({type:5,time:Date.now()})},[i]),c=(0,n.useCallback)((e,t)=>{i({type:1,toast:{id:e,height:t}})},[i]),d=(0,n.useCallback)(()=>{o&&i({type:6,time:Date.now()})},[o,i]),u=(0,n.useCallback)((e,t)=>{let{reverseOrder:o=!1,gutter:s=8,defaultPosition:a}=t||{},n=r.filter(t=>(t.position||a)===(e.position||a)&&t.height),i=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<i&&e.visible).length;return n.filter(e=>e.visible).slice(...o?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[r]);return(0,n.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)a(e.id,e.removeDelay);else{let t=s.get(e.id);t&&(clearTimeout(t),s.delete(e.id))}})},[r,a]),{toasts:r,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}},B=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,F=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,H=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,J=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${B} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${H} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,V=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,W=k("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${V} 1s linear infinite;
`,Y=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,G=w`
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
}`,K=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Y} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${G} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Q=k("div")`
  position: absolute;
`,X=k("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ee=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,et=k("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ee} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,er=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return void 0!==t?"string"==typeof t?n.createElement(et,null,t):t:"blank"===r?null:n.createElement(X,null,n.createElement(W,{...o}),"loading"!==r&&n.createElement(Q,null,"error"===r?n.createElement(J,{...o}):n.createElement(K,{...o})))},eo=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,es=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,ea=k("div")`
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
`,en=k("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ei=(e,t)=>{let r=e.includes("top")?1:-1,[o,s]=C()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[eo(r),es(r)];return{animation:t?`${w(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},el=n.memo(({toast:e,position:t,style:r,children:o})=>{let s=e.height?ei(e.position||t||"top-center",e.visible):{opacity:0},a=n.createElement(er,{toast:e}),i=n.createElement(en,{...e.ariaProps},N(e.message,e));return n.createElement(ea,{className:e.className,style:{...s,...r,...e.style}},"function"==typeof o?o({icon:a,message:i}):n.createElement(n.Fragment,null,a,i))});a=n.createElement,m.p=void 0,b=a,x=void 0,v=void 0;var ec=({id:e,className:t,style:r,onHeightUpdate:o,children:s})=>{let a=n.useCallback(t=>{if(t){let r=()=>{o(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return n.createElement("div",{ref:a,className:t,style:r},s)},ed=(e,t)=>{let r=e.includes("top"),o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:C()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...o}},eu=y`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,em=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:o,children:s,toasterId:a,containerStyle:i,containerClassName:l})=>{let{toasts:c,handlers:d}=q(r,a);return n.createElement("div",{"data-rht-toaster":a||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(r=>{let a=r.position||t,i=ed(a,d.calculateOffset(r,{reverseOrder:e,gutter:o,defaultPosition:t}));return n.createElement(ec,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?eu:"",style:i},"custom"===r.type?N(r.message,r):s?s(r):n.createElement(el,{toast:r,position:a}))}))},ep=U}},function(e){e.O(0,[18,251,971,938,744],function(){return e(e.s=9967)}),_N_E=e.O()}]);