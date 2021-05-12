(function() {
  const samples = [];
  Aim.extend({
    info: {
      title: 'Samples',
      description: '.',
      termsOfService: 'https://schiphol.aliconnect.nl/terms/',
      contact: {
        email: 'max.van.kampen@alicon.nl',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
      version: '1.0.0',
    },
    config: {
      clients: {
        aim: {
          client_id: 'C52ABA40-11FE-4400-90B9-CEE5BDA2C5AA',
          scope: ['name', 'email', 'mobile'],
          auth: {
            authorizationUrl: 'https://login.aliconnect.nl/api/oauth2',
            tokenUrl: 'https://login.aliconnect.nl/api/oauth2/token',
          },
          websocket: {
            servers: [
              { url: 'wss://aliconnect.nl:444' }
            ]
          }
        }
      },
      css: {
        '.row.top.bar': 'background-color:#1B60DB; color:white;',
      },
      app: {
        nav: {
          items: {
            Home: {
              items: {

              }
            }
          }
        }
      },
    },
    components: {
      schemas: {
        Sample: {
          properties: {
            createDateTime: {
              description: ``,
              format: 'date',
              readOnly: true,
              defaultValue: new Date().toISOString(),
            },
            lastModifiedDateTime: {
              description: ``,
              format: 'datetime',
              defaultValue: new Date().toISOString(),
            },
            startDateTime: {
              description: ``,
              format: 'datetime',
              defaultValue: new Date().toISOString(),
            },
            endDateTime: {
              description: ``,
              format: 'datetime',
              defaultValue: new Date().toISOString(),
            },
            finishDateTime: {
              description: ``,
              format: 'datetime',
              defaultValue: new Date().toISOString(),
            },
            state: {
              description: ``,
              defaultValue: 'run',
              options: {
                run: {
                  color: 'green',
                },
                stop: {
                  color: 'red',
                },
              },
            },
            categoeries: {
              options: {
                run: {
                  color: 'green',
                },
                stop: {
                  color: 'red',
                },
              },
            },
            Text: {
              format: 'text',
            },
            Required: {
              format: 'text',
							required: 'true',
            },
            Email: {
              format: 'email',
            },
            Password: {
              format: 'password',
            },
            Tel: {
              format: 'tel',
            },
            Number: {
              format: 'number',
              min: 5,
							max: 10,
              step: 0.1,
							defaultValue: 3,
            },
            Textarea: {
              format: 'textarea',
            },
            RichText: {
              format: 'richtext',
            },
            Yaml: {
              format: 'yaml',
            },
            Checkbox: {
              format: 'checkbox',
            },
            Radio: {
              format: 'radio',
            },
            Signature: {
              title: 'Freehand draw field',
              description: `
              Voor het maken van schetsen of het plaatsen van een handtekening
              `,
              format: 'draw',
            },
            CamPicture: {
              format: 'cam',
            },
            Location: {
              format: 'location',
            },
            Meter: {
              format: 'meter',
            },
            Address: {
              format: 'address',
            },
            Hidden: {
              format: 'hidden',
            },
            LinkedIn: {
              format: 'linkedin',
            },
            Skype: {
              format: 'skype',
            },
          }
        },
        Folder: {
          properties: {
            state: {
              options: {
                run: {
                  color: 'green',
                },
                stop: {
                  color: 'red',
                },
              }
            },
          }
        },
        Test: {
          properties: {
            state: {
              options: {
                run: {
                  color: 'green',
                },
                stop: {
                  color: 'red',
                },
              }
            },
            categories: {
              options: {
                green: {
                  color: 'green',
                },
                red: {
                  color: 'red',
                },
              }
            },
          }
        }
      }
    },
  }).on({
    async ready() {
      Aim.extend({
        app: {
          nav: {
            items: {
              Schemas: {
                items: Object.fromEntries(Object.entries(Aim.components.schemas).map(entry => [entry[0], { href: `${entry[0]}` } ])),
              }
            }
          }
        }
      });

      Aim.extend({
        app: {
          nav: {
            items: {
              more: {
                className: 'folder', onclick() {
                  const value = Aim(document.body).attr('tv') ^ 1;
                  Aim(document.body).attr('tv', value);
                  // if (value) {
                  //   // Aim.oncancel(selector.close);
                  //   selector.click();
                  // }
                }
              }
            }
          }
        }
      });



      Aim('navtop').navtop();
      Aim.list('listview');
      let i=0;
      console.log(Aim.components.schemas);

      const data =
      { schema: 'Folder', children: [
        { schema: 'Sample', title: 'Samples' },
        { schema: 'Test', },
        { schema: 'Test', title: 'Groep', children: [
          { schema: 'Test', title: 'Een', state: 'run', categories: 'green', endDateTime:'2021-01-13' },
          { schema: 'Test', title: 'Twee', state: 'stop', categories: 'green,red', startDateTime:'2021-01-13' },
          { schema: 'Test', title: 'Drie' },
        ]  },
        { schema: 'Test' },
        { schema: 'Test' },
        { schema: 'Test' },
      ] };
      const item = Aim.Item(data);
      // item.open();
      console.log(item);
      Aim.tree('treeview', item);
      console.log(item);
      Aim('navleft').navleft(Aim.app.nav.items);
      Aim.page('colpage');
    },
  });
})();
