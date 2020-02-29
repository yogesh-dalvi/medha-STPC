const ZoneSchema = {
  zoneName: {
    label: "Zone Name",
    id: "zoneName",
    autoComplete: "Zone Name",
    required: true,
    placeholder: "Zone Name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Zone Name is required"
      }
    }
  },
  stateName: {
    label: "State Name",
    id: "statename",
    autoComplete: "statename",
    required: true,
    placeholder: "State Name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Please select a state"
      }
    }
  }
};
export default ZoneSchema;
