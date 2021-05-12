(function() {
  aim().on('ready', event => {
    aim(document.documentElement).class('app');
    aim(document.body).class('col aim om bg');
    aim('info', { title: 'myApp' });
    aim().css('.row.top.bar', 'background-color:#1B60DB; color:white;');
    aim().navtop();
    aim().main();
    aim().status(['main','http','select','clipboard','source','target','ws','progress']);
    aim().navleft({
      Home: {
        items: {
          Contact: {

          }
        }
      }
    });
    aim('aim').schemas('Contact', {
      properties: {
        FirstName: {
          type: 'text',
        },
        LastName: {
          type: 'text',
        },
      }
    });
    aim('aim').schemas('Verkeerslicht', {
      properties: {
        State: {
          title: "State",
          label: "State",
          format: "radio",
          filter: 1,
          options: {
            run: {
              title: "Run",
              color: "green"
            },
            stop: {
              title: "Stop",
              color: "red"
            }
          }
        },
        CreatedDateTime: {
          type: "datetime",
          format: "hidden"
        },
        LastModifiedDateTime: {
          type: "datetime",
          format: "hidden"
        },
        LastVisitDateTime: {
          type: "datetime",
          format: "hidden"
        },
        StartDateTime: {
          type: "datetime",
          format: "hidden"
        },
        EndDateTime: {
          type: "datetime",
          format: "hidden"
        },
        FinishDateTime: {
          type: "datetime",
          format: "hidden"
        },
        Brand: {
          schema: "Brand",
          label: "Titel",
          title: "Merk",
          filter: 1
        },
        Product: {
          title: "Product",
          filter: 1,
          default: true
        },
        Model: {
          title: "Model",
          filter: 1
        },
        Type: {
          title: "Type",
          filter: 1
        },
        Serie: {
          title: "Serie",
          filter: 1
        },
        Version: {
          title: "Version",
          filter: 1
        },
        Shape: {
          title: "Vorm",
          filter: 1
        },
        Material: {
          title: "Material",
          filter: 1
        },
        Master: {
          title: "Onderdeel van",
          label: "Configuratie",
          schema: "Verkeerslichten"
        },
        Source: {
          title: "Afgeleid van",
          schema: "Verkeerslicht"
        },
        Children: {
          type: "array"
        },
        Message: {
          type: "array"
        },
        _lfv_Verkeerslicht_Verkeersbuis: {
          stereotype: "configuratie_element",
          title: "LFV Verkeerslicht",
          description: "De component Verkeerslicht van van de LFV Verkeerslichten Verkeersbuis voor deze subfunctie.",
          ref: "BSTTI#6446",
          type: "selectitem"
        },
        beschikbaarheid: {
          stereotype: "variabele",
          title: "Beschikbaarheid",
          label: "Variabelen",
          description: "Geeft aan of dit Verkeerslicht beschikbaar is.",
          ref: "BSTTI#9381",
          rules: [
            {
              Conditie: "_lfv_Verkeerslicht.#bestuurbaar = JA && _lfv_Verkeerslicht.#storingen = {}",
              Waarde: "beschikbaar"
            },
            {
              Conditie: "_lfv_Verkeerslicht.#bestuurbaar = nee || _lfv_Verkeerslicht.#storingen[i] = (STORING_ROOD | STORING_GEEL | STORING_GEEL_KNIPPEREN | STORING_GROEN)",
              Waarde: "niet_beschikbaar"
            },
            {
              Conditie: "overige situaties",
              Waarde: "beperkt_beschikbaar"
            }
          ],
          enum: {
            niet_beschikbaar: "Niet beschikbaar",
            beperkt_beschikbaar: "Beperkt beschikbaar",
            beschikbaar: "Beschikbaar"
          },
          format: "radio",
          "get()": "console.debug('sf_Verkeerslicht_Verkeersbuis.beschikbaarheid.get', { lfv_Verkeerslicht_Verkeersbuis_bestuurbaar: this.lfv_Verkeerslicht_Verkeersbuis.bestuurbaar });\nreturn this.lfv_Verkeerslicht_Verkeersbuis.bestuurbaar === JA && this.lfv_Verkeerslicht_Verkeersbuis.storingen.includes() ? beschikbaar : this.lfv_Verkeerslicht_Verkeersbuis.bestuurbaar === nee ||\n    this.lfv_Verkeerslicht_Verkeersbuis.storingen.includes(STORING_ROOD) ||\n    this.lfv_Verkeerslicht_Verkeersbuis.storingen.includes(STORING_GEEL) ||\n    this.lfv_Verkeerslicht_Verkeersbuis.storingen.includes(STORING_GEEL_KNIPPEREN) ||\n    this.lfv_Verkeerslicht_Verkeersbuis.storingen.includes(STORING_GROEN) ? niet_beschikbaar : beperkt_beschikbaar;\n"
        },
        Stand: {
          stereotype: "variabele",
          title: "Actuele stand",
          description: "De huidige stand van dit Verkeerslicht.",
          ref: "BSTTI#6451",
          rules: [
            {
              Conditie: "_lfv_Verkeerslicht.#observeerbaar = JA",
              Waarde: "_lfv_Verkeerslicht.#stand"
            }
          ],
          enum: {
            ROOD: {
              title: "Rood",
              color: "rgb(255,0,0)"
            },
            groen: {
              title: "Groen",
              color: "rgb(0,255,0)"
            },
            GEEL_KNIPPEREN: {
              title: "Geel knipperen",
              color: "rgb(255,255,0)"
            },
            gedoofd: {
              title: "Gedoofd",
              color: "#ccc"
            }
          },
          type: "string",
          format: "radio",
          "get()": "//console.debug(this.lfv_Verkeerslicht);\nreturn this.lfv_Verkeerslicht_Verkeersbuis.observeerbaar === JA ? this.lfv_Verkeerslicht_Verkeersbuis.stand : ;\n"
        },
        doel_actief: {
          stereotype: "variabele",
          title: "Vrijgegeven",
          description: "De variabele geeft aan of het Verkeerslicht gebruikt mag worden. Het Verkeerslicht mag met name niet worden gebruikt, indien de bijbehorende rijstrook is afgekruist door MTM.\n",
          ref: "BSTTI#9371",
          enum: {
            JA: "Ja",
            nee: "Nee"
          }
        },
        actief: {
          stereotype: "variabele",
          title: "Actief",
          description: "De variabele geeft aan of het Verkeerslicht actief is.",
          ref: "BSTTI#16868",
          rules: [
            {
              Conditie: "_lfv_Verkeerslicht.#observeerbaar = JA",
              Waarde: "_lfv_Verkeerslicht.#actief"
            }
          ],
          enum: {
            JA: "Ja",
            nee: "Nee"
          },
          "get()": "return this.lfv_Verkeerslicht_Verkeersbuis.observeerbaar === JA ? this.lfv_Verkeerslicht_Verkeersbuis.actief : ;\n"
        },
        Alarm_NietBestuurbaarWegensStoring: {
          stereotype: "signalering",
          title: "Niet bestuurbaar wegens storing",
          label: "Signaleringen",
          description: "Voor elke LFV en elke component dient een instantie van volgende generieke signalering van het type deelsysteem_alarm te signaleren wanneer deze niet-bestuurbaar is vanwege een storing.",
          ref: "BSTTI#14297",
          rules: [
            {
              Conditie: "_lfv.#bestuurbaar = nee && _lfv.#reden_niet_bestuurbaar[i] = storing"
            }
          ],
          type: "deelsysteem_alarm",
          enum: {
            JA: "Niet bestuurbaar wegens storing",
            nee: ""
          },
          "get()": "return this.lfv_Verkeerslicht_Verkeersbuis.bestuurbaar === nee && this.lfv_Verkeerslicht_Verkeersbuis.reden_niet_bestuurbaar.includes(STORING);\n"
        },
        Storing_Algemeen: {
          stereotype: "signalering",
          title: "Storing algemeen",
          description: "Voor elke LFV en elke component dient een instantie van volgende generieke signalering van het type deelsysteem_storing te signaleren wanneer deze de storing STORING_ALGEMEEN heeft.",
          ref: "BSTTI#16272",
          rules: [
            {
              Conditie: "_lfv.#storingen[i] = STORING_ALGEMEEN"
            }
          ],
          type: "deelsysteem_storing",
          // enum: {
          //   JA: {
          //     title: "Storing algemeen",
          //     color: "red"
          //   },
          //   nee: {
          //     title: "Geen",
          //     color: "#ccc"
          //   }
          // },
          // format: "radio",
          format: "checkbox",
          "get()": "return this.lfv_Verkeerslicht_Verkeersbuis.storingen.includes(STORING_ALGEMEEN);\n"
        },
        Storing_CommunicatieUitgevallen: {
          stereotype: "signalering",
          title: "Storing communicatie uitgevallen",
          description: "Voor elke LFV en elke component dient een instantie van volgende generieke signalering van het type deelsysteem_storing te signaleren wanneer de communicatie tussen LFV-stuurprogramma en de deelinstallatie ter plaatse is uitgevallen (zie BSTTI#3739).",
          ref: "BSTTI#17107",
          rules: [
            {
              Conditie: "_lfv_.#storingen[i] = STORING_COMMUNICATIE_UITGEVALLEN"
            }
          ],
          type: "deelsysteem_storing",
          enum: {
            JA: "Storing communicatie uitgevallen",
            nee: ""
          },
          "get()": "return this.lfv_Verkeerslicht_Verkeersbuis.storingen.includes(STORING_COMMUNICATIE_UITGEVALLEN);\n"
        },
        Beschikbaarheid: {
          stereotype: "signalering",
          title: "Beschikbaarheid",
          description: "Meldt de beschikbaarheid van het Verkeerslicht.,",
          ref: "BSTTI#15630",
          rules: {
            Status: "#beschikbaarheid"
          },
          type: "status_melding",
          enum: {
            niet_beschikbaar: "Niet beschikbaar",
            beschikbaar: "Beschikbaar",
            beperkt_beschikbaar: "Beperkt beschikbaar"
          },
          "get()": "return this.beschikbaarheid;\n"
        },
        Alarm_VerkeerslichtNietBeschikbaar: {
          stereotype: "signalering",
          title: "Verkeerslicht niet beschikbaar",
          description: "Alarm Verkeerslicht (functieniveau onder Functioneel Benodigde Capaciteit)",
          ref: "BSTTI#6462",
          rules: [
            {
              Conditie: "#beschikbaarheid = niet_beschikbaar"
            }
          ],
          type: "deelsysteem_alarm",
          enum: {
            JA: "Verkeerslicht niet beschikbaar",
            nee: ""
          },
          "get()": "return this.beschikbaarheid === niet_beschikbaar;"
        },
        Alarm_VerkeersbuisVerkeerslichtStoringRood: {
          stereotype: "signalering",
          title: "Verkeerslicht storing ROOD",
          description: "Alarm Verkeerslicht storing ROOD",
          ref: "BSTTI#14807",
          rules: [
            {
              Conditie: "_lfv_Verkeerslicht.#storingen[i] = STORING_ROOD"
            }
          ],
          type: "deelsysteem_alarm",
          enum: {
            JA: "Verkeerslicht storing ROOD",
            nee: ""
          },
          "get()": "return this.lfv_Verkeerslicht_Verkeersbuis.storingen.includes(STORING_ROOD);\n"
        },
        Alarm_VerkeersbuisVerkeerslichtStoringGeel: {
          stereotype: "signalering",
          title: "Verkeerslicht storing geel",
          description: "Alarm Verkeerslicht storing geel",
          ref: "BSTTI#14810",
          rules: {
            Conditie: "_lfv_Verkeerslicht.#storingen[i] = STORING_GEEL"
          },
          type: "deelsysteem_alarm",
          enum: {
            JA: "Verkeerslicht storing geel",
            nee: ""
          },
          "get()": "return this.lfv_Verkeerslicht_Verkeersbuis.storingen.includes(STORING_GEEL);\n"
        },
        Alarm_VerkeersbuisVerkeerslichtStoringGeelKnipperen: {
          stereotype: "signalering",
          title: "Verkeerslicht storing geel knipperen",
          description: "Alarm Verkeerslicht storing geel knipperen",
          ref: "BSTTI#14809",
          rules: {
            Conditie: "_lfv_Verkeerslicht.#storingen[i] = STORING_GEEL_KNIPPEREN"
          },
          type: "deelsysteem_alarm",
          enum: {
            JA: "Verkeerslicht storing geel knipperen",
            nee: ""
          },
          "get()": "return this.lfv_Verkeerslicht_Verkeersbuis.storingen.includes(STORING_GEEL_KNIPPEREN);\n"
        }
      }
    });
    aim('aim').schemas('Folder', {
      properties: {
        Title: {
          type: 'text',
        },
      }
    });
    aim().tree(item);
    aim().list();
    aim().view();
  });
})();
