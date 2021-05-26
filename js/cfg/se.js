console.debug('Config SE');
$().setconfig({
  components: {
    schemas: {
      Enterprise: {
        allOf: [
          "Item"
        ],
        color: "rgb(255,167,167)"
      },
      Site: {
        allOf: [
          "Item"
        ],
        color: "rgb(255,167,167)"
      },
      Area: {
        allOf: [
          "Item"
        ],
        color: "rgb(255,167,167)"
      },
      ProcessCell: {
        allOf: [
          "Item"
        ],
        color: "rgb(254,120,110)"
      },
      Unit: {
        allOf: [
          "Item"
        ],
        color: "rgb(254,120,110)",
        properties: {
          PID: {
            colname: "PIDKey",
            schema: "pid",
            classID: 4002
          },
          Area: {
            colname: "AreaKey",
            schema: "area",
            classID: 4003
          },
          ProcessObjectType: {
            colname: "ProcessObjectKey",
            classID: 4017
          }
        }
      },
      EquipmentModule: {
        allOf: [
          "Item"
        ],
        color: "rgb(255,192,0)",
        header: [
          [
            "Prefix",
            "Tag",
            "Title",
            "Brand",
            "Product",
            "Model",
            "Type",
            "Serie"
          ],
          [
            "Tagname",
            "Version",
            "Shape",
            "Material"
          ],
          [
            "IPAddress",
            "Port"
          ]
        ],
        properties: {
          Model: {
            legend: "Product",
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
          Brand: {
            filter: 1
          },
          Subject: {
            title: "Subject"
          },
          Summary: {
            title: "Summary"
          },
          Product: {
            title: "Product(vervalt)"
          },
          IPAddress: {
            legend: "Network",
            title: "IP address"
          },
          Port: {
            title: "Port"
          },
          PollInterval: {
            title: "Poll Interval",
            type: "number",
            unit: "ms"
          },
          ReadAddress: {
            legend: "Modbus",
            title: "Read Address"
          },
          ReadLength: {
            title: "Read Length"
          },
          Community: {
            legend: "SNMP",
            title: "Community"
          },
          PID: {
            colname: "PIDKey",
            schema: "pid",
            classID: 4002
          },
          Area: {
            colname: "AreaKey",
            schema: "area",
            classID: 4003
          },
          ProcessObjectType: {
            colname: "ProcessObjectKey",
            classID: 4017
          }
        }
      },
      ControlModule: {
        allOf: [
          "EquipmentModule"
        ],
        color: "rgb(255,192,0)",
        properties: {
          Code: {
            placeholder: "Code",
            filter: 1,
            kop: 2,
            classID: 4004
          }
        }
      },
    }
  },
});
