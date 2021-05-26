$().setconfig({
  scope: [
    "name",
    "email"
  ],
  ws: {
    url: "wss://aliconnect.nl:444"
  },
  components: {
    schemas: {
      Item: {
        security: {
          read: [
            {
              aim_auth: [
                "website.read",
                "admin.read"
              ]
            }
          ],
          write: [
            {
              aim_auth: [
                "website.readwrite",
                "admin.readwrite"
              ]
            }
          ]
        },
        header: [
          [
            "Prefix",
            "Tag",
            "Title"
          ],
          [
            "Description"
          ],
          [
            "BodyHTML"
          ]
        ],
        properties: {
          State: {
            legend: "Item",
            title: "State",
            format: "radio",
            filter: 1,
            options: {
              run: {
                title: "Stopping",
                color: "green"
              },
              stopped: {
                title: "Clearing",
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
          Master: {
            filter: true,
            title: "Onderdeel van",
            schema: "*"
          },
          Src: {
            filter: true,
            title: "Kopie van",
            schema: "*"
          },
          Class: {
            filter: true,
            title: "Class",
            schema: "*"
          },
          Children: {
            format: "hidden",
            type: "array"
          },
          Message: {
            format: "hidden",
            type: "array"
          },
          Files: {
            format: "files"
          },
          Prefix: {
            filter: true
          },
          Tag: {
            type: "text"
          },
          Title: {
            type: "text"
          },
          Name: {
            type: "text"
          },
          Tagname: {
            format: "hidden",
            type: "array"
          },
          ID: {
            readOnly: true
          }
        },
        ID: "3688200",
        schema: "Item",
        Master: [
          {
            AttributeName: "Master",
            AttributeID: "3106045",
            ItemID: "3683919",
            HostID: "1",
            UserID: null,
            NameID: 980,
            ClassID: null,
            LinkID: "3688200",
            Value: null,
            CreatedDateTime: "2021-04-01 11:01:13.430",
            LastModifiedDateTime: "2021-04-22 15:49:15.673",
            LastModifiedByID: null,
            Scope: null,
            Data: null,
            schema: null,
            ID: "3688200",
            _ID: "3683919"
          }
        ]
      },
      Folder: {
        allOf: [
          "Item"
        ],
        ID: "3683920",
        schema: "Item",
        Master: [
          {
            AttributeName: "Master",
            AttributeID: "3106044",
            ItemID: "3683920",
            HostID: "1",
            UserID: null,
            NameID: 980,
            ClassID: null,
            LinkID: "3688200",
            Value: null,
            CreatedDateTime: "2021-04-01 11:01:13.393",
            LastModifiedDateTime: "2021-04-22 15:49:15.657",
            LastModifiedByID: null,
            Scope: null,
            Data: null,
            schema: null,
            ID: "3688200",
            _ID: "3683920"
          }
        ],
        Src: [
          {
            AttributeName: "Src",
            AttributeID: "3106066",
            ItemID: "3683920",
            HostID: "1",
            UserID: null,
            NameID: 2173,
            ClassID: null,
            LinkID: null,
            Value: "Item",
            CreatedDateTime: "2021-04-01 11:04:10.630",
            LastModifiedDateTime: "2021-05-18 08:08:52.753",
            LastModifiedByID: null,
            Scope: null,
            Data: null,
            schema: null,
            ID: null,
            _ID: "3683920"
          }
        ]
      },
      Company: {
        allOf: [
          "Enterprise"
        ],
        properties: {
          CompanyName: {
            legend: "Organisatie",
            title: "Organisation",
            default: "Test"
          },
          OfficeLocation: {
            title: "Site"
          },
          Department: {
            title: "Department"
          },
          BusinessPhones0: {
            title: "Telefoon",
            type: "tel"
          },
          BusinessHomePage: {
            title: "Website",
            type: "url"
          },
          EmailAddresses1Address: {
            title: "Business Email",
            type: "email"
          },
          CompanyDescription: {
            title: "Company Description",
            type: "textarea"
          },
          Activiteiten: {
            title: "Company Activity",
            type: "textarea"
          },
          CompanyFax: {
            title: "Company Fax",
            type: "tel",
            hostID: 0
          },
          CompanyEmail: {
            title: "Company Email",
            type: "emailaddress",
            address: {
              type: "email"
            },
            Name: [],
            hostID: 0
          },
          CompanyEmailSales: {
            title: "Company Email Verkoop",
            type: "email"
          },
          CompanyEmailPurchase: {
            title: "Company Email Inkoop",
            type: "email"
          },
          CompanyEmailService: {
            title: "Company Email Service",
            type: "email"
          },
          CompanyEmailInvoice: {
            title: "Company Email Facturen",
            type: "email"
          },
          BusinessAddress: {
            legend: "Address",
            type: "object",
            format: "address",
            location: "geolocatie"
          },
          BusinessAddressStreet: {
            format: "hidden",
            filter: 1
          },
          BusinessAddressNumber: {
            format: "hidden",
            type: "number"
          },
          BusinessAddressAdd: {
            format: "hidden",
            type: "string"
          },
          BusinessAddressPostalCode: {
            format: "hidden",
            filter: 1
          },
          BusinessAddressCity: {
            format: "hidden",
            filter: 1
          },
          BusinessAddressTown: {
            format: "hidden",
            filter: 1
          },
          BusinessAddressState: {
            format: "hidden",
            filter: 1
          },
          BusinessAddressCountry: {
            format: "hidden",
            filter: 1
          }
        },
        ID: "3683922",
        schema: "Item",
        Master: [
          {
            AttributeName: "Master",
            AttributeID: "3106047",
            ItemID: "3683922",
            HostID: "1",
            UserID: null,
            NameID: 980,
            ClassID: null,
            LinkID: "3688200",
            Value: null,
            CreatedDateTime: "2021-04-01 11:01:13.433",
            LastModifiedDateTime: "2021-04-22 15:49:15.670",
            LastModifiedByID: null,
            Scope: null,
            Data: null,
            schema: null,
            ID: "3688200",
            _ID: "3683922"
          }
        ],
        Src: [
          {
            AttributeName: "Src",
            AttributeID: "3106072",
            ItemID: "3683922",
            HostID: "1",
            UserID: null,
            NameID: 2173,
            ClassID: null,
            LinkID: null,
            Value: "Item",
            CreatedDateTime: "2021-04-01 11:04:10.650",
            LastModifiedDateTime: "2021-05-18 08:08:52.760",
            LastModifiedByID: null,
            Scope: null,
            Data: null,
            schema: null,
            ID: null,
            _ID: "3683922"
          }
        ],
        header0: [
          {
            AttributeName: "header0",
            AttributeID: "3113947",
            ItemID: "3683922",
            HostID: "1",
            UserID: null,
            NameID: 2188,
            ClassID: null,
            LinkID: null,
            Value: "Company",
            CreatedDateTime: "2021-04-22 10:46:14.380",
            LastModifiedDateTime: "2021-04-22 12:46:14.380",
            LastModifiedByID: null,
            Scope: null,
            Data: null,
            schema: null,
            ID: null,
            _ID: "3683922"
          }
        ]
      },
      Contact: {
        allOf: [
          "Item"
        ],
        apps: {
          mobile: []
        },
        printmenu: {
          obs: {
            title: "Organisation Breakdown Structure",
            post: {
              flds: "FirstName,LastName"
            }
          }
        },
        header: [
          [
            "GivenName",
            "FirstName",
            "MiddleName",
            "Surname"
          ],
          [
            "Department"
          ],
          [
            "OfficeLocation"
          ]
        ],
        properties: {
          State: {
            type: "radio",
            filter: 1,
            send: 1,
            title: "Functie Status",
            hostID: 1,
            options: {
              offline: {
                title: "Offline",
                color: "rgb(130,130,130)"
              },
              online: {
                title: "Online",
                color: "rgb(50,50,200)"
              },
              focus: {
                title: "Focus",
                color: "rgb(50,50,200)"
              }
            }
          },
          Fav: {
            title: "Fav",
            type: "hidden"
          },
          Initials: {
            legend: "Contactperson",
            title: "Initials"
          },
          GivenName: {
            title: "GivenName"
          },
          FirstName: {
            title: "FirstName"
          },
          MiddleName: {
            title: "MiddleName"
          },
          Surname: {
            title: "Surname"
          },
          Company: {
            legend: "Company",
            title: "Company",
            schema: "Company",
            idname: "masterID"
          },
          CompanyName: {
            title: "CompanyName"
          },
          OfficeLocation: {
            title: "OfficeLocation"
          },
          Department: {
            title: "Afdeling",
            filter: 1,
            schema: "Department"
          },
          Manager: {
            title: "Manager",
            schema: "Contact"
          },
          Assistant: {
            title: "Assistant",
            hostID: 1,
            schema: "Contact"
          },
          JobTitle: {
            legend: "Job",
            title: "JobTitle",
            filter: 1
          },
          StartDateTime: {
            title: "StartDateTime",
            type: "date"
          },
          FinishDateTime: {
            title: "FinishDateTime",
            type: "date"
          },
          Arbeidsrelatie: {
            title: "Contract",
            type: "radio",
            filter: 1,
            options: {
              werknemer: {
                title: "Werknemer",
                color: "rgb(112,48,160)"
              },
              interim: {
                title: "Interim",
                color: "rgb(112,48,160)"
              },
              detachering: {
                title: "Detachering",
                color: "rgb(0,176,240)"
              }
            }
          },
          BusinessPhones0: {
            legend: "Contactgegevens",
            title: "Company Phone",
            type: "tel",
            hostID: 1
          },
          BusinessHomePage: {
            title: "Company Website",
            type: "url",
            hostID: 1
          },
          EmailAddresses1Address: {
            title: "Company Email",
            type: "email",
            hostID: 1
          },
          MobilePhone1: {
            title: "Contact Mobile",
            type: "tel"
          },
          BusinessPhones1: {
            title: "Contact Phone",
            type: "tel"
          },
          EmailAddresses0Address: {
            title: "Contact Email",
            type: "email",
            rights: 3
          },
          BusinessAddress: {
            title: "BusinessAddress",
            type: "address",
            location: true
          },
          OtherAddress: {
            title: "Post adres",
            type: "address"
          },
          EmailAddresses2Address: {
            legend: "Privé contactgegevens",
            title: "EmailAddresses2Address",
            type: "email",
            state: "personal"
          },
          HomePhones0: {
            title: "HomePhones0",
            type: "tel"
          },
          HomePhones1: {
            title: "HomePhones1",
            type: "tel"
          },
          SpouseName: {
            title: "SpouseName"
          },
          Birthday: {
            title: "Birthday",
            type: "date"
          },
          HomeAddress: {
            title: "HomeAddress",
            type: "address"
          },
          AfspraakDatum: {
            legend: "Planning",
            title: "Volgend overleg",
            user: "host",
            type: "date"
          },
          AfspraakTijd: {
            title: "Starttijd",
            user: "host",
            type: "time"
          },
          AfspraakOnderwerp: {
            title: "Onderwerp",
            user: "host",
            type: "textarea"
          },
          ResourceName: {
            legend: "Resource settings",
            title: "Resource name",
            idname: "keyname"
          },
          ResourceType: {
            title: "Resource type"
          },
          ResourceAvail: {
            title: "Beschikbaarheid",
            unit: "FTE"
          },
          ResourcePlan: {
            title: "Planbaar",
            unit: "FTE"
          },
          verlof: {
            title: "Verlof",
            type: "textarea"
          },
          Gebruiker: {
            legend: "Account",
            title: "User",
            class: "account",
            idname: "toID"
          },
          groupID: {
            title: "Usergroup",
            type: "text",
            class: "groups"
          },
          Product: {
            title: "Products",
            type: "array",
            schema: "System"
          },
          Children: {
            type: "array"
          }
        },
        ID: "3683923",
        schema: "Item",
        Master: [
          {
            AttributeName: "Master",
            AttributeID: "3106048",
            ItemID: "3683923",
            HostID: "1",
            UserID: null,
            NameID: 980,
            ClassID: null,
            LinkID: "3688200",
            Value: null,
            CreatedDateTime: "2021-04-01 11:01:13.437",
            LastModifiedDateTime: "2021-04-22 15:49:15.670",
            LastModifiedByID: null,
            Scope: null,
            Data: null,
            schema: null,
            ID: "3688200",
            _ID: "3683923"
          }
        ],
        Src: [
          {
            AttributeName: "Src",
            AttributeID: "3106073",
            ItemID: "3683923",
            HostID: "1",
            UserID: null,
            NameID: 2173,
            ClassID: null,
            LinkID: null,
            Value: "Item",
            CreatedDateTime: "2021-04-01 11:04:10.650",
            LastModifiedDateTime: "2021-05-18 08:08:52.760",
            LastModifiedByID: null,
            Scope: null,
            Data: null,
            schema: null,
            ID: null,
            _ID: "3683923"
          }
        ]
      },
      Webpage: {
        allOf: [
          "Item"
        ],
        header: [
          [
            "Title"
          ],
          [
            "Description"
          ],
          [
            "BodyHTML"
          ]
        ],
        properties: {
          State: {
            legend: "State",
            format: "radio",
            title: "Status",
            options: {
              draft: {
                title: "In ontwikkeling",
                color: "orange"
              },
              concept: {
                title: "Concept",
                color: "yellow"
              },
              published: {
                title: "Zichtbaar",
                color: "green"
              }
            }
          },
          News: {
            title: "Nieuws",
            format: "checkbox"
          },
          IsSelected: {
            title: "Selected",
            format: "checkbox"
          },
          Title: {
            legend: "Content",
            title: "Title",
            type: "string",
            format: "text"
          },
          Description: {
            format: "textarea",
            title: "Inleiding"
          },
          BodyHTML: {
            format: "html",
            title: "Hoofdtekst"
          },
          Keywords: {
            title: "Zoekwoorden"
          },
          Chapter: {
            format: "hidden",
            type: "array",
            schema: "Chapter"
          },
          Webpage: {
            format: "hidden",
            type: "array",
            schema: "Webpage"
          }
        },
        ID: "3683925",
        schema: "Item",
        Master: [
          {
            AttributeName: "Master",
            AttributeID: "3106050",
            ItemID: "3683925",
            HostID: "1",
            UserID: null,
            NameID: 980,
            ClassID: null,
            LinkID: "3688200",
            Value: null,
            CreatedDateTime: "2021-04-01 11:01:13.440",
            LastModifiedDateTime: "2021-04-22 15:49:15.670",
            LastModifiedByID: null,
            Scope: null,
            Data: null,
            schema: null,
            ID: "3688200",
            _ID: "3683925"
          }
        ],
        Src: [
          {
            AttributeName: "Src",
            AttributeID: "3106075",
            ItemID: "3683925",
            HostID: "1",
            UserID: null,
            NameID: 2173,
            ClassID: null,
            LinkID: null,
            Value: "Item",
            CreatedDateTime: "2021-04-01 11:04:10.653",
            LastModifiedDateTime: "2021-05-18 08:08:52.763",
            LastModifiedByID: null,
            Scope: null,
            Data: null,
            schema: null,
            ID: null,
            _ID: "3683925"
          }
        ]
      }
    }
  },
});
