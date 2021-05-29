(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object') {
    console.log('module.exports');
    module.exports = factory();
  } else if(typeof define === 'function' && define.amd) {
    console.log('define');
    define([], factory);
  } else if(typeof exports === 'object') {
    console.log('exports');
    exports["aim"] = factory();
  } else {
    console.log('web');
    // export default factory();
    root["aim"] = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {
  function aim() {
    console.log('aim');
  }
  return aim;
  //
  //
  // const aim = {
  //   ja: 1,
  //   t() {
  //     console.log('t');
  //     // import * as b from './block.js';
  //     // import * as b from './block.js';
  //   }
  // }
  // return aim;
})
//
// const name = 'square';
//
// function draw(ctx, length, x, y, color) {
//   document.body.innerText = 'JA332';
//   // ctx.fillStyle = color;
//   // ctx.fillRect(x, y, length, length);
//   //
//   // return {
//   //   length: length,
//   //   x: x,
//   //   y: y,
//   //   color: color
//   // };
// }
//
// export { name, draw };

// function aim () {
//   console.log('aim');
// }
//
// export {
//   aim as default
// }

function aim() {

}

console.log(typeof window, document, 1, document.currentScript === null, typeof exports, typeof module, typeof define);
// if (typeof document === 'object') {
//   console.log(document.currentScript.getAttribute('type'))
// }


if (typeof window === 'object' && document.currentScript === null) {
  console.log('module');
}
export {
  aim as default
}


// export {
//   aim as default
// }
