import {
  Button,
  ButtonGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@contentstack/venus-components";
import React, { useCallback } from "react";
import localeTexts from "../../common/locale/en-us";
import { Props } from "../../common/types";

const removeHTMLTags = (description: string) =>
  description ? description.toString().replace(/(<([^>]+)>)/gi, " ") : "";

const DeleteModal: React.FC<Props> = function ({
  type,
  remove,
  id,
  name: itemName,
  ...props
}) {
  return (
    <>
      <ModalHeader
        title={localeTexts.DeleteModal.header}
        closeModal={props.closeModal}
      />
      <ModalBody className="deleteModalBody">
        <p>
          {localeTexts.DeleteModal.bodyBeforePlaceholder}
          <b>{removeHTMLTags(itemName)}</b>
          {localeTexts.DeleteModal.bodyAfterPlaceholder}
        </p>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button buttonType="light" onClick={props.closeModal}>
            {localeTexts.DeleteModal.cancelButton}
          </Button>
          <Button
            buttonType="delete"
            icon="RemoveFilled"
            iconProps={{
              size: "mini",
              className: "remove-modal-icon",
            }}
            size="small"
            version="v2"
            onClick={useCallback(() => {
              remove(id);
              props.closeModal();
            }, [id, props])}
          >
            {localeTexts.DeleteModal.confirmButton}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

export default DeleteModal;
