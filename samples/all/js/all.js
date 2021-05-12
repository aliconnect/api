(function() {
  aim().on('load', () => {
    aim().url('samples_all.md').get().then(event => {
      // const content = event.body;
      const content = event.body.replace(/<\!-- sample button -->/gs,'<button>TEST</button>');
      const d = aim('div').md(content);
      const elems = d.elem.getElementsByClassName('code');
      const block = {
        html: '',
        css: '',
        js: '',
      };
      [...elems].forEach(elem => {
        const type = elem.previousElementSibling.innerText.toLowerCase();
        if (type === 'html') {
          block[type] = block[type].includes('<!-- html -->') ? block[type].replace('<!-- html -->', elem.innerText) : elem.innerText;
        } else if (type === 'js') {
          block.html = block.html.replace(/\/\*\* js start \*\*\/.*?\/\*\* js end \*\*\//s, elem.innerText);
        } else if (type === 'css') {
          block.html = block.html.replace(/\/\*\* css start \*\*\/.*?\/\*\* css end \*\*\//s, elem.innerText);
        }

        let html = block.html;
        let css = block.css;
        let js = block.js;
        const div = aim('div');
        div.append(
          div.button = aim('button', '', 'Run').click(event => {
            // console.log(html,css,js);
            const win = window.open('about:blank', 'demo');
            const doc = win.document;
            html = html
            .replace('/** css **/', css)
            .replace('/** js **/', js);
            doc.open();
            doc.write(html);
            doc.close();
          }),
        )
        elem.parentElement.insertBefore(div.elem, elem.nextElementSibling);
        aim(elem).editor();
      })
    })
  })
})();
// JS > PHP CODE
// console.log(content.replace(/(\w+): /gs,'"$1"=> ').replace(/\{/gs,'[').replace(/\}/gs,']').replace(/\)\./gs,')->'));
