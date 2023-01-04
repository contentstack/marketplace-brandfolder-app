/* Import React modules */
import React from "react";
import {
  Field,
  FieldLabel,
  TextInput,
  Line,
  InstructionText,
  Help,
  Select,
} from "@contentstack/venus-components";
/* Import other node modules */
import utils from "../../common/utils";
import { TypeConfigComponent, TypeOption } from "../../common/types";
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */

// component for Text Input Field
export const TextInputField = function ({
  objKey,
  objValue,
  currentValue,
  updateConfig,
}: TypeConfigComponent) {
  return (
    <>
      <Field>
        <FieldLabel required htmlFor={`${objKey}-id`} data-testid="text_label">
          {" "}
          {/* Change the label caption as per your requirement */}
          {objValue?.labelText}
        </FieldLabel>
        {objValue?.helpText && (
          <Help text={objValue?.helpText} data-testid="text_help" />
        )}
        {/* Change the help caption as per your requirement */}
        <TextInput
          id={`${objKey}-id`}
          required
          value={currentValue}
          placeholder={objValue?.placeholderText}
          name={objKey}
          onChange={updateConfig}
          data-testid="text_input"
        />
        <InstructionText data-testid="text_instruction">
          {objValue?.instructionText}
        </InstructionText>
      </Field>
      <Line type="dashed" />
    </>
  );
};

// component for Radio Options
export const RadioInputField = function ({
  objKey,
  objValue,
  currentValue,
  updateConfig,
}: TypeConfigComponent) {
  return (
    <>
      <Field>
        <FieldLabel
          required
          htmlFor={`${objKey}_options`}
          data-testid="radio_label"
        >
          {objValue?.labelText}
        </FieldLabel>
        {objValue?.helpText && (
          <Help text={objValue?.helpText} data-testid="radio_help" />
        )}
        <div className="Radio-wrapper" data-testid="radio_wrapper">
          {objValue?.options?.map((option: TypeOption, index: number) =>
            utils.getRadioOption(
              objKey,
              option,
              index,
              currentValue,
              updateConfig
            )
          )}
        </div>
        <InstructionText data-testid="radio_instruction">
          {objValue?.instructionText}
        </InstructionText>
      </Field>
      <Line type="dashed" />
    </>
  );
};

// component for Select Options
export const SelectInputField = function ({
  objKey,
  objValue,
  currentValue,
  updateConfig,
}: TypeConfigComponent) {
  return (
    <>
      <Field>
        <FieldLabel
          required
          htmlFor={`${objKey}-id`}
          data-testid="select_label"
        >
          {objValue?.labelText}
        </FieldLabel>
        {objValue?.helpText && (
          <Help text={objValue?.helpText} data-testid="select_help" />
        )}
        <Select
          onChange={(e: TypeOption) => updateConfig(e, objKey)}
          options={objValue?.options}
          placeholder={objValue?.placeholderText}
          value={currentValue}
          name={`${objKey}-id`}
          data-testid="select_input"
        />
        <InstructionText data-testid="select_instruction">
          {objValue?.instructionText}
        </InstructionText>
      </Field>
      <Line type="dashed" />
    </>
  );
};
