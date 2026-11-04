import { Notification } from "@contentstack/venus-components";
import ConfigScreenUtils from "../../common/utils/ConfigScreenUtils";
import utils from "../../common/utils";
import { Configurations } from "../../common/types";

jest.mock("@contentstack/venus-components", () => ({
  Notification: jest.fn(),
}));

jest.mock("../../root_config/index.tsx", () => ({
  customWholeJson: () => {
    const customJsonOptions: string[] = ["option 1", "option 2"];
    const defaultFeilds: string[] = ["option 1"];
    return {
      customJsonOptions,
      defaultFeilds,
    };
  },
}));

const ConfigScreenObj: Configurations = {
  configField1: {
    type: "textInputField",
    labelText: "DAM URL",
    helpText: "Help: DAM domain URL",
    placeholderText: "Placeholder: Enter Your DAM URL",
    instructionText: "Instruction: Your DAM domain URL",
    inputFieldType: "text",
    saveInConfig: true,
    saveInServerConfig: true,
    isMultiConfig: false,
  },
  selectField1: {
    type: "selectInputField",
    labelText: "DAM Select Input Option 1",
    helpText: "Help: DAM Select Input Option 1",
    placeholderText: "Placeholder: DAM Select Input Option 1",
    instructionText: "Instruction: DAM Select Input Instruction Text",
    options: [
      { label: "option 1", value: "option1" },
      { label: "option 2", value: "option2" },
      { label: "option 3", value: "option3" },
      { label: "option 4", value: "option4" },
      { label: "option 5", value: "option5" },
    ],
    defaultSelectedOption: "option5",
    saveInConfig: true,
    saveInServerConfig: true,
    isMultiConfig: false,
  },
  radioInput1: {
    type: "radioInputField",
    labelText: "DAM Radio Input Option 1",
    helpText: "Help: DAM Radio Input Option 1",
    instructionText: "Instruction: DAM Radio Input Instruction Text",
    options: [
      {
        label: "Single Select",
        value: "SingleSelect",
      },
      {
        label: "Multi Select",
        value: "MultiSelect",
      },
    ],
    defaultSelectedOption: "MultiSelect",
    saveInConfig: true,
    saveInServerConfig: true,
    isMultiConfig: false,
  },
};

describe("mergeObjects", () => {
  it("should merge properties from source to target", () => {
    const target = {
      prop1: "value1",
      prop2: "value2",
    };
    const source = {
      prop3: "value3",
      prop4: "value4",
    };
    const result = ConfigScreenUtils.mergeObjects(target, source);
    expect(result).toEqual({
      prop1: "value1",
      prop2: "value2",
      prop3: "value3",
      prop4: "value4",
    });
  });

  it("should overwrite properties in target with properties from source", () => {
    const target = {
      prop1: "value1",
      prop2: "value2",
    };
    const source = {
      prop2: "newValue",
    };
    const result = ConfigScreenUtils.mergeObjects(target, source);
    expect(result).toEqual({
      prop1: "value1",
      prop2: "newValue",
    });
  });

  it("should recursively merge nested objects", () => {
    const target = {
      prop1: {
        nested1: "value1",
      },
    };
    const source = {
      prop1: {
        nested2: "value2",
      },
    };
    const result = ConfigScreenUtils.mergeObjects(target, source);
    expect(result).toEqual({
      prop1: {
        nested1: "value1",
        nested2: "value2",
      },
    });
  });
});

describe("toastMessage", () => {
  it("should call Notification with the content, type and modal toast props", () => {
    const type = "success";
    const content = { text: "Test message" };
    utils.toastMessage({ type, content });
    expect(Notification).toHaveBeenCalledWith({
      notificationContent: content,
      notifyProps: {
        className: "modal_toast_message",
        hideProgressBar: true,
      },
      type,
    });
  });
});

describe("getOptions", () => {
  it("should return array of objects with label & value", () => {
    const arr = ["opt1", "opt2"];
    const expected = [
      {
        label: "opt1",
        value: "opt1",
        isDisabled: false,
      },
      { label: "opt2", value: "opt2", isDisabled: false },
    ];
    expect(ConfigScreenUtils.getOptions(arr)).toEqual(expected);
  });

  it("should use defaultFeilds array if provided", () => {
    const arr = ["opt1", "opt2"];
    const defaultFields = ["opt1"];
    const expected = [
      { label: "opt1", value: "opt1", isDisabled: true },
      { label: "opt2", value: "opt2", isDisabled: false },
    ];
    expect(ConfigScreenUtils.getOptions(arr, defaultFields)).toEqual(expected);
  });
});

describe("configRootUtils", () => {
  it("turns the key lists into options; default keys start selected and cannot be unselected", () => {
    const result = ConfigScreenUtils.configRootUtils({
      customJsonOptions: ["a", "b"],
      rootConfigDefaultOptions: ["a"],
    });
    expect(result.jsonOptions).toEqual([
      { label: "a", value: "a", isDisabled: true },
      { label: "b", value: "b", isDisabled: false },
    ]);
    expect(result.customJsonConfigObj).toEqual({
      is_custom_json: false,
      dam_keys: [{ label: "a", value: "a", isDisabled: true }],
    });
  });

  it("returns no options when there are no default keys", () => {
    const result = ConfigScreenUtils.configRootUtils({
      customJsonOptions: ["a"],
      rootConfigDefaultOptions: [],
    });
    expect(result.jsonOptions).toEqual([]);
    expect(result.customJsonConfigObj).toEqual({});
  });
});

describe("getSaveConfigOptions", () => {
  it("should return config objects to be saved", () => {
    const configInputFields: Configurations = {
      field1: {
        type: "textInputField",
        labelText: "DAM URL",
        helpText: "Help: DAM domain URL",
        placeholderText: "Placeholder: Enter Your DAM URL",
        instructionText: "Instruction: Your DAM domain URL",
        inputFieldType: "text",
        saveInConfig: true,
        saveInServerConfig: false,
        isMultiConfig: false,
      },
      field2: {
        type: "textInputField",
        labelText: "DAM URL",
        helpText: "Help: DAM domain URL",
        placeholderText: "Placeholder: Enter Your DAM URL",
        instructionText: "Instruction: Your DAM domain URL",
        inputFieldType: "text",
        saveInConfig: false,
        saveInServerConfig: true,
        isMultiConfig: false,
      },
    };
    const expected = {
      saveInConfig: { field1: configInputFields.field1 },
      saveInServerConfig: { field2: configInputFields.field2 },
      isLegacy: true,
    };
    const result = ConfigScreenUtils.getSaveConfigOptions(configInputFields);
    expect(result).toEqual(expected);
  });

  it("is not legacy when a field is a multi-config field", () => {
    const result = ConfigScreenUtils.getSaveConfigOptions({
      apiKey: { ...ConfigScreenObj.configField1, isMultiConfig: true },
    });
    expect(result.isLegacy).toBe(false);
  });
});

describe("getDefaultInputValues", () => {
  it("should return object with saveInConfig and saveInServerConfig properties", () => {
    const result = ConfigScreenUtils.getDefaultInputValues(ConfigScreenObj);
    expect(result).toEqual({
      radioValuesKeys: ["radioInput1", "radioInput1"],
      selectValuesKeys: ["selectField1", "selectField1"],
    });
  });
});

describe("getIntialValueofComponents", () => {
  it("should return initial values from savedData", () => {
    const { radioValuesKeys, selectValuesKeys } =
      ConfigScreenUtils.getDefaultInputValues(ConfigScreenObj);
    expect(
      ConfigScreenUtils.getIntialValueofComponents({
        savedData: {
          selectField1: "option5",
          radioInput1: "MultiSelect",
          textField: "example text",
        },
        radioValuesKeys,
        selectValuesKeys,
        configInputFields: ConfigScreenObj,
      })
    ).toEqual({
      radioValuesObj: {
        radioInput1: {
          label: "Multi Select",
          value: "MultiSelect",
        },
      },
      selectValuesObj: {
        selectField1: {
          label: "option 5",
          value: "option5",
        },
      },
    });
  });
});
