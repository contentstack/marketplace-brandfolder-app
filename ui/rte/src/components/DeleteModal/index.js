import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  ButtonGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@contentstack/venus-components";
import localeTexts from "../../common/locale/en-us";

const removeHTMLTags = (description) =>
  description ? description.toString().replace(/(<([^>]+)>)/gi, " ") : "";

const DeleteModal = function ({ remove, name: itemName, closeModal }) {
  return (
    <>
      <ModalHeader
        title={localeTexts.DeleteModal.header}
        closeModal={closeModal}
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
          <Button buttonType="light" onClick={closeModal}>
            {localeTexts.DeleteModal.cancelButton}
          </Button>
          <Button
            buttonType="delete"
            icon="RemoveFilled"
            iconProps={{
              size: "mini",
              className: "remove-modal-icon",
            }}
            onClick={() => {
              remove();
              closeModal();
            }}
          >
            {localeTexts.DeleteModal.confirmButton}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

export default DeleteModal;

// eslint-disable-next-line
DeleteModal.propTypes = {
  type: PropTypes.string,
  remove: PropTypes.func,
  name: PropTypes.string,
  closeModal: PropTypes.func,
};
